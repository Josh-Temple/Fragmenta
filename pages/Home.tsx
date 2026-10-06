import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { definitions } from '../data/definitions';
import PatternCard from '../components/PatternCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const featuredIds = [
    'warm-neo-brutalist-editorial',
    'editorial-split-layout',
    'elastic-button',
    'glass-tilt',
  ];
  const featuredPatterns = featuredIds.map(id => definitions[id]).filter(Boolean);

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-50 flex items-center bg-paper/90 backdrop-blur-md px-6 py-4 justify-between border-b border-ink/5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-paper">
            <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
          </div>
          <h2 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em]">Fragmenta</h2>
        </div>
        <Link
          to="/browse"
          className="flex size-10 items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-paper transition-colors"
          aria-label="Browse patterns"
        >
          <span className="material-symbols-outlined">grid_view</span>
        </Link>
      </div>

      <div className="px-6 pt-8 pb-6">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-primary font-bold mb-3">
          Live UI pattern library
        </div>
        <h1 className="text-ink tracking-tight text-[40px] font-bold leading-[1.04] text-left">
          Reusable web
          <br />
          <span className="text-primary">UI patterns</span>
        </h1>
        <p className="text-ink/70 font-body text-base font-normal leading-relaxed pt-3 max-w-[92%]">
          Preview motion, styles, components, and layouts. Then take away implementation code or an AI-ready prompt.
        </p>

        <div className="pt-8 pb-2">
          <label className="relative flex w-full flex-col">
            <div className="relative flex w-full items-center rounded-xl bg-surface shadow-inner overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all border border-ink/5">
              <div className="flex h-14 w-12 items-center justify-center text-ink/50">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="h-14 w-full bg-transparent border-none text-ink placeholder:text-ink/40 focus:ring-0 font-body text-base"
                placeholder="Search editorial, glass, elastic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                type="button"
                onClick={() => navigate(`/search?q=${searchQuery}`)}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-ink/5 text-ink cursor-pointer hover:bg-primary hover:text-paper transition-colors"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between px-6 pb-4 pt-2">
          <h3 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em]">Categories</h3>
          <Link to="/browse" className="text-xs font-bold text-primary uppercase tracking-wide hover:text-ink transition-colors">
            View all
          </Link>
        </div>
        <div className="flex w-full overflow-x-auto no-scrollbar gap-3 px-6 pb-2">
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-primary text-paper text-sm font-bold border border-primary shadow-sm">All</Link>
          <Link to="/browse?kind=motion" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Motion</Link>
          <Link to="/browse?kind=interaction" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Interaction</Link>
          <Link to="/browse?kind=style" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Styles</Link>
          <Link to="/browse?kind=component" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Components</Link>
          <Link to="/browse?kind=layout" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Layouts</Link>
          <Link to="/browse?kind=text-effect" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Text & Effects</Link>
        </div>
      </div>

      <div className="flex flex-col w-full mt-6">
        <div className="flex items-end justify-between px-6 mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink/45 mb-1">Start here</div>
            <h3 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em]">Featured patterns</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 px-6">
          {featuredPatterns.map(definition => (
            <PatternCard key={definition.id} definition={definition} />
          ))}
        </div>
      </div>

      <div className="mt-8 mx-6 p-5 rounded-xl bg-ink border border-ink/5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h4 className="text-paper font-bold text-lg mb-1">Curated collections</h4>
          <p className="text-paper/80 font-body text-sm mb-4 max-w-[85%]">
            Group reusable patterns by interface goal instead of browsing isolated examples.
          </p>
          <Link to="/collections" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors">
            Explore collections <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
