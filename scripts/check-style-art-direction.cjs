/* Independent source-level acceptance for the 24 Fragmenta art-direction recipes.
 * Run with Node 22 after npm ci: node scripts/check-style-art-direction.cjs
 * Does not claim real-browser, contrast or clipboard acceptance.
 */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function get(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const translated = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  if (translated.diagnostics.some(d => d.category === ts.DiagnosticCategory.Error)) {
    throw Error('Syntax: ' + file);
  }
  const exports = {};
  vm.runInNewContext(translated.outputText, { exports }, { timeout: 3000, filename: file });
  return exports;
}
function check(condition, label) { if (!condition) throw Error('Art direction FAIL: ' + label); }
const { designStyles } = get('data/design-styles.ts');
const { styleCompositions } = get('data/design-style-composition.ts');
const { artDirectionRecipes, artDirectionFor } = get('data/design-style-art-direction.ts');
const ids = designStyles.map(s => s.id);
check(ids.length === 24 && new Set(ids).size === 24, '24 distinct existing styles');
check(Object.keys(artDirectionRecipes).length === 24, 'exactly 24 recipes, no extra entries');
check(Object.keys(styleCompositions).length === 24, 'eight existing grammar assignments retained');
const signatures = [];
const matrix = [];
for (const s of designStyles) {
  const a = artDirectionFor(s);
  check(a === artDirectionRecipes[s.id], 'lookup ' + s.id);
  check(a.decisions.length === 3 && new Set(a.decisions).size === 3, 'three distinct design decisions ' + s.id);
  check(a.decisions.every(x => typeof x === 'string' && x.length > 8), 'meaningful decisions ' + s.id);
  check(a.headlineSize >= 22 && a.headlineSize <= 48, 'headline bounds ' + s.id);
  check(a.headlineWeight >= 400 && a.headlineWeight <= 900, 'heading weight ' + s.id);
  check(a.heroSpacing >= 8 && a.heroSpacing <= 50, 'hero spacing ' + s.id);
  check(a.cardGap >= 0 && a.cardGap <= 24, 'card gap ' + s.id);
  check(a.articleInset >= 12 && a.articleInset <= 28 && a.articleLeading >= 1.65, 'long text room ' + s.id);
  check(['none','left','top','bottom','double'].includes(a.heroRule), 'hero border ' + s.id);
  check(['single','equal','wide-first','wide-second'].includes(a.metricLayout), 'metric columns ' + s.id);
  const signature = [a.headlineSize,a.headlineWeight,a.headlineAlign,a.heroSpacing,a.heroRule,a.metricLayout,a.panelTreatment,a.barTreatment,a.ornament].join('|');
  signatures.push(signature);
  for (const screen of ['dashboard', 'article']) {
    matrix.push([s.id, screen, styleCompositions[s.id], a.metricLayout, a.ornament, a.headlineSize, a.panelTreatment]);
  }
}
check(new Set(signatures).size === 24, '24 visually distinct multi-axis specifications');
check(matrix.length === 48, '24 x 2 source-defined specimens');
const specimen = fs.readFileSync(path.join(root, 'components/DesignStyleSpecimen.tsx'), 'utf8');
for (const marker of ['artDirectionFor(style)','metricColumns(art)','ornamentStyle(art.ornament','art.headlineSize','art.heroSpacing','art.panelTreatment','art.articleLeading','art.barTreatment']) {
  check(specimen.includes(marker) || marker === 'art.panelTreatment' && specimen.includes('recipe.panelTreatment'), 'specimen wired to recipe: ' + marker);
}
check(specimen.includes('aria-hidden="true"'), 'decorations hidden from accessibility tree');
check(!specimen.includes('setInterval') && !specimen.includes('requestAnimationFrame'), 'no decorative animation');
if (process.argv.includes('--matrix')) {
  console.log('id,screen,grammar,metric_layout,ornament,headline_px,panel_treatment');
  for (const row of matrix) console.log(row.join(','));
}
console.log('PASS A source-level: 24 distinct recipes; 48 specimen configurations; three intentional decisions per style.');
