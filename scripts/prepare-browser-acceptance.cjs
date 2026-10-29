// Include the test harness only in Preview builds, never in Production output.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const destination = path.join(root, 'dist', 'browser-acceptance.html');
if (process.env.VERCEL_ENV === 'preview' || (!process.env.VERCEL_ENV && process.argv.includes('--include'))) {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || 'local / unpinned';
  if (!/^[a-f0-9]{40}$/.test(sha) && sha !== 'local / unpinned') throw Error('Invalid revision');
  const html = fs.readFileSync(path.join(root, 'docs', 'browser-acceptance.html'), 'utf8')
    .replace('<p id="revision"></p>', '<p id="revision">Source: ' + sha + '</p>');
  fs.writeFileSync(destination, html);
  console.log('Browser acceptance harness: Preview only / ' + sha);
} else {
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
  console.log('Browser acceptance harness excluded from public build.');
}
