#!/usr/bin/env node
/**
 * End-to-end smoke test for the contact form → Resend mail service.
 *
 * Starts nothing itself: point it at a running dev (or preview) server.
 * Fills the /contact form, submits it, and expects the visible success
 * status — which means a real email was accepted by the Resend API.
 *
 * Dev-server gotcha handled here: when Vite re-optimizes dependencies it
 * force-reloads the page, wiping filled fields. The script therefore waits
 * for the page to settle, verifies field values, and retries the submit.
 *
 * Usage:
 *   node scripts/mail-smoke.mjs [baseUrl]   (default: http://127.0.0.1:8080)
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:8080";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");

const consoleErrors = [];
const verdict = {
  success: false,
  statusText: null,
  attempts: 0,
  consoleErrors,
  baseUrl,
};

const formValues = {
  name: "Smoke Test",
  email: "smoke-test@example.com",
  subject: `Mail service test ${stamp}`,
  message:
    "This is an automated smoke test of the contact form mail service. If you received this email, sending works.",
};

const selectors = {
  name: "#name",
  email: "#email",
  subject: "#subject",
  message: "#message",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fill every field and verify the values stuck (a reload would clear them). */
async function fillForm(page) {
  for (const [key, selector] of Object.entries(selectors)) {
    await page.fill(selector, formValues[key]);
  }
  await sleep(300);
  for (const [key, selector] of Object.entries(selectors)) {
    const current = await page.inputValue(selector);
    if (current !== formValues[key]) {
      await page.fill(selector, formValues[key]);
    }
  }
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("requestfailed", (req) => {
    consoleErrors.push(`requestfailed: ${req.method()} ${req.url()} ${req.failure()?.errorText}`);
  });

  await page.goto(`${baseUrl}/contact`, { waitUntil: "load" });
  await page.waitForSelector("#name", { timeout: 30000 });
  // Give Vite a moment: a dep re-optimization right after server start force-
  // reloads the page and would otherwise wipe the fields filled below.
  await sleep(2500);

  const status = page.locator('[data-testid="form-status"]');
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    verdict.attempts = attempt;
    await fillForm(page);
    await page.click('button[type="submit"]');
    try {
      await status.waitFor({ state: "visible", timeout: 25000 });
      verdict.statusText = (await status.innerText()).trim();
      // Success copy contains "trimis"; the error copy does not.
      verdict.success = /trimis/i.test(verdict.statusText);
      break;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      consoleErrors.push(`attempt ${attempt}: status not shown, retrying`);
      await sleep(1500);
    }
  }

  mkdirSync("screenshots", { recursive: true });
  await page.screenshot({
    path: `screenshots/mail-smoke-${stamp}.png`,
    fullPage: true,
  });
} catch (err) {
  consoleErrors.push(`smoke failure: ${err?.message || err}`);
} finally {
  await browser.close();
}

console.log(JSON.stringify(verdict, null, 2));
process.exit(verdict.success && consoleErrors.length === 0 ? 0 : 1);