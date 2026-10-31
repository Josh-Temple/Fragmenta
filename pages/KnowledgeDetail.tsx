import React from 'react';
import { Link, useParams } from 'react-router-dom';
import catalog from '../data/content-ideas.json';

const ideas = catalog.ideas;
const categoryName = (id: string) => catalog.categories.find(category => category.id === id)?.label ?? id;

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const entry = ideas.find(item => item.id === id);
  if (!entry) {
    return <div lang="ja" className="px-5 py-8">
      <h1 className="text-2xl font-bold">項目が見つかりません</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">URLのIDを確認するか、一覧から選び直してください。</p>
      <Link to="/knowledge" className="mt-4 min-h-11 inline-flex items-center font-semibold underline underline-offset-4">知識ベースに戻る</Link>
    </div>;
  }
  const related = entry.relatedIdeaIds.flatMap(relatedId => {
    const found = ideas.find(item => item.id === relatedId);
    return found ? [found] : [];
  });
  const category = catalog.categories.find(item => item.id === entry.categoryId);
  const siblings = ideas.filter(item => item.categoryId === entry.categoryId);
  const siblingIndex = siblings.findIndex(item => item.id === entry.id);
  const previous = siblings[siblingIndex - 1];
  const next = siblings[siblingIndex + 1];
  const draft = 'editorial' in entry && entry.editorial ? entry.editorial : null;
  return (
    <article lang="ja" className="min-w-0 px-5 py-7 pb-14">
      <nav aria-label="パンくずリスト" className="text-sm">
        <Link to="/knowledge" className="min-h-11 inline-flex items-center font-semibold underline underline-offset-4">知識ベース</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>{categoryName(entry.categoryId)}</span>
      </nav>
      <header className="mt-4 border-b border-ink-border pb-6">
        <p className="text-xs tracking-wider font-semibold text-primary">PLANNED / 企画段階</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">{entry.titleJa}</h1>
        <p className="mt-3 text-sm text-ink-muted">分類：{categoryName(entry.categoryId)}</p>
        <p className="mt-1 font-mono text-xs text-ink-muted break-all">ID: {entry.id}</p>
      </header>
      <section aria-labelledby="knowledge-status-title" className="py-6">
        <h2 id="knowledge-status-title" className="text-xl font-bold">現在の内容</h2>
        <p className="mt-3 text-sm leading-relaxed">この項目は今後制作する候補として登録されています。{draft ? '以下に編集下書きがありますが、出典照合や実装検証はまだ完了していません。' : '説明、実装方法、プレビュー、出典の調査はまだ完了していません。'}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">デザインの特徴や品質を評価した確定資料としては使用せず、調査・制作の出発点として参照してください。</p>
      </section>
      {draft && <section aria-labelledby="knowledge-draft-title" className="border-t border-ink-border py-6">
        <h2 id="knowledge-draft-title" className="text-xl font-bold">参考メモ（未レビューの下書き）</h2>
        <p className="mt-3 text-sm leading-relaxed">{draft.summary}</p>
        {[
          { title: '向く用途', items: draft.appropriateUses },
          { title: '避けたい設計', items: draft.pitfalls },
          { title: '確認事項', items: draft.reviewChecks },
        ].map(group => <div key={group.title} className="mt-4">
          <h3 className="text-sm font-bold">{group.title}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
            {group.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>)}
        <p className="mt-4 text-xs text-ink-muted">編集下書きであり、専門家レビュー・ユーザー検証・出典確認の完了を意味しません。</p>
      </section>}
      <section aria-labelledby="knowledge-related-title" className="border-t border-ink-border py-6">
        <h2 id="knowledge-related-title" className="text-xl font-bold">関連する企画案</h2>
        <p className="mt-2 text-sm text-ink-muted">用途や表現が近い候補へのリンクです。類似点・相違点は今後検証します。</p>
        {related.length ? <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {related.map(item => <li key={item.id} className="rounded-lg border border-ink-border bg-surface p-3">
            <Link to={`/knowledge/${item.id}`} className="inline-flex min-h-11 items-center font-semibold text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{item.titleJa}</Link>
            <p className="mt-1 text-xs text-ink-muted">{categoryName(item.categoryId)} ・ 企画段階</p>
          </li>)}
        </ul> : <p className="mt-3 text-sm text-ink-muted">関連候補は未登録です。</p>}
      </section>
      {entry.relatedExisting.length > 0 && <section aria-labelledby="knowledge-existing-title" className="border-t border-ink-border py-6">
        <h2 id="knowledge-existing-title" className="text-xl font-bold">既存のFragmenta資料</h2>
        <p className="mt-2 text-sm text-ink-muted">すでにある図鑑・パターンへの参照です。コードの利用条件はリンク先で確認してください。</p>
        <ul className="mt-3 space-y-2">
          {entry.relatedExisting.map(ref => <li key={ref.kind + ':' + ref.id}>
            <Link to={ref.kind === 'style' ? `/styles?style=${encodeURIComponent(ref.id)}` : `/p/${encodeURIComponent(ref.id)}`}
              className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{ref.label}</Link>
          </li>)}
        </ul>
      </section>}
      <section aria-labelledby="knowledge-data-title" className="border-t border-ink-border py-6">
        <h2 id="knowledge-data-title" className="text-xl font-bold">AIによる参照</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">JSON一覧で上のIDを検索すると、この項目の分類と関連IDを取得できます。企画案という状態も保持してください。</p>
        <a href="/knowledge/ideas.json" className="mt-3 min-h-11 inline-flex items-center text-sm font-semibold underline underline-offset-4">構造化JSONを開く</a>
      </section>
      <nav aria-label="同じ分野の項目" className="mt-2 border-t border-ink-border pt-5">
        <p className="mb-3 text-sm font-bold">同じ分野の前後の項目</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {previous && <Link to={`/knowledge/${previous.id}`} className="min-h-11 rounded-lg border border-ink-border p-3 text-sm font-semibold underline underline-offset-4">前へ：{previous.titleJa}</Link>}
          {next && <Link to={`/knowledge/${next.id}`} className="min-h-11 rounded-lg border border-ink-border p-3 text-sm font-semibold underline underline-offset-4">次へ：{next.titleJa}</Link>}
        </div>
        <Link to={category ? `/knowledge?category=${category.id}` : '/knowledge'} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">同じ分野の企画案を見る</Link>
      </nav>
    </article>
  );
};

export default KnowledgeDetail;
