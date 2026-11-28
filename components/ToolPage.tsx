import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const toolInputClass =
  'w-full min-w-0 border border-ink-border bg-paper px-3 py-2.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
export const toolButtonClass =
  'min-h-11 border border-ink-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50';
export const toolPrimaryButtonClass =
  'min-h-11 border border-ink bg-ink px-4 py-2 text-xs font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50';

export const ToolPage: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div lang="ja" className="min-w-0 py-3">
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-border pb-4 mb-5">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-ink-muted">Drafting Workbench</p>
        <h1 className="mt-1 text-2xl font-medium leading-tight font-display">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
      <Link
        to="/tools"
        className="inline-flex min-h-11 items-center text-xs font-semibold text-ink-muted hover:text-ink underline underline-offset-4"
      >
        ← 実用ツール一覧
      </Link>
    </div>
    {children}
    <p className="mt-6 border-t border-ink-border pt-3 text-xs leading-relaxed text-ink-muted">
      入力した内容はこの画面内で処理します。保存・外部送信はしません。ページを離れるとリセットされます。
    </p>
  </div>
);

export const ToolWorkbench: React.FC<{
  preview: React.ReactNode;
  controls: React.ReactNode;
}> = ({ preview, controls }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)] items-start">
    <div className="min-w-0">{preview}</div>
    <div className="min-w-0 border border-ink-border bg-surface p-4 sm:p-5">{controls}</div>
  </div>
);

export const CssOutput: React.FC<{ value: string; disabled?: boolean }> = ({
  value,
  disabled = false,
}) => {
  const [feedback, setFeedback] = useState<{ value: string; message: string } | null>(null);
  const activeRequest = useRef(0);
  const copy = async () => {
    const request = ++activeRequest.current;
    try {
      await navigator.clipboard.writeText(value);
      if (request === activeRequest.current)
        setFeedback({ value, message: '表示中のCSSをコピーしました。' });
    } catch {
      if (request === activeRequest.current)
        setFeedback({
          value,
          message: 'コピーできませんでした。下のCSSを選択してコピーしてください。',
        });
    }
  };
  return (
    <section className="mt-6 border-t border-ink-border pt-5" aria-label="CSS出力">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">CSSを持ち帰る</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
            指定したクラスの中にだけ適用されます。自分のページに貼った後も表示を確認してください。
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={copy}
          className={toolPrimaryButtonClass}
        >
          CSSをコピー
        </button>
      </div>
      <p role="status" className="mt-2 min-h-4 text-xs font-medium text-primary">
        {feedback?.value === value ? feedback.message : ''}
      </p>
      <textarea
        aria-label="生成されたCSS"
        readOnly
        value={value}
        rows={7}
        spellCheck={false}
        onFocus={(e) => e.currentTarget.select()}
        className={`${toolInputClass} mt-1 font-mono text-xs leading-relaxed`}
      />
    </section>
  );
};
