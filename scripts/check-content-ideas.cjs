// Validate the single-source Fragmenta content registry and curated links.
// Run: node scripts/check-content-ideas.cjs
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { renderIndex } = require('./knowledge-render.cjs');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fail = text => { throw Error('Content ideas validation: ' + text); };
const data = JSON.parse(read('data/content-ideas.json'));
const doc = read('docs/CONTENT_IDEAS.md');
const categories = new Map(data.categories.map(item => [item.id, item]));
const ideas = new Map(data.ideas.map(item => [item.id, item]));
const baseline = JSON.parse(read('scripts/knowledge-baseline.json'));
if (data.schemaVersion !== 2) fail('Unexpected schema version');
if (doc !== renderIndex(data)) fail('Markdown index is stale; run catalog:export');
for (const [id, original] of Object.entries(baseline.ideas)) {
  const item = ideas.get(id);
  if (!item || item.categoryId !== original.categoryId || item.sequence !== original.sequence || item.status !== original.status) fail('Baseline ID/category/status changed: ' + id);
}
for (const [id, originalHash] of Object.entries(baseline.drafts)) {
  const draft = ideas.get(id)?.editorial;
  if (!draft) fail('Baseline draft removed: ' + id);
  const original = Object.fromEntries(['reviewStatus','summary','appropriateUses','pitfalls','reviewChecks','evidenceStatus'].map(key => [key, draft[key]]));
  // Hash in the same order recorded at baseline.
  const actual = crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex');
  if (actual !== originalHash) fail('Baseline draft changed; review and deliberately update baseline: ' + id);
}
for (const [a, b] of baseline.relations) if (!ideas.get(a)?.relatedIdeaIds.includes(b) || !ideas.get(b)?.relatedIdeaIds.includes(a)) fail('Baseline reciprocal pair removed: ' + a + ' / ' + b);

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
  if (item.titleEn !== undefined && (typeof item.titleEn !== 'string' || !item.titleEn.trim())) fail('Invalid English title: ' + item.id);
  for (const field of ['aliases', 'tags']) if (item[field] && (!Array.isArray(item[field]) || item[field].some(x => typeof x !== 'string' || !x.trim()))) fail('Invalid ' + field + ': ' + item.id);
  const seenRelations = new Set();
  for (const relation of item.relations ?? []) {
    if (seenRelations.has(relation.targetId) || !item.relatedIdeaIds.includes(relation.targetId) || !['similar','contrast','complement','application','foundation','example'].includes(relation.type) || !relation.reasonJa?.trim()) fail('Invalid typed relation: ' + item.id);
    const reverse = ideas.get(relation.targetId)?.relations?.find(r => r.targetId === item.id);
    if (!reverse || reverse.type !== relation.type || reverse.reasonJa !== relation.reasonJa) fail('Typed relation missing reverse: ' + item.id + ' -> ' + relation.targetId);
    seenRelations.add(relation.targetId);
  }
  if (item.editorial) {
    drafts++;
    const d = item.editorial;
    if (d.reviewStatus !== 'draft_unreviewed' || d.evidenceStatus !== 'not_checked' || !d.summary || d.summary.length < 20) fail('Invalid draft state/summary: ' + item.id);
    if (d.sourceIds && (!Array.isArray(d.sourceIds) || d.sourceIds.some(id => !data.sourceCatalog[id]))) fail('Unknown source: ' + item.id);
    if (d.practicalExample && (!d.implementationNotes || !d.accessibilityNotes || !d.aiInstruction || !d.updatedOn || !['partial','not_checked'].includes(d.sourceStatus))) fail('Incomplete guidance: ' + item.id);
    if (d.sourceStatus === 'partial' && !d.sourceIds?.length) fail('Partial source status without source: ' + item.id);
    for (const field of ['appropriateUses', 'pitfalls', 'reviewChecks']) {
      if (!Array.isArray(d[field]) || d[field].length < 2 || d[field].some(x => typeof x !== 'string' || x.trim().length < 4)) fail('Invalid draft field ' + field + ': ' + item.id);
    }
  }
}
if (styleIds.size !== 24 || patternIds.size !== 18) fail('Existing registry counts changed unexpectedly');
for (const [id, source] of Object.entries(data.sourceCatalog)) {
  if (!source.title || !source.publisher || !source.url?.startsWith('https://') || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedOn) || !source.scope || !source.rights) fail('Invalid source metadata: ' + id);
}
console.log(`PASS: ${ideas.size} proposals / ${drafts} drafts / ${data.ideas.filter(i => i.editorial?.practicalExample).length} enriched / ${baseline.relations.length} baseline reciprocal pairs preserved`);
