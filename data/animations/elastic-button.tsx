import React from 'react';
import { AnimationDefinition } from '../../types';

export const elasticButton: AnimationDefinition = {
  id: 'elastic-button',
  title: '押すと沈むボタン',
  description: 'ポインターを重ねると少し浮き、押すと縮むボタンです。変形と影で操作に手応えを添えます。',
  tags: ['ボタン', 'CSS', '変形', 'ホバー'],
  category: 'button',
  performanceScore: 98,
  a11yScore: 'AA',
  params: [
    { key: 'duration', cssVar: '--dur', label: '動きの時間', type: 'number', min: 0.1, max: 1.0, step: 0.1, default: 0.2, unit: 's' },
    { key: 'lift', cssVar: '--lift', label: '浮き上がる距離', type: 'number', min: 0, max: 20, step: 1, default: 4, unit: 'px' },
    { key: 'scale', cssVar: '--scale', label: '押したときの倍率', type: 'number', min: 0.8, max: 1.0, step: 0.01, default: 0.95 }
  ],
  Preview: ({ values }) => (
    <button 
      className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-[0_4px_0_#A0522D] flex items-center gap-2 
                 transition-all motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none ease-[cubic-bezier(0.2,0.8,0.2,1)]
                 hover:-translate-y-[var(--lift)] hover:shadow-[0_10px_20px_-5px_rgba(160,82,45,0.4),0_4px_0_#A0522D]
                 active:translate-y-0 active:scale-[var(--scale)] active:shadow-none"
      style={{
        transitionDuration: `${values['duration']}s`,
        '--lift': `${values['lift'] ?? 4}px`,
        '--scale': values['scale'],
      } as React.CSSProperties}
    >
      <span>試してみる</span>
      <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </button>
  ),
  generateCode: (values) => {
    const duration = Number.isFinite(values['duration']) ? Math.max(0.1, Math.min(1, values['duration'])) : 0.2;
    const lift = Number.isFinite(values['lift']) ? Math.max(0, Math.min(20, values['lift'])) : 4;
    const scale = Number.isFinite(values['scale']) ? Math.max(0.8, Math.min(1, values['scale'])) : 0.95;
    return `<!-- Standalone HTML + CSS -->
<button type="button" class="btn-lift">Explore Now →</button>
<style>
.btn-lift { padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer;
  font: 700 1rem system-ui, sans-serif; color: white; background: #cd853f;
  box-shadow: 0 4px 0 #a0522d;
  transition: transform ${duration}s cubic-bezier(.2,.8,.2,1), box-shadow ${duration}s cubic-bezier(.2,.8,.2,1); }
.btn-lift:hover { transform: translateY(-${lift}px);
  box-shadow: 0 ${4 + lift}px ${Math.max(1, lift * 2)}px -2px #a0522d66, 0 4px 0 #a0522d; }
.btn-lift:active { transform: translateY(0) scale(${scale}); box-shadow: none; }
.btn-lift:focus-visible { outline: 3px solid #332200; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .btn-lift { transition: none; }
  .btn-lift:hover, .btn-lift:active { transform: none; } }
</style>`;
  },
  generatePrompt: (values) => `ポインターを重ねると${values['lift']}px浮き、押すと${values['scale']}倍に縮むボタンを作成してください。動きの時間は${values['duration']}sです。`
};