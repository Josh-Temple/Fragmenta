// Generate static AI-readable exports from the canonical planning registry.
// This runs during npm prebuild/predev; no server or API function is required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/content-ideas.json'), 'utf8'));
const out = path.join(root, 'public', 'knowledge');
fs.mkdirSync(out, { recursive: true });
const itemsById = new Map(catalog.ideas.map(item => [item.id, item]));
const lines = [
  '# Fragmenta — デザイン知識ベース（企画台帳）',
  '',
  '> 180件すべて企画案。完成した解説、検証済み実装、公式のデザイン規格ではありません。',
  '',
  '- JSON: /knowledge/ideas.json',
  '- 人間向けの閲覧・検索: /#/knowledge',
  '- 正本: data/content-ideas.json（GitHub）',
  '',
];
for (const category of catalog.categories) {
  lines.push('## ' + category.label, '');
  for (const item of catalog.ideas.filter(candidate => candidate.categoryId === category.id)) {
    lines.push('### ' + item.titleJa, '');
    lines.push('- ID: ' + item.id);
    lines.push('- 状態: 企画段階');
    lines.push('- 表示: /#/knowledge/' + item.id);
    if (item.editorial) {
      lines.push('- 参考メモ（未レビュー）: ' + item.editorial.summary);
      lines.push('- 向く用途: ' + item.editorial.appropriateUses.join(' / '));
      lines.push('- 避けたい設計: ' + item.editorial.pitfalls.join(' / '));
      lines.push('- 確認事項: ' + item.editorial.reviewChecks.join(' / '));
    }
    if (item.relatedIdeaIds.length) lines.push('- 関連案: ' + item.relatedIdeaIds.map(id => itemsById.get(id)?.titleJa + ' (' + id + ')').join(' / '));
    if (item.relatedExisting.length) lines.push('- 既存の関連項目: ' + item.relatedExisting.map(x => x.kind + ':' + x.id + ' — ' + x.label).join(' / '));
    lines.push('');
  }
}
fs.writeFileSync(path.join(out, 'ideas.json'), JSON.stringify(catalog, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'ideas.md'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(root, 'public', 'llms.txt'), [
  '# Fragmenta',
  '',
  '> A gallery of working UI patterns and an explicitly planned design knowledge catalog. Do not treat catalog proposals as completed designs or verified standards.',
  '',
  '- [Content ideas (structured JSON)](/knowledge/ideas.json): 180 proposal records including stable IDs, categories and curated cross-references.',
  '- [Content ideas (Markdown)](/knowledge/ideas.md): Human- and AI-readable index generated from the same JSON.',
  '- [Browse the planned catalog](/#/knowledge): Search and open a proposal in the website.',
  '- [Working design styles](/#/styles): Style previews and design tokens; these are illustrative, not official reconstructions.',
  '- [Working UI examples](/#/browse): Browse examples; consult license terms before copying code.',
  '- [Rights and licensing](/#/licenses): Copy affordances are not licenses.',
  '',
].join('\n'));
console.log('Exported ' + catalog.ideas.length + ' proposals to static /knowledge/ideas.json and /knowledge/ideas.md');
