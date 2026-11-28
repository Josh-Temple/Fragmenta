import React, { useState } from 'react';

export default function CopyReviewBrief({ text }: { text: string }) {
  const [result, setResult] = useState<{ text: string; copied: boolean }>();
  const current = result?.text === text ? result : undefined;
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, copied: true });
    } catch {
      setResult({ text, copied: false });
    }
  }
  return <div lang="ja" className="mt-3">
    <button type="button" onClick={copy} className="min-h-11 rounded-lg border border-ink-border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2">AIに渡す判断材料をコピー</button>
    <span aria-live="polite" className="ml-2 text-sm">{current && (current.copied ? 'コピーしました。' : '下の文章を選択してコピーできます。')}</span>
    {current?.copied === false && <textarea readOnly aria-label="AIに渡す判断材料" className="mt-2 block w-full rounded border p-2" rows={6} value={text} onFocus={event => event.currentTarget.select()} />}
  </div>;
}
