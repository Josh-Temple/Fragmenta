/*
 * Plain-string SVG renderer for composition shapes (no React).
 * Mirrors components/CompositionDiagram.tsx so previews, covers and X-RAY overlays
 * produced at build time look identical to the figures on the detail pages.
 */
'use strict';
const { PALETTE, W, H } = require('./lib.cjs');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const col = (i) => (i === -1 || i === undefined || i === null ? 'none' : PALETTE[i]);

function shape(s, guide = false) {
  const [k, ...v] = s;
  if (guide) {
    const stroke = PALETTE[7];
    if (k === 'line') return `<line x1="${v[0]}" y1="${v[1]}" x2="${v[2]}" y2="${v[3]}" stroke="${stroke}" stroke-width="${v[5] ?? 0.8}" stroke-dasharray="3 2"/>`;
    if (k === 'path') return `<path d="${v[0]}" fill="${v[1] === -1 ? 'none' : stroke}" stroke="${stroke}" stroke-width="${v[3] || 0.8}" stroke-dasharray="${v[4] ?? '3 2'}"/>`;
    if (k === 'circle') return `<circle cx="${v[0]}" cy="${v[1]}" r="${v[2]}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
    if (k === 'rect') return `<rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" fill="none" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="3 2"/>`;
    if (k === 'poly') return `<polygon points="${v[0]}" fill="${stroke}"/>`;
    if (k === 'text') return `<text x="${v[0]}" y="${v[1]}" fill="${stroke}" font-size="${v[4]}" font-family="sans-serif" font-weight="600">${esc(v[2])}</text>`;
    return '';
  }
  if (k === 'rect') return `<rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" fill="${col(v[4])}"/>`;
  if (k === 'circle') return `<circle cx="${v[0]}" cy="${v[1]}" r="${v[2]}" fill="${col(v[3])}"/>`;
  if (k === 'line') return `<line x1="${v[0]}" y1="${v[1]}" x2="${v[2]}" y2="${v[3]}" stroke="${col(v[4])}" stroke-width="${v[5]}" stroke-linecap="round"/>`;
  if (k === 'poly') return `<polygon points="${v[0]}" fill="${col(v[1])}"/>`;
  if (k === 'text') return `<text x="${v[0]}" y="${v[1]}" fill="${col(v[3])}" font-size="${v[4]}" font-family="sans-serif" font-weight="600">${esc(v[2])}</text>`;
  if (k === 'path')
    return `<path d="${v[0]}" fill="${col(v[1])}" stroke="${col(v[2])}" stroke-width="${v[3] || 0}"${v[4] ? ` stroke-dasharray="${v[4]}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
  return '';
}

/**
 * @param shapes scene shapes
 * @param opts.guides guide shapes (optional)
 * @param opts.width/height outer size; viewBox is always 240×150 and is centred (meet).
 * @param opts.guideOpacity 0..1
 */
function toSvg(shapes, opts = {}) {
  const width = opts.width ?? W;
  const height = opts.height ?? H;
  const guides = opts.guides ?? [];
  // Outer viewBox keeps 240×150 content centred inside the requested aspect.
  const scale = Math.min(width / W, height / H);
  const vbW = width / scale, vbH = height / scale;
  const ox = -(vbW - W) / 2, oy = -(vbH - H) / 2;
  const vb = [ox, oy, vbW, vbH].map((n) => Math.round(n * 1000) / 1000).join(' ');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${width}" height="${height}">` +
    `<rect x="${ox}" y="${oy}" width="${vbW}" height="${vbH}" fill="${PALETTE[5]}"/>` +
    `<g>${shapes.map((s) => shape(s)).join('')}</g>` +
    (guides.length ? `<g opacity="${opts.guideOpacity ?? 0.85}">${guides.map((s) => shape(s, true)).join('')}</g>` : '') +
    '</svg>'
  );
}

/** Convert guide shapes to a single path "d" (used for the list-page X-RAY overlay at 300×200). */
function guidesToPath(guides, width = 300, height = 200) {
  const scale = Math.min(width / W, height / H);
  const ox = (width - W * scale) / 2, oy = (height - H * scale) / 2;
  const X = (x) => Math.round((ox + Number(x) * scale) * 10) / 10;
  const Y = (y) => Math.round((oy + Number(y) * scale) * 10) / 10;
  const parts = [];
  for (const s of guides) {
    const [k, ...v] = s;
    if (k === 'line') parts.push(`M${X(v[0])} ${Y(v[1])}L${X(v[2])} ${Y(v[3])}`);
    else if (k === 'rect') parts.push(`M${X(v[0])} ${Y(v[1])}H${X(v[0] + v[2])}V${Y(v[1] + v[3])}H${X(v[0])}Z`);
    else if (k === 'circle') {
      const r = Math.round(v[2] * scale * 10) / 10;
      parts.push(`M${X(v[0]) - r} ${Y(v[1])}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`);
    } else if (k === 'poly') {
      const p = String(v[0]).trim().split(/\s+/).map((q) => q.split(',').map(Number));
      parts.push('M' + p.map(([x, y]) => X(x) + ' ' + Y(y)).join('L') + 'Z');
    } else if (k === 'path') {
      // transform absolute commands only (guides are authored with absolute coords via lib.g helpers)
      const d = String(v[0]).replace(/([MLQCTAHVZmlqctahvz])|(-?\d*\.?\d+(?:e-?\d+)?)/g, (m) => m);
      const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
      let out = '', cmd = '', idx = 0;
      for (const t of tokens) {
        if (/[A-Za-z]/.test(t)) { cmd = t; idx = 0; out += t; continue; }
        const n = Number(t);
        if (cmd === 'H') out += X(n) + ' ';
        else if (cmd === 'V') out += Y(n) + ' ';
        else if (cmd === 'A') { const pos = idx % 7; out += (pos === 5 ? X(n) : pos === 6 ? Y(n) : pos < 2 ? Math.round(n * scale * 10) / 10 : n) + ' '; }
        else if (cmd === cmd.toUpperCase()) out += (idx % 2 === 0 ? X(n) : Y(n)) + ' ';
        else out += Math.round(n * scale * 10) / 10 + ' ';
        idx++;
      }
      parts.push(out.trim());
    }
  }
  return parts.join('');
}

module.exports = { toSvg, guidesToPath, shape };
