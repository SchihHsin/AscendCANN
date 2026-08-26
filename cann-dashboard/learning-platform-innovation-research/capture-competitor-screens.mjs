#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/hsin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const [url, name, widthArg = "1440", heightArg = "900", evidenceSubdir = "competitors"] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
if (!url || !name) {
  throw new Error("Usage: node capture-competitor-screens.mjs <url> <name>");
}

const outputDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "evidence",
  evidenceSubdir,
);
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars", "--no-first-run"],
});
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
page.setDefaultNavigationTimeout(18_000);
page.setDefaultTimeout(8_000);

try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 18_000 }).catch(() => null);
  await page.waitForTimeout(url.includes("kaggle.com") ? 7_000 : 3_000);
  for (const label of [
    "Strictly Necessary Only",
    "Reject Optional",
    "Reject All",
    "Decline All",
    "Accept All Cookies",
    "Accept All",
    "Reject",
    "Got It",
  ]) {
    const button = page.getByRole("button", { name: label, exact: true });
    if (await button.count().catch(() => 0)) {
      await button.first().click({ timeout: 1_500 }).catch(() => null);
      await page.waitForTimeout(400);
      break;
    }
  }
  await page.evaluate((isReportDeck) => {
    window.stop();
    const selectors = [
      "#onetrust-consent-sdk",
      "#onetrust-banner-sdk",
      '[id*="onetrust"]',
      '[class*="onetrust"]',
      '[class*="cookie" i]',
      '[aria-label*="cookie" i]',
    ];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.setProperty("display", "none", "important");
      });
    }
    document.querySelectorAll("body *").forEach((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      const rect = element.getBoundingClientRect();
      if (
        text.includes("Kaggle uses cookies from Google") &&
        rect.height > 20 &&
        rect.height < 180 &&
        rect.width > innerWidth * 0.7
      ) {
        element.style.setProperty("display", "none", "important");
      }
    });
    if (!isReportDeck) {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }
    if (!location.hash) window.scrollTo(0, 0);
  }, url.includes("learning-platform-innovation-report.html")).catch(() => null);
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    textSample: (document.body?.innerText || "").replace(/\s+/g, " ").slice(0, 700),
  }));
  const screenshot = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: false, timeout: 8_000 });
  fs.writeFileSync(
    path.join(outputDir, `${name}.json`),
    JSON.stringify({ ...metrics, viewport: { width, height }, screenshot }, null, 2),
  );
  process.stdout.write(JSON.stringify({ name, screenshot, ...metrics }) + "\n");
} finally {
  await browser.close();
}
