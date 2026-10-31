// Smoke-check the connected UI, source data, and the static AI exports.
// Run after "npm run catalog:export"; this is not a real-browser acceptance test.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (ok, message) => { if (!ok) throw Error('Knowledge UI check failed: ' + message); };
const source = JSON.parse(read('data/content-ideas.json'));
const exportJson = JSON.parse(read('public/knowledge/ideas.json'));
const exportMarkdown = read('public/knowledge/ideas.md');
const llms = read('public/llms.txt');
assert(JSON.stringify(source) === JSON.stringify(exportJson), 'JSON export differs from the canonical source');
assert(source.ideas.length === 180 && source.categories.length === 15, 'content inventory');
for (const idea of source.ideas) {
  assert(exportMarkdown.includes('- ID: ' + idea.id), 'missing Markdown ID ' + idea.id);
  assert(exportMarkdown.includes('/#/knowledge/' + idea.id), 'missing Markdown deep link ' + idea.id);
}
const app = read('App.tsx');
const home = read('pages/Home.tsx');
const search = read('pages/SearchResults.tsx');
const listing = read('pages/KnowledgeBase.tsx');
const detail = read('pages/KnowledgeDetail.tsx');
assert(app.includes('path="/knowledge"') && app.includes('path="/knowledge/:id"'), 'routes');
assert(home.includes("path: '/knowledge'") && search.includes('to="/knowledge"'), 'discoverability');
assert(listing.includes("useSearchParams") && listing.includes("relatedIdeaIds") && listing.includes("filtered.map("), 'search and related counts');
assert(detail.includes("useParams") && detail.includes('relatedIdeaIds') && detail.includes("relatedExisting"), 'detail links');
assert(llms.includes('/knowledge/ideas.json') && llms.includes('proposal'), 'AI entry point and proposal limitation');
console.log('PASS knowledge: 180 items / routes / links / exports');
