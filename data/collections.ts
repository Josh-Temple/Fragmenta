import { definitions } from './definitions';

interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  patternIds: string[];
}

const curated: CuratedCollection[] = [
  {
    id: 'practical-page-patterns',
    title: 'ページづくりの基本',
    description: 'フォーム、記事、ナビゲーション、データの表示をHTMLとCSSで試せます。',
    patternIds: ['inline-validation', 'article-table-of-contents', 'readable-article', 'native-faq', 'pricing-comparison', 'release-timeline', 'metric-summary', 'breadcrumb-trail', 'empty-state', 'responsive-data-table'],
  },
  {
    id: 'motion-essentials',
    title: '動きの基本',
    description: 'アニメーションと読み込み表示を見比べ、動きを減らす設定での見え方を確認できます。',
    patternIds: ['elastic-button', 'smart-skeleton', 'glitch-text'],
  },
  {
    id: 'interactive-controls',
    title: '操作部品',
    description: 'ボタン、スイッチ、カードを操作し、反応や状態の伝え方を比べられます。',
    patternIds: ['elastic-button', 'fluid-toggle', 'morph-fab', 'glass-tilt'],
  },
  {
    id: 'editorial-design',
    title: '記事と読み物',
    description: '文章量の多いページに使う見出しの強調と、本文の段組みを見比べられます。',
    patternIds: ['warm-neo-brutalist-editorial', 'editorial-split-layout'],
  },
];

export const collections = curated.map(collection => ({
  ...collection,
  // Counts and links are always derived from patterns that actually exist.
  patternIds: collection.patternIds.filter(id => Boolean(definitions[id])),
}));

export const findCollection = (id: string | undefined) =>
  collections.find(collection => collection.id === id);

