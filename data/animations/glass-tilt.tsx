import React, { useState } from 'react';
import { AnimationDefinition } from '../../types';

export const glassTilt: AnimationDefinition = {
  id: 'glass-tilt',
  title: 'Glass Tilt',
  description: 'A 3D holographic tilt effect triggered by mouse movement. Includes idle animation.',
  tags: ['Card', 'React', '3D', 'Hover'],
  category: 'card',
  performanceScore: 90,
  a11yScore: 'A',
  params: [
    { key: 'intensity', cssVar: '--intensity', label: 'Tilt Intensity', type: 'number', min: 5, max: 45, step: 1, default: 20, unit: 'deg' },
    { key: 'blur', cssVar: '--blur', label: 'Blur', type: 'number', min: 0, max: 20, step: 1, default: 12, unit: 'px' },
  ],
  Preview: ({ values }) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
              @keyframes idle-tilt {
                  0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
                  25% { transform: rotateX(5deg) rotateY(5deg); }
                  50% { transform: rotateX(0deg) rotateY(0deg); }
                  75% { transform: rotateX(-5deg) rotateY(-5deg); }
              }
          `}</style>
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-56 h-36 rounded-2xl relative transition-all duration-200 ease-out cursor-pointer group"
          style={{
            transform: isHovering 
              ? `rotateX(${-rotate.x}deg) rotateY(${-rotate.y}deg) scale(1.05)` 
              : 'rotateX(0deg) rotateY(0deg)',
            animation: isHovering ? 'none' : 'idle-tilt 8s ease-in-out infinite',
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
              className="absolute inset-0 rounded-2xl border border-white/50 overflow-hidden flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/30 to-white/10 shadow-lg backdrop-blur-md z-10"
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

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-inner mb-1 border border-white/20">
                 <span className="material-symbols-outlined text-white">credit_card</span>
              </div>
              <div className="w-32 h-2 bg-white/60 rounded-full shadow-sm"></div>
              <div className="w-20 h-2 bg-white/30 rounded-full shadow-sm"></div>
              
              {/* Shine on border */}
              <div className="absolute inset-0 rounded-2xl border border-white/40 group-hover:border-white/80 transition-colors"></div>
          </div>
        </div>
      </div>
    );
  },
  generateCode: (values) => `// React Component
const GlassCard = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    setRotate({ x: y * ${values['intensity']}, y: -x * ${values['intensity']} });
  };

  return (
    <div className="perspective-container" style={{ perspective: '1000px' }}>
      <div 
        onMouseMove={onMove}
        onMouseLeave={() => setRotate({x:0, y:0})}
        style={{
          transform: \`rotateX(\${-rotate.x}deg) rotateY(\${-rotate.y}deg)\`,
          transition: 'transform 0.1s ease-out'
        }}
        className="glass-card"
      >
        <div className="content" style={{ backdropFilter: 'blur(${values['blur']}px)' }}>
            {/* Content here */}
        </div>
      </div>
    </div>
  );
}`,
  generatePrompt: (values) => `Create a React component for a Glassmorphism card. It should have a gentle floating animation when idle. On hover, track mouse movement to tilt the card in 3D (up to ${values['intensity']} degrees) and show a glare effect.`
};