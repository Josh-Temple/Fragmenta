import type { DesignStyle } from './design-styles';

/** Editorial guidance for choosing a style; examples are recommendations, not fixed historical definitions. */
export interface StyleGuidance {
  readonly unsuitable: string;
  readonly firstAdjustment: string;
  readonly related: readonly [string, string];
}

export const styleGuidance: Readonly<Record<DesignStyle['id'], StyleGuidance>> = {
  "minimalism": {
    "unsuitable": "大きな情報量を一画面に詰め込み、密度そのものが作業効率に直結する一覧。",
    "firstAdjustment": "重要な操作を埋もれさせないよう、余白を残したまま主要ボタンの境界と状態を明確にする。",
    "related": [
      "swiss",
      "flat"
    ]
  },
  "swiss": {
    "unsuitable": "装飾や物語性を主役にしたいキャンペーンのファーストビュー。",
    "firstAdjustment": "文字サイズとグリッドを先に決め、列の整列と見出しの強弱を調整する。",
    "related": [
      "minimalism",
      "editorial"
    ]
  },
  "bauhaus": {
    "unsuitable": "複雑な入力フォームや長文を休まず読む画面の全面装飾。",
    "firstAdjustment": "基本図形を見出しや区切りに絞り、本文からは派手な図形を離す。",
    "related": [
      "constructivism",
      "memphis"
    ]
  },
  "editorial": {
    "unsuitable": "毎秒更新する数値を大量に監視する操作中心のダッシュボード。",
    "firstAdjustment": "見出しと本文の文字サイズ差を調整し、本文の行長を読みやすく保つ。",
    "related": [
      "swiss",
      "art-deco"
    ]
  },
  "scandinavian": {
    "unsuitable": "非常に強い緊迫感や警告を第一印象にしたい画面。",
    "firstAdjustment": "穏やかな配色でも主要操作が見つかるよう、強調色の役割を限定する。",
    "related": [
      "organic",
      "minimalism"
    ]
  },
  "constructivism": {
    "unsuitable": "長時間の読書や、落ち着いた比較検討を支える本文画面。",
    "firstAdjustment": "斜線と太字を主要メッセージだけに使い、操作要素は水平に整列させる。",
    "related": [
      "bauhaus",
      "brutalism"
    ]
  },
  "brutalism": {
    "unsuitable": "安心感や柔らかい印象を最優先する日常的な案内画面。",
    "firstAdjustment": "太い罫線がすべてを同じ強さにしないよう、主従の間隔を増やす。",
    "related": [
      "neo-brutalism",
      "swiss"
    ]
  },
  "neo-brutalism": {
    "unsuitable": "複雑な業務画面で細かな数値や注記を同時に読む用途。",
    "firstAdjustment": "硬い影と強い色を主ボタンや見出しに集中させ、本文の周囲は整理する。",
    "related": [
      "brutalism",
      "memphis"
    ]
  },
  "memphis": {
    "unsuitable": "法令・契約文書のように装飾より読み違えの防止が優先される画面。",
    "firstAdjustment": "模様は背景の一部に限定し、テキストと図形が重ならない余白を確保する。",
    "related": [
      "bauhaus",
      "postmodern"
    ]
  },
  "maximalism": {
    "unsuitable": "狭い画面で短時間に正確な操作を要求する入力フォーム。",
    "firstAdjustment": "最も伝えたい情報を一つ決め、装飾の密度を段階的に落とす。",
    "related": [
      "postmodern",
      "memphis"
    ]
  },
  "postmodern": {
    "unsuitable": "操作手順が明確であることを最優先する定型業務の画面。",
    "firstAdjustment": "非対称な配置を一部の見出しに限定し、情報の読み順は自然に保つ。",
    "related": [
      "memphis",
      "editorial"
    ]
  },
  "flat": {
    "unsuitable": "表面の材質や物理的操作感を体験の中心にしたいデモ。",
    "firstAdjustment": "色だけに依存せず、ボタンの境界・ラベル・状態変化を明示する。",
    "related": [
      "minimalism",
      "neumorphism"
    ]
  },
  "glass": {
    "unsuitable": "背景が複雑で、半透明パネルの文字コントラストを保てない画面。",
    "firstAdjustment": "先に背面を固定し、透過後の実際の文字コントラストを測ってからぼかしを調整する。",
    "related": [
      "y2k",
      "neumorphism"
    ]
  },
  "neumorphism": {
    "unsuitable": "高い視認性と明確な操作境界を要する業務システムの主要フォーム。",
    "firstAdjustment": "影に頼らず輪郭線とフォーカス表示を追加し、押せる要素を明確にする。",
    "related": [
      "claymorphism",
      "flat"
    ]
  },
  "skeuomorphism": {
    "unsuitable": "大量の異なる機能を一画面に詰めるデータ管理画面。",
    "firstAdjustment": "現実の操作に対応する比喩だけ残し、装飾的な素材表現を減らす。",
    "related": [
      "neumorphism",
      "retro-futurism"
    ]
  },
  "claymorphism": {
    "unsuitable": "厳密な数値比較や長文を多く扱う専門家向けの画面。",
    "firstAdjustment": "柔らかい立体表現を主要カードに絞り、ラベルの文字コントラストを確保する。",
    "related": [
      "neumorphism",
      "scandinavian"
    ]
  },
  "art-deco": {
    "unsuitable": "控えめな装飾で大量の情報を効率的に操作させたい画面。",
    "firstAdjustment": "幾何学模様と対称構成を見出し周辺に絞り、本文の可読性を優先する。",
    "related": [
      "editorial",
      "y2k"
    ]
  },
  "y2k": {
    "unsuitable": "落ち着いた信頼性を前面に出す公共案内や長文の手引き。",
    "firstAdjustment": "金属感や光沢を一部にとどめ、背景と文字の明度差を確認する。",
    "related": [
      "vaporwave",
      "glass"
    ]
  },
  "vaporwave": {
    "unsuitable": "色や装飾の多さが誤操作につながりやすい実務用の入力画面。",
    "firstAdjustment": "グラデーションは装飾領域に限定し、操作部品の色は一貫させる。",
    "related": [
      "y2k",
      "retro-futurism"
    ]
  },
  "retro-futurism": {
    "unsuitable": "静かな読書体験や現代的な業務帳票を優先する画面。",
    "firstAdjustment": "計器風の表現を数値表示に限定し、説明文は通常の文字組みにする。",
    "related": [
      "skeuomorphism",
      "cyberpunk"
    ]
  },
  "pixel-art": {
    "unsuitable": "細かな本文や可変サイズの多言語テキストを大量に扱う画面。",
    "firstAdjustment": "粗い画素表現はアイコンや見出しに限定し、本文は読みやすい文字にする。",
    "related": [
      "retro-futurism",
      "brutalism"
    ]
  },
  "cyberpunk": {
    "unsuitable": "静穏さ、保守性、親しみやすさを強く求める日常的な案内。",
    "firstAdjustment": "発光色は状態や主要操作だけに使い、長文領域は暗背景でも読みやすくする。",
    "related": [
      "retro-futurism",
      "vaporwave"
    ]
  },
  "organic": {
    "unsuitable": "密集した表形式データを厳密に列比較する作業画面。",
    "firstAdjustment": "曲線の使いどころを装飾や区切りに絞り、データ部分は直線的に整列する。",
    "related": [
      "scandinavian",
      "wabi-sabi"
    ]
  },
  "wabi-sabi": {
    "unsuitable": "一貫した強いコントラストや即時の視認を求める警告画面。",
    "firstAdjustment": "不均一な質感を余白や背景に限定し、機能部分の判読性は崩さない。",
    "related": [
      "organic",
      "minimalism"
    ]
  }
};
