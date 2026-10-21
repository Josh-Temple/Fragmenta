/* TypeScript AST lint for app sources. Narrower than ESLint; no extra dependencies. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const targets = ['App.tsx', 'index.tsx', 'types.ts', 'components', 'pages', 'data'];
function sourceFiles(file) {
  if (!fs.existsSync(file)) throw Error('Missing source: ' + file);
  if (fs.statSync(file).isFile()) return [file];
  return fs.readdirSync(file, { withFileTypes: true }).flatMap(entry => {
    const child = path.join(file, entry.name);
    return entry.isDirectory() ? sourceFiles(child)
      : entry.isFile() && /\.tsx?$/.test(entry.name) ? [child] : [];
  });
}
function lint(source, file) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.ES2022, true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const issues = ast.parseDiagnostics.map(d => 'syntax: ' + ts.flattenDiagnosticMessageText(d.messageText, ' '));
  if (/\/\/\s*@ts-(?:nocheck|ignore)\b|\/\*\s*@ts-(?:nocheck|ignore)\b/.test(source)) {
    issues.push('ban-ts-suppression');
  }
  function visit(n) {
    if (ts.isDebuggerStatement(n)) issues.push('no-debugger');
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) &&
        (n.expression.text === 'eval' || n.expression.text === 'Function')) issues.push('no-eval-or-Function');
    if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'Function') {
      issues.push('no-new-Function');
    }
    ts.forEachChild(n, visit);
  }
  visit(ast);
  return issues.map(x => file + ': ' + x);
}
if (process.argv.includes('--self-test')) {
  const valid = lint('export const sum = (a: number, b: number) => a + b;', 'good.ts');
  const invalid = lint('debugger; eval("1"); new Function("return 1"); // @ts-ignore', 'bad.ts');
  if (valid.length || invalid.length !== 4) {
    console.error('FAIL lint self-test', { valid, invalid });
    process.exitCode = 1;
  } else console.log('PASS lint self-test: valid source accepted; four violations rejected');
} else {
  const files = targets.flatMap(x => sourceFiles(path.join(root, x)));
  if (files.length < 10) throw Error('Application source inventory unexpectedly small: ' + files.length);
  const errors = files.flatMap(f => lint(fs.readFileSync(f, 'utf8'), path.relative(root, f))));
  errors.forEach(x => console.error(x));
  if (errors.length) {
    console.error('FAIL lint: ' + errors.length + ' violations in ' + files.length + ' files');
    process.exitCode = 1;
  } else console.log('PASS lint: inspected ' + files.length + ' application source files');
}
