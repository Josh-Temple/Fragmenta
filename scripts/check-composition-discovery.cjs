// Structural integrity of the unreviewed discovery sidecar and generated AI export.
// Passing this test does not prove editorial accuracy, visual inspection or original-source verification.
const fs = require('node:fs');
const { load } = require('./load-data.cjs');
const { matchesComposition, compositionBrief } = load('data/composition');
const { getCompositionDiscovery } = load('data/composition-discovery');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const check = (ok, msg) => { if (!ok) throw Error('composition-discovery: ' + msg); };
const src = read('data/composition-guides.json'), d = read('data/composition-discovery.json');
const legacy = read('data/content-ideas.json'), out = read('public/knowledge/composition-guides.json');
const ids = new Set(src.guides.map(g => g.id)), old = new Set(legacy.ideas.map(i => i.id));
const categories = new Set(src.categories.map(c => c.id));
check(src.guides.length === 120 && ids.size === 120 && legacy.ideas.length === 180 && old.size === 180,'catalog counts');
check(d.schemaVersion === 2 && d.kind === 'composition-discovery' && d.status === 'draft_unreviewed','sidecar contract');
check(d.purposes.length === 15 && new Set(d.purposes.map(p=>p.id)).size === 15,'purpose IDs');
check(new Set(d.purposes.flatMap(p => p.choices.map(c => c.guideId))).size === ids.size, 'every guide has a purpose');
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
  const {discovery, href, canonical: canonicalUrl, reviewBrief, ...canonical}=x;
  check(canonicalUrl === '/composition/'+g.id,'canonical URL '+g.id);
  check(href === '/#/composition?id='+g.id && reviewBrief === compositionBrief(g), 'detail and brief '+g.id);
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
  for (const [key, value] of Object.entries(expected))
    check(JSON.stringify(discovery[key]) === JSON.stringify(value), 'legacy discovery field '+g.id+'/'+key);
  check(JSON.stringify(discovery) === JSON.stringify(getCompositionDiscovery(g)), 'UI and export '+g.id);
  const review = d.reviewByGuide[g.id];
  check(review?.checkJa.length >= 10 && review.alternativeReasonJa.length >= 10 &&
    ids.has(review.alternativeId) && review.alternativeId !== g.id, 'usable alternative '+g.id);
  for (const c of discovery.choices) {
    const brief = compositionBrief(g, c.purposeId);
    const rawChoice = d.purposes.find(p => p.id === c.purposeId).choices.find(v => v.guideId === g.id);
    const effectiveReview = rawChoice.review ?? review;
    check(c.aiInstruction === (rawChoice.aiInstruction ?? g.aiInstruction) &&
      JSON.stringify(c.review) === JSON.stringify(effectiveReview), 'effective guidance '+g.id);
    for (const field of [c.titleJa, c.reasonJa, c.cautionJa, c.aiInstruction,
      c.review.checkJa, c.review.alternativeId, c.review.alternativeReasonJa])
      check(brief.includes(field), 'purpose lost from brief '+g.id+'/'+c.purposeId);
    check(c.href.endsWith('purpose='+c.purposeId), 'purpose link '+g.id);
    if (c.sourceSupport) check(g.sourceIds.includes(c.sourceSupport.sourceId) &&
      brief.includes(c.sourceSupport.section) && brief.includes(c.sourceSupport.scopeJa), 'source scope '+g.id);
  }
}
for (const p of d.purposes) {
  const fromSearch = src.guides.filter(g => matchesComposition(g, p.titleJa)).map(g => g.id).sort();
  const fromFilter = p.choices.map(c => c.guideId).sort();
  check(JSON.stringify(fromSearch) === JSON.stringify(fromFilter), 'search/filter mismatch '+p.id);
}
const sizeGuide = src.guides.find(g => g.id === 'C-017');
check(!compositionBrief(sizeGuide, 'power').includes(sizeGuide.aiInstruction) &&
  compositionBrief(sizeGuide, 'solitude').includes(sizeGuide.aiInstruction), 'purpose-specific instruction');
const relation=out.guides.find(g=>g.id==='C-110').discovery.relatedComposition.find(r=>r.targetId==='C-117');
check(relation?.relationType==='contrast' && relation.reasonJa.includes('画風固定'),'C-110/C-117 fixed variable');
const ui=fs.readFileSync(path.join(root,'pages/Composition.tsx'),'utf8');
check(ui.includes('composition-purpose-choices') && ui.includes('selectedChoice.cautionJa') &&
  ui.includes('detailHref(item.id)') && ui.includes('preferredGuideId') &&
  ui.includes('data-composition-ai-text'),'UI discovery and navigation contract');
console.log('PASS 120 guides/all AI fields, 15 purposes/all purpose choices, 20 links, 180 legacy IDs (structural only)');
