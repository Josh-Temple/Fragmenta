import React, { useState } from 'react';
import { AnimationDefinition } from '../../types';

export const morphFab: AnimationDefinition = {
  id: 'morph-fab',
  title: 'Morph FAB',
  description: 'Expandable demo button revealing example action labels; labels are illustrative, not wired actions.',
  tags: ['Button', 'CSS', 'Morph', 'Disclosure'],
  category: 'button',
  performanceScore: 92,
  a11yScore: 'AA',
  params: [
     { key: 'radius', cssVar: '--radius', label: 'Expanded Radius', type: 'number', min: 0, max: 24, step: 4, default: 12, unit: 'px' }
  ],
  Preview: ({ values }) => {
    const [open, setOpen] = useState(false);
    const radius = Number.isFinite(values['radius']) ? values['radius'] : 12;
    return (
      <button type="button" aria-expanded={open} aria-label={open ? 'Hide example actions' : 'Show example actions'}
        onClick={() => setOpen(value => !value)}
        className={`flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 motion-reduce:transition-none overflow-hidden bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${open ? 'w-48 h-14' : 'w-14 h-14'}`}
        style={{ borderRadius: open ? `${radius}px` : '9999px' }}>
        {open ? <span className="text-xs font-bold">Edit · Delete · Share</span> : <span aria-hidden="true" className="material-symbols-outlined">add</span>}
      </button>
    );
  },
  generateCode: (values) => {
    const radius = Number.isFinite(values['radius']) ? Math.max(0, Math.min(24, values['radius'])) : 12;
    return `<!-- Standalone HTML / CSS / JavaScript: example labels are not action buttons -->
<button type="button" class="morph-fab" aria-expanded="false" aria-label="Show example actions">
  <span class="morph-fab__closed" aria-hidden="true">+</span>
  <span class="morph-fab__open" aria-hidden="true">Edit · Delete · Share</span>
</button>
<style>
.morph-fab { display: inline-flex; align-items: center; justify-content: center; overflow: hidden;
  width: 56px; height: 56px; border: 0; border-radius: 9999px; background: #cd853f;
  color: white; font: 700 13px system-ui, sans-serif; cursor: pointer;
  box-shadow: 0 8px 18px #cd853f33; transition: width .3s ease, border-radius .3s ease; }
.morph-fab[aria-expanded='true'] { width: 192px; border-radius: ${radius}px; }
.morph-fab__open, .morph-fab[aria-expanded='true'] .morph-fab__closed { display: none; }
.morph-fab[aria-expanded='true'] .morph-fab__open { display: inline; }
.morph-fab:focus-visible { outline: 3px solid #332200; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .morph-fab { transition: none; } }
</style>
<script>
document.querySelectorAll('.morph-fab').forEach(button => {
  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(next));
    button.setAttribute('aria-label', next ? 'Hide example actions' : 'Show example actions');
  });
});
</script>`;
  },
  generatePrompt: (values) => `Create a Morphing Floating Action Button. When toggled, it should expand from a circle to a rectangle (radius ${values['radius']}px) revealing menu items.`
};