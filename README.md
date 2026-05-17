# Mukti (無)

A contemplative web app for **generic self-exploration** — all philosophies, sciences, and wisdom traditions on equal footing, with **Dialogue** grounded in human knowledge (optional web search).

Project intent for builders and AI: see **[soul.md](./soul.md)**.

Each philosopher in **Speak with great philosophers** has a dedicated soul file under **[api/souls/](./api/souls/)** (voice, teachings, avoid-list, example exchange). Dialogue loads `api/souls/<id>.md` plus a shared Mukti frame (`api/souls/_mukti.md`). Regenerate from source data: `npm run generate:souls` · verify coverage: `npm run verify:souls`.

## Run locally

```bash
cd Projects/mukti
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Features

- **Today** — rotating quote from Zen or Advaita sources
- **Dialogue** — AI chat for philosophical questions and self-inquiry (Zen + Advaita), optional web grounding
- **Bridge** — side-by-side themes (emptiness/māyā, satori/mokṣa, kōan/inquiry, …)
- **Inquire** — kōans and “Who am I?” prompts with a private reflection journal (localStorage)
- **Sit** — meditation timer with gentle bell

Not a substitute for a teacher or tradition — a quiet mirror for your own seeing.

## Dialogue chat (API keys)

On Vercel → **mukti → Settings → Environment Variables**. Add **one** free key (in priority order if several are set):

| Variable | Cost | Get a key |
|----------|------|-----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Free tier (rate limits) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | Free tier (rate limits) | [Groq Console](https://console.groq.com/keys) |
| `OPENAI_API_KEY` | Paid | [OpenAI](https://platform.openai.com/api-keys) |

Optional: `TAVILY_API_KEY` for web search ([Tavily](https://tavily.com)). Optional: `AI_PROVIDER=google|groq|openai` to force a provider.

Redeploy after adding keys: `npx vercel --prod`

Local full stack (frontend + API): `npm run dev:full` (uses `vercel dev`).
