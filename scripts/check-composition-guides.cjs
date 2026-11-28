// Composition guide schema, geometry, editorial fields and route consistency.
// The illustrations are editorial schematics, not validated examples.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const source = JSON.parse(read('data/composition-guides.json'));
const { build } = require('./composition/build.cjs');
function assert(ok, msg) { if (!ok) throw Error('Composition: ' + msg); }
const expected = Array.from({ length: 120 }, (_, i) => 'C-' + String(i + 1).padStart(3, '0'));
assert(source.schemaVersion === 2 && source.status === 'draft_unreviewed', 'metadata');
assert(source.guides.length === 120, 'expected 120 composition entries');
assert(new Set(source.guides.map(g => g.id)).size === 120, 'duplicate IDs');
assert(expected.every(id => source.guides.some(g => g.id === id)), 'priority inventory');
assert(source.categories.length === 10, 'expected 10 categories');
assert(source.kind === 'composition-guides', 'unexpected catalog kind');
const cats = new Set(source.categories.map(g => g.id));
assert(cats.size === 10, 'duplicate categories');
for (const cat of source.categories)
  assert(source.guides.filter(g => g.categoryId === cat.id).length === 12, 'expected 12 entries in category: ' + cat.id);

// Authored source modules in scripts/composition/entries/*.cjs must stay in sync with the JSON.
const { text: builtText, authored } = build();
assert(authored === 120, 'expected 120 authored entry modules, got ' + authored);
assert(read('data/composition-guides.json') === builtText, 'data/composition-guides.json is out of sync with scripts/composition/entries/*.cjs');

const validColor = (c, allowNone = false) =>
  Number.isInteger(c) && (c >= 0 && c <= 7 || (allowNone && c === -1));

