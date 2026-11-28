/*
 * Composition atlas — shared drawing vocabulary.
 *
 * Canvas: 240 × 150 (viewBox). All figures are flat editorial plates.
 * Output: arrays of JSON "shapes" understood by components/CompositionDiagram.tsx
 *
 *   ['rect',   x, y, w, h, fill]
 *   ['circle', cx, cy, r, fill]
 *   ['line',   x1, y1, x2, y2, stroke, width]
 *   ['poly',   'x,y x,y …', fill]
 *   ['text',   x, y, caption, fill, size]
 *   ['path',   d, fill, stroke, width, dash?]   fill/stroke = palette index or -1 (none)
 *
 * Palette (index → role). Keep roles consistent across the whole atlas:
 *   0 ink        — primary dark masses, key structure
 *   1 graphite   — secondary dark masses, figures that are NOT the subject
 *   2 stone      — mid tone (buildings far away, secondary objects)
 *   3 mist       — light tone (far planes, sky features, soft structure)
 *   4 vermilion  — THE SUBJECT / focal accent. Use sparingly: ideally one thing.
 *   5 paper      — background colour; use for knock-outs (windows, gaps, highlights)
 *   6 sand       — ground planes, soft fields, floors
 *   7 cobalt     — annotation only (arrows, eye-lines, numbers). Never scenery.
 *
 * Guides (structure lines) are a SEPARATE layer: diagram.guides.example / .comparison.
 * They are rendered as thin cobalt dashed lines and emphasised by the X-RAY toggle.
 */
'use strict';

const W = 240;
const H = 150;
const C = { ink: 0, graphite: 1, stone: 2, mist: 3, red: 4, paper: 5, sand: 6, cobalt: 7, none: -1 };
const PALETTE = ['#17181b', '#4b4d53', '#8f8d87', '#c2bfb5', '#e2432a', '#eceae2', '#d9d5c9', '#2555ff'];

const r1 = (v) => Math.round(v * 10) / 10;
const pt = (x, y) => r1(x) + ',' + r1(y);
const pts = (list) => list.map(([x, y]) => pt(x, y)).join(' ');

/* ── primitives ─────────────────────────────────────────────────────────── */
const rect = (x, y, w, h, fill = C.ink) => ['rect', r1(x), r1(y), r1(w), r1(h), fill];
const circle = (cx, cy, r, fill = C.ink) => ['circle', r1(cx), r1(cy), r1(r), fill];
const line = (x1, y1, x2, y2, stroke = C.ink, width = 1.5) => ['line', r1(x1), r1(y1), r1(x2), r1(y2), stroke, width];
const poly = (list, fill = C.ink) => ['poly', pts(list), fill];
const text = (x, y, caption, fill = C.ink, size = 10) => ['text', r1(x), r1(y), caption, fill, size];
const path = (d, fill = C.ink, stroke = C.none, width = 0, dash) =>
  dash ? ['path', d, fill, stroke, width, dash] : ['path', d, fill, stroke, width];

/** Fill the whole canvas (scene background other than paper, e.g. night). */
const background = (fill) => rect(0, 0, W, H, fill);
/** Ground plane from y to the bottom edge. */
const ground = (y, fill = C.sand) => rect(0, y, W, H - y, fill);
/** Horizon line (thin). */
const horizon = (y, stroke = C.stone, width = 1) => line(0, y, W, y, stroke, width);

/* ── people ─────────────────────────────────────────────────────────────── */
/**
 * Standing figure. x = centre, y = feet, h = total height.
 * opts.facing: -1 left, 0 front/back, 1 right (head + body lean subtly)
 * opts.pose: 'stand' | 'walk' | 'run' | 'reach'
 */
