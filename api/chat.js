const SETUP_HINT =
  "Add GOOGLE_GENERATIVE_AI_API_KEY (https://aistudio.google.com/apikey) or GROQ_API_KEY (https://console.groq.com/keys) in Vercel → Environment Variables, then redeploy.";

const {
  cleanKey,
  availableProviders,
  isRateLimitError,
  isQuotaError,
  readJsonBody,
} = require("./shared");

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = item.role;
    if (role !== "user" && role !== "assistant" && role !== "system") continue;
    let content = "";
    if (typeof item.content === "string") content = item.content;
    else if (Array.isArray(item.content)) {
      content = item.content
        .map((p) => (p && p.text ? String(p.text) : ""))
        .filter(Boolean)
        .join("\n");
    }
    if (content.trim()) out.push({ role, content: content.trim() });
  }
  return out;
}

function lastUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

const { languageInstruction } = require("./language");
const { getPhilosopher } = require("./philosophers");
const { buildPhilosopherSoulPrompt } = require("./philosopherSoul");
function buildPhilosopherSystemPrompt(philosopher, language) {
  const soulBlock = buildPhilosopherSoulPrompt(philosopher);
  return `You are Mukti's "Speak with great philosophers" mode. The user is in direct dialogue with ${philosopher.name} (${philosopher.tradition}, ${philosopher.era}).

${soulBlock}

## Response shape
- Speak in first person as this thinker, in their spirit — for self-inquiry, not entertainment or deception.
- Match the voice, rhythm, and vocabulary described in the soul above; do not drift into generic "wise AI" tone.
- Usually 2–5 short paragraphs unless they ask for depth.
- Do not claim live web access in this mode.

${languageInstruction(language)}`;
}

function buildCompareSystemPrompt(p1, p2, topic, language) {
  return `You are Mukti's "Compare thinkers" mode. The seeker wants two distinct voices on one topic.

## Topic
${topic || "The seeker's question"}

## Voice 1 — ${p1.name} (${p1.tradition}, ${p1.era})
${buildPhilosopherSoulPrompt(p1)}

## Voice 2 — ${p2.name} (${p2.tradition}, ${p2.era})
${buildPhilosopherSoulPrompt(p2)}

## Format (required)
Write exactly two sections with these headings:
### ${p1.name}
(2–4 paragraphs in ${p1.name}'s voice)

### ${p2.name}
(2–4 paragraphs in ${p2.name}'s voice)

Then one short "### Where they differ" (2–3 sentences). Do not merge into one vague spirituality.

${languageInstruction(language)}`;
}

function buildSystemPrompt(webContext, language) {
  const webBlock = webContext.trim()
    ? `## Web sources (cite titles or sites when you use them)\n${webContext}`
    : "## Web sources\nNo live search attached this turn — draw on wide training; say when a topic needs fresh sources or a specific text.";
  return `You are the guide for Mukti (無) — a generic space for self-exploration through all of human wisdom. No tradition is the official center: treat Advaita, Zen, Stoicism, Taoism, existentialism, psychology, science, and every other honest path with equal respect unless the user focuses on one.

## Scope
Draw on philosophy, mysticism, psychology, neuroscience, ethics, comparative religion, history, and contemporary scholarship. When traditions disagree, present the disagreement — do not flatten into one universal answer or favor any single lineage.

## Your role
- Companion for self-exploration — not a guru, therapist, or final authority.
- Help the user look (inquiry, meditation, ethical life), not collect beliefs or join a sect.
- When web sources are provided, synthesize across fields; cite title or site briefly.
- Distinguish: historical doctrine, practice instruction, interpretive synthesis (label synthesis).
- Warm, clear, unhurried. Usually 2–6 short paragraphs unless they ask for depth.
- End with at most one reflective question when it serves inquiry.
- Crisis or mental health: care; suggest professional help.

## Limits
You cannot hold all human knowledge in one reply — use search snippets plus training. Say when a topic needs books, a teacher, or dedicated research.

${languageInstruction(language)}

${webBlock}`;
}

