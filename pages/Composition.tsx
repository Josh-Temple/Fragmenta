import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CompositionDiagram from '../components/CompositionDiagram';
import { compositionCatalog, compositionGuides, compositionCategories,
  compositionById, compositionCategoryLabel, matchesComposition } from '../data/composition';

const Composition: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get('q') ?? '');
  const query = params.get('q') ?? '';
  const category = compositionCategories.some(x => x.id === params.get('category'))
    ? params.get('category') ?? 'all' : 'all';
  const chosen = params.get('id') ?? '';
  const guide = compositionById.get(chosen) ?? compositionGuides[0];
  const filtered = useMemo(() => compositionGuides.filter(item =>
    (category === 'all' || item.categoryId === category) && matchesComposition(item, query)), [category, query]);
  useEffect(() => setInput(query), [query]);
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next);
  };
  return <div lang="ja" className="min-w-0 px-5 pb-12">
    <header className="pt-6 pb-6 border-b border-ink-border">
      <Link to="/knowledge" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">知識ベースに戻る</Link>
      <p className="mt-4 text-xs font-mono uppercase tracking-wider text-primary">Composition / 構図</p>
      <h1 className="mt-2 text-3xl font-bold">構図を比較して学ぶ</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">優先24件の編集下書きです。図は独自制作の模式図で、厳密な正解・不正解や実証済みの心理効果を示すものではありません。</p>
      <a href="/knowledge/composition-guides.json" className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4">AI向け構造化JSON</a>
    </header>
    <section aria-labelledby="composition-find" className="py-5 border-b border-ink-border">
      <h2 id="composition-find" className="text-lg font-bold">項目を探す</h2>
      <form role="search" className="mt-3 flex gap-2" onSubmit={event => { event.preventDefault(); setParam('q', input); }}>
        <label htmlFor="composition-query" className="sr-only">キーワード</label>
        <input id="composition-query" value={input} onChange={event => setInput(event.target.value)} type="search"
          placeholder="例：余白、孤独、黒い面" className="min-w-0 min-h-11 flex-1 rounded-lg border border-ink/40 bg-paper p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2" />
        <button className="min-h-11 rounded-lg bg-ink px-4 text-sm font-bold text-paper" type="submit">検索</button>
      </form>
      <label htmlFor="composition-category" className="mt-4 block text-sm font-semibold">分野</label>
      <select id="composition-category" value={category} onChange={event => setParam('category', event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-ink/40 bg-paper p-3 text-base">
        <option value="all">すべての分野</option>
        {compositionCategories.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <p className="mt-3 text-sm text-ink-muted" role="status">{filtered.length}件 / 全{compositionGuides.length}件</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="構図項目">
        {filtered.map(item => <Link key={item.id} to={'/composition?id=' + item.id + (query ? '&q=' + encodeURIComponent(query) : '') + (category !== 'all' ? '&category=' + encodeURIComponent(category) : '')}
          aria-current={guide.id === item.id ? 'page' : undefined}
          className={'flex min-h-11 shrink-0 items-center rounded-lg border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ' +
            (guide.id === item.id ? 'border-ink bg-ink text-paper' : 'border-ink-border bg-surface')}>{item.titleJa}</Link>)}
      </div>
      {!filtered.length && <p className="mt-2 text-sm">該当する項目がありません。検索条件を変更してください。</p>}
    </section>
    <article className="py-6" aria-labelledby="composition-title" key={guide.id}>
      <p className="text-xs font-mono text-primary">{guide.id} ・ {compositionCategoryLabel(guide.categoryId)}</p>
      <h2 id="composition-title" className="mt-2 text-2xl font-bold">{guide.titleJa}</h2>
      <p className="mt-3 text-sm leading-relaxed">{guide.definition}</p>
      <section aria-labelledby="composition-visual" className="mt-6">
        <h3 id="composition-visual" className="text-lg font-bold">構図の模式図</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div><p className="mb-2 text-sm font-semibold">配置例</p><CompositionDiagram guide={guide} variant="example" />
            <p className="mt-2 text-sm leading-relaxed">{guide.example}</p></div>
          <div><p className="mb-2 text-sm font-semibold">対照例</p><CompositionDiagram guide={guide} variant="comparison" />
            <p className="mt-2 text-sm leading-relaxed">{guide.contrast}</p></div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">模式図は位置・大きさ・明暗の違いを簡略化したものです。対照例も、目的によっては適切な構図になります。</p>
      </section>
      <section aria-labelledby="composition-ai" className="mt-7 border-t border-ink-border pt-5">
        <h3 id="composition-ai" className="text-lg font-bold">AIへの指示例</h3>
        <p className="mt-3 rounded-lg bg-surface p-4 text-sm leading-relaxed">{guide.aiInstruction}</p>
        <button type="button" onClick={() => { if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(guide.aiInstruction).catch(() => {}); }}
          className="mt-3 min-h-11 rounded-lg border border-ink-border px-4 text-sm font-semibold">指示文をコピー</button>
      </section>
      {guide.relatedLegacyIds.length > 0 && <section className="mt-6 border-t border-ink-border pt-5">
        <h3 className="text-sm font-bold">既存Fragmentaの関連案（編集候補）</h3>
        <ul className="mt-2 space-y-2">{guide.relatedLegacyIds.map(id => <li key={id}><Link className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
          to={'/knowledge/' + id}>{id}</Link></li>)}</ul>
      </section>}
      <section className="mt-6 border-t border-ink-border pt-5">
        <h3 className="text-sm font-bold">出典と検証状況</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">説明・図解・AI指示は未レビューの編集案です。参考資料の一部を参照していても、項目全体を検証したことにはなりません。</p>
        {guide.sourceIds.length ? <ul className="mt-2 space-y-2">{guide.sourceIds.map(id => <li key={id}><a className="text-sm underline underline-offset-4" rel="noopener noreferrer"
          href={compositionCatalog.sources[id].url}>{compositionCatalog.sources[id].publisher}：{compositionCatalog.sources[id].title}</a></li>)}</ul>
          : <p className="mt-2 text-sm text-ink-muted">参考資料の登録：未完了</p>}
      </section>
    </article>
    <footer className="border-t border-ink-border pt-5 text-xs text-ink-muted">
      <a href={compositionCatalog.issueUrl} className="underline underline-offset-4" rel="noopener noreferrer">構図120件の収録候補（GitHub Issue #48）</a>
      <p className="mt-2">既存180件の知識ベースとは分離し、優先24件を実装・レビュー中です。</p>
    </footer>
  </div>;
};
export default Composition;
