#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "philosophers");
const UA = "MuktiApp/1.0 (https://mukti-ebon.vercel.app; portrait cache)";
const DELAY_MS = 2200;

const urlsPath = path.join(root, "src/data/philosopherPortraitUrls.ts");
const text = fs.readFileSync(urlsPath, "utf8");
const json = text.replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, "");
/** @type {Record<string, string>} */
const urls = JSON.parse(json);

/** Direct URLs when Wikipedia thumb HEAD fails */
const EXTRA = {
  zhuangzi: "https://upload.wikimedia.org/wikipedia/commons/2/23/Zhuangzi.jpg",
  hypatia:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hypatia_portrait.png/330px-Hypatia_portrait.png",
  pothana:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Pothana_statue.jpg/330px-Pothana_statue.jpg",
  radhakrishnan:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Photograph_of_Sarvepalli_Radhakrishnan_presented_to_First_Lady_Jacqueline_Kennedy_in_1962.jpg/330px-Photograph_of_Sarvepalli_Radhakrishnan_presented_to_First_Lady_Jacqueline_Kennedy_in_1962.jpg",
  "tripuraneni-ramaswamy":
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Tripuraneni_Ramaswamy_1987_stamp_of_India.jpg",
  "kancha-ilaiah":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kancha_Ilaiah_klf.jpg/330px-Kancha_Ilaiah_klf.jpg",
  "chaganti-koteswara-rao":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Chaganti_Koteswara_Rao_in_August_2015.JPG/330px-Chaganti_Koteswara_Rao_in_August_2015.JPG",
  "garikapati-narasimha-rao":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Garikapati_Narasimha_Rao_in_March_2015.JPG/330px-Garikapati_Narasimha_Rao_in_March_2015.JPG",
  "samavedam-shanmukha-sharma":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Samavedam_Shanmukha_Sharma.jpg/330px-Samavedam_Shanmukha_Sharma.jpg",
  "amartya-sen":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Amartya_Sen_20071128_cologne_cropped.jpg/330px-Amartya_Sen_20071128_cologne_cropped.jpg",
  "gopal-guru":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gopal_Guru.jpg/330px-Gopal_Guru.jpg",
  "shiv-visvanathan":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Shiv_Visvanathan.jpg/330px-Shiv_Visvanathan.jpg",
  "a-raghuramaraju":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/A._Raghuramaraju.jpg/330px-A._Raghuramaraju.jpg",
  lavanam:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Lavanam_Steve_Allen.jpg/330px-Lavanam_Steve_Allen.jpg",
  sadhguru:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Sadhguru-Jaggi-Vasudev.jpg/330px-Sadhguru-Jaggi-Vasudev.jpg",
};

const allUrls = { ...urls, ...EXTRA };

function normalize(url) {
  let u = url.split("?")[0];
  if (u.includes("/thumb/") && /\/\d+px-/.test(u)) {
    u = u.replace(/\/\d+px-/, "/330px-");
  }
  return u;
}

async function download(id, url) {
  const clean = normalize(url);
  const ext = clean.match(/\.(jpe?g|png|webp)(\/)?$/i)?.[1]?.toLowerCase() ?? "jpg";
  const extNorm = ext === "jpeg" ? "jpg" : ext;
  const file = path.join(outDir, `${id}.${extNorm}`);
  const res = await fetch(clean, {
    headers: { "User-Agent": UA, Accept: "image/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error("too small");
  fs.writeFileSync(file, buf);
  return `${id}.${extNorm}`;
}

const tsPath = path.join(root, "src/data/philosopherPortraitFiles.ts");
let manifest = {};
if (fs.existsSync(tsPath)) {
  const m = fs.readFileSync(tsPath, "utf8").match(/=\s*(\{[\s\S]*\});/);
  if (m) manifest = JSON.parse(m[1]);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const failed = [];
const ids = Object.keys(allUrls).sort();

for (const id of ids) {
  if (manifest[id] && fs.existsSync(path.join(outDir, manifest[id]))) {
    continue;
  }
  try {
    manifest[id] = await download(id, allUrls[id]);
    console.log(`ok ${id}`);
  } catch (e) {
    failed.push(id);
    console.warn(`fail ${id}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

fs.writeFileSync(
  tsPath,
  `/** Auto-generated — node scripts/download-philosopher-portraits.mjs */\nexport const PHILOSOPHER_PORTRAIT_FILES: Record<string, string> = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8",
);
console.log(`\n${Object.keys(manifest).length} total, failed: ${failed.join(", ") || "none"}`);
