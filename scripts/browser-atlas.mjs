import assert from 'node:assert/strict';
export async function verifyAtlas({
  page,
  control,
  baseUrl,
  poll,
  errors,
  capture,
  captureMode,
  targets,
  widths,
}) {
  const js = async (expr) => {
    const r = await page.send('Runtime.evaluate', {
      expression: expr,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails)
      throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const wait = (expr, label) => poll(() => js(expr), label);
  async function go(url, canonical = url.split(/[?#]/)[0]) {
    await page.send('Page.navigate', { url: baseUrl + url });
    await wait(
      'document.readyState==="complete" && location.pathname===' +
        JSON.stringify(canonical) +
        ' && !!document.querySelector("main h1")',
      url,
    );
  }
  const resize = (width) =>
    page.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 844,
      mobile: false,
      deviceScaleFactor: 1,
    });
  const key = async (name) => {
    for (const type of ['keyDown', 'keyUp'])
      await page.send('Input.dispatchKeyEvent', {
        type,
        key: name,
        code: name,
        windowsVirtualKeyCode: { Enter: 13, Escape: 27, Tab: 9 }[name],
      });
  };
  const click = (sel) => js('document.querySelector(' + JSON.stringify(sel) + ').click()');
  const inventory = await (await fetch(baseUrl + '/catalog/index/search.json')).json();
  const filters = await (await fetch(baseUrl + '/catalog/filters.json')).json();
  for (const width of [320, 360, 390, 768, 1280]) {
    await resize(width);
    for (const route of [
      '/',
      '/composition',
      '/composition/C-001',
      '/styles/swiss',
      '/p/elastic-button',
      '/tools/contrast',
      '/tools/typography',
      '/knowledge',
      '/knowledge/idea-visual-history-01',
      '/collections',
      '/licenses',
    ]) {
      await go(route);
      assert(
        await js(
          'document.documentElement.scrollWidth<=innerWidth+1 && document.querySelectorAll("main").length===1',
        ),
        width + ' ' + route,
      );
    }
    await go('/composition');
    assert.equal(await js('document.querySelectorAll(".specimen").length'), 24);
    await click('#xray');
    await wait('getComputedStyle(document.querySelector(".overlay")).display!=="none"', 'X-Ray');
    if (width === 1280)
      assert.equal(
        await js(
          'getComputedStyle(document.querySelector(".tiles")).gridTemplateColumns.split(" ").length',
        ),
        4,
      );
  }
  console.log(
    'PASS Stage 1: five viewport widths, 24 visual cards, X-Ray, two teaching figures, no horizontal overflow.',
  );
  await resize(390);
  await go('/#/composition?id=C-001&purpose=placement', '/composition/C-001');
  assert(
    await js(
      'document.querySelectorAll(".pair figure svg").length===2 && document.querySelector("#purpose-context").textContent.includes("主役の配置")',
    ),
  );
  await click('[data-thirds-toggle]');
  assert(await js('document.querySelector(".pair").classList.contains("accent-guides")'));
  await click('a[data-view="structure"]');
  await wait(
    '!document.getElementById("structure").hidden && document.getElementById("visual").hidden',
    'structure view',
  );
  await click('a[data-view="ai-code"]');
  await wait('!document.getElementById("ai-code").hidden', 'AI view');
  await control.send('Browser.grantPermissions', {
    origin: new URL(baseUrl).origin,
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
  });
  await click('[data-copy]');
  await wait(
    'document.querySelector(".copy-status").innerText.includes("コピーしました")',
    'native Chromium copy',
  );
  assert.equal(
    await js('navigator.clipboard.readText()'),
    await js('document.getElementById("brief").textContent'),
  );
  await js(
    'Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("disabled")}}})',
  );
  await click('[data-copy]');
  await wait('document.querySelector(".copy-text").open', 'copy fallback');
  const covered = new Set();
  for (let p = 1; p <= 5; p++) {
    await go(p === 1 ? '/composition' : '/composition/page/' + p);
    for (const id of await js('[...document.querySelectorAll(".specimen")].map(x=>x.id)'))
      covered.add(id);
  }
  assert.equal(covered.size, 120);
  for (const { id } of filters.purposes) {
    await go('/composition?purpose=' + id);
    await wait('!!document.querySelector("#active-filters a")', 'purpose ' + id);
    const found = await js('[...document.querySelectorAll(".specimen")].map(a=>a.id.slice(5))');
    assert.deepEqual(
      found,
      inventory
        .filter((x) => x.purposes.includes(id))
        .slice(0, 24)
        .map((x) => x.id),
    );
  }
  await go('/');
  await js('document.querySelector(".mast [data-search]").focus()');
  await key('Enter');
  await wait('document.activeElement.id==="dialog-q"', 'search focus');
  await key('Escape');
  await wait('document.activeElement.matches(".mast [data-search]")', 'return focus');
  await go('/search?q=' + encodeURIComponent('文字の余白'));
  await wait('!!document.querySelector("#active-filters a")', 'purpose search');
  assert(await js('document.querySelector(".ledger a").href.includes("purpose=text-space")'));
  await go('/composition/C-110');
  assert.deepEqual(
    await js('[...document.querySelectorAll("figcaption strong")].map(x=>x.textContent)'),
    ['画風A', '画風B'],
  );
  await go('/composition/C-119');
  for (const mode of ['quarter', 'tiny', 'silhouette', 'outline', 'grayscale']) {
    await poll(async () => {
      await js(
        '(()=>{const el=document.querySelector("[data-inspection-select]");el.value=' +
          JSON.stringify(mode) +
          ';el.dispatchEvent(new Event("change",{bubbles:true}));})()',
      );
      return js(
        'document.querySelector("[data-inspection-transform]").dataset.inspectionTransform===' +
          JSON.stringify(mode),
      );
    }, 'C-119 ' + mode);
  }
  console.log(
    'PASS Stage 2: 120 catalogue links, 15 purposes, C-001 clipboard, C-110 labels, C-119 five transformations, keyboard search and focus.',
  );
  await go('/styles?style=swiss', '/styles/swiss');
  await click('.compare-settings summary');
  await poll(async () => {
    if (await js('!!document.querySelector("#style-mix-weight")')) return true;
    await click('input[type=checkbox]');
    return false;
  }, 'mix styles');
  await click('[aria-controls=atlas-css]');
  await wait('document.querySelector("#atlas-css textarea")?.value.length>80', 'CSS tokens');
  await go('/a/elastic-button', '/p/elastic-button');
  await click('a[href="#ai-code"]');
  await wait(
    '[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==="コード"&&b.getAttribute("aria-pressed")==="true")',
    'pattern code',
  );
  for (const item of inventory.filter((r) => r.section === 'browse')) {
    await go(item.path);
    await poll(async () => {
      await js(
        '[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="AIへの指示文").click()',
      );
      return js(
        '[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==="AIへの指示文"&&b.getAttribute("aria-pressed")==="true") && document.body.innerText.includes("再利用条件")',
      );
    }, 'prompt ' + item.id);
  }
  async function typeInto(selector, value) {
    await js(
      '(()=>{const input=document.querySelector(' +
        JSON.stringify(selector) +
        ');input.focus();input.select();})()',
    );
    await page.send('Input.insertText', { text: value });
  }
  await go('/tools/contrast');
  await poll(async () => {
    await typeInto('#foreground', '#000000');
    await typeInto('#background', '#ffffff');
    return js('document.querySelector("section[aria-label=配色の結果]").innerText.includes("21.000")');
  }, 'contrast calculation');
  await go('/tools/typography');
  await click('details:has(#type-body) summary');
  await poll(async () => {
    await typeInto('#type-body', '文字組みの試験');
    return js(
      'document.querySelector("article[aria-label=タイポグラフィのプレビュー]").innerText.includes("文字組みの試験")',
    );
  }, 'typography preview');
  console.log(
    'PASS Stage 3: style comparison and CSS, all 18 pattern prompts, generated code, contrast and typography.',
  );
  await go('/knowledge?category=visual-history');
  await wait('!!document.querySelector("#active-filters a")', 'knowledge category');
  assert(await js('document.querySelector(".ledger").innerText.includes("企画段階")'));
  await go('/search?q=NoMatchingFragmentaItem');
  await wait('!!document.querySelector(".empty")', 'empty search');
  for (const route of ['/composition/missing', '/knowledge/missing', '/p/missing', '/styles/missing'])
    assert.equal((await fetch(baseUrl + route)).status, 404);
  await go('/upcoming/command-palette');
  assert(await js('document.querySelector("main").innerText.includes("企画段階")'));
  for (const features of [
    [{ name: 'forced-colors', value: 'active' }],
    [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  ]) {
    await page.send('Emulation.setEmulatedMedia', { features });
    await go('/composition');
    assert(await js('document.querySelector(".specimen").getBoundingClientRect().width>40'));
  }
  await page.send('Emulation.setEmulatedMedia', { features: [] });
  if (captureMode !== 'none')
    for (const w of widths)
      for (const target of targets) {
        await resize(w);
        const purpose = target === 'purpose-atlas';
        await go(purpose ? '/composition?purpose=solitude' : '/composition/' + target);
        if (purpose) await wait('!!document.querySelector("#active-filters a")', 'purpose capture');
        const selector = purpose ? '.specimen .plate img:first-child' : '.pair figure svg';
        const name = purpose ? 'purpose-atlas' : target === 'C-106' ? 'C-106-detail' : 'focus-' + target;
        await capture(page, 'composition-' + name + '-' + w + 'px.png', {
          selector,
          expectedSvgCount: await js(
            'document.querySelectorAll(' + JSON.stringify(selector) + ').length',
          ),
        });
      }
  assert.deepEqual(errors, []);
  console.log(
    'PASS Stage 4/5: proposals, categories, no results, invalid IDs return HTTP 404, forced colors, reduced motion, no runtime errors.',
  );
}
