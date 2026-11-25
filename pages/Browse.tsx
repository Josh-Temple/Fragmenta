import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import PatternCard from '../components/PatternCard';
import { plannedPatterns } from '../data/planned-patterns';
import { plannedTools } from '../data/planned-tools';
import { designStyles } from '../data/design-styles';
import { PatternKind } from '../types';

type Filter = 'all' | PatternKind;
const categories: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'すべて' }, { id: 'motion', label: 'モーション' },
  { id: 'interaction', label: '操作' }, { id: 'style', label: 'スタイル' },
  { id: 'component', label: '部品' }, { id: 'layout', label: 'レイアウト' },
  { id: 'text-effect', label: '文字効果' },
];
const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = categories.find(item => item.id === searchParams.get('kind')) ?? categories[0];
  const patterns = Object.values(definitions).filter(item => filter.id === 'all' || getPatternKind(item) === filter.id);
  return <div className="catalog-page">
    <header className="catalog-heading">
      <h1>UIパターンを探す</h1>
      <p>動く部品から記事のレイアウトまで、作例を開いて動作とコードを確かめられます。</p>
      <Link to="/search" className="text-link">サイト内を検索</Link>
    </header>
    <section aria-labelledby="browse-results-heading" className="pattern-listing">
      <div role="group" aria-label="パターンの種類" className="pattern-filters">
        {categories.map(item => <button type="button" key={item.id} aria-pressed={filter.id === item.id}
          onClick={() => setSearchParams(item.id === 'all' ? {} : { kind: item.id })}>{item.label}</button>)}
      </div>
      <div className="section-head">
        <h2 id="browse-results-heading">{filter.id === 'all' ? 'すべてのパターン' : filter.label}</h2>
        <span role="status" aria-label={patterns.length + '件の作例'}>{patterns.length}件</span>
      </div>
      {patterns.length ? <div className="browse-grid">
        {patterns.map(definition => <PatternCard key={definition.id} definition={definition} />)}
      </div> : <p>この種類のパターンはありません。</p>}
    </section>
    <section className="browse-related" aria-labelledby="style-atlas-browse-heading">
      <h2 id="style-atlas-browse-heading">デザイン図鑑</h2>
      <p>配色や文字組みから方向を決めたいときは、{designStyles.length}スタイルを同じ画面で比較できます。</p>
      <Link to="/styles" className="text-link">スタイルを見比べる</Link>
    </section>
    <details className="upcoming-links">
      <summary>今後のコンテンツ案</summary><p>次の項目は制作を予定している企画です。</p>
      <Link to="/upcoming" className="text-link">UIパターンの案 {plannedPatterns.length}件</Link>
      <Link to="/tools/upcoming" className="text-link">実用ツールの案 {plannedTools.length}件</Link>
    </details>
  </div>;
};
export default Browse;
