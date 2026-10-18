// Standalone browser validation of the React code users copy for Glass Tilt.
// Does not import Fragmenta components, CSS, router, or application entrypoints.
// Run after npm ci: node scripts/glass-tilt-hydrated.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname, join, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { build } from 'vite';

const require = createRequire(import.meta.url);
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.CHROME_BIN || process.env.CHROMIUM_BIN || 'google-chrome';
const delay = ms => new Promise(r => setTimeout(r, ms));

function definition() {
  const file = join(repo, 'data/animations/glass-tilt.tsx');
  const source = require('node:fs').readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputText)(require, module, module.exports);
  assert.equal(module.exports.glassTilt.id, 'glass-tilt');
  return module.exports.glassTilt;
}

class DevTools {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.index = 0;
    this.pending = new Map();
    this.listeners = [];
    this.ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id) {
        const callback = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (callback) msg.error ? callback.reject(new Error(msg.error.message)) : callback.resolve(msg.result);
      } else if (msg.method) this.listeners.forEach(fn => fn(msg.method, msg.params || {}));
    });
  }
  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((done, fail) => {
      this.ws.addEventListener('open', done, { once: true });
      this.ws.addEventListener('error', fail, { once: true });
    });
  }
  send(method, params = {}) {
    const id = ++this.index;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error('DevTools timeout: ' + method)); }, 15000);
      this.pending.set(id, {
        resolve: value => { clearTimeout(timer); resolve(value); },
        reject: err => { clearTimeout(timer); reject(err); }
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(fn) { this.listeners.push(fn); }
  close() { this.ws.close(); }
}
async function poll(fn, title, timeout = 15000) {
  const limit = Date.now() + timeout;
  let error;
  while (Date.now() < limit) {
    try { const value = await fn(); if (value) return value; }
    catch (e) { error = e; }
    await delay(100);
  }
  throw new Error('Timeout: ' + title + (error ? ': ' + error.message : ''));
}
async function evaluate(page, expression) {
  const r = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('Browser evaluation failed: ' + r.exceptionDetails.text);
  return r.result?.value;
}
async function state(page) {
  return evaluate(page, '(' + function () {
    const card = document.querySelector('.glass-card-example');
    if (!card) return null;
    const bounds = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const surface = document.querySelector('.glass-card-example__surface');
    const glare = document.querySelector('.glass-card-example__glare');
    const probe = document.getElementById('css-probe');
    return {
      mounted: !!document.querySelector('#mount .glass-card-example'),
      label: card.getAttribute('aria-label'),
      role: card.getAttribute('role'),
      content: card.textContent,
      width: style.width,
      animation: style.animationName,
      transition: style.transitionDuration,
      inlineTransform: card.style.transform,
      computedTransform: style.transform,
      inlineAnimation: card.style.animation,
      paused: document.querySelector('.glass-card-example__pause input')?.checked,
      glare: glare?.style.background,
      blur: getComputedStyle(surface).backdropFilter,
      styleCount: document.querySelectorAll('style').length,
      probeAnimation: getComputedStyle(probe).animationName,
      probeTransform: getComputedStyle(probe).transform,
      bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
    };
  }.toString() + ')()');
}
function checkErrors(errors, variant) {
  assert.deepEqual(errors, [], variant + ': browser exception, console error, or asset failure');
}
async function run() {
  const def = definition();
  const variants = {
    default: Object.fromEntries(def.params.map(p => [p.key, p.default])),
    changed: Object.fromEntries(def.params.map(p => [p.key, p.max ?? p.default + 1]))
  };
  const working = await mkdtemp(join(repo, '.glass-tilt-browser-'));
  const profile = await mkdtemp(join(tmpdir(), 'glass-tilt-chrome-'));
  let currentOutput = null;
  let server, browser, control, page;
  try {
    for (const [variant, values] of Object.entries(variants)) {
      const root = join(working, variant);
      await mkdir(root, { recursive: true });
      const jsx = def.generateCode(values);
      assert(jsx.includes('import React') && jsx.includes('export default function GlassCard'));
      assert(!/from ['"].*(?:Fragmenta|data\/|components\/|App)/.test(jsx));
      await writeFile(join(root, 'main.jsx'), jsx + '\nimport { createRoot } from "react-dom/client";\ncreateRoot(document.getElementById("mount")).render(<GlassCard />);\n');
      await writeFile(join(root, 'index.html'),
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="css-probe" class="unrelated-pattern">Unrelated pattern</div><main id="mount"></main><script type="module" src="/main.jsx"></script></body></html>');
      await build({ root, configFile: false, logLevel: 'error', build: { outDir: join(root, 'out'), emptyOutDir: true } });
    }
    server = createServer(async (req, res) => {
      try {
        const requestPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
        const path = resolve(currentOutput, '.' + (requestPath === '/' ? '/index.html' : requestPath));
        if (!path.startsWith(currentOutput + sep)) { res.writeHead(403).end(); return; }
        const bytes = await readFile(path);
        const type = extname(path) === '.js' ? 'text/javascript' : extname(path) === '.css' ? 'text/css' : 'text/html';
        res.writeHead(200, { 'Content-Type': type }).end(bytes);
      } catch { res.writeHead(404).end('not found'); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
      '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
    let browserErrors = '';
    browser.stderr.on('data', data => { browserErrors = (browserErrors + data.toString()).slice(-2000); });
    const devtoolsPort = await poll(async () => {
      if (browser.exitCode !== null) throw new Error('Chrome exited: ' + browserErrors);
      const value = await readFile(join(profile, 'DevToolsActivePort'), 'utf8');
      return value.trim().split('\n');
    }, 'Chrome debugging endpoint', 25000);
    control = new DevTools('ws://127.0.0.1:' + devtoolsPort[0] + devtoolsPort[1]);
    await control.ready();
    const target = await control.send('Target.createTarget', { url: 'about:blank' });
    const targets = await poll(async () => {
      const response = await fetch('http://127.0.0.1:' + devtoolsPort[0] + '/json/list');
      return (await response.json()).find(t => t.id === target.targetId);
    }, 'page target');
    page = new DevTools(targets.webSocketDebuggerUrl);
    await page.ready();
    await Promise.all([page.send('Page.enable'), page.send('Runtime.enable'), page.send('Network.enable'), page.send('Log.enable')]);
    const errors = [];
    page.on((name, params) => {
      if (name === 'Runtime.exceptionThrown') errors.push(params.exceptionDetails.exception?.description || params.exceptionDetails.text);
      if (name === 'Runtime.consoleAPICalled' && params.type === 'error') errors.push('Console.error: ' + params.args.map(a => a.value || a.description || '').join(' '));
      if (name === 'Network.loadingFailed' && !params.canceled && ['Document', 'Script', 'Stylesheet'].includes(params.type)) errors.push('Network failed: ' + params.errorText);
      if (name === 'Network.responseReceived' && params.response.status >= 400 && ['Document', 'Script', 'Stylesheet'].includes(params.type)) errors.push('HTTP ' + params.response.status + ': ' + params.response.url);
    });
    for (const [variant, values] of Object.entries(variants)) {
      errors.length = 0;
      currentOutput = join(working, variant, 'out');
      await page.send('Emulation.setEmulatedMedia', { features: [] });
      await page.send('Emulation.setTouchEmulationEnabled', { enabled: false });
      await page.send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?variant=' + variant });
      const initial = await poll(async () => {
        const v = await state(page);
        return v?.mounted && v.styleCount > 0 && v.content.includes('Glass card') ? v : false;
      }, variant + ' React mount and CSS');
      assert.equal(initial.role, 'img');
      assert(initial.label.includes('glass card'));
      assert.equal(initial.width, '224px', 'standalone CSS must apply');
      assert.equal(initial.animation, 'glass-card-idle', 'idle animation must run');
      assert(initial.blur.includes('blur(' + values.blur + 'px)'), 'blur must reflect generated parameter');
      assert.equal(initial.probeAnimation, 'none', 'CSS must not animate unrelated patterns');
      assert.equal(initial.probeTransform, 'none', 'CSS must not transform unrelated patterns');
      checkErrors(errors, variant);
      const r = initial.bounds;
      const move = async (fx, fy) => page.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved', x: r.x + r.width * fx, y: r.y + r.height * fy, pointerType: 'mouse'
      });
      await move(0.8, 0.3);
      const active = await poll(async () => {
        const v = await state(page);
        return v && v.inlineTransform.includes('rotateX(') && v.inlineTransform.includes('rotateY(') &&
          v.animation === 'none' && v.glare.includes('radial-gradient') ? v : false;
      }, variant + ' pointer tilt and glare');
      assert.notEqual(active.inlineTransform, initial.inlineTransform);
      await move(0.2, 0.7);
      const second = await poll(async () => {
        const v = await state(page);
        return v?.inlineTransform !== active.inlineTransform && v?.glare !== active.glare ? v : false;
      }, variant + ' changing tilt and glare');
      assert(second.glare.includes('radial-gradient'));
      await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      await poll(async () => {
        const v = await state(page);
        return v?.inlineTransform === '' && v?.animation === 'glass-card-idle';
      }, variant + ' pointer leave reset');
      await move(0.8, 0.3);
      await poll(async () => (await state(page))?.inlineTransform.includes('rotateX('), variant + ' tilt before pause');
      await evaluate(page, "document.querySelector('.glass-card-example__pause input').focus()");
      const space = async () => {
        await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
        await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      };
      await space();
      await poll(async () => {
        const v = await state(page);
        return v?.paused && v.animation === 'none' && v.inlineTransform === '';
      }, variant + ' pause resets tilt and idle');
      await move(0.2, 0.7);
      const paused = await state(page);
      assert.equal(paused.inlineTransform, '', 'paused card must ignore pointer tilt');
      assert.equal(paused.animation, 'none', 'paused card must not restart idle motion');
      await space();
      await poll(async () => {
        const v = await state(page);
        return v && !v.paused && v.animation === 'glass-card-idle';
      }, variant + ' resume idle motion');
      await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await move(0.7, 0.4);
      const reduced = await state(page);
      assert.equal(reduced.inlineTransform, '', 'reduced motion must disable pointer tilt');
      assert.equal(reduced.animation, 'none', 'reduced motion must disable idle animation');
      assert.equal(reduced.transition, '0s', 'reduced motion must disable transitions');
      await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      await page.send('Emulation.setEmulatedMedia', { features: [] });
      await page.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
      await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x + r.width / 2, y: r.y + r.height / 2 }] });
      await page.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: r.x + r.width * 0.7, y: r.y + r.height * 0.3 }] });
      await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      const touch = await state(page);
      assert.equal(touch.inlineTransform, '', 'touch must not create hover-only tilt');
      await page.send('Emulation.setTouchEmulationEnabled', { enabled: false });
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      assert.equal((await state(page)).inlineTransform, '', 'keyboard must not trigger hover tilt');
      checkErrors(errors, variant);
      console.log('PASS Glass Tilt standalone hydrated React ' + variant + ': mount, CSS, idle, pointer/glare, leave, keyboard pause/reset/resume, reduced-motion, touch, keyboard, no browser errors');
    }
    console.log('PASS both Glass Tilt variants: no Fragmenta runtime dependencies; other 16 fixtures remain in existing CI');
  } finally {
    page?.close();
    control?.close();
    browser?.kill('SIGTERM');
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(working, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
    await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  }
}
await run();
