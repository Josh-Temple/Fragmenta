const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter, Routes, Route } = require('react-router-dom');
const { load } = require('../scripts/load-data.cjs');
const { escape: e, link, para, list, block, mark, crumbs } = require('./html.mjs');
const {
  sections,
  items,
  byId,
  labels,
  exportPath,
  getReview,
  compositionBrief,
} = require('./catalog.cjs');
const Diagram = load('components/CompositionDiagram').default;
const h = React.createElement;
const pageComponents = {
  styles: ['DesignStyles', '/styles/:id'],
  browse: ['AnimationDetail', '/p/:id'],
  contrast: ['ContrastTool', '/tools/contrast'],
  typography: ['TypographyTool', '/tools/typography'],
  licenses: ['Licenses', '/licenses'],
  guide: ['BestPractices', '/guide'],
};
const json = (x) => JSON.stringify(x).replaceAll('<', '\\u003c');
function island(key, path, props = {}) {
  const [file, route] = pageComponents[key],
    Page = load('pages/' + file).default;
  const markup = renderToString(
    h(
      StaticRouter,
      { location: path },
      h(Routes, null, h(Route, { path: route, element: h(Page, props) })),
    ),
  );
  return (
    '<div class="widget" data-widget="' +
    key +
    '">' +
    markup +
    '</div><script type="application/json" id="widget-props">' +
    json(props) +
    '</script>'
  );
}
const itemLink = (id, reason = '') => {
  const r = byId.get(id);
  return r ? '<li>' + link(r.path, r.title) + ' ' + e(reason) + '</li>' : '';
};
function copy(text, id = 'brief') {
  return (
    '<details class="copy-text"><summary>判断材料の全文</summary><pre id="' +
    id +
    '">' +
    e(text) +
    '</pre></details><button class="action" type="button" data-copy="' +
    id +
    '">指示文をコピー</button><span class="copy-status" role="status"></span>'
  );
}
function sources(data) {
  const rows = data.sources || [];
  return (
    (data.sourceNote ? para(data.sourceNote) : '') +
    (rows.length
      ? '<ul class="sources">' +
        rows
          .map(
            (s) =>
              '<li>' +
              link(s.url, s.publisher + ' · ' + s.title) +
              para(s.scope) +
              para(s.rights) +
              '</li>',
          )
          .join('') +
        '</ul>'
      : para('外部出典の登録は未完了です。'))
  );
}
function heading(item, withTabs = false) {
  const catCrumb =
    item.category && ['composition', 'styles', 'browse', 'knowledge'].includes(item.section)
      ? [[labels[item.category] || item.category, '/' + item.section + '?category=' + encodeURIComponent(item.category)]]
      : [];
  return (
    crumbs([
      ['展示室', '/'],
      [sections[item.section][0], '/' + item.section],
      ...catCrumb,
      [item.title],
    ]) +
    '<div class="detail-bar"><header class="detail-title"><p class="eyebrow">' +
    e(item.id) +
    (item.category ? ' · ' + e(labels[item.category] || item.category) : '') +
    '</p><div class="detail-headline"><h1 tabindex="-1">' +
    e(item.title) +
    '</h1>' +
    mark(item.status) +
    '</div></header>' +
    (withTabs ? tabs() : '') +
    '</div>'
  );
}
function tabs() {
  return (
    '<nav class="view-tabs" aria-label="詳細の表示切替">' +
    [
      ['visual', '視覚'],
      ['structure', '構造 (X-Ray)'],
      ['ai-code', 'AI・コード'],
    ]
      .map(([id, t]) => link('#' + id, t, 'data-view="' + id + '"'))
      .join('') +
    '<a href="#sources">出典・権利 ↗</a></nav>'
  );
}
const panel = (id, title, body) =>
  '<section class="view" id="' + id + '" aria-label="' + title + '">' + body + '</section>';
