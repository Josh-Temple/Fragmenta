import React from 'react';
import { PatternDefinition, PatternCategory, PatternKind } from '../../types';

interface Example {
  id: string;
  title: string;
  description: string;
  category: PatternCategory;
  kind: PatternKind;
  tags: string[];
  html: string;
  css: string;
  guidance: string;
}

// Written for this addition; no third-party templates, fonts, images, or runtime scripts.
// Prefix every selector and fragment target so separate examples can coexist.
export const practicalExamples: Example[] = [
  {
    id: 'inline-validation', title: '入力欄のエラー表示', category: 'input', kind: 'interaction',
    tags: ['フォーム', '入力検証', 'CSS'],
    description: 'メールアドレスの入力条件を欄のそばに常時表示し、編集後に形式の誤りを知らせます。',
    html: `<div class="field"><label for="email">Email address / メールアドレス</label><p id="hint">Required. Use a complete address such as name@example.com.</p><input id="email" type="email" required autocomplete="email" placeholder="name@example.com" aria-describedby="hint error"><p id="error" class="error">Enter a complete email address / メールアドレスを確認してください。</p></div>`,
    css: `.field{max-width:32rem} label{font-weight:700} input{display:block;width:100%;padding:var(--space);border:2px solid #776e61;border-radius:var(--radius);font:inherit;background:#fff;color:#29251f}.error{display:none;color:#922b21}input:user-invalid{border-color:#922b21}input:user-invalid~.error{display:block}`,
    guidance: '自分のフォーム内に組み込みます。アドレスの到達は確認できません。アプリ側でサーバー検証、aria-invalid、エラーの読み上げを実装し、色以外の手掛かりも用意します。古いブラウザでは :user-invalid の装飾が出ない場合があります。',
  },
  {
    id: 'article-table-of-contents', title: '記事の目次', category: 'layout', kind: 'layout',
    tags: ['読書', 'ナビゲーション', '画面幅への対応'],
    description: '見出しに移動する目次を日英の記事に添えます。狭い画面では目次と本文を縦に並べます。',
    html: `<div class="reading"><nav aria-label="Article contents"><strong>On this page</strong><ol><li><a href="#purpose">Purpose</a></li><li><a href="#practice">Practice</a></li><li><a href="#review">Review</a></li></ol></nav><article><h2 id="purpose" tabindex="-1">Start with a question</h2><p>Write the question the reader needs to answer. A useful introduction explains why that question matters.</p><h2 id="practice" tabindex="-1">Make the next step concrete</h2><p lang="ja">読む人が次に何をすればよいか、具体的に示します。前提や条件は、手順の近くに置きます。</p><h2 id="review" tabindex="-1">Review with real content</h2><p>Check each link, heading, and paragraph after replacing the example. Give every section a unique identifier.</p></article></div>`,
    css: `.reading{display:grid;grid-template-columns:minmax(10rem,1fr) minmax(0,3fr);gap:var(--space)}nav{align-self:start;padding:var(--space);background:#eee7db;border-radius:var(--radius)}article{min-width:0}h2{scroll-margin-top:1rem}@media(max-width:600px){.reading{grid-template-columns:1fr}}`,
    guidance: '見出しIDは重複させず、目次リンクも一緒に更新します。閲覧中の節を自動で示す機能は含みません。固定ヘッダーやルーターのあるページで移動先を確認してください。',
  },
  {
    id: 'readable-article', title: '読みやすい記事の組版', category: 'style', kind: 'style',
    tags: ['文字組み', '記事', '読書'],
    description: '一行の長さを抑えた記事に、日本語と英語の段落、引用、出典を配置します。',
    html: `<article><header><p class="eyebrow">FIELD NOTES · 01</p><h2>Make room for the explanation</h2><p class="lead">A clear page gives the main argument enough space to develop.</p></header><p>Start with the point the reader needs. Explain the reason in a connected paragraph, then show a concrete example. Headings should help the reader follow the argument.</p><p lang="ja">結論を先に示し、その理由を説明します。文章を短くするだけでなく、文と文のつながりを明確にすると、内容を追いやすくなります。</p><blockquote><p>Leave enough room for the reader to understand the conditions.</p></blockquote><footer>Source note: illustrative prose written for this example.</footer></article>`,
    css: `article{max-width:62ch;margin-inline:auto}h2{font-family:Georgia,serif;font-size:clamp(1.65rem,5vw,2.6rem);line-height:1.18}.eyebrow,footer{font-size:.8rem;letter-spacing:.06em}.lead{font-size:1.2rem}p{margin-block:var(--space);line-height:1.8}blockquote{margin-inline:0;padding:var(--space);border-left:4px solid #805129;border-radius:var(--radius);background:#eee7db}`,
    guidance: '例文と出典を差し替え、見出しの階層をページに合わせます。実際の日英フォント、長いリンク、文字拡大で確認してください。この作例で扱うのは記事の組版です。',
  },
  {
    id: 'native-faq', title: '開閉できるFAQ', category: 'feedback', kind: 'component',
    tags: ['開閉', 'FAQ', 'HTML'],
    description: 'HTMLの details と summary で質問と回答をまとめ、キーボードでも個別に開閉できます。',
    html: `<section aria-label="Frequently asked questions"><h2>Before you begin</h2><details open><summary>Does this need JavaScript?</summary><p>No. Each question uses the browser’s native disclosure element.</p></details><details><summary>Can more than one answer stay open?</summary><p>Yes. These disclosures are independent, so readers can compare answers.</p></details><details><summary lang="ja">内容は変更できますか？</summary><p lang="ja">質問と回答を置き換えて使えます。質問だけで内容が分かる見出しにしてください。</p></details></section>`,
    css: `details{margin-block:var(--space);padding:var(--space);border:1px solid #a79b88;border-radius:var(--radius);background:#fffaf2}summary{cursor:pointer;font-weight:700;min-height:2rem}details[open] summary{border-bottom:1px solid #d2c7b7;padding-bottom:.5rem}details p{margin-bottom:0}`,
    guidance: 'summary の標準の意味と開閉マーカーを保ち、質問の中に別のボタンやリンクを入れないでください。Enter、スペースキー、フォーカス表示、複数の回答を開いた状態を確認します。排他的な開閉やアニメーションは含みません。',
  },
  {
    id: 'pricing-comparison', title: '料金プランの比較', category: 'card', kind: 'component',
    tags: ['料金', 'カード', '画面幅への対応'],
    description: '2つのプランをカードで並べます。画面幅に合わせて配置を変え、各プランから選択時の説明に移動できます。',
    html: `<section aria-label="Example plans"><p class="eyebrow">ILLUSTRATIVE PRICES · NOT AN OFFER</p><div class="plans"><article><h2>Personal</h2><p class="price">$9 <small>/ month</small></p><ul><li>One workspace</li><li>Basic exports</li></ul><a href="#selection">Review Personal</a></article><article class="featured"><p>For collaboration</p><h2>Team</h2><p class="price">$24 <small>/ month</small></p><ul><li>Shared workspace</li><li>Team exports</li></ul><a href="#selection">Review Team</a></article></div><p id="selection" tabindex="-1">Demo only. Connect plan links to your real checkout and display tax, renewal, cancellation, and billing conditions before purchase.</p></section>`,
    css: `.plans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space)}article{padding:var(--space);border:1px solid #a79b88;border-radius:var(--radius);background:#fffaf2}.featured{border:2px solid #805129}.price{font-size:2rem;font-weight:800}.price small{font-size:.9rem;font-weight:400}ul{padding-left:1.2rem}a{display:inline-block;padding:.65rem;border:1px solid currentColor;border-radius:var(--radius)}@media(max-width:480px){.plans{grid-template-columns:1fr}}`,
    guidance: '料金と機能は架空の例です。リンクを実際のプランにつなぎ、請求・解約条件を示します。決済や契約変更の機能、特定プランの推奨は含みません。',
  },
  {
    id: 'release-timeline', title: '更新履歴', category: 'layout', kind: 'component',
    tags: ['時系列', '更新履歴', 'HTML'],
    description: '変更内容を日付順に並べ、各項目に機械で読み取れる日付と短い説明を付けます。',
    html: `<section aria-label="Example release history"><h2>Release notes</h2><ol class="timeline"><li><time datetime="2026-03-18">18 March 2026</time><h3>Clearer navigation</h3><p>Section names now describe the content readers will find.</p></li><li><time datetime="2026-03-04">4 March 2026</time><h3>Reading improvements</h3><p lang="ja">見出しと本文の余白を調整し、文章のまとまりを追いやすくしました。</p></li><li><time datetime="2026-02-20">20 February 2026</time><h3>First example</h3><p>A small starting point for testing the page with real content.</p></li></ol><p>Illustrative release history.</p></section>`,
    css: `.timeline{list-style:none;padding-left:var(--space);border-left:2px solid #a79b88}.timeline li{position:relative;margin-block:var(--space);padding:var(--space);background:#fffaf2;border-radius:var(--radius)}.timeline li:before{content:'';position:absolute;width:10px;height:10px;border-radius:50%;background:#805129;left:calc(-1 * var(--space) - 6px);top:1.5rem}time{font-size:.85rem}h3{margin-block:.4rem}p{margin-bottom:0}`,
    guidance: '日付と内容を確認済みの更新情報に置き換え、時系列と datetime の値を保ちます。静的な更新履歴のため、提供予定や進捗率を示す用途には別の実装が必要です。',
  },
  {
    id: 'metric-summary', title: '指標の要約', category: 'card', kind: 'component',
    tags: ['ダッシュボード', '指標', '画面幅への対応'],
    description: '実績値に単位と集計期間を添え、定義リストにまとめます。見本のデータであることも表示します。',
    html: `<section aria-label="Sample activity summary"><h2>Activity this month</h2><p>Illustrative data · 1–30 April 2026 · no live connection</p><dl><div><dt>Completed requests</dt><dd>128 <span>requests</span></dd></div><div><dt>Median response time</dt><dd>4.2 <span>hours</span></dd></div><div><dt>Open requests</dt><dd>16 <span>requests</span></dd></div></dl><p>Define each metric and its data source before connecting this layout to production.</p></section>`,
    css: `dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space)}dl>div{padding:var(--space);border:1px solid #a79b88;border-radius:var(--radius);background:#fffaf2}dt{font-size:.85rem}dd{margin:var(--space) 0 0;font-size:1.9rem;font-weight:800}dd span{display:block;font-size:.8rem;font-weight:400}@media(max-width:560px){dl{grid-template-columns:1fr}}`,
    guidance: '見本の数値を差し替え、集計期間、タイムゾーン、単位、更新時点を明示します。傾向を示す前に分母と集計方法を決めます。データ接続や目標値は含みません。',
  },
  {
    id: 'breadcrumb-trail', title: 'パンくずリスト', category: 'navigation', kind: 'component',
    tags: ['ナビゲーション', 'パンくず', 'HTML'],
    description: '現在地を明示し、上位の階層へリンクで戻れるようにします。幅が足りないときは折り返します。',
    html: `<nav aria-label="Breadcrumb"><ol><li><a href="#home">Home</a></li><li><a href="#library">Library</a></li><li><span aria-current="page">Reading patterns</span></li></ol></nav><section id="home" tabindex="-1"><h2>Home</h2><p>Example destination for the first link.</p></section><section id="library" tabindex="-1"><h2>Library</h2><p>Replace these local anchors with your site’s real ancestor routes.</p></section>`,
    css: `nav{padding:var(--space);background:#eee7db;border-radius:var(--radius)}ol{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;list-style:none;padding:0;margin:0}li{display:flex;align-items:center;gap:.5rem}li+li:before{content:'/';color:#776e61}a{padding:.35rem}[aria-current]{font-weight:700}section{margin-top:var(--space);padding-top:.5rem}`,
    guidance: 'リンクを実際の親階層に合わせ、現在地は aria-current="page" を持つテキストで示します。区切り記号は装飾です。折り返し、キーボードフォーカス、読み上げ名を確認します。',
  },
  {
    id: 'empty-state', title: '検索結果が0件のときの案内', category: 'feedback', kind: 'component',
    tags: ['フィードバック', '0件表示', 'コンテンツ'],
    description: '該当する項目がないことを伝え、検索のヒントへ移動できるリンクを示します。',
    html: `<section class="empty" aria-label="No results"><span class="symbol" aria-hidden="true">⌕</span><h2>No matching notes</h2><p>Try a broader phrase or remove one filter. Your saved notes have not been deleted.</p><a href="#tips">See search tips</a></section><section id="tips" tabindex="-1"><h3>Search tips</h3><p lang="ja">キーワードを一つ減らすか、別の言葉で検索してください。絞り込み条件も確認しましょう。</p></section>`,
    css: `.empty{text-align:center;padding:calc(var(--space) * 2);border:1px dashed #a79b88;border-radius:var(--radius);background:#fffaf2}.symbol{display:block;font-size:2.5rem}h2{margin-block:.5rem}a{display:inline-block;margin-top:.5rem;padding:.7rem 1rem;border:1px solid currentColor;border-radius:var(--radius)}#tips{padding:var(--space)}`,
    guidance: '検索が正常に完了して0件だったときに使います。読み込み中、権限不足、通信エラーは個別に扱い、復帰用のリンクを実際の操作につなぎます。結果が動的に変わる場合は読み上げにも通知します。',
  },
  {
    id: 'responsive-data-table', title: '横にスクロールできる比較表', category: 'layout', kind: 'component',
    tags: ['表', 'データ', '画面幅への対応'],
    description: '見出しとデータの対応を保った比較表です。狭い画面では表の領域にフォーカスを当て、キーボードで横にスクロールできます。',
    html: `<p id="table-help">Scroll horizontally on small screens. Example data only.</p><div class="scroll" role="region" aria-label="Example format comparison" aria-describedby="table-help" tabindex="0"><table><caption>Publishing formats — illustrative comparison</caption><thead><tr><th scope="col">Format</th><th scope="col">Best for</th><th scope="col">Check before sharing</th></tr></thead><tbody><tr><th scope="row">HTML</th><td>Responsive reading</td><td>Heading order and keyboard links</td></tr><tr><th scope="row">PDF</th><td>Fixed page layout</td><td>Text selection and reading order</td></tr><tr><th scope="row">Plain text</th><td>Simple exchange</td><td>Encoding and line wrapping</td></tr></tbody></table></div>`,
    css: `.scroll{max-width:100%;overflow-x:auto;border:1px solid #a79b88;border-radius:var(--radius)}table{border-collapse:collapse;width:100%;min-width:32rem;background:#fffaf2}caption{text-align:left;font-weight:700;padding:var(--space)}th,td{text-align:left;vertical-align:top;padding:var(--space);border-bottom:1px solid #d2c7b7}thead{background:#eee7db}tbody tr:last-child>*{border-bottom:0}`,
    guidance: 'データを替えるときは caption と scope を残し、横スクロールを表の領域内に収めます。並べ替え、ページ分割、列の固定は含みません。長いセルと狭い画面でのキーボード操作を試します。',
  },
];

