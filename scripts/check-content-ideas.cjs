// Independent content ideas registry integrity check. Run: node scripts/check-content-ideas.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'content-ideas.json'), 'utf8'));
const md = fs.readFileSync(path.join(root, 'docs', 'CONTENT_IDEAS.md'), 'utf8');
const fail = msg => { throw new Error(msg); };
const categories = new Map(data.categories.map(c => [c.id, c]));
const ids = new Map(data.ideas.map(e => [e.id, e]));
if (categories.size !== 15 || data.ideas.length !== 180 || ids.size !== 180) fail('Expected 15 categories, 180 unique ideas');
for (const c of data.categories) {
  if (data.ideas.filter(e => e.categoryId === c.id).length !== 12) fail('Category cardinality: '+c.id);
}
for (const e of data.ideas) {
  if (e.status !== 'proposal' || !categories.has(e.categoryId)) fail('Unknown status/category: '+e.id);
  if (!md.includes('### '+e.id+'\\n')) fail('Missing Markdown item: '+e.id);
  if (new Set(e.relatedIdeaIds).size !== e.relatedIdeaIds.length) fail('Repeated relation: '+e.id);
  for (const ref of e.relatedIdeaIds) {
    if (ref === e.id || !ids.has(ref)) fail('Broken link: '+e.id+' -> '+ref);
    if (!ids.get(ref).relatedIdeaIds.includes(e.id)) fail('Non-reciprocal link: '+e.id+' -> '+ref);
  }
  for (const ref of e.relatedExisting) {
    if (!['style','pattern'].includes(ref.kind) || !/^https:\\/\\/fragmenta-brown\\.vercel\\.app\\/#\\//.test(ref.href)) fail('Invalid existing reference: '+e.id);
  }
}
console.log('OK: 180 ideas / 15 categories / '+data.ideas.reduce((n,x)=>n+x.relatedIdeaIds.length,0)+' reciprocal idea links / '+data.ideas.reduce((n,x)=>n+x.relatedExisting.length,0)+' existing references.');
