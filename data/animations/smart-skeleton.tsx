import React from 'react';
import { AnimationDefinition } from '../../types';

export const smartSkeleton: AnimationDefinition = {
  id: 'smart-skeleton',
  title: '読み込み中の仮表示',
  description: 'CSSグラデーションの光が、これから表示する内容の輪郭を横切ります。',
  tags: ['読み込み表示', 'CSS', '光の反射', '読み込み'],
  category: 'loader',
  continuousMotion: true,
  a11yNotes: '読み込み開始の通知は一度にし、装飾図形を読み上げから除きます。取得後は結果やエラーに切り替えます。生成コードは一時停止と動きを減らす設定に対応します。',
  performanceScore: 95,
  a11yScore: 'AAA',
  params: [
    { key: 'speed', cssVar: '--speed', label: '光が横切る時間', type: 'number', min: 0.5, max: 3.0, step: 0.1, default: 1.5, unit: 's' },
    { key: 'opacity', cssVar: '--opacity', label: '光の不透明度', type: 'number', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
  ],
  Preview: ({ values, paused = false }) => (
    <div role="status" aria-label="読み込み中" className="w-64 flex flex-col gap-3 p-4 bg-white rounded-xl shadow-xs border border-black/5">
      <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <div 
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                  style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'], animationPlayState: paused ? 'paused' : 'running' } as React.CSSProperties}
              ></div>
          </div>
          <div className="flex-1 space-y-2">
              <div className="relative h-3 w-3/4 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'], animationPlayState: paused ? 'paused' : 'running' } as React.CSSProperties}
                  ></div>
              </div>
              <div className="relative h-3 w-1/2 bg-gray-200 rounded overflow-hidden">
                   <div 
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_var(--speed)_infinite] motion-reduce:animate-none"
                      style={{ '--speed': `${values['speed']}s`, opacity: values['opacity'], animationPlayState: paused ? 'paused' : 'running' } as React.CSSProperties}
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
<label class="skeleton-demo">
  <input type="checkbox" aria-label="Pause shimmer">
  <span>Pause shimmer</span>
  <span class="skeleton-example" role="status" aria-label="Loading content">
    <span class="skeleton-example__avatar" aria-hidden="true"></span>
    <span class="skeleton-example__text" aria-hidden="true">
      <span class="skeleton-example__line"></span>
      <span class="skeleton-example__line skeleton-example__line--short"></span>
    </span>
  </span>
</label>
<style>
.skeleton-demo { display: inline-grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px;
  align-items: center; max-width: 100%; min-height: 44px; color: #332200; font: 14px/1.5 system-ui, sans-serif; }
.skeleton-demo > input { width: 20px; height: 20px; margin: 0; accent-color: #332200; }
.skeleton-demo > input:focus-visible { outline: 2px solid #332200; outline-offset: 4px; }
.skeleton-demo > .skeleton-example { grid-column: 1 / -1; }
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
.skeleton-demo > input:checked ~ .skeleton-example .skeleton-example__avatar::after,
.skeleton-demo > input:checked ~ .skeleton-example .skeleton-example__line::after { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .skeleton-example__avatar::after, .skeleton-example__line::after { animation: none; }
}
</style>`;
  },
  generatePrompt: (values) => `HTMLとCSSで、左から右へ${values['speed']}s周期、不透明度${values['opacity']}で光が横切る読み込み表示を作成してください。通知は一つにし、装飾図形は読み上げから除きます。「Pause shimmer」という標準のチェックボックスで作例ごとの光をすべて止められるようにし、prefers-reduced-motion に対応します。取得後はアプリ側で内容、0件の案内、またはエラーに切り替えます。架空の進捗率は表示しないでください。`
};
