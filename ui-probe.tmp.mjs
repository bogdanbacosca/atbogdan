import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const layout = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const inner = c.parentElement;
  const outer = inner.parentElement;
  const grid = outer.parentElement;
  const copy = grid.children[0];
  const gcs = getComputedStyle(grid);
  return {
    canvas: { w: c.getBoundingClientRect().width, h: c.getBoundingClientRect().height, cls: c.className },
    inner: { w: inner.getBoundingClientRect().width, cls: inner.className },
    outer: { w: outer.getBoundingClientRect().width, cls: outer.className },
    copy: { w: copy.getBoundingClientRect().width },
    gridCols: gcs.gridTemplateColumns,
    gridClass: grid.className,
  };
});
console.log('LAYOUT', JSON.stringify(layout, null, 2));

const primary = page.locator('section').first().locator('a[href="/contact"]').first();
const css = await primary.evaluate((el) => {
  const found = [];
  const scan = (rules) => {
    for (const r of rules) {
      const t = r.cssText || '';
      if (t.includes('box-shadow') && t.includes('color-mix')) found.push(t.slice(0, 160));
      if (r.cssRules) scan(r.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try { scan(sheet.cssRules); } catch { /* cross-origin */ }
  }
  return {
    className: el.className.slice(0, 400),
    boxShadow: getComputedStyle(el).boxShadow.slice(0, 200),
    matchedShadowRules: found.slice(0, 6),
  };
});
console.log('BUTTON_CSS', JSON.stringify(css, null, 2));

await browser.close();