function person(x, y, h, opts = {}) {
  const fill = opts.fill ?? C.ink;
  const facing = opts.facing ?? 0;
  const pose = opts.pose ?? 'stand';
  const r = h * 0.115;
  const lean = pose === 'run' ? h * 0.12 * (facing || 1) : pose === 'walk' ? h * 0.04 * (facing || 1) : 0;
  const headX = x + lean + facing * r * 0.18;
  const headY = y - h + r;
  const top = y - h + r * 2.25; // shoulder line
  const sw = h * 0.27; // shoulder width
  const hw = h * 0.2; // hip width
  const hipY = y - h * 0.46;
  const crotchY = y - h * 0.4;
  const sx = x + lean * 0.8; // shoulder centre (lean)
  const hx = x + lean * 0.25; // hip centre
  let stride = h * 0.05;
  if (pose === 'walk') stride = h * 0.14;
  if (pose === 'run') stride = h * 0.24;
  const footW = h * 0.075;
  const lx = hx - stride; // left foot centre
  const rx = hx + stride; // right foot centre
  const d =
    'M' + pt(sx - sw / 2, top + r * 0.9) +
    ' Q' + pt(sx - sw / 2, top) + ' ' + pt(sx - sw * 0.2, top) +
    ' L' + pt(sx + sw * 0.2, top) +
    ' Q' + pt(sx + sw / 2, top) + ' ' + pt(sx + sw / 2, top + r * 0.9) +
    ' L' + pt(hx + hw / 2, hipY) +
    ' L' + pt(rx + footW, y) + ' L' + pt(rx - footW * 0.6, y) +
    ' L' + pt(hx, crotchY) +
    ' L' + pt(lx + footW * 0.6, y) + ' L' + pt(lx - footW, y) +
    ' L' + pt(hx - hw / 2, hipY) + ' Z';
  const out = [path(d, fill), circle(headX, headY, r, fill)];
  if (pose === 'reach') {
    const ax = sx + (facing || 1) * sw * 1.6;
    out.push(line(sx + (facing || 1) * sw * 0.35, top + r * 0.4, ax, top - r * 1.2, fill, Math.max(1, h * 0.06)));
  }
  return out;
}

/**
 * Head-and-shoulders bust for close framings.
 * cx = centre, y = bottom edge of the shoulders (may lie below the canvas to crop), s = head radius.
 * opts.fill = clothing, opts.hair = hair colour, opts.skin = face colour, opts.facing = -1|0|1
 */
function bust(cx, y, s, opts = {}) {
  const fill = opts.fill ?? C.ink;
  const hair = opts.hair ?? C.ink;
  const skin = opts.skin ?? C.mist;
  const facing = opts.facing ?? 0;
  const hx = cx + facing * s * 0.15;
  const headY = y - s * 3.1;
  const out = [];
  out.push(
    path(
      'M' + pt(cx - s * 2.6, y) +
        ' Q' + pt(cx - s * 2.5, y - s * 1.55) + ' ' + pt(cx - s * 0.9, y - s * 1.75) +
        ' L' + pt(cx + s * 0.9, y - s * 1.75) +
        ' Q' + pt(cx + s * 2.5, y - s * 1.55) + ' ' + pt(cx + s * 2.6, y) + ' Z',
      fill,
    ),
  );
  out.push(rect(cx - s * 0.36, headY + s * 0.55, s * 0.72, s * 1.05, skin));
  out.push(path('M' + pt(hx - s * 0.92, headY - s * 0.05) + ' Q' + pt(hx - s * 0.95, headY + s * 1.05) + ' ' + pt(hx, headY + s * 1.08) + ' Q' + pt(hx + s * 0.95, headY + s * 1.05) + ' ' + pt(hx + s * 0.92, headY - s * 0.05) + ' Z', skin));
  // hair: cap over the top of the head, longer on the back side when in profile
  const back = facing ? -facing : 0;
  out.push(
    path(
      'M' + pt(hx - s * 1.0, headY + s * (back < 0 ? 0.55 : 0.12)) +
        ' Q' + pt(hx - s * 1.08, headY - s * 1.12) + ' ' + pt(hx, headY - s * 1.1) +
        ' Q' + pt(hx + s * 1.08, headY - s * 1.12) + ' ' + pt(hx + s * 1.0, headY + s * (back > 0 ? 0.55 : 0.12)) +
        ' Q' + pt(hx + s * 0.4 * (facing || 1), headY - s * 0.42) + ' ' + pt(hx - s * 1.0, headY + s * (back < 0 ? 0.55 : 0.12)) + ' Z',
      hair,
    ),
  );
  const eye = Math.max(0.8, s * 0.09);
  if (facing) {
    const fx = hx + facing * s * 0.93;
    out.push(poly([[fx, headY + s * 0.1], [fx + facing * s * 0.26, headY + s * 0.42], [fx - facing * s * 0.02, headY + s * 0.5]], skin));
    out.push(circle(hx + facing * s * 0.55, headY + s * 0.18, eye, hair));
  } else {
    out.push(circle(hx - s * 0.36, headY + s * 0.2, eye, hair));
    out.push(circle(hx + s * 0.36, headY + s * 0.2, eye, hair));
  }
  return out;
}

