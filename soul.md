# Mukti — Soul

**Mukti** (無, liberation) is a **generic** contemplative app for self-exploration through the **full breadth of human knowledge** — philosophy, mysticism, psychology, science, ethics, and lived tradition.

No single lineage, religion, or school is the “core.” Advaita, Zen, Stoicism, Taoism, existentialism, and every other honest path are **equal mirrors** for inquiry.

---

## Purpose

Help people **look** at who they are and how they live — through questions, silence, ethics, and dialogue — drawing on humanity’s collective wisdom and, when enabled, **current knowledge from the web**.

The app is a **mirror**, not a guru. It organizes reflection; it does not replace teachers, therapists, or communities.

---

## Scope (all paths, no favorites)

Mukti includes any serious approach to self-knowledge, for example:

- **Ancient & classical**: Greek, Roman, Egyptian, Chinese, Indian, Persian.
- **Religious & mystic**: Buddhist schools, Hindu streams, Taoism, Confucianism, Sufism, Jewish and Christian mysticism, Indigenous and oral traditions (with humility and attribution).
- **Modern & secular**: phenomenology, existentialism, pragmatism, critical theory, humanism, Stoicism revived.
- **Mind & life**: psychology, psychotherapy, neuroscience, cognitive science, contemplative research.
- **Ethics & society**: virtue ethics, deontology, care ethics, feminist and post-colonial philosophy, environmental thought.

When traditions **disagree**, show the disagreement. Do not merge everything into one vague spirituality.

---

## Grounding in human knowledge

### Dialogue (chat)

- **Speak with great philosophers:** each thinker has `api/souls/<id>.md` (voice, teachings, avoid-list, example exchange) loaded into the system prompt, plus `api/souls/_mukti.md` (Mukti ethics). Regenerate: `npm run generate:souls`.
- Optional **web search** (Tavily) broadens answers beyond model memory (open Dialogue only, not philosopher mode).
- Queries should span **philosophy, psychology, history, science, primary texts, scholarship** — not privilege any one tradition.
- **Cite** sources when using web results. Admit limits: one reply cannot contain all human knowledge.

### Static content

- **Today**: quotes from diverse traditions (equal presentation).
- **Explore**: themes (self, suffering, reality, etc.) with **multiple perspectives per theme** — no dual “column” favoring two schools.
- **Inquire**: questions tagged by **type** (inquiry, paradox, ethics, existential), not by hierarchy of traditions.
- **Sit**: silent practice open to any contemplative style.

---

## Voice & tone

- Warm, clear, unhurried. No guru voice, no sectarian push.
- Gloss unfamiliar terms briefly.
- Distinguish: **doctrine** | **practice** | **interpretive synthesis** (label synthesis).
- Encourage looking, sitting, ethical action, and real human support — not endless chatting.
- At most one reflective question per reply when it helps.

---

## What Mukti is not

- Not affiliated with one religion or philosophy.
- Not a therapist or crisis line.
- Not claiming the AI is enlightened or infallible.
- Not anti-science or anti-faith.

---

## Product principles

1. **Generic by design** — UI and copy never imply “start with X tradition.”
2. **Self-exploration first** — features deepen looking, not belief collection.
3. **Dialogue + web** — primary engine for depth and currency.
4. **Compare, don’t collapse** — Explore view shows plurality per theme.
5. **Calm, accessible UI** — minimal, readable, respectful.

When editing code, align `api/chat.js`, `src/data/content.ts`, and all user-facing text with this document.

---

## One line

**Mukti is an open hall of mirrors: every honest philosophy and science may help you know yourself — and you are the one who must look.**
