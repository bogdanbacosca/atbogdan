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

// ---- THE BUG: sphere bitmap must be synced with its CSS box on FIRST load ----
// (before the fix the bitmap kept the pre-CSS measurement and the sphere drew
// cropped until the user zoomed, which fired the resize listener)
for (const [w, h, name] of [
  [1000, 700, 'home-1000'],
  [1440, 900, 'home-1440'],
  [390, 844, 'mobile-390'],
]) {
  const page = await newPage(w, h, 'http://127.0.0.1:8080/', name);
  const sync = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return { ok: false, reason: 'no canvas' };
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return {
      ok:
        Math.abs(c.width - Math.floor(r.width * dpr)) <= 1 &&
        Math.abs(c.height - Math.floor(r.height * dpr)) <= 1,
      css: { w: Math.round(r.width), h: Math.round(r.height) },
      bitmap: { w: c.width, h: c.height },
      dpr,
    };
  });
  out.checks.push({ check: `sphere bitmap synced on first load @${w}px`, ...sync });

  const canvasBox = await page.locator('canvas').first().boundingBox();
  const heroBox = await page.locator('section').first().boundingBox();
  out.checks.push({
    check: `sphere canvas inside hero @${w}px`,
    fits:
      !!canvasBox &&
      !!heroBox &&
      canvasBox.y >= heroBox.y - 1 &&
      canvasBox.y + canvasBox.height <= heroBox.y + heroBox.height + 1,
  });

  await shot(page, `${name}-hero`);
  if (w === 390) {
    const scrollW = await page.evaluate(() => document.scrollingElement.scrollWidth);
    out.checks.push({ check: 'mobile no horizontal overflow', scrollW, ok: scrollW <= 390 });
  }
  await page.close();
}

// ---- Buttons: pill, no positional wobble, sheen sweep, layered glow ----
const page = await newPage(1000, 700, 'http://127.0.0.1:8080/', 'buttons-1000');
const primary = page.locator('section').first().locator('a[href="/contact"]').first();
await primary.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);

const bBefore = await primary.evaluate((el) => ({
  radius: parseFloat(getComputedStyle(el).borderRadius),
  translate: getComputedStyle(el).translate,
  shadow: getComputedStyle(el).boxShadow,
  sheen: getComputedStyle(el, '::after').translate,
}));
await primary.hover();
await page.waitForTimeout(600);
const bAfter = await primary.evaluate((el) => ({
  translate: getComputedStyle(el).translate,
  shadow: getComputedStyle(el).boxShadow,
  sheen: getComputedStyle(el, '::after').translate,
}));
out.checks.push({
  check: 'primary button: pill + zero translate wobble + sheen sweep + glow shift',
  bBefore,
  bAfter,
  ok:
    bBefore.radius >= 100 &&
    bBefore.translate === 'none' &&
    bAfter.translate === 'none' &&
    bBefore.sheen !== bAfter.sheen &&
    bBefore.shadow.includes('oklab') &&
    bBefore.shadow !== bAfter.shadow,
});

const pb = await primary.boundingBox();
if (pb) {
  await page.screenshot({
    path: path.join(shotDir, 'buttons-1000-hover.png'),
    clip: { x: Math.max(0, pb.x - 30), y: Math.max(0, pb.y - 24), width: 540, height: pb.height + 70 },
  });
}

const outline = page.locator('section').first().locator('a[href="/portofoliu"]').first();
await outline.hover();
await page.waitForTimeout(600);
const oShadow = await outline.evaluate((el) => getComputedStyle(el).boxShadow);
out.checks.push({ check: 'outline button hover surface', hasGlow: oShadow.includes('oklab'), shadow: oShadow.slice(-90) });

// CTA band with the phone (outline) button
const phone = page.locator('a[href^="tel"]').first();
if (await phone.count()) {
  await phone.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await shot(page, 'cta-band-1000');
}
await page.close();

await browser.close();
console.log(JSON.stringify(out, null, 2));
