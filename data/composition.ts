import raw from './composition-guides.json';

export type Shape = (string | number)[];
export type CompositionGuide = {
  id: string; titleJa: string; categoryId: string; definition: string;
  example: string; contrast: string; aiInstruction: string;
  diagram: { example: Shape[]; comparison: Shape[] };
  relatedLegacyIds: string[]; sourceIds: string[]; comparisonPoint?: string; diagramNote?: string;
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
  const haystack = [item.id, item.titleJa, item.definition, item.example, item.contrast,
    item.aiInstruction, compositionCategoryLabel(item.categoryId)].join(' ').normalize('NFKC').toLowerCase();
  return query.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean).every(term => haystack.includes(term));
}
