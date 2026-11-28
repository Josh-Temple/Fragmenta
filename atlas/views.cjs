const { escape: e, link, para, mark, crumbs, statuses } = require('./html.mjs');
const { sections, items, labels, compositionPurposes, byId, indexRow } = require('./catalog.cjs');
const { results } = require('./list.mjs');
const names = Object.entries(sections);
const searchIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
const themeIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15Z" fill="currentColor"/></svg>';
function header(path) {
  const nav = [
    ['/', '展示室'],
    ['/composition', '構図'],
    ['/styles', 'スタイル'],
    ['/browse', 'UI'],
    ['/tools', 'ツール'],
    ['/knowledge', '知識台帳'],
  ];
  return (
    '<a class="skip" href="#main">本文へ移動</a><header class="mast"><a class="wordmark" href="/" aria-label="Fragmenta ホーム">Fragmenta<span>.</span></a><nav aria-label="主なページ">' +
    nav
      .map(([url, label]) => {
        const exact = path === url;
        const inSection =
          !exact &&
          url !== '/' &&
          (path.startsWith(url + '/') || (url === '/browse' && path.startsWith('/p/')));
        return link(
          url,
          label,
          exact ? 'aria-current="page"' : inSection ? 'data-section-active="true"' : '',
        );
      })
      .join('') +
    '</nav><div class="utilities"><a class="search-trigger" href="/search" aria-label="検索" data-search>' +
    searchIcon +
    '<kbd aria-hidden="true">⌘K</kbd></a><button type="button" data-theme aria-label="明暗を切り替える">' +
    themeIcon +
    '</button></div></header>'
  );
}
const primaryPurposeIds = ['placement', 'gaze', 'depth', 'text-space', 'grouping'];
const footer =
  '<footer class="quiet-footer"><a href="/">Fragmenta<span>.</span></a><nav aria-label="資料"><a href="/collections">コレクション</a><a href="/guide">使い方</a><a href="/licenses">権利・利用条件</a><a href="/llms.txt">AI向け索引</a></nav></footer><nav class="mobile-nav" aria-label="モバイル操作"><a href="/">展示室</a><a href="/composition">構図</a><a href="/styles">スタイル</a><a href="/search" data-search>検索</a><a href="/tools">ツール</a></nav><dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-head"><h2 id="search-title">図鑑を横断検索</h2><form method="dialog"><button class="close" aria-label="検索を閉じる">Esc ×</button></form></div><form action="/search" role="search"><label for="dialog-q">名称・ID・用途・キーワード</label><div class="input-row"><input type="search" name="q" id="dialog-q" placeholder="三分割法、Swiss、文字の余白、C-001"><button>検索</button></div></form><div class="dialog-purposes"><p class="dialog-sub">目的から構図を探す</p><div class="purpose-chips">' +
  compositionPurposes.map((p) => link('/composition?purpose=' + p.id, p.titleJa)).join('') +
  '</div></div></dialog>';
