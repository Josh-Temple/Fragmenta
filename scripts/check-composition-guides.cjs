// Composition guide schema, geometry and route consistency.
// The illustrations are editorial schematics, not validated examples.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const source = JSON.parse(read('data/composition-guides.json'));
function assert(ok, msg) { if (!ok) throw Error('Composition: ' + msg); }
const expected = Array.from({length:120},(_,i) => 'C-'+String(i+1).padStart(3,'0'));
assert(source.schemaVersion === 1 && source.status === 'draft_unreviewed', 'metadata');
assert(source.guides.length === 120, 'expected 120 composition entries');
assert(new Set(source.guides.map(g=>g.id)).size===120, 'duplicate IDs');
assert(expected.every(id=>source.guides.some(g=>g.id===id)), 'priority inventory');
assert(source.categories.length===10,'expected 10 categories');
assert(source.kind==='composition-guides','unexpected catalog kind');
const cats = new Set(source.categories.map(g=>g.id));
assert(cats.size===10,'duplicate categories');
for(const cat of source.categories) assert(source.guides.filter(g=>g.categoryId===cat.id).length===12,
  'expected 12 entries in category: '+cat.id);
for(const guide of source.guides) {
 assert(cats.has(guide.categoryId), 'unknown category: '+guide.id);
 assert(typeof guide.titleJa === 'string' && guide.titleJa.length >= 3, 'missing title: '+guide.id);
 assert([guide.definition,guide.example,guide.contrast,guide.aiInstruction]
   .every(s=>typeof s==='string'&&s.length>=15), 'incomplete editorial guidance: '+guide.id);
 assert(guide.reviewStatus==='draft_unreviewed'&&guide.evidenceStatus==='not_checked','draft status: '+guide.id);
 assert(typeof guide.comparisonPoint==='string'&&guide.comparisonPoint.length>=15,'missing comparison point: '+guide.id);
 assert(JSON.stringify(guide.diagram.example)!==JSON.stringify(guide.diagram.comparison),'identical diagrams: '+guide.id);
 for(const v of ['example','comparison']) {
  const diagram=guide.diagram[v];
  assert(Array.isArray(diagram)&&diagram.length>0,'empty '+v+' diagram: '+guide.id);
  for(const sh of diagram) {
   assert(Array.isArray(sh)&&['rect','circle','line','poly','text'].includes(sh[0]),'unknown shape: '+guide.id);
   assert(sh.slice(1).every(x=>typeof x==='number'||(['poly','text'].includes(sh[0])&&typeof x==='string')),'invalid geometry: '+guide.id);
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

const revised = expected;
for (const id of revised) {
  const guide = source.guides.find(item => item.id === id);
  assert(guide?.comparisonPoint?.length >= 15, 'missing comparison explanation: ' + id);
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
      } else if (type === 'text') {
        const [,x,y,caption,color,fontSize] = shape;
        assert(shape.length===6 && typeof caption==='string' && caption.trim().length>0 &&
          caption.length<=16 && x>=0 && x<=240 && y>=0 && y<=150 &&
          fontSize>=8 && fontSize<=18 && Number.isInteger(color) && color>=0 && color<=4,
          'invalid text geometry: ' + guide.id + '/' + variant);
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
assert(read('pages/Composition.tsx').includes('guide.diagramNote'), 'diagram limitation not rendered');
assert(read('components/CompositionDiagram.tsx').includes("if (kind === 'text')"), 'text annotation renderer missing');
assert(read('pages/Composition.tsx').includes('composition-atlas-title'),'atlas view missing');
for(const [id,ref] of Object.entries(source.sources)) {
  const url = new URL(ref.url);
  assert(url.protocol==='https:' && !url.username && !url.password &&
    url.hostname!=='localhost' && !url.hostname.endsWith('.localhost'), 'unsafe source: '+id);
}

// Regression: C-037 is a one-point example versus nonconvergent counterexample.
// A shared shifted endpoint in the comparison would incorrectly depict a second
// valid one-point perspective while the description says the endpoints diverge.
const onePoint = source.guides.find(g => g.id === 'C-037');
const lineEndpoints = v => onePoint.diagram[v].filter(sh => sh[0] === 'line')
  .map(sh => sh[3] + ',' + sh[4]);
assert(lineEndpoints('example').length === 4 &&
  new Set(lineEndpoints('example')).size === 1,
  'C-037 example must converge to one vanishing point');
assert(lineEndpoints('comparison').length === 4 &&
  new Set(lineEndpoints('comparison')).size > 1,
  'C-037 comparison must not converge to another single point');

const highRisk = ['C-012','C-036','C-039','C-060','C-090','C-092','C-120'];
for(const id of highRisk) {
 const guide=source.guides.find(g=>g.id===id);
 assert(guide?.diagramNote?.length>=28,'missing limitation on high-risk diagram: '+id);
}
const semanticPairs = {
 'C-012': ['golden-ratio-review'],
 'C-039': ['adobe-architecture-perspective'],
 'C-060': ['camera-perspective-distance'],
 'C-092': ['adobe-180']
};
for(const [id,refs] of Object.entries(semanticPairs)){
 const guide=source.guides.find(g=>g.id===id);
 for(const ref of refs) assert(guide.sourceIds.includes(ref),'missing scoped evidence: '+id+'/'+ref);
}
const figureA=source.guides.find(g=>g.id==='C-036').diagram.example.filter(s=>s[0]==='text').map(s=>s[3]);
const figureB=source.guides.find(g=>g.id==='C-036').diagram.comparison.filter(s=>s[0]==='text').map(s=>s[3]);
assert(figureA.join('')==='住住住連連連','semantic grouping example labels');
assert(figureB.join('')==='住連住連住連','semantic grouping counterexample labels');
const p39=source.guides.find(g=>g.id==='C-039');
assert(p39.diagram.example.filter(s=>s[0]==='poly').length>=2,'3-point perspective faces missing');
const cam=source.guides.find(g=>g.id==='C-092');
const cameras=v=>cam.diagram[v].filter(s=>s[0]==='poly').map(s=>
  s[1].split(' ').map(q=>Number(q.split(',')[1])).reduce((a,b)=>a+b,0)/3);
assert(cameras('example').every(y=>y<75),'both cameras must be same side');
assert(cameras('comparison').some(y=>y<75)&&cameras('comparison').some(y=>y>75),
  'camera must cross axis for example');
const scene=source.guides.find(g=>g.id==='C-060');
assert(JSON.stringify(scene.diagram.example.filter(s=>s[0]==='circle')) ===
  JSON.stringify(scene.diagram.comparison.filter(s=>s[0]==='circle')),
  'foreground person must be fixed across camera distance cases');
assert(source.guides.find(g=>g.id==='C-120').definition.includes('判定できない'),
  'copyright eligibility cannot be inferred from diagrams');
console.log('PASS: 120 draft guides / 10 categories, 240 diagrams, geometry and captions, comparison points, route and export hook');
