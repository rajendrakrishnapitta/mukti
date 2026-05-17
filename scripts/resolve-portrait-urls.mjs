#!/usr/bin/env node
/**
 * Resolves Wikipedia thumbnail URLs (330px — Wikimedia rejects many 440px paths).
 * Run: node scripts/resolve-portrait-urls.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA = "MuktiApp/1.0 (https://mukti-ebon.vercel.app; educational)";

const WIKI_TITLE = {
  socrates: "Socrates",
  plato: "Plato",
  aristotle: "Aristotle",
  buddha: "Gautama_Buddha",
  laozi: "Laozi",
  confucius: "Confucius",
  epictetus: "Epictetus",
  "marcus-aurelius": "Marcus_Aurelius",
  rumi: "Rumi",
  shankara: "Adi_Shankara",
  "ramana-maharshi": "Ramana_Maharshi",
  descartes: "René_Descartes",
  spinoza: "Baruch_Spinoza",
  kant: "Immanuel_Kant",
  nietzsche: "Friedrich_Nietzsche",
  wittgenstein: "Ludwig_Wittgenstein",
  zhuangzi: "Zhuangzi",
  hypatia: "Hypatia",
  "simone-de-beauvoir": "Simone_de_Beauvoir",
  kabir: "Kabir",
  tulsidas: "Tulsidas",
  surdas: "Surdas",
  mirabai: "Meera",
  vivekananda: "Swami_Vivekananda",
  "dayananda-saraswati": "Dayananda_Saraswati",
  ramakrishna: "Ramakrishna",
  aurobindo: "Sri_Aurobindo",
  gandhi: "Mahatma_Gandhi",
  ambedkar: "B._R._Ambedkar",
  tagore: "Rabindranath_Tagore",
  "bhagat-singh": "Bhagat_Singh",
  premchand: "Munshi_Premchand",
  osho: "Rajneesh",
  vemana: "Vemana",
  ramanuja: "Ramanuja",
  madhvacharya: "Madhvacharya",
  basava: "Basava",
  "allama-prabhu": "Allama_Prabhu",
  pothana: "Pothana_(poet)",
  annamacharya: "Annamacharya",
  krishnamurti: "Jiddu_Krishnamurti",
  radhakrishnan: "Sarvepalli_Radhakrishnan",
  "tripuraneni-ramaswamy": "Tripuraneni_Ramarao",
  "kancha-ilaiah": "Kancha_Ilaiah",
  "chaganti-koteswara-rao": "Chaganti_Koteswara_Rao",
  "garikapati-narasimha-rao": "Garikapati_Narasimha_Rao",
  "samavedam-shanmukha-sharma": "Samavedam_Shanmukha_Sharma",
  "amartya-sen": "Amartya_Sen",
  "gopal-guru": "Gopal_Guru",
  "shiv-visvanathan": "Shiv_Visvanathan",
  "a-raghuramaraju": "A._Raghuramaraju",
  lavanam: "Lavanam_(social_reformer)",
  sadhguru: "Sadhguru",
  "ug-krishnamurti": "U._G._Krishnamurti",
};

function normalizeThumb(url) {
  if (!url) return null;
  let u = url.split("?")[0];
  if (u.includes("/thumb/") && /\/\d+px-/.test(u)) {
    u = u.replace(/\/\d+px-/, "/330px-");
  }
  return u;
}

async function wikiThumb(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { "User-Agent": UA } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return normalizeThumb(data.thumbnail?.source);
}

async function verify(url) {
  const res = await fetch(url, {
    method: "HEAD",
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  return res.ok;
}

const resolved = {};
const missing = [];

for (const [id, title] of Object.entries(WIKI_TITLE)) {
  let src = await wikiThumb(title);
  if (src && !(await verify(src))) src = null;
  if (src) {
    resolved[id] = src;
    console.log(`ok ${id}`);
  } else {
    missing.push(id);
    console.warn(`MISS ${id}`);
  }
  await new Promise((r) => setTimeout(r, 100));
}

const outPath = path.join(__dirname, "../src/data/philosopherPortraitUrls.ts");
fs.writeFileSync(
  outPath,
  `/** Auto-generated — run: node scripts/resolve-portrait-urls.mjs */\nexport const PHILOSOPHER_PORTRAIT_URLS: Record<string, string> = ${JSON.stringify(resolved, null, 2)};\n`,
  "utf8",
);
console.log(`\n${Object.keys(resolved).length} URLs, missing: ${missing.join(", ") || "none"}`);
