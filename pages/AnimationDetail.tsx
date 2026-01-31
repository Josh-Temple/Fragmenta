import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { definitions } from '../data/definitions';

const AnimationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'code' | 'prompt' | 'parameters'>('parameters');
  const [copied, setCopied] = useState(false);
  
  // Load definition
  const def = id ? definitions[id] : null;

  // Generic State for parameters
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  // Initialize defaults when definition loads
  useEffect(() => {
    if (def) {
      const defaults: Record<string, number> = {};
      def.params.forEach(p => {
        defaults[p.key] = p.default;
      });
      setParamValues(defaults);
    }
  }, [def]);

  // Handle missing definition
  if (!def) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink">
        <h1 className="text-xl font-bold mb-4 font-display">Animation Not Found</h1>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">Go Home</button>
      </div>
    );
  }

  const handleParamChange = (key: string, value: number) => {
    setParamValues(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    // Robust back navigation: check if history exists, otherwise fallback to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const code = def.generateCode(paramValues);
  const prompt = def.generatePrompt(paramValues);

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Header */}
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
        <div className="flex items-center gap-2">
          <button className="text-ink flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 transition-colors">
            <span className="material-symbols-outlined text-[24px]">bookmark_border</span>
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col pb-24">
        {/* Preview Section */}
        <section className="p-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-surface border border-ink-border flex flex-col items-center justify-center overflow-hidden group shadow-inner">
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>
            
            {/* Live Preview Element */}
            <div className="relative z-10">
              <def.Preview values={paramValues} />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex p-1 rounded-xl bg-paper/90 border border-ink-border shadow-paper backdrop-blur-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ink-muted">
                <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Preview
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
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
              AI Prompt
            </button>
            <button 
              onClick={() => setActiveTab('parameters')}
              className={`flex-1 pb-3 pt-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'parameters' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              Parameters
            </button>
          </div>
        </div>

        {/* Parameters Content */}
        {activeTab === 'parameters' && (
          <section className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Dynamic Controls Generation */}
            {def.params.map((param) => (
              <div key={param.key} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-ink flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">
                      {param.key.includes('time') || param.key.includes('dur') || param.key.includes('speed') ? 'timer' : 
                       param.key.includes('lift') ? 'arrow_upward' : 'tune'}
                    </span>
                    {param.label}
                  </label>
                  <span className="text-xs font-mono bg-surface-highlight px-2 py-1 rounded text-primary font-bold border border-ink-border">
                    {paramValues[param.key]}{param.unit}
                  </span>
                </div>
                <div className="relative h-6 flex items-center">
                  <div className="absolute left-0 right-0 h-1 bg-ink-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ 
                        width: `${((paramValues[param.key] - (param.min || 0)) / ((param.max || 100) - (param.min || 0))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <input 
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10" 
                    max={param.max} min={param.min} step={param.step} type="range" 
                    value={paramValues[param.key] || param.default}
                    onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-paper rounded-full border-2 border-primary shadow-sm z-0 pointer-events-none transition-all" 
                    style={{ 
                      left: `${((paramValues[param.key] - (param.min || 0)) / ((param.max || 100) - (param.min || 0))) * 100}%`, 
                      transform: 'translate(-50%, -50%)' 
                    }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="h-px bg-ink-border my-6"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="material-symbols-outlined text-sm">speed</span>
                  Performance
                </div>
                <span className="text-lg font-bold text-accent">{def.performanceScore}/100</span>
                <p className="text-[10px] text-ink-muted leading-tight">Optimized for 60fps.</p>
              </div>
              <div className="bg-surface/30 p-3 rounded-xl border border-ink-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="material-symbols-outlined text-sm">accessibility_new</span>
                  A11y
                </div>
                <span className="text-lg font-bold text-primary">{def.a11yScore}</span>
                <p className="text-[10px] text-ink-muted leading-tight">Reduced motion support.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-ink-muted">License: MIT</p>
              <a className="text-xs text-primary font-medium hover:underline decoration-primary" href="#">View on GitHub</a>
            </div>
          </section>
        )}
        
        {/* Code Tab */}
        {activeTab === 'code' && (
          <section className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-[#2e2b29] p-4 rounded-xl border border-ink-border shadow-inner relative group">
                 <button 
                    onClick={() => handleCopy(code)}
                    className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
                    title="Copy Code"
                 >
                    <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                 </button>
                 <pre className="text-xs font-mono text-[#fbf2e5] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{code}
                 </pre>
             </div>
             <p className="text-[10px] text-ink-muted mt-2 text-center">Use utility classes or raw CSS as preferred.</p>
          </section>
        )}

        {/* Prompt Tab */}
        {activeTab === 'prompt' && (
          <section className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-surface/50 p-4 rounded-xl border border-ink-border shadow-sm relative">
                <button 
                    onClick={() => handleCopy(prompt)}
                    className="absolute top-3 right-3 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                    title="Copy Prompt"
                 >
                    <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                 </button>
                 <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 font-display">Claude / ChatGPT / v0</h3>
                 <p className="text-sm text-ink leading-relaxed font-mono whitespace-pre-wrap">
                    {prompt}
                 </p>
             </div>
             <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-ink/5 hover:bg-ink/10 text-xs font-medium text-ink transition-colors">
                    Tailwind Version
                </button>
                <button className="flex-1 py-2 rounded-lg bg-ink/5 hover:bg-ink/10 text-xs font-medium text-ink transition-colors">
                    Framer Motion
                </button>
             </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-paper via-paper to-transparent z-50">
        <button 
            onClick={() => handleCopy(activeTab === 'prompt' ? prompt : code)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 border-b-4 border-[rgba(0,0,0,0.2)] active:border-b-0 active:translate-y-[4px]"
        >
          <span className="material-symbols-outlined">content_copy</span>
          {copied ? 'Copied!' : activeTab === 'prompt' ? 'Copy AI Prompt' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
};

export default AnimationDetail;