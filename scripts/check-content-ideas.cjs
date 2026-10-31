// Validate Fragmenta's proposed-content catalog; read-only and no runtime dependencies.
// Usage: node scripts/check-content-ideas.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'content-ideas.json'), 'utf8'));
const md = fs.readFileSync(path.join(root, 'docs', 'CONTENT_IDEAS.md'), 'utf8');
const fail = msg => { throw new Error(msg); };
const categories = new Map(data.categories.map(c => [c.id, c]));
const ideas = new Map(data.ideas.map(e => [e.id, e]));
if (categories.size !== 15 || data.ideas.length !== 180 || ideas.size !== 180) fail('Expected 15 categories and 180 unique ideas');
for (const category of data.categories) {
  if (data.ideas.filter(e => e.categoryId === category.id).length !== 12) fail('Category size mismatch: ' + category.id);
}
const mdHeadings = new Set(md.split(String.fromCharCode(10)).filter(x => x.startsWith('### ')).map(x => x.slice(4)));
for (const idea of data.ideas) {
  if (idea.status !== 'proposal' || !categories.has(idea.categoryId)) fail('Unknown status/category: ' + idea.id);
  if (!mdHeadings.has(idea.id)) fail('Missing Markdown item: ' + idea.id);
  if (new Set(idea.relatedIdeaIds).size !== idea.relatedIdeaIds.length) fail('Duplicate relations: ' + idea.id);
  for (const relation of idea.relatedIdeaIds) {
    if (relation === idea.id || !ideas.has(relation)) fail('Broken relation: ' + idea.id + ' -> ' + relation);
    if (!ideas.get(relation).relatedIdeaIds.includes(idea.id)) fail('Non-reciprocal relation: ' + idea.id + ' -> ' + relation);
  }
  for (const reference of idea.relatedExisting) {
    if (!['style', 'pattern'].includes(reference.kind) || !reference.href.startsWith('https://fragmenta-brown.vercel.app/#/')) fail('Invalid existing reference: ' + idea.id);
  }
}
console.log('OK: 180 ideas / 15 categories / ' + data.ideas.reduce((n, e) => n + e.relatedIdeaIds.length, 0) + ' reciprocal links / ' + data.ideas.reduce((n, e) => n + e.relatedExisting.length, 0) + ' existing references');
