/* Independent generated-artifact verification, outside Fragmenta's React Preview. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript-legacy');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const repo = path.resolve(__dirname, '..');
const files = [
  'data/animations/elastic-button.tsx',
  'data/animations/smart-skeleton.tsx',
  'data/animations/glass-tilt.tsx',
  'data/animations/fluid-toggle.tsx',
  'data/animations/glitch-text.tsx',
  'data/animations/morph-fab.tsx',
  'data/patterns/warm-neo-brutalist-editorial.tsx',
  'data/patterns/editorial-split-layout.tsx',
];
const cache = new Map();
const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
  jsx: ts.JsxEmit.ReactJSX,
  esModuleInterop: true,
};
function loadTsx(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, { fileName: file, compilerOptions, reportDiagnostics: true });
  const errors = compiled.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, file + ': transpilation diagnostics');
  const localRequire = requested => requested.startsWith('.')
    ? loadTsx(path.resolve(path.dirname(file), requested + (path.extname(requested) ? '' : '.tsx')))
    : require(requested);
  new Function('require', 'exports', 'module', compiled.outputText)(localRequire, module.exports, module);
  return module.exports;
}
const fixtureDir = path.join(repo, 'dist', 'pattern-fixtures');
fs.mkdirSync(fixtureDir, { recursive: true });
const ids = new Set();
for (const file of files) {
  const exports = loadTsx(path.join(repo, file));
  const def = Object.values(exports).find(v => v && typeof v === 'object' && 'generateCode' in v);
  assert(def, file + ': no pattern definition');
  assert(!ids.has(def.id), 'duplicate pattern id: ' + def.id);
  ids.add(def.id);
  const initial = Object.fromEntries(def.params.map(p => [p.key, p.default]));
  const changed = Object.fromEntries(def.params.map(p => [p.key, p.max ?? p.default + 1]));
  for (const [variant, values] of [['default', initial], ['changed', changed]]) {
    const code = def.generateCode(values);
    let markup = code;
    assert.equal(typeof code, 'string', def.id + ' code type');
    assert(code.length > 100, def.id + ' code unexpectedly short');
    assert(!/\bNaN\b|undefined(?:px|deg|s|%)/.test(code), def.id + ' invalid interpolated values');
    if (code.includes('import React')) {
      const generated = ts.transpileModule(code, {
        fileName: def.id + '.jsx', compilerOptions, reportDiagnostics: true,
      });
      const diagnostics = generated.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
      assert.equal(diagnostics.length, 0, def.id + ' standalone JSX syntax error');
      const component = { exports: {} };
      new Function('require', 'exports', 'module', generated.outputText)(require, component.exports, component);
      assert.equal(typeof component.exports.default, 'function', def.id + ' missing React export');
      const html = ReactDOMServer.renderToStaticMarkup(React.createElement(component.exports.default));
      markup = html;
      assert(html.includes('glass-card-example'), def.id + ' missing rendered content');
    } else {
      assert(code.includes('<style>') && code.includes('</style>'), def.id + ' missing standalone CSS');
      assert(/<(?:button|span|div|section|article|label)\b/.test(code), def.id + ' missing HTML');
      if (code.includes('<script>')) {
        const scripts = [...code.matchAll(/<script>([\s\S]*?)<\/script>/g)];
        assert(scripts.length, def.id + ' script content missing');
        for (const script of scripts) {
          const listeners = [];
          const attributes = { 'aria-expanded': 'false' };
          const button = {
            addEventListener: (name, handler) => listeners.push([name, handler]),
            getAttribute: name => attributes[name],
            setAttribute: (name, value) => { attributes[name] = value; },
          };
          new Function('document', script[1])({ querySelectorAll: () => [button] });
          assert(listeners.some(([type]) => type === 'click'), def.id + ' no click listener');
          listeners.find(([type]) => type === 'click')[1]();
          assert.equal(attributes['aria-expanded'], 'true', def.id + ' state did not toggle');
        }
      }
    }
    if (['elastic-button', 'smart-skeleton', 'glass-tilt', 'fluid-toggle', 'glitch-text', 'morph-fab'].includes(def.id)) {
      assert(code.includes('prefers-reduced-motion'), def.id + ' missing reduced-motion CSS');
    }
    fs.writeFileSync(path.join(fixtureDir, def.id + '-' + variant + '.html'),
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
      '<main id="artifact-fixture">' + markup + '</main></body></html>');
    if (['smart-skeleton', 'glitch-text'].includes(def.id)) {
      fs.writeFileSync(path.join(fixtureDir, def.id + '-' + variant + '-pair.html'),
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + markup + markup + '</body></html>');
    }
    console.log('PASS ' + def.id + ' / ' + variant + ': isolated generated artifact checked');
  }
  if (['warm-neo-brutalist-editorial', 'editorial-split-layout'].includes(def.id)) {
    const first = def.id === 'warm-neo-brutalist-editorial' ? { ...initial, shadow: 0 } : initial;
    fs.writeFileSync(path.join(fixtureDir, def.id + '-host.html'),
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
      '<aside class="host-probe" style="font-family:serif;--accent-green:#ff0000"><p class="meta">Unrelated metadata</p><span class="badge">Unrelated badge</span></aside>' +
      def.generateCode(first) + def.generateCode(changed) + '</body></html>');
  }
}
assert.equal(ids.size, 8, 'expected exactly eight registered patterns');
console.log('PASS all eight generated patterns: default + changed parameters');
