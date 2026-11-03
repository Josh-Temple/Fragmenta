// Validates the unreviewed discovery sidecar and the generated AI export.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const check = (ok, msg) => { if (!ok) throw Error('composition-discovery: ' + msg); };
const src = read('data/composition-guides.json'), d = read('data/composition-discovery.json');
const legacy = read('data/content-ideas.json'), out = read('public/knowledge/composition-guides.json');
const ids = new Set(src.guides.map(g => g.id)), old = new Set(legacy.ideas.map(i => i.id));
check(ids.size === 120 && legacy.ideas.length === 180 && d.purposes.length === 8,'catalog counts');
check(d.status === 'draft_unreviewed' && out.discovery.status === 'draft_unreviewed','draft status');
check(new Set(d.purposes.map(p => p.id)).size === 8,'duplicate purposes');
for (const c of src.categories) {
 check(d.mediaByCategory[c.id]?.length > 0 && d.subjectsByCategory[c.id]?.length > 0,'missing category tags '+c.id);
}
for (const p of d.purposes) {
 check(p.choices.length >= 5 && new Set(p.choices.map(c=>c.guideId)).size === p.choices.length,'bad choice list '+p.id);
 for (const c of p.choices) check(ids.has(c.guideId) && c.reasonJa.length >= 10 && c.cautionJa.length >= 10,'bad choice '+p.id);
}
const edgeKeys = new Set();
for (const r of d.relatedComposition) {
 check(ids.has(r.sourceId) && ids.has(r.targetId) && r.sourceId !== r.targetId,'unknown/self reference');
 check(['complement','similar','contrast','prerequisite'].includes(r.relationType) && r.reasonJa.length >= 10,'relation semantics');
 const key = r.sourceId+'/'+r.targetId;
 check(!edgeKeys.has(key),'duplicate edge '+key); edgeKeys.add(key);
}
check(out.guides.length === 120,'export count');
for (const g of src.guides) {
 check(g.relatedLegacyIds.every(x=>old.has(x)),'broken 180-item link '+g.id);
 const x=out.guides.find(x=>x.id===g.id);
 check(x && x.reviewStatus===g.reviewStatus && x.evidenceStatus===g.evidenceStatus,'review state '+g.id);
 check(x.discovery.discoveryStatus==='draft_unreviewed' && x.discovery.useCases[0]===g.example &&
 x.discovery.limitations[0]===g.contrast,'editorial derivation '+g.id);
 check(x.discovery.aiGuidance.composition===g.aiInstruction && x.discovery.aiGuidance.style===null,'style separation '+g.id);
 check(x.discovery.relatedComposition.every(r=>ids.has(r.targetId)),'export relation '+g.id);
}
const ui=fs.readFileSync(path.join(root,'pages/Composition.tsx'),'utf8');
check(ui.includes('composition-purpose-choices') && ui.includes('selectedChoice.cautionJa') &&
 ui.includes('detailHref(item.id)'), 'UI purpose/links');
console.log('PASS 120 exported guides, 8 purposes, '+d.relatedComposition.length+' related links, 180 legacy IDs');
