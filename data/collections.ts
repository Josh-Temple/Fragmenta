import { definitions } from './definitions';

interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  patternIds: string[];
}

const curated: CuratedCollection[] = [
  {
    id: 'practical-page-patterns',
    title: 'Practical Page Patterns',
    description: 'Forms, reading, navigation, and data presentation with standalone HTML and CSS.',
    patternIds: ['inline-validation', 'article-table-of-contents', 'readable-article', 'native-faq', 'pricing-comparison', 'release-timeline', 'metric-summary', 'breadcrumb-trail', 'empty-state', 'responsive-data-table'],
  },
  {
    id: 'motion-essentials',
    title: 'Motion Essentials',
    description: 'Animation and loading patterns to inspect and adapt, with motion preferences to verify before use.',
    patternIds: ['elastic-button', 'smart-skeleton', 'glitch-text'],
  },
  {
    id: 'interactive-controls',
    title: 'Interactive Controls',
    description: 'Interactive buttons, toggles, and cards to adapt to your own accessible controls.',
    patternIds: ['elastic-button', 'fluid-toggle', 'morph-fab', 'glass-tilt'],
  },
  {
    id: 'editorial-design',
    title: 'Editorial & Reading',
    description: 'A complementary visual treatment and reading layout for content-heavy pages.',
    patternIds: ['warm-neo-brutalist-editorial', 'editorial-split-layout'],
  },
];

export const collections = curated.map(collection => ({
  ...collection,
  // Counts and links are always derived from patterns that actually exist.
  patternIds: collection.patternIds.filter(id => Boolean(definitions[id])),
}));

export const findCollection = (id: string | undefined) =>
  collections.find(collection => collection.id === id);

