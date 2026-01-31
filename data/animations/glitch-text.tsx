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
    <div className="relative font-mono font-bold text-4xl text-ink tracking-tighter group hover:text-primary transition-colors cursor-default">
       <span className="relative inline-block">
          GLITCH
          <span className="absolute top-0 left-0 -ml-[2px] text-accent opacity-70 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: `translate(-${values['intensity']}px)`}}>GLITCH</span>
          <span className="absolute top-0 left-0 ml-[2px] text-primary opacity-70 animate-pulse" style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: `translate(${values['intensity']}px)`}}>GLITCH</span>
       </span>
    </div>
  ),
  generateCode: (values) => `/* CSS */
.glitch {
  position: relative;
}
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch::before {
  left: ${values['intensity']}px;
  text-shadow: -1px 0 red;
  clip-path: inset(20% 0 30% 0);
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}
.glitch::after {
  left: -${values['intensity']}px;
  text-shadow: 1px 0 blue;
  clip-path: inset(50% 0 10% 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}`,
  generatePrompt: (values) => `Create a CSS-only glitch text effect. Use pseudo-elements (::before, ::after) with clip-path to slice the text. Offset them by ${values['intensity']}px.`
};