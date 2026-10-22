import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Morph is an intentionally isolated content scaffold.
 * The interactive 3D renderer, generated snippet and prompt are NOT implemented yet.
 */
const Morph: React.FC = () => (
  <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
    <Link to="/browse" className="text-sm underline underline-offset-4">← Back to gallery</Link>
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="rounded-full border border-current px-3 py-1 text-xs uppercase tracking-widest">Prototype · Not published</span>
      <span className="text-sm opacity-60">Visual effects / Interactive</span>
    </div>
    <h1 className="mt-5 text-5xl font-bold tracking-tight">Morph</h1>
    <p className="mt-4 max-w-2xl text-lg opacity-75">
      A monochrome, dithered object that responds to touch and transforms between geometric forms.
    </p>
    <section className="mt-10 overflow-hidden rounded-3xl border border-current/15" aria-label="Morph preview placeholder">
      <div className="relative flex min-h-[360px] items-center justify-center bg-[#a4ad90] p-6 text-[#303a2f] sm:min-h-[480px]">
        <div className="text-center">
          <div aria-hidden="true" className="mx-auto mb-8 h-36 w-36 rotate-[-12deg] border-[3px] border-dashed border-current opacity-55 shadow-[15px_17px_0_0_rgba(48,58,47,0.16)]" />
          <p className="font-mono text-2xl font-semibold tracking-wide">Rounded cube</p>
          <p className="mt-3 font-mono text-sm opacity-70">Interactive renderer coming soon</p>
        </div>
        <span className="absolute bottom-4 right-5 font-mono text-xs opacity-70">STATIC PLACEHOLDER</span>
      </div>
    </section>
    <section className="mt-10 grid gap-6 md:grid-cols-2" aria-label="Planned functionality">
      <div>
        <h2 className="text-xl font-semibold">Planned interactions</h2>
        <p className="mt-3 leading-relaxed opacity-75">
          Tap to morph between cube, sphere, torus and organic forms. Drag to rotate. Optional sound, paused by default.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Planned implementation</h2>
        <p className="mt-3 leading-relaxed opacity-75">
          WebGL or Canvas rendering, monochrome ordered dithering, responsive touch controls,
          reduced-motion support and a reusable code example.
        </p>
      </div>
    </section>
    <p className="mt-10 border-t border-current/15 pt-5 text-sm opacity-60">
      Scaffold only. No 3D animation, clipboard export or AI prompt is available in this version.
      Rights and reuse terms must be reviewed before release.
    </p>
  </main>
);

export default Morph;
