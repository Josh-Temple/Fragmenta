import React from 'react';
import { PatternDefinition } from '../../types';

const defaults = {
  radius: 22,
  border: 3,
  shadow: 8,
  spacing: 18,
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
    label: 'Original reusable pattern',
    note: 'Synthesized from general warm editorial and neo-brutalist UI characteristics; not an exact reproduction of a third-party page.',
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
            <div className="text-[10px] font-mono font-bold">01 · TODAY</div>
            <div className="px-2 py-1 rounded-full text-[9px] font-mono font-bold border border-[#211b17]" style={{ background: '#b8e6a3' }}>
              STYLE
            </div>
          </div>
          <div className="text-[16px] font-black leading-tight">
            Strong type, quiet color, tactile edges.
          </div>
          <p className="text-[10px] leading-relaxed mt-2 opacity-70 font-body">
            Use large hierarchy and generous whitespace; reserve accent colors for meaning.
          </p>
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
<article class="editorial-card">
  <p class="meta">01 · TODAY</p>
  <span class="badge">STYLE</span>
  <h2>Strong type, quiet color, tactile edges.</h2>
  <p>Use large hierarchy and generous whitespace; reserve accents for meaning.</p>
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
  padding: ${spacing}px;
  color: var(--ink);
  background: var(--surface);
  border: ${border}px solid var(--ink);
  border-radius: ${radius}px;
  box-shadow: ${shadow}px ${shadow}px 0 var(--ink);
}

.editorial-card h2 {
  font: 800 clamp(1.5rem, 4vw, 2.8rem)/0.98 system-ui, sans-serif;
  letter-spacing: -0.04em;
}

.meta,
.badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.08em;
}

.badge {
  background: var(--accent-green);
}

@media (max-width: 480px) {
  .editorial-card {
    padding: ${Math.max(12, spacing - 4)}px;
    box-shadow: ${Math.max(3, shadow - 3)}px ${Math.max(3, shadow - 3)}px 0 var(--ink);
  }
}
</style>`;
  },
  generatePrompt: (values) => {
    const radius = values.radius ?? defaults.radius;
    const border = values.border ?? defaults.border;
    const shadow = values.shadow ?? defaults.shadow;
    const spacing = values.spacing ?? defaults.spacing;

    return `Design an original warm neo-brutalist editorial web interface. Use a warm off-white background, near-black heavy sans-serif headings, monospace metadata, muted orange and pale green accents, generous whitespace, and strong information hierarchy. Use ${border}px dark outlines, approximately ${radius}px corner radii, ${shadow}px offset shadows, and about ${spacing}px inner spacing. Keep the composition mobile-first and readable. Do not copy any specific brand, page text, logo, or exact third-party composition. Use accessible contrast and visible focus states.`;
  },
};
