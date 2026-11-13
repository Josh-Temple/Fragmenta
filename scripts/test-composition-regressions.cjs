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
const [verticalGuide, horizontalGuide, head111, body111] = guides.get('C-111').diagram.example;
const personCenterY = ((head111[2] - head111[3]) + (body111[2] + body111[4])) / 2;
assert(Math.abs(verticalGuide[1] / 240 - 0.20) < 0.005 &&
  Math.abs(horizontalGuide[2] / 150 - 0.75) < 0.005 &&
  Math.abs(head111[1] - verticalGuide[1]) < 1 && Math.abs(personCenterY - horizontalGuide[2]) < 1,
  'C-111 person center should match the stated 20% / approximately 75% guides');
for (const id of ['C-043', 'C-080']) {
  const shapes = guides.get(id).diagram.example;
  const head = shapes[1], body = shapes[2], foreground = shapes[3];
  const headLeft = head[1] - head[3], headRight = head[1] + head[3];
  assert(foreground[1] > headLeft && foreground[1] < headRight &&
    foreground[1] > body[1] && foreground[1] < body[1] + body[3] &&
    foreground[2] <= head[2] - head[3] && foreground[2] + foreground[4] >= body[2] + body[4],
    id + ' foreground must partly cover, rather than fully hide, the person');
}
const p112 = guides.get('C-112').diagram;
const top112 = v => p112[v][2][2] - p112[v][2][3];
const bottom112 = v => p112[v][3][2] + p112[v][3][4];
assert(Math.abs((bottom112('example') - top112('example')) / 150 - .2) < .005 &&
  bottom112('example') === bottom112('comparison') && p112.example[2][1] === p112.comparison[2][1],
  'C-112 must show a 20% figure with a shared horizontal position and baseline');
function checkArrow(shapes, i, name) {
  const shaft = shapes[i], tipX = shaft[3], tipY = shaft[4];
  const dx = tipX - shaft[1], dy = tipY - shaft[2];
  for (const wing of shapes.slice(i + 1, i + 3)) {
    assert(wing[1] === tipX && wing[2] === tipY &&
      (wing[3] - tipX) * dx + (wing[4] - tipY) * dy < 0,
      name + ' arrowhead must point in the shaft direction');
  }
}
checkArrow(guides.get('C-032').diagram.comparison, 5, 'C-032');
for (const variant of ['example', 'comparison']) {
  checkArrow(guides.get('C-098').diagram[variant], 4, 'C-098/' + variant);
  checkArrow(guides.get('C-098').diagram[variant], 7, 'C-098/' + variant);
}
const dialogue = guides.get('C-098').diagram;
assert(dialogue.example[4][3] < dialogue.example[7][3] &&
  dialogue.comparison[4][3] < dialogue.comparison[0][1] - dialogue.comparison[0][3] &&
  dialogue.comparison[7][3] > dialogue.comparison[2][1] + dialogue.comparison[2][3],
  'C-098 direction arrows must remain distinct and outside the faces');
const edge = guides.get('C-072').diagram;
const bands = edge.example.slice(0, 4);
assert.deepEqual(bands.map(s => s[5]), [0, 1, 2, 3]);
assert(bands.every((s, i) => s[0] === 'rect' && s[2] === bands[0][2] && s[4] === bands[0][4] &&
  (i === 0 || bands[i - 1][1] + bands[i - 1][3] === s[1])),
  'C-072 must show contiguous stepped tones along one edge');
assert.deepEqual(edge.example.slice(4), edge.comparison.slice(1),
  'C-072 must keep the other building and person fixed');
assert(edge.comparison[0][1] === bands[0][1] &&
  edge.comparison[0][3] === bands.reduce((total, band) => total + band[3], 0),
  'C-072 building must have the same outer extent in both examples');
const room = guides.get('C-102').diagram;
assert.deepEqual(room.example.slice(0, -1), room.comparison.slice(0, -1),
  'C-102 must only move the furniture');
const door = room.comparison[0], person = room.comparison[3], furniture = room.comparison.at(-1);
assert(overlaps(door, furniture) && !overlaps(person, furniture),
  'C-102 furniture must partly overlap the door without hiding the person');
console.log('PASS 240 rendered descriptions, inspection transforms, occlusion, edge, silhouette, position and arrow geometry');
