const { svg, ink, paper, red } = require('./art.cjs');
const rect = (x, y, w, h, fill = ink, r = 0) =>
  '<rect x="' +
  x +
  '" y="' +
  y +
  '" width="' +
  w +
  '" height="' +
  h +
  '" rx="' +
  r +
  '" fill="' +
  fill +
  '"/>';
const circle = (x, y, r, color) =>
  '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '"/>';
const line = (x, y, x2, y2, color = ink) =>
  '<path d="M' +
  x +
  ' ' +
  y +
  ' ' +
  x2 +
  ' ' +
  y2 +
  '" fill="none" stroke="' +
  color +
  '" stroke-width="2"/>';
const lines = (x, y, n, width) =>
  Array.from({ length: n }, (_, i) =>
    rect(x, y + i * 11, width - (i === n - 1 ? width * 0.28 : 0), 3),
  ).join('');
const text = (x, y, txt, size, color = ink) =>
  '<text x="' +
  x +
  '" y="' +
  y +
  '" fill="' +
  color +
  '" font-family="Georgia,serif" font-size="' +
  size +
  '">' +
  txt +
  '</text>';
const panel = rect(40, 27, 220, 147, '#f8f4e8');
const shapes = {
  'inline-validation':
    panel +
    lines(60, 61, 1, 66) +
    rect(60, 81, 179, 35, ink) +
    rect(62, 83, 175, 31, paper) +
    line(186, 97, 191, 104, red) +
    line(191, 104, 201, 91, red) +
    lines(60, 130, 1, 100),
  'article-table-of-contents':
    panel + rect(59, 48, 4, 105, red) + lines(73, 55, 3, 45) + lines(145, 58, 9, 85),
  'readable-article': panel + text(66, 78, 'Aa', 43) + lines(67, 96, 6, 150),
  'native-faq':
    panel +
    Array.from(
      { length: 3 },
      (_, i) =>
        lines(61, 54 + i * 40, 1, 84) +
        line(59, 72 + i * 40, 236, 72 + i * 40) +
        text(218, 59 + i * 40, '+', 19, red),
    ).join(''),
  'pricing-comparison': [0, 1, 2]
    .map(
      (i) =>
        rect(33 + i * 80, 46, 73, 110, i === 1 ? ink : '#f8f4e8') +
        rect(44 + i * 80, 73, 43, 6, i === 1 ? paper : ink) +
        rect(44 + i * 80, 129, 44, 10, red),
    )
    .join(''),
  'release-timeline':
    line(93, 31, 93, 165) +
    [55, 99, 143].map((y, i) => circle(93, y, 6, i ? ink : red) + lines(113, y - 5, 2, 85)).join(''),
  'metric-summary':
    panel +
    text(62, 94, '78', 56) +
    [30, 49, 40, 70, 94].map((n, i) => rect(138 + i * 19, 148 - n, 12, n, i === 4 ? red : ink)).join(''),
  'breadcrumb-trail': [50, 120, 190]
    .map(
      (x, i) =>
        rect(x, 88, 45, 22, i === 2 ? red : ink, 2) + (i === 2 ? '' : text(x + 51, 107, '›', 28)),
    )
    .join(''),
  'empty-state': panel + circle(150, 79, 22, ink) + rect(135, 76, 30, 5, paper) + lines(103, 118, 2, 92),
  'responsive-data-table':
    panel +
    rect(57, 48, 186, 20, ink) +
    [78, 102, 126, 150].map((y) => line(57, y, 242, y)).join('') +
    line(126, 48, 126, 150) +
    line(191, 48, 191, 150),
  'elastic-button':
    rect(83, 81, 147, 61, ink, 30) + rect(75, 70, 147, 61, red, 30) + line(116, 100, 182, 100, paper),
  'smart-skeleton':
    panel +
    circle(87, 76, 19, '#b9b4a7') +
    rect(120, 64, 95, 8, '#aaa598', 4) +
    rect(120, 84, 66, 7, '#ccc6b9', 3) +
    rect(66, 121, 151, 9, '#ccc6b9', 3),
  'fluid-toggle': rect(67, 61, 166, 79, ink, 40) + circle(191, 100, 30, red),
  'glass-tilt':
    '<path d="m78 62 125-32 25 107-126 32Z" fill="' +
    ink +
    '"/><path d="m94 77 125-32 25 107-126 32Z" fill="' +
    red +
    '" fill-opacity=".78"/>',
  'glitch-text':
    text(44, 111, 'GLITCH', 47, red) + text(41, 107, 'GLITCH', 47) + rect(42, 91, 209, 3, paper),
  'morph-fab': circle(150, 100, 43, red) + rect(126, 97, 48, 6, paper) + rect(147, 76, 6, 48, paper),
  'warm-neo-brutalist-editorial':
    rect(55, 38, 195, 135, ink) +
    rect(49, 32, 195, 135, red) +
    text(62, 103, 'Aa', 72, paper) +
    rect(65, 128, 149, 6, ink),
  'editorial-split-layout':
    panel + rect(40, 27, 104, 147, ink) + circle(93, 86, 24, red) + lines(158, 62, 6, 87),
};
const patternArt = (id) => {
  if (!shapes[id]) throw Error('Missing pattern cover: ' + id);
  return svg(shapes[id]);
};

// Structural guides follow the edges, axes or baselines of the specific cover.
const guides = {
  'inline-validation': 'M60 0v200M0 81h300',
  'article-table-of-contents': 'M59 0v200M145 0v200',
  'readable-article': 'M66 0v200M0 78h300',
  'native-faq': 'M60 0v200M0 72h300M0 112h300',
  'pricing-comparison': 'M33 0v200M113 0v200M193 0v200',
  'release-timeline': 'M93 0v200M113 0v200',
  'metric-summary': 'M0 148h300M138 0v200',
  'breadcrumb-trail': 'M0 99h300',
  'empty-state': 'M150 0v200M0 79h300',
  'responsive-data-table': 'M126 0v200M191 0v200M0 48h300',
  'elastic-button': 'M0 100h300M150 0v200',
  'smart-skeleton': 'M66 0v200M120 0v200',
  'fluid-toggle': 'M0 100h300M191 0v200',
  'glass-tilt': 'M78 62 203 30 228 137 102 169Z',
  'glitch-text': 'M0 107h300M41 0v200',
  'morph-fab': 'M0 100h300M150 0v200',
  'warm-neo-brutalist-editorial': 'M49 0v200M0 103h300',
  'editorial-split-layout': 'M144 0v200M158 0v200',
};
module.exports = { patternArt, guides };
