// Negative fixtures: rejected only when the expected error is present.
const fs = require('node:fs');
const path = require('node:path');
const { validate } = require('./check-knowledge-graph.cjs');
const source = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/content-ideas.json'), 'utf8'));
const clone = () => structuredClone(source);
const cases = [
 ['reversed direction', d => { const a=d.ideas.find(x=>x.id==='idea-components-05');
   const r=a.relations.find(x=>x.type==='application');[r.fromId,r.toId]=[r.toId,r.fromId];}, 'reverse direction mismatch'],
 ['unknown endpoint', d => { const a=d.ideas.find(x=>x.id==='idea-components-05');
   a.relations.find(x=>x.type==='application').fromId='invalid-ID';}, 'invalid directed endpoints'],
 ['missing direction', d => { const a=d.ideas.find(x=>x.id==='idea-components-05');
   delete a.relations.find(x=>x.type==='application').toId;}, 'invalid directed endpoints'],
 ['retired link reintroduced', d => { for (const [a,b] of [['idea-components-03','idea-forms-02'],['idea-forms-02','idea-components-03']])
   d.ideas.find(x=>x.id===a).relatedIdeaIds.push(b);}, 'retired link still active'],
 ['false review flag', d => { d.ideas[0].editorial.reviewStatus='reviewed';}, 'unreviewed editorial state'],
 ['self-link', d => { const a=d.ideas[0];a.relatedIdeaIds.push(a.id);a.relations.push({targetId:a.id,type:'similar',reasonJa:'意図せず登録された自己リンクの検証'});}, 'self or unknown related idea'],
 ['unknown source', d => { d.ideas[0].editorial.sourceIds=['not-registered-source'];}, 'unknown editorial source'],
 ['duplicated source', d => { d.ideas.find(x=>x.id==='idea-components-02').editorial.sourceIds.push('w3c-combobox');}, 'duplicate source IDs'],
 ['unknown category', d => { d.ideas[0].categoryId='nonexistent';}, 'invalid category/sequence or ID'],
 ['unexpected reciprocal pair', d => { const a=d.ideas.find(x=>x.id==='idea-visual-history-01');
   const b=d.ideas.find(x=>x.id==='idea-visual-history-02');
   a.relatedIdeaIds.push(b.id);b.relatedIdeaIds.push(a.id);
   a.relations.push({targetId:b.id,type:'contrast',reasonJa:'実装テストのために挿入された未承認の関連'});
   b.relations.push({targetId:a.id,type:'contrast',reasonJa:'実装テストのために挿入された未承認の関連'});
   }, 'active graph differs from reviewed relation baseline'],
 ['missing reciprocal', d => { const a=d.ideas.find(x=>x.id==='idea-components-05');
   a.relatedIdeaIds=a.relatedIdeaIds.filter(id=>id!=='idea-forms-01');}, 'every active link must have exactly one typed relation'],
 ['two-sided relation retag', d => { for (const id of ['idea-components-05','idea-forms-01']) {const a=d.ideas.find(x=>x.id===id);
   const rel=a.relations.find(r=>r.targetId===(id==='idea-components-05'?'idea-forms-01':'idea-components-05'));
   rel.type='foundation';} }, 'relation provenance changed'],
 ['two-sided direction reversal', d => {for (const id of ['idea-components-05','idea-forms-01']) {const a=d.ideas.find(x=>x.id===id);
   const rel=a.relations.find(r=>r.targetId===(id==='idea-components-05'?'idea-forms-01':'idea-components-05'));
   [rel.fromId, rel.toId]=[rel.toId, rel.fromId];} }, 'relation provenance changed'],
 ['two-sided explanation replacement', d => {for (const id of ['idea-components-05','idea-forms-01']) {const a=d.ideas.find(x=>x.id===id);
   const rel=a.relations.find(r=>r.targetId===(id==='idea-components-05'?'idea-forms-01':'idea-components-05'));
   rel.reasonJa='方向と分類は同じだが未承認で説明を変更した。';} }, 'relation provenance changed'],
 ['source URL substitution', d => {d.sourceCatalog['w3c-combobox'].url='https://example.org/invalid';}, 'source catalog provenance changed'],
 ['source registry expansion', d => {d.sourceCatalog['new-unapproved-source']={...d.sourceCatalog['w3c-combobox']};}, 'source catalog provenance changed'],
 ['source reassignment', d => {const a=d.ideas.find(x=>x.id==='idea-typography-06');a.editorial.sourceIds=['w3c-carousel'];}, 'source assignments provenance changed'],
 ['unsafe URL scheme', d => {d.sourceCatalog['w3c-combobox'].url='javascript:alert(1)';}, 'invalid source metadata'],
 ['URL credentials', d => {d.sourceCatalog['w3c-combobox'].url='https://user:pw@www.w3.org/';}, 'invalid source metadata'],
 ['localhost URL', d => {d.sourceCatalog['w3c-combobox'].url='https://localhost/';}, 'invalid source metadata'],
 ['malformed catalog fails closed', d => {d.ideas[0].relatedIdeaIds=null;}, 'invalid catalog shape'],
 ['false partial source status', d => {d.ideas[0].editorial.sourceStatus='partial';}, 'source coverage must remain partial or not_checked']
];
for (const [name,mutate,expected] of cases) {
 const data=clone();mutate(data);
 const result=validate(data);
 if (!result.errors.some(s=>s.includes(expected))) throw Error(name+' was not rejected: '+result.errors.join(' | '));
 console.log('PASS rejected '+name);
}
