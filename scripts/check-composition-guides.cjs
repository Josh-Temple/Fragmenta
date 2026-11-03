// Composition guide schema, geometry and route consistency.
// The illustrations are editorial schematics, not validated examples.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const source = JSON.parse(read('data/composition-guides.json'));
function assert(ok, msg) { if (!ok) throw Error('Composition: ' + msg); }
const expected = [1,2,4,5,10,14,15,16,18,19,25,33,41,48,61,62,63,67,73,75,109,110,115,119].map(n => 'C-'+String(n).padStart(3,'0'));
assert(source.schemaVersion === 1 && source.status === 'draft_unreviewed', 'metadata');
assert(source.guides.length === 24, 'expected 24 priority entries');
assert(new Set(source.guides.map(g=>g.id)).size===24, 'duplicate IDs');
assert(expected.every(id=>source.guides.some(g=>g.id===id)), 'priority inventory');
const cats = new Set(source.categories.map(g=>g.id));
for(const guide of source.guides) {
 assert(cats.has(guide.categoryId), 'unknown category: '+guide.id);
 assert(typeof guide.titleJa === 'string' && guide.titleJa.length >= 3, 'missing title: '+guide.id);
 assert([guide.definition,guide.example,guide.contrast,guide.aiInstruction]
   .every(s=>typeof s==='string'&&s.length>=15), 'incomplete editorial guidance: '+guide.id);
 assert(guide.reviewStatus==='draft_unreviewed'&&guide.evidenceStatus==='not_checked','draft status: '+guide.id);
 for(const v of ['example','comparison']) {
  const diagram=guide.diagram[v];
  assert(Array.isArray(diagram)&&diagram.length>0,'empty '+v+' diagram: '+guide.id);
  for(const sh of diagram) {
   assert(Array.isArray(sh)&&['rect','circle','line','poly'].includes(sh[0]),'unknown shape: '+guide.id);
   assert(sh.slice(1).every(x=>typeof x==='number'||(sh[0]==='poly'&&typeof x==='string')),'invalid geometry: '+guide.id);
   assert(sh.slice(1).filter(x=>typeof x==='number').every(Number.isFinite),'NaN geometry: '+guide.id);
  }
 }
 for(const id of guide.sourceIds) assert(Object.hasOwn(source.sources,id),'unknown source: '+id);
 assert(guide.relatedLegacyIds.every(id=>id.startsWith('idea-')),'legacy ref prefix: '+guide.id);
}
const app=read('App.tsx'), listing=read('pages/KnowledgeBase.tsx');
assert(app.includes('path="/composition"')&&listing.includes('to="/composition"'),'composition link and route missing');
assert(read('pages/Composition.tsx').includes('CompositionDiagram'),'visual comparison missing');
assert(read('scripts/export-knowledge.cjs').includes('composition-guides.json'),'public export missing');

const revised = ['C-014','C-015','C-048','C-061','C-062','C-063','C-073','C-075','C-110'];
for (const id of revised) {
  const guide = source.guides.find(item => item.id === id);
  assert(guide?.comparisonPoint?.length >= 22, 'missing comparison explanation: ' + id);
  assert(JSON.stringify(guide.diagram.example) !== JSON.stringify(guide.diagram.comparison),
    'comparison must differ: ' + id);
}
for (const guide of source.guides) {
  for (const [variant, shapes] of Object.entries(guide.diagram)) {
    for (const shape of shapes) {
      const type = shape[0];
      if (type === 'rect') {
        const [,x,y,w,h,color] = shape;
        assert(shape.length === 6 && x >= 0 && y >= 0 && w > 0 && h > 0 &&
          x+w <= 240.001 && y+h <= 150.001 && Number.isInteger(color) && color >= 0 && color <= 4,
          'invalid rectangle geometry: ' + guide.id + '/' + variant);
      } else if (type === 'circle') {
        const [,x,y,r,color] = shape;
        assert(shape.length === 5 && r > 0 && x-r >= 0 && y-r >= 0 &&
          x+r <= 240.001 && y+r <= 150.001 && Number.isInteger(color) && color >= 0 && color <= 4,
          'invalid circle geometry: ' + guide.id + '/' + variant);
      } else if (type === 'line') {
        const [,x,y,x2,y2,color,width] = shape;
        assert(shape.length === 7 && [x,x2].every(v=>v>=0&&v<=240) &&
          [y,y2].every(v=>v>=0&&v<=150) && width > 0 &&
          Number.isInteger(color) && color >= 0 && color <= 4,
          'invalid line geometry: ' + guide.id + '/' + variant);
      } else if (type === 'poly') {
        const [,coords,color] = shape;
        const pairs = coords.trim().split(/\s+/).map(pair=>pair.split(',').map(Number));
        assert(shape.length===3 && pairs.length>=3 &&
          pairs.every(pair=>pair.length===2&&pair.every(Number.isFinite)&&
            pair[0]>=0&&pair[0]<=240&&pair[1]>=0&&pair[1]<=150) &&
            Number.isInteger(color)&&color>=0&&color<=4,
          'invalid polygon geometry: ' + guide.id + '/' + variant);
      }
    }
  }
}
assert(read('pages/Composition.tsx').includes('guide.comparisonPoint'), 'comparison point not rendered');
console.log('PASS: 24 draft guides, geometry bounds, 9 explained pairs, route and export hook');
