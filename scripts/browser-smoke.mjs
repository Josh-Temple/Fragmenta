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
  ['/', 'つくりたいUIを'],
  ['/tools', '実用ツール'],
  ['/tools/contrast', 'コントラスト比'],
  ['/tools/typography', '日本語の文字を調整'],
  ['/tools/upcoming', '10 tools planned'],
  ['/browse', 'All patterns'],
  ['/p/glitch-text', 'Glitch Text'],
  ['/a/glitch-text', 'Glitch Text'],
  ['/p/warm-neo-brutalist-editorial', 'Warm Neo-Brutalist'],
  ['/search', 'Search'],
  ['/knowledge', 'デザインを、つながりから探す'],
  ['/composition', '構図を比較して学ぶ'],
  ['/composition?id=C-062', '黒い面の連結'],
  ['/composition?q=__fragmenta_no_results_2026__', '該当する項目がありません'],
  ['/knowledge?category=typography', '12件該当'],
  ['/knowledge?q=__fragmenta_no_results_2026__', '一致する企画案はありません'],
  ['/knowledge/idea-visual-history-01', 'アール・ヌーヴォー'],
  ['/knowledge/nonexistent-item', '項目が見つかりません'],
  ['/collections', 'Collections'],
  ['/collections/motion-essentials', 'Motion Essentials'],
  ['/licenses', 'Licensing information'],
  ['/p/fluid-toggle', 'Fluid Toggle'],
  ['/p/morph-fab', 'Morph FAB'],
  ['/p/editorial-split-layout', 'Editorial Split Layout'],
  ['/p/smart-skeleton', 'Smart Skeleton'],
  ['/p/glass-tilt', 'Glass Tilt'],
  ['/guide', 'Explore and assess a UI pattern'],
  ['/p/inline-validation', 'Inline Validation'],
  ['/p/article-table-of-contents', 'Article Table of Contents'],
  ['/p/readable-article', 'Readable Article'],
  ['/p/native-faq', 'Native FAQ'],
  ['/p/pricing-comparison', 'Pricing Comparison'],
  ['/p/release-timeline', 'Release Timeline'],
  ['/p/metric-summary', 'Metric Summary'],
  ['/p/breadcrumb-trail', 'Breadcrumb Trail'],
  ['/p/empty-state', 'Empty State'],
  ['/p/responsive-data-table', 'Responsive Data Table'],
];

await poll(async () => (await fetch(baseUrl)).ok, 'built Vite preview server');

