import React from 'react';
import { AnimationDefinition } from '../../types';

export const elasticButton: AnimationDefinition = {
  id: 'elastic-button',
  title: 'Lift & Compress',
  description: 'A subtle, reusable button motion using transform and shadow. Great default for primary CTAs.',
  tags: ['Button', 'CSS', 'Transform', 'Hover'],
  category: 'button',
  performanceScore: 98,
  a11yScore: 'AA',
  params: [
    { key: 'duration', cssVar: '--dur', label: 'Duration', type: 'number', min: 0.1, max: 1.0, step: 0.1, default: 0.2, unit: 's' },
    { key: 'lift', cssVar: '--lift', label: 'Lift Distance', type: 'number', min: 0, max: 20, step: 1, default: 4, unit: 'px' },
    { key: 'scale', cssVar: '--scale', label: 'Press Scale', type: 'number', min: 0.8, max: 1.0, step: 0.01, default: 0.95 }
  ],
  Preview: ({ values }) => (
    <button 
      className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-[0_4px_0_#A0522D] flex items-center gap-2 
                 transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]
                 hover:-translate-y-[var(--lift)] hover:shadow-[0_10px_20px_-5px_rgba(160,82,45,0.4),0_4px_0_#A0522D]
                 active:translate-y-0 active:scale-[var(--scale)] active:shadow-none"
      style={{
        transitionDuration: `${values['duration']}s`,
        '--lift': `-${values['lift']}px`,
        '--scale': values['scale'],
      } as React.CSSProperties}
    >
      <span>Explore Now</span>
      <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </button>
  ),
  generateCode: (values) => `/* CSS */
.btn-lift {
  transition: transform ${values['duration']}s cubic-bezier(0.2, 0.8, 0.2, 1), 
              box-shadow ${values['duration']}s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.btn-lift:hover {
  transform: translateY(-${values['lift']}px);
  box-shadow: 0 ${4 + values['lift']}px ${values['lift'] * 2}px -2px rgba(160,82,45, 0.3), 
              0 4px 0 #A0522D;
}
.btn-lift:active {
  transform: translateY(0) scale(${values['scale']});
  box-shadow: 0 0 0 #A0522D;
}`,
  generatePrompt: (values) => `Create a button animation: Lift ${values['lift']}px on hover, scale to ${values['scale']} on press. Duration: ${values['duration']}s.`
};