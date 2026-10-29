import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DesignStyleSpecimen } from '../components/DesignStyleSpecimen';
import { designStyleGroups, designStyles, type DesignStyleGroup } from '../data/design-styles';
import { styleGuidance } from '../data/design-style-guidance';
import { createStylePrompt, createBlendedStylePrompt, createStyleCss, type DemoScreen } from '../data/design-style-export';

type Family = 'all' | DesignStyleGroup;

const DesignStyles: React.FC = () => {
  const [family, setFamily] = useState<Family>('all');
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  const requestedStyle = searchParams.get('style');
  const [primary, setPrimary] = useState(() => designStyles.find(style => style.id === requestedStyle)?.id ?? 'swiss');
  useEffect(() => {
    if (requestedStyle && designStyles.some(style => style.id === requestedStyle)) {
      setPrimary(requestedStyle);
      setCopyStatus('');
    }
  }, [requestedStyle]);
  const [compare, setCompare] = useState('neo-brutalism');
  const [screen, setScreen] = useState<DemoScreen>('dashboard');
  const [copyStatus, setCopyStatus] = useState('');
  const [showCss, setShowCss] = useState(false);
  const [mixEnabled, setMixEnabled] = useState(false);
  const [secondaryWeight, setSecondaryWeight] = useState(30);
  const first = designStyles.find(item => item.id === primary) ?? designStyles[0];
  const guidance = styleGuidance[first.id];
  const second = compare === 'none' ? null : designStyles.find(item => item.id === compare) ?? null;
  const results = useMemo(() => {
    const q = query.trim().normalize('NFKC').toLowerCase();
    return designStyles.filter(item =>
      (family === 'all' || item.group === family) &&
      (!q || [item.name, item.ja, item.summary, ...item.features].join(' ').normalize('NFKC').toLowerCase().includes(q))
    );
  }, [family, query]);
  const canMix = Boolean(second && first.id !== second.id);
  const mixing = mixEnabled && canMix;
  const prompt = mixing && second ? createBlendedStylePrompt(first, second, screen, secondaryWeight) : createStylePrompt(first, screen);
  const css = createStyleCss(first);
  const choosePrimary = (id: string) => {
    setPrimary(id);
    if (id === compare) setMixEnabled(false);
    setCopyStatus('');
  };
  const chooseComparison = (id: string) => {
    setCompare(id);
    if (id === 'none' || id === primary) setMixEnabled(false);
    setCopyStatus('');
  };
  const copyText = async (value: string, label: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setCopyStatus(label + 'をコピーしました。');
    } catch {
      setCopyStatus('コピーできませんでした。下の欄から手動で選択してください。');
    }
  };

  return (
    <div className="min-w-0 flex flex-col pb-12">
      <header className="px-5 pt-6 pb-5 border-b border-ink-border">
        <Link to="/" className="inline-flex py-2 items-center gap-2 text-sm text-ink font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded">
          <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
          Home
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[.2em] text-primary font-bold">Design Styles / デザインの図鑑</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">デザインの名前から探す</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {designStyles.length}系統の特徴を知り、同じ画面で比較し、AIへの指示文やCSSトークンを持ち帰れます。
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          プレビューは各様式から着想を得て独自に作った簡易解釈です。歴史的な正解や公式デザインシステムの再現ではありません。
        </p>
      </header>

      <section aria-labelledby="atlas-list-heading" className="px-5 py-6">
        <h2 id="atlas-list-heading" className="text-lg font-bold">スタイルを探す</h2>
        <label htmlFor="atlas-search" className="block mt-4 text-sm font-semibold">名前・特徴で検索</label>
        <input id="atlas-search" type="search" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="例：Swiss、侘び寂び、グラデーション"
          className="w-full mt-2 rounded-lg border border-ink-border bg-paper p-3 text-ink text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"/>
        <div role="group" aria-label="スタイル分類" className="flex flex-wrap gap-2 mt-4">
          {[{ id: 'all' as const, label: 'すべて' }, ...designStyleGroups].map(group => (
            <button key={group.id} type="button" aria-pressed={family === group.id} onClick={() => setFamily(group.id)}
              className={'rounded-full border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
                (family === group.id ? 'bg-primary text-paper border-primary' : 'bg-surface text-ink border-ink-border hover:border-primary')}>
              {group.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted" role="status">{results.length} / {designStyles.length} 件</p>
        {results.length ? (
          <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-3 mt-4">
            {results.map(item => (
              <button type="button" aria-pressed={primary === item.id} key={item.id}
                onClick={() => choosePrimary(item.id)}
                className={'min-w-0 text-left rounded-xl border p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
                  (primary === item.id ? 'border-primary ring-2 ring-primary/30' : 'border-ink-border hover:border-primary')}>
                <div aria-hidden="true" className="h-16 rounded-md p-2 flex items-end gap-2 overflow-hidden"
                  style={{ background: item.tokens.background, border: '1px solid ' + item.tokens.border }}>
                  <span className="h-8 w-8 shrink-0" style={{
                    background: item.tokens.surface,
                    border: String(item.tokens.borderWidth) + 'px solid ' + item.tokens.border,
                    borderRadius: item.tokens.radius,
                    boxShadow: item.tokens.shadow,
                  }}/>
                  <span className="h-5 flex-1" style={{ background: item.tokens.accent, borderRadius: item.tokens.radius }}/>
                </div>
                <p className="mt-2 text-xs font-bold text-ink break-words">{item.name}</p>
                <p className="mt-1 text-[11px] leading-snug text-ink-muted">{item.ja}</p>
              </button>
            ))}
          </div>
        ) : <p className="mt-4 p-4 bg-surface rounded-lg text-sm">該当するスタイルがありません。検索語や分類を変えてください。</p>}
      </section>

      <section aria-labelledby="compare-heading" className="px-5 pt-5 pb-6 border-t border-ink-border">
        <h2 id="compare-heading" className="text-xl font-bold">同じ内容で見比べる</h2>
        <p className="mt-2 text-sm text-ink-muted">文字、余白、色、形、素材感の違いを確認します。比較する組合せと画面を選べます。</p>
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="style-a" className="block mb-1 text-sm font-semibold">スタイルA</label>
            <select id="style-a" value={primary} onChange={e => choosePrimary(e.target.value)}
              className="w-full bg-paper text-ink border border-ink-border rounded-lg p-3 text-base">
              {designStyles.map(item => <option key={item.id} value={item.id}>{item.name} / {item.ja}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="style-b" className="block mb-1 text-sm font-semibold">比較対象B</label>
            <select id="style-b" value={compare} onChange={e => chooseComparison(e.target.value)}
              className="w-full bg-paper text-ink border border-ink-border rounded-lg p-3 text-base">
              <option value="none">比較しない</option>
              {designStyles.map(item => <option key={item.id} value={item.id}>{item.name} / {item.ja}</option>)}
            </select>
          </div>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">比較する画面</legend>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="atlas-example" value="dashboard" checked={screen === 'dashboard'} onChange={() => { setScreen('dashboard'); setCopyStatus(''); }}/>
              Dashboard
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="atlas-example" value="article" checked={screen === 'article'} onChange={() => { setScreen('article'); setCopyStatus(''); }}/>
              Article
            </label>
          </div>
        </fieldset>
        <div className="mt-5 rounded-xl border border-ink-border bg-surface p-4">
          <label className="flex items-start gap-3 text-sm font-semibold">
            <input type="checkbox" checked={mixEnabled} disabled={!canMix} onChange={e => { setMixEnabled(e.target.checked); setCopyStatus(''); }}
              className="mt-1 size-4 shrink-0 accent-primary"/>
            2つのデザインを組み合わせたAI指示を作る
          </label>
          {!canMix && (
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">異なる2つのスタイルを選ぶと配合できます。</p>
          )}
          {mixing && second && (
            <div className="mt-4">
              <label htmlFor="style-mix-weight" className="block text-sm font-bold">
                Bの採用優先度：{secondaryWeight}%（A：{100 - secondaryWeight}%）
              </label>
              <input id="style-mix-weight" type="range" min={10} max={90} step={10} value={secondaryWeight}
                onChange={e => { setSecondaryWeight(Number(e.target.value)); setCopyStatus(''); }}
                className="mt-3 w-full accent-primary"/>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {secondaryWeight === 50 ? '同率50/50ではA' : '比率の高い' + (secondaryWeight > 50 ? 'B' : 'A')}のレイアウト・情報階層を基調に、
                {secondaryWeight > 50 ? 'A' : 'B'}のアクセントや質感を取り入れる指示です。
                比率はAIに伝える優先度の目安で、CSS値を正確に混色するものではありません。
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="border border-ink-border rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-surface text-sm font-bold">{first.name} / {first.ja}</div>
            <DesignStyleSpecimen style={first} screen={screen}/>
          </div>
          {second && (
            <div className="border border-ink-border rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-surface text-sm font-bold">{second.name} / {second.ja}</div>
              <DesignStyleSpecimen style={second} screen={screen}/>
            </div>
          )}
          {mixing && second && (
            <div className="border border-ink-border rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-surface text-sm font-bold">配合指示の雰囲気図（A {100 - secondaryWeight}% / B {secondaryWeight}%）</div>
              <DesignStyleSpecimen style={secondaryWeight > 50 ? second : first} screen={screen}
                secondaryStyle={secondaryWeight > 50 ? first : second} secondaryWeight={Math.min(secondaryWeight, 100 - secondaryWeight)}/>
              <p className="p-3 text-xs leading-relaxed text-ink-muted">
                プレビューは比率が高いスタイルの構成と、もう一方の色見本を表示します。AIが生成する合成デザインを完全に再現したものではありません。
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="recipe-heading" className="px-5 pt-6 pb-5 border-t border-ink-border">
        <h2 id="recipe-heading" className="text-xl font-bold">{mixing ? 'スタイルAの特徴とA/Bの配合指示' : '特徴とAI用の指定文'}</h2>
        <h3 className="mt-4 text-lg font-bold">{first.name} / {first.ja}</h3>
        <p className="mt-2 text-sm leading-relaxed">{first.summary}。{first.use}に向いています。</p>
        <h4 className="mt-4 text-sm font-bold">スタイルAで指定するとよい特徴</h4>
        <ul className="mt-2 list-disc pl-5 text-sm leading-loose">
          {first.features.map(value => <li key={value}>{value}</li>)}
        </ul>
        <h4 className="mt-3 text-sm font-bold">避けたいこと</h4>
        <ul className="mt-2 list-disc pl-5 text-sm leading-loose">
          {first.avoid.map(value => <li key={value}>{value}</li>)}
        </ul>
        <h4 className="mt-4 text-sm font-bold">向かない可能性がある用途</h4>
        <p className="mt-2 text-sm leading-relaxed">{guidance.unsuitable}</p>
        <h4 className="mt-4 text-sm font-bold">最初に調整すること</h4>
        <p className="mt-2 text-sm leading-relaxed">{guidance.firstAdjustment}</p>
        <h4 className="mt-4 text-sm font-bold">関連するスタイル</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {guidance.related.map(id => {
            const item = designStyles.find(style => style.id === id);
            return item ? (
              <Link key={id} to={'/styles?style=' + encodeURIComponent(id)}
                className="rounded-lg border border-ink-border px-3 py-2 text-sm text-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {item.name} / {item.ja}
              </Link>
            ) : null;
          })}
        </div>
        <div className="flex items-center justify-between gap-2 mt-5">
          <h3 className="text-sm font-bold">{mixing ? 'AI向け配合プロンプト' : 'AI向けプロンプト'}</h3>
          <button type="button" onClick={() => void copyText(prompt, 'プロンプト')}
            className="rounded-lg border border-ink-border px-3 py-2 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            コピー
          </button>
        </div>
        <textarea readOnly aria-label="AI用プロンプト" rows={9} value={prompt}
          onFocus={e => e.currentTarget.select()} className="mt-2 w-full rounded-lg bg-surface border border-ink-border p-3 font-mono text-xs leading-relaxed text-ink resize-y"/>
        {mixing && <p className="mt-3 text-xs leading-relaxed text-ink-muted">下のCSSはスタイルAのみのトークンです。配合した完成CSSを生成する機能はまだありません。</p>}
        <button type="button" onClick={() => setShowCss(value => !value)} aria-expanded={showCss} aria-controls="atlas-css"
          className="mt-4 w-full text-left rounded-lg border border-ink-border p-3 text-sm font-bold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {showCss ? 'CSSトークンを閉じる −' : 'CSSトークンを見る ＋'}
        </button>
        {showCss && (
          <div id="atlas-css" className="mt-3">
            <div className="flex justify-end">
              <button type="button" onClick={() => void copyText(css, 'CSS')}
                className="rounded-lg border border-ink-border px-3 py-2 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                CSSをコピー
              </button>
            </div>
            <textarea aria-label="CSSトークン" readOnly rows={14} value={css}
              onFocus={e => e.currentTarget.select()} className="mt-2 w-full rounded-lg bg-surface border border-ink-border p-3 font-mono text-xs leading-relaxed text-ink resize-y"/>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">CSSは設計用トークン例です。画面全体の完成コードではありません。</p>
          </div>
        )}
        <p className="mt-3 text-sm" role="status" aria-live="polite">{copyStatus}</p>
      </section>

      <aside className="mx-5 mt-3 p-4 rounded-xl bg-surface border border-ink-border">
        <h2 className="text-base font-bold">類型を混同しないために</h2>
        <p className="text-sm leading-relaxed mt-2">
          この図鑑は歴史的な様式、表面の質感、表現傾向、世界観を便宜上分けています。
          Bento GridやSplit-screenは主にレイアウトの形式です。
          Material Design、Fluent、Carbonは製品のデザインシステムであり、同じ分類ではありません。
        </p>
        <p className="text-sm leading-relaxed mt-2">
          既存の実装済み18パターンとは別枠で、既存パターンの再利用許諾は変更していません。
          <Link to="/licenses" className="underline font-semibold ml-1">ライセンス表示</Link>
        </p>
      </aside>
    </div>
  );
};

export default DesignStyles;
