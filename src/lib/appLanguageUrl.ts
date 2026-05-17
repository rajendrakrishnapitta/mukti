import type { AppLanguage } from "../i18n/types";

export function parseAppLanguageParam(
  value: string | null | undefined,
): AppLanguage | null {
  if (value === "en" || value === "hi" || value === "te" || value === "ta") {
    return value;
  }
  return null;
}

export function languageFromSearch(search: string): AppLanguage | null {
  return parseAppLanguageParam(new URLSearchParams(search).get("lang"));
}

export function languageFromWindow(): AppLanguage | null {
  if (typeof window === "undefined") return null;
  return languageFromSearch(window.location.search);
}

/** Keep share links in sync when the user changes language */
export function syncLanguageInUrl(lang: AppLanguage): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url.toString());
}

export function teluguShareUrl(origin = "https://mukti-ebon.vercel.app"): string {
  const url = new URL(origin);
  url.searchParams.set("lang", "te");
  return url.toString();
}

export const REGIONAL_LANGUAGES: AppLanguage[] = ["hi", "te", "ta"];

export function isRegionalLanguage(lang: AppLanguage): boolean {
  return REGIONAL_LANGUAGES.includes(lang);
}
