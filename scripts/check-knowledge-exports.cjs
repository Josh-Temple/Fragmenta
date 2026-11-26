// Detect stale or unreviewed AI-readable static exports; no network or deployment.
const fs = require('node:fs');
const path = require('node:path');
const { renderIndex, renderExport } = require('./knowledge-render.cjs');
const root = path.resolve(__dirname, '..');
const text = file => fs.readFileSync(path.join(root, file), 'utf8');
function checkExports(files) {
  const errors = [];
  let catalog;
  try { catalog = JSON.parse(files.catalog); }
  catch (err) { return ['canonical catalog JSON is invalid: ' + err.message]; }
  if (files.json !== JSON.stringify(catalog, null, 2) + '\n') errors.push('static JSON is stale or differs from canonical catalog');
  if (files.markdown !== renderExport(catalog)) errors.push('static Markdown is stale or differs from canonical catalog');
  if (files.index !== renderIndex(catalog)) errors.push('Markdown index is stale or differs from canonical catalog');
  return errors;
}
function readFiles() { return {
  catalog: text('data/content-ideas.json'),
  json: text('public/knowledge/ideas.json'),
  markdown: text('public/knowledge/ideas.md'),
  index: text('docs/CONTENT_IDEAS.md'),
}; }
if (require.main === module) {
  try {
    const errors = checkExports(readFiles());
    const { load } = require('./load-data.cjs');
    const { designStyles } = load('data/design-styles');
    const { getStyleSelection, styleSelectionBrief } = load('data/design-style-guidance');
    const { createStylePrompt, createBlendedStylePrompt } = load('data/design-style-export');
    const { patternChoices } = load('data/pattern-choices');
    const { getPatternSelection, patternSelectionBrief } = load('data/pattern-selection');
    const { ideas, sourceById, knowledgeReviewBrief } = load('data/knowledge');
    const assert = require('node:assert/strict');
    const exportsFor = (file, count) => {
      const doc = JSON.parse(text('public/knowledge/' + file));
      assert.equal(doc.guides.length, count);
      assert(text('public/llms.txt').includes('/knowledge/' + file));
      return new Map(doc.guides.map(g => [g.id, g]));
    };
    const styles = exportsFor('style-guides.json', 24);
    const patterns = exportsFor('pattern-guides.json', 18);
    for (const style of designStyles) {
      const guide = getStyleSelection(style), brief = styleSelectionBrief(style);
      assert.deepEqual(styles.get(style.id), { ...guide, canonical: '/styles/' + style.id, reviewBrief: brief });
      for (const field of [guide.use, guide.reason, guide.avoid, guide.check, guide.sourceScope]) assert(brief.includes(field));
      for (const a of guide.alternatives) assert(styles.has(a.id) && brief.includes(a.reason));
      for (const screen of ['dashboard', 'article']) assert(createStylePrompt(style, screen).includes(brief));
    }
    const blended = createBlendedStylePrompt(designStyles[0], designStyles[1], 'article', 40);
    assert(blended.includes(styleSelectionBrief(designStyles[0])) && blended.includes(styleSelectionBrief(designStyles[1])));
    for (const id of Object.keys(patternChoices)) {
      const guide = getPatternSelection(id), brief = patternSelectionBrief(id);
      assert.deepEqual(patterns.get(id), { ...guide, canonical: '/p/' + id, reviewBrief: brief });
      for (const field of [guide.use, guide.avoid, guide.check, guide.rights.status]) assert(brief.includes(field));
      for (const a of guide.alternatives) assert(patterns.has(a.id) && brief.includes(a.reason));
    }
    for (const idea of ideas) {
      const brief = knowledgeReviewBrief(idea);
      assert(brief.includes(idea.id) && brief.includes('未確認'));
      for (const line of [...idea.editorial.appropriateUses, ...idea.editorial.pitfalls, ...idea.editorial.reviewChecks]) assert(brief.includes(line));
      for (const id of idea.editorial.sourceIds ?? []) assert(brief.includes(sourceById[id].scope));
    }
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log('PASS static JSON / Markdown / index match canonical catalog');
  } catch (err) { console.error('knowledge export check failed: '+err.message); process.exitCode=1; }
}
module.exports={checkExports,readFiles};
