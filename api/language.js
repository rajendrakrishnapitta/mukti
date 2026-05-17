const LANGUAGE_NAMES = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
};

const LANGUAGE_SCRIPTS = {
  en: "Latin",
  hi: "Devanagari",
  te: "Telugu",
  ta: "Tamil",
};

/** @param {string} code */
function normalizeLanguage(code) {
  const c = String(code || "en").toLowerCase();
  if (c === "hi" || c === "te" || c === "ta") return c;
  return "en";
}

/** @param {string} code */
function languageInstruction(code) {
  const lang = normalizeLanguage(code);
  if (lang === "en") {
    return "## Language\nRespond in clear English unless the user writes in another language; then match their language.";
  }
  const name = LANGUAGE_NAMES[lang];
  const script = LANGUAGE_SCRIPTS[lang];
  return `## Language (required)
Write ALL of your reply in ${name}, using ${script} script.
- The app UI may show some English labels; still reply fully in ${name}.
- Tradition names may be transliterated into ${script} when natural.
- Short quotes may stay in the original language with a brief ${name} gloss.
- Do not switch to English unless the user explicitly asks.`;
}

module.exports = { normalizeLanguage, languageInstruction, LANGUAGE_NAMES };