/** Cyclist seen from the side. (x, y) = ground contact centre, s = wheel radius, angle = slope in degrees (negative = uphill to the right). */
function cyclist(x, y, s, angle = 0, fill = C.red, facing = 1) {
  const a = (angle * Math.PI) / 180;
  const R = (dx, dy) => [x + (dx * facing) * Math.cos(a) - dy * Math.sin(a), y + (dx * facing) * Math.sin(a) + dy * Math.cos(a)];
  const P = (dx, dy) => pt(...R(dx, dy));
  const w = Math.max(1, s * 0.22);
  const ring = (dx) => {
    const [cx, cy] = R(dx, -s);
    return path('M' + pt(cx - s, cy) + ' a' + r1(s) + ' ' + r1(s) + ' 0 1 0 ' + r1(2 * s) + ' 0 a' + r1(s) + ' ' + r1(s) + ' 0 1 0 ' + r1(-2 * s) + ' 0', C.none, fill, w);
  };
  return [
    ring(-s * 1.7),
    ring(s * 1.7),
    path('M' + P(-s * 1.7, -s) + ' L' + P(-s * 0.2, -s) + ' L' + P(s * 1.1, -s * 2.3) + ' L' + P(-s * 0.7, -s * 2.3) + ' Z M' + P(s * 1.1, -s * 2.3) + ' L' + P(s * 1.7, -s) + ' M' + P(-s * 0.7, -s * 2.3) + ' L' + P(-s * 0.2, -s), C.none, fill, w),
    // rider: thigh, shin, torso leaning forward, arm
    path('M' + P(-s * 0.75, -s * 2.6) + ' L' + P(s * 0.25, -s * 1.9) + ' L' + P(-s * 0.1, -s * 1.0), C.none, fill, w * 1.6),
    path('M' + P(-s * 0.75, -s * 2.6) + ' L' + P(s * 0.55, -s * 3.9), C.none, fill, w * 2.4),
    path('M' + P(s * 0.45, -s * 3.7) + ' L' + P(s * 1.25, -s * 2.6), C.none, fill, w * 1.3),
    circle(...R(s * 0.95, -s * 4.55), s * 0.55, fill),
  ];
}

/** Simple face disc used for extreme close-ups. */
function face(cx, cy, r, opts = {}) {
  const skin = opts.skin ?? C.mist;
  const ink = opts.fill ?? C.ink;
  const facing = opts.facing ?? 0;
  const ox = facing * r * 0.25;
  return [
    circle(cx, cy, r, skin),
    path('M' + pt(cx - r, cy - r * 0.05) + ' A' + r1(r) + ' ' + r1(r) + ' 0 0 1 ' + pt(cx + r, cy - r * 0.05) + ' Q' + pt(cx, cy - r * 0.55) + ' ' + pt(cx - r, cy - r * 0.05) + ' Z', ink),
    circle(cx - r * 0.35 + ox, cy + r * 0.1, Math.max(0.9, r * 0.08), ink),
    circle(cx + r * 0.35 + ox, cy + r * 0.1, Math.max(0.9, r * 0.08), ink),
    line(cx - r * 0.2 + ox, cy + r * 0.5, cx + r * 0.2 + ox, cy + r * 0.5, ink, Math.max(0.8, r * 0.06)),
  ];
}

