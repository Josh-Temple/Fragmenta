import type { DesignStyle } from './design-styles';

export type DemoScreen = 'dashboard' | 'article';

const fontValues = {
  sans: 'Arial, "Noto Sans JP", sans-serif',
  serif: 'Georgia, "Noto Serif JP", serif',
  mono: '"Courier New", monospace',
};

export const designFont = (style: DesignStyle): string => fontValues[style.tokens.font];

export const createStylePrompt = (style: DesignStyle, screen: DemoScreen): string => [
  '日本語の' + (screen === 'dashboard' ? 'Webダッシュボード' : '記事サイト') + 'を「' + style.name + '（' + style.ja + '）」の方向性でデザインしてください。',
  'デザインの意図: ' + style.summary + '。',
  '重視する特徴: ' + style.features.join('、') + '。',
  '参考色・形: 背景 ' + style.tokens.background + '、面 ' + style.tokens.surface +
    '、文字 ' + style.tokens.text + '、アクセント ' + style.tokens.accent +
    '、角丸 ' + style.tokens.radius + 'px、線幅 ' + style.tokens.borderWidth + 'px。',
  '避けたい表現: ' + style.avoid.join('、') + '。',
  '既存ブランドや特定サイトの画面を丸ごとコピーせず、オリジナルの構成・文言を用いてください。',
  '日本語の折り返し、モバイル画面、十分なコントラスト、フォーカス表示、キーボード操作を確認してください。',
  'この指定は様式の方向性を伝えるもので、公式デザインシステム準拠やアクセシビリティ認証を意味しません。',
].join('\n');

export const createStyleCss = (style: DesignStyle): string => {
  const t = style.tokens;
  return [
    '/* ' + style.name + ': illustrative design tokens, not a complete UI implementation */',
    '.fragmenta-style-' + style.id + ' {',
    '  --style-bg: ' + t.background + ';',
    '  --style-surface: ' + t.surface + ';',
    '  --style-text: ' + t.text + ';',
    '  --style-muted: ' + t.muted + ';',
    '  --style-accent: ' + t.accent + ';',
    '  --style-border: ' + t.border + ';',
    '  --style-border-width: ' + t.borderWidth + 'px;',
    '  --style-radius: ' + t.radius + 'px;',
    '  --style-shadow: ' + t.shadow + ';',
    '  background: var(--style-bg);',
    '  color: var(--style-text);',
    '  font-family: ' + designFont(style) + ';',
    '}',
    '.fragmenta-style-' + style.id + ' .surface {',
    '  color: var(--style-text);',
    '  background: var(--style-surface);',
    '  border: var(--style-border-width) solid var(--style-border);',
    '  border-radius: var(--style-radius);',
    '  box-shadow: var(--style-shadow);',
    '}',
    '/* Test contrast and focus states against actual content. */',
  ].join('\n');
};
