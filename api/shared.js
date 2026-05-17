function cleanKey(value) {
  if (!value) return "";
  return String(value).trim().replace(/^['"]|['"]$/g, "");
}

function hasProviderKey(name) {
  if (name === "google") return Boolean(cleanKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY));
  if (name === "groq") return Boolean(cleanKey(process.env.GROQ_API_KEY));
  if (name === "openai") return Boolean(cleanKey(process.env.OPENAI_API_KEY));
  return false;
}

/** Ordered providers to try (Groq first when both exist — unless AI_PROVIDER is set). */
function availableProviders() {
  const forced = String(process.env.AI_PROVIDER || "").toLowerCase();
  if (forced === "google" || forced === "groq" || forced === "openai") {
    return hasProviderKey(forced) ? [forced] : [];
  }
  const chain = [];
  if (hasProviderKey("groq")) chain.push("groq");
  if (hasProviderKey("google")) chain.push("google");
  if (hasProviderKey("openai")) chain.push("openai");
  return chain;
}

function pickProvider() {
  return availableProviders()[0] || null;
}

function isRateLimitError(text) {
  return /429|rate limit|quota|resource exhausted|tokens per day|tpd/i.test(text);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
];

async function completeGoogle(apiKey, system, user, maxTokens) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  });

  let lastError = "";
  for (const modelId of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      const text =
        data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
        "";
      if (text.trim()) return text;
    }
    lastError = await res.text();
    if (res.status === 429 || isRateLimitError(lastError)) {
      const err = new Error(`GOOGLE_QUOTA: ${lastError.slice(0, 180)}`);
      err.code = "GOOGLE_QUOTA";
      throw err;
    }
    if (res.status !== 404) {
      throw new Error(`Google ${res.status}: ${lastError.slice(0, 200)}`);
    }
  }
  throw new Error(`Google: no model available. ${lastError.slice(0, 160)}`);
}

async function completeOpenAICompatible(url, apiKey, model, system, user, maxTokens, label) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.85,
      max_tokens: maxTokens,
      stream: false,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 429 || isRateLimitError(t)) {
      const err = new Error(`${label}_QUOTA: ${t.slice(0, 180)}`);
      err.code = `${label.toUpperCase()}_QUOTA`;
      throw err;
    }
    throw new Error(`${label} ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function completeWithProvider(provider, system, user, maxTokens) {
  if (provider === "google") {
    const key = cleanKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    if (!key) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY missing");
    return completeGoogle(key, system, user, maxTokens);
  }
  if (provider === "groq") {
    const key = cleanKey(process.env.GROQ_API_KEY);
    if (!key) throw new Error("GROQ_API_KEY missing");
    return completeOpenAICompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      key,
      "llama-3.3-70b-versatile",
      system,
      user,
      maxTokens,
      "Groq",
    );
  }
  const key = cleanKey(process.env.OPENAI_API_KEY);
  if (!key) throw new Error("OPENAI_API_KEY missing");
  return completeOpenAICompatible(
    "https://api.openai.com/v1/chat/completions",
    key,
    "gpt-4o-mini",
    system,
    user,
    maxTokens,
    "OpenAI",
  );
}

function isQuotaError(err) {
  if (!err || typeof err !== "object") return false;
  if (err.code === "GOOGLE_QUOTA" || err.code === "GROQ_QUOTA" || err.code === "OPENAI_QUOTA") {
    return true;
  }
  return isRateLimitError(String(err.message || err));
}

/** @returns {Promise<string>} */
async function completeChat(system, user, maxTokens = 2400) {
  const chain = availableProviders();
  if (chain.length === 0) {
    throw new Error("No AI provider configured");
  }

  let lastErr = null;
  for (let i = 0; i < chain.length; i++) {
    try {
      return await completeWithProvider(chain[i], system, user, maxTokens);
    } catch (e) {
      lastErr = e;
      if (isQuotaError(e) && i < chain.length - 1) continue;
      throw e;
    }
  }
  throw lastErr || new Error("All AI providers failed");
}

module.exports = {
  cleanKey,
  pickProvider,
  availableProviders,
  hasProviderKey,
  isRateLimitError,
  isQuotaError,
  readJsonBody,
  completeChat,
};