const clamp = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;

function codeFor(example: Example, values: Record<string, number>) {
  const prefix = `fp-${example.id}`;
  // Prefix local IDs and references for safe use alongside other patterns.
  const html = example.html.replace(/\b(id|for|href|aria-describedby)="([^"]+)"/g, (_match, attr, value) => {
    const mapped = value.split(' ').map((part: string) => part.startsWith('#') ? `#${prefix}-${part.slice(1)}` : `${prefix}-${part}`).join(' ');
    return `${attr}="${mapped}"`;
  });
  // Nesting keeps every selector local to this one pattern, including media queries.
  // Native CSS nesting is required; no Tailwind or JavaScript is needed by the output.
  const css = example.css.replace(/#([a-z][\w-]*)/g, (match, name) => name === 'tips' ? `#${prefix}-${name}` : match);
  return `<section class="${prefix}" lang="en" style="--space:${clamp(values.spacing,16,8,28)}px;--radius:${clamp(values.radius,12,0,24)}px">\n${html}\n</section>\n<style>\n.${prefix}{box-sizing:border-box;width:100%;min-width:0;padding:16px;background:#fbf6ec;color:#29251f;font:16px/1.6 system-ui,sans-serif;overflow-wrap:anywhere; & *, & *::before, & *::after{box-sizing:border-box} & h2{line-height:1.25} & a{color:#70421c;text-underline-offset:3px} & :focus-visible{outline:3px solid #70421c;outline-offset:3px} ${css}}\n</style>`;
}

