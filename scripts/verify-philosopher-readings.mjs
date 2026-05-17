#!/usr/bin/env node
import { readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { listPhilosopherIds } = require(path.join(root, "api", "philosophers.js"));
const src = readFileSync(
  path.join(root, "src/data/philosopherReadingsData.ts"),
  "utf8",
);

function hasEntry(id) {
  return src.includes(`"${id}":`) || new RegExp(`\\n  ${id}: \\[`).test(src);
}

const ids = listPhilosopherIds().sort();
const missing = ids.filter((id) => !hasEntry(id));

if (missing.length) {
  console.error("Missing books & references for:", missing.join(", "));
  process.exit(1);
}

console.log(`OK: ${ids.length} philosophers have books & references`);
