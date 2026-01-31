import React from 'react';
import { AnimationDefinition } from '../../types';

export const smartSkeleton: AnimationDefinition = {
  id: 'smart-skeleton',
  title: 'Smart Skeleton',
  description: 'A shimmer loading effect that adapts to content shapes. Uses mask-image for performance.',
  tags: ['Loader', 'Tailwind', 'Mask', 'Loading'],
  category: 'loader',
  performanceScore: 95,
  a11yScore: 'AAA',
  params: [
    { key: 'speed', cssVar: '--speed', label: 'Speed', type: 'number', min: 0.5, max: 3.0, step: 0.1, default: 1.5, unit: 's' },
    { key: 'opacity', cssVar: '--opacity', label: 'Shimmer Opacity', type: 'number', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
  ],
  Preview: ({ values }) => (
    <div className="w-64 flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm border border-black/5">
      <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite]"
                  style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
              ></div>
          </div>
          <div className="flex-1 space-y-2">
              <div className="relative h-3 w-3/4 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite]"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
                  ></div>
              </div>
              <div className="relative h-3 w-1/2 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite]"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'] } as React.CSSProperties}
                  ></div>
              </div>
          </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  ),
  generateCode: (values) => `/* Tailwind Config or CSS */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb; /* gray-200 */
}
.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,${values['opacity']}), transparent);
  animation: shimmer ${values['speed']}s infinite;
}`,
  generatePrompt: (values) => `Create a skeleton loader with a shimmer effect using a pseudo-element. The shimmer should move from left to right every ${values['speed']}s with an opacity of ${values['opacity']}.`
};