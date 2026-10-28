import type { DesignStyle } from './design-styles';
import type {Locale} from '../i18n/locale';
import {localStyle} from '../i18n/styles-en';

export type DemoScreen = 'dashboard' | 'article';

const fontValues = {
  sans: 'Arial, "Noto Sans JP", sans-serif',
  serif: 'Georgia, "Noto Serif JP", serif',
  mono: '"Courier New", monospace',
};

export const designFont = (style: DesignStyle): string => fontValues[style.tokens.font];

export const createStylePrompt = (style: DesignStyle, screen: DemoScreen, locale: Locale='ja'): string => locale==='en'?englishSingle(style,screen):[
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

/**
 * A/B percentages express design priorities in the AI brief, not pixel-accurate mixing.
 * Existing single-style briefs and their CSS token export stay unchanged.
 */
export function createBlendedStylePrompt(primary: DesignStyle, secondary: DesignStyle, screen: DemoScreen, secondaryWeight: number, locale: Locale='ja'): string {
  if(locale==='en')return englishBlend(primary,secondary,screen,secondaryWeight);
  if (primary.id === secondary.id) return createStylePrompt(primary, screen);
  const weight = Number.isFinite(secondaryWeight) ? Math.max(0, Math.min(100, Math.round(secondaryWeight))) : 0;
  if (weight === 0) return createStylePrompt(primary, screen);
  if (weight === 100) return createStylePrompt(secondary, screen);
  const main = weight > 50 ? secondary : primary;
  const detail = weight > 50 ? primary : secondary;
  const mainName = weight > 50 ? 'B' : 'A';
  const detailName = weight > 50 ? 'A' : 'B';
  return [
    '日本語の' + (screen === 'dashboard' ? 'Webダッシュボード' : '記事サイト') + 'を、2つのデザイン系統を組み合わせて制作してください。',
    'A: ' + primary.name + '（' + primary.ja + '） ' + (100 - weight) + '%。',
    'B: ' + secondary.name + '（' + secondary.ja + '） ' + weight + '%。',
    '基調' + mainName + 'の構造と情報設計: ' + main.summary + '。特徴: ' + main.features.join('、') + '。',
    '補助' + detailName + 'から取り入れる要素: ' + detail.features.join('、') + '。',
    '優先規則: 本文・見出しの階層、情報の順序、操作の明快さは比率の高い' + mainName + 'を基本に保ち、' + detailName + 'はアクセント色、質感、輪郭、装飾などへ選択的に取り入れます。',
    '避ける表現: Aでは ' + primary.avoid.join('、') + '。Bでは ' + secondary.avoid.join('、') + '。',
    'Aの参考トークン: 背景 ' + primary.tokens.background + '、文字 ' + primary.tokens.text + '、線幅 ' + primary.tokens.borderWidth + 'px。',
    'Bの参考トークン: アクセント ' + secondary.tokens.accent + '、角丸 ' + secondary.tokens.radius + 'px、影 ' + secondary.tokens.shadow + '。',
    '上記の比率はデザイン要素の採用優先度の目安です。CSS値を機械的に補間する指示ではありません。調和しない要素は無理に混ぜず、可読性を優先してください。',
    '他社の画面やロゴを複製せず独自に制作し、日本語の折返し・モバイル幅・キーボード操作・十分な文字コントラストを検証してください。',
    'この指定は様式の解釈であり、公式デザインシステム準拠やアクセシビリティ認証ではありません。',
  ].join('\n');
}

function englishSingle(style:DesignStyle,screen:DemoScreen):string {
  const s=localStyle(style,'en');
  return ['Design an original English-language '+(screen==='dashboard'?'dashboard':'article site')+' in the '+s.name+' style.',
    'Intent: '+s.summary+'. Features: '+s.features.join('; ')+'.',
    'Colors: background '+s.tokens.background+', surface '+s.tokens.surface+', text '+s.tokens.text+', accent '+s.tokens.accent+'.',
    'Avoid: '+s.avoid.join('; ')+'.',
    'Use original content, not a copy of a brand or website. Validate responsiveness, contrast, keyboard focus and English text wrapping.',
    'This is illustrative guidance, not official design-system conformance or accessibility certification.'].join('\n');
}
function englishBlend(primary:DesignStyle,secondary:DesignStyle,screen:DemoScreen,weightInput:number):string {
  const w=Number.isFinite(weightInput)?Math.max(0,Math.min(100,Math.round(weightInput))):0;
  if(w===0||primary.id===secondary.id)return englishSingle(primary,screen);
  if(w===100)return englishSingle(secondary,screen);
  const a=localStyle(primary,'en'),b=localStyle(secondary,'en'),main=w>50?b:a,detail=w>50?a:b;
  return ['Create an original English-language '+(screen==='dashboard'?'dashboard':'article site')+' combining two design styles.',
    'A: '+a.name+' '+(100-w)+'%; B: '+b.name+' '+w+'%. Percentages are design priorities, not CSS mixing.',
    'Use '+(w>50?'B':'A')+' for layout, hierarchy and main actions. At equal 50/50, A determines the structure.',
    'Dominant features: '+main.features.join('; ')+'. Secondary accents only: '+detail.features.join('; ')+'.',
    'Avoid: '+a.avoid.join('; ')+'; '+b.avoid.join('; ')+'. Use original content and keep primary content readable.',
    'Check responsiveness, contrast, keyboard navigation and English wrapping. Not a finished CSS implementation or certification.'].join('\n');
}
