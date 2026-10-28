// Japanese aliases supplement the existing English metadata without renaming entries.
export const patternSearchAliases: Record<string, string> = {
  'elastic-button': 'ボタン 押す 弾む ホバー',
  'smart-skeleton': '読み込み ローディング スケルトン',
  'glass-tilt': 'ガラス カード 傾く',
  'fluid-toggle': '切り替え トグル スイッチ',
  'glitch-text': '文字 グリッチ テキスト',
  'morph-fab': 'ボタン メニュー 変形',
  'warm-neo-brutalist-editorial': '暖色 編集 記事 太字 影 枠線 ニューブルータリズム',
  'editorial-split-layout': '記事 読書 レイアウト 二段組み',
  'inline-validation': '入力 フォーム 検証 エラー',
  'article-table-of-contents': '記事 目次 見出し',
  'readable-article': '記事 文章 読書 読みやすさ',
  'native-faq': '質問 アコーディオン 開閉',
  'pricing-comparison': '料金 価格 比較',
  'release-timeline': '履歴 時系列 タイムライン',
  'metric-summary': '指標 数値 ダッシュボード',
  'breadcrumb-trail': 'パンくず ナビゲーション 階層',
  'empty-state': '空 データなし 検索結果なし',
  'responsive-data-table': '表 データ 比較 レスポンシブ',
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