/** A row of small figures (crowd). */
function crowd(x0, x1, y, h, n, opts = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const jitter = opts.jitter ? ((i * 37) % 7) / 7 - 0.5 : 0;
    out.push(...person(x0 + (x1 - x0) * t, y + jitter * h * 0.08, h * (1 + jitter * 0.12), { fill: opts.fill ?? C.graphite, facing: opts.facing ?? 0 }));
  }
  return out;
}

/** Top-down person marker: head disc with a facing wedge (for plan diagrams). */
function plannedPerson(x, y, r, angleDeg, fill = C.ink) {
  const a = (angleDeg * Math.PI) / 180;
  const nx = x + Math.cos(a) * r * 1.7;
  const ny = y + Math.sin(a) * r * 1.7;
  const px = -Math.sin(a) * r * 0.6;
  const py = Math.cos(a) * r * 0.6;
  return [poly([[x + px, y + py], [nx, ny], [x - px, y - py]], fill), circle(x, y, r, fill)];
}

/** Top-down camera: body + lens wedge pointing at angle. */
function camera(x, y, angleDeg, fill = C.red, size = 6) {
  const a = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  const rot = (dx, dy) => [x + dx * cos - dy * sin, y + dx * sin + dy * cos];
  return [
    poly([rot(-size, -size * 0.6), rot(size * 0.3, -size * 0.6), rot(size * 0.3, size * 0.6), rot(-size, size * 0.6)], fill),
    poly([rot(size * 0.3, -size * 0.25), rot(size * 1.1, -size * 0.6), rot(size * 1.1, size * 0.6), rot(size * 0.3, size * 0.25)], fill),
  ];
}

/* ── environment ────────────────────────────────────────────────────────── */
/** Building with optional window grid. (x, y) = top-left. */
function building(x, y, w, h, opts = {}) {
  const fill = opts.fill ?? C.stone;
  const out = [rect(x, y, w, h, fill)];
  if (opts.windows !== false) {
    const cols = opts.cols ?? Math.max(1, Math.round(w / 9));
    const rows = opts.rows ?? Math.max(1, Math.round(h / 11));
    const gx = w / cols, gy = h / rows;
    const ww = gx * 0.42, wh = gy * 0.45;
    const win = opts.windowFill ?? C.paper;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows - (opts.door ? 1 : 0); r++)
        out.push(rect(x + c * gx + (gx - ww) / 2, y + r * gy + gy * 0.28, ww, wh, win));
  }
  if (opts.roof === 'gable') out.push(poly([[x - 1, y], [x + w / 2, y - w * 0.32], [x + w + 1, y]], fill));
  if (opts.door) out.push(rect(x + w / 2 - w * 0.09, y + h - Math.min(14, h * 0.22), w * 0.18, Math.min(14, h * 0.22), opts.windowFill ?? C.paper));
  return out;
}

/** Skyline of simple blocks between x0 and x1 standing on baseY. heights = array */
function skyline(x0, x1, baseY, heights, fill = C.mist, opts = {}) {
  const n = heights.length;
  const w = (x1 - x0) / n;
  const out = [];
  heights.forEach((hh, i) => {
    out.push(...building(x0 + i * w + 0.6, baseY - hh, w - 1.2, hh, { fill, windows: opts.windows ?? false, windowFill: opts.windowFill }));
  });
  return out;
}

/** Deciduous tree: trunk + canopy. x = trunk centre, y = ground, h = height. */
function tree(x, y, h, fill = C.graphite) {
  const r = h * 0.3;
  return [rect(x - h * 0.035, y - h * 0.45, h * 0.07, h * 0.45, fill), circle(x, y - h + r, r, fill), circle(x - r * 0.55, y - h + r * 1.5, r * 0.7, fill), circle(x + r * 0.55, y - h + r * 1.5, r * 0.7, fill)];
}

/** Conifer: stacked triangles. */
function pine(x, y, h, fill = C.graphite) {
  const w = h * 0.5;
  return [
    rect(x - h * 0.03, y - h * 0.16, h * 0.06, h * 0.16, fill),
    poly([[x - w / 2, y - h * 0.14], [x, y - h * 0.62], [x + w / 2, y - h * 0.14]], fill),
    poly([[x - w * 0.4, y - h * 0.44], [x, y - h], [x + w * 0.4, y - h * 0.44]], fill),
  ];
}

