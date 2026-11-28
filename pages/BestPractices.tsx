import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { definitions } from '../data/definitions';
import { patternGuides } from '../data/pattern-guides';
import { patternRights } from '../data/pattern-rights';
import PatternUsage from '../components/PatternUsage';

const reducedMotionSnippet = `/* セレクターは、自分の画面で動きを抑えたい装飾要素に合わせます。 */
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
  { label: 'MDN の prefers-reduced-motion 解説（英語）', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
  { label: 'W3C「一時停止、停止、非表示」の解説（英語）', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html' },
  { label: 'W3C のスイッチ実装例（英語）', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/' },
  { label: 'web.dev の CSS アニメーション実装ガイド（英語）', url: 'https://web.dev/articles/animations-guide' },
  { label: 'MDN の will-change 解説（英語）', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/will-change' },
];

const linkClass = 'text-ink underline underline-offset-4 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink';

const BestPractices: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copying, setCopying] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const guides = Object.entries(patternGuides).filter(([id]) => Boolean(definitions[id]));

  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus({ preventScroll: true });
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
      <header className="bg-paper/95 border-b border-ink-border px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/browse" className={linkClass}>パターン一覧へ</Link>
      </header>

      <article className="mx-auto w-full max-w-prose px-5 pt-8 pb-8 text-sm leading-relaxed text-ink-muted min-w-0">
        <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-3">プレビューから実装へ</p>
        <h1 ref={titleRef} tabIndex={-1} className="text-3xl leading-tight font-bold font-display text-ink mb-4">UIパターンの使い方</h1>
        <p className="text-base">画面で実現したい操作を決め、プレビューで動作を試せます。コードやAIへの指示文を自分のページに取り入れる前に、権利と第三者素材の利用条件を確認してください。</p>
        <p className="mt-4">コードの再利用が許諾されているのは全{Object.keys(patternRights).length}件中{Object.values(patternRights).filter(rights => rights.grantActive).length}件です。コードの閲覧やコピーによって、利用・改変・再配布する権利は得られません。 <Link to="/licenses" className={linkClass}>各パターンの利用条件を確認する</Link></p>

        <section aria-labelledby="reuse-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="reuse-heading" className="text-xl font-bold font-display text-ink mb-4">利用条件を確認してから、作例を試す</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li><strong className="text-ink">権利を確認する。</strong>以下は動作を確かめる手順です。自分のページに組み込むには、個別に必要な許諾を得てください。</li>
            <li><strong className="text-ink">目的を決める。</strong>ボタンを押した手応え、読み込み中の表示、記事の読みやすさなど、場面に合う作例を選びます。</li>
            <li><strong className="text-ink">詳細を読む。</strong>コードの形式、組み込み方、調整できる値、使うときの制約を確認します。</li>
            <li><strong className="text-ink">値を一つ変える。</strong>プレビューと生成されたコードや指示文を見比べ、必要なものをコピーします。</li>
            <li><strong className="text-ink">単体で動かす。</strong>HTML例はCSSを含みます。展開式のフローティングボタンはスクリプトも使います。傾くガラスカードは、JSXをコンパイルできるReact環境で試してください。</li>
            <li><strong className="text-ink">実際の画面で確かめる。</strong>見本の文章を差し替え、操作をアプリにつなぎます。キーボード、タッチ、狭い画面、動きを減らす設定で確認してください。</li>
          </ol>
          <p className="mt-4">AIへの指示文は、作りたいパターンの説明です。生成されたコードも内容を読み、実際に動かして確認します。</p>
        </section>

        <section aria-labelledby="context-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="context-heading" className="text-xl font-bold font-display text-ink mb-4">実際のページで確かめること</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink mb-2">読み込みが終わったら結果を表示する</h3>
              <p>仮表示は後から入る内容とおおよその形をそろえ、通信を待っている間だけ表示します。読み上げ通知は一度にし、取得後は内容、該当なしの案内、または再試行できるエラーに切り替えます。</p>
              <p className="mt-3">光が横切る速さは残り時間を表しません。動きを止める操作を残し、一時停止中でも結果が届けば表示を更新します。</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">カードを傾けなくても内容を読めるようにする</h3>
              <p>傾きは装飾です。小さな角度から試し、ぼかしを加える前に、実際の背景で静止したカードを読めるか確かめます。一時停止すると自動の動きとポインターに応じた傾きの両方が止まります。</p>
              <p className="mt-3">コピーされるカードには画像の役割が設定されています。リンクやボタンを追加するときは役割を見直し、キーボードでも操作できる構造にしてください。</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">日英の文章で記事の組み方を比べる</h3>
              <p>太い枠と影を使う作例は見出しの強調に、本文と補足を分ける作例は出典や日付を添えるときに使えます。実際に使う長い見出しや出典名を入れて余白を調整します。</p>
              <p className="mt-3">言語属性と読み順を保ち、単体で開いたページの幅を変えて段組みを確認します。設定の異なる例を並べるときは、それぞれに調整値を指定します。</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="choose-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="choose-heading" className="text-xl font-bold font-display text-ink mb-3">パターン別の使い方</h2>
          <p className="mb-4">名前を開くと、使いどころや制約を読めます。各パターンの詳細で値を調整し、生成結果を試せます。</p>
          <div className="divide-y divide-ink-border">
            {guides.map(([id, guide]) => (
              <details key={id} data-pattern-guide={id} className="py-4">
                <summary className="cursor-pointer rounded-xs font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                  {definitions[id].title}
                  <span className="block pl-4 mt-1 text-xs font-normal text-ink-muted">{guide.codeFormat}</span>
                </summary>
                <div className="mt-4 pl-4 space-y-4">
                  <PatternUsage guide={guide} id={id} />
                  <Link to={`/p/${id}`} className={`${linkClass} inline-block py-2`}>{definitions[id].title}の詳細を見る</Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="motion-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="motion-heading" className="text-xl font-bold font-display text-ink mb-3">動きを減らす設定に対応する</h2>
          <p><code>prefers-reduced-motion</code> で端末の設定に応じて装飾的な動きを抑えます。静止した状態でも、内容と状態の変化が伝わるようにしてください。</p>
          <p className="mt-3">対象は装飾要素に絞ります。変形を一律に解除すると、位置や開閉状態の表示まで変わることがあります。</p>
          <pre className="mt-4 bg-ink text-paper p-4 rounded-lg text-xs whitespace-pre-wrap break-words leading-relaxed"><code>{reducedMotionSnippet}</code></pre>
          <button type="button" onClick={copySnippet} disabled={copying}
            className="mt-3 px-4 py-3 rounded-lg border border-ink-border font-semibold text-ink hover:bg-ink/5 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
            {copying ? 'コピー中…' : '動きを減らすCSS例をコピー'}
          </button>
          <p role="status" aria-live="polite" className="mt-2 min-h-5">
            {copyStatus === 'success' ? 'CSS例をコピーしました。' : copyStatus === 'error' ? 'コピーできませんでした。上のコードを選択してコピーするか、ブラウザのクリップボード設定を確認してください。' : ''}
          </p>
          <p className="mt-3">このガイドのCSS例は、18件のパターン別権利記録の対象外です。再利用の権利は独立した確認を受けておらず、コピーによって利用や再配布が許諾されることはありません。<Link to="/licenses" className={linkClass}>権利・利用条件を読む</Link></p>
          <p className="mt-3">セレクターは自分の要素に合わせます。JavaScriptで動きを制御する場合は、その処理でも端末の設定を確認してください。</p>
          <p className="mt-3">ほかの内容と一緒に表示され、自動で始まり5秒を超えて続く動きが本質的に必要でなければ、一時停止、停止、または非表示にする手段を用意します。動きを減らす設定への対応だけでアクセシビリティへの適合は判断できません。</p>
          <p className="mt-3">読み込み表示、グリッチ文字、傾くガラスカードは、生成コードにも一時停止の操作を含みます。プレビューで止めてもコピーするコードは変わりません。両方で動作を試してください。</p>
        </section>

        <section aria-labelledby="controls-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="controls-heading" className="text-xl font-bold font-display text-ink mb-3">見た目と操作を一致させる</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>操作にはボタン、移動にはリンクを使い、入力欄にはラベルを付けます。アイコンだけのボタンにも操作名を付けてください。</li>
            <li>フォーカスを見える状態に保ち、部品に応じてTab、Enter、スペースキーで試します。</li>
            <li>スイッチのラベルには設定名を使い、オン・オフを切り替えても名前を保ちます。設定の保存はアプリ側で実装します。</li>
            <li>読み込み後は内容やエラーの案内に切り替え、見本の操作名には実際の処理を結び付けます。</li>
            <li>狭い画面や文字を拡大した状態で、折り返し、読み順、押しやすさを確認します。固定した要素が本文やフォーカスを隠していないかも確かめます。</li>
          </ul>
        </section>

        <section aria-labelledby="performance-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="performance-heading" className="text-xl font-bold font-display text-ink mb-3">実際の画面で描画の負荷を測る</h2>
          <p>移動やフェードには、まず <code>transform</code> と <code>opacity</code> を試します。レイアウトの再計算を避けられる場合がありますが、GPUの使用や一定のフレームレートを保証するものではありません。</p>
          <p className="mt-3">幅や高さを変えると再配置が必要になり、影やぼかしは描画や合成の負荷を増やすことがあります。複数の効果を使う場合は、ブラウザの開発者ツールで実際の画面を計測します。</p>
          <p className="mt-3"><code>will-change</code> は計測で必要性を確かめてから使ってください。レイヤーを保持し続けるとリソースを消費します。</p>
          <p className="mt-3 font-semibold text-ink">これらは設計時の確認事項です。Fragmentaでは、作例の性能スコアの実測やアクセシビリティの認証は行っていません。</p>
        </section>

        <section aria-labelledby="references-heading" className="mt-9 border-t border-ink-border pt-6">
          <h2 id="references-heading" className="text-xl font-bold font-display text-ink mb-3">参考資料</h2>
          <ul className="space-y-3">
            {sources.map(source => (
              <li key={source.url}><a href={source.url} className={linkClass} target="_blank" rel="noreferrer">{source.label}<span className="sr-only">（新しいタブで開きます）</span></a></li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
};

export default BestPractices;
