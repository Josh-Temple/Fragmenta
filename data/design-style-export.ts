import type { DesignStyle } from './design-styles';
import type { Locale } from '../i18n/locale';
import { localStyle } from '../i18n/styles-en';

export type DemoScreen = 'dashboard' | 'article';

const fontValues = {
  sans: 'Arial, "Noto Sans JP", sans-serif',
  serif: 'Georgia, "Noto Serif JP", serif',
  mono: '"Courier New", monospace',
};

export const designFont = (style: DesignStyle): string => fontValues[style.tokens.font];

export const createStylePrompt = (style: DesignStyle, screen: DemoScreen, locale: Locale = 'ja'): string => locale === 'en' ? englishSingle(style, screen) : [
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
 * Secondary styles may contribute a limited surface detail. These are suggestions,
 * never instructions to reproduce a brand, culturally stereotyped imagery or an
 * entire second layout. Primary visual hierarchy always wins.
 */
const supportingDetails: Readonly<Record<string, string>> = {
  minimalism: '区切りとラベルから不要な装飾を一つ減らす',
  swiss: '補助ラベルの整列と簡潔な罫線を使う',
  bauhaus: '小さな円・三角形・四角形を機能的な区切りに限定する',
  editorial: 'セクション冒頭に細い罫線と余白の緩急を添える',
  scandinavian: '控えめな自然色と柔らかな角を一部のカードに使う',
  constructivism: '重要な見出しの周囲に斜めの幾何学的な線を一点だけ添える',
  brutalism: '補助情報の区切りに明確で無骨な線を使う',
  'neo-brutalism': '主要アクションの周囲に太線か硬いオフセット影を限定的に使う',
  memphis: '本文から離れた余白に小さな幾何学模様を一点だけ置く',
  maximalism: '主要な見出しに限定して大胆な色面を添える',
  postmodern: '見出しの一部に非対称な書体の対比を添える',
  flat: 'ボタンや状態ラベルの面を単純化し、色以外の識別も残す',
  glass: '背景と十分なコントラストを確保した補助カードに限り半透明の縁取りを添える',
  neumorphism: '明確な境界線のある補助コントロールに柔らかい陰影を添える',
  skeuomorphism: '操作の意味に結びつく小さな物理的な凹凸表現を一箇所に使う',
  claymorphism: '一部の補助カードに大きな丸みと柔らかい立体感を添える',
  'art-deco': '区切りや見出し端に対称的な幾何学の縁取りを控えめに添える',
  y2k: 'ラベルの一部に限定して光沢感やメタリックな縁取りを加える',
  vaporwave: '本文外の装飾面にだけ淡いグラデーションを添える',
  'retro-futurism': '補助情報帯にレトロな機械的ラインを少量添える',
  'pixel-art': '小さな区切りの輪郭に角張ったドット感を添える',
  cyberpunk: '状態ラベルなど一点にだけ蛍光色の細線を使い、本文や点滅には使わない',
  organic: '区切りの一部を穏やかな曲線にする',
  'wabi-sabi': '控えめな自然色と不均一な余白を少量取り入れ、日本文化の表層的な記号は使わない',
};

/**
 * A/B ratios indicate adoption priority, NOT a CSS interpolation, mixed UI,
 * design-system conformance, or pixel-level prediction of the concept preview.
 * At 50/50 the layout and information hierarchy are deterministically A.
 * Existing single-style briefs and A-only CSS token export stay unchanged.
 */
export function createBlendedStylePrompt(primary: DesignStyle, secondary: DesignStyle, screen: DemoScreen, secondaryWeight: number, locale: Locale = 'ja'): string {
  if (locale === 'en') return englishBlend(primary, secondary, screen, secondaryWeight);
  if (primary.id === secondary.id) return createStylePrompt(primary, screen);
  const weight = Number.isFinite(secondaryWeight) ? Math.max(0, Math.min(100, Math.round(secondaryWeight))) : 0;
  if (weight === 0) return createStylePrompt(primary, screen);
  if (weight === 100) return createStylePrompt(secondary, screen);

  const dominantIsB = weight > 50;
  const main = dominantIsB ? secondary : primary;
  const detail = dominantIsB ? primary : secondary;
  const mainName = dominantIsB ? 'B' : 'A';
  const detailName = dominantIsB ? 'A' : 'B';
  const minorShare = Math.min(weight, 100 - weight);
  const suggestion = supportingDetails[detail.id] ?? '補助スタイルの特徴を一箇所だけ限定的に使う';

  return [
    '日本語の' + (screen === 'dashboard' ? 'Webダッシュボード' : '記事サイト') + 'を、2つのデザイン系統を組み合わせて制作してください。',
    'A: ' + primary.name + '（' + primary.ja + '） ' + (100 - weight) + '%。',
    'B: ' + secondary.name + '（' + secondary.ja + '） ' + weight + '%。',
    '配合の意味: 数字はデザイン要素の採用優先度であり、面積の割合やCSS値の混色率ではありません。',
    '構造上の決定: 基調' + mainName + '（' + main.name + '）。本文・見出しの階層、情報の順序、グリッド、余白、主要操作の位置は' + mainName + 'を優先します。',
    ...(weight === 50 ? ['同率50/50の決定規則: 構造と情報階層はAを基調にし、Bは質感・アクセントのみを補助します。'] : []),
    '基調' + mainName + 'の設計意図: ' + main.summary + '。特徴: ' + main.features.join('、') + '。',
    '基調' + mainName + 'の文字組み: ' + designFont(main) + 'を参考にし、本文の読みやすさと見出しの階層を保ちます。',
    '補助' + detailName + 'の適用範囲: 情報構造を変更せず、補助ラベル、区切り、カードの輪郭や表面に' +
      (minorShare <= 10 ? '一種類だけ' : '最大二種類') + 'の視覚要素を取り入れます。',
    '補助' + detailName + 'の具体例: ' + suggestion + '。',
    '補助' + detailName + 'の特徴候補（すべて採用する必要はありません）: ' + detail.features.join('、') + '。',
    '基調' + mainName + 'の参考トークン（完成CSSではありません）: 背景 ' + main.tokens.background +
      '、面 ' + main.tokens.surface + '、文字 ' + main.tokens.text + '、アクセント ' + main.tokens.accent + '。',
    '補助' + detailName + 'の参考アクセント（そのまま文字色には使わない）: ' + detail.tokens.accent + '。',
    '衝突時の解決: 補助' + detailName + 'が文字組み、視線誘導、情報の順序や基調' + mainName +
      'の余白と矛盾する場合は、補助' + detailName + 'の装飾を省きます。両者の特色をすべて重ねません。',
    '避ける表現: Aでは ' + primary.avoid.join('、') + '。Bでは ' + secondary.avoid.join('、') + '。',
    '上記の比率はデザイン要素の採用優先度の目安です。CSS値を機械的に補間する指示ではありません。提示した色や質感も概念上の参考値で、実際の画面や生成結果を保証しません。',
    '他社の画面やロゴを複製せず独自に制作し、日本語の折返し・モバイル幅・キーボード操作・十分な文字コントラスト・フォーカス表示を実画面で検証してください。',
    'この指定は様式の解釈であり、公式デザインシステム準拠やアクセシビリティ認証ではありません。',
  ].join('\n');
}

function englishSingle(style: DesignStyle, screen: DemoScreen): string {
  const value = localStyle(style, 'en');
  return [
    'Design an original English-language ' + (screen === 'dashboard' ? 'web dashboard' : 'article site') + ' using the ' + value.name + ' design direction.',
    'Intent: ' + value.summary + '.',
    'Features: ' + value.features.join('; ') + '.',
    'Illustrative tokens: background ' + value.tokens.background + ', surface ' + value.tokens.surface +
      ', text ' + value.tokens.text + ', accent ' + value.tokens.accent +
      ', border radius ' + value.tokens.radius + 'px, border width ' + value.tokens.borderWidth + 'px.',
    'Avoid: ' + value.avoid.join('; ') + '.',
    'Use original copy and layout; do not reproduce a brand or an existing website.',
    'Check English text wrapping, mobile layouts, text contrast, visible keyboard focus and keyboard navigation.',
    'These are illustrative directions, not official design-system conformance or accessibility certification.',
  ].join('\n');
}

function englishBlend(primary: DesignStyle, secondary: DesignStyle, screen: DemoScreen, input: number): string {
  const weight = Number.isFinite(input) ? Math.max(0, Math.min(100, Math.round(input))) : 0;
  if (primary.id === secondary.id || weight === 0) return englishSingle(primary, screen);
  if (weight === 100) return englishSingle(secondary, screen);
  const dominantIsB = weight > 50;
  const main = localStyle(dominantIsB ? secondary : primary, 'en');
  const detail = localStyle(dominantIsB ? primary : secondary, 'en');
  const mainName = dominantIsB ? 'B' : 'A', detailName = dominantIsB ? 'A' : 'B';
  const a = localStyle(primary, 'en'), b = localStyle(secondary, 'en');
  const minorShare = Math.min(weight, 100 - weight);
  return [
    'Design an original English-language ' + (screen === 'dashboard' ? 'web dashboard' : 'article site') + ' combining two design directions.',
    'A: ' + a.name + ' ' + (100 - weight) + '%; B: ' + b.name + ' ' + weight + '%.',
    'These percentages indicate adoption priority, not area ratios, CSS interpolation or exact visual mixing.',
    'Structure: use ' + mainName + ' (' + main.name + ') for content order, hierarchy, grid, spacing and placement of primary actions.',
    ...(weight === 50 ? ['At 50/50, A always determines structure and information hierarchy; B only supplements surface detail.'] : []),
    'Dominant ' + mainName + ' intent: ' + main.summary + '; features: ' + main.features.join('; ') + '.',
    'Dominant typography: refer to ' + designFont(main) + ', preserving readable body text and heading levels.',
    'Supporting ' + detailName + ': use ' + (minorShare <= 10 ? 'only one' : 'at most two') +
      ' accents in labels, dividers or card surfaces without changing the content structure.',
    'Example supporting feature: ' + detail.features[0] + '. Supporting features are optional: ' + detail.features.join('; ') + '.',
    'Dominant reference colors (not finished CSS): background ' + main.tokens.background +
      ', surface ' + main.tokens.surface + ', text ' + main.tokens.text + ', accent ' + main.tokens.accent + '.',
    'Supporting accent reference (not an automatic text color): ' + detail.tokens.accent + '.',
    'On conflict, omit supporting decoration rather than weakening the dominant hierarchy or readability.',
    'Avoid in A: ' + a.avoid.join('; ') + '. Avoid in B: ' + b.avoid.join('; ') + '.',
    'Do not copy brands or third-party sites. Verify English wrapping, mobile widths, keyboard access, visible focus and actual text contrast.',
    'The mixed preview is illustrative, not a finished implementation, a CSS blend or a conformance certification.',
  ].join('\n');
}
