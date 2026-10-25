import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { clamp01, drawMorph } from '../lib/morphGeometry';

/** Isolated Canvas 2D geometry experiment; deliberately absent from live registry. */
const Morph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const repaintRef = useRef<() => void>(() => {});
  const anglesRef = useRef({ yaw: 0.65, pitch: -0.45 });
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const autoRef = useRef(false);
  const reducedRef = useRef(false);
  const [morph, setMorph] = useState(0);
  const [auto, setAuto] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [supported, setSupported] = useState(true);
  const [size, setSize] = useState({ w: 320, h: 320 });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedRef.current = query.matches;
      setReduced(query.matches);
      if (query.matches) { autoRef.current = false; setAuto(false); }
    };
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const refresh = () => {
      const w = Math.max(1, Math.round(el.clientWidth));
      setSize({ w, h: Math.min(440, Math.max(260, w)) });
    };
    refresh();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(refresh);
      observer.observe(el);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) { setSupported(false); return; }
    setSupported(true);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size.w * ratio);
    canvas.height = Math.round(size.h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    let raf = 0;
    let last = 0;
    const paint = () => drawMorph(ctx, size.w, size.h, currentRef.current, anglesRef.current.yaw, anglesRef.current.pitch);
    repaintRef.current = paint;
    const tick = (time: number) => {
      const delta = last ? Math.min(40, time - last) : 16;
      last = time;
      const target = targetRef.current;
      const distance = target - currentRef.current;
      if (reducedRef.current) currentRef.current = target;
      else if (Math.abs(distance) > 0.001) currentRef.current += distance * Math.min(1, delta / 130);
      else currentRef.current = target;
      if (autoRef.current && !reducedRef.current) anglesRef.current.yaw += delta * 0.00045;
      paint();
      if (autoRef.current || Math.abs(target - currentRef.current) > 0.001) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); repaintRef.current = () => {}; };
  }, [morph, auto, reduced, size]);

  const updateMorph = useCallback((value: number) => {
    const next = clamp01(value);
    targetRef.current = next;
    setMorph(next);
  }, []);

  const turn = (dx: number, dy: number) => {
    anglesRef.current.yaw += dx * 0.011;
    anglesRef.current.pitch = Math.max(-1.35, Math.min(1.35, anglesRef.current.pitch + dy * 0.011));
    // Redraw directly; avoid recreating the Canvas backing store on every pointer move.
    repaintRef.current();
  };

  return (
    <div className="px-5 pb-12 pt-8 sm:px-8">
      <Link to="/browse" className="text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">← Back to gallery</Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-current px-3 py-1 text-xs">EXPERIMENT · NOT PUBLISHED</span>
        <span className="text-xs opacity-70">Canvas 2D software projection</span>
      </div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Morph</h1>
      <p className="mt-3 text-sm leading-relaxed opacity-80">Drag the shape or use the arrow keys to rotate it. Change its geometry from a rounded cube to a sphere. This is an isolated prototype, not a gallery pattern.</p>

      <section className="mt-6" aria-labelledby="morph-stage-title">
        <h2 id="morph-stage-title" className="sr-only">Interactive shape experiment</h2>
        <div ref={containerRef} className="relative overflow-hidden rounded-2xl bg-[#a4ad90] text-[#303a2f]">
          {supported ? (
            <canvas ref={canvasRef} className="block w-full outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-[#303a2f]" style={{ height: size.h, touchAction: 'none' }}
              tabIndex={0} aria-label="Rotatable three-dimensional shape. Drag, or focus and use arrow keys to rotate. Shape changes with the slider below."
              onPointerDown={e => { pointerRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
              onPointerMove={e => { const p = pointerRef.current; if (!p || p.id !== e.pointerId) return; turn(e.clientX - p.x, e.clientY - p.y); pointerRef.current = { ...p, x: e.clientX, y: e.clientY }; }}
              onPointerUp={e => { if (pointerRef.current?.id === e.pointerId) pointerRef.current = null; }}
              onPointerCancel={() => { pointerRef.current = null; }}
              onKeyDown={e => { const step: Record<string, [number, number]> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; const pair = step[e.key]; if (pair) { e.preventDefault(); turn(pair[0], pair[1]); } }}
            >An interactive shape preview requires Canvas 2D.</canvas>
          ) : (
            <div role="status" className="flex min-h-[280px] items-center justify-center p-8 text-center">Canvas 2D is unavailable. The shape controls remain accessible, but this preview cannot be drawn on this device.</div>
          )}
          <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-[11px]">{morph < 0.5 ? 'ROUNDED CUBE' : 'SPHERE'} / PROTOTYPE</span>
        </div>
      </section>

      <section aria-labelledby="morph-controls-title" className="mt-6 space-y-4">
        <h2 id="morph-controls-title" className="font-semibold">Shape controls</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg border border-current px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => updateMorph(0)}>Rounded cube</button>
          <button type="button" className="rounded-lg border border-current px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => updateMorph(1)}>Sphere</button>
          <button type="button" className="rounded-lg border border-current px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-45"
            aria-pressed={auto} disabled={reduced} onClick={() => { autoRef.current = !autoRef.current; setAuto(autoRef.current); }}>
            {auto ? 'Stop rotation' : 'Auto rotate'}
          </button>
        </div>
        <label htmlFor="morph-blend" className="block text-sm">Shape: {Math.round(morph * 100)}% sphere</label>
        <input id="morph-blend" type="range" min="0" max="100" step="1" value={Math.round(morph * 100)}
          onChange={e => updateMorph(Number(e.target.value) / 100)} className="block w-full" />
        <p className="text-xs opacity-70" aria-live="polite">{reduced ? 'Reduced motion is enabled. Shape changes are immediate; automatic rotation is disabled.' : 'Automatic rotation is off by default. Drag, use arrow keys, or enable rotation.'}</p>
      </section>
      <section className="mt-8 border-t border-current/20 pt-5 text-sm leading-relaxed opacity-80">
        <h2 className="font-semibold">Prototype limitations</h2>
        <p className="mt-2">Software-projected 3D geometry rendered with Canvas 2D. This preview demonstrates cube-to-sphere shape changes and manual/optional rotation, not a WebGL model or reusable component generator. Torus, organic forms, dither export, generated code, prompts, sound, and rights clearance remain unimplemented. No live catalog entry or copying permission is added.</p>
      </section>
    </div>
  );
};

export default Morph;