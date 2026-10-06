import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import PatternCard from '../components/PatternCard';

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchParams({ q: localQuery });
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchParams({});
  };

  const results = Object.values(definitions).filter(definition => {
    if (!query) return true;
    const lowerQ = query.toLowerCase();
    const kind = getPatternKind(definition);

    return (
      definition.title.toLowerCase().includes(lowerQ) ||
      definition.description.toLowerCase().includes(lowerQ) ||
      kind.toLowerCase().includes(lowerQ) ||
      definition.category.toLowerCase().includes(lowerQ) ||
      definition.tags.some(tag => tag.toLowerCase().includes(lowerQ))
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-ink-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-ink/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-ink">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight font-display">Search</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
          <input
            className="block w-full pl-12 pr-12 py-3.5 bg-surface border-none rounded-xl text-ink font-semibold placeholder-ink/40 focus:ring-2 focus:ring-primary/20 shadow-inner"
            placeholder="Search patterns..."
            type="text"
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {localQuery && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center" aria-label="Clear search">
              <span className="material-symbols-outlined text-ink/50 hover:text-primary transition-colors">cancel</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mt-4 mb-4">
        {query ? (
          <p className="text-ink-muted text-sm font-medium">
            Showing {results.length} results for <span className="text-primary font-bold">"{query}"</span>
          </p>
        ) : (
          <p className="text-ink-muted text-sm font-medium">
            Try: editorial, layout, button, glass, warm, outlined
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-32">
        {results.length > 0 ? (
          results.map(definition => (
            <PatternCard key={definition.id} definition={definition} />
          ))
        ) : (
          <div className="col-span-2 py-12 text-center opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
            <p>No patterns found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
