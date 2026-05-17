#!/usr/bin/env node
/**
 * Writes api/souls/<id>.md from scripts/philosopher-souls-data/*.mjs
 * Run: node scripts/generate-philosopher-souls.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SOULS } from "./philosopher-souls-data/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "api", "souls");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const ids = Object.keys(SOULS).sort();
let written = 0;
for (const id of ids) {
  const content = SOULS[id];
  if (!content?.trim()) {
    console.warn(`skip empty: ${id}`);
    continue;
  }
  fs.writeFileSync(path.join(outDir, `${id}.md`), content.trim() + "\n", "utf8");
  written++;
}

console.log(`Wrote ${written} philosopher souls to api/souls/`);
