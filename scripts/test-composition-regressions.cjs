/* Regression checks for the edited diagrams and their rendered descriptions. */
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
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
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
  }
}
const inspection = renderToStaticMarkup(React.createElement(Diagram, { guide: guides.get('C-119'), variant:'comparison' }));
assert(/<g data-inspection-transform="grayscale"[^>]*><rect data-inspection-background="true"/.test(inspection),
  'inspection must transform the original background with the foreground');
const [building, head, body, pillar] = guides.get('C-033').diagram.example;
const overlaps = (a,b) => a[1] < b[1]+b[3] && b[1] < a[1]+a[3] && a[2] < b[2]+b[4] && b[2] < a[2]+a[4];
assert(overlaps(building, body) && overlaps(building, pillar) && overlaps(body, pillar),
  'C-033 must actually show all three layers overlapping');
assert(pillar[1] > body[1] && pillar[1] < body[1] + body[3], 'C-033 must only partially cover the person');
const silhouette = guides.get('C-063').diagram;
assert.deepEqual(silhouette.example.slice(1).map(s=>s.slice(0,-1)), silhouette.comparison.slice(1,3).map(s=>s.slice(0,-1)),
  'C-063 must retain the head and body outlines');
const headShape = silhouette.comparison[1], bodyShape = silhouette.comparison[2];
for (const s of silhouette.comparison.slice(3)) {
  if (s[0] === 'circle') assert(Math.hypot(s[1]-headShape[1],s[2]-headShape[2])+s[3] <= headShape[3]);
  else if (s[0] === 'line') assert([s[1],s[3]].every(x=>x>=bodyShape[1]&&x<=bodyShape[1]+bodyShape[3]) &&
    [s[2],s[4]].every(y=>y>=bodyShape[2]&&y<=bodyShape[2]+bodyShape[4]));
  else throw Error('Unexpected detail in C-063');
}
console.log('PASS 240 rendered descriptions, full-canvas inspection, occlusion and silhouette geometry');
