import React from 'react';
import { useNavigate } from 'react-router-dom';

const Licenses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center bg-paper/90 backdrop-blur-md px-4 py-4 justify-between border-b border-ink-border">
        <button 
          onClick={() => navigate(-1)}
          className="text-ink flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-ink text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">Licenses</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex flex-col flex-1 pb-24">
        {/* HeadlineText */}
        <div className="px-6 pt-10 pb-4">
          <h1 className="text-ink tracking-tight text-[32px] font-bold leading-tight font-display">
            Open Source <span className="text-primary italic">Credits</span>
          </h1>
        </div>

        {/* BodyText */}
        <div className="px-6 pb-8">
          <p className="text-ink-muted text-base font-normal leading-relaxed">
            A curated archive of the motion libraries and internal policies that power our digital experiences. We honor the craftsmanship of the open-source community.
          </p>
        </div>

        <div className="h-px bg-ink-border mx-6 mb-8"></div>

        {/* SectionHeader */}
        <div className="px-6 pb-4">
          <h3 className="text-ink text-sm font-bold leading-tight tracking-widest uppercase opacity-60 font-display">
            Third-Party Libraries
          </h3>
        </div>

        {/* ListItem 1 */}
        <div className="group px-6 mb-4">
          <div className="flex flex-col gap-3 bg-surface/50 rounded-xl p-5 border border-ink-border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                  <span className="material-symbols-outlined">deployed_code</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-ink text-lg font-bold leading-none font-display">Framer Motion</p>
                  <p className="text-primary text-sm font-medium leading-normal mt-1">MIT License</p>
                </div>
              </div>
              <div className="shrink-0 text-primary">
                <span className="material-symbols-outlined">open_in_new</span>
              </div>
            </div>
            {/* License Blockquote */}
            <div className="bg-paper p-4 rounded-lg border border-ink-border">
              <p className="text-[13px] leading-relaxed text-ink-muted font-mono italic">
                "Permission is hereby granted, free of charge, to any person obtaining a copy of this software..."
              </p>
            </div>
          </div>
        </div>

        {/* ListItem 2 */}
        <div className="group px-6 mb-4">
          <div className="flex flex-col gap-3 bg-surface/50 rounded-xl p-5 border border-ink-border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                  <span className="material-symbols-outlined">animation</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-ink text-lg font-bold leading-none font-display">GSAP Core</p>
                  <p className="text-primary text-sm font-medium leading-normal mt-1">Standard License</p>
                </div>
              </div>
              <div className="shrink-0 text-primary">
                <span className="material-symbols-outlined">open_in_new</span>
              </div>
            </div>
          </div>
        </div>

        {/* SectionHeader: Internal Policy */}
        <div className="px-6 pb-4 mt-6">
          <h3 className="text-ink text-sm font-bold leading-tight tracking-widest uppercase opacity-60 font-display">
            Internal Policy
          </h3>
        </div>

        <div className="px-6 mb-8">
          <div className="bg-surface p-6 rounded-xl border border-ink-border relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-ink">
              <span className="material-symbols-outlined text-8xl">gavel</span>
            </div>
            <p className="text-ink text-base font-normal leading-relaxed mb-4">
              All original motion presets and structural UI components within this library are proprietary.
            </p>
            <p className="text-ink-muted text-sm font-normal leading-normal">
              Version 2.4 • Updated Oct 2023
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Licenses;