// Structural integrity of the unreviewed discovery sidecar and generated AI export.
// Passing this test does not prove editorial accuracy, visual inspection or original-source verification.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const check = (ok, msg) => { if (!ok) throw Error('composition-discovery: ' + msg); };
const src = read('data/composition-guides.json'), d = read('data/composition-discovery.json');
const legacy = read('data/content-ideas.json'), out = read('public/knowledge/composition-guides.json');
const ids = new Set(src.guides.map(g => g.id)), old = new Set(legacy.ideas.map(i => i.id));
const categories = new Set(src.categories.map(c => c.id));
check(src.guides.length === 120 && ids.size === 120 && legacy.ideas.length === 180 && old.size === 180,'catalog counts');
check(d.schemaVersion === 1 && d.kind === 'composition-discovery' && d.status === 'draft_unreviewed','sidecar contract');
check(d.purposes.length === 8 && new Set(d.purposes.map(p=>p.id)).size === 8,'purpose IDs');
check(d.purposes.reduce((n,p)=>n+p.choices.length,0) === 50,'expected 50 purpose choices');
check(d.relatedComposition.length === 20,'expected 20 related links');
check(out.schemaVersion === src.schemaVersion && out.kind === src.kind && out.status === src.status,'source contract');
check(JSON.stringify(out.discovery) === JSON.stringify({
  schemaVersion:d.schemaVersion,status:d.status,note:d.note,purposes:d.purposes
}), 'exported purpose catalog');
for (const category of src.categories) {
  const media=d.mediaByCategory[category.id], subjects=d.subjectsByCategory[category.id];
  check(Array.isArray(media) && media.length>0 && Array.isArray(subjects) && subjects.length>0,'candidate tags '+category.id);
}
check(Object.keys(d.mediaByCategory).every(k=>categories.has(k)) &&
 Object.keys(d.subjectsByCategory).every(k=>categories.has(k)),'unknown category candidate');
for (const p of d.purposes) {
  check(typeof p.titleJa==='string' && p.titleJa.length>0 && p.choices.length>=5 &&
    new Set(p.choices.map(c=>c.guideId)).size===p.choices.length,'purpose choices '+p.id);
  for(const c of p.choices)check(ids.has(c.guideId) && c.reasonJa.length>=10 && c.cautionJa.length>=10,'choice '+p.id+'/'+c.guideId);
}
const edgeKeys=new Set();
for (const r of d.relatedComposition) {
  check(ids.has(r.sourceId) && ids.has(r.targetId) && r.sourceId!==r.targetId,'unknown/self relation');
  check(['complement','similar','contrast','prerequisite'].includes(r.relationType) && r.reasonJa.length>=10,'relation description');
  const key=r.sourceId+'/'+r.targetId;
  check(!edgeKeys.has(key),'duplicate relation '+key); edgeKeys.add(key);
}
check(out.guides.length===120 && new Set(out.guides.map(g=>g.id)).size===120,'export guide count');
const exported=new Map(out.guides.map(g=>[g.id,g]));
for(const g of src.guides) {
  check(g.relatedLegacyIds.every(x=>old.has(x)),'broken legacy link '+g.id);
  const x=exported.get(g.id);
  check(Boolean(x),'missing exported guide '+g.id);
  const {discovery, ...canonical}=x;
  check(JSON.stringify(canonical)===JSON.stringify(g),'canonical field drift '+g.id);
  check(g.reviewStatus==='draft_unreviewed' && g.evidenceStatus==='not_checked','unreviewed status changed '+g.id);
  const purposes=d.purposes.filter(p=>p.choices.some(c=>c.guideId===g.id));
  const cautions=purposes.flatMap(p=>p.choices.filter(c=>c.guideId===g.id).map(c=>c.cautionJa));
  const expected={
    useCases:purposes.map(p=>p.titleJa+'（用途候補・未検証）'),
    limitations:[...new Set([...cautions,...(g.diagramNote?[g.diagramNote]:[])])],
    applicationExample:g.example,comparisonExample:g.contrast,
    media:d.mediaByCategory[g.categoryId]||[],subjects:d.subjectsByCategory[g.categoryId]||[],
    priorityConditions:[g.comparisonPoint||g.definition],
    relatedComposition:d.relatedComposition.filter(r=>r.sourceId===g.id),
    purposes:purposes.map(p=>p.id),
    aiGuidance:{composition:g.aiInstruction,style:null},
    discoveryStatus:'draft_unreviewed'
  };
  check(JSON.stringify(discovery)===JSON.stringify(expected),'all AI discovery fields '+g.id);
}
const relation=out.guides.find(g=>g.id==='C-110').discovery.relatedComposition.find(r=>r.targetId==='C-117');
check(relation?.relationType==='contrast' && relation.reasonJa.includes('画風固定'),'C-110/C-117 fixed variable');
const ui=fs.readFileSync(path.join(root,'pages/Composition.tsx'),'utf8');
check(ui.includes('composition-purpose-choices') && ui.includes('selectedChoice.cautionJa') &&
  ui.includes('detailHref(item.id)') && ui.includes('preferredGuideId') &&
  ui.includes('data-composition-ai-text'),'UI discovery and navigation contract');
console.log('PASS 120 guides/all AI fields, 8 purposes/50 choices, 20 links, 180 legacy IDs (structural only)');