const coordinates = [
  ['solitude', 19, 24],
  ['calm', 24, 70],
  ['grouping', 52, 78],
  ['depth', 68, 26],
  ['sequence', 80, 62],
];
function compass() {
  const primaryPurposes = primaryPurposeIds
    .map((id) => compositionPurposes.find((p) => p.id === id))
    .filter(Boolean);
  const restPurposes = compositionPurposes.filter((p) => !primaryPurposeIds.includes(p.id));
  return (
    '<aside class="compass" aria-labelledby="compass-heading"><div class="compass-head"><h2 id="compass-heading">意図から探す</h2><span>2軸の印象マップ</span></div><div class="map"><span class="axis top">広がり</span><span class="axis bottom">まとまり</span><span class="axis left">静</span><span class="axis right">動</span>' +
    coordinates
      .map(([id, x, y]) => {
        const p = compositionPurposes.find((v) => v.id === id);
        return (
          '<a style="left:' +
          x +
          '%;top:' +
          y +
          '%" href="/composition?purpose=' +
          id +
          '" aria-label="' +
          e(p.titleJa) +
          'の構図を探す"><i></i><b>' +
          e(p.titleJa) +
          '</b></a>'
        );
      })
      .join('') +
    '</div><div class="purpose-compact"><p class="purpose-caption">主要な目的</p><div class="purpose-primary">' +
    primaryPurposes.map((p) => link('/composition?purpose=' + p.id, p.titleJa)).join('') +
    '</div><details class="purpose-more"><summary>すべての目的を選ぶ（他' +
    restPurposes.length +
    '種）</summary><div class="purpose-list">' +
    restPurposes.map((p) => link('/composition?purpose=' + p.id, p.titleJa)).join('') +
    '</div></details></div></aside>'
  );
}
function home() {
  const groups = [
    ['composition', '120件 · 比較模式図240点', 'draft'],
    ['styles', '24系統 · 比較と配合', 'live'],
    ['browse', '18実演 · 動作とコード', 'live'],
  ];
  const collectionRows = items.filter((i) => i.section === 'collections');
  return (
    '<div class="home-heading"><div class="home-title-group"><p class="eyebrow" lang="en">Design Knowledge Atlas</p><h1>デザインの展示室</h1><p class="home-lead">構図・様式・UI実演を、人間とAIが同じ語彙で選び実装に活かすための視覚知識ベース。</p></div><form class="home-search" action="/search" role="search"><label class="visually-hidden" for="home-q">名称・用途・IDで検索</label><span class="home-search-box">' +
    searchIcon +
    '<input id="home-q" name="q" type="search" placeholder="名称・用途・IDで探す"><kbd aria-hidden="true">⌘K /</kbd></span><button type="submit">検索</button></form></div><div class="exhibit">' +
    compass() +
    '<section class="exhibit-section" aria-label="視覚図鑑を選ぶ"><div class="exhibit-track">' +
    groups
      .map(
        ([s, meta, st]) =>
          '<a class="exhibit-card" href="/' +
          s +
          '"><span class="exhibit-plate"><img width="300" height="200" alt="" src="/art/home/' +
          s +
          '.svg"></span><span class="exhibit-caption"><span><small lang="en">' +
          sections[s][1] +
          '</small><strong>' +
          sections[s][0] +
          '</strong><em class="exhibit-meta">' +
          e(meta) +
          '</em></span><span class="exhibit-end">' +
          mark(st, false) +
          '<span aria-hidden="true">↗</span></span></span></a>',
      )
      .join('') +
    '</div><div class="carousel-controls"><button type="button" data-slide="-1" aria-label="前の図鑑">←</button><span aria-live="polite" id="slide-count">1 / 3</span><button type="button" data-slide="1" aria-label="次の図鑑">→</button></div></section></div><section class="home-band" aria-labelledby="home-collections-heading"><div class="band-head"><h2 id="home-collections-heading">用途別コレクション</h2>' +
    link('/collections', '全4種を見る ↗') +
    '</div><div class="collection-strip">' +
    collectionRows
      .map(
        (c) =>
          '<a class="collection-cell" href="' +
          e(c.path) +
          '"><strong>' +
          e(c.title) +
          '</strong><span>' +
          c.record.patternIds.length +
          ' パターン</span></a>',
      )
      .join('') +
    '</div></section><nav class="home-index" aria-label="ツールと知識台帳">' +
    '<a class="index-cell" href="/tools"><span><small lang="en">Tools</small><strong>実用ツール</strong><em>公開2件 ＋ 企画10件</em></span>' +
    mark('tool', false) +
    '</a>' +
    '<a class="index-cell" href="/knowledge"><span><small lang="en">Knowledge Index</small><strong>知識台帳</strong><em>180件 · 15分類マトリクス</em></span>' +
    mark('proposal', false) +
    '</a>' +
    '<a class="index-cell" href="/guide"><span><small lang="en">Guide &amp; Rights</small><strong>使い方と利用条件</strong><em>比較・検証・ライセンス基準</em></span><span aria-hidden="true">↗</span></a>' +
    '</nav>'
  );
}
function options(values) {
  return values.map(([v, t]) => '<option value="' + e(v) + '">' + e(t) + '</option>').join('');
}
function listing(section, page = 1) {
  const search = section === 'search',
    rows = items.filter((i) => search || i.section === section).map(indexRow);
  const visual = ['composition', 'styles', 'browse'].includes(section),
    s = sections[section] || ['横断検索', 'Search'];
  const categories = [...new Set(rows.map((x) => x.category).filter(Boolean))];
  const label = search ? '名称・ID・用途' : s[0] + 'を検索';
  const filters =
    '<div class="filter-panel"><form class="filter-form" role="search" action="/' +
    section +
    '"><label>' +
    label +
    '<span class="input-row"><input name="q" type="search" placeholder="名称・用途で探す"><button>検索</button></span></label>' +
    (!search && categories.length
      ? '<label>分類<select name="category"><option value="">すべての分類</option>' +
        options(categories.map((id) => [id, labels[id] || id])) +
        '</select></label>'
      : '') +
    (search
      ? '<label>図鑑<select name="section"><option value="">すべての図鑑</option>' +
        options(names.map(([id, n]) => [id, n[0]])) +
        '</select></label><label>掲載状態<select name="status"><option value="">すべての状態</option>' +
        options(Object.entries(statuses)) +
        '</select></label>'
      : '') +
    (section === 'composition'
      ? '<label>目的<select name="purpose"><option value="">すべての目的</option>' +
        options(compositionPurposes.map((p) => [p.id, p.titleJa])) +
        '</select></label>'
      : '') +
    '</form></div>';
  const addons = {
    browse: [
      ['/collections', '用途別コレクション（4種）'],
      ['/upcoming', 'UIパターンの企画（12件）'],
    ],
    tools: [['/tools/upcoming', 'ツールの企画一覧（10件）']],
    knowledge: [['/composition', '構図の比較図鑑（120件）']],
  };
  const catStrip =
    visual && categories.length
      ? '<nav class="cat-strip" aria-label="分類で絞り込む"><a href="/' +
        section +
        '" data-cat="" aria-current="true">すべて</a>' +
        categories
          .map((id) => '<a href="/' + section + '?category=' + e(id) + '" data-cat="' + e(id) + '">' + e(labels[id] || id) + '</a>')
          .join('') +
        '</nav>'
      : '';
  const statusStatement =
    section === 'composition'
      ? '<p class="catalog-note">全120件は公開中の編集下書きです。各カードのドット記号は検証ステータスを示します。</p>'
      : section === 'knowledge'
        ? '<p class="catalog-note">全180件（15分類）の企画台帳インデックスです。企画段階（○）と、公開済み標本と接続する項目（●）を区別して表示します。</p>'
        : section === 'tools'
          ? '<p class="catalog-note">公開中の実用ワークベンチ2件（● 検証済・公開中）と、共通フレームで拡張予定の企画10件（○ 企画段階）です。</p>'
          : '';
  const knowledgeMatrix =
    section === 'knowledge'
      ? '<section class="knowledge-matrix" aria-labelledby="matrix-heading"><div class="matrix-head"><h2 id="matrix-heading">15分類インデックス・マトリクス</h2><a class="matrix-reset" href="/knowledge" data-cat="" aria-current="true">すべて表示（180件）</a></div><div class="matrix-grid" role="navigation" aria-label="知識の分類">' +
        categories
          .map((id, idx) => {
            const catRows = rows.filter((r) => r.category === id);
            const linkedInCat = catRows.filter((r) => r.linkedCount > 0).length;
            return (
              '<a class="matrix-cell" href="/knowledge?category=' +
              e(id) +
              '" data-cat="' +
              e(id) +
              '"><span class="matrix-top"><code class="matrix-idx">' +
              String(idx + 1).padStart(2, '0') +
              '</code><span class="matrix-count">' +
              catRows.length +
              '件</span></span><strong class="matrix-name">' +
              e(labels[id] || id) +
              '</strong><span class="matrix-meta">' +
              (linkedInCat
                ? '<span class="matrix-live"><i class="mark verified" aria-hidden="true"></i>公開接続 ' +
                  linkedInCat +
                  '</span>'
                : '<span class="matrix-plan"><i class="mark proposal" aria-hidden="true"></i>企画索引</span>') +
              '</span></a>'
            );
          })
          .join('') +
        '</div></section>'
      : '';
  const toolsRoadmap =
    section === 'tools'
      ? (() => {
          const planned = items.filter((i) => i.section === 'tools/upcoming').map(indexRow);
          return (
            '<section class="tools-roadmap" aria-labelledby="tools-roadmap-heading"><div class="band-head"><h2 id="tools-roadmap-heading">拡張企画インデックス（10件・4分類）</h2>' +
            link('/tools/upcoming', '企画台帳を開く →') +
            '</div><div class="tools-plan-grid">' +
            planned
              .map(
                (p) =>
                  '<a class="tool-plan-cell" href="' +
                  e(p.path) +
                  '"><span class="tool-plan-top"><em class="ledger-cat">' +
                  e(p.categoryLabel || p.category) +
                  '</em>' +
                  mark('proposal') +
                  '</span><strong>' +
                  e(p.title) +
                  '</strong><small>' +
                  e(p.summary) +
                  '</small></a>',
              )
              .join('') +
            '</div></section>'
          );
        })()
      : '';
  return (
    '<div data-list="' +
    section +
    '" data-page="' +
    page +
    '" data-visual="' +
    visual +
    '">' +
    crumbs([['展示室', '/'], [s[0]]]) +
    '<div class="title-row"><div class="title-main"><p class="eyebrow" lang="en">' +
    s[1] +
    '</p><h1>' +
    s[0] +
    '</h1></div><div class="title-meta"><span class="count" role="status" id="result-count">' +
    rows.length +
    ' 件</span><div class="legend" aria-label="検証ステータス凡例">' +
    [...new Set(rows.map((r) => r.status))].map((st) => mark(st)).join('') +
    '</div></div></div>' +
    statusStatement +
    '<div class="catalog-bar">' +
    catStrip +
    '<div class="bar-end"><details class="filter"' +
    (search ? ' open' : '') +
    '><summary>' +
    searchIcon +
    ' <span>' +
    (section === 'composition' ? '目的・検索' : '検索・絞り込み') +
    '</span><b class="filter-badge" id="filter-badge" hidden>0</b></summary>' +
    filters +
    '</details>' +
    (visual
      ? '<button id="xray" type="button" aria-pressed="false"><span lang="en">X-RAY</span><span class="visually-hidden"> 補助線表示</span></button>'
      : '') +
    '</div></div>' +
    knowledgeMatrix +
    '<noscript><p class="noscript-note">一覧と詳細はこのまま読めます。検索と絞り込みはJavaScriptを使います。</p></noscript><div id="active-filters"></div><div id="results">' +
    results(rows, section, page, new URLSearchParams(), visual) +
    '</div>' +
    toolsRoadmap +
    (addons[section]
      ? '<nav class="article-links">' +
        addons[section].map(([url, t]) => link(url, t + ' →')).join('') +
        '</nav>'
      : '') +
    '</div>'
  );
}
module.exports = { header, footer, home, listing, compass };
