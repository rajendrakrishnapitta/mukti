const { pickProvider, readJsonBody, completeChat } = require("./shared");
const { languageInstruction, normalizeLanguage } = require("./language");

const SETUP_HINT =
  "Add GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in Vercel environment variables.";

function buildThemeSystem(language) {
  const lang = normalizeLanguage(language);
  const langBlock =
    lang === "en"
      ? "Write all theme titles, overviews, and insights in English."
      : languageInstruction(lang).replace("## Language (required)", "## Language for generated JSON (required)");
  return `You generate content for Mukti (無), a multi-tradition self-exploration app.
Rules:
- No single tradition is the official center; treat all paths with equal respect.
- Themes are universal philosophical subjects for self-inquiry (not news, products, or celebrities).
- Each theme has exactly 4 perspectives from different named traditions or fields.
- Insights are one clear sentence each; overview is 1–2 sentences.
- Return ONLY valid JSON matching the schema — no markdown fences.
${langBlock}`;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parseThemesPayload(raw) {
  const trimmed = String(raw).trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Model did not return JSON");
  }
  const parsed = JSON.parse(trimmed.slice(start, end + 1));
  const list = parsed.themes;
  if (!Array.isArray(list)) {
    throw new Error("JSON missing themes array");
  }
  return list;
}

function normalizeTheme(item, index, usedIds) {
  if (!item || typeof item !== "object") return null;
  const theme = String(item.theme || "").trim();
  const overview = String(item.overview || "").trim();
  if (!theme || !overview) return null;

  let id = slugify(item.id || theme);
  if (!id) id = `theme-${Date.now()}-${index}`;
  while (usedIds.has(id)) {
    id = `${id}-${usedIds.size}`;
  }
  usedIds.add(id);

  const perspectives = [];
  const rawPerspectives = Array.isArray(item.perspectives) ? item.perspectives : [];
  for (const p of rawPerspectives) {
    if (!p || typeof p !== "object") continue;
    const tradition = String(p.tradition || "").trim();
    const insight = String(p.insight || "").trim();
    if (tradition && insight) {
      perspectives.push({ tradition, insight });
    }
    if (perspectives.length >= 4) break;
  }
  if (perspectives.length < 3) return null;

  return { id, theme, overview, perspectives, generated: true };
}

function buildUserPrompt(existingThemes, count) {
  const list =
    existingThemes.length > 0
      ? existingThemes.map((t) => `- ${t}`).join("\n")
      : "(none yet)";
  return `Generate exactly ${count} NEW theme objects for self-exploration.

Do NOT duplicate or closely rephrase any of these existing themes:
${list}

Use fresh subjects such as: attention, death, love, language, beauty, doubt, power, technology, grief, play, solitude, anger, wonder, ritual, silence, embodiment, forgiveness, belonging, hope, shame, nature, art, dreams, memory, law, myth, reason, faith, interdependence, desire, luck, humor, vocation, hospitality, envy, patience, ecstasy, boredom, the sacred, the ordinary — or other deep universal themes.

JSON schema:
{"themes":[{"id":"kebab-case-id","theme":"Short title","overview":"1-2 sentences.","perspectives":[{"tradition":"Tradition or field name","insight":"One sentence."},{"tradition":"...","insight":"..."},{"tradition":"...","insight":"..."},{"tradition":"...","insight":"..."}]}]}`;
}

/** @param {import('@vercel/node').VercelRequest} req */
/** @param {import('@vercel/node').VercelResponse} res */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!pickProvider()) {
      return res.status(503).json({ error: SETUP_HINT });
    }

    const body = await readJsonBody(req);
    const existingThemes = Array.isArray(body.existingThemes)
      ? body.existingThemes.map((t) => String(t).trim()).filter(Boolean)
      : [];
    const count = Math.min(Math.max(Number(body.count) || 2, 1), 4);

    const language = normalizeLanguage(body.language);
    const raw = await completeChat(
      buildThemeSystem(language),
      buildUserPrompt(existingThemes, count),
      2800,
    );

    const usedIds = new Set();
    const themes = [];
    for (const [i, item] of parseThemesPayload(raw).entries()) {
      const normalized = normalizeTheme(item, i, usedIds);
      if (!normalized) continue;
      const dup = existingThemes.some(
        (t) => t.toLowerCase() === normalized.theme.toLowerCase(),
      );
      if (!dup) themes.push(normalized);
    }

    if (themes.length === 0) {
      return res.status(502).json({ error: "Could not generate valid themes" });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ themes });
  } catch (e) {
    console.error("[api/themes]", e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Theme generation failed",
    });
  }
};
