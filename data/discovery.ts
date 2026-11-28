// Keep earlier English names searchable alongside Japanese keywords.
export const patternSearchAliases: Record<string, string> = {
  'elastic-button': 'Lift & Compress Button CSS Transform Hover ボタン 押す 弾む ホバー',
  'smart-skeleton': 'Smart Skeleton Loader CSS Shimmer Loading 読み込み ローディング スケルトン',
  'glass-tilt': 'Glass Tilt Card React 3D Hover ガラス カード 傾く',
  'fluid-toggle': 'Fluid Toggle Input CSS Interactive Form 切り替え トグル スイッチ',
  'glitch-text': 'Glitch Text Text CSS Distortion Effect 文字 グリッチ テキスト',
  'morph-fab': 'Morph FAB Button CSS Morph Disclosure ボタン メニュー 変形',
  'warm-neo-brutalist-editorial': 'Warm Neo-Brutalist Editorial Editorial Neo-brutalist Warm Outlined Offset Shadow CSS 暖色 編集 記事 太字 影 枠線 ニューブルータリズム',
  'editorial-split-layout': 'Editorial Split Layout Editorial Layout Grid Responsive Reading CSS 記事 読書 レイアウト 二段組み',
  'inline-validation': 'Inline Validation Form Validation CSS 入力 フォーム 検証 エラー',
  'article-table-of-contents': 'Article Table of Contents Reading Navigation Responsive 記事 目次 見出し',
  'readable-article': 'Readable Article Typography Editorial Reading 記事 文章 読書 読みやすさ',
  'native-faq': 'Native FAQ Disclosure FAQ HTML 質問 アコーディオン 開閉',
  'pricing-comparison': 'Pricing Comparison Pricing Cards Responsive 料金 価格 比較',
  'release-timeline': 'Release Timeline Timeline Changelog HTML 履歴 時系列 タイムライン',
  'metric-summary': 'Metric Summary Dashboard Metrics Responsive 指標 数値 ダッシュボード',
  'breadcrumb-trail': 'Breadcrumb Trail Navigation Breadcrumb HTML パンくず ナビゲーション 階層',
  'empty-state': 'Empty State Feedback Empty State Content 空 データなし 検索結果なし',
  'responsive-data-table': 'Responsive Data Table Table Data Responsive 表 データ 比較 レスポンシブ',
};

export const styleSearchAliases: Record<string, string> = {
  glass: 'ガラス 透明 透過',
  minimalism: 'シンプル 最小限 余白',
  swiss: '整列 グリッド',
  'neo-brutalism': '太い枠線 影',
};

export function matchesSearch(query: string, fields: readonly string[]): boolean {
  const normalize = (text: string) => text.normalize('NFKC').toLowerCase().trim();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const content = normalize(fields.join(' '));
  return terms.every(term => content.includes(term));
}
