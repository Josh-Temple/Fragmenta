import { getCompositionChoices, getCompositionChoice, getReview, purposeFromQuery, scopeNote } from './composition-discovery';
import raw from './composition-guides.json';

export type Shape = (string | number)[];
export type CompositionGuide = {
  id: string; titleJa: string; categoryId: string; definition: string;
  example: string; contrast: string; aiInstruction: string;
  diagram: { example: Shape[]; comparison: Shape[] };
  relatedLegacyIds: string[]; sourceIds: string[]; sourceNote?: string; comparisonPoint?: string; diagramNote?: string;
  reviewStatus: 'draft_unreviewed'; evidenceStatus: 'not_checked';
};
export type CompositionCatalog = {
  schemaVersion: number; kind: string; status: string; intro: string; issueUrl: string;
  categories: { id: string; label: string }[];
  sources: Record<string, { title: string; publisher: string; url: string; scope: string; rights: string }>;
  guides: CompositionGuide[];
};
export const compositionCatalog = raw as CompositionCatalog;
export const compositionGuides = compositionCatalog.guides;
export const compositionCategories = compositionCatalog.categories;
export const compositionById = new Map(compositionGuides.map(item => [item.id, item]));
export const compositionCategoryLabel = (categoryId: string) =>
  compositionCategories.find(item => item.id === categoryId)?.label ?? categoryId;
export function matchesComposition(item: CompositionGuide, query: string): boolean {
  const purpose = purposeFromQuery(query);
  if (purpose) return Boolean(getCompositionChoice(purpose.id, item.id));
  const review = getReview(item.id);
  const haystack = [item.id, item.titleJa, item.definition, item.example, item.contrast,
    item.aiInstruction, compositionCategoryLabel(item.categoryId), review.checkJa, review.alternativeReasonJa,
    ...getCompositionChoices(item.id).flatMap(c => [c.titleJa, c.reasonJa, c.cautionJa, c.review?.checkJa ?? '', c.review?.alternativeReasonJa ?? ''])].join(' ').normalize('NFKC').toLowerCase();
  return query.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean).every(term => haystack.includes(term));
}

export function compositionBrief(guide: CompositionGuide, purposeId?: string): string {
  const choice = purposeId ? getCompositionChoice(purposeId, guide.id) : undefined;
  const choices = choice ? [choice] : getCompositionChoices(guide.id);
  return [
    guide.id + ' ' + guide.titleJa,
    ...choices.flatMap(c => {
      const r = getReview(guide.id, c);
      return ['用途「' + c.titleJa + '」 ' + c.reasonJa, '注意点　' + c.cautionJa,
        '配置の指示例　' + (c.aiInstruction ?? guide.aiInstruction),
        '見比べる点　' + r.checkJa,
        '代案　' + r.alternativeId + ' ' + compositionById.get(r.alternativeId)?.titleJa + '。' + r.alternativeReasonJa];
    }),
    scopeNote,
    ...choices.flatMap(c => c.sourceSupport ? ['用途に関係する箇所　' + compositionCatalog.sources[c.sourceSupport.sourceId].title + ' / ' + c.sourceSupport.section + '。' + c.sourceSupport.scopeJa] : []),
    ...guide.sourceIds.map(id => {
      const source = compositionCatalog.sources[id];
      return '参考資料　' + source.publisher + '「' + source.title + '」 ' + source.url + '　' + source.scope;
    }),
    ...(guide.sourceNote ? [guide.sourceNote] : []),
    '編集下書き・項目全体の根拠は未確認。目的・媒体・提示された画像に照らして、採用する理由、合わない条件、代案を説明してください。画像や条件が足りない場合は、その情報を明記してください。',
  ].join('\n');
}
