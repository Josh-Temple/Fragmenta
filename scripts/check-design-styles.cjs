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
const { createStylePrompt, createStyleCss } = loadTs('data/design-style-export.ts');

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
const { mixStyles, mixPrompt } = loadTs('data/design-style-mix.ts');
for (const ratio of [25, 50, 75]) {
  const mixed = mixStyles(designStyles[0], designStyles[1], ratio);
  check(mixed.id.includes('-mix-'), 'mix identity');
  check(mixed.tokens.radius >= 0, 'mix radius');
  check(mixed.features.length === designStyles[0].features.length + designStyles[1].features.length, 'mix features');
  const prompt = mixPrompt(designStyles[0], designStyles[1], ratio, 'article');
  check(prompt.includes(designStyles[0].name) && prompt.includes(designStyles[1].name), 'both names in prompt');
  check(prompt.includes(String(ratio) + '%'), 'mix ratio in prompt');
  check(createStyleCss(mixed).includes('--style-accent'), 'mix CSS export');
}


const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
const home = fs.readFileSync(path.join(root, 'pages/Home.tsx'), 'utf8');
const browse = fs.readFileSync(path.join(root, 'pages/Browse.tsx'), 'utf8');
check(app.includes('path="/styles"'), 'route registered');
check(home.includes('to="/styles"') && browse.includes('to="/styles"'), 'navigation links');
check(!fs.readFileSync(path.join(root, 'data/definitions.tsx'), 'utf8').includes('design-styles'), '18 pattern registry isolated');

console.log('PASS Design Styles: 24 styles, 5 families, 48 prompts, 24 CSS outputs, isolated navigation');
