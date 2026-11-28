import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findCollection } from '../data/collections';
import { definitions } from '../data/definitions';

const CollectionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const collection = findCollection(id);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus({ preventScroll: true });
  }, [id]);

  if (!collection) {
    return <div className="p-6">
      <h1 ref={titleRef} tabIndex={-1} className="text-xl font-bold">コレクションが見つかりません</h1>
      <Link to="/collections" className="underline text-primary mt-4 inline-block">コレクション一覧へ</Link>
    </div>;
  }

  return (
    <div className="px-4 pb-6">
      <header className="flex items-center gap-3 py-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="戻る"
          className="size-11 rounded-full hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-primary">
          <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-sm font-medium text-ink-muted">コレクション</span>
      </header>
      <h1 ref={titleRef} tabIndex={-1} className="font-display text-3xl font-bold leading-tight mb-3">{collection.title}</h1>
      <p className="text-ink-muted leading-relaxed mb-4">{collection.description}</p>
      <p className="text-xs text-ink-muted mb-6">収録パターンは{collection.patternIds.length}件です。どの作例からでも開けます。</p>
      <div className="grid gap-4">
        {collection.patternIds.map(patternId => {
          const def = definitions[patternId];
          return <Link key={patternId} to={`/p/${patternId}`}
            className="rounded-xl border border-ink-border bg-surface p-5 block hover:shadow-paper-lg focus-visible:outline-2 focus-visible:outline-primary">
            <h2 className="text-lg font-bold font-display">{def.title}</h2>
            <p className="text-sm text-ink-muted mt-2">{def.description}</p>
            <span className="text-xs font-semibold text-primary mt-3 inline-block">パターンを見る →</span>
          </Link>;
        })}
      </div>
    </div>
  );
};
export default CollectionDetail;
