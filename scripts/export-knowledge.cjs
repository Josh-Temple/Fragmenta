// Generate deterministic static exports and the Markdown index from the canonical JSON.
const fs = require('node:fs');
const path = require('node:path');
const { renderIndex, renderExport } = require('./knowledge-render.cjs');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/content-ideas.json'), 'utf8'));
const out = path.join(root, 'public', 'knowledge');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(root, 'docs', 'CONTENT_IDEAS.md'), renderIndex(catalog));
fs.writeFileSync(path.join(out, 'ideas.json'), JSON.stringify(catalog, null, 2) + '\n');
const composition = JSON.parse(fs.readFileSync(path.join(root, 'data/composition-guides.json'), 'utf8'));
const discovery = JSON.parse(fs.readFileSync(path.join(root, 'data/composition-discovery.json'), 'utf8'));
composition.discovery = { schemaVersion: discovery.schemaVersion, status: discovery.status, note: discovery.note, purposes: discovery.purposes };
composition.guides = composition.guides.map(g => {
  const purposes = discovery.purposes.filter(p => p.choices.some(c => c.guideId === g.id));
  const cautions = purposes.flatMap(p => p.choices.filter(c => c.guideId === g.id).map(c => c.cautionJa));
  return {
  ...g,
  discovery: {
    useCases: purposes.map(p => p.titleJa + '（用途候補・未検証）'),
    limitations: [...new Set([...cautions, ...(g.diagramNote ? [g.diagramNote] : [])])],
    applicationExample: g.example,
    comparisonExample: g.contrast,
    media: discovery.mediaByCategory[g.categoryId] || [],
    subjects: discovery.subjectsByCategory[g.categoryId] || [],
    priorityConditions: [g.comparisonPoint || g.definition],
    relatedComposition: discovery.relatedComposition.filter(r => r.sourceId === g.id),
    purposes: discovery.purposes.filter(p => p.choices.some(c => c.guideId === g.id)).map(p => p.id),
    aiGuidance: { composition: g.aiInstruction, style: null },
    discoveryStatus: 'draft_unreviewed',
  },
  };
});
fs.writeFileSync(path.join(out, 'composition-guides.json'), JSON.stringify(composition, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'ideas.md'), renderExport(catalog));
fs.writeFileSync(path.join(root, 'public', 'llms.txt'), [
  '# Fragmenta', '',
  '> The design knowledge catalog consists of proposals and unreviewed drafts. It is not a verified standard, official system, or proof of reuse rights.', '',
  '- [Structured catalog](/knowledge/ideas.json): schema version, stable IDs, proposal status, optional draft guidance, sources and relations.',
  '- [Markdown catalog](/knowledge/ideas.md): generated from the same canonical JSON, including draft and source status.',
  '- [Browse the catalog](/#/knowledge): search and follow related proposals.',
  '- Individual page: /#/knowledge/<stable-id>. Automated collection or use by any AI service is not guaranteed.',
  '- [Composition draft guides](/knowledge/composition-guides.json): 120 draft composition guides, 240 diagrams, 8 purpose-based discovery filters.',
  '- [Browse composition guides](/#/composition): independent draft collection.',
  '- [Design styles](/#/styles): illustrative previews, not official reconstructions.',
  '- [Working UI examples](/#/browse) and [licensing](/#/licenses): verify reuse rights before copying.', '',
].join('\n'));
console.log('Exported ' + catalog.ideas.length + ' proposals and Markdown index from the canonical JSON');
