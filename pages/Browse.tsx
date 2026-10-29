import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import PatternCard from '../components/PatternCard';
import { plannedPatterns } from '../data/planned-patterns';
import { plannedTools } from '../data/planned-tools';
import { liveTools } from '../data/live-tools';
import { designStyles } from '../data/design-styles';
import { PatternKind } from '../types';

type Filter = 'all' | PatternKind;

const categories: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'motion', label: 'Motion' },
  { id: 'interaction', label: 'Interaction' },
  { id: 'style', label: 'Styles' },
  { id: 'component', label: 'Components' },
  { id: 'layout', label: 'Layouts' },
  { id: 'text-effect', label: 'Text & Effects' },
];

const validFilters = new Set<Filter>(categories.map(category => category.id));

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get('kind') as Filter | null;
  const filter: Filter = requestedFilter && validFilters.has(requestedFilter) ? requestedFilter : 'all';

  const patterns = Object.values(definitions).filter(definition =>
    filter === 'all' ? true : getPatternKind(definition) === filter
  );

  const setFilter = (nextFilter: Filter) => {
    if (nextFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ kind: nextFilter });
    }
  };

  const heading =
    filter === 'all'
      ? 'All patterns'
      : categories.find(category => category.id === filter)?.label ?? 'Patterns';

  return (
    <>
      <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md border-b border-ink-border pt-6 pb-2">
        <div className="flex items-center justify-between px-5 mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center justify-center size-10 rounded-full hover:bg-ink/5 transition-colors">
              <span className="material-symbols-outlined text-ink/70">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-ink font-display">Browse</h1>
          </div>
        </div>

        <div className="px-5 mb-4">
          <Link to="/search" className="relative group block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="material-symbols-outlined text-ink/40 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <div className="block w-full p-3.5 pl-11 text-sm bg-surface-highlight border border-ink-border rounded-xl text-ink/40 cursor-text shadow-xs hover:border-primary/50 transition-colors">
              Search styles, layouts, motion...
            </div>
          </Link>
        </div>

        <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                filter === category.id
                  ? 'bg-primary text-white border border-primary shadow-xs font-bold'
                  : 'bg-transparent border border-ink-border text-ink-muted hover:border-primary hover:bg-surface hover:text-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </header>

      <section aria-labelledby="browse-results-heading" className="flex-1 px-5 py-6">
        <div className="flex items-end justify-between mb-5">
          <h2 id="browse-results-heading" className="text-sm font-bold uppercase tracking-widest text-ink/50 font-display">
            {heading}
          </h2>
          <span className="text-xs text-primary font-bold">{patterns.length} results</span>
        </div>

        {patterns.length === 0 ? (
          <div className="py-12 text-center text-ink-muted">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
            <p>No patterns found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-8">
            {patterns.map(definition => (
              <PatternCard key={definition.id} definition={definition} />
            ))}
          </div>
        )}
        <section aria-labelledby="style-atlas-browse-heading" className="rounded-xl border border-ink-border bg-surface p-4 mb-5">
          <div className="flex items-start justify-between gap-2">
            <h3 id="style-atlas-browse-heading" className="text-base font-bold text-ink">Design Styles / デザイン図鑑</h3>
            <span className="shrink-0 text-xs font-bold text-primary">{designStyles.length} styles</span>
          </div>
          <p lang="ja" className="mt-2 text-sm text-ink-muted leading-relaxed">
            見た目の系統を検索・比較し、AIに渡す指示文を作ります。実装済みUIパターンの件数とは別です。
          </p>
          <Link to="/styles" className="mt-2 inline-block py-2 text-sm font-semibold text-primary underline underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Open Design Styles
          </Link>
        </section>
        <section aria-labelledby="upcoming-browse-heading" className="rounded-xl border border-ink-border bg-surface p-4 mb-20">
          <div className="flex items-center justify-between gap-2">
            <h3 id="upcoming-browse-heading" className="text-base font-bold text-ink">Upcoming patterns</h3>
            <span className="text-xs font-bold text-primary">{plannedPatterns.length} planned</span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed my-2">
            Explore future ideas, not usable demos or copyable code. These are separate from the {Object.keys(definitions).length} currently listed gallery entries.
          </p>
          <Link to="/upcoming" className="inline-block text-sm font-semibold text-primary underline underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            View planned patterns
          </Link>
        </section>
        <section aria-labelledby="planned-tools-browse-heading" className="rounded-xl border border-ink-border bg-surface p-4 mb-20">
          <div className="flex items-start justify-between gap-2">
            <h3 id="planned-tools-browse-heading" className="text-base font-bold text-ink">Practical tools</h3>
            <span className="shrink-0 text-xs font-bold text-primary">{liveTools.length} available</span>
          </div>
          <p lang="ja" className="mt-2 text-sm text-ink-muted leading-relaxed">
            配色と文字組みの2つのツールを使えます。文章作成やデータ変換など、今後の案は{plannedTools.length}件です。
          </p>
          <Link to="/tools" className="mt-2 inline-block py-2 text-sm font-semibold text-primary underline underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Open tools
          </Link>
        </section>
      </section>
    </>
  );
};

export default Browse;
