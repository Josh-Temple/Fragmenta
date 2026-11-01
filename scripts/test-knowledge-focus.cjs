// Static regression gate for focus on knowledge-detail client-side navigation.
// This protects the intent; real keyboard and screen-reader acceptance remains required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const page = path.join(__dirname, '..', 'pages/KnowledgeDetail.tsx');

function verify(source) {
  const errors = [];
  if (!/useRef<HTMLHeadingElement>\(null\)/.test(source)) errors.push('missing heading ref');
  if (!/useEffect\(\(\) => \{[\s\S]*?headingRef\.current\?\.focus\(\{ preventScroll: true \}\);[\s\S]*?\}, \[id\]\)/.test(source))
    errors.push('route change must move focus to heading');
  const refs = source.match(/<h1\b[^>]*ref=\{headingRef\}[^>]*tabIndex=\{-1\}[^>]*>/g) ?? [];
  if (refs.length !== 2) errors.push('both detail and not-found headings must be focusable without adding tab stops');
  return errors;
}
if (require.main === module) {
  const actual = fs.readFileSync(page, 'utf8');
  assert.deepEqual(verify(actual), []);
  const fixtures = [
    actual.replace('headingRef.current?.focus({ preventScroll: true });', ''),
    actual.replace('tabIndex={-1}', ''),
    actual.replace('}, [id]);', '}, []);'),
  ];
  for (const [i, fixture] of fixtures.entries()) {
    assert(verify(fixture).length > 0, 'invalid fixture ' + (i + 1) + ' must fail');
  }
  console.log('PASS knowledge detail focus static contract and 3 negative fixtures');
}
module.exports = { verify };
