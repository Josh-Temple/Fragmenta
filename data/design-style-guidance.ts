import { designStyles, type DesignStyle } from './design-styles';

/** Editorial guidance for choosing a style; examples are recommendations, not fixed historical definitions. */
export interface StyleGuidance {
  readonly fitReason: string;
  readonly reviewCheck: string;
  readonly unsuitable: string;
  readonly firstAdjustment: string;
  readonly related: readonly [string, string];
}

export const styleGuidance: Readonly<Record<DesignStyle['id'], StyleGuidance>> = {
  "minimalism": {
    "fitReason": "書類の申請画面や長い記事で、余白と見出しの差によって次に読む場所を絞れる。",
    "reviewCheck": "装飾を外した画面で、初見でも見出し・本文・主要操作を指せるか見る。",
    "unsuitable": "大きな情報量を一画面に詰め込み、密度そのものが作業効率に直結する一覧。",
    "firstAdjustment": "重要な操作を埋もれさせないよう、余白を残したまま主要ボタンの境界と状態を明確にする。",
    "related": [
      "swiss",
      "flat"
    ]
  },
  "swiss": {
    "fitReason": "時刻表や展示案内のように、複数の情報を同じ軸で見比べるときに使いやすい。",
    "reviewCheck": "最長の項目名が二行になった場合にも列の対応がずれないか確かめる。",
    "unsuitable": "装飾や物語性を主役にしたいキャンペーンのファーストビュー。",
    "firstAdjustment": "文字サイズとグリッドを先に決め、列の整列と見出しの強弱を調整する。",
    "related": [
      "minimalism",
      "editorial"
    ]
  },
  "bauhaus": {
    "fitReason": "子ども向け展覧会の案内などで、円や四角を使って企画や章の違いを見せられる。",
    "reviewCheck": "図形を一部隠しても日時と会場がすぐに見つかるか確認する。",
    "unsuitable": "複雑な入力フォームや長文を休まず読む画面の全面装飾。",
    "firstAdjustment": "基本図形を見出しや区切りに絞り、本文からは派手な図形を離す。",
    "related": [
      "constructivism",
      "memphis"
    ]
  },
  "editorial": {
    "fitReason": "特集記事やインタビューで、見出し・引用・写真に読み進めるための強弱をつけられる。",
    "reviewCheck": "長い見出しと引用を実際に入れ、見出しだけでも記事の順をたどれるか見る。",
    "unsuitable": "毎秒更新する数値を大量に監視する操作中心のダッシュボード。",
    "firstAdjustment": "見出しと本文の文字サイズ差を調整し、本文の行長を読みやすく保つ。",
    "related": [
      "swiss",
      "art-deco"
    ]
  },
  "scandinavian": {
    "fitReason": "暮らしの道具や地域の案内を、落ち着いた配色と広い間隔でゆっくり比較できる。",
    "reviewCheck": "淡い背景の上で本文とボタンの境界が小画面でも区別できるか確認する。",
    "unsuitable": "非常に強い緊迫感や警告を第一印象にしたい画面。",
    "firstAdjustment": "穏やかな配色でも主要操作が見つかるよう、強調色の役割を限定する。",
    "related": [
      "organic",
      "minimalism"
    ]
  },
  "constructivism": {
    "fitReason": "講演会のポスターなどで、一つの短い言葉と図形を斜めに配して主題を強められる。",
    "reviewCheck": "日時や場所を水平に残した状態で、最初に読んでほしい言葉を判別できるかを見る。",
    "unsuitable": "長時間の読書や、落ち着いた比較検討を支える本文画面。",
    "firstAdjustment": "斜線と太字を主要メッセージだけに使い、操作要素は水平に整列させる。",
    "related": [
      "bauhaus",
      "brutalism"
    ]
  },
  "brutalism": {
    "fitReason": "資料目録や作品集で、構造・リンク・素材そのものを前面に出して見せられる。",
    "reviewCheck": "初めて訪れた人がリンクと見出しを見分け、目的の資料へ移れるか試す。",
    "unsuitable": "安心感や柔らかい印象を最優先する日常的な案内画面。",
    "firstAdjustment": "太い罫線がすべてを同じ強さにしないよう、主従の間隔を増やす。",
    "related": [
      "neo-brutalism",
      "swiss"
    ]
  },
  "neo-brutalism": {
    "fitReason": "イベントの申込案内などで、太い枠と影で主要操作を目立たせやすい。",
    "reviewCheck": "複数のカードを並べ、押せる部分と説明用の枠の区別がつくかを見る。",
    "unsuitable": "複雑な業務画面で細かな数値や注記を同時に読む用途。",
    "firstAdjustment": "硬い影と強い色を主ボタンや見出しに集中させ、本文の周囲は整理する。",
    "related": [
      "brutalism",
      "memphis"
    ]
  },
  "memphis": {
    "fitReason": "ワークショップの募集などで、形や色を少数の短い情報に添えて遊びを出せる。",
    "reviewCheck": "模様あり・なしの二版で、対象者や締切の見つけやすさを比べる。",
    "unsuitable": "法令・契約文書のように装飾より読み違えの防止が優先される画面。",
    "firstAdjustment": "模様は背景の一部に限定し、テキストと図形が重ならない余白を確保する。",
    "related": [
      "bauhaus",
      "postmodern"
    ]
  },
  "maximalism": {
    "fitReason": "祭りや文化企画の一覧で、色・文字・写真の量によって賑わいを表現できる。",
    "reviewCheck": "最も小さい表示でタイトル、日時、申込先を順に見つけられるかを試す。",
    "unsuitable": "狭い画面で短時間に正確な操作を要求する入力フォーム。",
    "firstAdjustment": "最も伝えたい情報を一つ決め、装飾の密度を段階的に落とす。",
    "related": [
      "postmodern",
      "memphis"
    ]
  },
  "postmodern": {
    "fitReason": "文化誌の特集扉などで、文字の傾きや異なる形を使い、意図的な違和感を表現できる。",
    "reviewCheck": "視覚的な順番と文章として読む順番をそれぞれたどれるかを見る。",
    "unsuitable": "操作手順が明確であることを最優先する定型業務の画面。",
    "firstAdjustment": "非対称な配置を一部の見出しに限定し、情報の読み順は自然に保つ。",
    "related": [
      "memphis",
      "editorial"
    ]
  },
  "flat": {
    "fitReason": "操作の多いサービスで、単純な形と一貫した色を使って状態を比較しやすい。",
    "reviewCheck": "影を外したまま操作可能・選択中・無効の三状態が読み分けられるか試す。",
    "unsuitable": "表面の材質や物理的操作感を体験の中心にしたいデモ。",
    "firstAdjustment": "色だけに依存せず、ボタンの境界・ラベル・状態変化を明示する。",
    "related": [
      "minimalism",
      "neumorphism"
    ]
  },
  "glass": {
    "fitReason": "写真や地図を背後に残しながら、短い情報パネルを手前に重ねられる。",
    "reviewCheck": "最も明るい背景と暗い背景の両方で半透明面上の文字とフォーカスを確認する。",
    "unsuitable": "背景が複雑で、半透明パネルの文字コントラストを保てない画面。",
    "firstAdjustment": "先に背面を固定し、透過後の実際の文字コントラストを測ってからぼかしを調整する。",
    "related": [
      "y2k",
      "neumorphism"
    ]
  },
  "neumorphism": {
    "fitReason": "小さな操作パネルで、面のくぼみと盛り上がりで押した状態を表現できる。",
    "reviewCheck": "影を弱めても選択状態と押せる境界が別の手掛かりから分かるか確かめる。",
    "unsuitable": "高い視認性と明確な操作境界を要する業務システムの主要フォーム。",
    "firstAdjustment": "影に頼らず輪郭線とフォーカス表示を追加し、押せる要素を明確にする。",
    "related": [
      "claymorphism",
      "flat"
    ]
  },
  "skeuomorphism": {
    "fitReason": "つまみや計器に慣れた利用者へ、形と動作の対応を示したい画面に使える。",
    "reviewCheck": "実物を知らない利用者にも名称・現在値・操作方法が読めるかを確認する。",
    "unsuitable": "大量の異なる機能を一画面に詰めるデータ管理画面。",
    "firstAdjustment": "現実の操作に対応する比喩だけ残し、装飾的な素材表現を減らす。",
    "related": [
      "neumorphism",
      "retro-futurism"
    ]
  },
  "claymorphism": {
    "fitReason": "学習アプリの導入や小さなカードで、丸い立体の違いから対象を見分けられる。",
    "reviewCheck": "イラストと操作ボタンを並べ、影や立体感だけで押せると誤認しないか試す。",
    "unsuitable": "厳密な数値比較や長文を多く扱う専門家向けの画面。",
    "firstAdjustment": "柔らかい立体表現を主要カードに絞り、ラベルの文字コントラストを確保する。",
    "related": [
      "neumorphism",
      "scandinavian"
    ]
  },
  "art-deco": {
    "fitReason": "公演や展覧会の招待状で、対称軸や幾何学模様を使って式次第に格を持たせられる。",
    "reviewCheck": "細い飾り枠と長い会場名がスマホや印刷で重ならないかを見る。",
    "unsuitable": "控えめな装飾で大量の情報を効率的に操作させたい画面。",
    "firstAdjustment": "幾何学模様と対称構成を見出し周辺に絞り、本文の可読性を優先する。",
    "related": [
      "editorial",
      "y2k"
    ]
  },
  "y2k": {
    "fitReason": "音楽イベントやゲームの告知で、短いタイトルに光沢や鮮やかな色を集められる。",
    "reviewCheck": "反射が最も明るい部分でもタイトルと日時の文字が読めるか確認する。",
    "unsuitable": "落ち着いた信頼性を前面に出す公共案内や長文の手引き。",
    "firstAdjustment": "金属感や光沢を一部にとどめ、背景と文字の明度差を確認する。",
    "related": [
      "vaporwave",
      "glass"
    ]
  },
  "vaporwave": {
    "fitReason": "音楽や架空都市の作品集で、グラデーションと色のずれを時代の手掛かりにできる。",
    "reviewCheck": "見出し以外の説明・リンク・選択状態が背景の色に埋もれないか調べる。",
    "unsuitable": "色や装飾の多さが誤操作につながりやすい実務用の入力画面。",
    "firstAdjustment": "グラデーションは装飾領域に限定し、操作部品の色は一貫させる。",
    "related": [
      "y2k",
      "retro-futurism"
    ]
  },
  "retro-futurism": {
    "fitReason": "架空の交通案内や展示で、未来を想像した計器や印刷物の語彙を使える。",
    "reviewCheck": "計器風の装飾と、実際の数値・日時・移動先を取り違えないか調べる。",
    "unsuitable": "静かな読書体験や現代的な業務帳票を優先する画面。",
    "firstAdjustment": "計器風の表現を数値表示に限定し、説明文は通常の文字組みにする。",
    "related": [
      "skeuomorphism",
      "cyberpunk"
    ]
  },
  "pixel-art": {
    "fitReason": "ゲームのアイテム一覧など、低い解像度の形そのものを作品の特徴として扱える。",
    "reviewCheck": "表示倍率や日本語表示を変え、アイコンの輪郭と本文の読みやすさを確かめる。",
    "unsuitable": "細かな本文や可変サイズの多言語テキストを大量に扱う画面。",
    "firstAdjustment": "粗い画素表現はアイコンや見出しに限定し、本文は読みやすい文字にする。",
    "related": [
      "retro-futurism",
      "brutalism"
    ]
  },
  "cyberpunk": {
    "fitReason": "夜のSF都市や作品紹介で、暗い面と少数の発光色を使って注目箇所を絞れる。",
    "reviewCheck": "明るさを下げて、発光色が使えない場合も警告と通常の操作を区別できるか見る。",
    "unsuitable": "静穏さ、保守性、親しみやすさを強く求める日常的な案内。",
    "firstAdjustment": "発光色は状態や主要操作だけに使い、長文領域は暗背景でも読みやすくする。",
    "related": [
      "retro-futurism",
      "vaporwave"
    ]
  },
  "organic": {
    "fitReason": "自然素材や生態を扱う展示で、曲線を境に写真と説明を緩やかに分けられる。",
    "reviewCheck": "曲線の端が本文やタップ範囲に入り込まず、読む順を保てるか確認する。",
    "unsuitable": "密集した表形式データを厳密に列比較する作業画面。",
    "firstAdjustment": "曲線の使いどころを装飾や区切りに絞り、データ部分は直線的に整列する。",
    "related": [
      "scandinavian",
      "wabi-sabi"
    ]
  },
  "wabi-sabi": {
    "fitReason": "工芸品の作品集で、不均一な表面や空きを使って一点ずつ質感を見せられる。",
    "reviewCheck": "紙や布の模様を重ねた状態でも作者名・寸法・説明を読めるか確認する。",
    "unsuitable": "一貫した強いコントラストや即時の視認を求める警告画面。",
    "firstAdjustment": "不均一な質感を余白や背景に限定し、機能部分の判読性は崩さない。",
    "related": [
      "organic",
      "minimalism"
    ]
  }
};

