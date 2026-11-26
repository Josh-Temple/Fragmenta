import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { selectRows, results, pageSize, pageUrl } from '../atlas/list.mjs';
import { canonicalLocation } from '../atlas/paths.mjs';
const require = createRequire(import.meta.url);
const { items, compositionPurposes, indexRow, exportPath } = require('../atlas/catalog.cjs');
const root = path.resolve('dist'),
  origin = 'https://fragmenta-6ke.pages.dev';
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const paths = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
assert.equal(new Set(paths).size, paths.length);
const known = new Set([...paths, '/search', '/404']);
const htmlPath = (url) => (url === '/' ? 'index.html' : url.slice(1) + '.html');
let links = 0;
for (const url of known) {
  const html = read(htmlPath(url));
  assert.equal((html.match(/<h1\b/g) || []).length, 1, url + ' needs one heading');
  if (!['/search', '/404'].includes(url))
    assert(html.includes('<link rel="canonical" href="' + origin + url + '">'), url);
  for (const m of html.matchAll(/<(?:a|img|link)\b[^>]*?\s(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const p = m[1];
    if (!p || p.startsWith('//')) continue;
    assert(
      known.has(canonicalLocation(origin + p) || p) || fs.existsSync(path.join(root, p)),
      url + ' links to missing ' + p,
    );
    links++;
  }
}
const totals = {
  composition: 120,
  styles: 24,
  browse: 18,
  tools: 2,
  collections: 4,
  knowledge: 180,
  upcoming: 12,
  'tools/upcoming': 10,
};
for (const [key, n] of Object.entries(totals))
  assert.equal(items.filter((i) => i.section === key).length, n);
for (const i of items) {
  const html = read(htmlPath(i.path)),
    doc = JSON.parse(read(exportPath(i)));
  assert(
    paths.includes(i.path) && doc.canonical === origin + i.path && doc.publicationStatus === i.status,
    i.path,
  );
  assert(
    html.includes(i.title.replaceAll('&', '&amp;')) &&
      html.includes(doc.statusLabel) &&
      html.includes(exportPath(i)),
    i.path,
  );
  assert(html.includes('出典') && html.includes('権利'), i.path);
  if (i.section === 'composition') {
    assert.equal((html.match(/<figure>/g) || []).length, 2, i.id);
    assert.equal(doc.reviewStatus, 'draft_unreviewed');
    assert.equal(doc.evidenceStatus, 'not_checked');
    assert.deepEqual(doc.diagram, i.record.diagram);
  }
  if (i.section === 'knowledge') {
    assert.equal(doc.status, 'proposal');
    assert.equal(doc.editorial.evidenceStatus, 'not_checked');
  }
  if (i.section === 'browse') {
    assert.equal(doc.rights.grantActive, false);
    assert(doc.defaultCode && doc.defaultPrompt.includes('再利用'));
  }
}
const rows = items.map(indexRow);
for (const p of compositionPurposes)
  assert.deepEqual(
    selectRows(rows, new URLSearchParams({ q: p.titleJa }), compositionPurposes)
      .map((r) => r.id)
      .sort(),
    p.choices.map((c) => c.guideId).sort(),
  );
assert(selectRows(rows, new URLSearchParams({ q: 'Swiss' })).some((r) => r.path === '/styles/swiss'));
for (const [from, to] of [
  ['/#/composition?id=C-001&purpose=placement', '/composition/C-001?purpose=placement'],
  ['/styles?style=swiss', '/styles/swiss'],
  ['/composition?view=atlas&id=C-001', '/composition'],
  ['/a/elastic-button', '/p/elastic-button'],
])
  assert.equal(canonicalLocation(origin + from), to);
assert.equal(pageUrl('search', 2, new URLSearchParams({ q: 'UI' })), '/search?q=UI&page=2');
console.log(
  'PASS atlas: ' +
    items.length +
    ' HTML/JSON pairs, 240 comparison figures, ' +
    links +
    ' local links, ' +
    paths.length +
    ' sitemap URLs, 15 purposes.',
);
if (process.argv.includes('--scale')) {
  const base = rows.filter((r) => r.section === 'composition');
  for (const count of [base.length, 1000, 3000]) {
    const entries = Array.from({ length: count }, (_, n) => ({
      ...base[n % base.length],
      id: 'test-' + n,
      path: '/sample/' + n,
    }));
    const before = performance.now();
    let total = 0;
    for (let p = 1; p <= Math.ceil(count / pageSize); p++)
      total += Buffer.byteLength(results(entries, 'composition', p, new URLSearchParams(), true));
    const generationMs = performance.now() - before;
    const samples = [];
    for (let n = 0; n < 40; n++) {
      const start = performance.now();
      selectRows(entries, new URLSearchParams({ q: ['余白', '三分割', '名称のない項目'][n % 3] }));
      samples.push(performance.now() - start);
    }
    const page = results(entries, 'composition', 1, new URLSearchParams(), true);
    assert.equal((page.match(/class="specimen"/g) || []).length, 24);
    console.log(
      JSON.stringify({
        items: count,
        cards: 24,
        firstPageBytesGzip: gzipSync(page).length,
        indexBytesGzip: gzipSync(JSON.stringify(entries)).length,
        searchP95Ms: +samples.sort((a, b) => a - b)[37].toFixed(2),
        listGenerationMs: +generationMs.toFixed(2),
        allListHtmlBytes: total,
      }),
    );
  }
}
