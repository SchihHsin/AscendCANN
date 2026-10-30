import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildOutput = path.join(sourceRoot, "dist", "pages");
const pagesOutput = path.resolve(sourceRoot, "..", "ascstudio");
const showcaseOutput = path.resolve(sourceRoot, "..", "ascstudio-pc", "studio");

if (!existsSync(path.join(buildOutput, "index.html"))) {
  throw new Error(`Missing Pages build output: ${buildOutput}`);
}

mkdirSync(pagesOutput, { recursive: true });
cpSync(buildOutput, pagesOutput, { recursive: true, force: true });

rmSync(showcaseOutput, { recursive: true, force: true });
mkdirSync(showcaseOutput, { recursive: true });
cpSync(buildOutput, showcaseOutput, { recursive: true, force: true });

console.log(`Published Ascend Studio to ${pagesOutput}`);
console.log(`Synchronized PC showcase copy to ${showcaseOutput}`);
