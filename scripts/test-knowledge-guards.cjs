// Exercise data-loss guards against isolated fixtures, not the working catalog.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { renderIndex } = require('./knowledge-render.cjs');
const root = path.resolve(__dirname, '..');
const original = JSON.parse(fs.readFileSync(path.join(root, 'data/content-ideas.json'), 'utf8'));
const required = ['scripts/check-content-ideas.cjs','scripts/knowledge-render.cjs','scripts/knowledge-baseline.json','data/design-styles.ts','data/definitions.tsx','data/patterns/practical-patterns.tsx'];
const cases = [
  ['removed draft', d => { delete d.ideas.find(x => x.id === 'idea-visual-history-01').editorial; }, 'Baseline draft removed'],
  ['overwritten draft', d => { d.ideas.find(x => x.id === 'idea-visual-history-01').editorial.summary = '意図しない上書き'; }, 'Baseline draft changed'],
  ['lost relation', d => { const i = d.ideas.find(x => x.id === 'idea-layout-01'); i.relatedIdeaIds = i.relatedIdeaIds.filter(x => x !== 'idea-layout-08'); }, 'Baseline reciprocal pair removed'],
  ['missing source', d => { d.ideas.find(x => x.id === 'idea-forms-03').editorial.sourceIds = ['unknown-source']; }, 'Unknown source'],
];
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'fragmenta-catalog-'));
try {
  for (const file of required) {
    const target = path.join(temp, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, file), target);
  }
  fs.mkdirSync(path.join(temp, 'docs'), { recursive: true });
  for (const [name, mutate, expected] of cases) {
    const data = structuredClone(original); mutate(data);
    fs.writeFileSync(path.join(temp, 'data/content-ideas.json'), JSON.stringify(data));
    fs.writeFileSync(path.join(temp, 'docs/CONTENT_IDEAS.md'), renderIndex(data));
    const run = spawnSync(process.execPath, [path.join(temp, 'scripts/check-content-ideas.cjs')], { encoding:'utf8' });
    if (run.status === 0 || !(run.stderr + run.stdout).includes(expected)) throw Error('Guard did not reject ' + name + ': ' + run.stderr);
    console.log('PASS rejected ' + name);
  }
} finally { fs.rmSync(temp, { recursive:true, force:true }); }
