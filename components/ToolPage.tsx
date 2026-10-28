import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const toolInputClass = 'w-full min-w-0 rounded-lg border border-ink/40 bg-surface-highlight px-3 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
export const toolButtonClass = 'min-h-11 rounded-lg border border-ink/40 bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50';

export const ToolPage: React.FC<{ title: string; english: string; description: string; children: React.ReactNode }> = ({ title, english, description, children }) => (
  <div lang="ja" className="min-w-0 px-5 py-6">
    <Link to="/tools" className="inline-block min-h-11 py-2 text-sm font-semibold text-ink underline underline-offset-4">実用ツール一覧</Link>
    <header className="mt-3 mb-6">
      <p lang="en" className="text-xs font-mono text-ink-muted">{english}</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{description}</p>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">入力した内容はこの画面内で処理します。保存・外部送信はしません。ページを離れるとリセットされます。</p>
    </header>
    {children}
  </div>
);

export const CssOutput: React.FC<{ value: string; disabled?: boolean }> = ({ value, disabled = false }) => {
  const [feedback, setFeedback] = useState<{ value: string; message: string } | null>(null);
  const activeRequest = useRef(0);
  const copy = async () => {
    const request = ++activeRequest.current;
    try {
      await navigator.clipboard.writeText(value);
      if (request === activeRequest.current) setFeedback({ value, message: '表示中のCSSをコピーしました。' });
    } catch {
      if (request === activeRequest.current) setFeedback({ value, message: 'コピーできませんでした。下のCSSを選択してコピーしてください。' });
    }
  };
  return (
    <section className="mt-7 border-t border-ink-border pt-5" aria-label="CSS出力">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">CSSを持ち帰る</h2>
        <button type="button" disabled={disabled} onClick={copy} className={toolButtonClass}>CSSをコピー</button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">指定したクラスの中にだけ適用されます。自分のページに貼った後も、表示を確認してください。</p>
      <textarea aria-label="生成されたCSS" readOnly value={value} rows={9} spellCheck={false} className={`${toolInputClass} mt-3 font-mono text-xs`} />
      <p role="status" className="mt-2 min-h-5 text-sm text-ink">{feedback?.value === value ? feedback.message : ''}</p>
    </section>
  );
};
