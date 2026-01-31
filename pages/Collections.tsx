import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Collections: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-paper/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-ink-border">
        <button 
          onClick={() => navigate(-1)}
          className="text-ink flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center uppercase font-display">Collections</h2>
        <div className="flex size-10 items-center justify-end">
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-ink hover:bg-ink/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">filter_list</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 sticky top-[60px] z-40 bg-paper">
        <label className="flex flex-col h-12 w-full shadow-sm">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-ink-border bg-surface-highlight focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="text-ink-muted flex items-center justify-center pl-4 rounded-l-xl border-r-0">
              <span className="material-symbols-outlined text-2xl">search</span>
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-ink focus:outline-0 bg-transparent border-none h-full placeholder:text-ink-muted/70 px-4 text-base font-normal leading-normal font-body" 
              placeholder="Find animations..." 
              defaultValue=""
            />
          </div>
        </label>
      </div>

      {/* Hero Text */}
      <div className="px-4 pb-2 pt-2">
        <h1 className="text-ink tracking-tight text-[32px] font-bold leading-tight text-left font-display">
          Curated<br/><span className="text-primary italic">Masterpieces</span>
        </h1>
        <p className="text-ink-muted text-base font-normal leading-normal pt-2 font-body">Hand-picked high-performance motion kits.</p>
      </div>

      {/* Main Content - Cards */}
      <main className="flex flex-col gap-6 p-4 pb-24">
        
        {/* Card 1 */}
        <Link to="/collections/button-states" className="group relative flex flex-col items-stretch justify-start rounded-2xl shadow-paper bg-surface overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-paper-lg border border-ink-border">
          <div className="relative w-full aspect-[4/3] bg-paper bg-grid-pattern flex items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4 items-center">
              <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/30 transform transition-all group-hover:scale-105 group-hover:shadow-primary/50 flex items-center gap-2">
                <span>Submit</span>
              </button>
              <div className="flex gap-2 opacity-60">
                <div className="h-2 w-16 bg-ink/30 rounded-full"></div>
                <div className="h-2 w-8 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-paper/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-ink/80 font-mono border border-ink-border">
              PREVIEW
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-ink text-xl font-bold leading-tight tracking-tight mb-1 font-display">Button States Pack</h3>
                <p className="text-ink-muted text-sm font-normal leading-relaxed">Hover, press, focus, loading, and success patterns.</p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
            <div className="h-px w-full bg-ink-border my-1"></div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-ink">
                <span className="material-symbols-outlined text-[14px]">grid_view</span>
                14 Components
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-[14px]">code</span>
                CSS/Framer
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2 */}
        <div className="group relative flex flex-col items-stretch justify-start rounded-2xl shadow-paper bg-surface overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-paper-lg border border-ink-border">
          <div className="relative w-full aspect-[4/3] bg-paper bg-grid-pattern flex items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 w-full max-w-[240px] bg-paper rounded-lg p-4 border border-ink-border shadow-xl transform group-hover:-translate-y-1 transition-transform">
              <div className="flex flex-col gap-2">
                <div className="h-2 w-12 bg-ink/20 rounded"></div>
                <div className="h-10 w-full rounded border border-red-700/50 bg-red-500/5 flex items-center px-3 relative overflow-hidden">
                  <div className="absolute right-3 text-red-700">
                    <span className="material-symbols-outlined">error</span>
                  </div>
                </div>
                <div className="h-2 w-32 bg-red-700/30 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-ink text-xl font-bold leading-tight tracking-tight mb-1 font-display">Form Validation Suite</h3>
                <p className="text-ink-muted text-sm font-normal leading-relaxed">Feedback animations for better user guidance.</p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
            <div className="h-px w-full bg-ink-border my-1"></div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-ink">
                <span className="material-symbols-outlined text-[14px]">grid_view</span>
                8 Components
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collections;