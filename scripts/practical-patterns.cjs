/* Standalone browser acceptance: node scripts/practical-patterns.cjs.
 * Set PLAYWRIGHT_MODULE to a Playwright module path if not installed locally. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const mod = { exports: {} };
new Function('require', 'exports', 'module', ts.transpileModule(
  fs.readFileSync(path.join(__dirname, '../data/patterns/practical-patterns.tsx'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }
).outputText)(require, mod.exports, mod);
const definitions = Object.values(mod.exports.practicalPatterns);

(async () => {
  assert.equal(definitions.length, 10);
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    for (const def of definitions) {
      const initial = def.generateCode({ spacing: 16, radius: 12 });
      const changed = def.generateCode({ spacing: 28, radius: 24 });
      assert.notEqual(initial, changed);
      assert.equal(def.generateCode({ spacing: NaN, radius: Infinity }), initial);
      assert(!/<script|https?:\/\//.test(initial));
      for (const width of [360, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        for (const [variant, code] of [['default', initial], ['changed', changed]]) {
          await page.setContent(`<meta name="viewport" content="width=device-width,initial-scale=1">${code}`);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${def.id} ${width} ${variant} page overflow`);
          const root = page.locator(`.fp-${def.id}`);
          assert.equal(await root.evaluate(el => getComputedStyle(el).getPropertyValue('--space')), variant === 'default' ? '16px' : '28px');
          // Native nesting must actually apply, rather than merely parsing the output.
          const styled = root.locator(def.id === 'readable-article' ? 'blockquote' : 'input, nav, details, article, li, dl > div, .empty, .scroll').first();
          assert(await styled.count(), def.id + ' styled content');
          assert.notEqual(await styled.evaluate(el => getComputedStyle(el).borderRadius), '0px', def.id + ' nested CSS did not apply');
        }
      }
      console.log(`PASS ${def.id}: default/changed × 3 widths; invalid-value fallback`);
    }
    const output = id => mod.exports.practicalPatterns[id].generateCode({ spacing:16, radius:12 });
    await page.setContent(output('native-faq'));
    const second = page.locator('details').nth(1);
    await second.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await second.getAttribute('open'), '');
    await page.keyboard.press('Space');
    assert.equal(await second.getAttribute('open'), null);
    await page.setContent(output('inline-validation'));
    await page.locator('input').fill('invalid');
    await page.locator('input').blur();
    assert.equal(await page.locator('input').evaluate(el => el.checkValidity()), false);
    assert(await page.locator('.error').isVisible());
    await page.locator('input').fill('reader@example.com');
    await page.locator('input').blur();
    assert.equal(await page.locator('input').evaluate(el => el.checkValidity()), true);
    assert.equal(await page.locator('.error').isVisible(), false);
    for (const id of ['article-table-of-contents', 'pricing-comparison', 'breadcrumb-trail', 'empty-state']) {
      await page.setContent(output(id));
      for (const link of await page.locator('a[href^="#"]').all()) {
        const href = await link.getAttribute('href');
        assert.equal(await page.locator(href).count(), 1, id + ' broken fragment');
        await link.click();
      }
    }
    await page.setViewportSize({ width:360, height:900 });
    await page.setContent(output('responsive-data-table'));
    assert(await page.locator('.scroll').evaluate(el => el.scrollWidth > el.clientWidth));
    await page.locator('.scroll').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    assert(await page.locator('.scroll').evaluate(el => el.scrollLeft > 0));
    console.log('PASS keyboard FAQ, invalid/valid field, all fragment targets, keyboard table scroll');
    if (process.env.APP_URL) {
      const failures = [];
      page.on('pageerror', error => failures.push(error.message));
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto(`${process.env.APP_URL}/#/browse`);
      await page.locator('a[href="#/p/inline-validation"]').waitFor();
      for (const def of definitions) {
        assert.equal(await page.locator(`a[href="#/p/${def.id}"]`).count(), 1);
      }
      for (const def of definitions) {
        await page.goto(`${process.env.APP_URL}/#/p/${def.id}`);
        const frame = page.frameLocator(`iframe[title="${def.title} example"]`);
        await frame.locator(`.fp-${def.id}`).waitFor();
        await page.getByRole('button', { name:'Details', exact:true }).click();
        await page.getByLabel('Content Spacing', {exact:true}).fill('28');
        assert.equal(await frame.locator(`.fp-${def.id}`).evaluate(el => getComputedStyle(el).getPropertyValue('--space')), '28px');
        await page.getByRole('button', {name:'Code',exact:true}).click();
        const code = await page.locator('pre').innerText();
        assert(code.includes('--space:28px'));
        await page.getByRole('button',{name:'Copy code',exact:true}).click();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), code);
      }
      assert.deepEqual(failures, []);
      console.log('PASS gallery discovery, 10 detail routes, live parameter reflection, actual clipboard equality, no page errors');
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
