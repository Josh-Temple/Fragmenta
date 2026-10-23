import React from 'react';
import { PatternDefinition } from '../../types';

const defaults = {
  radius: 22,
  border: 3,
  shadow: 8,
  spacing: 18,
};

const sample = {
  heading: 'Make the next step easy to understand.',
  body: 'Use one clear heading, a short explanation, and a label that describes the action. Give supporting details less visual weight.',
  japanese: '見出しで話題を示し、本文で理由を伝えます。色だけに頼らず、言葉と配置でも情報の違いを表しましょう。',
};

export const warmNeoBrutalistEditorial: PatternDefinition = {
  id: 'warm-neo-brutalist-editorial',
  title: 'Warm Neo-Brutalist Editorial',
  description:
    'A warm editorial interface treatment using heavy dark type, monospace metadata, thick outlines, offset shadows, muted accents, and generous spacing.',
  kind: 'style',
  category: 'style',
  tags: ['Editorial', 'Neo-brutalist', 'Warm', 'Outlined', 'Offset Shadow', 'CSS'],
  performanceScore: 100,
  a11yScore: 'AA',
  performanceNotes:
    'Static CSS treatment with no continuous animation. Keep large offset shadows and decorative borders on a small number of surfaces.',
  a11yNotes:
    'Keep body copy contrast high, preserve visible focus states, and do not rely on accent color alone to communicate status.',
  responsiveNotes:
    'Reduce border, shadow, and outer spacing slightly on narrow screens while preserving the same hierarchy and reading order.',
  source: {
    label: 'Editorial style study — provenance pending',
    note: 'The project describes this as synthesized from general visual characteristics, but authorship, source materials, sample prose rights, and permission for reuse have not been independently verified.',
  },
  params: [
    { key: 'radius', cssVar: '--pattern-radius', label: 'Corner Radius', type: 'number', min: 8, max: 32, step: 1, default: defaults.radius, unit: 'px' },
    { key: 'border', cssVar: '--pattern-border', label: 'Outline Width', type: 'number', min: 1, max: 5, step: 1, default: defaults.border, unit: 'px' },
    { key: 'shadow', cssVar: '--pattern-shadow', label: 'Shadow Offset', type: 'number', min: 0, max: 14, step: 1, default: defaults.shadow, unit: 'px' },
    { key: 'spacing', cssVar: '--pattern-spacing', label: 'Inner Spacing', type: 'number', min: 10, max: 28, step: 1, default: defaults.spacing, unit: 'px' },
  ],
  Preview: ({ values }) => {
    const radius = values.radius ?? defaults.radius;
    const border = values.border ?? defaults.border;
    const shadow = values.shadow ?? defaults.shadow;
    const spacing = values.spacing ?? defaults.spacing;

    return (
      <div
        className="w-[286px] max-w-full font-display"
        style={{
          background: '#fff3d9',
          color: '#211b17',
          padding: spacing,
          borderRadius: Math.max(10, radius - 4),
        }}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] opacity-60">Pattern 01</div>
            <div className="text-[18px] font-black leading-none mt-1">Interface Notes</div>
          </div>
          <div
            className="size-9 rounded-full flex items-center justify-center font-black"
            style={{ border: `${border}px solid #211b17`, background: '#fffdf7' }}
          >
            +
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[10px] font-mono opacity-60 mb-1">STYLE / EDITORIAL</div>
          <div className="text-[28px] font-black leading-[0.95] tracking-[-0.04em]">
            Warm web
            <br />
            hierarchy
          </div>
          <div className="mt-2 h-2 w-16 rounded-full" style={{ background: '#f45b3f' }} />
        </div>

        <div
          className="bg-[#fffdf7]"
          style={{
            padding: Math.max(12, spacing - 3),
            border: `${border}px solid #211b17`,
            borderRadius: radius,
            boxShadow: `${shadow}px ${shadow}px 0 #211b17`,
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-[10px] font-mono font-bold">DESIGN NOTE · EN / JA</div>
            <div className="px-2 py-1 rounded-full text-[9px] font-mono font-bold border border-[#211b17]" style={{ background: '#b8e6a3' }}>
              STYLE
            </div>
          </div>
          <div className="text-[16px] font-black leading-tight">
            {sample.heading}
          </div>
          <p className="text-[13px] leading-relaxed mt-2 font-body">
            {sample.body}
          </p>
          <p lang="ja" className="text-[13px] leading-relaxed mt-3 font-body">{sample.japanese}</p>
        </div>
      </div>
    );
  },
  generateCode: (values) => {
    const radius = values.radius ?? defaults.radius;
    const border = values.border ?? defaults.border;
    const shadow = values.shadow ?? defaults.shadow;
    const spacing = values.spacing ?? defaults.spacing;

    return `<!-- HTML -->
<article class="editorial-card" lang="en" style="--editorial-radius: ${radius}px; --editorial-border: ${border}px; --editorial-shadow: ${shadow}px; --editorial-spacing: ${spacing}px;">
  <p class="meta">DESIGN NOTE · EN / JA</p>
  <span class="badge">STYLE</span>
  <h2>${sample.heading}</h2>
  <p>${sample.body}</p>
  <p lang="ja">${sample.japanese}</p>
</article>

<style>
/* CSS */
.editorial-card {
  --paper: #fff3d9;
  --surface: #fffdf7;
  --ink: #211b17;
  --accent-orange: #f45b3f;
  --accent-green: #b8e6a3;
}

.editorial-card {
  box-sizing: border-box;
  max-width: 100%;
  padding: var(--editorial-spacing);
  font: 1rem/1.7 system-ui, sans-serif;
  overflow-wrap: anywhere;
  color: var(--ink);
  background: var(--surface);
  border: var(--editorial-border) solid var(--ink);
  border-radius: var(--editorial-radius);
  box-shadow: var(--editorial-shadow) var(--editorial-shadow) 0 var(--ink);
}

.editorial-card h2 {
  font: 800 clamp(1.5rem, 4vw, 2.8rem)/1.1 system-ui, sans-serif;
  letter-spacing: -0.04em;
}

.editorial-card .meta,
.editorial-card .badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.08em;
}

.editorial-card .badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  border: 1px solid var(--ink);
  border-radius: 999px;
  background: var(--accent-green);
}

@media (max-width: 480px) {
  .editorial-card {
    padding: max(8px, calc(var(--editorial-spacing) - 4px));
    box-shadow: max(0px, calc(var(--editorial-shadow) - 3px)) max(0px, calc(var(--editorial-shadow) - 3px)) 0 var(--ink);
  }
}
</style>`;
  },
  generatePrompt: (values) => {
    const radius = values.radius ?? defaults.radius;
    const border = values.border ?? defaults.border;
    const shadow = values.shadow ?? defaults.shadow;
    const spacing = values.spacing ?? defaults.spacing;

    return `Design an original warm neo-brutalist editorial section with English and Japanese paragraphs. Use near-black heavy headings, monospace metadata, muted accents, generous whitespace, and strong hierarchy. Use ${border}px outlines, ${radius}px radii, ${shadow}px offset shadows, and ${spacing}px inner spacing. Scope metadata and badge selectors to the section, and put adjustable CSS variables on each instance so different configurations can coexist. A zero shadow must remain zero at narrow widths. Keep body text readable and use appropriate language attributes. Do not copy a brand, page text, logo, or exact third-party composition.`;
  },
};
