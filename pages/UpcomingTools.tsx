import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { plannedTools, type PlannedToolCategory } from '../data/planned-tools';

type Filter = 'all' | PlannedToolCategory;

const categories: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'writing', label: 'Writing' },
  { id: 'development', label: 'Development' },
  { id: 'design', label: 'Design' },
  { id: 'content', label: 'Content' },
];

const UpcomingTools: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = plannedTools.filter(tool => filter === 'all' || tool.category === filter);

  return (
    <div className="flex flex-col min-w-0">
      <header className="px-5 pt-6 pb-5 border-b border-ink-border">
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-ink rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Home
        </Link>
        <p className="mt-5 text-xs font-mono uppercase tracking-widest text-primary font-bold">
          Practical tools · planned
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-bold text-ink">
          {plannedTools.length} tools planned
        </h1>
        <p lang="ja" className="mt-3 text-sm leading-relaxed text-ink-muted">
          <Link to="/tools" className="font-semibold underline underline-offset-4">公開済みの実用ツール</Link>に加え、文章作成、開発、情報整理に使うツールを予定しています。
          現時点では企画枠のみで、入力・プレビュー・変換・コピー・保存などの機能は利用できません。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          All {plannedTools.length} entries are proposals, not functioning tools or released UI patterns.
          They are excluded from the live pattern count, code generation, and reuse permissions.
          No release dates are promised.
        </p>
      </header>

      <section aria-labelledby="tools-heading" className="px-5 py-6">
        <h2 id="tools-heading" className="text-lg font-bold text-ink">
          Planned tools <span className="text-primary">({plannedTools.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Choose a category to narrow the list. Expand an item to see what is needed before release.
        </p>
        <div role="group" aria-label="Filter planned tools" className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
              className={
                'rounded-full border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ' +
                (filter === category.id
                  ? 'bg-primary text-paper border-primary'
                  : 'bg-surface text-ink border-ink-border hover:border-primary')
              }
            >
              {category.label}
            </button>
          ))}
        </div>
        <p role="status" className="mt-4 text-xs text-ink-muted">
          Showing {visible.length} of {plannedTools.length} planned tools
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map(tool => (
            <article key={tool.id} className="min-w-0 rounded-xl border border-ink-border bg-surface-highlight p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">
                  {tool.category}
                </span>
                <span className="shrink-0 rounded-full border border-ink-border px-2 py-1 text-[11px] font-semibold text-ink-muted">
                  Planned
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{tool.title}</h3>
              <p lang="ja" className="mt-1 text-sm font-semibold text-ink">{tool.titleJa}</p>
              <p lang="ja" className="mt-3 text-sm leading-relaxed text-ink-muted">{tool.purpose}</p>
              <details className="mt-4 border-t border-ink-border pt-3">
                <summary className="cursor-pointer py-2 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  Implementation checklist
                </summary>
                <p className="mt-2 text-xs text-ink-muted">{tool.description}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-ink-muted">
                  {tool.acceptance.map(check => <li key={check}>{check}</li>)}
                </ul>
                <p className="mt-3 text-xs font-semibold text-ink-muted">
                  Not implemented. No demo, export, or downloadable code is available yet.
                </p>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UpcomingTools;
