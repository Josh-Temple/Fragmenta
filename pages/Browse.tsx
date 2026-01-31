import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { definitions } from '../data/definitions';
import AnimationCard from '../components/AnimationCard';

const Browse: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'button' | 'loader' | 'text' | 'card' | 'input'>('all');

  const animations = Object.values(definitions).filter(def => 
    filter === 'all' ? true : def.category === filter
  );

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'button', label: 'Buttons' },
    { id: 'loader', label: 'Loaders' },
    { id: 'text', label: 'Text FX' },
    { id: 'card', label: 'Cards' },
    { id: 'input', label: 'Inputs' },
  ];

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
          <button className="flex items-center justify-center size-10 rounded-full bg-surface text-ink hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
        <div className="px-5 mb-4">
          <Link to="/search" className="relative group block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="material-symbols-outlined text-ink/40 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <div className="block w-full p-3.5 pl-11 text-sm bg-surface-highlight border border-ink-border rounded-xl text-ink/40 cursor-text shadow-sm hover:border-primary/50 transition-colors">
              Search motions, triggers...
            </div>
          </Link>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
             <button 
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    filter === cat.id 
                    ? 'bg-primary text-white border border-primary shadow-sm font-bold' 
                    : 'bg-transparent border border-ink-border text-ink-muted hover:border-primary hover:bg-surface hover:text-primary'
                }`}
             >
                {cat.label}
             </button>
          ))}
        </div>
      </header>
      
      <main className="flex-1 px-5 py-6">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink/50 font-display">
            {filter === 'all' ? 'New Arrivals' : `${filter}s`}
          </h2>
          <span className="text-xs text-primary font-bold">{animations.length} results</span>
        </div>
        
        {animations.length === 0 ? (
            <div className="py-12 text-center text-ink-muted">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                <p>No animations found in this category.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-4 pb-24">
            {animations.map((def) => (
                <AnimationCard key={def.id} definition={def} />
            ))}
            </div>
        )}
      </main>
    </>
  );
};

export default Browse;