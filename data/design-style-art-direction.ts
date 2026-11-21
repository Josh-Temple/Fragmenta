import type { DesignStyle } from './design-styles';

// Fragmenta-authored illustrative art direction. Not an official style specification.
// Values deliberately affect hierarchy, rhythm and graphic structure as well as color.
export type Ornament = 'none' | 'ruler' | 'disc' | 'geometry' | 'double-rule' | 'diagonal' | 'crosshair' | 'ticket' | 'confetti' | 'collage' | 'tiles' | 'frosted' | 'emboss' | 'dial' | 'pill' | 'arch' | 'chrome' | 'horizon' | 'terminal' | 'pixel' | 'signal' | 'leaf' | 'brush';
export type PanelTreatment = 'open' | 'rule' | 'double' | 'heavy' | 'soft' | 'raised' | 'inset' | 'glass' | 'ornate';
export type BarTreatment = 'square' | 'rounded' | 'thin' | 'offset' | 'segmented';
export type MetricLayout = 'single' | 'equal' | 'wide-first' | 'wide-second';

export interface ArtDirectionRecipe {
  readonly headlineSize: number;
  readonly headlineWeight: number;
  readonly headlineTracking: string;
  readonly headlineAlign: 'left' | 'center';
  readonly heroSpacing: number;
  readonly heroRule: 'none' | 'left' | 'top' | 'bottom' | 'double';
  readonly metricLayout: MetricLayout;
  readonly cardGap: number;
  readonly panelTreatment: PanelTreatment;
  readonly barTreatment: BarTreatment;
  readonly articleLeading: number;
  readonly articleInset: number;
  readonly ornament: Ornament;
  /** Intentional, independently inspectable differences; never infer these from tokens alone. */
  readonly decisions: readonly [string, string, string];
}

