import type { DesignStyle } from './design-styles';

export type MixRatio = 25 | 50 | 75;
export type MixedTokens = DesignStyle['tokens'];

function mixHex(a: string, b: string, ratio: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return ratio >= 50 ? b : a;
  const channel = (offset: number) => Math.round(
    parseInt(a.slice(offset, offset + 2), 16) * (100 - ratio) / 100 +
    parseInt(b.slice(offset, offset + 2), 16) * ratio / 100
  ).toString(16).padStart(2, '0');
  return '#' + channel(1) + channel(3) + channel(5);
}

export function mixStyles(primary: DesignStyle, secondary: DesignStyle, ratio: MixRatio): DesignStyle {
  const a = primary.tokens, b = secondary.tokens;
  return {
    ...primary,
    id: primary.id + '-mix-' + secondary.id,
    name: primary.name + ' × ' + secondary.name,
    ja: primary.ja + ' × ' + secondary.ja,
    summary: primary.summary + '。副要素として' + secondary.summary,
    use: primary.use + ' / ' + secondary.use,
    features: [...primary.features, ...secondary.features],
    avoid: [...primary.avoid, ...secondary.avoid],
    tokens: {
      background: mixHex(a.background, b.background, ratio),
      surface: mixHex(a.surface, b.surface, ratio),
      text: mixHex(a.text, b.text, ratio),
      muted: mixHex(a.muted, b.muted, ratio),
      accent: mixHex(a.accent, b.accent, ratio),
      border: mixHex(a.border, b.border, ratio),
      borderWidth: ratio >= 50 ? b.borderWidth : a.borderWidth,
      radius: Math.round((a.radius * (100 - ratio) + b.radius * ratio) / 100),
      shadow: ratio >= 50 ? b.shadow : a.shadow,
      font: ratio >= 50 ? b.font : a.font,
      pattern: ratio >= 50 ? b.pattern : a.pattern,
    },
  };
}

export function mixPrompt(primary: DesignStyle, secondary: DesignStyle, ratio: MixRatio, screen: 'dashboard' | 'article'): string {
  return [
    '日本語の' + (screen === 'dashboard' ? 'ダッシュボード' : '記事サイト') + 'をデザインしてください。',
    '主軸: ' + primary.name + '（' + primary.ja + '）。' + primary.summary + '。',
    '副要素: ' + secondary.name + '（' + secondary.ja + '）。' + secondary.summary + '。',
    '配合の目安: 主軸 ' + (100 - ratio) + '%、副要素 ' + ratio + '%。数値は視覚的な優先度の目安であり、客観的な測定値ではありません。',
    '主軸の特徴: ' + primary.features.join('、') + '。',
    '副要素の特徴: ' + secondary.features.join('、') + '。',
    '避けたいこと: ' + [...primary.avoid, ...secondary.avoid].join('、') + '。',
    '両方の特徴を無条件に盛り込まず、主軸の可読性と操作性を優先してください。',
    '日本語の折り返し、360px幅、コントラスト、キーボード操作、フォーカス表示を確認してください。',
    '特定のサイト・ブランドの模倣や、公式デザインシステム準拠の主張は避けてください。',
  ].join('\n');
}
