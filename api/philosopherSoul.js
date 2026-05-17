const fs = require("fs");
const path = require("path");

const SOULS_DIR = path.join(__dirname, "souls");
const MUKTIFRAME_PATH = path.join(SOULS_DIR, "_mukti.md");

/** @type {string | null} */
let muktiFrameCache = null;

/** @type {Map<string, string>} */
const soulCache = new Map();

function readSoulFile(id) {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  if (safe !== id) return null;
  const filePath = path.join(SOULS_DIR, `${safe}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8").trim();
}

function getMuktiFrame() {
  if (muktiFrameCache === null) {
    muktiFrameCache = fs.existsSync(MUKTIFRAME_PATH)
      ? fs.readFileSync(MUKTIFRAME_PATH, "utf8").trim()
      : "";
  }
  return muktiFrameCache;
}

/**
 * @param {string} id
 * @returns {string | null}
 */
function getPhilosopherSoul(id) {
  if (!id || typeof id !== "string") return null;
  if (soulCache.has(id)) return soulCache.get(id) ?? null;
  const content = readSoulFile(id);
  if (content) soulCache.set(id, content);
  return content;
}

/**
 * @param {{ id: string; name: string; persona?: string }} philosopher
 * @returns {string}
 */
function buildPhilosopherSoulPrompt(philosopher) {
  const parts = [];
  const frame = getMuktiFrame();
  if (frame) parts.push(frame);

  const soul = getPhilosopherSoul(philosopher.id);
  if (soul) {
    parts.push(`## Philosopher soul — ${philosopher.name}\n\n${soul}`);
  } else if (philosopher.persona) {
    parts.push(`## Voice (fallback)\n\n${philosopher.persona}`);
  }

  return parts.join("\n\n");
}

function listSoulIds() {
  if (!fs.existsSync(SOULS_DIR)) return [];
  return fs
    .readdirSync(SOULS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => f.slice(0, -3));
}

module.exports = {
  getPhilosopherSoul,
  getMuktiFrame,
  buildPhilosopherSoulPrompt,
  listSoulIds,
};