/** Mountain ridge polygon from a list of [x, y] peaks, closed down to baseY. */
function ridge(peaks, baseY = H, fill = C.mist) {
  const list = [[peaks[0][0], baseY], ...peaks, [peaks[peaks.length - 1][0], baseY]];
  return poly(list, fill);
}

/** Sun / moon disc. */
const sun = (x, y, r, fill = C.mist) => circle(x, y, r, fill);

/** Road in one-point perspective: bottom edge from xl..xr converging to (vx, vy). */
function road(xl, xr, vx, vy, fill = C.stone, opts = {}) {
  const out = [poly([[xl, H], [xr, H], [vx + (opts.farHalf ?? 1.5), vy], [vx - (opts.farHalf ?? 1.5), vy]], fill)];
  if (opts.centerLine) {
    for (let i = 0; i < 6; i++) {
      const t0 = Math.pow(i / 6, 1.6), t1 = Math.pow((i + 0.5) / 6, 1.6);
      const cx = (xl + xr) / 2;
      const ax = cx + (vx - cx) * t0, ay = H + (vy - H) * t0;
      const bx = cx + (vx - cx) * t1, by = H + (vy - H) * t1;
      out.push(line(ax, ay, bx, by, opts.centerLine, Math.max(0.6, 2.4 * (1 - t0))));
    }
  }
  return out;
}

/** Arch / doorway opening drawn as a dark wall with a paper opening. */
function archway(x, y, w, h, opts = {}) {
  const fill = opts.fill ?? C.ink;
  const ow = opts.openingW ?? w * 0.55;
  const oh = opts.openingH ?? h * 0.75;
  const ox = x + (w - ow) / 2;
  const oy = y + h - oh;
  const d =
    'M' + pt(x, y) + ' H' + r1(x + w) + ' V' + r1(y + h) + ' H' + r1(ox + ow) + ' V' + r1(oy + ow / 2) +
    ' A' + r1(ow / 2) + ' ' + r1(ow / 2) + ' 0 0 0 ' + pt(ox, oy + ow / 2) + ' V' + r1(y + h) + ' H' + r1(x) + ' Z';
  return [path(d, fill)];
}

/** Window frame (frame-within-frame): thick border with an opening. */
function frameOpening(x, y, w, h, t, fill = C.ink) {
  const d = 'M' + pt(x, y) + ' h' + r1(w) + ' v' + r1(h) + ' h' + r1(-w) + ' Z M' + pt(x + t, y + t) + ' v' + r1(h - 2 * t) + ' h' + r1(w - 2 * t) + ' v' + r1(-(h - 2 * t)) + ' Z';
  return [path(d, fill)];
}

/** Column / pillar. */
const column = (x, y, w, h, fill = C.graphite) => [rect(x, y, w, h, fill), rect(x - w * 0.2, y, w * 1.4, h * 0.04 + 1, fill), rect(x - w * 0.2, y + h - (h * 0.04 + 1), w * 1.4, h * 0.04 + 1, fill)];

/** Lamp post. */
const lamp = (x, y, h, fill = C.graphite) => [rect(x - 0.7, y - h, 1.4, h, fill), rect(x - 3, y - h - 2, 6, 2.4, fill)];

/** Bird glyph (small "v"). */
const bird = (x, y, s = 3, stroke = C.graphite) => path('M' + pt(x - s, y - s * 0.4) + ' Q' + pt(x - s * 0.4, y - s * 0.6) + ' ' + pt(x, y) + ' Q' + pt(x + s * 0.4, y - s * 0.6) + ' ' + pt(x + s, y - s * 0.4), C.none, stroke, Math.max(0.7, s * 0.28));

/** Cloud (three overlapping discs on a flat base). */
function cloud(x, y, s, fill = C.mist) {
  return [circle(x - s * 0.9, y, s * 0.65, fill), circle(x, y - s * 0.35, s, fill), circle(x + s * 0.95, y, s * 0.7, fill), rect(x - s * 0.9, y, s * 1.85, s * 0.65, fill)];
}

