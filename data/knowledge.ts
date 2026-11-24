import rawCatalog from './content-ideas.json';

export type RelationType = 'similar' | 'contrast' | 'complement' | 'application' | 'foundation' | 'example';
export type KnowledgeSource = {
  title: string; publisher: string; url: string; checkedOn: string; scope: string; rights: string;
};
export type KnowledgeIdea = {
  id: string; categoryId: string; titleJa: string; titleEn?: string; aliases?: string[]; tags?: string[];
  sequence: number; status: 'proposal'; relatedIdeaIds: string[];
  relatedExisting: { kind: 'style' | 'pattern'; id: string; label: string; href: string }[];
  relations?: { targetId: string; type: RelationType; reasonJa: string; fromId?: string; toId?: string; directionReviewStatus?: 'draft_unreviewed' }[];
  editorial?: {
    reviewStatus: 'draft_unreviewed'; evidenceStatus: 'not_checked'; summary: string;
    appropriateUses: string[]; pitfalls: string[]; reviewChecks: string[];
    practicalExample?: string; implementationNotes?: string; accessibilityNotes?: string;
    aiInstruction?: string; sourceIds?: string[]; updatedOn?: string; sourceStatus?: 'partial' | 'not_checked';
  };
};
export type KnowledgeCatalog = {
  schemaVersion: number; generatedOn: string; sourceCatalog: Record<string, KnowledgeSource>;
  categories: { id: string; label: string; sequence: number }[]; ideas: KnowledgeIdea[];
};
export const catalog = rawCatalog as KnowledgeCatalog;
export const categories = catalog.categories;
export const ideas = catalog.ideas;
export const sourceById = catalog.sourceCatalog;
/** Only allow well-formed public HTTPS links; data validation is a separate gate. */
export function isSafeKnowledgeSourceUrl(value: string): boolean {
  if (typeof value !== 'string' || value.trim() !== value || /[\u0000-\u001F\u007F]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !!url.hostname &&
      url.hostname !== 'localhost' && !url.hostname.endsWith('.localhost');
  } catch { return false; }
}

export const ideaById = new Map(ideas.map(idea => [idea.id, idea]));
export const categoryLabel = (id: string) => categories.find(category => category.id === id)?.label ?? id;
const normalize = (value: string) => value.normalize('NFKC').toLowerCase();
export function matchesKnowledge(idea: KnowledgeIdea, query: string): boolean {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const draft = idea.editorial;
  const fields = [idea.id, idea.titleJa, idea.titleEn ?? '', categoryLabel(idea.categoryId),
    ...(idea.aliases ?? []), ...(idea.tags ?? []), ...idea.relatedExisting.map(x => x.label),
    draft?.summary ?? '', ...(draft?.appropriateUses ?? []), ...(draft?.pitfalls ?? []),
    ...(draft?.reviewChecks ?? []), draft?.practicalExample ?? '', draft?.implementationNotes ?? '',
    draft?.accessibilityNotes ?? '', draft?.aiInstruction ?? ''];
  const haystack = normalize(fields.join(' '));
  return terms.every(term => haystack.includes(term));
}
export const relationLabels: Record<RelationType, string> = {
  similar: '類似', contrast: '対照', complement: '補完', application: '応用', foundation: '前提・基礎', example: '具体例',
};

// Relation labels are perspective-specific. A direction is an editorial proposal,
// not a claim that a primary source has approved this association.
export function relationDisplayLabel(currentId: string, relation: NonNullable<KnowledgeIdea['relations']>[number]): string {
  if (relation.fromId && relation.toId) {
    const isFrom = currentId === relation.fromId;
    if (relation.type === 'application') return isFrom ? '応用先（この項目 → 関連先）' : '応用元（関連先 → この項目）';
    if (relation.type === 'example') return isFrom ? '具体例（この項目 → 関連先）' : '例示する対象（関連先 → この項目）';
    if (relation.type === 'foundation') return isFrom ? '前提として支える（この項目 → 関連先）' : '前提・基礎（関連先 → この項目）';
  }
  return relationLabels[relation.type];
}

export function knowledgeReviewBrief(idea: KnowledgeIdea) {
  const draft = idea.editorial;
  const sources = (draft?.sourceIds ?? []).map(id => sourceById[id]);
  return [idea.id + ' ' + idea.titleJa, '企画・編集下書き。項目全体の根拠は未確認。', draft?.summary,
    ...(draft?.appropriateUses ?? []).map(text => '向く場面　' + text),
    ...(draft?.pitfalls ?? []).map(text => '注意点　' + text),
    ...(draft?.reviewChecks ?? []).map(text => '確認すること　' + text),
    ...(sources.length ? sources.map(s => '参考資料　' + s.publisher + '「' + s.title + '」 ' +
      (isSafeKnowledgeSourceUrl(s.url) ? s.url + '　' : '') + s.scope) : ['参考資料は未登録です。']),
    '利用目的と条件に照らして、適用できる点、見送り条件、確認が必要な点を説明してください。資料から直接読み取れることと編集上の提案を区別してください。',
  ].filter(Boolean).join('\n');
}
