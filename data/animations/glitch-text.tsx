import React from 'react';
import { AnimationDefinition } from '../../types';

export const glitchText: AnimationDefinition = {
  id: 'glitch-text',
  title: 'Glitch Text',
  description: 'Cyberpunk-style text distortion effect using CSS clip-path animations.',
  tags: ['Text', 'CSS', 'Distortion', 'Effect'],
  category: 'text',
  performanceScore: 85,
  a11yScore: 'Fail',
  params: [
     { key: 'intensity', cssVar: '--intensity', label: 'Shake Amount', type: 'number', min: 1, max: 10, step: 1, default: 2, unit: 'px' }
  ],
  Preview: ({ values }) => (
    <div role="img" aria-label="GLITCH" className="relative font-mono font-bold text-4xl text-ink tracking-tighter group hover:text-primary transition-colors cursor-default">
       <span className="relative inline-block">
          GLITCH
          <span className="absolute top-0 left-0 -ml-[2px] text-accent opacity-70 animate-pulse motion-reduce:animate-none" aria-hidden="true" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: `translate(-${values['intensity']}px)`}}>GLITCH</span>
          <span className="absolute top-0 left-0 ml-[2px] text-primary opacity-70 animate-pulse motion-reduce:animate-none" aria-hidden="true" style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: `translate(${values['intensity']}px)`}}>GLITCH</span>
       </span>
    </div>
  ),
  generateCode: (values) => {
    const intensity = Number.isFinite(values['intensity']) ? Math.max(1, Math.min(10, values['intensity'])) : 2;
    return `<!-- Standalone HTML + CSS: paste into an HTML document -->
<span class="glitch-text" role="img" aria-label="GLITCH" data-text="GLITCH">GLITCH</span>
<style>
.glitch-text { position: relative; display: inline-block; font: 800 2.5rem/1.2 monospace; color: #332200; }
.glitch-text::before, .glitch-text::after {
  content: attr(data-text); position: absolute; inset: 0; pointer-events: none;
}
.glitch-text::before { color: #66cdaa; clip-path: inset(0 0 55% 0);
  animation: glitch-left 1.5s ease-in-out infinite alternate; }
.glitch-text::after { color: #cd853f; clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
  animation: glitch-right 1.8s ease-in-out infinite alternate; }
@keyframes glitch-left { 0%, 100% { transform: translateX(-${intensity}px); opacity: .7; } 50% { transform: translateX(0); opacity: .4; } }
@keyframes glitch-right { 0%, 100% { transform: translateX(${intensity}px); opacity: .7; } 50% { transform: translateX(0); opacity: .4; } }
@media (prefers-reduced-motion: reduce) { .glitch-text::before, .glitch-text::after { animation: none; transform: none; } }
</style>`;
  },
  generatePrompt: (values) => `Create a CSS-only glitch text effect. Use pseudo-elements (::before, ::after) with clip-path to slice the text. Offset them by ${values['intensity']}px.`
};