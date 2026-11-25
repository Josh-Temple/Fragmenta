import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { plannedTools, type PlannedToolCategory } from '../data/planned-tools';

type Filter = 'all' | PlannedToolCategory;

const categories: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: 'all', label: 'すべて' },
  { id: 'writing', label: '文章作成' },
  { id: 'development', label: '開発' },
  { id: 'design', label: 'デザイン' },
  { id: 'content', label: 'コンテンツ' },
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
          ホーム
        </Link>
        <p className="mt-5 text-xs font-mono uppercase tracking-widest text-primary font-bold">
          実用ツールの企画
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-bold text-ink">
          企画中のツール {plannedTools.length}件
        </h1>
        <p lang="ja" className="mt-3 text-sm leading-relaxed text-ink-muted">
          <Link to="/tools" className="font-semibold underline underline-offset-4">公開済みの実用ツール</Link>に加え、文章作成、開発、情報整理に使うツールを予定しています。
          現時点では企画枠のみで、入力・プレビュー・変換・コピー・保存などの機能は利用できません。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          これらの企画は、公開済みの件数、コード生成、再利用許諾の対象外です。公開時期は未定です。
        </p>
      </header>

      <section aria-labelledby="tools-heading" className="px-5 py-6">
        <h2 id="tools-heading" className="text-lg font-bold text-ink">
          ツールの企画一覧 <span className="text-primary">({plannedTools.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          分野を選ぶと一覧を絞り込めます。各項目を開くと、予定している機能を確認できます。
        </p>
        <div role="group" aria-label="企画中のツールを分野で絞り込む" className="mt-4 flex flex-wrap gap-2">
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
          全{plannedTools.length}件中{visible.length}件を表示
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map(tool => (
            <article key={tool.id} className="min-w-0 rounded-xl border border-ink-border bg-surface-highlight p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">
                  {categories.find(item => item.id === tool.category)?.label}
                </span>
                <span className="shrink-0 rounded-full border border-ink-border px-2 py-1 text-[11px] font-semibold text-ink-muted">
                  企画中
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{tool.titleJa}</h3>
              <p lang="ja" className="mt-3 text-sm leading-relaxed text-ink-muted">{tool.purpose}</p>
              <details className="mt-4 border-t border-ink-border pt-3">
                <summary className="cursor-pointer py-2 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  予定している機能
                </summary>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-ink-muted">
                  {tool.acceptance.map(check => <li key={check}>{check}</li>)}
                </ul>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UpcomingTools;
