#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/hsin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const [url, name, needle, offsetArg = "-180"] = process.argv.slice(2);
if (!url || !name || !needle) {
  throw new Error("Usage: node capture-targeted-evidence.mjs <url> <name> <needle> [offset]");
}
const offset = Number(offsetArg);
const outputDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "evidence",
  "interaction-competitors",
);
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars", "--no-first-run"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultNavigationTimeout(25_000);
page.setDefaultTimeout(10_000);

try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
  await page.waitForTimeout(4_000);
  const dismissOverlays = async () => {
    for (const label of ["Reject Optional", "Strictly Necessary Only", "Reject All", "Decline All", "Accept All Cookies", "Accept All", "Reject", "Got It", "Got it"]) {
      const button = page.getByRole("button", { name: label, exact: true });
      if (await button.count().catch(() => 0)) await button.first().click({ timeout: 1_500 }).catch(() => null);
    }
    await page.evaluate(() => {
      for (const element of document.querySelectorAll("body *")) {
        const text = (element.textContent || "").replace(/\s+/g, " ").trim();
        if (!text.includes("A better Khan Academy classroom experience is here")) continue;
        let popup = element;
        while (popup.parentElement && getComputedStyle(popup).position !== "fixed") popup = popup.parentElement;
        if (getComputedStyle(popup).position === "fixed") popup.remove();
      }
    }).catch(() => null);
  };
  await dismissOverlays();
  const target = page.getByText(needle, { exact: false }).first();
  const found = await target.count().catch(() => 0);
  if (!found) throw new Error(`Target text not found: ${needle}`);
  await target.scrollIntoViewIfNeeded();
  await page.evaluate((delta) => window.scrollBy(0, delta), offset);
  await page.waitForTimeout(1_200);
  await dismissOverlays();
  const targetBox = await target.boundingBox().catch(() => null);
  const metrics = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    innerWidth,
    innerHeight,
    scrollX,
    scrollY,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    textSample: (document.body?.innerText || "").replace(/\s+/g, " ").slice(0, 900),
  }));
  const screenshot = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  fs.writeFileSync(
    path.join(outputDir, `${name}.json`),
    JSON.stringify({ ...metrics, targetText: needle, targetBox, viewport: { width: 1440, height: 900 }, screenshot }, null, 2),
  );
  process.stdout.write(JSON.stringify({ name, screenshot, targetText: needle, targetBox, ...metrics }) + "\n");
} finally {
  await browser.close();
}
