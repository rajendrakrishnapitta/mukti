#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const soulsDir = path.join(root, "api", "souls");

const { listPhilosopherIds } = require(path.join(root, "api", "philosophers.js"));
const ids = listPhilosopherIds().sort();

const files = fs
  .readdirSync(soulsDir)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map((f) => f.slice(0, -3))
  .sort();

const missing = ids.filter((id) => !files.includes(id));
const extra = files.filter((id) => !ids.includes(id));

if (missing.length || extra.length) {
  console.error("Philosopher soul mismatch:");
  if (missing.length) console.error("  Missing souls:", missing.join(", "));
  if (extra.length) console.error("  Extra souls:", extra.join(", "));
  process.exit(1);
}

console.log(`OK: ${ids.length} philosophers each have api/souls/<id>.md`);