// Values target the 320–390px specimen first. Larger screens use the same information.
// In particular, ornamental detail is never placed between the title and the body copy.
export const artDirectionRecipes: Readonly<Record<string, ArtDirectionRecipe>> = {
  minimalism: {
    headlineSize: 28, headlineWeight: 500, headlineTracking: '-.035em', headlineAlign: 'left',
    heroSpacing: 40, heroRule: 'none', metricLayout: 'single', cardGap: 16,
    panelTreatment: 'open', barTreatment: 'thin', articleLeading: 2.15, articleInset: 24, ornament: 'none',
    decisions: ['単一列で読み順を明快にする', '見出しの重みを抑え広い余白で区切る', '装飾より情報のまとまりを優先する'],
  },
  swiss: {
    headlineSize: 36, headlineWeight: 800, headlineTracking: '-.06em', headlineAlign: 'left',
    heroSpacing: 23, heroRule: 'left', metricLayout: 'wide-first', cardGap: 0,
    panelTreatment: 'rule', barTreatment: 'square', articleLeading: 1.8, articleInset: 18, ornament: 'ruler',
    decisions: ['太い見出しと整列した左基準線を使う', '比率の異なる列と規則的な罫線で情報を整理する', '装飾よりグリッドのリズムを優先する'],
  },
  bauhaus: {
    headlineSize: 35, headlineWeight: 900, headlineTracking: '-.04em', headlineAlign: 'left',
    heroSpacing: 13, heroRule: 'bottom', metricLayout: 'wide-second', cardGap: 10,
    panelTreatment: 'heavy', barTreatment: 'square', articleLeading: 1.85, articleInset: 16, ornament: 'geometry',
    decisions: ['基本図形の組合せを見出し前に限定して配置する', '異なる幅の情報面で非対称の均衡を作る', '機能を損なわない太い輪郭を用いる'],
  },
  editorial: {
    headlineSize: 43, headlineWeight: 500, headlineTracking: '-.065em', headlineAlign: 'left',
    heroSpacing: 31, heroRule: 'bottom', metricLayout: 'wide-first', cardGap: 14,
    panelTreatment: 'rule', barTreatment: 'thin', articleLeading: 2.3, articleInset: 25, ornament: 'double-rule',
    decisions: ['大きい活字と小さな誌面情報に強弱をつける', 'ゆとりある行間と繊細な罫線を組み合わせる', '紙面のような非対称の列幅を使う'],
  },
  scandinavian: {
    headlineSize: 30, headlineWeight: 600, headlineTracking: '-.025em', headlineAlign: 'left',
    heroSpacing: 32, heroRule: 'none', metricLayout: 'equal', cardGap: 14,
    panelTreatment: 'soft', barTreatment: 'rounded', articleLeading: 2, articleInset: 24, ornament: 'disc',
    decisions: ['丸い小さなアクセントに限定する', '大きな呼吸をもつ情報カードを並べる', '軽い文字組みと読みやすい本文を保つ'],
  },
  constructivism: {
    headlineSize: 39, headlineWeight: 900, headlineTracking: '-.055em', headlineAlign: 'left',
    heroSpacing: 12, heroRule: 'bottom', metricLayout: 'wide-second', cardGap: 6,
    panelTreatment: 'heavy', barTreatment: 'offset', articleLeading: 1.8, articleInset: 16, ornament: 'diagonal',
    decisions: ['斜めの色面を見出しの外側に置く', '圧縮した情報帯と力強い見出しを対比する', '本文自体は回転させず読める状態を維持する'],
  },
  brutalism: {
    headlineSize: 31, headlineWeight: 800, headlineTracking: '-.05em', headlineAlign: 'left',
    heroSpacing: 10, heroRule: 'top', metricLayout: 'single', cardGap: 0,
    panelTreatment: 'heavy', barTreatment: 'square', articleLeading: 1.75, articleInset: 12, ornament: 'crosshair',
    decisions: ['構造を露出する太い分割線を使う', '一列に情報を積み重ねる', '装飾的な丸みを避ける'],
  },
  'neo-brutalism': {
    headlineSize: 35, headlineWeight: 900, headlineTracking: '-.045em', headlineAlign: 'left',
    heroSpacing: 15, heroRule: 'bottom', metricLayout: 'wide-first', cardGap: 12,
    panelTreatment: 'raised', barTreatment: 'square', articleLeading: 1.85, articleInset: 16, ornament: 'ticket',
    decisions: ['黒い太線と硬いずらし影でカードを分ける', '非対称の配置でポップなリズムを作る', '見出しの塊と余白の対比を強める'],
  },
  memphis: {
    headlineSize: 32, headlineWeight: 800, headlineTracking: '-.025em', headlineAlign: 'left',
    heroSpacing: 20, heroRule: 'none', metricLayout: 'wide-second', cardGap: 14,
    panelTreatment: 'raised', barTreatment: 'rounded', articleLeading: 1.9, articleInset: 17, ornament: 'confetti',
    decisions: ['少量の抽象図形で楽しさを出す', '不均等な列幅とカードの丸みを組み合わせる', '模様は本文領域へ侵入させない'],
  },
  maximalism: {
    headlineSize: 42, headlineWeight: 900, headlineTracking: '-.06em', headlineAlign: 'left',
    heroSpacing: 10, heroRule: 'double', metricLayout: 'wide-first', cardGap: 6,
    panelTreatment: 'ornate', barTreatment: 'offset', articleLeading: 1.95, articleInset: 17, ornament: 'collage',
    decisions: ['階層が読める範囲で線と面を重ねる', '強い活字と密度のあるカード配置を使う', '操作の前後には空白を確保する'],
  },
  postmodern: {
    headlineSize: 36, headlineWeight: 600, headlineTracking: '-.05em', headlineAlign: 'left',
    heroSpacing: 18, heroRule: 'left', metricLayout: 'wide-second', cardGap: 9,
    panelTreatment: 'double', barTreatment: 'offset', articleLeading: 1.9, articleInset: 17, ornament: 'collage',
    decisions: ['異なる幅と線種を意図的に衝突させる', '見出しと細部の書体感を対比させる', '論理的な読み順だけは固定する'],
  },
  flat: {
    headlineSize: 29, headlineWeight: 750, headlineTracking: '-.025em', headlineAlign: 'left',
    heroSpacing: 21, heroRule: 'bottom', metricLayout: 'equal', cardGap: 10,
    panelTreatment: 'rule', barTreatment: 'square', articleLeading: 1.9, articleInset: 18, ornament: 'tiles',
    decisions: ['色面は明確な役割で区切る', '影に頼らない境界を使う', '均等な列と視認できる操作面を保つ'],
  },
  glass: {
    headlineSize: 34, headlineWeight: 600, headlineTracking: '-.035em', headlineAlign: 'left',
    heroSpacing: 26, heroRule: 'none', metricLayout: 'wide-first', cardGap: 15,
    panelTreatment: 'glass', barTreatment: 'rounded', articleLeading: 2, articleInset: 19, ornament: 'frosted',
    decisions: ['透過層の奥行きを装飾帯に限定する', '明暗の異なる面を重ね境界を保つ', '可読性のため文字と背景の対比を優先する'],
  },
  neumorphism: {
    headlineSize: 28, headlineWeight: 650, headlineTracking: '-.025em', headlineAlign: 'left',
    heroSpacing: 30, heroRule: 'none', metricLayout: 'equal', cardGap: 15,
    panelTreatment: 'inset', barTreatment: 'rounded', articleLeading: 2, articleInset: 21, ornament: 'emboss',
    decisions: ['明暗二方向の凹凸を小さな面で表す', '柔らかな角と均等な余白を使う', '輪郭線で押せる領域の判別性を補う'],
  },
  skeuomorphism: {
    headlineSize: 31, headlineWeight: 700, headlineTracking: '-.025em', headlineAlign: 'left',
    heroSpacing: 17, heroRule: 'top', metricLayout: 'wide-second', cardGap: 10,
    panelTreatment: 'inset', barTreatment: 'rounded', articleLeading: 1.9, articleInset: 18, ornament: 'dial',
    decisions: ['小さなダイヤルで物理的な比喩を示す', '奥行きのある枠と沈んだ面を対比する', '装飾は操作速度に影響させない'],
  },
  claymorphism: {
    headlineSize: 32, headlineWeight: 800, headlineTracking: '-.035em', headlineAlign: 'left',
    heroSpacing: 26, heroRule: 'none', metricLayout: 'equal', cardGap: 17,
    panelTreatment: 'soft', barTreatment: 'rounded', articleLeading: 2, articleInset: 24, ornament: 'pill',
    decisions: ['大きな丸みと厚みのある面を合わせる', 'ゆったりしたカード間隔を確保する', '本文サイズは幼児向け記号に寄せず維持する'],
  },
  'art-deco': {
    headlineSize: 39, headlineWeight: 600, headlineTracking: '.035em', headlineAlign: 'center',
    heroSpacing: 25, heroRule: 'double', metricLayout: 'equal', cardGap: 10,
    panelTreatment: 'ornate', barTreatment: 'thin', articleLeading: 2.1, articleInset: 22, ornament: 'arch',
    decisions: ['対称の幾何学的縁取りを見出し周囲へ配置する', '中心軸と明快な活字の順序を両立させる', '金属色に頼らず線の反復で特徴を出す'],
  },
  y2k: {
    headlineSize: 35, headlineWeight: 850, headlineTracking: '-.065em', headlineAlign: 'center',
    heroSpacing: 15, heroRule: 'none', metricLayout: 'wide-first', cardGap: 11,
    panelTreatment: 'raised', barTreatment: 'rounded', articleLeading: 1.85, articleInset: 17, ornament: 'chrome',
    decisions: ['メタリックな帯と楕円を抽象的に使う', '丸い面と密度のある見出しを合わせる', '文字は光沢面へ直接重ねない'],
  },
  vaporwave: {
    headlineSize: 36, headlineWeight: 700, headlineTracking: '-.04em', headlineAlign: 'center',
    heroSpacing: 17, heroRule: 'bottom', metricLayout: 'wide-second', cardGap: 12,
    panelTreatment: 'double', barTreatment: 'thin', articleLeading: 1.9, articleInset: 18, ornament: 'horizon',
    decisions: ['水平線の反復でレトロな空間を作る', '中央見出しと偏りのある情報面を対比する', 'パステル調の装飾でも本文を高コントラストに保つ'],
  },
  'retro-futurism': {
    headlineSize: 34, headlineWeight: 800, headlineTracking: '.01em', headlineAlign: 'left',
    heroSpacing: 18, heroRule: 'top', metricLayout: 'wide-second', cardGap: 9,
    panelTreatment: 'inset', barTreatment: 'segmented', articleLeading: 1.9, articleInset: 18, ornament: 'dial',
    decisions: ['計器帯と大きめのラベルで技術感を示す', '角を残した操作面で古い機器を抽象化する', '数値は等幅で揃えつつ読みやすくする'],
  },
  'pixel-art': {
    headlineSize: 28, headlineWeight: 900, headlineTracking: '.015em', headlineAlign: 'left',
    heroSpacing: 14, heroRule: 'bottom', metricLayout: 'single', cardGap: 5,
    panelTreatment: 'heavy', barTreatment: 'segmented', articleLeading: 1.85, articleInset: 13, ornament: 'pixel',
    decisions: ['階段状のブロックを少数配置する', '等幅文字と直角の情報枠を統一する', '長文にはドット化した書体を使わない'],
  },
  cyberpunk: {
    headlineSize: 35, headlineWeight: 850, headlineTracking: '.015em', headlineAlign: 'left',
    heroSpacing: 15, heroRule: 'left', metricLayout: 'wide-first', cardGap: 7,
    panelTreatment: 'heavy', barTreatment: 'thin', articleLeading: 1.9, articleInset: 17, ornament: 'terminal',
    decisions: ['ネオンの細線を計器帯の一部だけに使う', '高密度の情報枠と大きい数値を対比する', '点滅なしで未来感を表す'],
  },
  organic: {
    headlineSize: 31, headlineWeight: 550, headlineTracking: '-.02em', headlineAlign: 'left',
    heroSpacing: 36, heroRule: 'none', metricLayout: 'equal', cardGap: 15,
    panelTreatment: 'soft', barTreatment: 'rounded', articleLeading: 2.1, articleInset: 24, ornament: 'leaf',
    decisions: ['曲線の抽象形と余白を一体化する', '柔らかな複数面で情報を集約する', '自然物の画像や文化記号を安易に借用しない'],
  },
  'wabi-sabi': {
    headlineSize: 29, headlineWeight: 450, headlineTracking: '.025em', headlineAlign: 'left',
    heroSpacing: 44, heroRule: 'bottom', metricLayout: 'single', cardGap: 20,
    panelTreatment: 'open', barTreatment: 'thin', articleLeading: 2.3, articleInset: 25, ornament: 'brush',
    decisions: ['抑制した不均等な余白を使う', '淡い不規則線を抽象的に扱う', '日本文化の定型記号を装飾として消費しない'],
  },
};

export const artDirectionFor = (style: DesignStyle): ArtDirectionRecipe => {
  const recipe = artDirectionRecipes[style.id];
  if (!recipe) throw new Error('Missing Fragmenta art direction: ' + style.id);
  return recipe;
};