function checkShape(shape, label) {
  assert(Array.isArray(shape) && ['rect', 'circle', 'line', 'poly', 'text', 'path'].includes(shape[0]), 'unknown shape: ' + label);
  const type = shape[0];
  if (type === 'rect') {
    const [, x, y, w, h, color] = shape;
    assert(shape.length === 6 && [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 && validColor(color, true),
      'invalid rectangle geometry: ' + label);
  } else if (type === 'circle') {
    const [, x, y, r, color] = shape;
    assert(shape.length === 5 && [x, y, r].every(Number.isFinite) && r > 0 && validColor(color),
      'invalid circle geometry: ' + label);
  } else if (type === 'line') {
    const [, x, y, x2, y2, color, width] = shape;
    assert(shape.length === 7 && [x, y, x2, y2, width].every(Number.isFinite) && width > 0 && validColor(color),
      'invalid line geometry: ' + label);
  } else if (type === 'text') {
    const [, x, y, caption, color, fontSize] = shape;
    assert(shape.length === 6 && typeof caption === 'string' && caption.trim().length > 0 &&
      caption.length <= 16 && [x, y, fontSize].every(Number.isFinite) &&
      fontSize >= 7 && fontSize <= 18 && validColor(color),
      'invalid text geometry: ' + label);
  } else if (type === 'poly') {
    const [, coords, color] = shape;
    const pairs = String(coords).trim().split(/\s+/).map(pair => pair.split(',').map(Number));
    assert(shape.length === 3 && pairs.length >= 3 &&
      pairs.every(pair => pair.length === 2 && pair.every(Number.isFinite)) && validColor(color),
      'invalid polygon geometry: ' + label);
  } else if (type === 'path') {
    const [, d, fill, stroke, width] = shape;
    assert(shape.length >= 5 && shape.length <= 6 && typeof d === 'string' && d.trim().length > 0 &&
      validColor(fill, true) && validColor(stroke, true) && Number.isFinite(width) && width >= 0,
      'invalid path geometry: ' + label);
  }
}

for (const guide of source.guides) {
  assert(cats.has(guide.categoryId), 'unknown category: ' + guide.id);
  assert(typeof guide.titleJa === 'string' && guide.titleJa.length >= 3, 'missing title: ' + guide.id);
  assert([guide.definition, guide.whyItWorks, guide.example, guide.contrast, guide.comparisonPoint, guide.aiInstruction]
    .every(s => typeof s === 'string' && s.length >= 15), 'incomplete editorial guidance: ' + guide.id);
  assert(typeof guide.changed === 'string' && guide.changed.length >= 6, 'missing changed variable: ' + guide.id);
  assert(Array.isArray(guide.useCases) && guide.useCases.length >= 2, 'missing useCases: ' + guide.id);
  assert(Array.isArray(guide.pitfalls) && guide.pitfalls.length >= 2, 'missing pitfalls: ' + guide.id);
  assert(guide.reviewStatus === 'draft_unreviewed' && guide.evidenceStatus === 'not_checked', 'draft status: ' + guide.id);
  for (const v of ['example', 'comparison']) {
    const diagram = guide.diagram[v];
    assert(Array.isArray(diagram) && diagram.length > 0, 'empty ' + v + ' diagram: ' + guide.id);
    for (const sh of diagram) checkShape(sh, guide.id + '/' + v);
    const guidesLayer = guide.diagram.guides?.[v];
    assert(Array.isArray(guidesLayer) && guidesLayer.length > 0, 'empty ' + v + ' guides: ' + guide.id);
    for (const sh of guidesLayer) checkShape(sh, guide.id + '/guides/' + v);
  }
  const sameSource = JSON.stringify(guide.diagram.example) === JSON.stringify(guide.diagram.comparison);
  assert(guide.id === 'C-119' ? sameSource : !sameSource,
    guide.id === 'C-119' ? 'inspection must retain the identical source' : 'comparison must differ: ' + guide.id);
  for (const id of guide.sourceIds) assert(Object.hasOwn(source.sources, id), 'unknown source: ' + id);
  assert(guide.relatedLegacyIds.every(id => id.startsWith('idea-')), 'legacy ref prefix: ' + guide.id);
}

const app = read('App.tsx'), listing = read('pages/KnowledgeBase.tsx');
assert(app.includes('path="/composition"') && listing.includes('to="/composition"'), 'composition link and route missing');
assert(read('pages/Composition.tsx').includes('CompositionDiagram'), 'visual comparison missing');
assert(read('scripts/export-knowledge.cjs').includes('composition-guides.json'), 'public export missing');
assert(read('pages/Composition.tsx').includes('guide.comparisonPoint'), 'comparison point not rendered');
assert(read('pages/Composition.tsx').includes('guide.diagramNote'), 'diagram limitation not rendered');
assert(read('components/CompositionDiagram.tsx').includes("if (kind === 'text')"), 'text annotation renderer missing');
assert(read('components/CompositionDiagram.tsx').includes("if (kind === 'path')"), 'path renderer missing');
assert(read('pages/Composition.tsx').includes('composition-atlas-title'), 'atlas view missing');

for (const [id, ref] of Object.entries(source.sources)) {
  const url = new URL(ref.url);
  assert(url.protocol === 'https:' && !url.username && !url.password &&
    url.hostname !== 'localhost' && !url.hostname.endsWith('.localhost'), 'unsafe source: ' + id);
}

const highRisk = ['C-012', 'C-036', 'C-039', 'C-060', 'C-090', 'C-092', 'C-120'];
for (const id of highRisk) {
  const guide = source.guides.find(g => g.id === id);
  assert(guide?.diagramNote?.length >= 28, 'missing limitation on high-risk diagram: ' + id);
}
const semanticPairs = {
  'C-012': ['golden-ratio-review'],
  'C-039': ['adobe-architecture-perspective'],
  'C-060': ['camera-perspective-distance'],
  'C-092': ['adobe-180'],
};
for (const [id, refs] of Object.entries(semanticPairs)) {
  const guide = source.guides.find(g => g.id === id);
  for (const ref of refs) assert(guide.sourceIds.includes(ref), 'missing scoped evidence: ' + id + '/' + ref);
}

const at = id => source.guides.find(g => g.id === id);
const figureA = at('C-036').diagram.example.filter(s => s[0] === 'text').map(s => s[3]);
const figureB = at('C-036').diagram.comparison.filter(s => s[0] === 'text').map(s => s[3]);
assert(figureA.join('') === '住住住連連連', 'semantic grouping example labels');
assert(figureB.join('') === '住連住連住連', 'semantic grouping counterexample labels');

const p39 = at('C-039');
assert(p39.diagram.example.filter(s => s[0] === 'poly').length >= 2, '3-point perspective faces missing');

const cam = at('C-092');
const cameras = v => cam.diagram[v].filter(s => s[0] === 'poly' && s[2] === 4).map(s =>
  s[1].split(' ').map(q => Number(q.split(',')[1])).reduce((a, b) => a + b, 0) / s[1].split(' ').length);
assert(cameras('example').length >= 2 && cameras('example').every(y => y < 75), 'both cameras must be same side');
assert(cameras('comparison').some(y => y < 75) && cameras('comparison').some(y => y > 75),
  'camera must cross axis for comparison');

const scene60 = at('C-060');
assert(JSON.stringify(scene60.diagram.example.filter(s => s[0] === 'circle')) ===
  JSON.stringify(scene60.diagram.comparison.filter(s => s[0] === 'circle')),
  'foreground person must be fixed across camera distance cases');

const copyright = at('C-120');
assert([copyright.definition, copyright.diagramNote].filter(Boolean).join(' ').includes('判定できない'),
  'copyright eligibility cannot be inferred from diagrams');

const vp037 = at('C-037').diagram.comparison.filter(s => s[0] === 'line').map(s => s[3] + ',' + s[4]);
assert(new Set(vp037).size > 1, 'C-037 comparison must not converge to one vanishing point');

const p073 = at('C-073');
const head073 = ['example', 'comparison'].map(v => p073.diagram[v].find(s => s[0] === 'circle' && s[4] === 4));
assert(head073[0] && head073[1] && head073[0][1] === head073[1][1] && head073[0][3] < head073[1][3],
  'C-073 only character size should vary, keeping the x anchor fixed');

const p118 = at('C-118'), windows118 = v => p118.diagram[v].filter(s => s[0] === 'rect' && s[5] === 0);
assert(windows118('comparison').length > windows118('example').length &&
  JSON.stringify(p118.diagram.example.filter(s => s[0] === 'circle' && s[4] === 4)) ===
  JSON.stringify(p118.diagram.comparison.filter(s => s[0] === 'circle' && s[4] === 4)),
  'C-118 window-density comparison must keep character identical');

const eyeline = at('C-093');
const camera2 = variant => eyeline.diagram[variant].find(s => s[0] === 'line' && s[1] === 122 && s[2] === 58);
for (const [variant, target] of [['example', [184, 34]], ['comparison', [56, 34]]]) {
  const line = camera2(variant);
  assert(line && line[3] === target[0] && line[4] === target[1], 'C-093 camera 2 must aim at the depicted target');
}
assert(JSON.stringify(eyeline.diagram.example.slice(0, 8)) === JSON.stringify(eyeline.diagram.comparison.slice(0, 8)),
  'C-093 person, door, gaze and camera 1 must stay fixed');

console.log('PASS: 120 schemaVersion 2 guides / 10 categories, 240 diagrams + guides, geometry and captions, source sync, route and export hook');
