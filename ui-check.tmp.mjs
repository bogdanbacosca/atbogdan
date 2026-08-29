import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const shotDir = path.join(os.tmpdir(), 'atbogdan-ui-check');
fs.mkdirSync(shotDir, { recursive: true });
const out = { shotDir, errors: [], checks: [] };
const browser = await chromium.launch();

async function newPage(width, height, url, name) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', (e) => out.errors.push(`${name} pageerror: ${e}`));
  page.on('console', (m) => {
    if (m.type() === 'error') out.errors.push(`${name} console: ${m.text()}`);
  });
  let lastErr;
  for (let i = 0; i < 40; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      await page.waitForTimeout(1000);
    }
  }
  if (lastErr) throw lastErr;
  await page.waitForTimeout(1500);
  return page;
}

const shot = (page, name) => page.screenshot({ path: path.join(shotDir, `${name}.png`) });

// ---- Desktop 1000x700 (laptop in the md range) - home ----
let page = await newPage(1000, 700, 'http://127.0.0.1:8080/', 'home-1000');
await shot(page, 'home-1000-hero');

// 1. Sphere canvas must sit fully inside the hero section (not clipped)
const canvasBox = await page.locator('canvas').first().boundingBox();
const heroBox = await page.locator('section').first().boundingBox();
out.checks.push({
  check: 'sphere canvas fits inside hero section @1000px',
  canvas: canvasBox && { y: Math.round(canvasBox.y), bottom: Math.round(canvasBox.y + canvasBox.height) },
  hero: heroBox && { y: Math.round(heroBox.y), bottom: Math.round(heroBox.y + heroBox.height) },
  fits:
    !!canvasBox &&
    !!heroBox &&
    canvasBox.y >= heroBox.y - 1 &&
    canvasBox.y + canvasBox.height <= heroBox.y + heroBox.height + 1,
});

// 2. Work section heading left-aligned with section content (expect ~32px)
const secHome = page.locator('section', { has: page.locator('h2', { hasText: 'Proiecte selectate' }) }).first();
const h2Home = page.locator('h2', { hasText: 'Proiecte selectate' }).first();
await h2Home.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const h2HomeBox = await h2Home.boundingBox();
const secHomeBox = await secHome.boundingBox();
out.checks.push({
  check: 'work h2 left offset @1000px (expect ~32)',
  delta: h2HomeBox && secHomeBox ? Math.round(h2HomeBox.x - secHomeBox.x) : null,
});
await shot(page, 'home-1000-work');

// 3. Image hover scale now transitions (v4: transition-transform covers scale)
const card = page.locator('a[href*="/portofoliu/"]').filter({ has: page.locator('img') }).first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const img = card.locator('img').first();
const imgBefore = await img.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { scale: cs.scale, transitionProperty: cs.transitionProperty };
});
const wrapBefore = await img.evaluate((el) => getComputedStyle(el.parentElement).translate);
await img.hover();
await page.waitForTimeout(700);
const imgAfter = await img.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { scale: cs.scale, transitionProperty: cs.transitionProperty };
});
const wrapAfter = await img.evaluate((el) => getComputedStyle(el.parentElement).translate);
out.checks.push({
  check: 'img hover scale + card lift @1000px',
  imgBefore,
  imgAfter,
  wrapBefore,
  wrapAfter,
  ok: imgAfter.scale !== 'none' && imgAfter.transitionProperty.includes('scale'),
});

// 4. Button hover lift now transitions (v4: translate in transition list)
const btn = page.locator('section').first().getByRole('link').nth(1);
await btn.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const btnBefore = await btn.evaluate((el) => getComputedStyle(el).translate);
await btn.hover();
await page.waitForTimeout(400);
const btnAfter = await btn.evaluate((el) => getComputedStyle(el).translate);
out.checks.push({ check: 'button hover translate @1000px', btnBefore, btnAfter, ok: btnBefore !== btnAfter });

// ---- /portofoliu heading alignment (was pushed right at md+) ----
page = await newPage(1000, 700, 'http://127.0.0.1:8080/portofoliu', 'portofoliu-1000');
const h2p = page.locator('h2', { hasText: 'Proiecte selectate' }).first();
await h2p.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const h2pBox = await h2p.boundingBox();
const secPBox = await page.locator('section', { has: h2p }).first().boundingBox();
out.checks.push({
  check: 'portofoliu h2 left offset @1000px (expect ~32)',
  delta: h2pBox && secPBox ? Math.round(h2pBox.x - secPBox.x) : null,
});
await shot(page, 'portofoliu-1000-header');

// ---- lg regression check (1440x900 hero unchanged) ----
page = await newPage(1440, 900, 'http://127.0.0.1:8080/', 'home-1440');
await shot(page, 'home-1440-hero');

// ---- Mobile 390x844 (must stay as before: sphere behind copy, no overflow) ----
page = await newPage(390, 844, 'http://127.0.0.1:8080/', 'mobile-390');
await shot(page, 'mobile-390-hero');
const scrollW = await page.evaluate(() => document.scrollingElement.scrollWidth);
out.checks.push({ check: 'mobile no horizontal overflow', scrollW, ok: scrollW <= 390 });

await browser.close();
console.log(JSON.stringify(out, null, 2));