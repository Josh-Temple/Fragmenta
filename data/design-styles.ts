// Distinct visual-language examples, not official implementations of any design system.
// Previews and token values are illustrative, authored for Fragmenta.
export type DesignStyleGroup = 'structure' | 'expressive' | 'surface' | 'era' | 'atmosphere';
export type PreviewFont = 'sans' | 'serif' | 'mono';
export type PreviewPattern = 'none' | 'grid' | 'dots' | 'diagonal' | 'gradient';
export interface DesignStyle {
  readonly id: string;
  readonly name: string;
  readonly ja: string;
  readonly group: DesignStyleGroup;
  readonly summary: string;
  readonly use: string;
  readonly features: readonly string[];
  readonly avoid: readonly string[];
  readonly tokens: {
    readonly background: string;
    readonly surface: string;
    readonly text: string;
    readonly muted: string;
    readonly accent: string;
    readonly border: string;
    readonly borderWidth: number;
    readonly radius: number;
    readonly shadow: string;
    readonly font: PreviewFont;
    readonly pattern: PreviewPattern;
  };
}
export const designStyleGroups: ReadonlyArray<{ id: DesignStyleGroup; label: string }> = [
  {
    "id": "structure",
    "label": "構成・タイポグラフィ"
  },
  {
    "id": "expressive",
    "label": "強いグラフィック"
  },
  {
    "id": "surface",
    "label": "質感・立体感"
  },
  {
    "id": "era",
    "label": "時代・レトロ"
  },
  {
    "id": "atmosphere",
    "label": "世界観・自然"
  }
];
export const designStyles: readonly DesignStyle[] = [
  {
    "id": "minimalism",
    "name": "Minimalism",
    "ja": "ミニマリズム",
    "group": "structure",
    "summary": "余白と少ない要素で内容に集中させる",
    "use": "管理画面や読み物",
    "features": [
      "余白を大きく取る",
      "色数を絞る",
      "装飾より階層を優先"
    ],
    "avoid": [
      "意味のない余白",
      "弱すぎる操作の手掛かり"
    ],
    "tokens": {
      "background": "#F7F7F4",
      "surface": "#FFFFFF",
      "text": "#222421",
      "muted": "#414943",
      "accent": "#333633",
      "border": "#C8CAC4",
      "borderWidth": 1,
      "radius": 6,
      "shadow": "none",
      "font": "sans",
      "pattern": "none"
    }
  },
  {
    "id": "swiss",
    "name": "Swiss Style",
    "ja": "スイス・スタイル",
    "group": "structure",
    "summary": "グリッドと非対称の明快な文字組み",
    "use": "情報サイトや案内",
    "features": [
      "厳格な整列",
      "サンセリフ文字",
      "機能的な余白"
    ],
    "avoid": [
      "中央揃えの乱用",
      "過度な装飾"
    ],
    "tokens": {
      "background": "#F4F3EE",
      "surface": "#FFFFFF",
      "text": "#171717",
      "muted": "#464646",
      "accent": "#D93025",
      "border": "#B9B9B9",
      "borderWidth": 1,
      "radius": 0,
      "shadow": "none",
      "font": "sans",
      "pattern": "grid"
    }
  },
  {
    "id": "bauhaus",
    "name": "Bauhaus",
    "ja": "バウハウス",
    "group": "structure",
    "summary": "基本図形と原色で機能美を表現",
    "use": "教育・展示・創作ツール",
    "features": [
      "基本図形",
      "赤・青・黄のアクセント",
      "幾何学的な構成"
    ],
    "avoid": [
      "実用性を犠牲にした装飾",
      "過密な図形"
    ],
    "tokens": {
      "background": "#F3EEE3",
      "surface": "#FFFFFF",
      "text": "#171717",
      "muted": "#313131",
      "accent": "#D52921",
      "border": "#171717",
      "borderWidth": 2,
      "radius": 0,
      "shadow": "3px 3px 0 #171717",
      "font": "sans",
      "pattern": "dots"
    }
  },
  {
    "id": "editorial",
    "name": "Editorial",
    "ja": "エディトリアル",
    "group": "structure",
    "summary": "大きな見出しと雑誌的な情報の強弱",
    "use": "記事やブランド紹介",
    "features": [
      "大きな見出し",
      "写真なしでも成り立つ構図",
      "繊細な罫線"
    ],
    "avoid": [
      "本文の可読性を犠牲にする",
      "小さすぎる文字"
    ],
    "tokens": {
      "background": "#F5EFE5",
      "surface": "#FFFDF8",
      "text": "#2B231C",
      "muted": "#5A4A41",
      "accent": "#8F4A31",
      "border": "#BCAC9B",
      "borderWidth": 1,
      "radius": 0,
      "shadow": "none",
      "font": "serif",
      "pattern": "none"
    }
  },
  {
    "id": "scandinavian",
    "name": "Scandinavian",
    "ja": "北欧モダン",
    "group": "structure",
    "summary": "自然色と軽やかな余白で温かみを作る",
    "use": "暮らしやサービス案内",
    "features": [
      "淡い自然色",
      "柔らかい角",
      "読みやすい余白"
    ],
    "avoid": [
      "単調なカードの量産",
      "低コントラスト"
    ],
    "tokens": {
      "background": "#F2F3EA",
      "surface": "#FFFFFF",
      "text": "#26342E",
      "muted": "#4A5750",
      "accent": "#527E63",
      "border": "#D1D7CA",
      "borderWidth": 1,
      "radius": 14,
      "shadow": "0 5px 20px #27332B12",
      "font": "sans",
      "pattern": "none"
    }
  },
  {
    "id": "constructivism",
    "name": "Constructivism",
    "ja": "構成主義",
    "group": "structure",
    "summary": "斜線・幾何形・力強い文字組み",
    "use": "キャンペーンや告知",
    "features": [
      "対角線構成",
      "大きい文字",
      "赤と黒の明確なコントラスト"
    ],
    "avoid": [
      "長文画面への過適用",
      "読みにくい回転文字"
    ],
    "tokens": {
      "background": "#F2ECE3",
      "surface": "#FFF9EE",
      "text": "#121212",
      "muted": "#373737",
      "accent": "#CE2E20",
      "border": "#171717",
      "borderWidth": 3,
      "radius": 0,
      "shadow": "4px 4px 0 #1E1E1E",
      "font": "sans",
      "pattern": "diagonal"
    }
  },
  {
    "id": "brutalism",
    "name": "Brutalism",
    "ja": "ブルータリズム",
    "group": "expressive",
    "summary": "構造を隠さず荒々しさを残す",
    "use": "実験的な作品やポートフォリオ",
    "features": [
      "露出した区切り線",
      "無骨な文字",
      "装飾を抑えた強い構造"
    ],
    "avoid": [
      "意味のない崩し",
      "操作性の犠牲"
    ],
    "tokens": {
      "background": "#EBE8E1",
      "surface": "#FFFFFF",
      "text": "#0A0A0A",
      "muted": "#3E3E3E",
      "accent": "#333333",
      "border": "#111111",
      "borderWidth": 3,
      "radius": 0,
      "shadow": "none",
      "font": "mono",
      "pattern": "none"
    }
  },
  {
    "id": "neo-brutalism",
    "name": "Neo-Brutalism",
    "ja": "ネオ・ブルータリズム",
    "group": "expressive",
    "summary": "太線とオフセット影、明るい色の強い対比",
    "use": "楽しいサービスやアプリ",
    "features": [
      "黒い太線",
      "硬いオフセット影",
      "高彩度のアクセント"
    ],
    "avoid": [
      "過剰な情報密度",
      "弱い文字コントラスト"
    ],
    "tokens": {
      "background": "#FCEAA7",
      "surface": "#FFFCF5",
      "text": "#1D1D1D",
      "muted": "#343434",
      "accent": "#F06E49",
      "border": "#1D1D1D",
      "borderWidth": 3,
      "radius": 4,
      "shadow": "5px 5px 0 #1D1D1D",
      "font": "sans",
      "pattern": "dots"
    }
  },
  {
    "id": "memphis",
    "name": "Memphis",
    "ja": "メンフィス",
    "group": "expressive",
    "summary": "図形パターンと遊び心のある鮮やかな色",
    "use": "クリエイティブなLP",
    "features": [
      "幾何学模様",
      "対照的なアクセント",
      "自由なリズム"
    ],
    "avoid": [
      "装飾で本文を覆う",
      "模様の多用"
    ],
    "tokens": {
      "background": "#FDEAD8",
      "surface": "#FFFDF7",
      "text": "#1F2348",
      "muted": "#35395A",
      "accent": "#E45384",
      "border": "#242244",
      "borderWidth": 2,
      "radius": 12,
      "shadow": "3px 4px 0 #242244",
      "font": "sans",
      "pattern": "dots"
    }
  },
  {
    "id": "maximalism",
    "name": "Maximalism",
    "ja": "マキシマリズム",
    "group": "expressive",
    "summary": "装飾・色・密度を意図的に重ねる",
    "use": "展示やエンターテインメント",
    "features": [
      "大胆な色面",
      "強い見出し",
      "装飾の重なり"
    ],
    "avoid": [
      "主要操作の埋没",
      "無秩序な階層"
    ],
    "tokens": {
      "background": "#351A43",
      "surface": "#5D296C",
      "text": "#FFFFFF",
      "muted": "#F4E6F7",
      "accent": "#FFA93A",
      "border": "#F8B9EB",
      "borderWidth": 2,
      "radius": 10,
      "shadow": "0 7px 20px #16081F66",
      "font": "serif",
      "pattern": "gradient"
    }
  },
  {
    "id": "postmodern",
    "name": "Postmodernism",
    "ja": "ポストモダン",
    "group": "expressive",
    "summary": "形式を崩した引用的・遊戯的な構成",
    "use": "カルチャーやクリエイティブ",
    "features": [
      "意図的な非対称",
      "異素材感",
      "大胆な書体の対比"
    ],
    "avoid": [
      "意味不明な情報順序",
      "弱いアクセシビリティ"
    ],
    "tokens": {
      "background": "#EBE1F4",
      "surface": "#FFFFFF",
      "text": "#282037",
      "muted": "#5E486C",
      "accent": "#A6417D",
      "border": "#2A2441",
      "borderWidth": 2,
      "radius": 3,
      "shadow": "4px 4px 0 #2A2441",
      "font": "serif",
      "pattern": "diagonal"
    }
  },
  {
    "id": "flat",
    "name": "Flat Design",
    "ja": "フラットデザイン",
    "group": "surface",
    "summary": "立体感より色と形の識別に集中",
    "use": "管理画面やツール",
    "features": [
      "シンプルな面",
      "明快な色分け",
      "控えめな影"
    ],
    "avoid": [
      "押せる要素の不明瞭さ",
      "色だけの状態区別"
    ],
    "tokens": {
      "background": "#ECF3FA",
      "surface": "#FFFFFF",
      "text": "#23344C",
      "muted": "#46566A",
      "accent": "#286FC1",
      "border": "#C1D5E8",
      "borderWidth": 1,
      "radius": 8,
      "shadow": "none",
      "font": "sans",
      "pattern": "none"
    }
  },
  {
    "id": "glass",
    "name": "Glassmorphism",
    "ja": "グラスモーフィズム",
    "group": "surface",
    "summary": "半透明パネルと背景の層で奥行きを示す",
    "use": "短い情報カードや印象的な画面",
    "features": [
      "半透明な面",
      "背景ぼかし",
      "繊細な縁取り"
    ],
    "avoid": [
      "透過による可読性低下",
      "性能を無視したぼかし"
    ],
    "tokens": {
      "background": "linear-gradient(135deg,#372669,#8258B4)",
      "surface": "rgba(27,16,59,.65)",
      "text": "#FFFFFF",
      "muted": "#E8DEFF",
      "accent": "#D8C5FF",
      "border": "rgba(255,255,255,.48)",
      "borderWidth": 1,
      "radius": 18,
      "shadow": "0 12px 24px #130E3266",
      "font": "sans",
      "pattern": "gradient"
    }
  },
  {
    "id": "neumorphism",
    "name": "Neumorphism",
    "ja": "ニューモーフィズム",
    "group": "surface",
    "summary": "柔らかい面の凹凸で操作部品を表す",
    "use": "小規模な操作パネル",
    "features": [
      "同色系の面",
      "二方向のソフトシャドウ",
      "軽い凹凸"
    ],
    "avoid": [
      "ボタン境界の曖昧さ",
      "低コントラスト"
    ],
    "tokens": {
      "background": "#E8EDF4",
      "surface": "#E8EDF4",
      "text": "#263448",
      "muted": "#586476",
      "accent": "#456A9E",
      "border": "#CCD4DF",
      "borderWidth": 0,
      "radius": 16,
      "shadow": "6px 6px 12px #C5CBD4,-6px -6px 12px #FFFFFF",
      "font": "sans",
      "pattern": "none"
    }
  },
  {
    "id": "skeuomorphism",
    "name": "Skeuomorphism",
    "ja": "スキューモーフィズム",
    "group": "surface",
    "summary": "現実の素材や操作部品の比喩を利用する",
    "use": "音楽機器・楽器・実物操作",
    "features": [
      "素材を感じる陰影",
      "物理的な押し込み",
      "立体的な区切り"
    ],
    "avoid": [
      "現実模倣のしすぎ",
      "操作の遅延"
    ],
    "tokens": {
      "background": "#D7D2C9",
      "surface": "linear-gradient(150deg,#EEEAE3,#C9C3B8)",
      "text": "#302C29",
      "muted": "#514943",
      "accent": "#996944",
      "border": "#8E877C",
      "borderWidth": 2,
      "radius": 12,
      "shadow": "inset 0 1px 0 #FFFFFF,0 6px 12px #6F64554D",
      "font": "serif",
      "pattern": "none"
    }
  },
  {
    "id": "claymorphism",
    "name": "Claymorphism",
    "ja": "クレイモーフィズム",
    "group": "surface",
    "summary": "粘土のような厚みと丸い形で親しみを演出",
    "use": "子ども向け学習・やわらかな体験",
    "features": [
      "大きな丸み",
      "明るい色",
      "ふんわりした立体影"
    ],
    "avoid": [
      "幼稚さが合わない画面への使用",
      "可読性の低下"
    ],
    "tokens": {
      "background": "#F0E9FF",
      "surface": "#FFFAFE",
      "text": "#3D3154",
      "muted": "#5F5172",
      "accent": "#8458C9",
      "border": "#D8C1F3",
      "borderWidth": 2,
      "radius": 24,
      "shadow": "0 10px 0 #D9C4F0,0 16px 22px #6F52AA33",
      "font": "sans",
      "pattern": "dots"
    }
  },
  {
    "id": "art-deco",
    "name": "Art Deco",
    "ja": "アール・デコ",
    "group": "era",
    "summary": "対称性と幾何学的な装飾で上質感を作る",
    "use": "イベント・文化・展示",
    "features": [
      "幾何学の縁取り",
      "金色アクセント",
      "優雅なタイポグラフィ"
    ],
    "avoid": [
      "金色だけの模倣",
      "本文の極端な細字"
    ],
    "tokens": {
      "background": "#171C28",
      "surface": "#202839",
      "text": "#F9EDCC",
      "muted": "#D9CAA0",
      "accent": "#D9AC62",
      "border": "#A4824B",
      "borderWidth": 1,
      "radius": 0,
      "shadow": "none",
      "font": "serif",
      "pattern": "grid"
    }
  },
  {
    "id": "y2k",
    "name": "Y2K",
    "ja": "Y2K",
    "group": "era",
    "summary": "2000年代前後の未来感を再解釈",
    "use": "音楽・デジタルカルチャー",
    "features": [
      "メタリックな質感",
      "鮮やかな紫と水色",
      "光沢"
    ],
    "avoid": [
      "小さすぎる文字",
      "装飾の重複"
    ],
    "tokens": {
      "background": "linear-gradient(125deg,#E3EDFF,#D7CCFF)",
      "surface": "#FBFCFF",
      "text": "#29264D",
      "muted": "#514971",
      "accent": "#904BC8",
      "border": "#B7A9DB",
      "borderWidth": 2,
      "radius": 22,
      "shadow": "0 6px 17px #7B70AC45",
      "font": "sans",
      "pattern": "gradient"
    }
  },
  {
    "id": "vaporwave",
    "name": "Vaporwave",
    "ja": "ヴェイパーウェイヴ",
    "group": "era",
    "summary": "パステルと電子的な郷愁を混ぜる",
    "use": "音楽・作品紹介",
    "features": [
      "ピンクとシアン",
      "夢のようなグラデーション",
      "レトロな幾何学"
    ],
    "avoid": [
      "文字が背景に埋もれる",
      "装飾の強すぎる反復"
    ],
    "tokens": {
      "background": "linear-gradient(135deg,#603C89,#AD578F)",
      "surface": "rgba(39,26,83,.8)",
      "text": "#FFFFFF",
      "muted": "#EBE7FF",
      "accent": "#7FF0E8",
      "border": "#D9A3EF",
      "borderWidth": 1,
      "radius": 4,
      "shadow": "0 8px 22px #160B355C",
      "font": "mono",
      "pattern": "grid"
    }
  },
  {
    "id": "retro-futurism",
    "name": "Retro-futurism",
    "ja": "レトロフューチャー",
    "group": "era",
    "summary": "過去が想像した未来を現代のUIに映す",
    "use": "SFやクリエイティブなサイト",
    "features": [
      "レトロな機械色",
      "未来的なライン",
      "大胆な見出し"
    ],
    "avoid": [
      "SF装飾だけの模倣",
      "実際の操作の複雑化"
    ],
    "tokens": {
      "background": "#192F35",
      "surface": "#203C41",
      "text": "#F3F5E8",
      "muted": "#D9E7E0",
      "accent": "#F0A65A",
      "border": "#79AAAC",
      "borderWidth": 2,
      "radius": 7,
      "shadow": "0 4px 14px #08171A66",
      "font": "mono",
      "pattern": "grid"
    }
  },
  {
    "id": "pixel-art",
    "name": "Pixel Art",
    "ja": "ピクセルアート",
    "group": "era",
    "summary": "ドットの粗さや直角を視覚言語にする",
    "use": "ゲーム・技術デモ",
    "features": [
      "直角の形",
      "等幅文字",
      "硬い影"
    ],
    "avoid": [
      "長文の読みにくさ",
      "細すぎる文字"
    ],
    "tokens": {
      "background": "#D6E8CD",
      "surface": "#E8F4DE",
      "text": "#1B3020",
      "muted": "#334C38",
      "accent": "#3E7E49",
      "border": "#1B3020",
      "borderWidth": 3,
      "radius": 0,
      "shadow": "4px 4px 0 #1B3020",
      "font": "mono",
      "pattern": "grid"
    }
  },
  {
    "id": "cyberpunk",
    "name": "Cyberpunk",
    "ja": "サイバーパンク",
    "group": "atmosphere",
    "summary": "暗色の都市的な未来感と蛍光色",
    "use": "SF作品・ゲーム関連",
    "features": [
      "深い暗色",
      "ネオンアクセント",
      "技術的な細線"
    ],
    "avoid": [
      "ネオンだらけの本文",
      "眩しい点滅"
    ],
    "tokens": {
      "background": "#0F1523",
      "surface": "#1A2234",
      "text": "#F3F8FF",
      "muted": "#C7D4E4",
      "accent": "#4AF0C4",
      "border": "#426075",
      "borderWidth": 1,
      "radius": 2,
      "shadow": "0 0 14px #28E0BA44",
      "font": "mono",
      "pattern": "grid"
    }
  },
  {
    "id": "organic",
    "name": "Organic / Biophilic",
    "ja": "オーガニック・バイオフィリック",
    "group": "atmosphere",
    "summary": "植物や自然の流線形を抽象化する",
    "use": "ウェルネス・自然・地域",
    "features": [
      "自然由来の配色",
      "曲線",
      "柔らかい余白"
    ],
    "avoid": [
      "自然素材の安易な写真利用",
      "弱いコントラスト"
    ],
    "tokens": {
      "background": "#E8EFDF",
      "surface": "#F8FAF3",
      "text": "#27402E",
      "muted": "#546754",
      "accent": "#628F59",
      "border": "#B8CAB3",
      "borderWidth": 1,
      "radius": 28,
      "shadow": "0 8px 20px #27402E22",
      "font": "serif",
      "pattern": "none"
    }
  },
  {
    "id": "wabi-sabi",
    "name": "Wabi-Sabi",
    "ja": "侘び寂び",
    "group": "atmosphere",
    "summary": "不均質な質感と静かな余白を尊重する",
    "use": "工芸・文化・文章",
    "features": [
      "控えめな自然色",
      "静かな非対称",
      "少ない装飾"
    ],
    "avoid": [
      "日本文化の表層的な記号化",
      "読みにくい淡色"
    ],
    "tokens": {
      "background": "#E8E1D5",
      "surface": "#F6F2E9",
      "text": "#403C36",
      "muted": "#655D53",
      "accent": "#795C46",
      "border": "#BEB3A4",
      "borderWidth": 1,
      "radius": 2,
      "shadow": "none",
      "font": "serif",
      "pattern": "none"
    }
  }
];
