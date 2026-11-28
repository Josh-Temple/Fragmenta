// Source and export smoke test; use after npm run catalog:export.
// Not an assertion of browser acceptance or external URL availability.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const check = (ok, msg) => { if (!ok) throw Error('Knowledge smoke: ' + msg); };
const source = JSON.parse(read('data/content-ideas.json'));
const exported = JSON.parse(read('public/knowledge/ideas.json'));
const markdown = read('public/knowledge/ideas.md');
const llms = read('public/llms.txt');
const { renderExport, renderIndex } = require('./knowledge-render.cjs');
check(JSON.stringify(source) === JSON.stringify(exported), 'Export data does not match source');
check(markdown === renderExport(source), 'Markdown export is stale');
check(read('docs/CONTENT_IDEAS.md') === renderIndex(source), 'Markdown index is stale');
check(source.ideas.length === 180 && source.categories.length === 15, 'Inventory');
check(source.ideas.filter(x => x.editorial).length >= 57, 'Editorial coverage');
for (const idea of source.ideas) {
  check(markdown.includes('- ID: ' + idea.id), 'Missing Markdown ID ' + idea.id);
  check(markdown.includes('/#/knowledge/' + idea.id), 'Missing deep link ' + idea.id);
  if (idea.editorial) check(markdown.includes(idea.editorial.summary), 'Missing draft synopsis ' + idea.id);
}
const app = read('App.tsx');
const home = read('pages/Home.tsx');
const globalSearch = read('pages/SearchResults.tsx');
const atlas = read('pages/DesignStyles.tsx');
const pattern = read('pages/AnimationDetail.tsx');
const listing = read('pages/KnowledgeBase.tsx');
const detail = read('pages/KnowledgeDetail.tsx');
check(app.includes('path="/knowledge"') && app.includes('path="/knowledge/:id"'), 'Routes');
check(home.slice(home.indexOf('ロードマップ・今後の企画')).includes('to="/knowledge"') && globalSearch.includes("knowledge?"), 'Navigation and query handoff');
check(listing.includes('draftOnly') && listing.includes('setParams') && listing.includes('filtered.slice(0, visibleCount).map(') && listing.includes('setVisibleCount'), 'Search, filter and paged draft-only view');
check(detail.includes('useParams') && detail.includes('relatedIdeaIds') && detail.includes('relatedExisting') && detail.includes('siblings'), 'Detail and navigation');
check(atlas.includes('relatedKnowledge') && atlas.includes('/knowledge/'), 'Design atlas backlink');
check(pattern.includes('relatedKnowledge') && pattern.includes('/knowledge/'), 'Pattern backlink');
check(llms.includes('/knowledge/ideas.json') && llms.includes('proposal'), 'AI entry point and proposal caution');
console.log('PASS: static knowledge registry/export/UI source checks (not browser QA)');
