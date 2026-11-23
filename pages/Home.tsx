import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { definitions } from '../data/definitions';
import { plannedPatterns } from '../data/planned-patterns';
import { plannedTools } from '../data/planned-tools';
import { liveTools } from '../data/live-tools';
import { designStyles } from '../data/design-styles';
import PatternCard from '../components/PatternCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const featuredPatterns = ['readable-article', 'inline-validation', 'warm-neo-brutalist-editorial', 'responsive-data-table'].map(id => definitions[id]);
  const search = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?${new URLSearchParams({ q: searchQuery.trim() })}`);
  };
  return (
    <div className="flex min-w-0 flex-col" lang="ja">
      <header className="flex items-center justify-between border-b border-ink-border px-6 py-5">
        <p lang="en" className="text-lg font-bold">Fragmenta<span className="ml-2 text-xs font-mono font-normal text-ink-muted">UI / DESIGN / TOOLS</span></p>
      </header>
      <section className="px-6 pt-8 pb-6" aria-labelledby="home-heading">
        <h1 id="home-heading" className="mt-3 text-4xl font-bold leading-tight tracking-tight">つくりたいUIを、<br />具体的に。</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">動く部品とデザインの特徴を見比べ、コードやAIへの指示文を確認できます。色と文字は実用ツールで調整できます。</p>
        <form role="search" onSubmit={search} className="mt-6">
          <label htmlFor="home-search" className="block text-sm font-semibold">パターン・スタイル・ツールを検索</label>
          <div className="mt-2 flex gap-2">
            <input id="home-search" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="例：記事、ガラス、行間" className="min-w-0 flex-1 rounded-lg border border-ink/40 bg-surface-highlight px-3 py-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" />
            <button type="submit" className="motion-control rounded-lg bg-ink px-4 py-3 text-sm font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">検索</button>
          </div>
        </form>
      </section>
      <section aria-labelledby="start-heading" className="px-6 pb-5">
        <h2 id="start-heading" className="text-lg font-bold">何から始めますか</h2>
        <div className="mt-3 divide-y divide-ink/20 border-y border-ink/20">
          {[{ path: '/composition', title: '構図を図で見比べる', detail: '配置例と対照図を見て、要素の位置や余白の違いを確かめる' }, { path: '/styles', title: 'デザインの方向を決める', detail: `${designStyles.length}スタイルを比較し、AIに伝える` }, { path: '/browse', title: '部品やレイアウトを探す', detail: `${Object.keys(definitions).length}パターンの動作と実装を見る` }, { path: '/tools', title: '色と文字を調整する', detail: '自分の配色・文章で試し、CSSをコピー' }, { path: '/knowledge', title: 'デザインの企画を横断して探す', detail: '180件の企画案を読み、関連する項目をたどる。各企画の作例は未制作です。' }].map(item => (
            <Link key={item.path} to={item.path} className="motion-control flex items-center justify-between gap-3 rounded py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
              <span><strong className="text-sm">{item.title}</strong><span className="mt-1 block text-xs leading-relaxed text-ink-muted">{item.detail}</span></span><span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
      <section aria-labelledby="live-tools-home-heading" className="mx-6 mt-4 rounded-xl border border-ink/30 bg-surface-highlight p-5">
        <h2 id="live-tools-home-heading" className="mt-2 text-lg font-bold">いま使える実用ツール</h2>
        <div className="mt-4 space-y-4">{liveTools.map(tool => <div key={tool.id}><Link to={tool.path} className="inline-block py-1 text-sm font-bold underline underline-offset-4">{tool.titleJa}</Link><p className="mt-1 text-xs leading-relaxed text-ink-muted">{tool.description}</p></div>)}</div>
      </section>
      <section aria-labelledby="design-atlas-home-heading" className="mx-6 mt-7 border-t border-ink-border pt-5">
        <h2 id="design-atlas-home-heading" className="text-lg font-bold">Design Styles / デザイン図鑑</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">ミニマリズム、スイス・スタイル、和のデザインなど、{designStyles.length}系統の特徴と向いている用途を確認できます。</p>
        <Link to="/styles" className="mt-2 inline-block py-2 text-sm font-semibold underline underline-offset-4">同じ画面でスタイルを見比べる</Link>
      </section>
      <section aria-labelledby="featured-heading" className="mt-7 px-6">
        <div className="flex items-baseline justify-between gap-3"><h2 id="featured-heading" className="text-lg font-bold">ページづくりに役立つ例</h2><Link to="/browse" className="py-2 text-xs font-semibold underline underline-offset-4">すべて見る</Link></div>
        <div className="mt-3 grid grid-cols-2 gap-4">{featuredPatterns.map(definition => <PatternCard key={definition.id} definition={definition} />)}</div>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">コードのコピーは利用許諾を意味しません。使う前に<Link to="/licenses" className="font-semibold underline underline-offset-4">権利・利用条件</Link>を確認してください。</p>
      </section>
      <section aria-labelledby="collections-home-heading" className="mx-6 mt-7 border-t border-ink-border pt-5">
        <h2 id="collections-home-heading" className="text-lg font-bold">目的に合う組み合わせを探す</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">記事、フォーム、操作部品など、用途ごとにパターンをまとめています。</p>
        <Link to="/collections" className="mt-2 inline-block py-2 text-sm font-semibold underline underline-offset-4">コレクションを見る</Link>
      </section>
      <section aria-labelledby="reuse-guide-heading" className="mx-6 mt-6 border-t border-ink-border pt-5">
        <h2 id="reuse-guide-heading" className="text-lg font-bold">プレビューから実装へ</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">コードの形式、調整できる値、自分のページで確認する点をまとめたガイドです。</p>
        <Link to="/guide" className="mt-2 inline-block py-2 text-sm font-semibold underline underline-offset-4">使い方ガイドを読む</Link>
      </section>
      <details className="mx-6 mt-7 border-t border-ink-border pt-4 text-sm">
        <summary className="cursor-pointer py-2 font-semibold">今後のコンテンツ案</summary>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">公開前の企画です。完成した実装例ではありません。</p>
        <div className="mt-2 flex flex-col gap-1 font-semibold underline underline-offset-4"><Link to="/upcoming" className="py-2">UIパターンの案 {plannedPatterns.length}件</Link><Link to="/tools/upcoming" className="py-2">実用ツールの案 {plannedTools.length}件</Link><Link to="/knowledge" className="py-2">関連リンク付きの企画台帳 180件</Link></div>
      </details>
    </div>
  );
};

export default Home;
