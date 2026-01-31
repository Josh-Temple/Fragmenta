import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { definitions } from '../data/definitions';
import AnimationCard from '../components/AnimationCard';

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

  // Search Logic
  const results = Object.values(definitions).filter(def => {
    if (!query) return true;
    const lowerQ = query.toLowerCase();
    return (
        def.title.toLowerCase().includes(lowerQ) ||
        def.description.toLowerCase().includes(lowerQ) ||
        def.tags.some(t => t.toLowerCase().includes(lowerQ))
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation / Search Bar Area */}
      <div className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-ink-border">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-ink/5 transition-colors"
          >
            <span className="material-symbols-outlined text-ink">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight font-display">Search</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-ink/5 transition-colors">
            <span className="material-symbols-outlined text-ink">more_horiz</span>
          </button>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
          <input 
            className="block w-full pl-12 pr-12 py-3.5 bg-surface border-none rounded-xl text-ink font-semibold placeholder-ink/40 focus:ring-2 focus:ring-primary/20 shadow-inner" 
            placeholder="Search animations..." 
            type="text" 
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {localQuery && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="material-symbols-outlined text-ink/50 hover:text-primary transition-colors">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Header */}
      <div className="px-4 mt-4 mb-4">
        {query ? (
            <p className="text-ink-muted text-sm font-medium">
            Showing {results.length} results for <span className="text-primary font-bold">"{query}"</span>
            </p>
        ) : (
            <p className="text-ink-muted text-sm font-medium">Popular searches: Button, Input, Glitch</p>
        )}
      </div>

      {/* Animation Card Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-32">
        {results.length > 0 ? (
            results.map(def => (
                <AnimationCard key={def.id} definition={def} />
            ))
        ) : (
             <div className="col-span-2 py-12 text-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
                <p>No results found.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;