export const practicalPatterns: Record<string, PatternDefinition> = Object.fromEntries(practicalExamples.map(example => [example.id, {
  id: example.id, title: example.title, description: example.description,
  category: example.category, kind: example.kind, tags: [...new Set([...example.tags, 'HTML', 'CSS'])],
  performanceScore: 0, a11yScore: 'Not audited',
  performanceNotes: '生成コードに実行時のスクリプトや外部素材の読み込みはありません。性能は未計測です。',
  a11yNotes: example.guidance,
  responsiveNotes: 'プレビューは独立してスクロールできます。単体のページに実際の内容を入れ、狭い画面と文字を200%に拡大した状態で確認してください。',
  source: { label: 'Fragmenta example — provenance pending', note: 'Created during the ten-pattern addition according to the development record. Authorship, source materials, bilingual sample prose rights, and permission for reuse have not been independently verified.' },
  params: [
    { key: 'spacing', cssVar: '--space', label: '要素の間隔', type: 'number' as const, min: 8, max: 28, step: 1, default: 16, unit: 'px' },
    { key: 'radius', cssVar: '--radius', label: '角の丸み', type: 'number' as const, min: 0, max: 24, step: 1, default: 12, unit: 'px' },
  ],
  Preview: ({ values, paused }) => <iframe title={`${example.title}の作例`} sandbox="" tabIndex={paused ? -1 : 0}
    style={{ width: '100%', height: paused ? 150 : 360, border: 0, borderRadius: 8, pointerEvents: paused ? 'none' : undefined }}
    srcDoc={`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>${codeFor(example, values)}</body></html>`} />,
  generateCode: values => codeFor(example, values),
  generatePrompt: values => `「${example.title}」を実装してください。${example.description} 意味に合うHTML要素と、作例の範囲に限定したCSSネストを使います。要素の間隔は${clamp(values.spacing,16,8,28)}px、角丸は${clamp(values.radius,12,0,24)}pxです。${example.guidance} 性能の実測やアクセシビリティの認証を受けたという説明は加えないでください。`,
}]));
