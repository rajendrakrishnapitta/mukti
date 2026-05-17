import type { InquiryCategory } from "../data/content";
import type { PhilosophyVideo } from "../data/philosophyVideoTypes";
import {
  featuredVideos,
  videosForLanguage,
} from "../data/philosophyVideos";
import { philosopherSearchTerms } from "../data/philosopherVideoKeywords";
import type { AppLanguage } from "../i18n/types";

export interface DialogueInterest {
  themeIds: string[];
  /** Recent labels, prompts, traditions, user messages (lowercased tokens derived) */
  corpus: string[];
  updatedAt: number;
}

const BUILTIN_THEME_IDS = new Set([
  "self",
  "suffering",
  "ethics",
  "liberation",
  "reality",
  "method",
]);

const THEME_KEYWORDS: Record<string, string[]> = {
  self: [
    "self",
    "consciousness",
    "mind",
    "identity",
    "soul",
    "ego",
    "awareness",
    "who am",
    "know yourself",
    "psychology",
    "phenomenology",
  ],
  suffering: [
    "suffering",
    "pain",
    "stress",
    "grief",
    "anxiety",
    "stoic",
    "marcus",
    "seneca",
    "epictetus",
    "calm",
  ],
  ethics: [
    "ethics",
    "moral",
    "justice",
    "right",
    "wrong",
    "duty",
    "virtue",
    "free will",
    "democracy",
    "socrates",
  ],
  liberation: [
    "liberation",
    "freedom",
    "meaning",
    "existential",
    "nihilism",
    "purpose",
    "life",
    "egg",
  ],
  reality: [
    "reality",
    "truth",
    "tao",
    "lao",
    "wu wei",
    "plato",
    "cave",
    "metaphysics",
    "world",
    "eastern",
  ],
  method: [
    "method",
    "logic",
    "reason",
    "philosophy",
    "wisdom",
    "map",
    "inquiry",
    "think",
  ],
};

const TRADITION_HINTS: Record<string, string[]> = {
  stoic: ["stoic", "marcus", "seneca", "epictetus", "aurelius"],
  buddh: ["buddh", "zen", "dukkha", "aggregates"],
  tao: ["tao", "lao", "wu wei", "flow"],
  greek: ["socrates", "plato", "aristotle", "greek"],
  existential: ["existential", "sartre", "camus", "meaning"],
  advaita: ["advaita", "vedanta", "atman", "thou art"],
  sufi: ["sufi", "rumi"],
  hindu: ["upanishad", "karma"],
};

export function emptyInterest(): DialogueInterest {
  return { themeIds: [], corpus: [], updatedAt: Date.now() };
}

export function inferThemeIdsFromText(...chunks: string[]): string[] {
  const blob = chunks.join(" ").toLowerCase();
  const found = new Set<string>();
  for (const [themeId, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((k) => blob.includes(k))) found.add(themeId);
  }
  return [...found];
}

function normalizeThemeId(id: string): string | null {
  if (BUILTIN_THEME_IDS.has(id)) return id;
  const inferred = inferThemeIdsFromText(id);
  return inferred[0] ?? null;
}

function interestThemeSet(interest: DialogueInterest, focusThemeId?: string): Set<string> {
  const set = new Set<string>();
  for (const id of interest.themeIds) {
    const n = normalizeThemeId(id);
    if (n) set.add(n);
  }
  for (const id of inferThemeIdsFromText(...interest.corpus)) set.add(id);
  if (focusThemeId) {
    const n = normalizeThemeId(focusThemeId);
    if (n) set.add(n);
    else inferThemeIdsFromText(focusThemeId).forEach((t) => set.add(t));
  }
  return set;
}

function scorePhilosopherMatch(
  video: PhilosophyVideo,
  philosopherId: string,
  searchTerms: string[],
): number {
  let score = 0;
  if (video.philosopherIds?.includes(philosopherId)) score += 1000;
  const haystack =
    `${video.title} ${video.channel} ${video.channelUrl ?? ""}`.toLowerCase();
  for (const term of searchTerms) {
    const t = term.toLowerCase();
    if (t.length < 4) continue;
    if (haystack.includes(t)) score += 80;
  }
  return score;
}

function scoreVideo(
  video: PhilosophyVideo,
  themes: Set<string>,
  corpus: string,
): number {
  let score = 0;
  for (const tid of themes) {
    if (video.themeIds.includes(tid)) score += 12;
  }
  if (video.themeIds.includes("featured") && themes.size > 0) score += 1;

  const haystack = `${video.title} ${video.channel}`.toLowerCase();
  for (const tid of themes) {
    for (const kw of THEME_KEYWORDS[tid] ?? []) {
      if (corpus.includes(kw) || haystack.includes(kw)) score += 4;
    }
  }
  for (const words of Object.values(TRADITION_HINTS)) {
    if (words.some((w) => corpus.includes(w) && haystack.includes(w))) score += 6;
    if (words.some((w) => corpus.includes(w))) score += 2;
  }

  const tokens = corpus.split(/\W+/).filter((t) => t.length > 4);
  for (const token of tokens) {
    if (haystack.includes(token)) score += 2;
  }

  return score;
}