/**
 * Tapered ribbon along a polyline/curve of centre points (river, path, road in depth).
 * points: [[x,y], …] from near to far; w0 near width, w1 far width.
 */
function ribbon(points, w0, w1, fill = C.stone) {
  const n = points.length;
  const left = [], right = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = points[i];
    const [ax, ay] = points[Math.max(0, i - 1)];
    const [bx, by] = points[Math.min(n - 1, i + 1)];
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2;
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  return poly([...left, ...right.reverse()], fill);
}

/** Sample a cubic Bézier into points (for ribbons). */
function bezier(p0, p1, p2, p3, steps = 24) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

/* ── graphic / layout ───────────────────────────────────────────────────── */
/** Placeholder text lines (for posters, pages, UI). */
function textLines(x, y, w, n, opts = {}) {
  const lh = opts.lineHeight ?? 5;
  const th = opts.thickness ?? 2;
  const fill = opts.fill ?? C.stone;
  const out = [];
  for (let i = 0; i < n; i++) {
    const ww = i === n - 1 && n > 1 ? w * (opts.lastRatio ?? 0.6) : w;
    out.push(rect(x, y + i * lh, ww, th, fill));
  }
  return out;
}

/** Headline block (thick bars). */
const headline = (x, y, w, n = 1, fill = C.ink, thickness = 6) => textLines(x, y, w, n, { lineHeight: thickness + 3, thickness, fill, lastRatio: 0.7 });

/** Stroked rectangle outline (panel / page / frame). */
function outline(x, y, w, h, stroke = C.ink, width = 1.5) {
  return path('M' + pt(x, y) + ' h' + r1(w) + ' v' + r1(h) + ' h' + r1(-w) + ' Z', C.none, stroke, width);
}

/** Speech bubble with tail pointing at (tx, ty). */
function bubble(cx, cy, rx, ry, tx, ty, fill = C.paper, stroke = C.ink) {
  const ang = Math.atan2(ty - cy, tx - cx);
  const bx1 = cx + Math.cos(ang - 0.25) * rx * 0.85, by1 = cy + Math.sin(ang - 0.25) * ry * 0.85;
  const bx2 = cx + Math.cos(ang + 0.25) * rx * 0.85, by2 = cy + Math.sin(ang + 0.25) * ry * 0.85;
  return [
    poly([[bx1, by1], [tx, ty], [bx2, by2]], fill),
    path('M' + pt(bx1, by1) + ' L' + pt(tx, ty) + ' L' + pt(bx2, by2), C.none, stroke, 1),
    path('M' + pt(cx - rx, cy) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 1 0 ' + pt(cx + rx, cy) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 1 0 ' + pt(cx - rx, cy) + ' Z', fill, stroke, 1),
    poly([[bx1, by1], [tx + (cx - tx) * 0.02, ty + (cy - ty) * 0.02], [bx2, by2]], fill),
  ];
}

/** Arrow from (x1,y1) to (x2,y2). Defaults to cobalt annotation. */
function arrow(x1, y1, x2, y2, stroke = C.cobalt, width = 1.4, head = 4.5) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - Math.cos(a) * head, by = y2 - Math.sin(a) * head;
  return [
    line(x1, y1, bx, by, stroke, width),
    poly([[x2, y2], [bx + Math.sin(a) * head * 0.55, by - Math.cos(a) * head * 0.55], [bx - Math.sin(a) * head * 0.55, by + Math.cos(a) * head * 0.55]], stroke),
  ];
}

/** Curved arrow via quadratic control point. */
function curveArrow(x1, y1, cx, cy, x2, y2, stroke = C.cobalt, width = 1.4, head = 4.5) {
  const a = Math.atan2(y2 - cy, x2 - cx);
  const bx = x2 - Math.cos(a) * head, by = y2 - Math.sin(a) * head;
  return [
    path('M' + pt(x1, y1) + ' Q' + pt(cx, cy) + ' ' + pt(bx, by), C.none, stroke, width),
    poly([[x2, y2], [bx + Math.sin(a) * head * 0.55, by - Math.cos(a) * head * 0.55], [bx - Math.sin(a) * head * 0.55, by + Math.cos(a) * head * 0.55]], stroke),
  ];
}

