import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contrastChecks, contrastRatio, normalizeHex } from '../data/tool-calculations';
import { CssOutput, ToolPage, ToolWorkbench, toolButtonClass, toolInputClass } from '../components/ToolPage';

const ContrastTool: React.FC = () => {
  const [foreground, setForeground] = useState('#121316');
  const [background, setBackground] = useState('#F6F5F0');
  const front = normalizeHex(foreground);
  const back = normalizeHex(background);
  const valid = Boolean(front && back);
  const ratio = front && back ? contrastRatio(front, back) : null;
  const css = front && back ? `.fragmenta-colors {\n  color: ${front};\n  background-color: ${back};\n}` : '';
  return (
    <ToolPage
      title="配色・コントラスト"
      description="文字色と背景色の組み合わせを実寸の組版標本で確かめ、WCAG 2.2 コントラスト比とCSSを同時に取得します。"
    >
      <ToolWorkbench
        preview={
          <section aria-label="配色の結果" aria-live="polite" aria-atomic="true">
            {valid && front && back && ratio !== null ? (
              <>
                <div
                  className="border border-ink-border p-6 sm:p-8"
                  style={{ color: front, backgroundColor: back }}
                >
                  <p className="text-xs font-mono uppercase tracking-wider opacity-75">
                    Specimen · {front} on {back}
                  </p>
                  <p className="mt-3" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.45 }}>
                    色の違いを、文字で確かめる。
                  </p>
                  <p className="mt-3" style={{ fontSize: 16, lineHeight: 1.8 }}>
                    読みやすさは、文字の大きさや太さ、背景との明暗差にも左右されます。
                  </p>
                  <p lang="en" className="mt-3" style={{ fontSize: 15, lineHeight: 1.6 }}>
                    The quick brown fox jumps over the lazy dog. 0123456789
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-border pb-3">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    コントラスト比
                  </h2>
                  <p className="font-mono text-3xl font-bold tabular-nums">{ratio.toFixed(3)}:1</p>
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  表示は小数第3位まで。判定には丸める前の値を使います。
                </p>
                <ul className="mt-3 divide-y divide-ink-border border-y border-ink-border">
                  {contrastChecks(ratio).map((check) => (
                    <li
                      key={check.label}
                      className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs sm:text-sm"
                    >
                      <span>
                        {check.label}
                        <span className="ml-2 font-mono text-xs text-ink-muted">
                          {check.minimum}:1以上
                        </span>
                      </span>
                      <strong className="font-mono text-xs">
                        {check.pass ? '✓ 基準を満たす' : '× 基準未満'}
                      </strong>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="border border-ink-border bg-surface p-5 text-sm">
                両方の色を正しく入力すると、プレビューと判定が表示されます。
              </p>
            )}
          </section>
        }
        controls={
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-3">
              Color Parameters
            </h2>
            <div className="space-y-4">
              {(
                [
                  { label: '文字色', value: foreground, color: front, set: setForeground, id: 'foreground' },
                  { label: '背景色', value: background, color: back, set: setBackground, id: 'background' },
                ] as const
              ).map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="text-xs font-semibold">
                    {field.label}
                  </label>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <input
                      type="color"
                      aria-label={`${field.label}を選ぶ`}
                      value={field.color ?? '#000000'}
                      onChange={(event) => field.set(event.target.value)}
                      className="size-11 shrink-0 border border-ink-border bg-paper p-0.5"
                    />
                    <input
                      id={field.id}
                      type="text"
                      value={field.value}
                      onChange={(event) => field.set(event.target.value)}
                      spellCheck={false}
                      maxLength={30}
                      aria-invalid={!field.color}
                      aria-describedby={`${field.id}-hint`}
                      className={`${toolInputClass} font-mono`}
                    />
                  </div>
                  <p id={`${field.id}-hint`} className="mt-1 text-[11px] text-ink-muted">
                    {field.color ? '#RGB または #RRGGBB' : '入力を確認してください。例：#121316、#fff'}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setForeground(background);
                  setBackground(foreground);
                }}
                className={toolButtonClass}
              >
                文字色と背景色を入れ替え
              </button>
              <button
                type="button"
                onClick={() => {
                  setForeground('#121316');
                  setBackground('#F6F5F0');
                }}
                className={toolButtonClass}
              >
                初期値に戻す
              </button>
            </div>
            <details className="mt-5 border-t border-ink-border pt-3 text-xs leading-relaxed text-ink-muted">
              <summary className="cursor-pointer min-h-11 flex items-center font-semibold text-ink">
                判定の範囲と基準
              </summary>
              <p className="mt-1">
                不透明なsRGBの単色同士を、WCAG 2.2の計算式で比較します。透明色、グラデーション、背景画像は対象外です。この結果だけでページ全体のアクセシビリティを判断することはできません。
              </p>
              <p className="mt-2">
                大きな文字の目安は18pt以上、または14pt以上の太字です。UI・図形の判定は、操作部品や意味を伝える図形と隣接色との比較に使います。
              </p>
              <div className="mt-2 flex flex-col gap-1.5 underline underline-offset-4 text-ink">
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">
                  W3C：文字のコントラスト（AA）
                </a>
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html">
                  W3C：文字のコントラスト（AAA）
                </a>
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">
                  W3C：UI・図形のコントラスト
                </a>
              </div>
            </details>
          </div>
        }
      />
      <CssOutput value={css} disabled={!valid} />
      <p className="mt-4 text-xs">
        <Link to="/tools/typography" className="font-semibold underline underline-offset-4">
          文字サイズや行間も調整する →
        </Link>
      </p>
    </ToolPage>
  );
};

export default ContrastTool;
