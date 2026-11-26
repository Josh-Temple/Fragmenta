import DetailNavigation from '../components/DetailNavigation';
import CopyReviewBrief from '../components/CopyReviewBrief';
import { getStyleSelection, styleSelectionBrief, styleSearchFields } from '../data/design-style-guidance';
import { matchesSearch, styleSearchAliases } from '../data/discovery';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DesignStyleSpecimen } from '../components/DesignStyleSpecimen';
import { getStyleMotion } from '../data/design-style-motion';
import { designStyleGroups, designStyles, type DesignStyleGroup } from '../data/design-styles';
import { createStylePrompt, createBlendedStylePrompt, createStyleCss, type DemoScreen } from '../data/design-style-export';

type Family = 'all' | DesignStyleGroup;

type Props = { styleId?: string; relatedEntries?: { id: string; titleJa: string }[] };
const DesignStyles: React.FC<Props> = ({ styleId, relatedEntries = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStyle = styleId ?? searchParams.get('style');
  const [family, setFamily] = useState<Family>('all');
  const [query, setQuery] = useState('');
  const primary = designStyles.find(style => style.id === requestedStyle)?.id ?? 'swiss';
  const [compare, setCompare] = useState('neo-brutalism');
  const [screen, setScreen] = useState<DemoScreen>('dashboard');
  const [copyStatus, setCopyStatus] = useState('');
  const [showCss, setShowCss] = useState(false);
  const [mixEnabled, setMixEnabled] = useState(false);
  const [secondaryWeight, setSecondaryWeight] = useState(30);
  const first = designStyles.find(item => item.id === primary) ?? designStyles[0];
  const selection = getStyleSelection(first);
  const relatedKnowledge = relatedEntries;
  const second = compare === 'none' ? null : designStyles.find(item => item.id === compare) ?? null;
  const results = useMemo(() => {
    return designStyles.filter(item =>
      (family === 'all' || item.group === family) &&
      matchesSearch(query, [...styleSearchFields(item), styleSearchAliases[item.id] ?? ''])
    );
  }, [family, query]);
  const canMix = Boolean(second && first.id !== second.id);
  const mixing = mixEnabled && canMix;
  useEffect(() => {
    if (!canMix) setMixEnabled(false);
  }, [canMix]);
  useEffect(() => {
    setCopyStatus('');
  }, [primary]);
  const selectPrimary = (id: string) => {
    if (styleId && styleId !== id) {
      window.location.assign('/styles/' + encodeURIComponent(id));
      return;
    }
    if (requestedStyle !== id) {
      const next = new URLSearchParams(searchParams);
      next.set('style', id);
      setSearchParams(next);
    }
    if (!second || second.id === id) setMixEnabled(false);
    setCopyStatus('');
  };
  const selectCompare = (id: string) => {
    setCompare(id);
    if (id === 'none' || id === primary) setMixEnabled(false);
    setCopyStatus('');
  };
  const prompt = mixing && second ? createBlendedStylePrompt(first, second, screen, secondaryWeight) : createStylePrompt(first, screen);
  const css = createStyleCss(first);
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
          ホーム
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[.2em] text-primary font-bold">デザインスタイル図鑑</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{styleId ? first.ja : 'デザインの名前から探す'}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {styleId ? first.name + '　' + first.summary : designStyles.length + '系統の特徴を見比べられます。'}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          プレビューは各様式から着想を得て独自に作った簡易解釈です。歴史的な正解や公式デザインシステムの再現ではありません。
        </p>
      </header>

      {styleId && <DetailNavigation />}
      {!styleId && <section aria-labelledby="atlas-list-heading" className="px-5 py-6">
        <h2 id="atlas-list-heading" className="text-lg font-bold">スタイルを探す</h2>
        <label htmlFor="atlas-search" className="block mt-4 text-sm font-semibold">名前・特徴・使いどころで検索</label>
        <input id="atlas-search" type="search" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="例：Swiss、和、グラデーション"
          className="w-full mt-2 rounded-lg border border-ink-border bg-paper p-3 text-ink text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"/>
        <div role="group" aria-label="スタイル分類" className="flex flex-wrap gap-2 mt-4">
          {[{ id: 'all' as const, label: 'すべて' }, ...designStyleGroups].map(group => (
            <button key={group.id} type="button" aria-pressed={family === group.id} onClick={() => setFamily(group.id)}
              className={'motion-control rounded-full border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
                (family === group.id ? 'bg-primary text-paper border-primary' : 'bg-surface text-ink border-ink-border hover:border-primary')}>
              {group.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted" role="status">全{designStyles.length}種類中{results.length}種類を表示</p>
        {results.length ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {results.map(item => (
              <button type="button" aria-pressed={primary === item.id} key={item.id}
                onClick={() => selectPrimary(item.id)}
                className={'motion-card min-w-0 text-left rounded-xl border p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
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
      </section>}

      <section id="visual" aria-labelledby="compare-heading" className="px-5 pt-5 pb-6 border-t border-ink-border">
        <h2 id="compare-heading" className="text-xl font-bold">同じ内容で見比べる</h2>
        <p className="mt-2 text-sm text-ink-muted">文字、余白、色、形、素材感の違いを確認します。比較する組合せと画面を選べます。</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">動きの例：{getStyleMotion(first.id).description}。スタイルや画面を切り替えると確認できます。動きを減らす端末設定では再生しません。</p>
        <details className="compare-settings"><summary>比較するスタイル・画面・配合を選ぶ</summary>
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="style-a" className="block mb-1 text-sm font-semibold">スタイルA</label>
            <select id="style-a" value={primary} onChange={e => selectPrimary(e.target.value)}
              className="w-full bg-paper text-ink border border-ink-border rounded-lg p-3 text-base">
              {designStyles.map(item => <option key={item.id} value={item.id}>{item.name} / {item.ja}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="style-b" className="block mb-1 text-sm font-semibold">比較対象B</label>
            <select id="style-b" value={compare} onChange={e => selectCompare(e.target.value)}
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
              <input type="radio" name="atlas-example" value="dashboard" checked={screen === 'dashboard'} onChange={() => setScreen('dashboard')}/>
              Dashboard
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="atlas-example" value="article" checked={screen === 'article'} onChange={() => setScreen('article')}/>
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
                比率の高い{secondaryWeight > 50 ? 'B' : 'A'}のレイアウト・情報階層を基調に、
                {secondaryWeight > 50 ? 'A' : 'B'}のアクセントや質感を取り入れる指示です。
                比率はAIに伝える優先度の目安で、CSS値を正確に混色するものではありません。
              </p>
            </div>
          )}
        </div>
        </details>
        <div className="style-pair grid grid-cols-1 gap-4 mt-4">
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

      <section id="structure" aria-labelledby="recipe-heading" className="px-5 pt-6 pb-5 border-t border-ink-border">
        <h2 id="recipe-heading" className="text-xl font-bold">特徴とAI用の指定文</h2>
        <h3 className="mt-4 text-lg font-bold">{first.name} / {first.ja}</h3>
        <p className="mt-2 text-sm leading-relaxed">{first.summary}。{first.use}に向いています。</p>
        <div className="mt-4 space-y-2 text-sm leading-relaxed">
          <p><strong>向く理由　</strong>{selection.reason}</p>
          <p><strong>向きにくい場面　</strong>{selection.avoid}</p>
          <p><strong>最初に調整すること　</strong>{selection.adjustment}</p>
          <p><strong>完成画面での確認　</strong>{selection.check}</p>
          <h4 className="font-bold">条件を変えて試すスタイル</h4>
          <ul className="space-y-2">{selection.alternatives.map(a => <li key={a.id}><Link to={'/styles/' + a.id} className="font-semibold underline">{a.titleJa}</Link>　{a.reason}</li>)}</ul>
          <p className="text-xs text-ink-muted">{selection.sourceScope}</p>
          <CopyReviewBrief text={styleSelectionBrief(first)} />
        </div>
        <h4 className="mt-4 text-sm font-bold">指定するとよい特徴</h4>
        <ul className="mt-2 list-disc pl-5 text-sm leading-loose">
          {first.features.map(value => <li key={value}>{value}</li>)}
        </ul>
        <h4 className="mt-3 text-sm font-bold">避けたいこと</h4>
        <ul className="mt-2 list-disc pl-5 text-sm leading-loose">
          {first.avoid.map(value => <li key={value}>{value}</li>)}
        </ul>
        <div id="ai-code" className="flex items-center justify-between gap-2 mt-5">
          <h3 className="text-sm font-bold">{mixing ? 'AI向け配合プロンプト' : 'AI向けプロンプト'}</h3>
          <button type="button" onClick={() => void copyText(prompt, 'プロンプト')}
            className="motion-control rounded-lg border border-ink-border px-3 py-2 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            コピー
          </button>
        </div>
        <textarea readOnly aria-label="AI用プロンプト" rows={9} value={prompt}
          onFocus={e => e.currentTarget.select()} className="mt-2 w-full rounded-lg bg-surface border border-ink-border p-3 font-mono text-xs leading-relaxed text-ink resize-y"/>
        {mixing && <p className="mt-3 text-xs leading-relaxed text-ink-muted">下のCSSはスタイルAのみのトークンです。配合した完成CSSを生成する機能はまだありません。</p>}
        <button type="button" onClick={() => setShowCss(value => !value)} aria-expanded={showCss} aria-controls="atlas-css"
          className="motion-control mt-4 w-full text-left rounded-lg border border-ink-border p-3 text-sm font-bold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {showCss ? 'CSSトークンを閉じる −' : 'CSSトークンを見る ＋'}
        </button>
        {showCss && (
          <div id="atlas-css" className="mt-3">
            <div className="flex justify-end">
              <button type="button" onClick={() => void copyText(css, 'CSS')}
                className="motion-control rounded-lg border border-ink-border px-3 py-2 text-sm font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
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

      <section aria-labelledby="related-knowledge-heading" className="mx-5 mt-3 rounded-xl border border-ink-border p-4">
        <h2 id="related-knowledge-heading" className="text-base font-bold">知識ベースの関連企画</h2>
        {relatedKnowledge.length ? <ul className="mt-2 space-y-2">
          {relatedKnowledge.map(item => <li key={item.id}>
            <Link to={`/knowledge/${item.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">{item.titleJa}（企画段階）</Link>
          </li>)}
        </ul> : <p className="mt-2 text-sm text-ink-muted">このスタイルに直接紐付けた企画はまだありません。</p>}
        <Link to="/knowledge" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">すべての企画180件を見る</Link>
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
