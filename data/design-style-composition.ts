import type { DesignStyle } from './design-styles';

// Preview grammar; these are design interpretations, not official implementations.
export type Composition = 'strict-grid' | 'editorial' | 'diagonal' | 'stacked' | 'soft-cards' | 'instrument' | 'retro' | 'quiet';
export const styleCompositions: Readonly<Record<string, Composition>> = {
  minimalism: 'quiet',
  swiss: 'strict-grid',
  bauhaus: 'diagonal',
  editorial: 'editorial',
  scandinavian: 'soft-cards',
  constructivism: 'diagonal',
  brutalism: 'stacked',
  'neo-brutalism': 'stacked',
  memphis: 'diagonal',
  maximalism: 'editorial',
  postmodern: 'diagonal',
  flat: 'strict-grid',
  glass: 'soft-cards',
  neumorphism: 'soft-cards',
  skeuomorphism: 'instrument',
  claymorphism: 'soft-cards',
  'art-deco': 'editorial',
  y2k: 'retro',
  vaporwave: 'retro',
  'retro-futurism': 'instrument',
  'pixel-art': 'stacked',
  cyberpunk: 'instrument',
  organic: 'quiet',
  'wabi-sabi': 'quiet',
};

export function compositionFor(style: DesignStyle): Composition {
  return styleCompositions[style.id] ?? 'strict-grid';
}

export const compositionNotes: Record<Composition, string> = {
  'strict-grid': '整然とした二列グリッド、視覚的な整列と罫線',
  editorial: '大きな見出しと幅の異なる情報ブロック',
  diagonal: '非対称のカード配置と斜めのアクセント',
  stacked: '太い見出し、積層した罫線と密度のある配置',
  'soft-cards': '柔らかいカード群と広めの間隔',
  instrument: '計器のような情報帯と数値を強調した配置',
  retro: '帯状の見出しと反復する幾何学的区切り',
  quiet: '要素を絞った一列構成と長めの余白',
};

// A numeric weight controls the wording of the instruction, not a mathematically
// accurate interpolation of vendor CSS, typography or contrast.
export const clampSecondaryWeight = (weight: number): number =>
  Number.isFinite(weight) ? Math.max(0, Math.min(100, Math.round(weight))) : 0;

export function blendDescription(primary: DesignStyle, secondary: DesignStyle, weight: number): string {
  const share = clampSecondaryWeight(weight);
  const baseShare = 100 - share;
  return primary.name + ' ' + baseShare + '% / ' + secondary.name + ' ' + share + '%';
}
