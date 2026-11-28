import React from 'react';
import { AnimationDefinition } from '../../types';

export const glitchText: AnimationDefinition = {
  id: 'glitch-text',
  title: 'グリッチ文字',
  description: 'CSSの clip-path で文字の一部を切り出し、横にずらして映像の乱れを表現します。',
  tags: ['文字', 'CSS', 'ゆがみ', '視覚効果'],
  category: 'text',
  continuousMotion: true,
  a11yNotes: '文字のずれは装飾です。一時停止するか、静止した題字を使えます。動きを減らす設定ではアニメーションが止まります。光刺激に対する安全性は評価していません。',
  performanceScore: 85,
  a11yScore: 'Fail',
  params: [
     { key: 'intensity', cssVar: '--intensity', label: '文字のずれ', type: 'number', min: 1, max: 10, step: 1, default: 2, unit: 'px' }
  ],
  Preview: ({ values, paused = false }) => (
    <div role="img" aria-label="GLITCH" className="relative font-mono font-bold text-4xl text-ink tracking-tighter group hover:text-primary transition-colors cursor-default">
       <span className="relative inline-block">
          GLITCH
          <span className="absolute top-0 left-0 -ml-[2px] text-accent opacity-70 animate-pulse motion-reduce:animate-none" aria-hidden="true" style={{ animationPlayState: paused ? 'paused' : 'running', clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: `translate(-${values['intensity']}px)`}}>GLITCH</span>
          <span className="absolute top-0 left-0 ml-[2px] text-primary opacity-70 animate-pulse motion-reduce:animate-none" aria-hidden="true" style={{ animationPlayState: paused ? 'paused' : 'running', clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: `translate(${values['intensity']}px)`}}>GLITCH</span>
       </span>
    </div>
  ),
  generateCode: (values) => {
    const intensity = Number.isFinite(values['intensity']) ? Math.max(1, Math.min(10, values['intensity'])) : 2;
    return `<!-- Standalone HTML + CSS: paste into an HTML document -->
<label class="glitch-example">
  <input type="checkbox" aria-label="Pause animation">
  <span>Pause animation</span>
  <span class="glitch-text" role="img" aria-label="GLITCH" data-text="GLITCH">GLITCH</span>
</label>
<style>
.glitch-example { display: inline-grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px;
  align-items: center; max-width: 100%; min-height: 44px; color: #332200; font: 14px/1.5 system-ui, sans-serif; }
.glitch-example > input { width: 20px; height: 20px; margin: 0; accent-color: #332200; }
.glitch-example > input:focus-visible { outline: 2px solid #332200; outline-offset: 4px; }
.glitch-example > .glitch-text { grid-column: 1 / -1; }
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
.glitch-example > input:checked ~ .glitch-text::before,
.glitch-example > input:checked ~ .glitch-text::after { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .glitch-text::before, .glitch-text::after { animation: none; transform: none; } }
</style>`;
  },
  generatePrompt: (values) => `CSSの疑似要素を切り抜いて${values['intensity']}pxずらす装飾用の題字を作成してください。表示文字、data-text、読み上げ名を一致させます。「Pause animation」という標準のチェックボックスを付け、キーボードで各作例の両方の動きを止められるようにします。prefers-reduced-motion に対応し、説明文は静止させます。光刺激への安全性は保証しないでください。`
};
