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
// Purpose recommendations and cautions are unreviewed candidates, not established effects.
// A contrasting diagram is not, by itself, an unsuitable use case.
export const getCompositionDiscovery = (g: CompositionGuide) => {
  const purposes = compositionPurposes.filter(p => p.choices.some(c => c.guideId === g.id));
  const cautions = purposes.flatMap(p => p.choices.filter(c => c.guideId === g.id).map(c => c.cautionJa));
  return {
  useCases: purposes.map(p => p.titleJa + '（用途候補・未検証）'),
  limitations: [...new Set([...cautions, ...(g.diagramNote ? [g.diagramNote] : [])])],
  applicationExample: g.example,
  comparisonExample: g.contrast,
  media: raw.mediaByCategory[g.categoryId as keyof typeof raw.mediaByCategory] ?? [],
  subjects: raw.subjectsByCategory[g.categoryId as keyof typeof raw.subjectsByCategory] ?? [],
  priorityConditions: [g.comparisonPoint ?? g.definition],
  relatedComposition: getCompositionRelations(g.id),
  purposes: purposes.map(p => p.id),
  aiGuidance: { composition: g.aiInstruction, style: null as null },
  discoveryStatus: 'draft_unreviewed' as const,
  };
};
