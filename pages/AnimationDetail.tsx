import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { definitions, getPatternKind } from '../data/definitions';
import { patternGuides } from '../data/pattern-guides';
import PatternUsage from '../components/PatternUsage';

const kindLabels = {
  motion: 'Motion',
  interaction: 'Interaction',
  style: 'Style',
  component: 'Component',
  layout: 'Layout',
  'text-effect': 'Text & Effects',
} as const;

const PatternDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'code' | 'prompt' | 'parameters'>('parameters');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const def = id ? definitions[id] : null;
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!def) return;

    const defaults: Record<string, number> = {};
    def.params.forEach(param => {
      defaults[param.key] = param.default;
    });
    setParamValues(defaults);
    setMotionPaused(false);
  }, [def]);

  if (!def) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink">
        <h1 className="text-xl font-bold mb-4 font-display">Pattern not found</h1>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">Go home</button>
      </div>
    );
  }

  const kind = getPatternKind(def);
  const kindLabel = kindLabels[kind];

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
      navigate('/');
    }
  };

  const values = { ...Object.fromEntries(def.params.map(param => [param.key, param.default])), ...paramValues };
  const code = def.generateCode(values);
  const prompt = def.generatePrompt(values);
  const activeCopyText = activeTab === 'prompt' ? prompt : code;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-50 flex items-center bg-paper/90 backdrop-blur-md p-4 pb-2 border-b border-ink-border justify-between">
        <button
          onClick={handleBack}
          className="text-ink flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-ink text-base font-bold leading-tight tracking-tight flex-1 text-center truncate px-2 font-display">
          {def.title}
        </h1>
        <div className="size-10" aria-hidden="true" />
      </div>

      <main className="flex-1 flex flex-col pb-24">
        <section className="p-4">
          <div className={`relative w-full ${kind === 'style' || kind === 'layout' ? 'min-h-[280px] pt-6 pb-16' : 'aspect-[4/3]'} rounded-2xl bg-surface border border-ink-border flex flex-col items-center justify-center overflow-hidden group shadow-inner`}>
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>
            <div className="relative z-10 w-full flex items-center justify-center px-3">
              <def.Preview values={values} paused={motionPaused} />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex p-1 rounded-xl bg-paper/90 border border-ink-border shadow-paper backdrop-blur-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ink-muted">
                <span className="flex size-2 rounded-full bg-green-500"></span>
                Live preview
              </div>
            </div>
          </div>
          {def.continuousMotion && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <button type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}
                className="px-3 py-2.5 border border-ink-border rounded-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                Pause preview motion
              </button>
              <span role="status" className="text-ink-muted">{motionPaused ? 'Motion paused.' : 'Motion follows your device preference.'}</span>
            </div>
          )}
        </section>

        <section className="px-4 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {kindLabel}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink/45">
              {def.category}
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

        <div className="sticky top-[60px] z-40 bg-paper px-4 border-b border-ink-border">
          <div className="flex justify-between items-end">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'prompt' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              AI prompt
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'parameters' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              Details
            </button>
          </div>
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
                        <span className="material-symbols-outlined text-primary text-base">tune</span>
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
                        className="absolute top-1/2 w-4 h-4 bg-paper rounded-full border-2 border-primary shadow-sm z-0 pointer-events-none"
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
                This pattern has no adjustable parameters yet.
              </div>
            )}

            {patternGuides[def.id] && (
              <div className="border-t border-ink-border pt-6 space-y-4">
                <h2 className="text-lg font-bold font-display">Using this pattern</h2>
                <PatternUsage guide={patternGuides[def.id]} />
                <Link to="/guide" className="inline-block text-sm text-ink underline underline-offset-4 py-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">Read the reuse guide</Link>
              </div>
            )}

            <div className="h-px bg-ink-border my-2"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="material-symbols-outlined text-sm">speed</span>
                  Performance
                </div>
                <span className="text-sm font-semibold text-ink">Not measured</span>
                <p className="text-[10px] text-ink-muted leading-tight">
                  {def.performanceNotes ?? 'Designed to keep rendering work lightweight.'}
                </p>
              </div>
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="material-symbols-outlined text-sm">accessibility_new</span>
                  Accessibility
                </div>
                <span className="text-sm font-semibold text-ink">Not audited</span>
                <p className="text-[10px] text-ink-muted leading-tight">
                  {def.a11yNotes ?? 'Check motion preferences, focus visibility, and contrast in context.'}
                </p>
              </div>
            </div>

            {def.responsiveNotes && (
              <div className="rounded-xl border border-ink-border bg-surface/30 p-4">
                <div className="text-xs font-bold text-ink mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">devices</span>
                  Responsive notes
                </div>
                <p className="text-xs leading-relaxed text-ink-muted">{def.responsiveNotes}</p>
              </div>
            )}

            {def.source && (
              <div className="rounded-xl border border-ink-border p-4">
                <div className="text-xs font-bold text-ink mb-1">Source / inspiration</div>
                {def.source.url ? (
                  <a href={def.source.url} className="text-xs text-primary font-medium hover:underline" target="_blank" rel="noreferrer">
                    {def.source.label}
                  </a>
                ) : (
                  <p className="text-xs text-ink-muted">{def.source.label}</p>
                )}
                {def.source.note && <p className="text-[11px] leading-relaxed text-ink-muted mt-1">{def.source.note}</p>}
              </div>
            )}

            <p className="text-xs text-ink-muted">License not specified. Confirm permission before reusing code.</p>
          </section>
        )}

        {activeTab === 'code' && (
          <section className="p-4">
            <div className="bg-[#2e2b29] p-4 rounded-xl border border-ink-border shadow-inner relative group">
              <button
                onClick={() => handleCopy(code)}
                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
                title="Copy code"
                aria-label="Copy code"
              >
                <span className="material-symbols-outlined text-lg">{copyStatus === 'success' ? 'check' : 'content_copy'}</span>
              </button>
              <pre className="text-xs font-mono text-[#fbf2e5] overflow-x-auto whitespace-pre-wrap leading-relaxed pr-8">
                {code}
              </pre>
            </div>
          </section>
        )}

        {activeTab === 'prompt' && (
          <section className="p-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-ink-border shadow-sm relative">
              <button
                onClick={() => handleCopy(prompt)}
                className="absolute top-3 right-3 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                title="Copy AI prompt"
                aria-label="Copy AI prompt"
              >
                <span className="material-symbols-outlined text-lg">{copyStatus === 'success' ? 'check' : 'content_copy'}</span>
              </button>
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 font-display">ChatGPT / Codex / Claude / v0</h3>
              <p className="text-sm text-ink leading-relaxed font-mono whitespace-pre-wrap pr-8">{prompt}</p>
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-paper via-paper to-transparent z-50">
        <p role="status" aria-live="polite" className={`text-xs font-semibold mb-2 text-center ${copyStatus === 'error' ? 'text-red-700' : 'text-ink-muted'}`}>
          {copyStatus === 'error' ? 'Copy failed. Check clipboard permissions or select and copy the text manually.' : copyStatus === 'success' ? 'Copied to clipboard.' : ''}
        </p>
        <button
          onClick={() => handleCopy(activeCopyText)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 border-b-4 border-[rgba(0,0,0,0.2)] active:border-b-0 active:translate-y-[4px]"
        >
          <span className="material-symbols-outlined">content_copy</span>
          {copyStatus === 'success' ? 'Copied!' : activeTab === 'prompt' ? 'Copy AI prompt' : 'Copy code'}
        </button>
      </div>
    </div>
  );
};

export default PatternDetail;
