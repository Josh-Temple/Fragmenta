/* Regression checks for the 240 rendered diagrams, guides layer, inspection transforms and contrast. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript-legacy');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const catalog = require('../data/composition-guides.json');
const guides = new Map(catalog.guides.map(guide => [guide.id, guide]));
const filename = path.join(__dirname, '../components/CompositionDiagram.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, reportDiagnostics: true,
  compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  },
});
assert.deepEqual(compiled.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error), []);
const component = { exports: {} };
new Function('require', 'exports', 'module', compiled.outputText)(require, component.exports, component);
const Diagram = component.exports.default;

for (const guide of catalog.guides) {
  for (const variant of ['example', 'comparison']) {
    const html = renderToStaticMarkup(React.createElement(Diagram, { guide, variant }));
    const id = html.match(/aria-describedby="([^"]+)"/)?.[1];
    assert(id && html.includes('<desc id="' + id + '">'), guide.id + '/' + variant + ' missing linked description');
    assert(html.includes(variant === 'example' || guide.id === 'C-119' ? guide.example : guide.contrast),
      guide.id + '/' + variant + ' description lacks the actual figure text');
    if (!(guide.id === 'C-119' && variant === 'comparison')) {
      assert(html.includes('data-layer="guides"'), guide.id + '/' + variant + ' missing structure guides layer');
    }
  }
}

const inspection = renderToStaticMarkup(React.createElement(Diagram, { guide: guides.get('C-119'), variant: 'comparison' }));
assert(/<g data-inspection-transform="grayscale"[^>]*><rect data-inspection-background="true"/.test(inspection),
  'inspection must transform the original background with the foreground');

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map(c => parseInt(c, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
for (const variant of ['example', 'comparison']) {
  const markup = renderToStaticMarkup(React.createElement(Diagram, { guide: guides.get('C-036'), variant }));
  const cellColors = [...markup.matchAll(/<rect [^>]*width="20" height="20" fill="(#[0-9a-f]+)"/g)].map(m => m[1]);
  const textColors = [...markup.matchAll(/<text [^>]*fill="(#[0-9a-f]+)"[^>]*>(?:住|連)<\/text>/g)].map(m => m[1]);
  assert(cellColors.length === 6 && textColors.length === 6, 'C-036 must render six labeled fields');
  for (let i = 0; i < 6; i++) {
    const [a, b] = [luminance(cellColors[i]), luminance(textColors[i])].sort((x, y) => x - y);
    assert((b + 0.05) / (a + 0.05) >= 3.0, 'C-036 field badge contrast must be legible');
  }
}

console.log('PASS 240 rendered descriptions, structure guides layer, inspection transforms and C-036 label contrast');
