import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { catalog, categoryLabel, ideaById, ideas, sourceById, relationDisplayLabel, isSafeKnowledgeSourceUrl } from '../data/knowledge';

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  // Client-side route changes do not automatically move keyboard or screen-reader focus.
  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);
  const location = useLocation();
  const state = location.state as { returnTo?: unknown } | null;
  const returnTo = typeof state?.returnTo === 'string' && /^\/knowledge(?:\?|$)/.test(state.returnTo) ? state.returnTo : '/knowledge';
  const entry = id ? ideaById.get(id) : undefined;
  if (!entry) return <div lang="ja" className="px-5 py-8">
    <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2">項目が見つかりません</h1>
    <p className="mt-3 text-sm leading-relaxed text-ink-muted">URLのIDを確認するか、一覧から選び直してください。</p>
    <Link to={returnTo} className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">知識ベースに戻る</Link>
  </div>;
  const related = entry.relatedIdeaIds.flatMap(relatedId => {
    const found = ideaById.get(relatedId);
    return found ? [found] : [];
  });
  const category = catalog.categories.find(item => item.id === entry.categoryId);
  const siblings = ideas.filter(item => item.categoryId === entry.categoryId);
  const siblingIndex = siblings.findIndex(item => item.id === entry.id);
  const previous = siblings[siblingIndex - 1];
  const next = siblings[siblingIndex + 1];
  const draft = entry.editorial;
  const sources = (draft?.sourceIds ?? []).flatMap(sourceId => sourceById[sourceId] ? [sourceById[sourceId]] : []);
  return <article lang="ja" className="min-w-0 px-5 py-7 pb-14">
    <nav aria-label="パンくずリスト" className="text-sm">
      <Link to={returnTo} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">知識ベース</Link>
      <span aria-hidden="true" className="mx-2">/</span><span>{categoryLabel(entry.categoryId)}</span>
    </nav>
    <header className="mt-4 border-b border-ink-border pb-6">
      <p className="text-xs font-semibold tracking-wider text-primary">PLANNED / 企画段階</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold leading-tight focus-visible:outline-2 focus-visible:outline-offset-2">{entry.titleJa}</h1>
      {entry.titleEn && <p lang="en" className="mt-2 text-sm text-ink-muted">{entry.titleEn}</p>}
      <p className="mt-3 text-sm text-ink-muted">分類：{categoryLabel(entry.categoryId)}</p>
      <p className="mt-1 break-all font-mono text-xs text-ink-muted">ID: {entry.id}</p>
      {draft?.updatedOn && <p className="mt-1 text-xs text-ink-muted">メモの更新日：{draft.updatedOn}</p>}
    </header>
    <section aria-labelledby="knowledge-status-title" className="py-6">
      <h2 id="knowledge-status-title" className="text-xl font-bold">現在の内容</h2>
      <p className="mt-3 text-sm leading-relaxed">この項目は今後制作する候補です。{draft ? '以下は編集下書きであり、説明全体の出典照合や独立レビューは完了していません。' : '説明、実装方法、プレビュー、出典の調査はまだ完了していません。'}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">確定資料や公式仕様としては使用せず、調査・制作の出発点として参照してください。</p>
    </section>
    {draft && <section aria-labelledby="knowledge-draft-title" className="border-t border-ink-border py-6">
      <h2 id="knowledge-draft-title" className="text-xl font-bold">参考メモ（未レビュー）</h2>
      <p className="mt-3 text-sm leading-relaxed">{draft.summary}</p>
      {[
        { title: '向く用途', items: draft.appropriateUses },
        { title: '避けたい設計', items: draft.pitfalls },
        { title: '確認事項', items: draft.reviewChecks },
      ].map(group => <div key={group.title} className="mt-4"><h3 className="text-sm font-bold">{group.title}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}
      {[
        ['使用例', draft.practicalExample], ['実装時の注意', draft.implementationNotes],
        ['アクセシビリティ', draft.accessibilityNotes], ['AIへの指示例', draft.aiInstruction],
      ].filter((item): item is [string, string] => Boolean(item[1])).map(([title, value]) => <div key={title} className="mt-4"><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{value}</p></div>)}
    </section>}
    {draft && <section aria-labelledby="knowledge-sources-title" className="border-t border-ink-border py-6">
      <h2 id="knowledge-sources-title" className="text-xl font-bold">参考資料と確認状況</h2>
      {sources.length ? <><p className="mt-2 text-sm leading-relaxed text-ink-muted">関連する部分を確認した参考資料です。メモ全体の裏付けや利用許諾を確認したことを意味しません。</p>
        <ul className="mt-3 space-y-4">{sources.map(source => <li key={source.url} className="text-sm leading-relaxed">
          {isSafeKnowledgeSourceUrl(source.url)
            ? <a href={source.url} rel="noopener noreferrer" className="font-semibold underline underline-offset-4">{source.publisher}：{source.title}</a>
            : <span className="font-semibold">{source.publisher}：{source.title}（安全な参照URLではないためリンクを表示しません）</span>}
          <p className="mt-1 text-xs text-ink-muted">確認範囲：{source.scope} ・ 確認日：{source.checkedOn}</p>
          <p className="mt-1 text-xs text-ink-muted">{source.rights}</p>
        </li>)}</ul></> : <p className="mt-2 text-sm text-ink-muted">参考資料は未登録です。</p>}
    </section>}
    <section aria-labelledby="knowledge-related-title" className="border-t border-ink-border py-6">
      <h2 id="knowledge-related-title" className="text-xl font-bold">関連する企画案</h2>
      <p className="mt-2 text-sm text-ink-muted">関連関係と方向は編集案で、内容の独立レビューは未完了です。</p>
      {related.length ? <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{related.map(item => {
        const relation = entry.relations?.find(value => value.targetId === item.id);
        return <li key={item.id} className="rounded-lg border border-ink-border bg-surface p-3">
          <Link state={{ returnTo }} to={`/knowledge/${item.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{item.titleJa}</Link>
          <p className="mt-1 text-xs text-ink-muted">{categoryLabel(item.categoryId)} ・ {relation ? relationDisplayLabel(entry.id, relation) : '関連理由は未確認'}</p>
          {relation && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{relation.reasonJa}</p>}
        </li>;
      })}</ul> : <p className="mt-3 text-sm text-ink-muted">関連候補は未登録です。</p>}
    </section>
    {entry.relatedExisting.length > 0 && <section aria-labelledby="knowledge-existing-title" className="border-t border-ink-border py-6">
      <h2 id="knowledge-existing-title" className="text-xl font-bold">既存のFragmenta資料</h2>
      <p className="mt-2 text-sm text-ink-muted">利用条件はリンク先で確認してください。</p>
      <ul className="mt-3 space-y-2">{entry.relatedExisting.map(ref => <li key={ref.kind + ':' + ref.id}><Link to={ref.kind === 'style' ? `/styles?style=${encodeURIComponent(ref.id)}` : `/p/${encodeURIComponent(ref.id)}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{ref.label}</Link></li>)}</ul>
    </section>}
    <section aria-labelledby="knowledge-data-title" className="border-t border-ink-border py-6">
      <h2 id="knowledge-data-title" className="text-xl font-bold">AIによる参照</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">JSONでIDを検索すると分類や関連IDを取得できます。企画中・未レビューの状態も保持してください。</p>
      <a href="/knowledge/ideas.json" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">構造化JSONを開く</a>
    </section>
    <nav aria-label="同じ分野の項目" className="mt-2 border-t border-ink-border pt-5">
      <p className="mb-3 text-sm font-bold">同じ分野の前後の項目</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {previous && <Link state={{ returnTo }} to={`/knowledge/${previous.id}`} className="min-h-11 rounded-lg border border-ink-border p-3 text-sm font-semibold underline underline-offset-4">前へ：{previous.titleJa}</Link>}
        {next && <Link state={{ returnTo }} to={`/knowledge/${next.id}`} className="min-h-11 rounded-lg border border-ink-border p-3 text-sm font-semibold underline underline-offset-4">次へ：{next.titleJa}</Link>}
      </div>
      <Link to={category ? `/knowledge?category=${category.id}` : '/knowledge'} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">同じ分野の企画案を見る</Link>
    </nav>
  </article>;
};
export default KnowledgeDetail;
