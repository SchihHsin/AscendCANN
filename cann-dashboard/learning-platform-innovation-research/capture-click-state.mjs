#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/hsin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const [url, name, role, label] = process.argv.slice(2);
if (!url || !name || !role || !label) throw new Error("Usage: capture-click-state.mjs <url> <name> <role> <label>");
const outputDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "evidence", "interaction-competitors");
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--disable-gpu", "--hide-scrollbars"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
  await page.waitForTimeout(5_000);
  const target = page.getByRole(role, { name: label, exact: false }).first();
  if (!(await target.count())) throw new Error(`Target not found: ${role} ${label}`);
  await target.click();
  await page.waitForTimeout(8_000);
  const screenshot = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  const metrics = await page.evaluate(() => ({ url: location.href, title: document.title, innerWidth, innerHeight, scrollX, scrollY, textSample: (document.body?.innerText || "").replace(/\s+/g, " ").slice(0, 1200) }));
  fs.writeFileSync(path.join(outputDir, `${name}.json`), JSON.stringify({ ...metrics, click: { role, label }, viewport: { width: 1440, height: 900 }, screenshot }, null, 2));
  process.stdout.write(JSON.stringify({ name, screenshot, ...metrics }) + "\n");
} finally { await browser.close(); }