function diagram(g, variant) {
  return renderToString(h(Diagram, { guide: g, variant }), { identifierPrefix: variant + '-' });
}
function composition(item) {
  const g = item.record,
    d = item.data.discovery;
  const compList = items.filter((x) => x.section === 'composition'),
    compIdx = compList.indexOf(item);
  const a = g.id === 'C-110' ? '画風A' : g.id === 'C-119' ? '元図' : '配置例',
    b = g.id === 'C-110' ? '画風B' : g.id === 'C-119' ? '検査表示' : '対照例';
  const toolbar =
    '<div class="diagram-bar"><span class="diagram-caption">比較模式図（左：' +
    a +
    ' ／ 右：' +
    b +
    '）' +
    (g.changed ? '　<span class="changed-chip">変えた1要素：' + e(g.changed) + '</span>' : '') +
    '</span><button class="action xray-btn" type="button" data-thirds-toggle aria-pressed="false"><span lang="en">X-RAY</span> 構造補助線を強調</button></div>';
  const pair =
    '<div class="pair' +
    (['C-093', 'C-119'].includes(g.id) ? ' stacked' : '') +
    '" data-thirds="' +
    e(g.id) +
    '">' +
    [
      [a, 'example', g.example],
      [b, 'comparison', g.contrast],
    ]
      .map(
        ([name, v, desc]) =>
          '<figure><div class="drawing"' +
          (g.id === 'C-119' && v === 'comparison' ? ' data-inspection' : '') +
          '>' +
          diagram(g, v) +
          '</div><figcaption><strong>' +
          name +
          '</strong>' +
          e(desc) +
          '</figcaption></figure>',
      )
      .join('') +
    '</div>';
  const purpose = d.choices
    .map((c) => {
      const r = getReview(g.id, c);
      return (
        '<article class="purpose-note" data-for-purpose="' +
        e(c.purposeId) +
        '"><h3>' +
        link('/composition?purpose=' + c.purposeId, c.titleJa) +
        '</h3>' +
        para('適した理由：' + c.reasonJa) +
        para('避けたい設計・注意点：' + c.cautionJa) +
        para('確認ポイント：' + r.checkJa) +
        '<ul>' +
        itemLink(r.alternativeId, r.alternativeReasonJa) +
        '</ul>' +
        (c.sourceSupport ? para(c.sourceSupport.section + '　' + c.sourceSupport.scopeJa) : '') +
        '</article>'
      );
    })
    .join('');
  const review = d.review;
  const primaryCaution = d.choices[0]?.cautionJa;
  const bulletList = (rows) =>
    rows && rows.length ? '<ul class="sheet-list">' + rows.map((x) => '<li>' + e(x) + '</li>').join('') + '</ul>' : '';
  const summarySheet =
    '<div class="detail-sheet"><div class="sheet-col"><section class="sheet-block"><h2>原理と効く理由</h2>' +
    para(g.definition) +
    (g.whyItWorks ? para(g.whyItWorks) : '') +
    para(g.comparisonPoint) +
    (g.diagramNote ? para(g.diagramNote) : '') +
    '</section>' +
    (g.useCases?.length ? '<section class="sheet-block"><h2>使いどころ</h2>' + bulletList(g.useCases) + '</section>' : '') +
    '<section class="sheet-block"><h2>よくある失敗・確認点</h2>' +
    (g.pitfalls?.length ? bulletList(g.pitfalls) : primaryCaution ? para(primaryCaution) : '') +
    para(review.checkJa) +
    '</section></div><div class="sheet-col sheet-ai"><div class="sheet-ai-head"><h2>AIへの配置指示</h2><a class="sheet-jump" href="#ai-code" data-jump-view="ai-code">全文・コピーへ →</a></div><pre class="ai-preview" id="ai-visual-preview">' +
    e(g.aiInstruction) +
    '</pre><div class="sheet-actions"><a class="action" href="#structure" data-jump-view="structure">構造・用途別条件を見る</a><a class="action" href="#ai-code" data-jump-view="ai-code">AI判断ブリーフを開く</a></div></div></div>';
  const structure =
    block(
      'principle',
      '配置原理と見比べ方',
      para(g.definition) +
        (g.whyItWorks ? para(g.whyItWorks) : '') +
        (g.changed ? para('比較で変えた1要素：' + g.changed) : '') +
        para(g.comparisonPoint) +
        para(g.diagramNote) +
        (g.useCases?.length ? '<h3>使いどころ</h3>' + bulletList(g.useCases) : '') +
        (g.pitfalls?.length ? '<h3>よくある失敗</h3>' + bulletList(g.pitfalls) : '') +
        para(review.checkJa) +
        '<ul>' +
        itemLink(review.alternativeId, review.alternativeReasonJa) +
        '</ul>',
    ) +
    block('use', '用途別の適用条件・避けたい設計', '<div class="purpose-grid">' + (purpose || para('個別の用途候補は編集中です。')) + '</div>') +
    (d.relatedComposition.length
      ? block(
          'related',
          '関連する構図',
          '<ul>' + d.relatedComposition.map((r) => itemLink(r.targetId, r.reasonJa)).join('') + '</ul>',
        )
      : '') +
    (g.relatedLegacyIds.length
      ? block(
          'related-ideas',
          '関連する企画（企画段階）',
          '<ul>' + g.relatedLegacyIds.map((id) => itemLink(id)).join('') + '</ul>',
        )
      : '');
  const briefs = Object.fromEntries(
    d.choices.map((c) => [
      c.purposeId,
      {
        brief: compositionBrief(g, c.purposeId),
        instruction: c.aiInstruction || g.aiInstruction,
        reason: c.reasonJa,
        caution: c.cautionJa,
        title: c.titleJa,
      },
    ]),
  );
  const visual = toolbar + pair + summarySheet;
  return (
    heading(item, true) +
    '<div id="purpose-context"></div>' +
    panel('visual', '視覚', visual) +
    panel('structure', '構造 (X-Ray)', structure) +
    panel(
      'ai-code',
      'AI・コード',
      block(
        'ai',
        'AIへの指示例と判断材料',
        '<p class="ai-lead" id="ai-instruction">' +
          e(g.aiInstruction) +
          '</p>' +
          copy(item.data.aiBrief) +
          para('この項目では配置の指示と模式図を提供しています。目的・媒体・提示画像に合わせて条件を補ってください。'),
      ),
    ) +
    block(
      'sources',
      '出典・権利と検証状況',
      para('説明・図・AI指示は編集下書きです。項目全体の根拠は未確認です。') +
        sources(item.data) +
        para(item.data.rights) +
        '<div class="source-meta-links">' +
        link('/licenses', '権利・利用条件') +
        link(exportPath(item), '項目のJSON') +
        '</div>',
    ) +
    '<nav class="article-links" aria-label="前後の構図">' +
    (compList[compIdx - 1]
      ? link(compList[compIdx - 1].path, '← ' + compList[compIdx - 1].id + ' ' + compList[compIdx - 1].title)
      : '<span></span>') +
    (compList[compIdx + 1]
      ? link(compList[compIdx + 1].path, compList[compIdx + 1].id + ' ' + compList[compIdx + 1].title + ' →')
      : '<span></span>') +
    '</nav>' +
    '<script type="application/json" id="purpose-briefs">' +
    json(briefs) +
    '</script>' +
    (g.id === 'C-119'
      ? '<script type="application/json" id="inspection-guide">' + json(g) + '</script>'
      : '')
  );
}
function knowledge(item) {
  const k = item.record,
    d = k.editorial || {},
    data = item.data;
  const related = k.relations || [];
  const siblings = items.filter((x) => x.section === 'knowledge' && x.category === k.categoryId),
    i = siblings.indexOf(item);
  return (
    heading(item) +
    block(
      'status',
      '現在の内容',
      para('企画段階。掲載中の編集稿は未レビューで、項目全体の根拠は未確認です。') + para(d.summary),
    ) +
    block(
      'use',
      '用途と注意点',
      list(d.appropriateUses) +
        list(d.pitfalls) +
        para(d.practicalExample) +
        para(d.implementationNotes) +
        para(d.accessibilityNotes),
    ) +
    block('review', '制作時の確認', list(d.reviewChecks) + para(d.aiInstruction) + copy(data.aiBrief)) +
    block(
      'sources',
      '出典・権利と検証状況',
      sources(data) +
        para(data.rights) +
        '<div class="source-meta-links">' +
        link('/licenses', '権利・利用条件') +
        link(exportPath(item), '項目のJSON') +
        '</div>',
    ) +
    block(
      'related',
      '関連項目',
      '<ul>' +
        k.relatedIdeaIds
          .map((id) => itemLink(id, related.find((r) => r.targetId === id)?.reasonJa))
          .join('') +
        k.relatedExisting.map((r) => itemLink(r.id)).join('') +
        '</ul>',
    ) +
    '<nav class="article-links">' +
    (siblings[i - 1] ? link(siblings[i - 1].path, '← ' + siblings[i - 1].title) : '<span></span>') +
    (siblings[i + 1] ? link(siblings[i + 1].path, siblings[i + 1].title + ' →') : '<span></span>') +
    '</nav>'
  );
}
function detail(item) {
  if (item.section === 'composition') return composition(item);
  if (item.section === 'knowledge') return knowledge(item);
  if (item.section === 'styles' || item.section === 'browse' || item.section === 'tools') {
    const key = item.section === 'tools' ? item.path.split('/').pop() : item.section;
    const related = items
      .filter((i) => i.section === 'knowledge' && i.record.relatedExisting.some((r) => r.id === item.id))
      .map((i) => ({ id: i.id, titleJa: i.title }));
    const props =
      key === 'styles'
        ? { styleId: item.id, relatedEntries: related }
        : key === 'browse'
          ? { relatedEntries: related }
          : undefined;
    const intro = crumbs([
      ['展示室', '/'],
      [sections[item.section][0], '/' + item.section],
      [item.title],
    ]);
    return (
      intro +
      '<div class="widget-meta">' +
      mark(item.status) +
      '　' +
      link('#sources', '出典・利用条件') +
      '</div>' +
      island(key, item.path, props) +
      block(
        'sources',
        '出典・権利と検証状況',
        para(
          key === 'browse'
            ? item.data.selection
                .split('\n')
                .filter((x) => /出典|再利用条件/.test(x))
                .join('　')
            : key === 'styles'
              ? item.data.selection.sourceScope
              : '計算方法・確認範囲はツール内の説明を参照してください。',
        ) +
          (item.data.source?.url ? link(item.data.source.url, item.data.source.label) : '') +
          ' ' +
          link('/licenses', '権利・利用条件') +
          '　' +
          link(exportPath(item), '項目のJSON'),
      ) +
      (key === 'browse'
        ? '<noscript><details><summary>初期設定のコードとAI指示</summary><pre>' +
          e(item.data.defaultCode) +
          '</pre>' +
          para(item.data.defaultPrompt) +
          '</details></noscript>'
        : '')
    );
  }
  if (item.section === 'collections')
    return (
      heading(item) +
      para(item.summary) +
      block(
        'members',
        '収録したUIパターン',
        '<ul>' + item.record.patternIds.map((id) => itemLink(id)).join('') + '</ul>',
      ) +
      block(
        'sources',
        '出典・権利と検証状況',
        para(
          'Fragmentaの実演から編集したコレクションです。検証記録と利用条件は各項目に掲載しています。',
        ) +
          link('/licenses', '権利・利用条件') +
          '　' +
          link(exportPath(item), '項目のJSON'),
      )
    );
  const p = item.record;
  return (
    heading(item) +
    para(item.summary) +
    block(
      'planned',
      '予定している操作と確認項目',
      Array.isArray(p.acceptance) ? list(p.acceptance) : para(p.acceptance),
    ) +
    block(
      'sources',
      '実装・出典・権利',
      para('制作前の企画です。実演、生成コード、個別の出典確認は今後の作業です。') +
        para(item.data.rights) +
        link('/licenses', '権利・利用条件') +
        '　' +
        link(exportPath(item), '項目のJSON'),
    )
  );
}
module.exports = { detail, diagram, island, json };
