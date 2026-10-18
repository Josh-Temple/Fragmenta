import React from 'react';
import { PatternDefinition } from '../../types';

const defaults = {
  rail: 34,
  gap: 16,
  rule: 2,
};

const sample = {
  heading: 'Give the main argument most of the width.',
  introduction: 'Keep the central explanation in the reading column. Use the rail for context that helps readers interpret it without interrupting the argument.',
  japanese: '本文には結論と理由を置きます。補足情報は脇にまとめ、小さな画面では本文の前に並べます。',
  closing: 'Read the page in source order. Check long headings and real paragraphs before replacing the sample with your own material.',
};

export const editorialSplitLayout: PatternDefinition = {
  id: 'editorial-split-layout',
  title: 'Editorial Split Layout',
  description:
    'A compact editorial layout with a narrow metadata rail and a wider reading column, designed to collapse cleanly on small screens.',
  kind: 'layout',
  category: 'layout',
  tags: ['Editorial', 'Layout', 'Grid', 'Responsive', 'Reading', 'CSS'],
  performanceScore: 100,
  a11yScore: 'AA',
  performanceNotes:
    'Uses native CSS Grid with no JavaScript layout work. Keep decorative rules and background effects lightweight.',
  a11yNotes:
    'Keep DOM order aligned with reading order. Do not use CSS visual reordering to place essential content before its heading or metadata.',
  responsiveNotes:
    'Collapse to a single column on narrow screens; keep metadata above the main text rather than shrinking the rail until it becomes unreadable.',
  source: {
    label: 'Original reusable layout',
    note: 'A general editorial split pattern designed for articles, release notes, research summaries, and project logs.',
  },
  params: [
    { key: 'rail', cssVar: '--rail-width', label: 'Rail Width', type: 'number', min: 24, max: 44, step: 1, default: defaults.rail, unit: '%' },
    { key: 'gap', cssVar: '--column-gap', label: 'Column Gap', type: 'number', min: 8, max: 28, step: 1, default: defaults.gap, unit: 'px' },
    { key: 'rule', cssVar: '--rule-width', label: 'Rule Width', type: 'number', min: 1, max: 4, step: 1, default: defaults.rule, unit: 'px' },
  ],
  Preview: ({ values }) => {
    const rail = values.rail ?? defaults.rail;
    const gap = values.gap ?? defaults.gap;
    const rule = values.rule ?? defaults.rule;

    return (
      <div className="w-[292px] max-w-full bg-[#fbf4e6] text-[#23201d] p-4 font-display border border-[#23201d]/10">
        <div className="flex items-end justify-between gap-3 pb-3 mb-4" style={{ borderBottom: `${rule}px solid #23201d` }}>
          <div>
            <div className="text-[9px] font-mono tracking-[0.16em] opacity-60">FIELD NOTE / 07</div>
            <div className="text-[22px] font-black leading-none mt-1 tracking-[-0.04em]">Readable structure</div>
          </div>
          <div className="text-[9px] font-mono text-right opacity-60">EN<br />JA</div>
        </div>

        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: `${rail}% minmax(0, 1fr)`,
            gap,
          }}
        >
          <aside className="font-mono text-[9px] leading-relaxed uppercase tracking-wide opacity-65">
            <div className="mb-3">Context</div>
            <div className="normal-case tracking-normal text-[10px]">
              Use the rail for dates, labels, sources, or navigation cues.
            </div>
          </aside>

          <article className="pl-3" style={{ borderLeft: `${rule}px solid #23201d` }}>
            <div className="text-[14px] font-black leading-tight mb-2">
              {sample.heading}
            </div>
            <p className="text-[13px] leading-relaxed">{sample.introduction}</p>
            <p lang="ja" className="text-[13px] leading-relaxed mt-3">{sample.japanese}</p>
            <div className="mt-3 inline-flex px-2 py-1 rounded-full text-[9px] font-mono font-bold bg-[#f4a261]/35">
              RESPONSIVE
            </div>
          </article>
        </div>
      </div>
    );
  },
  generateCode: (values) => {
    const rail = values.rail ?? defaults.rail;
    const gap = values.gap ?? defaults.gap;
    const rule = values.rule ?? defaults.rule;

    return `<!-- HTML -->
<section class="editorial-split" lang="en" style="--rail-width: ${rail}%; --column-gap: ${gap}px; --rule-width: ${rule}px;">
  <aside class="editorial-split__rail">
    <p class="meta">FIELD NOTE / 07</p>
    <p>Use this rail for dates, labels, sources, or navigation cues.</p>
  </aside>
  <article class="editorial-split__body">
    <h2>${sample.heading}</h2>
    <p>${sample.introduction}</p>
    <p lang="ja">${sample.japanese}</p>
    <p>${sample.closing}</p>
  </article>
</section>

<style>
/* CSS */
.editorial-split {
  display: grid;
  grid-template-columns: var(--rail-width) minmax(0, 1fr);
  gap: var(--column-gap);
  align-items: start;
  color: #23201d;
  font: 1rem/1.7 system-ui, sans-serif;
  overflow-wrap: anywhere;
}

.editorial-split > * { min-width: 0; }
.editorial-split h2 { font-size: clamp(1.4rem, 3vw, 2rem); line-height: 1.3; }
.editorial-split p { max-width: 65ch; }

.editorial-split__body {
  padding-left: 1rem;
  border-left: var(--rule-width) solid currentColor;
}

.editorial-split__rail,
.editorial-split .meta {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

@media (max-width: 640px) {
  .editorial-split {
    grid-template-columns: 1fr;
  }

  .editorial-split__body {
    padding-left: 0;
    padding-top: 1rem;
    border-left: 0;
    border-top: var(--rule-width) solid currentColor;
  }
}
</style>`;
  },
  generatePrompt: (values) => {
    const rail = values.rail ?? defaults.rail;
    const gap = values.gap ?? defaults.gap;
    const rule = values.rule ?? defaults.rule;

    return `Create a responsive editorial split layout with real English and Japanese paragraphs, not placeholder bars. Use a ${rail}% metadata rail, ${rule}px separator, and ${gap}px gap on wider screens. Set parameters as CSS variables on each instance. Keep metadata before the article in the DOM. At viewport widths of 640px or less, use one column and a horizontal separator. Scope styles to the component, set language attributes, and check long headings and line wrapping. This is a metadata layout, not a working table of contents.`;
  },
};
