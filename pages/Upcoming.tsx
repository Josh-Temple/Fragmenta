import React from 'react';
import { Link } from 'react-router-dom';
import { plannedPatterns } from '../data/planned-patterns';
import type { PatternKind } from '../types';

const kindLabels: Record<PatternKind, string> = {
  motion: 'Motion',
  interaction: 'Interaction',
  style: 'Styles',
  component: 'Components',
  layout: 'Layouts',
  'text-effect': 'Text & Effects',
};

const Upcoming: React.FC = () => (
  <div className="flex flex-col">
    <header className="sticky top-0 z-20 border-b border-ink-border bg-paper/95 backdrop-blur-md px-5 py-5 flex items-center gap-3">
      <Link to="/browse" aria-label="Back to browse" className="size-10 rounded-full flex items-center justify-center hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
      </Link>
      <h1 className="text-xl font-bold tracking-tight text-ink">Upcoming patterns</h1>
    </header>
    <section aria-labelledby="upcoming-ideas-heading" className="px-5 py-7">
      <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">Content roadmap</p>
      <h2 id="upcoming-ideas-heading" className="text-2xl font-bold text-ink mb-3">{plannedPatterns.length} ideas reserved</h2>
      <p className="text-sm text-ink-muted leading-relaxed mb-6">
        These are planned content slots, not working examples. Live previews, generated code and AI prompts
        will appear only after each pattern is implemented and checked. The 18 existing gallery entries remain separate; their reuse rights are not yet cleared.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
        {plannedPatterns.map(pattern => (
          <article id={pattern.id} key={pattern.id} className="rounded-xl overflow-hidden border border-ink-border bg-surface flex flex-col">
            <div className="relative h-28 flex items-center justify-center bg-paper bg-grid-pattern border-b border-ink-border">
              <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-primary/60">{pattern.icon}</span>
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-bold rounded-full border border-ink/20 bg-paper px-2 py-1 text-ink">
                Planned
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="text-base font-bold text-ink leading-snug">{pattern.title}</h3>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{pattern.description}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="rounded bg-primary/10 text-primary border border-primary/20 px-2 py-1 text-xs font-semibold">{kindLabels[pattern.kind]}</span>
                {pattern.tags.map(tag => (
                  <span key={tag} className="rounded bg-ink/5 text-ink-muted border border-ink/10 px-2 py-1 text-xs">{tag}</span>
                ))}
              </div>
              <details className="mt-auto border-t border-ink-border pt-3">
                <summary className="cursor-pointer text-sm font-semibold text-primary rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  Implementation checklist
                </summary>
                <p className="text-sm text-ink-muted leading-relaxed mt-2">{pattern.acceptance}</p>
              </details>
            </div>
          </article>
        ))}
      </div>
      <Link to="/browse" className="inline-block text-sm font-semibold text-primary underline underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        Browse currently listed patterns
      </Link>
    </section>
  </div>
);

export default Upcoming;
