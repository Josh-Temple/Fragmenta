// Static contract checks: 24 style entries, motion boundaries and reduced-motion coverage.
// Browser behavior and visual acceptance must still be checked independently.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = path => fs.readFileSync(path, 'utf8');
const styles = read('data/design-styles.ts');
const motion = read('data/design-style-motion.ts');
const css = read('index.css');
const specimen = read('components/DesignStyleSpecimen.tsx');
const layout = read('components/Layout.tsx');
const ui = read('pages/DesignStyles.tsx');
const ids = [...styles.matchAll(/^    "id": "([^"]+)",\s*\n    "name":/gm)].map(m => m[1]);
const entries = [...motion.matchAll(/^  '([^']+)':\s*\{[^\n]+durationMs: (\d+), offsetX: (-?\d+), offsetY: (-?\d+), scale: ([\d.]+), easing:/gm)]
  .map(m => ({ id: m[1], duration: Number(m[2]), x: Number(m[3]), y: Number(m[4]), scale: Number(m[5]) }));
assert.equal(ids.length, 24, 'expected 24 style definitions');
assert.equal(new Set(ids).size, 24, 'style IDs must be unique');
assert.equal(entries.length, 24, 'expected 24 motion mappings');
assert.deepEqual([...entries.map(e => e.id)].sort(), [...ids].sort(), 'motion IDs must match styles exactly');
for (const entry of entries) {
  assert(entry.duration >= 120 && entry.duration <= 750, entry.id + ': motion is too long or short');
  assert(Math.abs(entry.x) <= 16 && Math.abs(entry.y) <= 16, entry.id + ': motion travels too far');
  assert(entry.scale >= .96 && entry.scale <= 1, entry.id + ': scaling is too large');
}
for (const selector of ['.page-enter', '.style-motion-enter', '.motion-control', '.motion-card']) {
  assert(css.includes(selector), 'missing ' + selector);
}
assert(css.includes('(prefers-reduced-motion: reduce)'), 'missing reduced-motion override');
assert(css.includes('(hover: hover) and (pointer: fine)'), 'hover movement must be pointer-scoped');
assert(specimen.includes('key={style.id +'), 'specimen animation should rerun on style/screen change');
assert(layout.includes('key={location.pathname}'), 'page animation should rerun on route change');
assert(ui.includes('getStyleMotion(first.id).description'), 'style-specific motion should be explained in UI');
console.log('Motion contract: PASS (24 styles, bounded motion, reduced-motion support)');
