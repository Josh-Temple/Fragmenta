import { AnimationDefinition } from '../types';
import { elasticButton } from './animations/elastic-button';
import { smartSkeleton } from './animations/smart-skeleton';
import { glassTilt } from './animations/glass-tilt';
import { fluidToggle } from './animations/fluid-toggle';
import { glitchText } from './animations/glitch-text';
import { morphFab } from './animations/morph-fab';

export const definitions: Record<string, AnimationDefinition> = {
  'elastic-button': elasticButton,
  'smart-skeleton': smartSkeleton,
  'glass-tilt': glassTilt,
  'fluid-toggle': fluidToggle,
  'glitch-text': glitchText,
  'morph-fab': morphFab
};