import React, { useState } from 'react';
import { AnimationDefinition } from '../../types';

export const fluidToggle: AnimationDefinition = {
  id: 'fluid-toggle',
  title: 'Fluid Toggle',
  description: 'An organic switch animation that morphs into a pill shape when active.',
  tags: ['Input', 'CSS', 'Interactive', 'Form'],
  category: 'input',
  performanceScore: 100,
  a11yScore: 'AA',
  params: [
    { key: 'duration', cssVar: '--dur', label: 'Duration', type: 'number', min: 0.1, max: 0.8, step: 0.1, default: 0.3, unit: 's' },
    { key: 'stretch', cssVar: '--stretch', label: 'Stretch Width', type: 'number', min: 20, max: 32, step: 2, default: 28, unit: 'px' },
  ],
  Preview: ({ values }) => {
    const [isOn, setIsOn] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const baseWidth = 24;
    const stretchWidth = values['stretch'];
    // Container 56px (w-14). 
    // Padding x-1 (4px left, 4px right).
    // Inner space = 56 - 8 = 48px.
    // To be safe and prevent any sub-pixel overflow, we use 46px as available travel space visually.
    const availableWidth = 46; 
    
    const width = (isOn || isPressed) ? stretchWidth : baseWidth;
    
    // X = AvailableSpace - CurrentWidth.
    // If X is calculated as 46 - width, and width is 28, X=18. 
    // Total right edge = 4px (padding-left) + 18 (x) + 28 (width) = 50px.
    // Container width is 56px. Right padding starts at 52px. So 50px fits well inside.
    const x = isOn ? (availableWidth - width) : 0;

    return (
      <div 
          onClick={() => setIsOn(!isOn)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-ink/20'}`}
      >
        <div 
          className="h-6 bg-white rounded-full shadow-sm transition-all"
          style={{
             width: `${width}px`,
             transform: `translateX(${x}px)`,
             transitionDuration: `${values['duration']}s`,
             transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
          }}
        ></div>
      </div>
    );
  },
  generateCode: (values) => `/* CSS */
.toggle-handle {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all ${values['duration']}s cubic-bezier(0.4, 0.0, 0.2, 1);
}
/* When Checked: Width expands to ${values['stretch']}px (Pill) */
.toggle-input:checked + .toggle-bg .toggle-handle {
  width: ${values['stretch']}px;
  /* Adjust transform to keep it inside container */
  transform: translateX(${46 - values['stretch']}px);
}
/* Active/Pressed state */
.toggle-handle:active {
  width: ${values['stretch']}px;
}`,
  generatePrompt: (values) => `Create a toggle switch. The handle is a circle (24px) when off. When on, it stretches to a pill shape (${values['stretch']}px width) and aligns to the right. Transition duration: ${values['duration']}s.`
};