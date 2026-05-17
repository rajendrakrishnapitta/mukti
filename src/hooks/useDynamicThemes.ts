import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { themeExplorations, type ThemeExploration } from "../data/content";
import type { AppLanguage } from "../i18n";

function storageKey(language: AppLanguage) {
  return `mukti-dynamic-themes-v1-${language}`;
}

export type ExploreTheme = ThemeExploration & { generated?: boolean };

function loadStored(language: AppLanguage): ExploreTheme[] {
  try {
    const raw = localStorage.getItem(storageKey(language));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ExploreTheme[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStored(language: AppLanguage, themes: ExploreTheme[]) {
  try {
    localStorage.setItem(storageKey(language), JSON.stringify(themes.slice(-40)));
  } catch {
    /* quota */
  }
}

export function useDynamicThemes(language: AppLanguage) {
  const [dynamic, setDynamic] = useState<ExploreTheme[]>(() =>
    loadStored(language),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const bootstrapped = useRef(false);

  const themes = useMemo<ExploreTheme[]>(
    () => [...themeExplorations, ...dynamic],
    [dynamic],
  );

  const existingTitles = useMemo(
    () => themes.map((t) => t.theme),
    [themes],
  );

  const fetchMore = useCallback(
    async (count = 2) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/themes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ existingThemes: existingTitles, count, language }),
        });
        if (!res.ok) {
          let detail = `Request failed (${res.status})`;
          try {
            const json = (await res.json()) as { error?: string };
            if (json.error) detail = json.error;
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }
        const data = (await res.json()) as { themes?: ExploreTheme[] };
        const incoming = (data.themes ?? []).map((t) => ({
          ...t,
          generated: true,
        }));
        if (incoming.length === 0) {
          throw new Error("No new themes returned");
        }
        setDynamic((prev) => {
          const seen = new Set([
            ...themeExplorations.map((t) => t.id),
            ...prev.map((t) => t.id),
          ]);
          const seenTitles = new Set(
            [...themeExplorations, ...prev].map((t) => t.theme.toLowerCase()),
          );
          const merged = [...prev];
          for (const t of incoming) {
            if (seen.has(t.id) || seenTitles.has(t.theme.toLowerCase())) continue;
            seen.add(t.id);
            seenTitles.add(t.theme.toLowerCase());
            merged.push(t);
          }
          saveStored(language, merged);
          return merged;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load themes");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [existingTitles, language],
  );

  useEffect(() => {
    setDynamic(loadStored(language));
    bootstrapped.current = false;
  }, [language]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (dynamic.length === 0) {
      void fetchMore(2);
    }
  }, [language, dynamic.length, fetchMore]);

  return {
    themes,
    dynamicCount: dynamic.length,
    loading,
    error,
    fetchMore,
    canGenerate: true,
  };
}
