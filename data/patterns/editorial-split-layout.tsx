import React from 'react';
import { PatternDefinition } from '../../types';

const defaults = {
  rail: 34,
  gap: 16,
  rule: 2,
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
          <div className="text-[9px] font-mono text-right opacity-60">6 MIN<br />READ</div>
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
              Give the main argument most of the width.
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-[#23201d]/20 w-full" />
              <div className="h-1.5 rounded-full bg-[#23201d]/20 w-[92%]" />
              <div className="h-1.5 rounded-full bg-[#23201d]/20 w-[76%]" />
            </div>
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
<section class="editorial-split">
  <aside class="editorial-split__rail">
    <p class="meta">FIELD NOTE / 07</p>
    <p>Use this rail for dates, labels, sources, or navigation cues.</p>
  </aside>
  <article class="editorial-split__body">
    <h2>Give the main argument most of the width.</h2>
    <p>Your primary reading content goes here.</p>
  </article>
</section>

/* CSS */
.editorial-split {
  display: grid;
  grid-template-columns: ${rail}% minmax(0, 1fr);
  gap: ${gap}px;
  align-items: start;
}

.editorial-split__body {
  padding-left: 1rem;
  border-left: ${rule}px solid currentColor;
}

.editorial-split__rail,
.meta {
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
    border-top: ${rule}px solid currentColor;
  }
}`;
  },
  generatePrompt: (values) => {
    const rail = values.rail ?? defaults.rail;
    const gap = values.gap ?? defaults.gap;
    const rule = values.rule ?? defaults.rule;

    return `Create a responsive editorial split layout using CSS Grid. On wider screens, use a narrow metadata rail of about ${rail}% and a main reading column separated by a ${rule}px rule, with a ${gap}px gap. Keep the DOM in logical reading order. On small screens, collapse to one column with metadata first and replace the vertical rule with a horizontal separator. Use strong typographic hierarchy and generous whitespace rather than decorative complexity.`;
  },
};
