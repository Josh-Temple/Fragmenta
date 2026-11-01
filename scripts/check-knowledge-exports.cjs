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
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log('PASS static JSON / Markdown / index match canonical catalog');
  } catch (err) { console.error('knowledge export check failed: '+err.message); process.exitCode=1; }
}
module.exports={checkExports,readFiles};
