import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CssOutput, ToolPage, toolButtonClass, toolInputClass } from '../components/ToolPage';
import { defaultTypography, typographyCss, typographyFonts } from '../data/tool-calculations';

const defaultTitle = '長い日本語の見出しでも、内容がひと目で伝わる読みやすい画面にする';
const defaultBody = '文章を読みやすくするには、文字の大きさだけでなく、行間や一行の長さも確認します。短い画面で読みにくいと感じたら、余白や改行の位置を見直してみましょう。\n\n見出しは話題を示し、本文は結論と理由を伝えます。大切な情報を色だけに頼らず、言葉と配置でも区別すると、内容を追いやすくなります。\n\nA readable page gives each idea room to breathe. Check Japanese and English text together, including long words such as accessibility-and-responsive-typography.';

const TypographyTool: React.FC = () => {
  const [settings, setSettings] = useState({ ...defaultTypography });
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [previewWidth, setPreviewWidth] = useState(390);
  const update = (key: 'size' | 'leading' | 'spacing' | 'width', value: number) => setSettings(current => ({ ...current, [key]: value }));
  const css = typographyCss(settings);
  return (
    <ToolPage title="日本語の文字を調整" description="自分の文章を入れて、文字サイズ・行間・字間・本文幅を試せます。唯一の正解を決めるものではありません。読み手や端末に合わせて調整してください。">
      <section aria-labelledby="type-settings-heading">
        <h2 id="type-settings-heading" className="text-lg font-bold">文字と余白</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {([{ key: 'size', label: '文字サイズ', min: 14, max: 28, step: 1, unit: 'px' }, { key: 'leading', label: '行間', min: 1.4, max: 2.4, step: 0.05, unit: '倍' }, { key: 'spacing', label: '字間', min: 0, max: 0.12, step: 0.01, unit: 'em' }, { key: 'width', label: '本文の最大幅', min: 20, max: 48, step: 1, unit: 'rem' }] as const).map(control => (
            <label key={control.key} className="block text-sm font-semibold">
              <span className="flex justify-between gap-3">{control.label}<span className="font-mono">{settings[control.key]}{control.unit}</span></span>
              <input type="range" min={control.min} max={control.max} step={control.step} value={settings[control.key]} onChange={event => update(control.key, Number(event.target.value))} aria-valuetext={`${settings[control.key]}${control.unit}`} className="tool-range mt-2 min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" />
            </label>
          ))}
        </div>
        <label htmlFor="type-font" className="mt-4 block text-sm font-semibold">書体</label>
        <select id="type-font" value={settings.font} onChange={event => setSettings(current => ({ ...current, font: event.target.value === 'serif' ? 'serif' : 'sans' }))} className={`${toolInputClass} mt-2`}><option value="sans">ゴシック体</option><option value="serif">明朝体</option></select>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">端末にある書体を使います。指定した日本語フォントがない場合は代替書体で表示されます。</p>
        <button type="button" onClick={() => { setSettings({ ...defaultTypography }); setPreviewWidth(390); }} className={`${toolButtonClass} mt-4`}>設定を初期値に戻す</button>
      </section>
      <details className="mt-6 border-t border-ink-border pt-4">
        <summary className="cursor-pointer py-2 text-sm font-semibold">プレビューの文章を編集</summary>
        <label htmlFor="type-title" className="mt-3 block text-sm font-semibold">見出し</label>
        <input id="type-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={500} className={`${toolInputClass} mt-2`} />
        <label htmlFor="type-body" className="mt-4 block text-sm font-semibold">本文</label>
        <textarea id="type-body" value={body} onChange={event => setBody(event.target.value)} maxLength={20000} rows={7} className={`${toolInputClass} mt-2`} />
        <button type="button" onClick={() => { setTitle(defaultTitle); setBody(defaultBody); }} className={`${toolButtonClass} mt-3`}>サンプル文に戻す</button>
      </details>
      <section aria-labelledby="type-preview-heading" className="mt-6">
        <h2 id="type-preview-heading" className="text-lg font-bold">表示を確認</h2>
        <div role="group" aria-label="プレビューの最大幅" className="mt-3 flex flex-wrap gap-2">{[320, 390, 640].map(width => <button key={width} type="button" aria-pressed={previewWidth === width} onClick={() => setPreviewWidth(width)} className={`${toolButtonClass} aria-pressed:bg-ink aria-pressed:text-paper aria-pressed:hover:bg-ink`}>{width}px</button>)}</div>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">プレビューは指定幅を上限に、この画面に収まる幅で表示します。本文の最大幅は、この枠より狭い場合に反映されます。実機の再現ではありません。</p>
        <div className="mt-4 rounded-xl border border-ink/30 bg-surface-highlight p-4 sm:p-5" style={{ maxWidth: previewWidth, marginInline: 'auto' }}>
          <article aria-label="タイポグラフィのプレビュー" style={{ fontFamily: typographyFonts[settings.font], fontSize: settings.size, lineHeight: settings.leading, letterSpacing: `${settings.spacing}em`, maxInlineSize: `${settings.width}rem`, marginInline: 'auto', overflowWrap: 'anywhere' }}>
            <h2 style={{ fontSize: '1.5em', lineHeight: 1.5, marginBlock: '0 1em' }}>{title}</h2>
            {body.split(/\n\s*\n/).map((paragraph, index) => <p key={index} style={{ marginBlock: '0 1.25em', whiteSpace: 'pre-wrap' }}>{paragraph}</p>)}
            <a href="#type-settings-heading" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '0.2em' }} onClick={event => { event.preventDefault(); document.getElementById('type-font')?.focus(); }}>設定に戻って調整する</a>
          </article>
        </div>
      </section>
      <CssOutput value={css} />
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">CSSは外側の要素に <code>class="fragmenta-prose"</code> を付けて使います。段落はp、見出しはh2で記述してください。</p>
      <p className="mt-5 text-sm"><Link to="/tools/contrast" className="font-semibold underline underline-offset-4">文字色と背景色も確認する</Link></p>
    </ToolPage>
  );
};

export default TypographyTool;
