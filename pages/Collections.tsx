import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';

const Collections: React.FC = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus({ preventScroll: true });
  }, []);
  const visible = collections.filter(collection =>
    [collection.title, collection.description].some(text =>
      text.toLowerCase().includes(query.trim().toLowerCase())
    )
  );

  return (
    <div className="w-full px-4 pb-28">
      <header className="flex items-center gap-3 py-4">
        <button type="button" onClick={() => navigate(-1)}
          aria-label="Go back" className="size-11 rounded-full hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-primary">
          <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 ref={titleRef} tabIndex={-1} className="text-2xl font-bold font-display">Collections</h1>
      </header>
      <p className="text-ink-muted mb-5">Curated sets of registered patterns. Every item opens a real pattern.</p>
      <label htmlFor="collection-search" className="block text-sm font-semibold mb-2">Search collections</label>
      <input id="collection-search" type="search" value={query} onChange={event => setQuery(event.target.value)}
        placeholder="Title or description" className="w-full h-12 rounded-xl border border-ink-border bg-surface-highlight px-4 mb-6 focus-visible:outline-2 focus-visible:outline-primary" />
      <div className="grid gap-4">
        {visible.map(collection => (
          <Link key={collection.id} to={`/collections/${collection.id}`}
            className="block rounded-2xl border border-ink-border bg-surface p-5 shadow-paper hover:shadow-paper-lg focus-visible:outline-2 focus-visible:outline-primary">
            <h2 className="text-xl font-bold font-display">{collection.title}</h2>
            <p className="text-sm leading-relaxed text-ink-muted mt-2">{collection.description}</p>
            <p className="text-xs font-semibold text-primary mt-3">{collection.patternIds.length} registered patterns</p>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="rounded-xl border border-ink-border p-5">
            <p>No collections match “{query}”.</p>
            <button type="button" className="mt-2 underline text-primary" onClick={() => setQuery('')}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Collections;
