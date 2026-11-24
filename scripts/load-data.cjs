// Load the same TypeScript data modules used by the React pages during offline exports and checks.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript-legacy');
const repo = path.resolve(__dirname, '..');
const cache = new Map();
const compilerOptions = {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
};

function load(file) {
  const abs = path.resolve(repo, file);
  const candidates = [abs, abs + '.tsx', abs + '.ts', abs + '.js', abs + '.json'];
  const found = candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  assert(found, 'missing module: ' + file);
  if (found.endsWith('.json')) return require(found);
  if (cache.has(found)) return cache.get(found).exports;
  const mod = { exports: {} };
  cache.set(found, mod);
  const compiled = ts.transpileModule(fs.readFileSync(found, 'utf8'), {
    fileName: found, compilerOptions, reportDiagnostics: true,
  });
  assert.equal(compiled.diagnostics.filter(x => x.category === ts.DiagnosticCategory.Error).length, 0,
    'cannot transpile ' + found);
  const localRequire = name => name.startsWith('.')
    ? load(path.resolve(path.dirname(found), name)) : require(name);
  new Function('require', 'exports', 'module', compiled.outputText)(localRequire, mod.exports, mod);
  return mod.exports;
}

module.exports = { load, compilerOptions };
