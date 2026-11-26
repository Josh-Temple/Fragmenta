const fs = require('node:fs'),
  path = require('node:path');
const { escape: e, link, statuses, crumbs } = require('./html.mjs');
const {
  items,
  sections,
  labels,
  compositionPurposes,
  indexRow,
  itemJson,
  exportPath,
} = require('./catalog.cjs');
const { header, footer, home, listing } = require('./views.cjs');
const { detail, diagram, island, json } = require('./details.cjs');
const { covers, poster } = require('./art.cjs');
const { styleArt } = require('./style-art.cjs');
const { patternArt } = require('./pattern-art.cjs');
const origin = 'https://fragmenta-6ke.pages.dev';
function materialize(template, emit) {
  const paths = [];
  function page(url, title, description, content, opt = {}) {
    const canonical = opt.noindex ? '' : '<link rel="canonical" href="' + origin + url + '">';
    const full = title + ' — Fragmenta';
    const hierarchy = [
      ['展示室', '/'],
      ...(opt.item
        ? [
            [sections[opt.item.section][0], '/' + opt.item.section],
            [opt.item.title, url],
          ]
        : url === '/'
          ? []
          : [[title, url]]),
    ];
    const metadata =
      '<title>' +
      e(full) +
      '</title><meta name="description" content="' +
      e(description) +
      '">' +
      canonical +
      (opt.noindex ? '<meta name="robots" content="noindex,follow">' : '') +
      '<meta property="og:site_name" content="Fragmenta"><meta property="og:type" content="' +
      (opt.item ? 'article' : 'website') +
      '"><meta property="og:locale" content="ja_JP"><meta property="og:url" content="' +
      origin +
      url +
      '"><meta property="og:title" content="' +
      e(full) +
      '"><meta property="og:description" content="' +
      e(description) +
      '"><meta name="twitter:card" content="summary">' +
      (opt.item
        ? '<link rel="alternate" type="application/json" href="' + exportPath(opt.item) + '">'
        : '') +
      (url !== '/' && !opt.noindex
        ? '<script type="application/ld+json">' +
          json({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: hierarchy.map(([name, p], i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name,
              item: origin + p,
            })),
          }) +
          '</script>'
        : '');
    const shell =
      header(url) +
      '<main id="main" tabindex="-1" class="' +
      (url === '/' ? 'home' : '') +
      '">' +
      content +
      '</main>' +
      footer;
    const html = template
      .replace('<!--atlas-head-->', () => metadata)
      .replace('<!--atlas-body-->', () => shell);
    emit(url === '/' ? 'index.html' : url.slice(1) + '.html', html);
    if (!opt.noindex) paths.push(url);
  }
  page(
    '/',
    'デザインの展示室',
    '構図の比較図、24のスタイル、UIの実演から、作りたい画面に合う例を探せるデザイン図鑑。',
    home(),
  );
  for (const [s, [title]] of Object.entries(sections)) {
    const rows = items.filter((r) => r.section === s);
    const pages = Math.ceil(rows.length / 24);
    for (let p = 1; p <= pages; p++)
      page(
        '/' + s + (p > 1 ? '/page/' + p : ''),
        title + (p > 1 ? ' · ' + p : ''),
        title + 'の一覧。' + rows.length + '件を分類・名称・用途から選べます。',
        listing(s, p),
      );
    emit('catalog/index/' + s + '.json', JSON.stringify(rows.map(indexRow)));
  }
  for (const item of items) {
    page(item.path, item.title + '（' + statuses[item.status] + '）', item.summary, detail(item), {
      item,
    });
    emit(exportPath(item).slice(1), JSON.stringify(itemJson(item)));
    if (item.artwork) {
      let svg;
      if (item.section === 'composition')
        svg =
          covers[item.id] ||
          diagram(item.record, 'example').replace(/<svg /, '<svg width="300" height="200" ');
      if (item.section === 'styles') svg = styleArt(item.record);
      if (item.section === 'browse') svg = patternArt(item.id);
      emit(item.artwork.slice(1), svg);
    }
    if (item.guide)
      emit(
        'art/guides/' + item.section + '/' + item.id + '.svg',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><path d="' +
          item.guide +
          '" stroke="#2367df" stroke-width="1.7" fill="none" stroke-dasharray="5 3"/></svg>',
      );
  }
  for (const [id, svg] of Object.entries(poster)) emit('art/home/' + id + '.svg', svg);
  emit('catalog/index/search.json', JSON.stringify(items.map(indexRow)));
  emit(
    'catalog/filters.json',
    JSON.stringify({
      purposes: compositionPurposes.map(({ id, titleJa, description }) => ({
        id,
        titleJa,
        description,
      })),
      labels,
    }),
  );
  page('/search', '横断検索', '図鑑・ツール・企画を、名前や用途で横断検索。', listing('search'), {
    noindex: true,
  });
  page('/guide', '使い方', '作例の選び方と確認方法。', island('guide', '/guide'));
  page(
    '/licenses',
    '権利・利用条件',
    '個別パターンの権利台帳と利用条件。',
    island('licenses', '/licenses'),
  );
  page(
    '/404',
    'ページが見つかりません',
    '指定された項目は見つかりません。',
    '<h1>ページが見つかりません</h1><p>URLを確認するか、図鑑から項目を探せます。</p>' +
      link('/search', '図鑑を検索'),
    { noindex: true },
  );
  emit(
    'sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths.map((p) => '<url><loc>' + origin + p + '</loc></url>').join('') +
      '</urlset>',
  );
  const llms = fs.readFileSync(path.join(__dirname, '../public/llms.txt'), 'utf8');
  emit(
    'llms.txt',
    llms.replaceAll('/#/', '/') +
      '\n## 正規URLと項目単位の配布\n- 全項目の索引: /catalog/index/search.json\n- サイトマップ: /sitemap.xml\n- 各項目のHTMLにJSONのalternateリンクがあります。publicationStatusは掲載状態、reviewStatus・evidenceStatusは編集上の検証状況です。利用条件は各項目と /licenses を参照してください。\n',
  );
  emit('_redirects', '/a/:id /p/:id 301\n/saved /collections 301\n/settings / 301\n');
  return paths.length;
}
function build(dir) {
  const template = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  if (!template.includes('<!--atlas-body-->')) throw Error('Missing atlas template');
  const count = materialize(template, (file, body) => {
    const target = path.join(dir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body);
  });
  console.log('Atlas: ' + count + ' canonical HTML pages and ' + items.length + ' item records.');
}
if (require.main === module) build(path.resolve('dist'));
module.exports = { materialize, build };
