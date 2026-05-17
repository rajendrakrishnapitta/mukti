const { availableProviders, hasProviderKey } = require("./shared");

/** @param {import('@vercel/node').VercelRequest} req */
/** @param {import('@vercel/node').VercelResponse} res */
module.exports = async function handler(req, res) {
  try {
    const chain = availableProviders();
    const hasTavily = Boolean(String(process.env.TAVILY_API_KEY || "").trim());

    res.status(200).json({
      ok: chain.length > 0,
      activeProvider: chain[0] || null,
      fallbackProviders: chain.slice(1),
      keys: {
        google: hasProviderKey("google"),
        groq: hasProviderKey("groq"),
        openai: hasProviderKey("openai"),
        tavily: hasTavily,
      },
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e instanceof Error ? e.message : "health check failed",
    });
  }
};