async function searchWeb(userQuery) {
  const apiKey = cleanKey(process.env.TAVILY_API_KEY);
  if (!apiKey) return { context: "", sources: [] };
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${userQuery} philosophy spirituality self-inquiry wisdom psychology`,
        max_results: 8,
        search_depth: "advanced",
        include_answer: true,
      }),
    });
    if (!res.ok) return { context: "", sources: [] };
    const data = await res.json();
    const parts = [];
    if (data.answer) parts.push(`Overview: ${data.answer}`);
    const sources = [];
    for (const r of data.results || []) {
      if (r.title && r.url) sources.push({ title: r.title, url: r.url });
      parts.push(`• ${r.title}\n  ${r.url}\n  ${(r.content || "").slice(0, 400)}`);
    }
    return { context: parts.join("\n\n"), sources };
  } catch {
    return { context: "", sources: [] };
  }
}

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
];

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

async function streamGoogle(apiKey, system, messages, res) {
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature: 0.65, maxOutputTokens: 1400 },
  });

  let upstream = null;
  let lastError = "";

  for (const modelId of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
    const attempt = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (attempt.ok) {
      upstream = attempt;
      res.setHeader("X-Mukti-Model", modelId);
      break;
    }
    lastError = await attempt.text();
    if (attempt.status === 429 || isRateLimitError(lastError)) {
      const err = new Error(`GOOGLE_QUOTA: ${lastError.slice(0, 180)}`);
      err.code = "GOOGLE_QUOTA";
      throw err;
    }
    if (attempt.status !== 404) {
      throw new Error(`Google ${attempt.status}: ${lastError.slice(0, 200)}`);
    }
  }

  if (!upstream) {
    throw new Error(
      `Google: no available Gemini model. Last error: ${lastError.slice(0, 200)}`,
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const text =
          json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
          "";
        if (text) res.write(text);
      } catch {
        /* skip bad chunk */
      }
    }
  }
}

async function streamOpenAICompatible(
  url,
  apiKey,
  model,
  system,
  messages,
  res,
  label,
) {
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.65,
      max_tokens: 1400,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
      ],
    }),
  });

  if (!upstream.ok) {
    const t = await upstream.text();
    if (upstream.status === 429 || isRateLimitError(t)) {
      const err = new Error(`${label}_QUOTA: ${t.slice(0, 200)}`);
      err.code = `${label.toUpperCase()}_QUOTA`;
      throw err;
    }
    throw new Error(`${label} ${upstream.status}: ${t.slice(0, 200)}`);
  }

  res.setHeader("X-Mukti-Model", model);

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const text = json.choices?.[0]?.delta?.content || "";
        if (text) res.write(text);
      } catch {
        /* skip */
      }
    }
  }
}

async function streamGroq(apiKey, system, messages, res) {
  let lastErr = null;
  for (const model of GROQ_MODELS) {
    try {
      await streamOpenAICompatible(
        "https://api.groq.com/openai/v1/chat/completions",
        apiKey,
        model,
        system,
        messages,
        res,
        "Groq",
      );
      return;
    } catch (e) {
      lastErr = e;
      if (isQuotaError(e)) continue;
      throw e;
    }
  }
  throw lastErr || new Error("Groq: all models failed");
}

async function streamWithProvider(provider, system, messages, res) {
  if (provider === "google") {
    const key = cleanKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    if (!key) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY missing");
    await streamGoogle(key, system, messages, res);
    return;
  }
  if (provider === "groq") {
    const key = cleanKey(process.env.GROQ_API_KEY);
    if (!key) throw new Error("GROQ_API_KEY missing");
    await streamGroq(key, system, messages, res);
    return;
  }
  const key = cleanKey(process.env.OPENAI_API_KEY);
  if (!key) throw new Error("OPENAI_API_KEY missing");
  await streamOpenAICompatible(
    "https://api.openai.com/v1/chat/completions",
    key,
    "gpt-4o-mini",
    system,
    messages,
    res,
    "OpenAI",
  );
}

function rateLimitResponse(chain, lastErr) {
  const hasGoogle = chain.includes("google");
  const hasGroq = chain.includes("groq");
  const msg = String(lastErr?.message || "");
  const groqHit = lastErr?.code === "GROQ_QUOTA" || /groq/i.test(msg);

  if (groqHit && hasGoogle) {
    return "Groq free daily limit is full for now. Mukti should fall back to Google Gemini automatically after redeploy — if you still see this, check that GOOGLE_GENERATIVE_AI_API_KEY is set on Vercel, redeploy, or try again in a few hours.";
  }
  if (lastErr?.code === "GOOGLE_QUOTA" && hasGroq) {
    return "Google Gemini free quota is full for now. Groq was also unavailable. Wait and try again, or add another key in Vercel → Environment Variables.";
  }
  if (chain.length === 1 && groqHit) {
    return "Groq free daily token limit is reached (~100k tokens/day). Try again tomorrow, or add GOOGLE_GENERATIVE_AI_API_KEY in Vercel env vars so Mukti can use Gemini as backup.";
  }
  return "AI rate limit reached on all configured providers. Wait a while and try again, or add another API key in Vercel → Environment Variables.";
}

/** @param {import('@vercel/node').VercelRequest} req */
/** @param {import('@vercel/node').VercelResponse} res */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chain = availableProviders();
    if (chain.length === 0) {
      return res.status(503).json({ error: SETUP_HINT });
    }

    const body = await readJsonBody(req);
    const messages = normalizeMessages(body.messages);
    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const language = body.language || "en";
    const userText = lastUserMessage(messages);

    const compareIds = Array.isArray(body.comparePhilosopherIds)
      ? body.comparePhilosopherIds.filter((id) => typeof id === "string").slice(0, 2)
      : [];
    const comparePhilosophers =
      compareIds.length === 2
        ? compareIds.map((id) => getPhilosopher(id)).filter(Boolean)
        : [];

    const philosopher =
      comparePhilosophers.length === 2
        ? null
        : getPhilosopher(body.philosopherId);
    const useWebSearch =
      philosopher || comparePhilosophers.length === 2
        ? false
        : body.useWebSearch !== false;
    let webContext = "";
    let webSources = [];
    if (useWebSearch) {
      const search = await searchWeb(userText);
      webContext = search.context;
      webSources = search.sources;
    }
    let system;
    if (comparePhilosophers.length === 2) {
      system = buildCompareSystemPrompt(
        comparePhilosophers[0],
        comparePhilosophers[1],
        userText,
        language,
      );
      res.setHeader("X-Mukti-Compare", compareIds.join(","));
    } else if (philosopher) {
      system = buildPhilosopherSystemPrompt(philosopher, language);
      res.setHeader("X-Mukti-Philosopher", philosopher.id);
    } else {
      system = buildSystemPrompt(webContext, language);
    }

    if (webSources.length > 0) {
      res.setHeader("X-Mukti-Sources", JSON.stringify(webSources).slice(0, 6000));
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");

    let lastErr = null;
    for (let i = 0; i < chain.length; i++) {
      const provider = chain[i];
      try {
        res.setHeader("X-Mukti-Provider", provider);
        if (i > 0) {
          res.setHeader("X-Mukti-Fallback", `${chain[0]}-quota`);
        }
        await streamWithProvider(provider, system, messages, res);
        res.end();
        return;
      } catch (e) {
        lastErr = e;
        console.error(`[api/chat] ${provider} failed:`, e.message);
        if (isQuotaError(e) && i < chain.length - 1) {
          if (!res.headersSent) continue;
          return;
        }
        break;
      }
    }

    if (!res.headersSent) {
      const status = isQuotaError(lastErr) ? 429 : 500;
      return res.status(status).json({
        error: isQuotaError(lastErr)
          ? rateLimitResponse(chain, lastErr)
          : lastErr instanceof Error
            ? lastErr.message
            : "Chat failed",
      });
    }
    res.end();
  } catch (e) {
    console.error("[api/chat]", e);
    if (!res.headersSent) {
      return res.status(500).json({
        error: e instanceof Error ? e.message : "Chat failed",
      });
    }
    res.end();
  }
};
