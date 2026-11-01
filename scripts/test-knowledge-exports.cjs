// Negative fixtures ensure stale AI exports are not silently accepted.
const { checkExports, readFiles } = require('./check-knowledge-exports.cjs');
const source = readFiles();
const clone = () => structuredClone(source);
const tests = [
  ['stale JSON', 'json', 'static JSON is stale', file => file.replace('"schemaVersion": 2', '"schemaVersion": 999')],
  ['stale Markdown', 'markdown', 'static Markdown is stale', file => file + '\nStale output\n'],
  ['stale index', 'index', 'Markdown index is stale', file => file + '\nStale output\n'],
  ['changed canonical catalog', 'catalog', 'static JSON is stale', file => file.replace('"schemaVersion": 2', '"schemaVersion": 999')],
];
for (const [name, field, expected, mutate] of tests) {
  const fixture = clone();
  const altered = mutate(fixture[field]);
  if (altered === fixture[field]) throw Error('fixture unchanged: ' + name);
  fixture[field] = altered;
  const errors = checkExports(fixture);
  if (!errors.some(e => e.includes(expected))) throw Error('FAILED '+name+': '+errors.join(' | '));
  console.log('PASS rejected ' + name);
}