export function recommendVideos(
  interest: DialogueInterest,
  options: { limit?: number; themeId?: string; language?: AppLanguage } = {},
): PhilosophyVideo[] {
  const limit = options.limit ?? 5;
  const language = options.language ?? "en";
  const pool = videosForLanguage(language);
  const corpus = interest.corpus.join(" ").toLowerCase();
  const themes = interestThemeSet(interest, options.themeId);

  if (themes.size === 0 && corpus.length < 8) {
    if (options.themeId) {
      const normalized = normalizeThemeId(options.themeId);
      if (normalized) {
        return rankByTheme(normalized, limit, language);
      }
    }
    return featuredVideos(limit, language);
  }

  const scored = pool
    .map((video) => ({
      video,
      score: scoreVideo(video, themes, corpus),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const out: PhilosophyVideo[] = [];
  const seen = new Set<string>();
  for (const { video } of scored) {
    if (seen.has(video.id)) continue;
    seen.add(video.id);
    out.push(video);
    if (out.length >= limit) break;
  }

  if (out.length < limit) {
    for (const v of featuredVideos(limit, language)) {
      if (!seen.has(v.id)) {
        out.push(v);
        seen.add(v.id);
        if (out.length >= limit) break;
      }
    }
  }

  return out;
}

/** Videos for Dialogue “Great philosophers” — ignores stale global interest */
export function recommendVideosForPhilosopher(
  philosopherId: string,
  meta: { name: string; tradition: string; hook: string },
  options: { limit?: number; language?: AppLanguage } = {},
): PhilosophyVideo[] {
  const limit = options.limit ?? 8;
  const language = options.language ?? "en";
  const pool = videosForLanguage(language);
  const searchTerms = philosopherSearchTerms(
    philosopherId,
    meta.name,
    meta.tradition,
    meta.hook,
  );
  const corpus = searchTerms.join(" ").toLowerCase();
  const themes = interestThemeSet({
    themeIds: inferThemeIdsFromText(corpus),
    corpus: [corpus],
    updatedAt: Date.now(),
  });

  const tagged = pool.filter((v) => v.philosopherIds?.includes(philosopherId));
  const out: PhilosophyVideo[] = [];
  const seen = new Set<string>();

  for (const video of tagged) {
    if (seen.has(video.id)) continue;
    seen.add(video.id);
    out.push(video);
    if (out.length >= limit) break;
  }

  if (out.length >= limit) return out;

  const scored = pool
    .map((video) => ({
      video,
      score:
        scorePhilosopherMatch(video, philosopherId, searchTerms) +
        scoreVideo(video, themes, corpus),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const { video, score } of scored) {
    if (score < 80 && !video.philosopherIds?.includes(philosopherId)) continue;
    if (seen.has(video.id)) continue;
    seen.add(video.id);
    out.push(video);
    if (out.length >= limit) break;
  }

  if (out.length < limit) {
    for (const v of featuredVideos(limit, language)) {
      if (!seen.has(v.id)) {
        out.push(v);
        seen.add(v.id);
        if (out.length >= limit) break;
      }
    }
  }

  return out;
}

function rankByTheme(
  themeId: string,
  limit: number,
  language: AppLanguage,
): PhilosophyVideo[] {
  const pool = videosForLanguage(language);
  const matches = pool.filter((v) => v.themeIds.includes(themeId));
  if (matches.length >= limit) return matches.slice(0, limit);
  const out = [...matches];
  const seen = new Set(matches.map((v) => v.id));
  for (const v of featuredVideos(limit, language)) {
    if (out.length >= limit) break;
    if (!seen.has(v.id)) {
      out.push(v);
      seen.add(v.id);
    }
  }
  return out.slice(0, limit);
}

export function mergeInterest(
  prev: DialogueInterest,
  patch: Partial<Pick<DialogueInterest, "themeIds" | "corpus">>,
): DialogueInterest {
  const themeIds = [...new Set([...prev.themeIds, ...(patch.themeIds ?? [])])].slice(
    -12,
  );
  const corpus = [...prev.corpus, ...(patch.corpus ?? [])].slice(-24);
  return { themeIds, corpus, updatedAt: Date.now() };
}

export function interestFromText(...chunks: string[]): Partial<DialogueInterest> {
  const text = chunks.filter(Boolean).join(" ");
  return {
    themeIds: inferThemeIdsFromText(text),
    corpus: [text.slice(0, 500)],
  };
}

const INQUIRY_CATEGORY_THEMES: Record<InquiryCategory, string[]> = {
  inquiry: ["method", "self"],
  paradox: ["reality", "self", "method"],
  ethics: ["ethics"],
  existential: ["liberation", "suffering"],
};

/** Match videos to an inquire question, filter, or global interest */
export function recommendVideosForInquire(
  interest: DialogueInterest,
  options: {
    limit?: number;
    tradition?: string;
    category?: InquiryCategory;
    prompt?: string;
    language?: AppLanguage;
  } = {},
): PhilosophyVideo[] {
  const limit = options.limit ?? 3;
  const categoryThemes =
    options.category && INQUIRY_CATEGORY_THEMES[options.category]
      ? INQUIRY_CATEGORY_THEMES[options.category]
      : [];

  const fromText = interestFromText(
    options.tradition ?? "",
    options.category ?? "",
    options.prompt ?? "",
  );

  const merged = mergeInterest(interest, {
    themeIds: [...categoryThemes, ...(fromText.themeIds ?? [])],
    corpus: fromText.corpus,
  });

  return recommendVideos(merged, {
    limit,
    language: options.language,
  });
}
