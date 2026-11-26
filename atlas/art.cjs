// Editorial covers are navigation artwork. The detail page uses the unmodified teaching diagrams.
const ink = '#1c201f',
  paper = '#e9e5d9',
  red = '#dc4835';
const paths = {
  'C-001':
    '<path fill="' +
    ink +
    '" d="M0 200V136L200 67 73 200ZM113 200l87-133 41 133ZM300 100v100h-43L200 67Z"/><circle cx="200" cy="67" r="11" fill="' +
    red +
    '"/>',
  'C-002': [91, 71, 53, 35, 14]
    .map(
      (r, i) =>
        '<circle cx="150" cy="100" r="' + r + '" fill="' + [ink, paper, ink, paper, red][i] + '"/>',
    )
    .join(''),
  'C-003':
    '<path fill="' +
    ink +
    '" d="M22 185V88a62 62 0 0 1 124 0v97h-33V88a29 29 0 0 0-58 0v97Zm132 0V88a62 62 0 0 1 124 0v97h-33V88a29 29 0 0 0-58 0v97Z"/><circle cx="150" cy="157" r="9" fill="' +
    red +
    '"/>',
  'C-004':
    '<path fill="' +
    ink +
    '" d="M0 0h121a57 57 0 0 1 57 57v143H0Z"/><circle cx="248" cy="139" r="12" fill="' +
    red +
    '"/>',
  'C-005':
    '<path fill="' +
    ink +
    '" d="m-54 187 266-202h59L-18 205Zm64 27L302-8v47L84 204Zm104 0 194-147v21L154 206Z"/><circle cx="205" cy="58" r="12" fill="' +
    red +
    '"/>',
  'C-006':
    '<path d="m150 37-105 130h210Z" stroke="' +
    ink +
    '" stroke-width="2" fill="none"/><circle cx="150" cy="37" r="19" fill="' +
    red +
    '"/><circle cx="45" cy="167" r="22" fill="' +
    ink +
    '"/><circle cx="255" cy="167" r="22" fill="' +
    ink +
    '"/>',
  'C-007':
    '<rect width="300" height="200" fill="' +
    ink +
    '"/>' +
    Array.from(
      { length: 54 },
      (_, i) =>
        '<path d="M150 100 390 95 390 105Z" fill="' +
        paper +
        '" transform="rotate(' +
        (i * 360) / 54 +
        ' 150 100)"/>',
    ).join('') +
    '<circle cx="150" cy="100" r="30" fill="' +
    red +
    '"/>',
  'C-008':
    '<path d="M-15 231C305 141 300 134 165 114S44 45 270 -13" stroke="' +
    ink +
    '" fill="none" stroke-width="56"/><circle cx="225" cy="15" r="9" fill="' +
    red +
    '"/>',
};
const guides = {
  'C-001': 'M100 0v200M200 0v200M0 66.667h300M0 133.333h300',
  'C-002': 'M150 0v200M0 100h300',
  'C-003': 'M150 0v200',
  'C-004': 'M0 139h300',
  'C-005': 'M0 200 268 0',
  'C-006': 'M150 37 45 167h210Z',
  'C-007': 'M0 100h300M150 0v200',
  'C-008': 'M-15 231C305 141 300 134 165 114S44 45 270 -13',
};
function svg(body, background = paper) {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200"><rect width="300" height="200" fill="' +
    background +
    '"/>' +
    body +
    '</svg>'
  );
}
const poster = {
  composition: svg(
    '<path d="M-20 217 176 -12h54L59 214Zm124-9L280-12h29L144 213Z" fill="' +
      ink +
      '"/><circle cx="106" cy="57" r="36" fill="' +
      red +
      '"/>',
  ),
  styles: svg(
    '<path d="M80 200V77a70 70 0 0 1 140 0v123" fill="' +
      paper +
      '"/><path d="M100 200V80a50 50 0 0 1 100 0v120" fill="' +
      ink +
      '"/><path d="M119 200V82a31 31 0 0 1 62 0v118" fill="' +
      paper +
      '"/><path d="M138 200V84a12 12 0 0 1 24 0v116" fill="' +
      red +
      '"/>',
    ink,
  ),
  browse: svg(
    Array.from(
      { length: 18 },
      (_, i) =>
        '<path d="M-25 ' +
        (206 - i * 8) +
        ' Q90 ' +
        (8 - i * 9) +
        ' 154 ' +
        (113 - i * 6) +
        'T335 ' +
        (40 - i * 5) +
        '" fill="none" stroke="' +
        ink +
        '" stroke-width="3"/>',
    ).join('') +
      '<circle cx="233" cy="51" r="23" fill="' +
      red +
      '"/>',
  ),
};
module.exports = {
  covers: Object.fromEntries(Object.entries(paths).map(([k, v]) => [k, svg(v)])),
  guides,
  poster,
  svg,
  ink,
  paper,
  red,
};
