import raw from './composition-discovery.json';
import type { CompositionGuide } from './composition';
type Choice = { guideId: string; reasonJa: string; cautionJa: string };
export type CompositionPurpose = { id: string; titleJa: string; description: string; choices: Choice[] };
export type CompositionRelation = { sourceId: string; targetId: string; relationType: string; reasonJa: string };
export const compositionPurposes: CompositionPurpose[] = raw.purposes;
export const compositionRelations: CompositionRelation[] = raw.relatedComposition;
export const getCompositionPurpose = (id: string) => compositionPurposes.find(p => p.id === id);
export const getCompositionChoice = (purposeId: string, guideId: string) =>
  getCompositionPurpose(purposeId)?.choices.find(choice => choice.guideId === guideId);
export const getCompositionRelations = (id: string) => compositionRelations.filter(r => r.sourceId === id);
// Derived editorial metadata: the canonical source and all review/evidence states remain unchanged.
export const getCompositionDiscovery = (g: CompositionGuide) => ({
  useCases: [g.example],
  limitations: [g.contrast, ...(g.diagramNote ? [g.diagramNote] : [])],
  media: raw.mediaByCategory[g.categoryId as keyof typeof raw.mediaByCategory] ?? [],
  subjects: raw.subjectsByCategory[g.categoryId as keyof typeof raw.subjectsByCategory] ?? [],
  priorityConditions: [g.comparisonPoint ?? g.definition],
  relatedComposition: getCompositionRelations(g.id),
  aiGuidance: { composition: g.aiInstruction, style: null as null },
  discoveryStatus: 'draft_unreviewed' as const,
});
