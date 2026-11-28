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
const { load } = require('./load-data.cjs');
const { compositionBrief } = load('data/composition');
const { getCompositionDiscovery } = load('data/composition-discovery');
const { designStyles } = load('data/design-styles');
const { getStyleSelection, styleSelectionBrief } = load('data/design-style-guidance');
const { patternChoices } = load('data/pattern-choices');
const { getPatternSelection, patternSelectionBrief } = load('data/pattern-selection');

composition.guides = composition.guides.map(g => ({
  ...g, canonical: '/composition/' + g.id, discovery: getCompositionDiscovery(g), href: '/#/composition?id=' + g.id, reviewBrief: compositionBrief(g),
}));
function writeGuides(filename, kind, guides) {
  const data = { schemaVersion: 1, kind, status: 'draft_unreviewed', guides };
  fs.writeFileSync(path.join(out, filename), JSON.stringify(data, null, 2) + '\n');
}
writeGuides('style-guides.json', 'design-style-selection', designStyles.map(s => ({
  ...getStyleSelection(s), canonical: '/styles/' + s.id, reviewBrief: styleSelectionBrief(s),
})));
writeGuides('pattern-guides.json', 'ui-pattern-selection', Object.keys(patternChoices).map(id => ({
  ...getPatternSelection(id), canonical: '/p/' + id, reviewBrief: patternSelectionBrief(id),
})));
fs.writeFileSync(path.join(out, 'composition-guides.json'), JSON.stringify(composition, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'ideas.md'), renderExport(catalog));
fs.writeFileSync(path.join(root, 'public', 'llms.txt'), [
  '# Fragmenta', '',
  '> The design knowledge catalog consists of proposals and unreviewed drafts. It is not a verified standard, official system, or proof of reuse rights.', '',
  '- [Structured catalog](/knowledge/ideas.json): schema version, stable IDs, proposal status, optional draft guidance, sources and relations.',
  '- [Markdown catalog](/knowledge/ideas.md): generated from the same canonical JSON, including draft and source status.',
  '- [Browse the catalog](/#/knowledge): search and follow related proposals.',
  '- Individual page: /#/knowledge/<stable-id>. Automated collection or use by any AI service is not guaranteed.',
  '- [Composition draft guides](/knowledge/composition-guides.json): 120 draft composition guides, 240 diagrams, '+discovery.purposes.length+' purpose-based filters, reasons, cautions, alternatives and source scope.',
  '- [Browse composition guides](/#/composition): independent draft collection.',
  '- [Design style selection guide](/knowledge/style-guides.json): reasons to choose or avoid 24 styles, alternatives, and checks.',
  '- [UI pattern selection guide](/knowledge/pattern-guides.json): conditions, checks, alternatives and reuse status for 18 examples.',
  '- [Design styles](/#/styles): illustrative previews, not official reconstructions.',
  '- [Working UI examples](/#/browse) and [licensing](/#/licenses): verify reuse rights before copying.', '',
].join('\n'));
console.log('Exported ' + catalog.ideas.length + ' proposals and Markdown index from the canonical JSON');
