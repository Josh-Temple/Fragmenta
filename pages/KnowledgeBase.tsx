import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import catalog from '../data/content-ideas.json';

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('ja');
const categories = catalog.categories;
const entries = catalog.ideas;
const PAGE_SIZE = 24;
const labelFor = (id: string) => categories.find(category => category.id === id)?.label ?? id;

export const KnowledgeBase: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category') ?? 'all' : 'all';
  const draftOnly = params.get('draft') === '1';
  const draftCount = entries.filter(item => 'editorial' in item && item.editorial).length;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query, category, draftOnly]);

  const setFilter = (name: 'q' | 'category' | 'draft', value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(name);
    else next.set(name, value);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return entries.filter(entry => {
      if (category !== 'all' && entry.categoryId !== category) return false;
      if (draftOnly && !('editorial' in entry && entry.editorial)) return false;
      if (!q) return true;
      return normalize([entry.titleJa, entry.id, labelFor(entry.categoryId),
        ...entry.relatedExisting.map(item => item.label),
        ...('editorial' in entry && entry.editorial ? [
          entry.editorial.summary,
          ...entry.editorial.appropriateUses,
          ...entry.editorial.pitfalls,
          ...entry.editorial.reviewChecks,
        ] : [])].join(' ')).includes(q);
    });
  }, [query, category, draftOnly]);

  return (
    <div lang="ja" className="min-w-0 px-5 pb-12">
      <header className="pt-6 pb-6 border-b border-ink-border">
        <Link to="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">ホームに戻る</Link>
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-primary">Knowledge base / 計画中のデザイン資料</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">デザインを、つながりから探す</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">デザインやUIの企画案180件を、分類・関連項目から探せます。うち{draftCount}件には未レビューの参考メモがあります。完成した解説や実装例ではありません。</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a href="/knowledge/ideas.json" className="min-h-11 inline-flex items-center underline underline-offset-4">AI向けJSON</a>
          <a href="/knowledge/ideas.md" className="min-h-11 inline-flex items-center underline underline-offset-4">Markdown一覧</a>
        </div>
      </header>

      <section aria-labelledby="knowledge-search-heading" className="py-6 border-b border-ink-border">
        <h2 id="knowledge-search-heading" className="text-lg font-bold">コンテンツを探す</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="knowledge-query" className="block text-sm font-semibold">名前・分野・既存の関連項目</label>
            <input id="knowledge-query" type="search" value={query} onChange={event => setFilter('q', event.target.value)}
              placeholder="例：配色、フォーム、文字" className="mt-2 w-full min-h-11 rounded-lg border border-ink/40 bg-paper p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
          </div>
          <div>
            <label htmlFor="knowledge-category" className="block text-sm font-semibold">分野</label>
            <select id="knowledge-category" value={category} onChange={event => setFilter('category', event.target.value)}
              className="mt-2 w-full min-h-11 rounded-lg border border-ink/40 bg-paper p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <option value="all">すべての分野</option>
              {categories.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
        </div>
        <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" checked={draftOnly} onChange={event => setFilter('draft', event.target.checked ? '1' : '')}
            className="size-4 shrink-0 accent-primary" />
          参考メモがある項目だけを表示（{draftCount}件）
        </label>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p role="status" className="text-sm text-ink-muted">{filtered.length}件該当・{Math.min(visibleCount, filtered.length)}件表示 / 全{entries.length}件</p>
          {(query || category !== 'all' || draftOnly) && <Link to="/knowledge" className="min-h-11 inline-flex items-center text-sm font-semibold underline underline-offset-4">条件をクリア</Link>}
        </div>
      </section>

      {filtered.length ? (
        <section aria-label="デザインの企画案" className="py-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.slice(0, visibleCount).map(entry =>
              <article key={entry.id} className="flex min-w-0 flex-col rounded-xl border border-ink-border bg-surface p-4">
                <p className="text-xs leading-relaxed text-ink-muted">{labelFor(entry.categoryId)} ・ {'editorial' in entry && entry.editorial ? '参考メモあり（未レビュー）' : '企画段階'}</p>
                <h2 className="mt-2 text-base font-bold leading-snug">
                  <Link to={`/knowledge/${entry.id}`} className="inline-block rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{entry.titleJa}</Link>
                </h2>
                <p className="mt-2 font-mono text-[11px] break-all text-ink-muted">{entry.id}</p>
                <p className="mt-auto pt-3 text-xs text-ink-muted">関連案 {entry.relatedIdeaIds.length}件{entry.relatedExisting.length ? ` ・ 既存資料 ${entry.relatedExisting.length}件` : ''}</p>
              </article>
            )}
          </div>
          {visibleCount < filtered.length && (
            <button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
              className="mt-5 w-full min-h-11 rounded-lg border border-ink-border px-4 py-3 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
              さらに表示（残り{filtered.length - visibleCount}件）
            </button>
          )}
        </section>
      ) : (
        <section className="py-8" role="status">
          <h2 className="font-bold">一致する企画案はありません</h2>
          <p className="mt-2 text-sm text-ink-muted">短い検索語にするか、分野を「すべて」に戻してください。</p>
        </section>
      )}
      <p className="border-t border-ink-border pt-5 text-xs leading-relaxed text-ink-muted">
        この一覧は知識ベースを拡充するための企画台帳です。名称と関連付けは整理上の提案であり、学術的な分類、公式デザインシステムへの準拠、コードの再利用許諾を意味しません。
      </p>
    </div>
  );
};

export default KnowledgeBase;
