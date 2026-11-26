const { svg } = require('./art.cjs');
const { load } = require('../scripts/load-data.cjs');
const { compositionFor } = load('data/design-style-composition');
const structures = {
  'strict-grid': 'M28 0v200M148 0v200M0 63h300',
  editorial: 'M29 0v200M178 0v200M0 89h300',
  diagonal: 'M41 198 222 0M26 0v200',
  stacked: 'M38 0v200M0 59h300M0 110h300',
  'soft-cards': 'M26 0v200M171 0v200M0 116h300',
  instrument: 'M30 0v200M0 71h300M0 153h300',
  retro: 'M32 0v200M0 62h300M0 145h300',
  quiet: 'M48 0v200M0 115h300',
};
function styleArt(style) {
  const t = style.tokens,
    font = { serif: 'Georgia,serif', sans: 'Arial,sans-serif', mono: 'monospace' }[t.font];
  const box = (x, y, w, h, color = t.surface, r = 0) =>
    '<rect x="' +
    x +
    '" y="' +
    y +
    '" width="' +
    w +
    '" height="' +
    h +
    '" fill="' +
    color +
    '" rx="' +
    r +
    '"/>';
  const type = (x, y, s, txt, color = t.text) =>
    '<text x="' +
    x +
    '" y="' +
    y +
    '" font-family="' +
    font +
    '" font-weight="700" font-size="' +
    s +
    '" fill="' +
    color +
    '">' +
    txt +
    '</text>';
  const circle = (x, y, r, color) =>
    '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '"/>';
  const rules = (x, y, w) => box(x, y, w, 3, t.muted) + box(x, y + 10, w * 0.72, 3, t.muted);
  const layouts = {
    'strict-grid':
      box(28, 33, 244, 4, t.text) +
      type(28, 96, 46, 'Aa') +
      box(148, 63, 124, 96, t.accent) +
      rules(28, 135, 89),
    editorial:
      type(29, 89, 74, 'Aa') +
      box(29, 100, 244, 2, t.text) +
      rules(29, 124, 122) +
      rules(178, 124, 84) +
      box(178, 149, 55, 6, t.accent),
    diagonal:
      '<path d="M41 198 167 0h55L96 198Z" fill="' +
      t.accent +
      '"/>' +
      type(26, 102, 52, 'Aa') +
      circle(238, 130, 26, t.text),
    stacked:
      box(44, 35, 213, 137, t.text) +
      box(38, 29, 213, 137, t.surface) +
      box(38, 59, 213, 6, t.text) +
      type(51, 110, 45, 'Aa') +
      box(51, 130, 122, 13, t.accent),
    'soft-cards':
      box(26, 26, 130, 148, t.surface, Math.max(8, t.radius)) +
      box(171, 26, 103, 78, t.surface, Math.max(8, t.radius)) +
      box(171, 116, 103, 58, t.accent, Math.max(8, t.radius)) +
      type(41, 115, 56, 'Aa'),
    instrument:
      box(30, 44, 240, 109, t.surface) +
      box(30, 68, 240, 3, t.accent) +
      type(45, 130, 49, '48') +
      [22, 34, 17, 45].map((h, i) => box(174 + 17 * i, 133 - h, 10, h, t.accent)).join(''),
    retro:
      box(32, 38, 236, 24, t.accent) +
      type(42, 125, 63, 'Aa') +
      [0, 1, 2, 3, 4, 5].map((n) => box(32 + 40 * n, 145, 29, 11, t.accent)).join(''),
    quiet: type(48, 115, 62, 'Aa') + rules(48, 132, 81) + circle(233, 55, 8, t.accent),
  };
  return svg(layouts[compositionFor(style)], t.background);
}
module.exports = { styleArt, styleGuide: (s) => structures[compositionFor(s)] };
