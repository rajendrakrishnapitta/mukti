import type { AppLanguage } from "../i18n/types";
import type { PhilosophyVideo } from "./philosophyVideoTypes";
export type { PhilosophyVideo } from "./philosophyVideoTypes";
import { mergePhilosopherVideoTags } from "./mergePhilosopherVideoTags";
import { philosopherDedicatedVideos } from "./philosopherVideosCatalog";
import {
  philosophyVideosHi,
  philosophyVideosTa,
  philosophyVideosTe,
} from "./philosophyVideosRegional";

const ENGLISH: AppLanguage[] = ["en"];

function asEnglish(
  video: Omit<PhilosophyVideo, "languages">,
): PhilosophyVideo {
  return { ...video, languages: ENGLISH };
}

/**
 * Curated talks — each youtubeId verified via YouTube oEmbed (exists + embeddable).
 */
const philosophyVideosEn: PhilosophyVideo[] = [
  asEnglish({
    id: "map-philosophy",
    youtubeId: "YxBShJU_CKs",
    title: "The Map of Philosophy",
    channel: "Carneades.org",
    themeIds: ["method", "featured", "reality"],
  }),
  asEnglish({
    id: "justice-sandel",
    youtubeId: "kBdfcR-8hEY",
    title: "Justice: The Moral Side of Murder",
    channel: "Harvard University",
    themeIds: ["ethics", "featured"],
  }),
  asEnglish({
    id: "stoicism-intro",
    youtubeId: "o0MzQZ_eFEY",
    title: "Introduction to Stoicism",
    channel: "Academy of Ideas",
    themeIds: ["suffering", "ethics", "liberation", "featured"],
  }),
  asEnglish({
    id: "optimistic-nihilism",
    youtubeId: "MBRqu0YOH14",
    title: "Optimistic Nihilism",
    channel: "Kurzgesagt",
    themeIds: ["suffering", "liberation", "featured"],
  }),
  asEnglish({
    id: "change-life",
    youtubeId: "75d_29QWELk",
    title: "Change Your Life — One Tiny Step at a Time",
    channel: "Kurzgesagt",
    themeIds: ["self", "suffering", "liberation"],
  }),
  asEnglish({
    id: "alan-watts-real-you",
    youtubeId: "mMRrCYPxD0I",
    title: "The Real You — Alan Watts",
    channel: "Alan Watts",
    themeIds: ["self", "featured"],
  }),
  asEnglish({
    id: "mind-resides",
    youtubeId: "3SJROTXnmus",
    title: "Where Does Your Mind Reside?",
    channel: "Crash Course Philosophy",
    themeIds: ["self", "reality"],
  }),
  asEnglish({
    id: "existentialism-cc",
    youtubeId: "YaDvRdLMkHs",
    title: "Existentialism",
    channel: "Crash Course Philosophy",
    themeIds: ["liberation", "ethics"],
  }),
  asEnglish({
    id: "lao-tzu",
    youtubeId: "dFb7Hxva5rg",
    title: "Eastern Philosophy — Lao Tzu",
    channel: "The School of Life",
    themeIds: ["reality", "method"],
  }),
  asEnglish({
    id: "wu-wei",
    youtubeId: "NvZi7ZV-SWI",
    title: "Eastern Philosophy — Wu Wei",
    channel: "The School of Life",
    themeIds: ["reality", "method", "liberation"],
  }),
  asEnglish({
    id: "socrates-democracy",
    youtubeId: "fLJBzhcSWTk",
    title: "Why Socrates Hated Democracy",
    channel: "The School of Life",
    themeIds: ["method", "ethics"],
  }),
  asEnglish({
    id: "know-yourself",
    youtubeId: "4lTbWQ8zD3w",
    title: "How to Know Yourself",
    channel: "The School of Life",
    themeIds: ["self", "method"],
  }),
  asEnglish({
    id: "plato-sol",
    youtubeId: "VDiyQub6vpw",
    title: "Philosophy — Plato",
    channel: "The School of Life",
    themeIds: ["reality", "method", "ethics"],
  }),
  asEnglish({
    id: "meaning-life",
    youtubeId: "nJ6A6GC_ki4",
    title: "The Meaning of Life",
    channel: "The School of Life",
    themeIds: ["liberation", "suffering", "featured"],
  }),
  asEnglish({
    id: "plato-cave",
    youtubeId: "1RWOpQXTltA",
    title: "Plato's Allegory of the Cave",
    channel: "TED-Ed",
    themeIds: ["reality", "method"],
  }),
  asEnglish({
    id: "free-will",
    youtubeId: "WSAo_qr4G-w",
    title: "Free Will — Contrastivism",
    channel: "Wireless Philosophy",
    themeIds: ["ethics", "self"],
  }),
  asEnglish({
    id: "marcus-aurelius",
    youtubeId: "wf-7i3UmTzU",
    title: "Stoicism: Marcus Aurelius",
    channel: "Academy of Ideas",
    themeIds: ["suffering", "ethics"],
  }),
  asEnglish({
    id: "epictetus",
    youtubeId: "wipudlxSFqo",
    title: "Epictetus and Stoicism",
    channel: "Academy of Ideas",
    themeIds: ["suffering", "liberation"],
  }),
  asEnglish({
    id: "the-egg",
    youtubeId: "h6fcK_fRYaI",
    title: "The Egg — A Short Story",
    channel: "Kurzgesagt",
    themeIds: ["liberation", "reality"],
  }),
  asEnglish({
    id: "what-is-philosophy",
    youtubeId: "mIYdx6lDDhg",
    title: "What Is Philosophy For?",
    channel: "The School of Life",
    themeIds: ["method", "featured"],
  }),
  asEnglish({
    id: "stress-ted",
    youtubeId: "8jPQjjsBbIc",
    title: "How to Stay Calm When You're Stressed",
    channel: "Kelly McGonigal / TED",
    themeIds: ["suffering", "self"],
  }),
];

