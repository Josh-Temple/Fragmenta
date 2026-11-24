import raw from './composition-discovery.json';
import type { CompositionGuide } from './composition';

type Review = { checkJa: string; alternativeId: string; alternativeReasonJa: string };
type SourceSupport = { sourceId: string; section: string; scopeJa: string; checkedOn: string };
type Choice = { guideId: string; reasonJa: string; cautionJa: string; aiInstruction?: string; sourceSupport?: SourceSupport; review?: Review };
export type CompositionPurpose = { id: string; titleJa: string; description: string; choices: Choice[] };
export type PurposeChoice = Choice & { purposeId: string; titleJa: string };
export type CompositionRelation = { sourceId: string; targetId: string; relationType: string; reasonJa: string };
export const compositionPurposes: CompositionPurpose[] = raw.purposes;
export const compositionRelations: CompositionRelation[] = raw.relatedComposition;
export const scopeNote = '用途・注意点・代案はFragmentaの編集案です。出典が扱う事項は資料ごとの説明に記載しています。';
const reviews: Record<string, Review> = raw.reviewByGuide;
const choicesByGuide = new Map<string, PurposeChoice[]>();
for (const purpose of compositionPurposes) {
  for (const choice of purpose.choices) {
    const choices = choicesByGuide.get(choice.guideId) ?? [];
    choices.push({ ...choice, purposeId: purpose.id, titleJa: purpose.titleJa });
    choicesByGuide.set(choice.guideId, choices);
  }
}
export const getCompositionPurpose = (id: string) => compositionPurposes.find(p => p.id === id);
export const purposeFromQuery = (query: string) =>
  compositionPurposes.find(p => p.titleJa.normalize('NFKC') === query.trim().normalize('NFKC'));
export const getCompositionChoices = (id: string) => choicesByGuide.get(id) ?? [];
export const getCompositionChoice = (purposeId: string, guideId: string) =>
  getCompositionChoices(guideId).find(choice => choice.purposeId === purposeId);
export const getCompositionRelations = (id: string) => compositionRelations.filter(r => r.sourceId === id);
export const getReview = (id: string, choice?: PurposeChoice) => choice?.review ?? reviews[id];

export const getCompositionDiscovery = (g: CompositionGuide) => {
  const choices = getCompositionChoices(g.id);
  return {
    useCases: choices.map(c => c.titleJa + '（用途候補・未検証）'),
    limitations: [...new Set([...choices.map(c => c.cautionJa), ...(g.diagramNote ? [g.diagramNote] : [])])],
    applicationExample: g.example,
    comparisonExample: g.contrast,
    media: raw.mediaByCategory[g.categoryId as keyof typeof raw.mediaByCategory] ?? [],
    subjects: raw.subjectsByCategory[g.categoryId as keyof typeof raw.subjectsByCategory] ?? [],
    priorityConditions: [g.comparisonPoint ?? g.definition],
    relatedComposition: getCompositionRelations(g.id),
    purposes: choices.map(c => c.purposeId),
    aiGuidance: { composition: g.aiInstruction, style: null as null },
    discoveryStatus: 'draft_unreviewed' as const,
    choices: choices.map(c => ({
      ...c, review: getReview(g.id, c), aiInstruction: c.aiInstruction ?? g.aiInstruction,
      href: '/#/composition?id=' + g.id + '&purpose=' + c.purposeId,
    })),
    review: getReview(g.id), scopeNote,
  };
};
