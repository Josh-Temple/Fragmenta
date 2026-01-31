import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BestPractices: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink-border">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-ink/5 rounded-full cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight font-display">A11y & Performance</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-ink/5 rounded-full cursor-pointer transition-colors">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
            <button className="p-2 hover:bg-ink/5 rounded-full cursor-pointer transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
        {/* Reading Progress Bar */}
        <div className="w-full h-1 bg-ink/5">
          <div className="h-full bg-primary" style={{ width: '42%' }}></div>
        </div>
      </div>

      <main className="max-w-md mx-auto pb-24">
        {/* Header Section */}
        <section className="px-4 pt-8 pb-4">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block font-display">Developer Resource</span>
          <h1 className="text-3xl font-bold leading-[1.1] mb-4 font-display">Designing for Motion Accessibility</h1>
          <p className="text-base leading-relaxed text-ink-muted">
            Respecting user preferences is critical for those with vestibular disorders. Learn how to balance delightful motion with technical performance and inclusive design.
          </p>
        </section>

        {/* A11y Section Card */}
        <div className="p-4">
          <div className="bg-surface p-6 rounded-xl shadow-paper border border-ink-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">accessibility_new</span>
              <h3 className="font-bold text-lg font-display">The Accessibility Rule</h3>
            </div>
            <p className="text-sm mb-6 leading-relaxed text-ink-muted">
              Use the 'prefers-reduced-motion' media query to provide a safe experience for users who experience dizziness or nausea from screen movement.
            </p>
            <div className="bg-[#2e2b29] rounded-lg p-4 overflow-x-auto mb-4 border border-ink/10">
              <code className="text-xs font-mono text-gray-300 block leading-relaxed">
                <span className="text-purple-400">@media</span> (<span className="text-blue-300">prefers-reduced-motion</span>: reduce) {'{'}<br/>
                &nbsp;&nbsp;* {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-300">animation-duration</span>: 0.01ms !important;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-300">transition-duration</span>: 0.01ms !important;<br/>
                &nbsp;&nbsp;{'}'}<br/>
                {'}'}
              </code>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium text-sm hover:bg-primary-dark transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy Snippet
            </button>
          </div>
        </div>

        {/* Performance Comparison Section */}
        <section className="px-4 mt-6">
          <h2 className="text-xl font-bold mb-6 font-display">Performance Foundations</h2>
          {/* Comparison Container */}
          <div className="space-y-4">
            {/* Bad Example */}
            <div className="bg-surface rounded-xl overflow-hidden border-2 border-red-900/10">
              <div className="bg-red-900/5 px-4 py-2 flex justify-between items-center border-b border-red-900/10">
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-800">Avoid: Layout Properties</span>
                <span className="material-symbols-outlined text-red-800 text-sm">error</span>
              </div>
              <div className="p-4 flex gap-4">
                <div className="w-16 h-16 bg-red-900/10 rounded flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 bg-red-800 rounded-sm"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1 text-ink">Height/Width Animations</p>
                  <p className="text-xs text-ink-muted mb-3">Causes layout thrashing and forces the browser to re-calculate geometry.</p>
                  <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-800 w-[85%]"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] opacity-50 uppercase">Jank Level</span>
                    <span className="text-[10px] font-bold text-red-800 uppercase">High CPU Impact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Good Example */}
            <div className="bg-surface rounded-xl overflow-hidden border-2 border-primary/10">
              <div className="bg-primary/5 px-4 py-2 flex justify-between items-center border-b border-primary/10">
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Best: CSS Transforms</span>
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
              </div>
              <div className="p-4 flex gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-sm"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1 text-ink">Scale/Translate/Opacity</p>
                  <p className="text-xs text-ink-muted mb-3">Handled by the GPU. Smooth 60FPS without affecting document flow.</p>
                  <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[15%]"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] opacity-50 uppercase">Jank Level</span>
                    <span className="text-[10px] font-bold text-primary uppercase">Hardware Accelerated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Card */}
        <div className="p-4 mt-6">
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 font-display text-ink">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              Pro-tip: Will-Change
            </h4>
            <p className="text-sm leading-relaxed mb-4 text-ink-muted">
              Use <code className="bg-white/50 px-1 py-0.5 rounded font-mono text-ink">will-change: transform;</code> to hint to the browser that an element is about to move.
            </p>
            <div 
              className="w-full bg-white/40 h-[120px] rounded-lg flex items-center justify-center bg-cover bg-center border border-primary/10" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeLG4allBcmSQWH4HWRdB3Hzva_C6aIzzTN4W0xr-GBgOjZ9jPJjNemDGLhfQx1n1acDabxf3nmz6Xb6CqyNHlP6YUZtrQo8iQ0ATSj94bXMPlKhiSgOUU6pfNp7ZPmk6dc5VuJvZxydMeuHMlfq2xa9a6cVJOmWNRbiaYAALKLqigm49fLsBhRg3KSeW53_4CzPOz9mHNWuq8AlWdn_Qvblm0Ofnq_XYdMhDP4nP3R5dcoLZKI2WOx4Roc6DphuneHGwiN5q1pzs')" }}
            >
              <span className="bg-paper/90 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm text-ink border border-ink-border">Motion Visualization</span>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-paper/95 backdrop-blur-md border-t border-ink-border px-6 py-4 flex justify-between items-center z-50">
        <Link to="/" className="flex flex-col items-center gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/browse" className="flex flex-col items-center gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="text-[10px] font-medium">Library</span>
        </Link>
        <Link to="/guide" className="flex flex-col items-center gap-1 text-primary cursor-pointer relative">
          <span className="material-symbols-outlined filled">menu_book</span>
          <span className="text-[10px] font-medium">Guide</span>
        </Link>
        <Link to="/licenses" className="flex flex-col items-center gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined">copyright</span>
          <span className="text-[10px] font-medium">License</span>
        </Link>
      </nav>
    </div>
  );
};

export default BestPractices;