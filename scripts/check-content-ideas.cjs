// Validate the single-source Fragmenta content registry and curated links.
// Run: node scripts/check-content-ideas.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fail = text => { throw Error('Content ideas validation: ' + text); };
const data = JSON.parse(read('data/content-ideas.json'));
const doc = read('docs/CONTENT_IDEAS.md');
const categories = new Map(data.categories.map(item => [item.id, item]));
const ideas = new Map(data.ideas.map(item => [item.id, item]));
if (categories.size !== 15 || data.categories.length !== 15) fail('Expected 15 unique categories');
if (ideas.size !== 180 || data.ideas.length !== 180) fail('Expected 180 unique ideas');
const styleSource = read('data/design-styles.ts');
const styleRegistry = styleSource.slice(styleSource.indexOf('export const designStyles:'));
const styleIds = new Set([...styleRegistry.matchAll(/"id": "([^"]+)"/g)].map(m => m[1]));
const definitions = read('data/definitions.tsx');
const practical = read('data/patterns/practical-patterns.tsx');
const patternIds = new Set([
  ...[...definitions.matchAll(/^\s*'([^']+)':\s*\w+[, ]*$/gm)].map(m => m[1]),
  ...[...practical.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(m => m[1]),
]);
const headings = [...doc.matchAll(/^### (idea-[a-z0-9-]+)$/gm)].map(m => m[1]);
if (headings.length !== 180 || new Set(headings).size !== 180) fail('Markdown index out of sync');
const listed = new Set(headings);
const titles = new Set();
let drafts = 0;
for (const category of data.categories) {
  const contents = data.ideas.filter(item => item.categoryId === category.id);
  if (contents.length !== 12) fail('Invalid category size: ' + category.id);
  if (!category.label || !Number.isInteger(category.sequence)) fail('Invalid category: ' + category.id);
}
for (const item of data.ideas) {
  if (!categories.has(item.categoryId)) fail('Unknown category: ' + item.id);
  const expected = 'idea-' + item.categoryId + '-' + String(item.sequence).padStart(2, '0');
  if (item.id !== expected || item.status !== 'proposal') fail('Bad ID/status: ' + item.id);
  if (!item.titleJa || !item.titleJa.trim() || titles.has(item.titleJa)) fail('Missing/duplicate name: ' + item.id);
  titles.add(item.titleJa);
  if (!listed.has(item.id)) fail('Missing Markdown heading: ' + item.id);
  if (!Array.isArray(item.relatedIdeaIds) || new Set(item.relatedIdeaIds).size !== item.relatedIdeaIds.length) fail('Duplicate/invalid related ideas: ' + item.id);
  for (const id of item.relatedIdeaIds) {
    if (id === item.id || !ideas.has(id)) fail('Missing/self reference: ' + item.id + ' -> ' + id);
    if (!ideas.get(id).relatedIdeaIds.includes(item.id)) fail('Non-reciprocal link: ' + item.id + ' -> ' + id);
    if (!doc.includes('](#' + id + ')')) fail('Missing cross-link in Markdown: ' + id);
  }
  for (const ref of item.relatedExisting) {
    if (!['style', 'pattern'].includes(ref.kind) || !ref.label) fail('Invalid reference: ' + item.id);
    const registry = ref.kind === 'style' ? styleIds : patternIds;
    if (!registry.has(ref.id)) fail('Reference missing in current source: ' + ref.kind + ':' + ref.id);
    const href = 'https://fragmenta-brown.vercel.app/#/' +
      (ref.kind === 'style' ? 'styles?style=' + encodeURIComponent(ref.id) : 'p/' + encodeURIComponent(ref.id));
    if (ref.href !== href) fail('Noncanonical existing link: ' + item.id + ' -> ' + ref.href);
    if (!doc.includes('[' + ref.label + '](' + href + ')')) fail('Missing Markdown existing link: ' + item.id);
  }
  if (item.editorial) {
    drafts++;
    const d = item.editorial;
    if (d.reviewStatus !== 'draft_unreviewed' || d.evidenceStatus !== 'not_checked' || !d.summary || d.summary.length < 20) fail('Invalid draft state/summary: ' + item.id);
    for (const field of ['appropriateUses', 'pitfalls', 'reviewChecks']) {
      if (!Array.isArray(d[field]) || d[field].length < 2 || d[field].some(x => typeof x !== 'string' || x.trim().length < 4)) fail('Invalid draft field ' + field + ': ' + item.id);
    }
  }
}
if (styleIds.size !== 24 || patternIds.size !== 18) fail('Existing registry counts changed unexpectedly');
if (drafts !== 57) fail('Expected 57 editorial drafts, got ' + drafts);
console.log('PASS: 180 proposed ideas / 57 unreviewed drafts / 15 categories / 154 reciprocal pairs / 20 existing references');
