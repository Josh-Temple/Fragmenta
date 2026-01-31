import React from 'react';

export type ParamType = 'number' | 'color';

export interface AnimationParam {
  key: string; // Internal key for state
  cssVar: string; // Actual CSS variable name
  label: string;
  type: ParamType;
  min?: number;
  max?: number;
  step?: number;
  default: number;
  unit?: string;
}

export interface AnimationDefinition {
  id: string;
  title: string;
  description: string;
  params: AnimationParam[];
  Preview: React.FC<{ values: Record<string, number> }>;
  generateCode: (values: Record<string, number>) => string;
  generatePrompt: (values: Record<string, number>) => string;
  tags: string[];
  category: 'button' | 'loader' | 'text' | 'card' | 'input' | 'other';
  performanceScore: number;
  a11yScore: string;
}

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