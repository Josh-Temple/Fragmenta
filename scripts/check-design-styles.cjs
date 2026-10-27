/* Node 22 smoke test: validate the atlas independently of network and browser. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function loadTs(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const result = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  if ((result.diagnostics || []).some(d => d.category === ts.DiagnosticCategory.Error)) {
    throw Error('TypeScript syntax error: ' + file);
  }
  const exports = {};
  vm.runInNewContext(result.outputText, { exports }, { timeout: 3000, filename: file });
  return exports;
}
function check(assertion, label) { if (!assertion) throw Error('FAIL atlas: ' + label); }

const { designStyleGroups, designStyles } = loadTs('data/design-styles.ts');
const { createStylePrompt, createStyleCss, createBlendedStylePrompt } = loadTs('data/design-style-export.ts');
const { styleCompositions, compositionFor, compositionNotes, clampSecondaryWeight } = loadTs('data/design-style-composition.ts');

check(designStyleGroups.length === 5, 'exactly 5 discovery families');
check(designStyles.length === 24, 'exactly 24 example styles');
const ids = designStyles.map(s => s.id);
check(new Set(ids).size === 24, 'unique style ids');
check(designStyles.every(s => /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(s.id)), 'safe identifiers');
check(designStyles.every(s => designStyleGroups.some(g => g.id === s.group)), 'known group');
check(designStyles.every(s => s.name && s.ja && s.summary && s.use), 'named and explained');
check(designStyles.every(s => s.features.length >= 3 && s.avoid.length >= 2), 'features and avoidances');
check(designStyles.every(s => s.tokens.radius >= 0 && s.tokens.borderWidth >= 0), 'bounded radius and borders');
check(designStyles.every(s => ['sans', 'serif', 'mono'].includes(s.tokens.font)), 'fonts');
check(designStyles.every(s => ['none', 'grid', 'dots', 'diagonal', 'gradient'].includes(s.tokens.pattern)), 'background patterns');

check(Object.keys(styleCompositions).length === 24, '24 explicit structural compositions');
check(designStyles.every(s => styleCompositions[s.id] && compositionFor(s) === styleCompositions[s.id]), 'composition for every style');
check(new Set(designStyles.map(compositionFor)).size === 8, 'eight visually different layout grammars');
check(Object.keys(compositionNotes).length === 8, 'layout explanations exist');
check(clampSecondaryWeight(-10) === 0 && clampSecondaryWeight(120) === 100 && clampSecondaryWeight(NaN) === 0, 'blend weights bounded');

const prompts = [];
for (const style of designStyles) {
  for (const screen of ['dashboard', 'article']) {
    const prompt = createStylePrompt(style, screen);
    check(prompt.includes(style.name) && prompt.includes(style.ja), 'prompt title: ' + style.id);
    check(prompt.includes(style.features[0]) && prompt.includes(style.avoid[0]), 'prompt criteria: ' + style.id);
    prompts.push(prompt);
  }
  const css = createStyleCss(style);
  check(css.includes('.fragmenta-style-' + style.id) && css.includes(style.tokens.background), 'CSS tokens: ' + style.id);
  check(css.includes('--style-text') && css.includes('--style-border-width'), 'CSS content: ' + style.id);
}
check(new Set(prompts).size === 48, 'screen-specific prompts generated');
const a = designStyles.find(s => s.id === 'swiss');
const b = designStyles.find(s => s.id === 'neo-brutalism');
check(Boolean(a && b), 'reference styles available');
const blend = createBlendedStylePrompt(a, b, 'dashboard', 30);
check(blend.includes(a.name) && blend.includes(b.name), 'both design languages named');
check(blend.includes('70%') && blend.includes('30%'), 'explicit priorities');
check(blend.includes(a.features[0]) && blend.includes(b.features[0]), 'both style features retained');
check(blend.includes(a.avoid[0]) && blend.includes(b.avoid[0]), 'both style constraints retained');
check(blend.includes('CSS値を機械的に補間する指示ではありません'), 'blending limitation clear');
check(createBlendedStylePrompt(a, b, 'dashboard', 0) === createStylePrompt(a, 'dashboard'), '0% equals primary');
check(createBlendedStylePrompt(a, b, 'dashboard', 100) === createStylePrompt(b, 'dashboard'), '100% equals secondary');
check(createBlendedStylePrompt(a, a, 'article', 30) === createStylePrompt(a, 'article'), 'same style not duplicated');
const bDominant = createBlendedStylePrompt(a, b, 'dashboard', 70);
check(bDominant !== blend, 'changing mix changes prompt');
check(bDominant.includes('基調B') && bDominant.includes('補助A'), 'majority B becomes structural base');
check(blend.includes('基調A') && blend.includes('補助B'), 'majority A remains structural base');
for (const style of designStyles) {
  check(createBlendedStylePrompt(style, a, 'article', 30).length > 150, 'mixed prompt for ' + style.id);
}
const page = fs.readFileSync(path.join(root, 'pages/DesignStyles.tsx'), 'utf8');
const specimen = fs.readFileSync(path.join(root, 'components/DesignStyleSpecimen.tsx'), 'utf8');
check(page.includes('createBlendedStylePrompt') && page.includes('type="range"') && page.includes('secondaryStyle={secondaryWeight > 50 ? first : second}'), 'mixing controls and preview');
check(specimen.includes('compositionFor(style)') && specimen.includes('artDirectionFor(style)') && specimen.includes('metricColumns(art)'), 'structural layouts driven by style and individual art direction');
check(page.includes('配合した完成CSSを生成する機能はまだありません'), 'mixed CSS not falsely promised');

const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
const home = fs.readFileSync(path.join(root, 'pages/Home.tsx'), 'utf8');
const browse = fs.readFileSync(path.join(root, 'pages/Browse.tsx'), 'utf8');
check(app.includes('path="/styles"'), 'route registered');
check(home.includes('to="/styles"') && browse.includes('to="/styles"'), 'navigation links');
check(!fs.readFileSync(path.join(root, 'data/definitions.tsx'), 'utf8').includes('design-styles'), '18 pattern registry isolated');

require('./check-style-art-direction.cjs');

console.log('PASS Design Styles: 24 styles, 8 compositions, 48 single-style prompts, weighted mixes, 24 CSS outputs');