// The built site must serve machine-readable, explicitly unreviewed knowledge exports.
for (const [pathname, marker] of [
  ['/knowledge/ideas.json', '"schemaVersion"'],
  ['/knowledge/composition-guides.json', '"composition-guides"'],
  ['/knowledge/ideas.md', '# Fragmenta'],
  ['/llms.txt', '# Fragmenta'],
]) {
  const response = await fetch(baseUrl + pathname);
  if (!response.ok) throw new Error('Knowledge export HTTP ' + response.status + ': ' + pathname);
  const content = await response.text();
  if (!content.includes(marker)) throw new Error('Knowledge export missing marker: ' + pathname);
  console.log('PASS knowledge export HTTP 200 ' + pathname);
}
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

  // Cross-route responsive matrix. Check the rendered page, not only its HTTP status.
  // Routes cover Home, Browse, Search, Collection index/detail, Licenses,
  // representative pattern details and the legacy /a/:id URL.
  for (const width of [360, 768, 1280]) {
    await page.send('Emulation.setDeviceMetricsOverride', { width, height: 850, deviceScaleFactor: 1, mobile: false });
    for (const [route, expected] of routes) {
      await page.send('Runtime.evaluate', {
        expression: 'location.hash = ' + JSON.stringify('#' + route),
      });
      await poll(async () => {
        const response = await page.send('Runtime.evaluate', {
          expression: "JSON.stringify({hash:location.hash,text:document.querySelector('#root')?.innerText || '',ready:!!document.querySelector('#root')?.children.length,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth})",
          returnByValue: true,
        });
        const state = JSON.parse(response.result?.value || '{}');
        if (!state.ready || state.hash !== '#' + route ||
            !state.text.toLowerCase().includes(expected.toLowerCase())) return false;
        if (state.scrollWidth > state.viewport + 1) {
          throw new Error('Horizontal overflow on ' + route + ' at ' + width + 'px: ' + JSON.stringify(state));
        }
        return true;
      }, route + ' responsive render at ' + width + 'px');
      if (errors.length) throw new Error(route + ': ' + errors.join('; '));
      console.log('PASS responsive ' + width + 'px ' + route);
    }
  }
  await page.send('Emulation.clearDeviceMetricsOverride');


  // New composition route: two diagrams, mobile-friendly select and clipboard feedback.
  await page.send('Runtime.evaluate', { expression: "location.hash = '#/composition?id=C-062'" });
  await poll(async () => {
    const response = await page.send('Runtime.evaluate', {
      expression: "document.querySelector('#composition-title')?.textContent === '黒い面の連結' && document.querySelectorAll('svg[role=img]').length === 2",
      returnByValue: true,
    });
    return response.result?.value;
  }, 'composition comparison diagrams');
  const compositionInteraction = await page.send('Runtime.evaluate', {
    expression: "(async () => {\n      const selector = document.querySelector('#composition-item');\n      if (!selector || selector.options.length !== 24) throw new Error('Composition selector missing 24 items');\n      selector.value = 'C-001';\n      selector.dispatchEvent(new Event('change', { bubbles: true }));\n      await new Promise(resolve => setTimeout(resolve, 150));\n      const selected = document.querySelector('#composition-title')?.textContent;\n      const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '指示文をコピー');\n      if (!button) throw new Error('Composition copy button missing');\n      let copied = '';\n      Object.defineProperty(navigator, 'clipboard', { configurable: true,\n        value: { writeText: async text => { copied = text; } } });\n      button.click();\n      await new Promise(resolve => setTimeout(resolve, 150));\n      const success = [...document.querySelectorAll('[role=status]')].map(x => x.textContent).join(' ');\n      Object.defineProperty(navigator, 'clipboard', { configurable: true,\n        value: { writeText: async () => { throw new Error('Denied'); } } });\n      button.click();\n      await new Promise(resolve => setTimeout(resolve, 150));\n      const denied = [...document.querySelectorAll('[role=status]')].map(x => x.textContent).join(' ');\n      return { selected, copied, success, denied, svgCount: document.querySelectorAll('svg[role=img]').length };\n    })()",
    awaitPromise: true,
    returnByValue: true,
  });
  const compositionResult = compositionInteraction.result?.value;
  if (compositionResult?.selected !== '三分割法' ||
    !compositionResult.copied?.includes('三分割交点') ||
    !compositionResult.success?.includes('コピーしました') ||
    !compositionResult.denied?.includes('コピーできませんでした') ||
    compositionResult.svgCount !== 2) {
    throw new Error('Composition interaction failed: ' + JSON.stringify(compositionResult));
  }
  console.log('PASS composition diagrams, selector, copy success and failure');

  // The knowledge detail heading should receive focus after client-side navigation.
  for (const [route, heading] of [
    ['/knowledge/idea-visual-history-01', 'アール・ヌーヴォー'],
    ['/knowledge/nonexistent-item', '項目が見つかりません'],
  ]) {
    await page.send('Runtime.evaluate', {
      expression: 'location.hash = ' + JSON.stringify('#' + route),
    });
    await poll(async () => {
      const response = await page.send('Runtime.evaluate', {
        expression: 'Boolean(document.activeElement?.matches(\'h1[tabindex="-1"]\') && document.activeElement.textContent?.includes(' + JSON.stringify(heading) + '))',
        returnByValue: true,
      });
      return response.result?.value;
    }, 'Knowledge heading focus ' + route);
    console.log('PASS knowledge heading focus ' + route);
  }

  // Search input must have an explicit accessible name, not placeholder-only text.
  await page.send('Runtime.evaluate', { expression: "location.hash = '#/search'" });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "(()=>{const input=document.querySelector('input#pattern-search');return !!input && [...input.labels].some(label=>label.textContent.trim()==='Search patterns');})()",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'Search field accessible label');
  console.log('PASS Search field explicit accessible label');

  await page.send('Runtime.evaluate', { expression: "location.hash = '#/p/fluid-toggle'" });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "Boolean(document.querySelector('button[role=switch]'))",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'Fluid Toggle for keyboard validation');

  // Native button semantics must respond to keyboard Space and announce switch state.
  await page.send('Runtime.evaluate', { expression: "document.querySelector('button[role=switch]').focus()" });
  const stateBefore = await page.send('Runtime.evaluate', { expression: "document.querySelector('button[role=switch]').getAttribute('aria-checked')", returnByValue: true });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await poll(async () => {
    const response = await page.send('Runtime.evaluate', { expression: "document.querySelector('button[role=switch]').getAttribute('aria-checked')", returnByValue: true });
    return response.result?.value !== stateBefore.result?.value;
  }, 'semantic switch keyboard toggle');
  console.log('PASS switch supports keyboard and aria-checked');

  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const reduced = await page.send('Runtime.evaluate', {
    expression: "getComputedStyle(document.querySelector('button[role=switch]')).transitionDuration",
    returnByValue: true,
  });
  if (reduced.result?.value !== '0s') throw new Error('Reduced-motion switch retains transition: ' + reduced.result?.value);
  console.log('PASS reduced-motion switch transition');
  await page.send('Emulation.setEmulatedMedia', { features: [] });

  await page.send('Runtime.evaluate', { expression: "location.hash = '#/p/glitch-text'" });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "Boolean([...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Code'))",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'code tab control');
  const clipboard = await page.send('Runtime.evaluate', {
    expression: `(async () => {
      const tab = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Code');
      tab.click();
      await new Promise(r => setTimeout(r, 100));
      const copy = document.querySelector('button[title="Copy code"]');
      if (!copy) throw new Error('Copy button missing');
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } });
      copy.click();
      await new Promise(r => setTimeout(r, 100));
      const failed = document.querySelector('[role="status"][aria-label="Copy result"]')?.textContent || '';
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
      copy.click();
      await new Promise(r => setTimeout(r, 100));
      const succeeded = document.querySelector('[role="status"][aria-label="Copy result"]')?.textContent || '';
      return { failed, succeeded };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const states = clipboard.result?.value;
  if (!states?.failed.includes('Copy failed') || !states?.succeeded.includes('Copied to clipboard')) {
    throw new Error('Clipboard states not truthful: ' + JSON.stringify(states));
  }
  console.log('PASS clipboard success and failure states');

  // The reuse guide is product content with real disclosure and copy actions.
  // Verify the copied bytes and failure feedback, not just the button label.
  await page.send('Runtime.evaluate', { expression: "location.hash = '#/guide'" });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "document.querySelector('h1')?.textContent === 'Explore and assess a UI pattern'",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'reuse guide');
  const guideLinks = await page.send('Runtime.evaluate', {
    expression: `(() => ({
      disclosures: document.querySelectorAll('details').length,
      targets: [...document.querySelectorAll('details a')].map(link => link.getAttribute('href')),
      firstClosed: !document.querySelector('details')?.open
    }))()`,
    returnByValue: true,
  });
  const guide = guideLinks.result?.value;
  const currentIds = ['elastic-button', 'smart-skeleton', 'glass-tilt', 'fluid-toggle',
    'glitch-text', 'morph-fab', 'warm-neo-brutalist-editorial', 'editorial-split-layout',
    'inline-validation', 'article-table-of-contents', 'readable-article', 'native-faq',
    'pricing-comparison', 'release-timeline', 'metric-summary', 'breadcrumb-trail',
    'empty-state', 'responsive-data-table'];
  if (guide?.disclosures !== currentIds.length || !guide.firstClosed ||
      currentIds.some(id => !guide.targets?.includes('#/p/' + id))) {
    throw new Error('Reuse guide does not cover the registered patterns: ' + JSON.stringify(guide));
  }
  await page.send('Runtime.evaluate', { expression: "document.querySelector('summary').focus()" });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "document.querySelector('details').open",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'guide disclosure keyboard activation');
  console.log('PASS reuse guide: eighteen linked patterns and keyboard disclosure');

  const guideCopy = await page.send('Runtime.evaluate', {
    expression: `(async () => {
      const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Copy reduced-motion example'));
      const code = document.querySelector('pre code')?.textContent;
      if (!button || !code) throw new Error('Guide copy action missing');
      let copied;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { copied = text; } } });
      button.click();
      await new Promise(r => setTimeout(r, 100));
      const success = document.querySelector('[role=status]')?.textContent;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } });
      button.click();
      await new Promise(r => setTimeout(r, 100));
      const denied = document.querySelector('[role=status]')?.textContent;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      button.click();
      await new Promise(r => setTimeout(r, 100));
      const unavailable = document.querySelector('[role=status]')?.textContent;
      return { exact: copied === code, success, denied, unavailable };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const copy = guideCopy.result?.value;
  if (!copy?.exact || !copy.success?.includes('Example copied') ||
      !copy.denied?.includes('Copy failed') || !copy.unavailable?.includes('Copy failed')) {
    throw new Error('Guide clipboard behavior failed: ' + JSON.stringify(copy));
  }
  console.log('PASS reuse guide copied bytes, success, denial, and unavailable clipboard');

  // A link near the end of a long guide must open the destination preview,
  // rather than carry the guide's scroll offset into Details.
  await page.send('Runtime.evaluate', {
    expression: "[...document.querySelectorAll('summary')].find(s => s.textContent.includes('Warm Neo-Brutalist Editorial')).focus()",
  });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "document.querySelector('a[href=\"#/p/warm-neo-brutalist-editorial\"]').closest('details').open",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'editorial guide disclosure');
  const guideScroll = await page.send('Runtime.evaluate', {
    expression: "(() => { const link = document.querySelector('a[href=\"#/p/warm-neo-brutalist-editorial\"]'); link.scrollIntoView(); link.focus(); return scrollY; })()",
    returnByValue: true,
  });
  if (!(guideScroll.result?.value > 100)) throw new Error('Guide navigation fixture was not scrolled');
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "location.hash === '#/p/warm-neo-brutalist-editorial' && document.querySelector('h1')?.textContent === 'Warm Neo-Brutalist Editorial' && scrollY <= 1",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'guide link opens top of Details');
  await page.send('Runtime.evaluate', {
    expression: "document.querySelector('a[href=\"#/guide\"]').focus()",
  });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "location.hash === '#/guide' && document.querySelector('h1')?.textContent === 'Explore and assess a UI pattern' && scrollY <= 1",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'Details link opens top of Guide');
  console.log('PASS keyboard Guide-to-Details-to-Guide navigation resets scroll');


  // A changed parameter must reach both outputs users copy.
  await page.send('Runtime.evaluate', { expression: "location.hash = '#/p/glitch-text'" });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "Boolean(document.querySelector('input[type=range]'))",
      returnByValue: true,
    });
    return result.result?.value;
  }, 'parameter control for copy parity');
  const originalValue = await page.send('Runtime.evaluate', {
    expression: "document.querySelector('input[type=range]').value",
    returnByValue: true,
  });
  await page.send('Runtime.evaluate', { expression: "document.querySelector('input[type=range]').focus()" });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await poll(async () => {
    const result = await page.send('Runtime.evaluate', {
      expression: "document.querySelector('input[type=range]').value",
      returnByValue: true,
    });
    return result.result?.value !== originalValue.result?.value;
  }, 'keyboard parameter change');
  const parity = await page.send('Runtime.evaluate', {
    expression: `(async () => {
      const value = document.querySelector('input[type=range]').value;
      let copied;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { copied = text; } } });
      const buttons = () => [...document.querySelectorAll('button')];
      buttons().find(b => b.textContent.trim() === 'Code').click();
      await new Promise(r => setTimeout(r, 100));
      const code = document.querySelector('pre').textContent;
      document.querySelector('button[title="Copy code"]').click();
      await new Promise(r => setTimeout(r, 100));
      const codeMatches = copied === code && code.includes(value + 'px');
      buttons().find(b => b.textContent.trim() === 'AI prompt').click();
      await new Promise(r => setTimeout(r, 100));
      const prompt = document.querySelector('p.whitespace-pre-wrap').textContent;
      document.querySelector('button[title="Copy AI prompt"]').click();
      await new Promise(r => setTimeout(r, 100));
      return { value, codeMatches, promptMatches: copied === prompt && prompt.includes(value + 'px') };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (!parity.result?.value?.codeMatches || !parity.result?.value?.promptMatches) {
    throw new Error('Changed parameter and copied output disagree: ' + JSON.stringify(parity.result?.value));
  }
  console.log('PASS keyboard parameter change reaches copied code and AI prompt');

  for (const id of ['smart-skeleton', 'glitch-text', 'glass-tilt']) {
    const title = { 'smart-skeleton': 'Smart Skeleton', 'glitch-text': 'Glitch Text', 'glass-tilt': 'Glass Tilt' }[id];
    await page.send('Runtime.evaluate', { expression: "location.hash = '#/p/" + id + "'" });
    await poll(async () => {
      const r = await page.send('Runtime.evaluate', {
        expression: "location.hash === '#/p/" + id + "' && document.querySelector('h1')?.textContent.trim() === " + JSON.stringify(title) + " && [...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Pause preview motion' && b.getAttribute('aria-pressed') === 'false')",
        returnByValue: true,
      });
      return r.result?.value;
    }, id + ' motion control');
    await page.send('Runtime.evaluate', { expression: "[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Pause preview motion').focus()" });
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    const selectors = { 'smart-skeleton': '[style*="--speed"]', 'glitch-text': '[aria-label="GLITCH"] [aria-hidden]', 'glass-tilt': '.fragmenta-glass-preview' };
    await poll(async () => {
      const r = await page.send('Runtime.evaluate', {
        expression: `(() => { const nodes = [...document.querySelectorAll(${JSON.stringify(selectors[id])})];
          return nodes.length > 0 && nodes.every(n => ${id === 'glass-tilt' ? "getComputedStyle(n).animationName === 'none'" : "getComputedStyle(n).animationPlayState === 'paused'"}) &&
            document.querySelector('button[aria-pressed="true"]')?.textContent.trim() === 'Pause preview motion'; })()`,
        returnByValue: true,
      });
      return r.result?.value;
    }, id + ' preview paused');
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await poll(async () => {
      const r = await page.send('Runtime.evaluate', {
        expression: "[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Pause preview motion' && b.getAttribute('aria-pressed') === 'false')",
        returnByValue: true,
      });
      return r.result?.value;
    }, id + ' preview resumed');
    console.log('PASS keyboard pause/resume in Details ' + id);
  }

  // Fixture files are generated by Actions after the Vite build; Vercel's
  // normal app build does not publish this test directory. An external-origin
  // run verifies the delivered app rather than requesting absent CI fixtures.
  if (!process.env.SMOKE_BASE_URL) {
  // Load the generated artifacts as standalone HTML files, not inside the
  // Fragmenta Preview component. React JSX is compiled and server-rendered
  // by the fixture builder; browser checks here cover the exported markup/CSS.
  const fixtureIds = [
    'elastic-button', 'smart-skeleton', 'glass-tilt', 'fluid-toggle',
    'glitch-text', 'morph-fab', 'warm-neo-brutalist-editorial', 'editorial-split-layout'
  ];
  for (const id of fixtureIds) {
    for (const variant of ['default', 'changed']) {
      errors.length = 0;
      const url = baseUrl + '/pattern-fixtures/' + id + '-' + variant + '.html';
      const navigation = await page.send('Page.navigate', { url });
      if (navigation.errorText) throw new Error('Cannot load standalone fixture ' + url + ': ' + navigation.errorText);
      await poll(async () => {
        const result = await page.send('Runtime.evaluate', {
          expression: "JSON.stringify({url:location.pathname, complete:document.readyState==='complete', count:document.querySelector('#artifact-fixture')?.children.length||0, styles:document.querySelectorAll('style').length})",
          returnByValue: true,
        });
        const observed = JSON.parse(result.result?.value || '{}');
        if (observed.url !== '/pattern-fixtures/' + id + '-' + variant + '.html' || !observed.complete) return false;
        if (observed.count === 0 || observed.styles === 0) throw new Error('Fixture missing HTML/CSS: ' + JSON.stringify(observed));
        return true;
      }, 'standalone fixture ' + id + '/' + variant);
      if (errors.length) throw new Error('Standalone fixture JS error: ' + errors.join('; '));
      if (id === 'fluid-toggle') {
        const r = await page.send('Runtime.evaluate', {
          expression: "(()=>{const checkbox=document.querySelector('input[type=checkbox]'); if(!checkbox) return false; checkbox.click(); return checkbox.checked===true;})()",
          returnByValue: true,
        });
        if (!r.result?.value) throw new Error('Standalone toggle did not toggle checked state');
      }
      if (id === 'morph-fab') {
        const r = await page.send('Runtime.evaluate', {
          expression: "(()=>{const b=document.querySelector('button.morph-fab'); if(!b)return false;b.click();return b.getAttribute('aria-expanded')==='true';})()",
          returnByValue: true,
        });
        if (!r.result?.value) throw new Error('Standalone Morph FAB did not expand');
      }
      console.log('PASS standalone fixture in Chromium ' + id + ' / ' + variant);
    }
  }

  for (const id of ['smart-skeleton', 'glitch-text']) {
    for (const variant of ['default', 'changed']) {
      await page.send('Emulation.setEmulatedMedia', { features: [] });
      const path = '/pattern-fixtures/' + id + '-' + variant + '-pair.html';
      await page.send('Page.navigate', { url: baseUrl + path });
      await poll(async () => {
        const r = await page.send('Runtime.evaluate', { expression: "location.pathname === " + JSON.stringify(path) + " && document.querySelectorAll('input[type=checkbox]').length === 2", returnByValue: true });
        return r.result?.value;
      }, id + ' paired standalone output');
      await page.send('Runtime.evaluate', { expression: "document.querySelector('input[type=checkbox]').focus()" });
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      const observed = await page.send('Runtime.evaluate', {
        expression: `(() => {
          const roots = [...document.querySelectorAll(${JSON.stringify(id === 'smart-skeleton' ? '.skeleton-demo' : '.glitch-example')})];
          const states = roots.map(root => ${id === 'smart-skeleton'
            ? "[...root.querySelectorAll('.skeleton-example__avatar, .skeleton-example__line')].map(n => getComputedStyle(n, '::after').animationPlayState)"
            : "['::before', '::after'].map(p => getComputedStyle(root.querySelector('.glitch-text'), p).animationPlayState)"});
          return {checked: roots.map(r => r.querySelector('input').checked), states};
        })()`, returnByValue: true,
      });
      const pair = observed.result?.value;
      if (!pair?.checked[0] || pair.checked[1] || !pair.states[0].every(s => s === 'paused') || !pair.states[1].every(s => s === 'running')) {
        throw new Error('Pause is not independent for ' + id + ': ' + JSON.stringify(pair));
      }
      await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      const reduced = await page.send('Runtime.evaluate', {
        expression: `(() => {
          const nodes = [...document.querySelectorAll(${JSON.stringify(id === 'smart-skeleton' ? '.skeleton-example__avatar, .skeleton-example__line' : '.glitch-text')})];
          return nodes.every(n => ${id === 'smart-skeleton' ? "getComputedStyle(n, '::after').animationName === 'none'" : "getComputedStyle(n, '::before').animationName === 'none' && getComputedStyle(n, '::after').animationName === 'none'"});
        })()`, returnByValue: true,
      });
      if (!reduced.result?.value) throw new Error('Reduced motion did not stop ' + id);
      console.log('PASS paired standalone keyboard pause and reduced motion ' + id + ' / ' + variant);
    }
  }
  await page.send('Emulation.setEmulatedMedia', { features: [] });

  for (const id of ['warm-neo-brutalist-editorial', 'editorial-split-layout']) {
    for (const width of [360, 768]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      const path = '/pattern-fixtures/' + id + '-host.html';
      await page.send('Page.navigate', { url: baseUrl + path });
      await poll(async () => {
        const r = await page.send('Runtime.evaluate', { expression: "location.pathname === " + JSON.stringify(path) + " && document.readyState === 'complete' && document.querySelectorAll('[lang=ja]').length === 2", returnByValue: true });
        return r.result?.value;
      }, id + ' host fixture');
      const result = await page.send('Runtime.evaluate', {
        expression: `(() => {
          const roots = [...document.querySelectorAll(${JSON.stringify(id === 'warm-neo-brutalist-editorial' ? '.editorial-card' : '.editorial-split')})];
          return { overflow: document.documentElement.scrollWidth > innerWidth + 1,
            metaFont: getComputedStyle(document.querySelector('.host-probe .meta')).fontFamily,
            badgeFont: getComputedStyle(document.querySelector('.host-probe .badge')).fontFamily,
            badgeBackground: getComputedStyle(document.querySelector('.host-probe .badge')).backgroundColor,
            instances: roots.map(root => { const s = getComputedStyle(root); return {radius:s.borderRadius, border:s.borderTopWidth,
              shadow:s.boxShadow, rail:s.getPropertyValue('--rail-width').trim(), columns:s.gridTemplateColumns}; })};
        })()`, returnByValue: true,
      });
      const host = result.result?.value;
      if (!host || host.overflow || host.metaFont !== 'serif' || host.badgeFont !== 'serif' || host.badgeBackground !== 'rgba(0, 0, 0, 0)') {
        throw new Error('Host styles or wrapping changed: ' + JSON.stringify(host));
      }
      if (id === 'warm-neo-brutalist-editorial') {
        const [first, second] = host.instances;
        const shadowNumbers = first.shadow.replace(/rgba?\([^)]*\)/g, '').match(/-?[\d.]+px/g) || [];
        if (first.radius !== '22px' || second.radius !== '32px' || first.border !== '3px' || second.border !== '5px' ||
            (first.shadow !== 'none' && (!shadowNumbers.length || shadowNumbers.some(n => parseFloat(n) !== 0)))) {
          throw new Error('Warm Editorial instance parameters or zero shadow failed: ' + JSON.stringify(host));
        }
      } else if (host.instances[0].rail !== '34%' || host.instances[1].rail !== '44%' ||
          host.instances.some(instance => instance.columns.split(' ').length !== (width <= 640 ? 1 : 2))) {
        throw new Error('Editorial Split instance parameters or responsive layout failed: ' + JSON.stringify(host));
      }
      console.log('PASS bilingual standalone host isolation and independent parameters ' + id + ' / ' + width + 'px');
    }
  }

  } else {
    console.log('SKIP standalone CI fixtures on external origin; deployed app checks ran above');
  }
} finally {
  page?.close();
  control?.close();
  browser.kill('SIGTERM');
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

