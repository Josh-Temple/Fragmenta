/* Node 22 smoke test: validate the atlas independently of network and browser. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript-legacy');
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
// mix-matrix: both render contexts × five adoption priorities × all distinct pairs.
// Tests the exact prompt generator wired to the read-only textarea and copy button.
const weights = [10, 30, 50, 70, 90];
let matrixCount = 0;
for (const first of designStyles) {
  for (const second of designStyles) {
    if (first.id === second.id) continue;
    for (const screen of ['dashboard', 'article']) {
      for (const weight of weights) {
        const prompt = createBlendedStylePrompt(first, second, screen, weight);
        const dominantB = weight > 50;
        const dominant = dominantB ? second : first;
        const supporting = dominantB ? first : second;
        const label = first.id + '/' + second.id + '/' + screen + '/' + weight;
        check(prompt.includes('A: ' + first.name) && prompt.includes('B: ' + second.name), 'pair ' + label);
        check(prompt.includes(' ' + (100 - weight) + '%') && prompt.includes(' ' + weight + '%'), 'weight ' + label);
        check(prompt.includes('基調' + (dominantB ? 'B' : 'A') + '（' + dominant.name + '）'), 'dominant ' + label);
        check(prompt.includes('背景 ' + dominant.tokens.background) && prompt.includes('文字 ' + dominant.tokens.text), 'dominant palette ' + label);
        check(prompt.includes('補助' + (dominantB ? 'A' : 'B') + 'の参考アクセント（そのまま文字色には使わない）: ' + supporting.tokens.accent), 'supporting accent ' + label);
        check(prompt.includes(dominant.features[0]) && prompt.includes(supporting.features[0]), 'both feature sets ' + label);
        check(prompt.includes(first.avoid[0]) && prompt.includes(second.avoid[0]), 'both restrictions ' + label);
        check(prompt.includes('CSS値を機械的に補間する指示ではありません'), 'not a CSS interpolation ' + label);
        check(prompt.includes('衝突時の解決:') && prompt.includes('十分な文字コントラスト'), 'conflict and accessibility ' + label);
        check(prompt.includes(screen === 'dashboard' ? 'Webダッシュボード' : '記事サイト'), 'screen ' + label);
        if (weight === 50) check(prompt.includes('同率50/50の決定規則: 構造と情報階層はAを基調'), 'A tie-break ' + label);
        if (weight === 10 || weight === 90) check(prompt.includes('一種類だけ'), 'limited minority detail ' + label);
        check(!prompt.includes('undefined') && !prompt.includes('NaN'), 'well-formed mix ' + label);
        matrixCount++;
      }
    }
  }
}
check(matrixCount === 24 * 23 * 2 * 5, '5520 mix matrix cases tested');
check(createBlendedStylePrompt(a, b, 'dashboard', NaN) === createStylePrompt(a, 'dashboard'), 'invalid weight falls back to A');
check(createBlendedStylePrompt(a, b, 'dashboard', -5) === createStylePrompt(a, 'dashboard'), 'negative weight is clamped');
check(createBlendedStylePrompt(a, b, 'dashboard', 105) === createStylePrompt(b, 'dashboard'), 'high weight is clamped');
check(createBlendedStylePrompt(a, a, 'dashboard', 90) === createStylePrompt(a, 'dashboard'), 'same style uses single brief');
for (const [primaryId, secondaryId] of [
  ['swiss', 'glass'], ['editorial', 'neo-brutalism'], ['wabi-sabi', 'cyberpunk'],
  ['cyberpunk', 'wabi-sabi'], ['glass', 'swiss'],
]) {
  const first = designStyles.find(s => s.id === primaryId);
  const second = designStyles.find(s => s.id === secondaryId);
  check(Boolean(first && second), 'challenging mix fixture');
  for (const weight of [10, 50, 90]) {
    const prompt = createBlendedStylePrompt(first, second, 'article', weight);
    check(prompt.includes('補助') && prompt.includes('衝突時の解決:'), 'challenging mix has constraints ' + primaryId + '/' + secondaryId);
  }
}

const page = fs.readFileSync(path.join(root, 'pages/DesignStyles.tsx'), 'utf8');
const specimen = fs.readFileSync(path.join(root, 'components/DesignStyleSpecimen.tsx'), 'utf8');
check(page.includes('createBlendedStylePrompt') && page.includes('type="range"') && page.includes('secondaryStyle={secondaryWeight > 50 ? first : second}'), 'mixing controls and preview');
check(specimen.includes('compositionFor(style)') && specimen.includes('layoutGrid(shape)'), 'structural layouts driven by style');
check(page.includes('配合した完成CSSを生成する機能はまだありません'), 'mixed CSS not falsely promised');
check(page.includes("compare === 'none'") && page.includes('mixEnabled && canMix'), 'no B does not generate blend');
check(page.includes('value={prompt}') && page.includes("copyText(prompt, 'プロンプト')"), 'display and copy reference same prompt string');
check(page.includes('onFocus={e => e.currentTarget.select()}') && page.includes('コピーできませんでした。下の欄から手動で選択してください。'), 'manual selection fallback');
check(page.includes('value={css}') && page.includes("copyText(css, 'CSS')"), 'CSS output and copy use same source');

const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
const home = fs.readFileSync(path.join(root, 'pages/Home.tsx'), 'utf8');
const browse = fs.readFileSync(path.join(root, 'pages/Browse.tsx'), 'utf8');
check(app.includes('path="/styles"'), 'route registered');
check(home.includes('to="/styles"') && browse.includes('to="/styles"'), 'navigation links');
check(!fs.readFileSync(path.join(root, 'data/definitions.tsx'), 'utf8').includes('design-styles'), '18 pattern registry isolated');

console.log('PASS Design Styles: 24 styles, 8 compositions, 48 single prompts, 5520 mix-matrix cases, 24 A-only CSS outputs');
