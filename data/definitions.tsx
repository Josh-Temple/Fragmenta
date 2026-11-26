import { PatternDefinition, PatternKind } from '../types';
import { elasticButton } from './animations/elastic-button';
import { smartSkeleton } from './animations/smart-skeleton';
import { glassTilt } from './animations/glass-tilt';
import { fluidToggle } from './animations/fluid-toggle';
import { glitchText } from './animations/glitch-text';
import { morphFab } from './animations/morph-fab';
import { warmNeoBrutalistEditorial } from './patterns/warm-neo-brutalist-editorial';
import { editorialSplitLayout } from './patterns/editorial-split-layout';

import { practicalPatterns } from './patterns/practical-patterns';

export const definitions: Record<string, PatternDefinition> = {
  ...practicalPatterns,
  'elastic-button': elasticButton,
  'smart-skeleton': smartSkeleton,
  'glass-tilt': glassTilt,
  'fluid-toggle': fluidToggle,
  'glitch-text': glitchText,
  'morph-fab': morphFab,
  'warm-neo-brutalist-editorial': warmNeoBrutalistEditorial,
  'editorial-split-layout': editorialSplitLayout,
};

export const patternKindLabels: Record<PatternKind, string> = {
  motion: '動き', interaction: '操作', style: 'スタイル',
  component: '部品', layout: 'レイアウト', 'text-effect': '文字の演出',
};

export const getPatternKind = (definition: PatternDefinition): PatternKind => {
  if (definition.kind) return definition.kind;

  switch (definition.category) {
    case 'button':
    case 'input':
    case 'feedback':
      return 'interaction';
    case 'loader':
      return 'motion';
    case 'text':
      return 'text-effect';
    case 'card':
    case 'navigation':
      return 'component';
    case 'style':
      return 'style';
    case 'layout':
      return 'layout';
    case 'other':
    default:
      return 'motion';
  }
};

