#!/usr/bin/env node
/*
 * Contact-sheet preview for authored composition entries.
 *
 *   node scripts/composition/preview.cjs basics            # one entries/<file>.cjs
 *   node scripts/composition/preview.cjs C-001 C-002       # specific ids
 *   node scripts/composition/preview.cjs basics --out /tmp/x.png
 *
 * Writes an HTML sheet and (if google-chrome exists) a PNG next to it.
 * Each row: ID/title | example (+guides) | comparison (+guides) | list cover.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadEntries, materialise } = require('./build.cjs');
const { toSvg } = require('./render.cjs');

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outPng = outIdx >= 0 ? args[outIdx + 1] : null;
const wanted = args.filter((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1));
const entries = loadEntries();
const titles = Object.fromEntries(require('../../data/composition-guides.json').guides.map((g) => [g.id, g.titleJa]));
const pick = [...entries.entries()].filter(([id, e]) =>
  !wanted.length || wanted.includes(id) || wanted.includes(e.__file.replace(/\.cjs$/, '')));
if (!pick.length) { console.error('No entries matched', wanted); process.exit(1); }

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const rows = pick.map(([id, e]) => {
  const d = materialise(id, e);
  return `<section><header><b>${id}</b> ${esc(e.titleJa ?? titles[id] ?? '')}<small>変えた要素：${esc(e.changed)}</small></header>
  <div class="row">
   <figure>${toSvg(d.example, { guides: d.guides.example, width: 420, height: 262.5, guideOpacity: 0.5 })}<figcaption><b>配置例</b> ${esc(e.example)}</figcaption></figure>
   <figure>${toSvg(d.comparison, { guides: d.guides.comparison, width: 420, height: 262.5, guideOpacity: 0.5 })}<figcaption><b>対照例</b> ${esc(e.contrast)}</figcaption></figure>
   <figure class="cover">${toSvg(d.cover ?? d.example, { width: 210, height: 140 })}<figcaption>一覧の表紙</figcaption></figure>
  </div></section>`;
});
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:24px;background:#f6f5f0;font:13px/1.5 'Noto Sans CJK JP',sans-serif;color:#121316;width:1120px}
section{border-top:1px solid #0002;padding:10px 0 14px}header{font-size:15px;margin-bottom:6px}header small{display:block;color:#52555e;font-size:12px}
.row{display:flex;gap:14px;align-items:flex-start}figure{margin:0;width:420px}figure.cover{width:210px}figcaption{color:#52555e;font-size:12px;margin-top:4px}svg{display:block;border:1px solid #0002}
</style>${rows.join('')}`;
const base = outPng ? outPng.replace(/\.png$/, '') : path.join('/tmp/composition-preview', (wanted.join('_') || 'all'));
fs.mkdirSync(path.dirname(base), { recursive: true });
fs.writeFileSync(base + '.html', html);
const height = 80 + pick.length * 385;
try {
  execFileSync('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--window-size=1170,' + height, '--screenshot=' + base + '.png', 'file://' + base + '.html'], { stdio: 'ignore' });
  console.log('Preview: ' + base + '.png');
} catch {
  console.log('Preview HTML: ' + base + '.html (chrome unavailable)');
}
