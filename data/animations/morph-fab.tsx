import React, { useState } from 'react';
import { AnimationDefinition } from '../../types';

export const morphFab: AnimationDefinition = {
  id: 'morph-fab',
  title: 'Morph FAB',
  description: 'Floating Action Button that smoothly transforms into a rectangular menu on click.',
  tags: ['Button', 'Framer', 'Morph', 'Menu'],
  category: 'button',
  performanceScore: 92,
  a11yScore: 'AA',
  params: [
     { key: 'radius', cssVar: '--radius', label: 'Expanded Radius', type: 'number', min: 0, max: 24, step: 4, default: 12, unit: 'px' }
  ],
  Preview: ({ values }) => {
      const [open, setOpen] = useState(false);
      return (
          <div 
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden bg-primary text-white
                  ${open ? 'w-48 h-14' : 'w-14 h-14 rounded-full'}`}
              style={{ borderRadius: open ? `${values['radius']}px` : '9999px' }}
          >
              {open ? (
                  <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <span className="material-symbols-outlined">edit</span>
                      <span className="material-symbols-outlined">delete</span>
                      <span className="material-symbols-outlined">share</span>
                  </div>
              ) : (
                  <span className="material-symbols-outlined">add</span>
              )}
          </div>
      )
  },
  generateCode: (values) => `/* CSS / React */
.fab {
  transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
  overflow: hidden;
}
.fab.closed {
  width: 56px; height: 56px; border-radius: 50%;
}
.fab.open {
  width: 200px; height: 56px; border-radius: ${values['radius']}px;
}`,
  generatePrompt: (values) => `Create a Morphing Floating Action Button. When toggled, it should expand from a circle to a rectangle (radius ${values['radius']}px) revealing menu items.`
};