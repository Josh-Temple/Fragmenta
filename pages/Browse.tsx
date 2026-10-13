import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import PatternCard from '../components/PatternCard';
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

      <main className="flex-1 px-5 py-6">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink/50 font-display">
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
          <div className="grid grid-cols-2 gap-4 pb-24">
            {patterns.map(definition => (
              <PatternCard key={definition.id} definition={definition} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Browse;
