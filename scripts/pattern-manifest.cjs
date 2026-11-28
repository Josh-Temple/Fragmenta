/* 18-pattern output inventory. Runs after scripts/pattern-artifacts.cjs.
 * This creates 20 new HTML fixtures and a 36-row manifest. Browser and OS
 * clipboard acceptance remain separate tests: this script does not claim them.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript-legacy');

const repo = path.resolve(__dirname, '..');
const out = path.join(repo, 'dist', 'pattern-fixtures');
const { load, compilerOptions } = require('./load-data.cjs');

const definitions = load('data/definitions.tsx').definitions;
const rights = load('data/pattern-rights.ts').patternRights;
const ids = Object.keys(definitions).sort();
const rightIds = Object.keys(rights).sort();
assert.equal(ids.length, 18, 'expected exactly eighteen registered pattern IDs');
assert.deepEqual(ids, rightIds, 'rights inventory and definitions must have exactly the same IDs');
assert.equal(new Set(ids.map(id => definitions[id].id)).size, 18, 'duplicate embedded IDs');

fs.mkdirSync(out, { recursive: true });
const records = [];
const legacyIds = new Set([
  'elastic-button', 'smart-skeleton', 'glass-tilt', 'fluid-toggle',
  'glitch-text', 'morph-fab', 'warm-neo-brutalist-editorial', 'editorial-split-layout',
]);
assert.equal(ids.filter(id => legacyIds.has(id)).length, 8);
assert.equal(ids.filter(id => !legacyIds.has(id)).length, 10);

for (const id of ids) {
  const def = definitions[id];
  const record = rights[id];
  assert.equal(def.id, id, 'registry key/id mismatch');
  assert(/^[a-z][a-z0-9-]+$/.test(id), 'unsafe ID: ' + id);
  assert(def.title && def.description && def.category, 'missing metadata for ' + id);
  assert(typeof def.generateCode === 'function' && typeof def.generatePrompt === 'function',
    'missing code/prompt generator for ' + id);
  assert(['CONFIRMED', 'UNCLEAR', 'EXCLUDED'].includes(record.status) &&
    typeof record.grantActive === 'boolean', 'invalid rights metadata for ' + id);
  const params = def.params || [];
  assert.equal(params.length, new Set(params.map(param => param.key)).size,
    id + ': repeated parameter key');
  for (const param of params) {
    assert(/^--[a-z][a-z0-9-]*$/.test(param.cssVar),
      id + ': invalid CSS custom property ' + param.cssVar);
    assert(Number.isFinite(param.default), id + ': nonfinite parameter');
    assert(param.min === undefined || param.default >= param.min, id + ': default below min');
    assert(param.max === undefined || param.default <= param.max, id + ': default above max');
  }
  const defaults = Object.fromEntries(params.map(param => [param.key, param.default]));
  const changed = Object.fromEntries(params.map(param => [
    param.key, param.max !== undefined && param.max !== param.default ? param.max :
      param.min !== undefined && param.min !== param.default ? param.min : param.default + 1,
  ]));
  const outputs = [];
  for (const [variant, values] of [['default', defaults], ['changed', changed]]) {
    const code = def.generateCode(values);
    assert.equal(typeof code, 'string', id + ': output must be text');
    assert(code.length >= 100, id + ': suspiciously short generated code');
    assert(!/\bNaN\b|undefined(?:px|deg|s|%)/.test(code), id + ': invalid CSS interpolation');
    const prompt = def.generatePrompt(values);
    assert(typeof prompt === 'string' && prompt.length > 20, id + ': missing usage prompt');
    const jsx = code.includes('import React');
    if (jsx) {
      const transpiled = ts.transpileModule(code, {
        fileName: id + '.jsx', compilerOptions, reportDiagnostics: true,
      });
      assert.equal(transpiled.diagnostics.filter(x => x.category === ts.DiagnosticCategory.Error).length, 0,
        id + ': generated JSX syntax error');
    } else {
      assert(code.includes('<style>') && code.includes('</style>'),
        id + ': generated HTML missing standalone CSS');
      assert(/<(?:button|span|div|section|article|label|main|nav)\b/.test(code),
        id + ': generated HTML missing markup');
      for (const match of code.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
        new Function(match[1]);
      }
    }
    if (!legacyIds.has(id)) {
      assert(!jsx && code.includes('class="fp-' + id + '"'),
        id + ': new HTML output missing isolated root selector');
      assert(code.includes('--space:') && code.includes('--radius:'),
        id + ': new HTML output missing parameter-controlled CSS variables');
    }
    const fileName = id + '-' + variant + '.html';
    const filePath = path.join(out, fileName);
    if (legacyIds.has(id)) {
      assert(fs.existsSync(filePath),
        'run scripts/pattern-artifacts.cjs first (missing ' + fileName + ')');
    } else {
      fs.writeFileSync(filePath,
        '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
        code + '</body></html>');
    }
    outputs.push(code);
    records.push({
      id, title: def.title, category: def.category,
      sourcePath: record.sourcePath, rightsStatus: record.status,
      grantActive: record.grantActive, variant, values,
      outputFormat: jsx ? 'react-jsx' : 'html-css',
      fixture: 'dist/pattern-fixtures/' + fileName,
      codeBytes: Buffer.byteLength(code), codeSha256: crypto.createHash('sha256').update(code).digest('hex'),
      browserAcceptance: 'NOT_RUN_BY_MANIFEST',
    });
  }
  assert.notEqual(outputs[0], outputs[1], id + ': parameter change has no generated effect');
  console.log('PASS manifest ' + id + ': default and changed outputs checked');
}
assert.equal(records.length, 36, '18 IDs x 2 variants required');
fs.writeFileSync(path.join(out, '18-pattern-manifest.json'), JSON.stringify({
  schemaVersion: 1, sourceCommit: process.env.GITHUB_SHA || null,
  totalPatterns: ids.length, legacyPatterns: 8, practicalPatterns: 10,
  variants: ['default', 'changed'], totalOutputs: records.length,
  browserWidthsPlanned: [360, 768, 1280],
  browserNote: 'Standalone Chromium coverage and actual clipboard equality require separate tests.',
  records,
}, null, 2) + '\n');
console.log('PASS all 18 pattern IDs, 36 generated outputs, rights-key parity and machine-readable manifest');
