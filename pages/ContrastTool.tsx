import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contrastChecks, contrastRatio, normalizeHex } from '../data/tool-calculations';
import { CssOutput, ToolPage, toolButtonClass, toolInputClass } from '../components/ToolPage';

const ContrastTool: React.FC = () => {
  const [foreground, setForeground] = useState('#332200');
  const [background, setBackground] = useState('#faf0e6');
  const front = normalizeHex(foreground);
  const back = normalizeHex(background);
  const valid = Boolean(front && back);
  const ratio = front && back ? contrastRatio(front, back) : null;
  const css = front && back ? `.fragmenta-colors {\n  color: ${front};\n  background-color: ${back};\n}` : '';
  return (
    <ToolPage title="配色・コントラスト" english="Color & Contrast Checker" description="色を選ぶか、16進数のカラーコードを入力してください。文字色と背景色の組み合わせを確認できます。">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {([{ label: '文字色', value: foreground, color: front, set: setForeground, id: 'foreground' }, { label: '背景色', value: background, color: back, set: setBackground, id: 'background' }]).map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="text-sm font-semibold">{field.label}</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="color" aria-label={`${field.label}を選ぶ`} value={field.color ?? '#000000'} onChange={event => field.set(event.target.value)} className="size-12 shrink-0 rounded border border-ink/40 bg-surface" />
              <input id={field.id} type="text" value={field.value} onChange={event => field.set(event.target.value)} spellCheck={false} maxLength={30} aria-invalid={!field.color} aria-describedby={`${field.id}-hint`} className={`${toolInputClass} font-mono`} />
            </div>
            <p id={`${field.id}-hint`} className="mt-2 text-xs text-ink-muted">{field.color ? '#RGB または #RRGGBB' : '入力を確認してください。例：#332200、#fff'}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => { setForeground(background); setBackground(foreground); }} className={toolButtonClass}>文字色と背景色を入れ替え</button>
        <button type="button" onClick={() => { setForeground('#332200'); setBackground('#faf0e6'); }} className={toolButtonClass}>初期値に戻す</button>
      </div>
      <section aria-label="配色の結果" className="mt-6" aria-live="polite" aria-atomic="true">
        {valid && front && back && ratio !== null ? <>
          <div className="rounded-xl border border-ink/30 p-5" style={{ color: front, backgroundColor: back }}>
            <p style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.5 }}>色の違いを、文字で確かめる。</p>
            <p className="mt-3" style={{ fontSize: 16, lineHeight: 1.8 }}>読みやすさは、文字の大きさや太さ、背景との明暗差にも左右されます。</p>
            <p lang="en" className="mt-3" style={{ fontSize: 16 }}>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className="mt-5 flex items-baseline gap-3"><h2 className="text-sm font-bold">コントラスト比</h2><p className="font-mono text-3xl font-bold">{ratio.toFixed(3)}:1</p></div>
          <p className="mt-2 text-xs text-ink-muted">表示は小数第3位まで。判定には丸める前の値を使います。</p>
          <ul className="mt-4 divide-y divide-ink-border">
            {contrastChecks(ratio).map(check => <li key={check.label} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span>{check.label}<span className="ml-2 text-xs text-ink-muted">{check.minimum}:1以上</span></span><strong>{check.pass ? '✓ 基準を満たす' : '× 基準未満'}</strong></li>)}
          </ul>
        </> : <p className="rounded-lg border border-ink/40 p-4 text-sm">両方の色を正しく入力すると、プレビューと判定が表示されます。</p>}
      </section>
      <details className="mt-5 border-t border-ink-border pt-4 text-sm leading-relaxed">
        <summary className="cursor-pointer py-2 font-semibold">判定の範囲と基準</summary>
        <p className="mt-2">不透明なsRGBの単色同士を、WCAG 2.2の計算式で比較します。透明色、グラデーション、背景画像は対象外です。この結果だけでページ全体のアクセシビリティを判断することはできません。</p>
        <p className="mt-3">大きな文字の目安は18pt以上、または14pt以上の太字です。日本語などでは同等の大きさを確認します。UI・図形の判定は、操作部品や状態を識別するための表示、意味を伝える図形と、隣接する色との比較に使います。</p>
        <div className="mt-3 flex flex-col gap-2 underline underline-offset-4"><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">W3C：文字のコントラスト（AA）</a><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html">W3C：文字のコントラスト（AAA）</a><a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">W3C：UI・図形のコントラスト</a></div>
      </details>
      <CssOutput value={css} disabled={!valid} />
      <p className="mt-5 text-sm"><Link to="/tools/typography" className="font-semibold underline underline-offset-4">文字サイズや行間も調整する</Link></p>
    </ToolPage>
  );
};

export default ContrastTool;
