import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { definitions } from '../data/definitions';
import AnimationCard from '../components/AnimationCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  // Select specific animations for the "Trending Now" section
  const trendingIds = ['elastic-button', 'glass-tilt', 'smart-skeleton', 'fluid-toggle'];
  const trendingAnimations = trendingIds.map(id => definitions[id]).filter(Boolean);

  return (
    <div className="flex flex-col">
      {/* Sticky Header (Moved from Layout) */}
      <div className="sticky top-0 z-50 flex items-center bg-paper/90 backdrop-blur-md px-6 py-4 justify-between border-b border-ink/5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-paper">
            <span className="material-symbols-outlined text-[20px]">animation</span>
          </div>
          <h2 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em]">Fragmenta</h2>
        </div>
        <div className="flex items-center justify-end">
          <button className="flex size-10 items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-paper transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-ink tracking-tight text-[40px] font-bold leading-[1.1] text-left uppercase">
          Engineered <br /><span className="text-primary">Motion</span>
        </h1>
        <p className="text-ink/70 font-body text-base font-normal leading-relaxed pt-3 max-w-[90%]">
          Precision interactions and micro-animations for the modern web interface.
        </p>

        {/* Search Bar */}
        <div className="pt-8 pb-2">
          <label className="relative flex w-full flex-col">
            <div className="relative flex w-full items-center rounded-xl bg-surface shadow-inner overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all border border-ink/5">
              <div className="flex h-14 w-12 items-center justify-center text-ink/50">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="h-14 w-full bg-transparent border-none text-ink placeholder:text-ink/40 focus:ring-0 font-body text-base"
                placeholder="Search for 'elastic hover'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <div 
                onClick={() => navigate(`/search?q=${searchQuery}`)}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-ink/5 text-ink cursor-pointer hover:bg-primary hover:text-paper transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between px-6 pb-4 pt-2">
          <h3 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em]">Categories</h3>
          <Link to="/browse" className="text-xs font-bold text-primary uppercase tracking-wide hover:text-ink transition-colors">
            View All
          </Link>
        </div>
        <div className="flex w-full overflow-x-auto no-scrollbar gap-3 px-6 pb-2">
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-primary text-paper text-sm font-bold border border-primary shadow-sm">All</Link>
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Buttons</Link>
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Inputs</Link>
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Transitions</Link>
          <Link to="/browse" className="shrink-0 h-10 px-5 flex items-center rounded-full bg-transparent border border-ink/20 text-ink/80 text-sm font-medium hover:border-primary hover:bg-surface hover:text-primary transition-colors">Loaders</Link>
        </div>
      </div>

      {/* Trending Now */}
      <div className="flex flex-col w-full mt-6">
        <h3 className="px-6 text-ink text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Trending Now</h3>
        <div className="grid grid-cols-2 gap-4 px-6">
          {trendingAnimations.map((def) => (
            <AnimationCard key={def.id} definition={def} />
          ))}
        </div>
      </div>

      {/* Weekly Collections */}
      <div className="mt-8 mx-6 p-5 rounded-xl bg-ink border border-ink/5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h4 className="text-paper font-bold text-lg mb-1">Weekly Collections</h4>
          <p className="text-paper/80 font-body text-sm mb-4 max-w-[80%]">Curated sets of motion for e-commerce and dashboards.</p>
          <Link to="/collections" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors">
            Explore Collections <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;