export const styleScope = '用途と代案はFragmentaの作例に基づく編集案です。個別の推奨に対応する外部出典は登録されていません。';
export function getStyleSelection(style: DesignStyle) {
  const guide = styleGuidance[style.id];
  return {
    id: style.id, titleJa: style.ja, name: style.name, href: '/#/styles?style=' + style.id,
    use: style.use, reason: guide.fitReason, avoid: guide.unsuitable,
    adjustment: guide.firstAdjustment, check: guide.reviewCheck, status: 'draft_unreviewed',
    alternatives: guide.related.map(id => ({
      id, titleJa: designStyles.find(s => s.id === id)!.ja,
      reason: styleGuidance[id].fitReason, href: '/#/styles?style=' + id,
    })),
    sourceScope: styleScope,
  };
}
export function styleSelectionBrief(style: DesignStyle) {
  const s = getStyleSelection(style);
  return [
    s.id + ' ' + s.titleJa + '（' + s.name + '）',
    '向く場面　' + s.use + '。' + s.reason, '向きにくい場面　' + s.avoid,
    '最初の調整　' + s.adjustment, '完成画面での確認　' + s.check,
    ...s.alternatives.map(a => '代案　' + a.titleJa + '（' + a.id + '） ' + a.reason),
    s.sourceScope, '目的・情報量・利用端末に照らして、採用理由、見送り条件、不足する情報を示してください。',
  ].join('\n');
}
export function styleSearchFields(style: DesignStyle) {
  const s = getStyleSelection(style);
  return [style.name, style.ja, style.summary, style.use, ...style.features, ...style.avoid,
    s.reason, s.avoid, s.adjustment, s.check, ...s.alternatives.map(a => a.titleJa)];
}
