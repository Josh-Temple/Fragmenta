import React from 'react';
import { AnimationDefinition } from '../../types';

export const smartSkeleton: AnimationDefinition = {
  id: 'smart-skeleton',
  title: 'Smart Skeleton',
  description: 'A reusable shimmer placeholder for loading content, built with CSS gradients.',
  tags: ['Loader', 'CSS', 'Shimmer', 'Loading'],
  category: 'loader',
  performanceScore: 95,
  a11yScore: 'AAA',
  params: [
    { key: 'speed', cssVar: '--speed', label: 'Speed', type: 'number', min: 0.5, max: 3.0, step: 0.1, default: 1.5, unit: 's' },
    { key: 'opacity', cssVar: '--opacity', label: 'Shimmer Opacity', type: 'number', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
  ],
  Preview: ({ values }) => (
    <div role="status" aria-label="Loading content" className="w-64 flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm border border-black/5">
      <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                  style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
              ></div>
          </div>
          <div className="flex-1 space-y-2">
              <div className="relative h-3 w-3/4 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
                  ></div>
              </div>
              <div className="relative h-3 w-1/2 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
                  ></div>
              </div>
          </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  ),
  generateCode: (values) => {
    const speed = Number.isFinite(values['speed']) ? Math.max(0.5, Math.min(3, values['speed'])) : 1.5;
    const opacity = Number.isFinite(values['opacity']) ? Math.max(0.1, Math.min(1, values['opacity'])) : 0.5;
    return `<!-- Standalone HTML + CSS skeleton -->
<div class="skeleton-example" role="status" aria-label="Loading content">
  <div class="skeleton-example__avatar" aria-hidden="true"></div>
  <div class="skeleton-example__text" aria-hidden="true">
    <div class="skeleton-example__line"></div>
    <div class="skeleton-example__line skeleton-example__line--short"></div>
  </div>
</div>
<style>
.skeleton-example { display: flex; align-items: center; gap: 12px; box-sizing: border-box;
  width: min(256px, 100%); padding: 16px; border-radius: 12px; background: #fff; }
.skeleton-example__avatar { flex: 0 0 48px; height: 48px; border-radius: 50%; }
.skeleton-example__text { flex: 1; min-width: 0; display: grid; gap: 8px; }
.skeleton-example__line { width: 75%; height: 12px; border-radius: 4px; }
.skeleton-example__line--short { width: 50%; }
.skeleton-example__avatar, .skeleton-example__line { position: relative; background: #e5e7eb; overflow: hidden; }
.skeleton-example__avatar::after, .skeleton-example__line::after { content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,${opacity}), transparent);
  animation: skeleton-sweep ${speed}s linear infinite; }
@keyframes skeleton-sweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .skeleton-example__avatar::after, .skeleton-example__line::after { animation: none; }
}
</style>`;
  },
  generatePrompt: (values) => `Create a skeleton loader with a shimmer effect using a pseudo-element. The shimmer should move from left to right every ${values['speed']}s with an opacity of ${values['opacity']}.`
};