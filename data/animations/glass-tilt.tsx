import React, { useEffect, useState } from 'react';
import { AnimationDefinition } from '../../types';

export const glassTilt: AnimationDefinition = {
  id: 'glass-tilt',
  title: '傾くガラスカード',
  description: 'ポインターの位置に応じてガラス調のカードが傾きます。操作していないときにも緩やかに動きます。',
  tags: ['カード', 'React', '3D', 'ホバー'],
  category: 'card',
  continuousMotion: true,
  a11yNotes: 'ホバーしなくても内容を読めるようにします。一時停止や動きを減らす設定で、自動の動きと傾きが止まります。生成するJSXにも一時停止用のチェックボックスが付きます。',
  performanceScore: 90,
  a11yScore: 'A',
  params: [
    { key: 'intensity', cssVar: '--intensity', label: '傾きの強さ', type: 'number', min: 5, max: 45, step: 1, default: 20, unit: 'deg' },
    { key: 'blur', cssVar: '--blur', label: 'ぼかし', type: 'number', min: 0, max: 20, step: 1, default: 12, unit: 'px' },
  ],
  Preview: ({ values, paused = false }) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    useEffect(() => {
      if (!paused) return;
      setIsHovering(false);
      setRotate({ x: 0, y: 0 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, [paused]);

    const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (paused || e.pointerType === 'touch') return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      setIsHovering(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1
      
      // Tilt calculation
      const xOffset = x - 0.5;
      const yOffset = y - 0.5;
      setRotate({ 
          x: yOffset * values['intensity'], 
          y: -xOffset * values['intensity'] 
      });

      // Glare calculation
      setGlare({ x: x * 100, y: y * 100, opacity: 1 });
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      setRotate({ x: 0, y: 0 });
      setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
      <div className="perspective-1000 flex items-center justify-center p-8 w-full h-full" style={{ perspective: '1000px' }}>
           <style>{`
              @media (prefers-reduced-motion: reduce) { .fragmenta-glass-preview { animation: none !important; transform: none !important; transition: none !important; } }
              @keyframes idle-tilt {
                  0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
                  25% { transform: rotateX(5deg) rotateY(5deg); }
                  50% { transform: rotateX(0deg) rotateY(0deg); }
                  75% { transform: rotateX(-5deg) rotateY(-5deg); }
              }
          `}</style>
        <div 
          onPointerMove={handleMouseMove}
          onPointerLeave={handleMouseLeave}
          className="fragmenta-glass-preview w-56 h-36 rounded-2xl relative transition-all duration-200 motion-reduce:transition-none ease-out cursor-pointer group"
          style={{
            transform: !paused && isHovering
              ? `rotateX(${-rotate.x}deg) rotateY(${-rotate.y}deg) scale(1.05)` 
              : 'rotateX(0deg) rotateY(0deg)',
            animation: paused || isHovering ? 'none' : 'idle-tilt 8s ease-in-out infinite',
            transition: paused ? 'none' : undefined,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Shadow Element (Independent transform for depth) */}
          <div 
              className="absolute inset-4 bg-primary/40 blur-xl rounded-full transition-all duration-300 group-hover:inset-6 group-hover:opacity-60"
              style={{
                  transform: `translateZ(-20px) translateX(${isHovering ? rotate.y : 0}px) translateY(${isHovering ? rotate.x : 0}px)`,
                  opacity: glare.opacity ? 0.6 : 0.4
              }}
          ></div>

          {/* Main Card Content */}
          <div 
              className="absolute inset-0 rounded-2xl border border-white/50 overflow-hidden flex flex-col items-center justify-center gap-2 bg-linear-to-br from-white/30 to-white/10 shadow-lg backdrop-blur-md z-10"
              style={{ backdropFilter: `blur(${values['blur']}px)` }}
          >
              {/* Glare Effect */}
              <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                      opacity: isHovering ? glare.opacity : 0.3,
                      background: isHovering 
                          ? `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.6) 0%, transparent 60%)`
                          : 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.2) 50%, transparent 55%)'
                  }}
              ></div>

              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center inset-shadow-sm mb-1 border border-white/20">
                 <span className="material-symbols-outlined text-white">credit_card</span>
              </div>
              <div className="w-32 h-2 bg-white/60 rounded-full shadow-xs"></div>
              <div className="w-20 h-2 bg-white/30 rounded-full shadow-xs"></div>
              
              {/* Shine on border */}
              <div className="absolute inset-0 rounded-2xl border border-white/40 group-hover:border-white/80 transition-colors"></div>
          </div>
        </div>
      </div>
    );
  },
  generateCode: (values) => {
    const intensity = Number.isFinite(values['intensity']) ? Math.max(5, Math.min(45, values['intensity'])) : 20;
    const blur = Number.isFinite(values['blur']) ? Math.max(0, Math.min(20, values['blur'])) : 12;
    return `// Standalone React JSX: save as GlassCard.jsx; requires react and react-dom.
import React, { useState } from 'react';

export default function GlassCard() {
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const handleMove = (event) => {
    // Touch is not hover: keep the card readable without starting a transient tilt.
    if (paused || event.pointerType === 'touch') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({ x: -(y - 0.5) * ${intensity}, y: (x - 0.5) * ${intensity}, gx: x * 100, gy: y * 100 });
    setActive(true);
  };
  const reset = () => { setActive(false); setTilt({ x: 0, y: 0, gx: 50, gy: 50 }); };
  return (
    <div style={{ perspective: '1000px', padding: 32, display: 'inline-block' }}>
      <div className="glass-card-example" onPointerMove={handleMove} onPointerLeave={reset}
        role="img" aria-label="Decorative translucent glass card"
        style={{ transform: !paused && active ? \`rotateX(\${tilt.x}deg) rotateY(\${tilt.y}deg) scale(1.05)\` : undefined,
          animation: paused || active ? 'none' : undefined, transition: paused ? 'none' : undefined, transformStyle: 'preserve-3d' }}>
        <div className="glass-card-example__surface" style={{ backdropFilter: 'blur(${blur}px)' }}>
          <div className="glass-card-example__glare"
            style={{ background: \`radial-gradient(circle at \${tilt.gx}% \${tilt.gy}%, #fff9, transparent 60%)\` }} />
          <span aria-hidden="true" style={{ fontSize: 32 }}>◈</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Glass card</span>
        </div>
      </div>
      <label className="glass-card-example__pause">
        <input type="checkbox" checked={paused} onChange={event => { setPaused(event.target.checked); reset(); }} />
        Pause motion
      </label>
      <style>{\`
        .glass-card-example { width: 224px; height: 144px; border-radius: 16px; position: relative;
          box-shadow: 0 14px 32px #32220030; transition: transform 200ms ease-out;
          animation: glass-card-idle 8s ease-in-out infinite; }
        .glass-card-example__surface { position: absolute; inset: 0; border: 1px solid #ffffff88;
          border-radius: inherit; background: linear-gradient(140deg, #ffffff77, #ffffff20);
          display: flex; align-items: center; justify-content: center; flex-direction: column; overflow: hidden; }
        .glass-card-example__glare { position: absolute; inset: 0; pointer-events: none; }
        .glass-card-example__pause { display: flex; align-items: center; gap: 8px; min-height: 44px;
          margin-top: 8px; color: #332200; font: 14px/1.5 system-ui, sans-serif; }
        .glass-card-example__pause input { width: 20px; height: 20px; accent-color: #332200; }
        .glass-card-example__pause input:focus-visible { outline: 2px solid #332200; outline-offset: 4px; }
        @keyframes glass-card-idle { 0%,100% { transform: rotateX(0) rotateY(0); }
          25% { transform: rotateX(5deg) rotateY(5deg); } 75% { transform: rotateX(-5deg) rotateY(-5deg); } }
        @media (prefers-reduced-motion: reduce) { .glass-card-example { animation: none !important;
          transform: none !important; transition: none !important; } }
      \`}</style>
    </div>
  );
}`;
  },
  generatePrompt: (values) => `ガラス調のReactカードを作成してください。背景を${values['blur']}pxぼかし、待機中は緩やかに動かし、ポインターに応じて強さ${values['intensity']}度で傾けます。ホバーなしでも読めるようにします。「Pause motion」チェックボックスで待機中の動きを止め、傾きをリセットし、再開までポインターで動かないようにしてください。タッチではホバーを使わず、すべての動きで prefers-reduced-motion を尊重します。必要なCSSはコンポーネントに含めます。`
};
