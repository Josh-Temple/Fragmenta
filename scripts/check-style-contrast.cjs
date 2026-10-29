/* Sample the authored gradients and alpha surfaces, including patterned backdrops.
 * This checks text palette choices, not screenshots or overall WCAG conformance. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../data/design-styles.ts'), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, context, { timeout: 3000 });

function parse(value) {
  if (value.startsWith('#')) return [0, 2, 4].map(i => parseInt(value.slice(i + 1, i + 3), 16));
  return value.match(/[\d.]+/g).map(Number);
}
function samples(value) {
  if (!value.startsWith('linear-gradient')) return [parse(value)];
  const stops = value.match(/#[\da-f]{6}|rgba?\([^)]+\)/gi).map(parse);
  return stops.slice(1).flatMap((stop, index) => Array.from({ length: 21 }, (_, i) =>
    stop.map((channel, k) => stops[index][k] + (channel - stops[index][k]) * i / 20)));
}
function composite(top, bottom) {
  const alpha = top[3] ?? 1;
  return top.slice(0, 3).map((channel, i) => channel * alpha + bottom[i] * (1 - alpha));
}
function luminance(color) {
  return color.slice(0, 3).map(v => v / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

let checks = 0;
let minimum = Infinity;
for (const style of context.exports.designStyles) {
  const t = style.tokens;
  const backdrops = samples(t.background).flatMap(bg => {
    const overlay = t.pattern === 'grid' ? [136, 136, 136, 33 / 255]
      : t.pattern === 'dots' ? [119, 119, 119, 48 / 255]
        : t.pattern === 'diagonal' ? [119, 119, 119, 22 / 255] : null;
    return overlay ? [bg, composite(overlay, bg), ...(t.pattern === 'grid'
      ? [composite(overlay, composite(overlay, bg))] : [])] : [bg];
  });
  const surfaces = backdrops.flatMap(bg => samples(t.surface).map(surface => composite(surface, bg)));
  for (const key of ['text', 'muted']) {
    for (const bg of [...backdrops, ...surfaces]) {
      const ratio = contrast(parse(t[key]), bg);
      if (ratio < 4.5) throw Error(`FAIL style text contrast: ${style.id}/${key} = ${ratio.toFixed(3)}`);
      minimum = Math.min(minimum, ratio);
      checks++;
    }
  }
}
console.log(`PASS style text palette: ${checks} sampled pairs; minimum ${minimum.toFixed(3)}:1 (gradients, alpha surfaces, pattern overlays)`);
