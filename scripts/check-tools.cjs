const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript-legacy');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  const full = path.join(root, file);
  if (cache.has(full)) return cache.get(full);
  const exports = {};
  cache.set(full, exports);
  const source = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  }).outputText;
  const localRequire = name => {
    if (!name.startsWith('.')) return require(name);
    const relative = path.relative(root, path.resolve(path.dirname(full), name));
    return load(fs.existsSync(path.join(root, relative + '.ts')) ? relative + '.ts' : relative + '.tsx');
  };
  vm.runInNewContext(source, { exports, require: localRequire }, { timeout: 3000, filename: file });
  return exports;
}
const { normalizeHex, relativeLuminance, contrastRatio, contrastChecks, typographyCss } = load('data/tool-calculations.ts');
assert.equal(normalizeHex(' #AbC '), '#aabbcc');
assert.equal(normalizeHex('#123456'), '#123456');
for (const invalid of ['', 'white', '123456', '#12', '#0000', '#12345678', '#ggg', '#123456; color:red']) assert.equal(normalizeHex(invalid), null);
assert.throws(() => relativeLuminance('#00000000'));
assert.equal(relativeLuminance('#000'), 0);
assert.equal(relativeLuminance('#fff'), 1);
assert.equal(contrastRatio('#000', '#fff'), 21);
assert.equal(contrastRatio('#123456', '#123456'), 1);
// Fixed expected values independently calculated from the W3C formula.
assert.ok(Math.abs(contrastRatio('#777777', '#ffffff') - 4.478089453577214) < 1e-12);
assert.ok(Math.abs(contrastRatio('#767676', '#ffffff') - 4.542224959605253) < 1e-12);
assert.equal(contrastChecks(contrastRatio('#777', '#fff'))[0].pass, false);
assert.equal(contrastChecks(contrastRatio('#767676', '#fff'))[0].pass, true);
for (const threshold of [3, 4.5, 7]) {
  for (const check of contrastChecks(threshold - 0.00001)) if (check.minimum === threshold) assert.equal(check.pass, false);
  for (const check of contrastChecks(threshold)) if (check.minimum === threshold) assert.equal(check.pass, true);
}
let previous = 22;
for (let channel = 0; channel <= 255; channel++) {
  const gray = '#' + channel.toString(16).padStart(2, '0').repeat(3);
  const ratio = contrastRatio(gray, '#fff');
  assert.ok(ratio >= 1 && ratio <= 21 && ratio < previous);
  assert.equal(ratio, contrastRatio('#fff', gray));
  previous = ratio;
}
const settings = { size: 23, leading: 2.15, spacing: 0.07, width: 42, font: 'serif' };
const css = typographyCss(settings);
for (const expected of ['font-size: 23px', 'line-height: 2.15', 'letter-spacing: 0.07em', 'max-inline-size: 42rem', '"Yu Mincho"', '.fragmenta-prose p', 'white-space: pre-wrap']) assert.ok(css.includes(expected));
assert.ok(!css.includes('body {') && !css.includes(':root'));
const { matchesSearch, patternSearchAliases, styleSearchAliases } = load('data/discovery.ts');
assert.equal(matchesSearch(' ＧＬＡＳＳ ', ['Glass Tilt']), true);
assert.equal(matchesSearch('　記事　読書 ', ['記事と読書']), true);
assert.equal(matchesSearch('配色', ['日本語タイポグラフィ']), false);
assert.equal(matchesSearch(' article glass ', ['Article example', 'Glass surface']), true);
assert.equal(matchesSearch(' article absent ', ['Article example']), false);
assert.equal(matchesSearch('', ['anything']), true);
const { liveTools } = load('data/live-tools.ts');
const { plannedTools } = load('data/planned-tools.ts');
assert.equal(liveTools.length, 2);
assert.equal(plannedTools.length, 10);
assert.equal(new Set([...liveTools, ...plannedTools].map(tool => tool.id)).size, 12);
assert.ok(plannedTools.every(tool => !liveTools.some(live => live.id === tool.id)));
assert.equal(liveTools.filter(tool => matchesSearch('行間', [tool.titleJa, ...tool.tags])).length, 1);
const { definitions } = load('data/definitions.tsx');
assert.equal(Object.keys(definitions).length, 18);
assert.deepEqual(Object.keys(patternSearchAliases).sort(), Object.keys(definitions).sort());
const { patternChoices } = load('data/pattern-choices.ts');
assert.deepEqual(Object.keys(patternChoices).sort(), Object.keys(definitions).sort());
for (const [id, choice] of Object.entries(patternChoices)) {
  assert.ok(choice.avoidWhen.trim() && choice.startWith.trim(), 'missing selection guidance: ' + id);
  assert.equal(choice.related.length, 2, 'expected two related patterns: ' + id);
  assert.equal(new Set(choice.related.map(item => item.id)).size, 2, 'duplicate related pattern: ' + id);
  for (const item of choice.related)
    assert.ok(definitions[item.id] && item.id !== id && item.reason.trim(), 'invalid related pattern: ' + id + '/' + item.id);
}
const { designStyles } = load('data/design-styles.ts');
assert.equal(designStyles.length, 24);
assert.ok(Object.keys(styleSearchAliases).every(id => designStyles.some(style => style.id === id)));
assert.equal(designStyles.filter(style => matchesSearch('ガラス', [style.ja, style.summary, ...style.features, styleSearchAliases[style.id] ?? ''])).length > 0, true);
console.log('PASS tools/discovery: WCAG fixtures and exact thresholds, 256 gray pairs, input rejection, scoped typography CSS, Japanese/Unicode search, 18 pattern guides and related links, 24 styles + 2 live / 10 planned tools');
