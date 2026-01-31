import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollectionDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* iOS Status Bar Spacer */}
      <div className="h-12 w-full"></div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-ink-border">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-start text-ink rounded-full hover:bg-ink/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5 block font-display">Collection Detail</span>
          <h1 className="text-sm font-extrabold tracking-tight font-display">Button States Pack</h1>
        </div>
        <div className="w-10 h-10 flex items-center justify-end">
          <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      <main className="px-4 pb-32">
        {/* Hero Title & Description */}
        <section className="mt-6 mb-8">
          <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] mb-3 font-display">Button States Pack</h2>
          <p className="text-ink-muted text-base leading-relaxed font-normal">
            A curated set of micro-interactions focusing on tactile feedback and fluid transitions for modern web components. Inspired by traditional paper stationery.
          </p>
        </section>

        {/* Progress Section */}
        <div className="bg-surface rounded-2xl p-5 mb-10 shadow-paper border border-ink-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-ink">States Explored</span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">4 / 12</span>
          </div>
          <div className="w-full bg-ink/10 h-2.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '33.3%' }}></div>
          </div>
          <p className="mt-3 text-[11px] font-medium text-ink-muted flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Complete the remaining items to unlock the full source files.
          </p>
        </div>

        {/* Grid of Motion Cards */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Card 1: Hover State */}
          <div className="bg-surface p-4 rounded-3xl shadow-paper border border-ink-border">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-paper flex items-center justify-center mb-4 shadow-inner-soft border border-ink-border">
              {/* Interactive Preview Simulation */}
              <div className="group cursor-pointer bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/20 flex items-center gap-2 font-display">
                <span>Magnetic Hover</span>
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">CSS Only</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Popular</span>
              </div>
            </div>
            <div className="px-1">
              <h3 className="text-lg font-bold tracking-tight mb-1 font-display">01. Magnetic Hover</h3>
              <p className="text-sm text-ink-muted mb-5 leading-snug">Elastic scaling and subtle shadow depth triggered by cursor proximity.</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-white text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-lg">code</span>
                  Copy Code
                </button>
                <button className="flex-1 border border-primary/20 text-primary text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-primary/5">
                  <span className="material-symbols-outlined text-lg">psychology</span>
                  AI Prompt
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Press State */}
          <div className="bg-surface p-4 rounded-3xl shadow-paper border border-ink-border">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-paper flex items-center justify-center mb-4 shadow-inner-soft border border-ink-border">
              {/* Interactive Preview Simulation */}
              <div className="bg-paper text-primary border-2 border-primary px-8 py-3 rounded-xl font-bold shadow-[0_4px_0_0_rgb(205,133,63)] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer font-display select-none">
                <span>Press Me</span>
                <span className="material-symbols-outlined text-sm">touch_app</span>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Framer Motion</span>
              </div>
            </div>
            <div className="px-1">
              <h3 className="text-lg font-bold tracking-tight mb-1 font-display">02. Press State</h3>
              <p className="text-sm text-ink-muted mb-5 leading-snug">Inset "pressed paper" effect with haptic-style motion for tactile feedback.</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-white text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-lg">code</span>
                  Copy Code
                </button>
                <button className="flex-1 border border-primary/20 text-primary text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-primary/5">
                  <span className="material-symbols-outlined text-lg">psychology</span>
                  AI Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Tab Bar (Visual match) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-paper/95 backdrop-blur-xl border-t border-ink-border px-6 pt-3 pb-8 z-40">
        <div className="flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 group">
            <span className="material-symbols-outlined text-[24px] text-primary filled">grid_view</span>
            <span className="text-[10px] font-bold text-primary">Library</span>
          </button>
          <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[24px]">explore</span>
            <span className="text-[10px] font-bold">Discover</span>
          </button>
          <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[24px]">bookmark</span>
            <span className="text-[10px] font-bold">Saved</span>
          </button>
          <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CollectionDetail;