const philosophyVideosBase: PhilosophyVideo[] = [
  ...philosophyVideosEn,
  ...philosopherDedicatedVideos,
  ...philosophyVideosHi,
  ...philosophyVideosTe,
  ...philosophyVideosTa,
];

export const philosophyVideos: PhilosophyVideo[] =
  mergePhilosopherVideoTags(philosophyVideosBase);

export function videoLanguages(video: PhilosophyVideo): AppLanguage[] {
  return video.languages?.length ? video.languages : ENGLISH;
}

/** Pool for recommendations — regional langs are Telugu/Hindi/Tamil only (no English mix) */
export function videosForLanguage(language: AppLanguage): PhilosophyVideo[] {
  return philosophyVideos.filter((v) => videoLanguages(v).includes(language));
}

export function videosForTheme(
  themeId: string,
  limit = 3,
  language: AppLanguage = "en",
): PhilosophyVideo[] {
  const pool = videosForLanguage(language);
  const matches = pool.filter((v) => v.themeIds.includes(themeId));
  if (matches.length >= limit) return matches.slice(0, limit);
  const featured = pool.filter((v) => v.themeIds.includes("featured"));
  const seen = new Set(matches.map((v) => v.id));
  for (const v of featured) {
    if (matches.length >= limit) break;
    if (!seen.has(v.id)) {
      matches.push(v);
      seen.add(v.id);
    }
  }
  return matches.slice(0, limit);
}

export function featuredVideos(
  limit = 6,
  language: AppLanguage = "en",
): PhilosophyVideo[] {
  const pool = videosForLanguage(language);
  const ids = new Set<string>();
  const out: PhilosophyVideo[] = [];
  for (const v of pool) {
    if (!v.themeIds.includes("featured")) continue;
    if (ids.has(v.id)) continue;
    ids.add(v.id);
    out.push(v);
    if (out.length >= limit) break;
  }
  return out;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/** Standard embed — works reliably when video IDs are valid */
export function youtubeEmbedUrl(
  youtubeId: string,
  origin?: string,
  language?: AppLanguage,
): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (origin) params.set("origin", origin);
  if (language && language !== "en") {
    params.set("hl", language);
    params.set("cc_lang_pref", language);
  }
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

export function thumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
