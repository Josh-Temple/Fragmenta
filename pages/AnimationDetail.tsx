import DetailNavigation from '../components/DetailNavigation';
import { patternSelectionBrief } from '../data/pattern-selection';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { definitions, getPatternKind, patternKindLabels } from '../data/definitions';
import { patternGuides } from '../data/pattern-guides';
import PatternUsage from '../components/PatternUsage';
import { patternRights } from '../data/pattern-rights';

type Props = { relatedEntries?: { id: string; titleJa: string }[] };
const PatternDetail: React.FC<Props> = ({ relatedEntries = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'code' | 'prompt' | 'parameters'>('parameters');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [motionPaused, setMotionPaused] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const def = id ? definitions[id] : null;
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  useEffect(() => {
    function selectView() {
      const id = window.location.hash.slice(1);
      if (id === 'structure') setActiveTab('parameters');
      if (id === 'ai-code') setActiveTab('code');
      if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
    selectView();
    if (!def) return;

    const defaults: Record<string, number> = {};
    def.params.forEach(param => {
      defaults[param.key] = param.default;
    });
    setParamValues(defaults);
    setMotionPaused(false);
    window.addEventListener('hashchange', selectView);
    return () => window.removeEventListener('hashchange', selectView);
  }, [def, id]);

  if (!def) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink">
        <h1 ref={titleRef} tabIndex={-1} className="text-xl font-bold mb-4 font-display">パターンが見つかりません</h1>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">ホームへ</button>
      </div>
    );
  }

  const relatedKnowledge = relatedEntries;
  const kind = getPatternKind(def);
  const kindLabel = patternKindLabels[kind];

  const handleParamChange = (key: string, value: number) => {
    setParamValues(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = async (text: string) => {
    setCopyStatus('idle');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access unavailable');
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      window.location.assign('/browse');
    }
  };

  const values = { ...Object.fromEntries(def.params.map(param => [param.key, param.default])), ...paramValues };
  const code = def.generateCode(values);
  const prompt = [def.generatePrompt(values), patternSelectionBrief(def.id)].join('\n\n');
  const rightsStatus = patternRights[def.id]?.status ?? 'UNCLEAR';
  const activeCopyText = activeTab === 'prompt' ? prompt : code;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-40 md:static flex items-center bg-paper/90 backdrop-blur-md p-4 pb-2 border-b border-ink-border justify-between">
        <button
          onClick={handleBack}
          className="text-ink flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
          aria-label="戻る"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 ref={titleRef} tabIndex={-1} className="text-ink text-base font-bold leading-tight tracking-tight flex-1 text-center px-2 font-display">
          {def.title}
        </h1>
        <div className="size-10" aria-hidden="true" />
      </div>

      <DetailNavigation />
      <div className="flex-1 flex min-w-0 flex-col">
        <section id="visual" className="p-4">
          <div className={`relative w-full ${kind === 'style' || kind === 'layout' ? 'min-h-[280px] pt-6 pb-16' : 'aspect-[4/3]'} rounded-2xl bg-surface border border-ink-border flex flex-col items-center justify-center overflow-hidden group inset-shadow-sm`}>
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>
            <div className="relative z-10 w-full flex items-center justify-center px-3">
              <def.Preview values={values} paused={motionPaused} />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex p-1 rounded-xl bg-paper/90 border border-ink-border shadow-paper backdrop-blur-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ink-muted">
                <span className="flex size-2 rounded-full bg-green-500"></span>
                プレビュー
              </div>
            </div>
          </div>
          {def.continuousMotion && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <button type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}
                className="px-3 py-2.5 border border-ink-border rounded-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                プレビューの動きを一時停止
              </button>
              <span role="status" className="text-ink-muted">{motionPaused ? '動きを一時停止しました。' : '端末の設定に合わせて表示しています。'}</span>
            </div>
          )}
        </section>

        <section id="structure" className="px-4 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {kindLabel}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">{def.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {def.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-ink/5 text-[10px] font-medium text-ink/65">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {relatedKnowledge.length > 0 && <section aria-labelledby="related-knowledge-heading" className="mx-4 mb-5 border-t border-ink-border pt-4" lang="ja">
          <h2 id="related-knowledge-heading" className="text-base font-bold">知識ベースの関連企画</h2>
          <ul className="mt-2 space-y-1">{relatedKnowledge.map(item => <li key={item.id}><Link to={`/knowledge/${item.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{item.titleJa}（企画段階）</Link></li>)}</ul>
        </section>}

        <div id="ai-code" className="sticky top-[60px] md:static z-40 bg-paper px-4 border-b border-ink-border">
          <div className="flex justify-between items-end">
            <button
              aria-pressed={activeTab === 'code'} onClick={() => setActiveTab('code')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              コード
            </button>
            <button
              aria-pressed={activeTab === 'prompt'} onClick={() => setActiveTab('prompt')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'prompt' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              AIへの指示文
            </button>
            <button
              aria-pressed={activeTab === 'parameters'} onClick={() => setActiveTab('parameters')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'parameters' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              詳細
            </button>
          </div>
        </div>

        <div className="p-4">
          <p role="status" aria-label="コピー結果" aria-live="polite" className={`text-xs font-semibold mb-2 text-center ${copyStatus === 'error' ? 'text-red-700' : 'text-ink-muted'}`}>
            {copyStatus === 'error' ? 'コピーできませんでした。文章を選択してコピーするか、ブラウザのクリップボード設定を確認してください。' : copyStatus === 'success' ? 'クリップボードにコピーしました。' : ''}
          </p>
          {activeTab === 'code' && (
            <details className="mb-2 text-center text-xs text-ink-muted">
              <summary className="cursor-pointer">コピーしても再利用の許諾は得られません（原文）</summary>
              <p lang="en">No reuse license granted for this code. Copying does not grant rights.</p>
            </details>
          )}
          <button
            title={activeTab === 'prompt' ? 'AIへの指示文をコピー' : 'コードをコピー'}
            onClick={() => handleCopy(activeCopyText)}
            className="w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:active:transform-none bg-primary hover:bg-primary/90 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 border-b-4 border-[rgba(0,0,0,0.2)] active:border-b-0 active:translate-y-[4px]"
          >
            <span aria-hidden="true" className="material-symbols-outlined">content_copy</span>
            {copyStatus === 'success' ? 'コピーしました' : activeTab === 'prompt' ? 'AIへの指示文をコピー' : 'コードをコピー'}
          </button>
        </div>

        {activeTab === 'parameters' && (
          <section className="p-4 space-y-7">
            {def.params.length > 0 ? (
              def.params.map(param => {
                const min = param.min ?? 0;
                const max = param.max ?? 100;
                const value = paramValues[param.key] ?? param.default;
                const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

                return (
                  <div key={param.key} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor={`pattern-param-${param.key}`} className="text-sm font-semibold text-ink flex items-center gap-2">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary text-base">tune</span>
                        {param.label}
                      </label>
                      <span className="text-xs font-mono bg-surface-highlight px-2 py-1 rounded text-primary font-bold border border-ink-border">
                        {value}{param.unit}
                      </span>
                    </div>
                    <div className="relative h-6 flex items-center focus-within:ring-2 focus-within:ring-primary rounded">
                      <div className="absolute left-0 right-0 h-1 bg-ink-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }}></div>
                      </div>
                      <input
                        id={`pattern-param-${param.key}`}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                        max={param.max}
                        min={param.min}
                        step={param.step}
                        type="range"
                        value={value}
                        onChange={e => handleParamChange(param.key, parseFloat(e.target.value))}
                        aria-label={param.label}
                      />
                      <div
                        className="absolute top-1/2 w-4 h-4 bg-paper rounded-full border-2 border-primary shadow-xs z-0 pointer-events-none"
                        style={{
                          left: `${percent}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-ink-border bg-surface/30 p-4 text-sm text-ink-muted">
                このパターンには調整できる項目がありません。
              </div>
            )}

            {patternGuides[def.id] && (
              <div className="border-t border-ink-border pt-6 space-y-4">
                <h2 className="text-lg font-bold font-display">このパターンの使い方</h2>
                <PatternUsage guide={patternGuides[def.id]} id={def.id} />
                <Link to="/guide" className="inline-block text-sm text-ink underline underline-offset-4 py-2 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">使い方ガイドを読む</Link>
              </div>
            )}

            <div className="h-px bg-ink-border my-2"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">speed</span>
                  描画性能
                </div>
                <span className="text-sm font-semibold text-ink">未計測</span>
                <p className="text-[10px] text-ink-muted leading-tight">
                  {def.performanceNotes ?? '組み込み先の画面と端末で描画の負荷を確認してください。'}
                </p>
              </div>
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">accessibility_new</span>
                  アクセシビリティ
                </div>
                <span className="text-sm font-semibold text-ink">未監査</span>
                <p className="text-[10px] text-ink-muted leading-tight">
                  {def.a11yNotes ?? '実際の画面で、動きを減らす設定、フォーカスの見やすさ、コントラストを確認してください。'}
                </p>
              </div>
            </div>

            {def.responsiveNotes && (
              <div className="rounded-xl border border-ink-border bg-surface/30 p-4">
                <div className="text-xs font-bold text-ink mb-1 flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-base">devices</span>
                  画面幅に応じた調整
                </div>
                <p className="text-xs leading-relaxed text-ink-muted">{def.responsiveNotes}</p>
              </div>
            )}

            {def.source && (
              <div className="rounded-xl border border-ink-border p-4">
                <div className="text-xs font-bold text-ink mb-1">出典・着想</div>
                {def.source.url ? (
                  <a href={def.source.url} className="text-xs text-primary font-medium hover:underline" target="_blank" rel="noreferrer">
                    {def.source.label}
                  </a>
                ) : (
                  <p lang="en" className="text-xs text-ink-muted">{def.source.label}</p>
                )}
                {def.source.note && <p lang="en" className="text-[11px] leading-relaxed text-ink-muted mt-1">{def.source.note}</p>}
              </div>
            )}

            <div role="note" className="rounded-xl border border-ink-border bg-surface/50 p-3 text-xs leading-relaxed text-ink">
              <details><summary className="cursor-pointer font-semibold">このコードの再利用は許諾されていません。コピーしても、利用・改変・再配布の許可は得られません。（原文）</summary>
                <p lang="en"><strong>Reuse rights: {rightsStatus}.</strong> This pattern is not currently licensed for reuse. Copying text does not grant permission to use, modify, or redistribute it.</p>
              </details>
              <Link to="/licenses" className="text-primary underline underline-offset-2">権利の確認状況と適用範囲を見る</Link>
            </div>
          </section>
        )}

        {activeTab === 'code' && (
          <section className="p-4">
            <div role="note" className="mb-3 rounded-lg border border-ink-border bg-surface/50 p-3 text-xs leading-relaxed text-ink">
              <details><summary className="cursor-pointer font-semibold">コードの再利用許諾は未確認です。コピーは、表示中の文字列をクリップボードに転送する操作です。（原文）</summary>
                <p lang="en"><strong>Reuse permission not verified ({rightsStatus}).</strong> Copy code transfers the displayed text to your clipboard only; it is not a license grant.</p>
              </details>
              <Link to="/licenses" className="text-primary underline underline-offset-2">権利・利用条件を読む</Link>
            </div>
            <div className="bg-[#2e2b29] p-4 rounded-xl border border-ink-border inset-shadow-sm relative group">
              <pre className="text-xs font-mono text-[#fbf2e5] overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
                {code}
              </pre>
            </div>
          </section>
        )}

        {activeTab === 'prompt' && (
          <section className="p-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-ink-border shadow-xs relative">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 font-display">ChatGPT / Codex / Claude / v0</h3>
              <p className="text-sm text-ink leading-relaxed font-mono whitespace-pre-wrap break-words">{prompt}</p>
            </div>
          </section>
        )}
      </div>

    </div>
  );
};

export default PatternDetail;