/** Numbered marker (annotation). */
const badge = (x, y, n, fill = C.cobalt) => [circle(x, y, 5, fill), text(x - 2.6, y + 3.2, String(n), C.paper, 8)];

/* ── guides (structure layer; draw with these and put into diagram.guides) ── */
const g = {
  line: (x1, y1, x2, y2) => line(x1, y1, x2, y2, C.cobalt, 0.8),
  path: (d) => path(d, C.none, C.cobalt, 0.8),
  thirds: () => [g.line(80, 0, 80, H), g.line(160, 0, 160, H), g.line(0, 50, W, 50), g.line(0, 100, W, 100)],
  center: () => [g.line(120, 0, 120, H), g.line(0, 75, W, 75)],
  vertical: (x) => g.line(x, 0, x, H),
  horizontal: (y) => g.line(0, y, W, y),
  diagonals: () => [g.line(0, 0, W, H), g.line(0, H, W, 0)],
  /** golden section lines (0.382 / 0.618). */
  golden: () => [g.line(W * 0.382, 0, W * 0.382, H), g.line(W * 0.618, 0, W * 0.618, H), g.line(0, H * 0.382, W, H * 0.382), g.line(0, H * 0.618, W, H * 0.618)],
  /** rays from a vanishing point through given target points, extended to canvas edge. */
  rays: (vx, vy, targets) =>
    targets.map(([tx, ty]) => {
      const dx = tx - vx, dy = ty - vy;
      const k = 400 / Math.max(1e-6, Math.hypot(dx, dy));
      return g.line(vx, vy, clampX(vx + dx * k), clampY(vy + dy * k));
    }),
  ring: (x, y, r = 5) => ['circle', r1(x), r1(y), r1(r), C.cobalt],
  label: (x, y, caption, size = 8) => text(x, y, caption, C.cobalt, size),
  box: (x, y, w, h) => outline(x, y, w, h, C.cobalt, 0.8),
  arrow: (x1, y1, x2, y2) => arrow(x1, y1, x2, y2, C.cobalt, 0.9, 3.6),
  /** logarithmic (golden) spiral around pole (px, py); turns = quarter turns drawn outward. */
  spiral: (px, py, a = 1.2, quarterTurns = 9, startDeg = 0, dir = 1) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const b = Math.log(phi) / (Math.PI / 2);
    const out = [];
    const steps = quarterTurns * 12;
    for (let i = 0; i <= steps; i++) {
      const th = (i / 12) * (Math.PI / 2);
      const r = a * Math.exp(b * th);
      const ang = (startDeg * Math.PI) / 180 + dir * th;
      out.push(pt(px + r * Math.cos(ang), py + r * Math.sin(ang)));
    }
    return path('M' + out.join(' L'), C.none, C.cobalt, 0.8);
  },
};
function clampX(v) { return Math.max(-400, Math.min(640, v)); }
function clampY(v) { return Math.max(-400, Math.min(550, v)); }

/* ── helpers for controlled comparisons ─────────────────────────────────── */
/** Flatten nested arrays of shapes. */
const flat = (...parts) => flatten(parts);
function flatten(parts) {
  const out = [];
  const walk = (p) => {
    if (!p) return;
    if (Array.isArray(p) && typeof p[0] === 'string') out.push(p);
    else if (Array.isArray(p)) p.forEach(walk);
  };
  walk(parts);
  return out;
}

/** Build both variants from one scene function: scene(v) where v is the varying value. */
function pair(scene, a, b) {
  return { example: flatten(scene(a)), comparison: flatten(scene(b)) };
}

module.exports = {
  W, H, C, PALETTE, r1, pt, pts,
  rect, circle, line, poly, text, path,
  background, ground, horizon,
  person, bust, cyclist, face, crowd, plannedPerson, camera,
  building, skyline, tree, pine, ridge, sun, road, archway, frameOpening, column, lamp, bird, cloud, ribbon, bezier,
  textLines, headline, outline, bubble, arrow, curveArrow, badge,
  g, flatten, flat, pair,
};
