import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import { designStyles } from '../data/design-styles';
import { liveTools } from '../data/live-tools';
import { matchesSearch, patternSearchAliases, styleSearchAliases } from '../data/discovery';
import { compositionGuides, matchesComposition } from '../data/composition';
import PatternCard from '../components/PatternCard';
import { ideas as knowledgeIdeas, matchesKnowledge } from '../data/knowledge';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [localQuery, setLocalQuery] = useState(query);
  useEffect(() => { setLocalQuery(query); }, [query]);
  const patterns = Object.values(definitions).filter(item => matchesSearch(query, [item.title, item.description, getPatternKind(item), item.category, ...item.tags, patternSearchAliases[item.id] ?? '']));
  const styles = designStyles.filter(item => matchesSearch(query, [item.name, item.ja, item.summary, item.use, ...item.features, ...item.avoid, styleSearchAliases[item.id] ?? '', 'デザイン スタイル']));
  const tools = liveTools.filter(item => matchesSearch(query, [item.title, item.titleJa, item.description, ...item.tags, 'ツール']));
  const total = patterns.length + styles.length + tools.length;
  const knowledge = query.trim() ? knowledgeIdeas.filter(item => matchesKnowledge(item, query)) : [];
  const compositions = query ? compositionGuides.filter(item => matchesComposition(item, query)) : [];
  const groups = [
    { id: 'tool', label: '実用ツール', count: tools.length },
    { id: 'style', label: 'デザイン図鑑', count: styles.length },
    { id: 'pattern', label: 'UIパターン', count: patterns.length },
    { id: 'composition', label: '構図ガイド', count: compositions.length },
    { id: 'knowledge', label: '知識ベースの企画', count: knowledge.length },
  ].filter(group => group.count > 0);
  return (
    <div lang="ja" className="min-w-0 px-5 py-6">
      <Link to="/" className="inline-block min-h-11 py-2 text-sm font-semibold underline underline-offset-4">ホーム</Link>
      <h1 className="mt-2 text-3xl font-bold">サイト内検索</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">UIパターン、デザイン図鑑、実用ツール、構図ガイド、知識ベースの企画を検索できます。</p>
      <form role="search" onSubmit={event => { event.preventDefault(); setSearchParams({ q: localQuery.trim() }); }} className="mt-5">
        <label htmlFor="pattern-search" className="block text-sm font-semibold">キーワード</label>
        <div className="mt-2 flex gap-2"><input id="pattern-search" type="search" value={localQuery} onChange={event => setLocalQuery(event.target.value)} placeholder="例：記事、ガラス、行間" className="min-w-0 flex-1 rounded-lg border border-ink/40 bg-surface-highlight px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" /><button type="submit" className="rounded-lg bg-ink px-4 text-sm font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">検索</button></div>
        {(localQuery || query) && <button type="button" onClick={() => { setLocalQuery(''); setSearchParams({}); }} className="mt-2 min-h-11 py-2 text-sm underline underline-offset-4">検索をクリア</button>}
      </form>
      <p role="status" className="mt-4 text-sm leading-relaxed text-ink-muted">{query ? `「${query}」の検索結果 ${total + knowledge.length + compositions.length}件（公開コンテンツ ${total}件、未レビューの企画 ${knowledge.length}件${compositions.length ? `、構図ガイド下書き ${compositions.length}件` : ''}）` : `すべての公開コンテンツ ${total}件`}</p>
      <div aria-label="検索の例" className="mt-3 flex flex-wrap gap-2">{['記事', 'ガラス', '行間', '配色'].map(example => <button type="button" key={example} onClick={() => setSearchParams({ q: example })} className="min-h-11 rounded-full border border-ink/30 px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{example}</button>)}</div>
      {groups.length > 1 && <nav aria-label="検索結果の分類" className="mt-5 flex flex-wrap gap-2 border-y border-ink-border py-2">
        {groups.map(group => <button
          key={group.id} type="button"
          onClick={() => document.getElementById(group.id + '-results-heading')?.focus()}
          className="min-h-11 px-2 text-sm font-semibold underline underline-offset-4"
        >{group.label}（{group.count}）</button>)}
      </nav>}
      {groups.length === 0 ? <div className="mt-7 border-t border-ink-border pt-5"><h2 className="text-lg font-bold">見つかりませんでした</h2><p className="mt-2 text-sm leading-relaxed text-ink-muted">短い言葉や別の表現で試してください。「記事」「ガラス」「配色」などでも検索できます。</p><Link to="/browse" className="mt-3 inline-block py-2 text-sm font-semibold underline underline-offset-4">パターン一覧から探す</Link></div> : <>
        {tools.length > 0 && <section className="mt-7" aria-labelledby="tool-results-heading"><h2 tabIndex={-1} id="tool-results-heading" className="text-lg font-bold">実用ツール · {tools.length}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{tools.map(tool => <Link key={tool.id} to={tool.path} className="rounded-xl border border-ink/30 bg-surface-highlight p-4 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><h3 className="font-bold">{tool.titleJa}</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{tool.description}</p></Link>)}</div></section>}
        {styles.length > 0 && <section className="mt-7" aria-labelledby="style-results-heading"><h2 tabIndex={-1} id="style-results-heading" className="text-lg font-bold">デザイン図鑑 · {styles.length}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{styles.map(style => <Link key={style.id} to={`/styles?${new URLSearchParams({ style: style.id })}`} className="min-w-0 rounded-xl border border-ink/30 bg-surface-highlight p-4 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><h3 className="font-bold">{style.ja}</h3><p lang="en" className="mt-1 text-xs text-ink-muted">{style.name}</p><p className="mt-2 text-sm leading-relaxed text-ink-muted">{style.summary}</p></Link>)}</div></section>}
        {patterns.length > 0 && <section className="mt-7" aria-labelledby="pattern-results-heading"><h2 tabIndex={-1} id="pattern-results-heading" className="text-lg font-bold">UIパターン · {patterns.length}</h2><div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">{patterns.map(definition => <PatternCard key={definition.id} definition={definition} />)}</div></section>}
      </>}
      {compositions.length > 0 && <section className="mt-7 border-t border-ink-border pt-5" aria-labelledby="composition-results-heading">
        <h2 tabIndex={-1} id="composition-results-heading" className="text-lg font-bold">構図ガイド（下書き） · {compositions.length}</h2>
        <ul className="mt-3 space-y-2">{compositions.slice(0, 5).map(item => <li key={item.id}>
          <Link to={'/composition?' + new URLSearchParams({ id: item.id, q: query })} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{item.titleJa}</Link>
        </li>)}</ul>
        {compositions.length > 5 && <Link to={'/composition?' + new URLSearchParams({ view: 'atlas', q: query })} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">該当する構図をすべて見る</Link>}
      </section>}
      {knowledge.length > 0 && <section className="mt-7 border-t border-ink-border pt-5" aria-labelledby="knowledge-results-heading">
        <h2 tabIndex={-1} id="knowledge-results-heading" className="text-lg font-bold">知識ベースの企画 · {knowledge.length}</h2>
        <p className="mt-2 text-sm text-ink-muted">参考メモは未レビューです。</p>
        <ul className="mt-3 space-y-2">{knowledge.slice(0, 5).map(item => <li key={item.id}><Link to={`/knowledge/${item.id}`} state={{ returnTo: `/knowledge?${new URLSearchParams({ q: query })}` }} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{item.titleJa}</Link></li>)}</ul>
        {knowledge.length > 5 && <Link to={`/knowledge?${new URLSearchParams({ q: query })}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">該当する企画をすべて見る</Link>}
      </section>}
      <p className="mt-7 text-xs leading-relaxed text-ink-muted">知識ベースの企画と公開中のコンテンツは分けて表示しています。<Link to={query ? `/knowledge?${new URLSearchParams({ q: query })}` : '/knowledge'} className="font-semibold underline underline-offset-4">知識ベースの企画180件を検索</Link>できます。<Link to="/licenses" className="font-semibold underline underline-offset-4">パターンの利用条件</Link>も確認してください。</p>
    </div>
  );
};

export default SearchResults;
