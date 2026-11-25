import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { definitions } from '../data/definitions';
import { plannedPatterns } from '../data/planned-patterns';
import { plannedTools } from '../data/planned-tools';
import { liveTools } from '../data/live-tools';
import { designStyles } from '../data/design-styles';
import PatternCard from '../components/PatternCard';
import CompositionStudy from '../components/CompositionStudy';

const entryPoints = [
  { path: '/composition?view=atlas', title: '構図を図で見比べる', detail: '配置例と対照例を並べて、主役の位置や余白を比べる。', sample: 'alignment' },
  { path: '/styles', title: 'スタイルを選ぶ', detail: `${designStyles.length}スタイルを同じ画面で比べ、好みの特徴を言葉にする。`, sample: 'type' },
  { path: '/browse', title: 'UIパターンを試す', detail: `${Object.keys(definitions).length}種類の部品やレイアウトを動かし、実装を読む。`, sample: 'interface' },
];
const secondaryEntries = [
  { path: '/tools', title: '実用ツール', detail: '配色と日本語の文字組みを調整する。' },
  { path: '/knowledge', title: '企画から探す', detail: '180件の企画案をたどる。各企画の作例は未制作です。' },
];
const featuredPatterns = ['editorial-split-layout', 'readable-article', 'inline-validation', 'responsive-data-table'];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const search = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?${new URLSearchParams({ q: searchQuery.trim() })}`);
  };
  return (
    <div className="home-page" lang="ja">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="hero-intro">
          <h1 id="home-heading">つくりたい<span lang="en">UI</span>を、<br />図と作例から探す<span className="headline-stop">。</span></h1>
          <p>構図、スタイル、動く部品。作例を見比べながら、<wbr />自分の画面に合う選び方と実装を学べます。</p>
          <form role="search" onSubmit={search} className="home-search">
            <label htmlFor="home-search">サイト内を検索</label>
            <div className="home-search-row">
              <input id="home-search" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)}
                placeholder="例：余白、記事、行間" />
              <button type="submit">検索</button>
            </div>
          </form>
        </div>
        <CompositionStudy />
      </section>
      <section className="home-section" aria-labelledby="start-heading">
        <h2 id="start-heading">目的から探す</h2>
        <div className="entry-grid">
          {entryPoints.map(item => <Link key={item.path} to={item.path} className="entry-link">
            <span aria-hidden="true" className={'entry-sample sample-' + item.sample}>
              {item.sample === 'type' ? <><i>Aa</i><b>あ</b></> : <i />}
            </span>
            <span className="entry-body"><strong>{item.title}</strong><span>{item.detail}</span></span>
            <span aria-hidden="true" className="entry-arrow">↗</span>
          </Link>)}
        </div>
        <div className="secondary-entries">
          {secondaryEntries.map(item => <Link to={item.path} key={item.path}><strong>{item.title} <span aria-hidden="true">→</span></strong><span>{item.detail}</span></Link>)}
        </div>
      </section>
      <section className="home-section example-notes" aria-labelledby="design-atlas-home-heading">
        <div><h2 id="design-atlas-home-heading">この画面の組み方</h2>
          <Link to="/styles" className="text-link">デザイン図鑑を見る</Link></div>
        <dl>
          <div><dt><Link to="/styles?style=swiss">スイス・スタイル <span aria-hidden="true">↗</span></Link></dt>
            <dd>見出し、検索欄、一覧の左端をそろえ、項目の境目を細い罫線で示しています。</dd></div>
          <div><dt><Link to="/p/editorial-split-layout" lang="en">Editorial Split Layout <span aria-hidden="true">↗</span></Link></dt>
            <dd>構図の一覧では、広い画面で検索条件を左、図版を右に置きます。スマートフォンでは上から順に読めます。</dd></div>
        </dl>
      </section>
      <section className="home-section" aria-labelledby="featured-heading">
        <div className="section-head"><h2 id="featured-heading">ページづくりに役立つ例</h2><Link to="/browse" className="text-link">すべて見る</Link></div>
        <div className="featured-grid">{featuredPatterns.map(id => <PatternCard key={id} definition={definitions[id]} />)}</div>
        <p className="rights-note">コードを使う前に、各作例の<Link to="/licenses" className="text-link">権利・利用条件</Link>を確認してください。</p>
      </section>
      <section className="home-section resource-grid" aria-label="ツールとガイド">
        <div><h2 id="live-tools-home-heading">いま使える実用ツール</h2>
          {liveTools.map(tool => <Link key={tool.id} to={tool.path} className="resource-link">{tool.titleJa} <span aria-hidden="true">→</span></Link>)}</div>
        <div><h2>組み合わせと使い方</h2>
          <Link className="resource-link" to="/collections">用途別のコレクション <span aria-hidden="true">→</span></Link>
          <Link className="resource-link" to="/guide">プレビューから実装へ <span aria-hidden="true">→</span></Link></div>
      </section>
      <details className="upcoming-links">
        <summary>今後のコンテンツ案</summary>
        <p>制作を予定している企画です。</p>
        <Link to="/upcoming" className="text-link">UIパターンの案 {plannedPatterns.length}件</Link>
        <Link to="/tools/upcoming" className="text-link">実用ツールの案 {plannedTools.length}件</Link>
        <Link to="/knowledge" className="text-link">関連リンク付きの企画台帳 180件</Link>
      </details>
    </div>
  );
};
export default Home;
