import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const chrome = process.env.CHROME_BIN || process.env.CHROMIUM_BIN || 'google-chrome';
const timeout = 15000;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class DevTools {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Set();
    this.ws.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      if (data.id) {
        const pending = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (pending) data.error ? pending.reject(new Error(data.error.message)) : pending.resolve(data.result);
      } else if (data.method) {
        for (const handler of this.handlers) handler(data.method, data.params || {});
      }
    });
  }
  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const guard = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('CDP timeout: ' + method));
      }, timeout);
      this.pending.set(id, {
        resolve: value => { clearTimeout(guard); resolve(value); },
        reject: error => { clearTimeout(guard); reject(error); },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  onEvent(handler) { this.handlers.add(handler); }
  close() { this.ws.close(); }
}

async function poll(fn, description, ms = timeout) {
  const until = Date.now() + ms;
  let lastError;
  while (Date.now() < until) {
    try { const result = await fn(); if (result) return result; }
    catch (error) { lastError = error; }
    await sleep(150);
  }
  throw new Error('Timed out waiting for ' + description + (lastError ? ': ' + lastError.message : ''));
}

const routes = [
  ['/', 'Reusable web'],
  ['/browse', 'All patterns'],
  ['/p/glitch-text', 'Glitch Text'],
  ['/a/glitch-text', 'Glitch Text'],
  ['/p/warm-neo-brutalist-editorial', 'Warm Neo-Brutalist'],
];

await poll(async () => (await fetch(baseUrl)).ok, 'built Vite preview server');
const profile = await mkdtemp(join(tmpdir(), 'fragmenta-browser-smoke-'));
const browser = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
  '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let chromeErrors = '';
browser.stderr.on('data', chunk => { chromeErrors = (chromeErrors + chunk.toString()).slice(-3000); });
browser.on('error', error => { chromeErrors += '\nChromium spawn error: ' + error.message; });
let control;
let page;

try {
  const portFile = join(profile, 'DevToolsActivePort');
  const raw = await poll(async () => {
    if (browser.exitCode !== null) throw new Error('Chrome exited (' + browser.exitCode + '): ' + chromeErrors);
    return await readFile(portFile, 'utf8');
  }, 'Chromium DevTools port', 25000);
  const [port, browserPath] = raw.trim().split('\n');
  control = new DevTools('ws://127.0.0.1:' + port + browserPath);
  await control.ready();
  const { targetId } = await control.send('Target.createTarget', { url: 'about:blank' });
  const target = await poll(async () => {
    const response = await fetch('http://127.0.0.1:' + port + '/json/list');
    return (await response.json()).find(item => item.id === targetId);
  }, 'Chromium page target');
  page = new DevTools(target.webSocketDebuggerUrl);
  await page.ready();
  await Promise.all([page.send('Page.enable'), page.send('Runtime.enable'), page.send('Network.enable')]);

  const requests = new Map();
  const errors = [];
  page.onEvent((method, params) => {
    if (method === 'Network.requestWillBeSent') requests.set(params.requestId, params.request.url);
    if (method === 'Runtime.exceptionThrown') {
      errors.push('Uncaught JavaScript error: ' +
        (params.exceptionDetails.exception?.description || params.exceptionDetails.text));
    }
    if (method === 'Network.loadingFailed' && params.type === 'Script') {
      const url = requests.get(params.requestId) || '';
      if (url.startsWith(baseUrl)) errors.push('JavaScript asset failed: ' + url + ': ' + params.errorText);
    }
    if (method === 'Network.responseReceived' && params.type === 'Script' &&
        params.response.status >= 400 && params.response.url.startsWith(baseUrl)) {
      errors.push('JavaScript HTTP ' + params.response.status + ': ' + params.response.url);
    }
  });

  for (const [index, [route, expected]] of routes.entries()) {
    errors.length = 0;
    const url = baseUrl + '/#' + route;
    if (index === 0) {
      const navigation = await page.send('Page.navigate', { url });
      if (navigation.errorText) throw new Error('Cannot navigate to ' + url + ': ' + navigation.errorText);
    } else {
      // Keep the same document; HashRouter must respond to each hashchange.
      // Avoid downloading the external prototype Tailwind CDN afresh on every route.
      const navigation = await page.send('Runtime.evaluate', {
        expression: 'location.hash = ' + JSON.stringify('#' + route),
        returnByValue: true,
      });
      if (navigation.exceptionDetails) throw new Error('Cannot change route: ' + navigation.exceptionDetails.text);
    }

    await poll(async () => {
      if (errors.length) throw new Error(errors.join('; '));
      const response = await page.send('Runtime.evaluate', {
        expression: "JSON.stringify({hash:location.hash,text:document.querySelector('#root')?.innerText || '',count:document.querySelector('#root')?.children.length || 0})",
        returnByValue: true,
      });
      const state = JSON.parse(response.result?.value || '{}');
      if (state.hash === '#' + route && state.count > 0 && state.text.toLowerCase().includes(expected.toLowerCase())) return true;
      throw new Error('Observed ' + JSON.stringify({
        hash: state.hash, rootChildren: state.count, text: String(state.text || '').slice(0, 280),
      }));
    }, route + " to render '" + expected + "'");
    await sleep(300);
    if (errors.length) throw new Error(route + ': ' + errors.join('; '));
    if (index === 0 && !process.env.SMOKE_BASE_URL) {
      // Build-time Tailwind must preserve the original warm palette and typography.
      const result = await page.send('Runtime.evaluate', {
        expression: `JSON.stringify({
          background: getComputedStyle(document.querySelector('#root .bg-paper')).backgroundColor,
          fontFamily: getComputedStyle(document.querySelector('#root .bg-paper')).fontFamily,
          cssAssets: performance.getEntriesByType('resource').filter(entry => entry.name.includes('/assets/') && entry.name.endsWith('.css')).length,
          tailwindCdn: performance.getEntriesByType('resource').filter(entry => entry.name.includes('cdn.tailwindcss.com')).length
        })`,
        returnByValue: true,
      });
      const style = JSON.parse(result.result?.value || '{}');
      if (style.background !== 'rgb(250, 240, 230)' || !style.fontFamily?.includes('Space Grotesk')
          || style.cssAssets === 0 || style.tailwindCdn !== 0) {
        throw new Error('Build-time Tailwind style contract failed: ' + JSON.stringify(style));
      }
      console.log('PASS build-time Tailwind style contract', style);
    }
    console.log('PASS ' + route + ": React mounted and '" + expected + "' rendered");
  }
} finally {
  page?.close();
  control?.close();
  browser.kill('SIGTERM');
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
