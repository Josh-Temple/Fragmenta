import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { definitions } from '../data/definitions';
import { patternGuides } from '../data/pattern-guides';
import { patternRights } from '../data/pattern-rights';
import PatternUsage from '../components/PatternUsage';

const reducedMotionSnippet = `/* Adapt these selectors to your component's decorative elements. */
@media (prefers-reduced-motion: reduce) {
  .pattern-decoration,
  .pattern-decoration::before,
  .pattern-decoration::after {
    animation: none;
    transition: none;
    transform: none;
  }
}`;

const sources = [
  { label: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
  { label: 'W3C: Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html' },
  { label: 'W3C: Switch pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/' },
  { label: 'web.dev: CSS animation performance', url: 'https://web.dev/articles/animations-guide' },
  { label: 'MDN: will-change', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/will-change' },
];

const linkClass = 'text-ink underline underline-offset-4 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink';

const BestPractices: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copying, setCopying] = useState(false);
  const guides = Object.entries(patternGuides).filter(([id]) => Boolean(definitions[id]));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timer = window.setTimeout(() => setCopyStatus('idle'), 5000);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const copySnippet = async () => {
    setCopyStatus('idle');
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(reducedMotionSnippet);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-50 bg-paper/95 border-b border-ink-border px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/browse" className={linkClass}>Browse patterns</Link>
        <span className="font-mono text-xs text-ink-muted">GUIDE</span>
      </header>

      <article className="px-5 pt-8 pb-28 text-sm leading-relaxed text-ink-muted min-w-0">
        <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-3">From preview to implementation</p>
        <h1 className="text-3xl leading-tight font-bold font-display text-ink mb-4">Explore and assess a UI pattern</h1>
        <p className="text-base">Start with the interface task and inspect the example. Check rights and third-party conditions before adapting any copied code or prompt for your own page.</p>
        <p className="mt-4">Active pattern code reuse licenses: {Object.values(patternRights).filter(rights => rights.grantActive).length} of {Object.keys(patternRights).length}. Copying or previewing code does not grant permission to use, modify, or redistribute it. <Link to="/licenses" className={linkClass}>Check rights for each pattern.</Link></p>

        <section aria-labelledby="reuse-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="reuse-heading" className="text-xl font-bold font-display text-ink mb-4">Evaluate first, integrate only with permission</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li><strong className="text-ink">Check permissions.</strong> Inspect the individual rights status. The steps below describe technical evaluation; only integrate a pattern when you have the necessary permission.</li>
            <li><strong className="text-ink">Choose the task.</strong> Pick a control, a loading appearance, a decorative effect, a visual style, or a reading layout.</li>
            <li><strong className="text-ink">Inspect Details.</strong> Check the code format, integration steps, parameters, and limitations.</li>
            <li><strong className="text-ink">Adjust one value.</strong> Compare the live example with the generated code or prompt, then copy the output you need.</li>
            <li><strong className="text-ink">Run it separately.</strong> HTML examples include their own CSS; Morph FAB also includes a script. Glass Tilt requires a React project that compiles JSX.</li>
            <li><strong className="text-ink">Adapt and verify.</strong> Replace sample content, connect real application state, and check the complete result with keyboard, touch, narrow screens, and motion preferences.</li>
          </ol>
          <p className="mt-4">An AI prompt describes the intended pattern. Review and test the code produced from it just as you would handwritten code.</p>
        </section>

        <section aria-labelledby="context-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="context-heading" className="text-xl font-bold font-display text-ink mb-4">Use the examples in a real page</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink mb-2">A loading region that finishes</h3>
              <p>Use Smart Skeleton only while the request is pending. Keep its rough shape close to the content that will replace it, and announce loading once. Finish with the actual content, a meaningful empty result, or an error with a recovery action.</p>
              <p className="mt-3">The shimmer speed is not a countdown. Keep the copied Pause shimmer control available; a paused placeholder still needs to be replaced when the request ends.</p>
              <p lang="ja" className="mt-3">読み込み中の見た目と、通信の状態管理は別です。成功・空の結果・失敗のどの場合でも、プレースホルダーを実際の結果へ置き換えます。</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">A decorative card without hidden actions</h3>
              <p>Use Glass Tilt when depth is optional. Keep essential information available without pointer movement, start with a smaller tilt, and compare the paused card on the real background before adding blur.</p>
              <p className="mt-3">The copied card is a decorative image example. If you put links or buttons inside it, replace the image role with suitable structure and check keyboard access. Its pause checkbox stops both idle and pointer-driven motion.</p>
              <p lang="ja" className="mt-3">傾きは装飾です。操作や重要な情報をホバーの中に隠さず、動きを止めた状態でも使えることを確認します。</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">An editorial note in two languages</h3>
              <p>Use Warm Editorial for visual emphasis and Editorial Split for the relationship between context and the main text. Both include English and Japanese sample paragraphs. Replace them with your longest realistic heading and source label before judging spacing.</p>
              <p className="mt-3">Keep language attributes and logical source order. The generated layout changes at a viewport breakpoint; inspect the standalone page at both narrow and wide widths. Parameters belong to each instance so different settings can coexist.</p>
              <p lang="ja" className="mt-3">短い仮の文章だけで余白を決めず、長い見出し・出典名・日本語の本文を入れて確認します。</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="choose-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="choose-heading" className="text-xl font-bold font-display text-ink mb-3">Choose from the current patterns</h2>
          <p className="mb-4">Each example has a different role. Open one for adjustable values and generated output.</p>
          <div className="divide-y divide-ink-border">
            {guides.map(([id, guide]) => (
              <details key={id} className="py-4">
                <summary className="cursor-pointer rounded-xs font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                  {definitions[id].title}
                  <span className="block pl-4 mt-1 text-xs font-normal text-ink-muted">{guide.codeFormat}</span>
                </summary>
                <div className="mt-4 pl-4 space-y-4">
                  <PatternUsage guide={guide} id={id} />
                  <Link to={`/p/${id}`} className={`${linkClass} inline-block py-2`}>Open {definitions[id].title}</Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="motion-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="motion-heading" className="text-xl font-bold font-display text-ink mb-3">Keep motion optional</h2>
          <p>Use <code>prefers-reduced-motion</code> to remove, reduce, or replace non-essential movement when the user requests it. Keep the content and state change understandable when animation is disabled.</p>
          <p className="mt-3">Scope the rule to decorative elements. A blanket reset of every transform can break positioning or functional state changes.</p>
          <pre className="mt-4 bg-ink text-paper p-4 rounded-lg text-xs whitespace-pre-wrap break-words leading-relaxed"><code>{reducedMotionSnippet}</code></pre>
          <button type="button" onClick={copySnippet} disabled={copying}
            className="mt-3 px-4 py-3 rounded-lg border border-ink-border font-semibold text-ink hover:bg-ink/5 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
            {copying ? 'Copying…' : 'Copy reduced-motion example'}
          </button>
          <p role="status" aria-live="polite" className="mt-2 min-h-5">
            {copyStatus === 'success' ? 'Example copied.' : copyStatus === 'error' ? 'Copy failed. Select the code above and copy it manually, or check clipboard permissions.' : ''}
          </p>
          <p className="mt-3">This standalone guide snippet is not included in the 18 pattern rights records. Its reuse rights have not been independently verified; copying it does not grant permission to use or redistribute it. <Link to="/licenses" className={linkClass}>Review licensing information.</Link></p>
          <p className="mt-3">This is an adaptation example: rename its selectors for your component. For JavaScript-driven motion, also check the preference in the motion logic.</p>
          <p className="mt-3">For non-essential moving content that starts automatically, lasts more than five seconds, and appears alongside other content, provide a pause, stop, or hide mechanism. Reduced-motion handling alone does not establish accessibility conformance.</p>
          <p className="mt-3">Smart Skeleton, Glitch Text, and Glass Tilt now include pause controls in their copied output. Details also offers Pause preview motion. Check both versions: pausing the gallery does not change the code you copy.</p>
        </section>

        <section aria-labelledby="controls-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="controls-heading" className="text-xl font-bold font-display text-ink mb-3">Connect appearance to real behavior</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>Use buttons for actions, links for navigation, and labels for form inputs. Give icon-only controls an accessible name.</li>
            <li>Keep focus visible. Check Tab, Enter, and Space as appropriate for the control, rather than testing pointer clicks alone.</li>
            <li>Give a switch a stable setting label and an on/off state. Its animation does not implement preference storage.</li>
            <li>Replace loading placeholders with content or a useful error. Example action labels are not working application features.</li>
            <li>On small screens and with larger text, check wrapping, reading order, target size, and whether sticky or fixed controls cover content.</li>
          </ul>
        </section>

        <section aria-labelledby="performance-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="performance-heading" className="text-xl font-bold font-display text-ink mb-3">Measure performance in context</h2>
          <p>For movement and fades, start with <code>transform</code> and <code>opacity</code>. They can avoid layout work, but do not guarantee GPU acceleration or a particular frame rate.</p>
          <p className="mt-3">Changing dimensions can trigger layout; shadows, filters, and blur can add paint or compositing work. Record the actual page in browser performance tools, especially when several effects run together.</p>
          <p className="mt-3">Use <code>will-change</code> only when a measured problem justifies it. Persistent layers can consume resources; the property is not a default speed improvement.</p>
          <p className="mt-3 font-semibold text-ink">These notes are design guidance. Fragmenta does not provide measured performance scores or an accessibility certification for these examples.</p>
        </section>

        <section aria-labelledby="references-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="references-heading" className="text-xl font-bold font-display text-ink mb-3">Further reading</h2>
          <ul className="space-y-3">
            {sources.map(source => (
              <li key={source.url}><a href={source.url} className={linkClass} target="_blank" rel="noreferrer">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
            ))}
          </ul>
        </section>
      </article>

      <nav aria-label="Guide navigation" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-paper/95 border-t border-ink-border px-5 py-4 flex justify-between gap-3 z-50">
        <Link to="/" className={linkClass}>Home</Link>
        <Link to="/browse" className={linkClass}>Browse</Link>
        <Link to="/guide" className={linkClass} aria-current="page">Guide</Link>
        <Link to="/licenses" className={linkClass}>License</Link>
      </nav>
    </div>
  );
};

export default BestPractices;
