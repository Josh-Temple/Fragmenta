import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { categories, categoryLabel, ideas, matchesKnowledge } from '../data/knowledge';

const PAGE_SIZE = 24;
const draftCount = ideas.filter(item => item.editorial).length;

const KnowledgeBase: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const query = params.get('q') ?? '';
  const [input, setInput] = useState(query);
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category') ?? 'all' : 'all';
  const draftOnly = params.get('draft') === '1';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => { setInput(query); }, [query]);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query, category, draftOnly]);

  const setFilter = (name: 'q' | 'category' | 'draft', value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(name);
    else next.set(name, value);
    if (next.toString() !== params.toString()) setParams(next);
  };
  const filtered = useMemo(() => ideas.filter(entry =>
    (category === 'all' || entry.categoryId === category) &&
    (!draftOnly || Boolean(entry.editorial)) && matchesKnowledge(entry, query)), [query, category, draftOnly]);
  const returnTo = `/knowledge${location.search}`;

  return <div lang="ja" className="min-w-0 px-5 pb-12">
    <header className="border-b border-ink-border pt-6 pb-6">
      <Link to="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">ホームに戻る</Link>
      <p className="mt-4 text-xs font-mono uppercase tracking-wider text-primary">デザインの企画と参考メモ</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">デザインを、つながりから探す</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{ideas.length}件の企画案を分野や関連項目から探せます。うち{draftCount}件の参考メモは未レビューです。公式の仕様や、完成した実装として扱わないでください。</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <a href="/knowledge/ideas.json" className="inline-flex min-h-11 items-center underline underline-offset-4">AI向けJSON</a>
        <a href="/knowledge/ideas.md" className="inline-flex min-h-11 items-center underline underline-offset-4">Markdown一覧</a>
        <a href="/knowledge/style-guides.json" className="inline-flex min-h-11 items-center underline underline-offset-4">デザインスタイルの用途 JSON</a>
        <a href="/knowledge/pattern-guides.json" className="inline-flex min-h-11 items-center underline underline-offset-4">UIパターンの用途 JSON</a>
        <Link to="/composition" className="inline-flex min-h-11 items-center underline underline-offset-4 font-semibold">構図ガイド（120件・模式図）</Link>
      </div>
    </header>
    <section aria-labelledby="knowledge-search-heading" className="border-b border-ink-border py-6">
      <h2 id="knowledge-search-heading" className="text-lg font-bold">コンテンツを探す</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <form role="search" onSubmit={event => { event.preventDefault(); setFilter('q', input.trim()); }}>
          <label htmlFor="knowledge-query" className="block text-sm font-semibold">キーワード</label>
          <div className="mt-2 flex gap-2">
            <input id="knowledge-query" type="search" value={input} onChange={event => setInput(event.target.value)} placeholder="例：配色、form、文字"
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-ink/40 bg-paper p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
            <button type="submit" className="min-h-11 rounded-lg bg-ink px-4 text-sm font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">検索</button>
          </div>
        </form>
        <div>
          <label htmlFor="knowledge-category" className="block text-sm font-semibold">分野</label>
          <select id="knowledge-category" value={category} onChange={event => setFilter('category', event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-ink/40 bg-paper p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <option value="all">すべての分野</option>
            {categories.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
      </div>
      {(draftCount < ideas.length || draftOnly) && <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={draftOnly} onChange={event => setFilter('draft', event.target.checked ? '1' : '')} className="size-4 shrink-0 accent-primary" />
        参考メモがある項目だけを表示（{draftCount}件）
      </label>}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-ink-muted">{filtered.length}件該当・{Math.min(visibleCount, filtered.length)}件表示 / 全{ideas.length}件</p>
        {(query || category !== 'all' || draftOnly) && <Link to="/knowledge" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">条件をクリア</Link>}
      </div>
    </section>
    {filtered.length ? <section aria-label="デザインの企画案" className="py-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.slice(0, visibleCount).map(entry => <article key={entry.id} className="flex min-w-0 flex-col rounded-xl border border-ink-border bg-surface p-4">
          <p className="text-xs leading-relaxed text-ink-muted">{categoryLabel(entry.categoryId)} ・ {entry.editorial ? '参考メモあり（未レビュー）' : '企画段階'}</p>
          <h2 className="mt-2 text-base font-bold leading-snug"><Link state={{ returnTo }} to={`/knowledge/${entry.id}`} className="inline-block rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{entry.titleJa}</Link></h2>
          {entry.titleEn && <p lang="en" className="mt-1 text-xs text-ink-muted">{entry.titleEn}</p>}
          {entry.editorial?.summary && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{entry.editorial.summary}</p>}
          <p className="mt-auto pt-3 text-xs text-ink-muted">関連候補 {entry.relatedIdeaIds.length}件{entry.relatedExisting.length ? ` ・ 既存資料 ${entry.relatedExisting.length}件` : ''}</p>
        </article>)}
      </div>
      {visibleCount < filtered.length && <button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="mt-5 min-h-11 w-full rounded-lg border border-ink-border px-4 py-3 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">さらに表示（残り{filtered.length - visibleCount}件）</button>}
    </section> : <section className="py-8" role="status"><h2 className="font-bold">一致する企画案はありません</h2><p className="mt-2 text-sm text-ink-muted">短い検索語にするか、分野を「すべて」に戻してください。</p></section>}
    <p className="border-t border-ink-border pt-5 text-xs leading-relaxed text-ink-muted">名称と関連付けは編集案です。学術的な分類、公式デザインシステムへの準拠、コードの再利用許諾を意味しません。</p>
  </div>;
};
export default KnowledgeBase;
