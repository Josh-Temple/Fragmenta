import React, { useState } from 'react';
import { AnimationDefinition } from '../../types';

export const fluidToggle: AnimationDefinition = {
  id: 'fluid-toggle',
  title: '伸び縮みするスイッチ',
  description: 'オンに切り替えると、丸いつまみが横に伸びながら移動します。',
  tags: ['入力', 'CSS', '操作', 'フォーム'],
  category: 'input',
  performanceScore: 100,
  a11yScore: 'AA',
  params: [
    { key: 'duration', cssVar: '--dur', label: '動きの時間', type: 'number', min: 0.1, max: 0.8, step: 0.1, default: 0.3, unit: 's' },
    { key: 'stretch', cssVar: '--stretch', label: 'つまみの横幅', type: 'number', min: 20, max: 32, step: 2, default: 28, unit: 'px' },
  ],
  Preview: ({ values }) => {
    const [isOn, setIsOn] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const stretch = Number.isFinite(values['stretch']) ? values['stretch'] : 28;
    const duration = Number.isFinite(values['duration']) ? values['duration'] : 0.3;
    const width = (isOn || isPressed) ? stretch : 24;
    const x = isOn ? 46 - width : 0;
    return (
      <>
      <style>{`@media (prefers-reduced-motion: reduce) { .fragmenta-toggle-demo, .fragmenta-toggle-demo > span { transition: none !important; } }`}</style>
      <button type="button" role="switch" aria-checked={isOn} aria-label="設定の切り替え"
        onClick={() => setIsOn(value => !value)}
        onPointerDown={() => setIsPressed(true)} onPointerUp={() => setIsPressed(false)}
        onPointerCancel={() => setIsPressed(false)} onPointerLeave={() => setIsPressed(false)}
        className={`fragmenta-toggle-demo w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isOn ? 'bg-primary' : 'bg-ink/20'}`}>
        <span aria-hidden="true" className="h-6 bg-white rounded-full shadow-xs transition-all motion-reduce:transition-none"
          style={{ width: `${width}px`, transform: `translateX(${x}px)`, transitionDuration: `${duration}s` }} />
      </button>
      </>
    );
  },
  generateCode: (values) => {
    const stretch = Number.isFinite(values['stretch']) ? Math.max(20, Math.min(32, values['stretch'])) : 28;
    const duration = Number.isFinite(values['duration']) ? Math.max(0.1, Math.min(0.8, values['duration'])) : 0.3;
    return `<!-- Standalone semantic toggle: no JavaScript dependency -->
<label class="fluid-toggle">
  <input class="fluid-toggle__input" type="checkbox" role="switch" aria-label="Fluid toggle">
  <span class="fluid-toggle__track" aria-hidden="true"><span class="fluid-toggle__thumb"></span></span>
</label>
<style>
.fluid-toggle { display: inline-flex; position: relative; cursor: pointer; }
.fluid-toggle__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.fluid-toggle__track { display: flex; align-items: center; box-sizing: border-box; width: 56px; height: 32px;
  padding: 4px; border-radius: 9999px; background: #44330033; transition: background ${duration}s; }
.fluid-toggle__thumb { display: block; width: 24px; height: 24px; border-radius: 9999px;
  background: white; box-shadow: 0 1px 3px #0002; transition: width ${duration}s, transform ${duration}s; }
.fluid-toggle__input:checked + .fluid-toggle__track { background: #cd853f; }
.fluid-toggle__input:checked + .fluid-toggle__track .fluid-toggle__thumb {
  width: ${stretch}px; transform: translateX(${46 - stretch}px); }
.fluid-toggle__input:focus-visible + .fluid-toggle__track { outline: 3px solid #332200; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .fluid-toggle__track, .fluid-toggle__thumb { transition: none; } }
</style>`;
  },
  generatePrompt: (values) => `オフでは直径24pxの円、オンでは横幅${values['stretch']}pxの丸みのあるつまみを右端に置くスイッチを作成してください。切り替え時間は${values['duration']}sです。`
};