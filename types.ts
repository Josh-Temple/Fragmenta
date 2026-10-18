import React from 'react';

export type ParamType = 'number' | 'color';

export type PatternKind =
  | 'motion'
  | 'interaction'
  | 'style'
  | 'component'
  | 'layout'
  | 'text-effect';

export type PatternCategory =
  | 'button'
  | 'loader'
  | 'text'
  | 'card'
  | 'input'
  | 'navigation'
  | 'feedback'
  | 'style'
  | 'layout'
  | 'other';

export interface PatternParam {
  key: string;
  cssVar: string;
  label: string;
  type: ParamType;
  min?: number;
  max?: number;
  step?: number;
  default: number;
  unit?: string;
}

export interface PatternSource {
  label: string;
  url?: string;
  note?: string;
}

export interface PatternDefinition {
  id: string;
  title: string;
  description: string;
  params: PatternParam[];
  Preview: React.FC<{ values: Record<string, number>; paused?: boolean }>;
  continuousMotion?: boolean;
  generateCode: (values: Record<string, number>) => string;
  generatePrompt: (values: Record<string, number>) => string;
  tags: string[];
  category: PatternCategory;

  /**
   * Top-level discovery group. Optional during the incremental migration:
   * legacy animation definitions are mapped from category by getPatternKind().
   */
  kind?: PatternKind;

  performanceScore: number;
  a11yScore: string;
  performanceNotes?: string;
  a11yNotes?: string;
  responsiveNotes?: string;
  source?: PatternSource;
}

/**
 * Compatibility aliases for the original animation-only model.
 * New entries should use PatternDefinition / PatternParam.
 */
export type AnimationParam = PatternParam;
export type AnimationDefinition = PatternDefinition;

export interface Collection {
  id: string;
  title: string;
  description: string;
  includedAnimationIds: string[];
}

export interface NavigationItem {
  icon: string;
  label: string;
  path: string;
  isActive?: boolean;
}
