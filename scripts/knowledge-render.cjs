// Deterministic Markdown projections; data/content-ideas.json is the only editorial source.
const label = { similar: '類似', contrast: '対照', complement: '補完', application: '応用', foundation: '前提・基礎', example: '具体例' };
function relationDescription(currentId, rel) {
  if (!rel) return '関係未分類';
  if (!rel.fromId || !rel.toId) return label[rel.type] + '：' + rel.reasonJa;
  const from = currentId === rel.fromId;
  const directionalLabel = rel.type === 'application' ? (from ? '応用先' : '応用元')
    : rel.type === 'example' ? (from ? '具体例' : '例示する対象')
    : (from ? '前提として支える' : '前提・基礎');
  return directionalLabel + '（' + rel.fromId + ' → ' + rel.toId + '）' + '：' + rel.reasonJa + ' / 方向は編集案・未レビュー';
}
function renderIndex(catalog) {
  const byId = new Map(catalog.ideas.map(i => [i.id, i]));
  const lines = ['# Fragmenta — コンテンツ候補（索引）', '',
    '> 正本は `data/content-ideas.json`。この文書は生成物です。全項目は企画段階で、説明は未レビューです。', '',
    `スキーマ: ${catalog.schemaVersion} / ${catalog.ideas.length}件 / ${catalog.categories.length}分野`, '',
    '関係の起点と行き先も編集案です。検証状態と利用条件を確認してください。' , ''];
  for (const category of catalog.categories) {
    lines.push('## category-' + category.id, '', '**' + category.label + '**', '');
    for (const item of catalog.ideas.filter(i => i.categoryId === category.id)) {
      lines.push('### ' + item.id, '', '**' + item.titleJa + '**' + (item.titleEn ? ` (${item.titleEn})` : '') + ' ・ 状態：企画段階', '');
      if (item.editorial) lines.push('参考メモ（未レビュー）：' + item.editorial.summary, '');
      if (item.relatedIdeaIds.length) lines.push('関連案：' + item.relatedIdeaIds.map(id => `[${byId.get(id).titleJa}](#${id})`).join(' / '), '');
      if (item.relatedExisting.length) lines.push('既存の関連項目：' + item.relatedExisting.map(ref => `[${ref.label}](${ref.href})`).join(' / '), '');
    }
  }
  return lines.join('\n').trimEnd() + '\n';
}
function renderExport(catalog) {
  const byId = new Map(catalog.ideas.map(i => [i.id, i]));
  const lines = ['# Fragmenta — デザイン知識ベース（企画台帳）', '',
    '> すべて企画案です。参考メモは未レビューであり、公式仕様や完成した実装ではありません。参考資料の部分確認は内容全体の検証・利用許諾を意味しません。', '',
    `- スキーマ: ${catalog.schemaVersion}`, '- JSON: /knowledge/ideas.json', '- 閲覧・検索: /#/knowledge', ''];
  for (const category of catalog.categories) {
    lines.push('## ' + category.label, '');
    for (const item of catalog.ideas.filter(i => i.categoryId === category.id)) {
      lines.push('### ' + item.id, '', `- 名前: ${item.titleJa}${item.titleEn ? ' / ' + item.titleEn : ''}`,
        '- ID: ' + item.id, '- 状態: ' + item.status, '- 表示: /#/knowledge/' + item.id);
      if (item.aliases?.length) lines.push('- 別名: ' + item.aliases.join(' / '));
      if (item.tags?.length) lines.push('- タグ: ' + item.tags.join(' / '));
      const e = item.editorial;
      if (e) {
        lines.push('- 編集状態: ' + e.reviewStatus, '- 根拠確認状態: ' + e.evidenceStatus, '- 参考メモ: ' + e.summary,
          ...(e.updatedOn ? ['- 内容更新日: ' + e.updatedOn] : []), ...(e.sourceStatus ? ['- 参考資料確認: ' + e.sourceStatus] : []),
          '- 向く用途: ' + e.appropriateUses.join(' / '), '- 避けたい設計: ' + e.pitfalls.join(' / '), '- 確認事項: ' + e.reviewChecks.join(' / '));
        for (const [key, name] of [['practicalExample','使用例'], ['implementationNotes','実装時の注意'], ['accessibilityNotes','アクセシビリティ'], ['aiInstruction','AIへの指示例']]) {
          if (e[key]) lines.push('- ' + name + ': ' + e[key]);
        }
        for (const id of e.sourceIds ?? []) {
          const source = catalog.sourceCatalog[id];
          lines.push(`- 参考資料: ${source.publisher} — ${source.title} (${source.url}) / 確認日 ${source.checkedOn} / 確認範囲 ${source.scope} / ${source.rights}`);
        }
      }
      for (const id of item.relatedIdeaIds) {
        const rel = (item.relations ?? []).find(r => r.targetId === id);
        lines.push(`- 関連案: ${id} — ${byId.get(id).titleJa} / ${relationDescription(item.id, rel)}`);
      }
      for (const ref of item.relatedExisting) lines.push(`- 既存資料: ${ref.kind}:${ref.id} — ${ref.label} (${ref.href})`);
      lines.push('');
    }
  }
  return lines.join('\n').trimEnd() + '\n';
}
module.exports = { renderIndex, renderExport };
