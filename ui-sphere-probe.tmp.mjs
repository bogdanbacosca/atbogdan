import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const OUT = path.join(os.tmpdir(), "atbogdan-ui-check");
fs.mkdirSync(OUT, { recursive: true });
const PAGE = "http://localhost:8080/";

// Reads the live canvas: CSS size vs bitmap size vs the bounding box of
// actually-drawn pixels (the real "is the sphere cropped?" signal).
const canvasState = () => {
  const c = document.querySelector("canvas");
  if (!c) return { error: "no canvas" };
  const r = c.getBoundingClientRect();
  const off = document.createElement("canvas");
  off.width = c.width;
  off.height = c.height;
  const octx = off.getContext("2d");
  octx.drawImage(c, 0, 0);
  const d = octx.getImageData(0, 0, off.width, off.height).data;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < off.height; y += 2) {
    for (let x = 0; x < off.width; x += 2) {
      if (d[(y * off.width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const bbox = maxX < 0 ? null : { minX, minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const expW = Math.max(1, Math.floor(Math.round(r.width) * dpr));
  const expH = Math.max(1, Math.floor(Math.round(r.height) * dpr));
  return {
    cssW: Math.round(r.width * 10) / 10,
    cssH: Math.round(r.height * 10) / 10,
    bitmapW: c.width,
    bitmapH: c.height,
    dpr: window.devicePixelRatio,
    // The canvas fades in via inline opacity — a drawn-but-transparent bitmap
    // is still an INVISIBLE sphere, so the computed opacity is part of the verdict.
    opacity: Number(getComputedStyle(c).opacity),
    bitmapMatchesCss: Math.abs(c.width - expW) <= 1 && Math.abs(c.height - expH) <= 1,
    touchesEdge: bbox
      ? bbox.minX <= 1 || bbox.minY <= 1 || bbox.minX + bbox.w >= off.width - 2 || bbox.minY + bbox.h >= off.height - 2
      : null,
    fillRatio: bbox ? Math.round((bbox.w / off.width) * 100) / 100 : 0,
    bbox,
  };
};

async function runScenario(name, { width, height, dpr, reducedMotion }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  // Cold load: fresh context = fresh cache, screenshots land mid-settle.
  await page.goto(PAGE, { waitUntil: "domcontentloaded" });
  const shots = [];
  for (const [label, delay] of [["t0", 250], ["t1", 1200], ["t2", 2600]]) {
    await page.waitForTimeout(delay);
    const state = await page.evaluate(canvasState);
    shots.push({ label, state });
    await page.screenshot({
      path: path.join(OUT, `sphere-${name}-${label}.png`),
      clip: { x: 0, y: 0, width, height: Math.min(height, 720) },
    });
  }
  await browser.close();
  const last = shots[shots.length - 1].state;
  const ok =
    !last.error &&
    last.bitmapMatchesCss &&
    last.touchesEdge === false &&
    last.fillRatio > 0.6 &&
    last.fillRatio < 0.98 &&
    // Fully faded in by the final sample — a transparent canvas fails here.
    last.opacity >= 0.95;
  // t0 (250ms) is pre-hydration in dev — the canvas hasn't mounted its effect
  // yet, so only require consistency from t1 onward: opacity flip must have
  // fired (any value > 0) and the bitmap must track the CSS size.
  const consistent = shots
    .slice(1)
    .every((s) => !s.state.error && s.state.bitmapMatchesCss && s.state.opacity > 0.02);
  console.log(`\n== ${name} ==`);
  for (const s of shots) console.log(s.label, JSON.stringify(s.state));
  console.log(JSON.stringify({ name, ok, consistent, errors }));
  return { name, ok, consistent, errors };
}

const results = [];
results.push(await runScenario("1000-dpr1", { width: 1000, height: 720, dpr: 1, reducedMotion: false }));
results.push(await runScenario("1000-dpr125", { width: 1000, height: 720, dpr: 1.25, reducedMotion: false }));
results.push(await runScenario("1000-reduce", { width: 1000, height: 720, dpr: 1, reducedMotion: true }));
results.push(await runScenario("1440-dpr1", { width: 1440, height: 860, dpr: 1, reducedMotion: false }));
fs.writeFileSync(path.join(OUT, "sphere-probe.json"), JSON.stringify(results, null, 2));
const allOk = results.every((r) => r.ok && r.consistent && r.errors.length === 0);
console.log(`\nVERDICT: ${allOk ? "PASS" : "FAIL"}`);
process.exit(allOk ? 0 : 1);
