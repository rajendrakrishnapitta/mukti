import { useCallback, useEffect, useRef, useState } from "react";
import { PhilosophyVideoRow } from "../components/PhilosophyVideoRow";
import { wisdomPaths, type ThemeExploration } from "../data/content";
import { useDialogueInterest } from "../context/DialogueInterestContext";
import {
  pathDialoguePrompt,
  perspectiveDialoguePrompt,
  themeDialoguePrompt,
  themeDialogueStarters,
} from "../lib/exploreDialogue";
import { useDynamicThemes } from "../hooks/useDynamicThemes";
import { formatTemplate, useLanguage } from "../i18n";
import type { DialogueRequest } from "../types";
import styles from "./BridgeView.module.css";

interface BridgeViewProps {
  onOpenDialogue: (request: Omit<DialogueRequest, "id">) => void;
}

export function BridgeView({ onOpenDialogue }: BridgeViewProps) {
  const { t, language } = useLanguage();
  const { getRecommendedVideos, recordThemeBrowse } = useDialogueInterest();
  const { themes, loading, error, fetchMore, dynamicCount } =
    useDynamicThemes(language);
  const [activeId, setActiveId] = useState(themes[0]?.id ?? "");
  const loadSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!themes.some((t) => t.id === activeId) && themes[0]) {
      setActiveId(themes[0].id);
    }
  }, [themes, activeId]);

  useEffect(() => {
    const theme = themes.find((th) => th.id === activeId);
    if (theme) recordThemeBrowse(theme.id, theme.theme, theme.overview);
  }, [activeId, themes, recordThemeBrowse]);

  const scrollToTheme = useCallback((id: string) => {
    setActiveId(id);
    document.getElementById(`theme-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const openTheme = (theme: ThemeExploration) => {
    onOpenDialogue({
      source: "explore",
      themeId: theme.id,
      label: theme.theme,
      prompt: themeDialoguePrompt(theme),
      autoSend: true,
    });
  };

  const openPerspective = (
    theme: ThemeExploration,
    tradition: string,
    insight: string,
  ) => {
    onOpenDialogue({
      source: "explore",
      themeId: theme.id,
      tradition,
      label: `${theme.theme} · ${tradition}`,
      prompt: perspectiveDialoguePrompt(theme, tradition, insight),
      autoSend: true,
    });
  };

  const openPath = (path: (typeof wisdomPaths)[number]) => {
    onOpenDialogue({
      source: "explore",
      themeId: path.id,
      label: path.name,
      prompt: pathDialoguePrompt(path),
      autoSend: true,
    });
  };

  const openStarter = (theme: ThemeExploration, prompt: string) => {
    onOpenDialogue({
      source: "explore",
      themeId: theme.id,
      label: theme.theme,
      prompt,
      autoSend: true,
    });
  };

  const featuredForYou = getRecommendedVideos(5);

  useEffect(() => {
    const el = loadSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading) {
          void fetchMore(2);
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore, loading]);

  return (
    <div className={styles.bridge}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.explore.title}</h1>
        <p className={styles.subtitle}>{t.explore.subtitle}</p>
        {language !== "en" ? (
          <p className={styles.staticNote}>{t.explore.staticNote}</p>
        ) : null}
      </header>

      <section
        className={styles.watchFeatured}
        aria-labelledby="watch-featured-heading"
      >
        <h2 id="watch-featured-heading" className={styles.sectionLabel}>
          {t.watch.sectionTitle}
        </h2>
        <p className={styles.watchIntro}>{t.watch.contextualSubtitle}</p>
        <PhilosophyVideoRow
          videos={featuredForYou}
          label={t.watch.sectionTitle}
        />
        <p className={styles.watchDisclaimer}>{t.watch.disclaimer}</p>
      </section>

      <div className={styles.stickyNav}>
        <p className={styles.scrollHint}>
          {formatTemplate(t.explore.themesCount, { count: themes.length })}
          {dynamicCount > 0
            ? formatTemplate(t.explore.themesNew, { count: dynamicCount })
            : ""}
        </p>
        <div className={styles.themes} role="tablist" aria-label="Themes">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              role="tab"
              aria-selected={theme.id === activeId}
              className={`${styles.themeBtn} ${theme.id === activeId ? styles.themeActive : ""}`}
              onClick={() => scrollToTheme(theme.id)}
            >
              {theme.theme}
              {theme.generated ? (
                <span className={styles.newDot} aria-hidden />
              ) : null}
            </button>
          ))}
          {loading ? (
            <span className={styles.themeLoading} aria-live="polite">
              …
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.themeFeed}>
        {themes.map((theme) => {
          const starters = themeDialogueStarters(theme);
          return (
            <section
              key={theme.id}
              id={`theme-${theme.id}`}
              className={styles.themeSection}
              aria-labelledby={`theme-heading-${theme.id}`}
            >
              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.titleRow}>
                    <h2
                      id={`theme-heading-${theme.id}`}
                      className={styles.themeTitle}
                    >
                      {theme.theme}
                    </h2>
                    {theme.generated ? (
                      <span className={styles.generatedBadge}>
                        {t.explore.newBadge}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={styles.dialogueBtn}
                    onClick={() => openTheme(theme)}
                  >
                    {t.explore.discussDialogue}
                  </button>
                </div>
                <p className={styles.overview}>{theme.overview}</p>

                <p className={styles.scrollHint}>{t.explore.traditionsSwipe}</p>
                <div className={styles.perspectiveScroll}>
                  {theme.perspectives.map((p) => (
                    <section
                      key={`${theme.id}-${p.tradition}`}
                      className={styles.perspectiveCard}
                    >
                      <span className={styles.perspectiveLabel}>
                        {p.tradition}
                      </span>
                      <p>{p.insight}</p>
                      <button
                        type="button"
                        className={styles.perspectiveDialogue}
                        onClick={() =>
                          openPerspective(theme, p.tradition, p.insight)
                        }
                      >
                        {t.explore.askDialogue}
                      </button>
                    </section>
                  ))}
                </div>

                <section
                  className={styles.watchTheme}
                  aria-label={`${t.watch.forTheme}: ${theme.theme}`}
                >
                  <h3 className={styles.sectionLabel}>{t.watch.forTheme}</h3>
                  <PhilosophyVideoRow
                    videos={getRecommendedVideos(3, theme.id)}
                    label={`${t.watch.forTheme}: ${theme.theme}`}
                  />
                </section>
              </article>

              <section
                className={styles.dialogueSection}
                aria-label={`Dialogue starters for ${theme.theme}`}
              >
                <h3 className={styles.sectionLabel}>{t.explore.continueDialogue}</h3>
                <p className={styles.dialogueIntro}>
                  {t.explore.continueFor} <strong>{theme.theme}</strong>
                </p>
                <div className={styles.starterScroll}>
                  {starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.starterBtn}
                      onClick={() => openStarter(theme, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            </section>
          );
        })}
      </div>

      <div ref={loadSentinelRef} className={styles.loadSentinel} aria-hidden />

      <div className={styles.loadMoreBlock}>
        {loading ? (
          <p className={styles.loadStatus} aria-live="polite">
            {t.explore.findingThemes}
          </p>
        ) : error ? (
          <p className={styles.loadError} role="alert">
            {error}
          </p>
        ) : (
          <p className={styles.loadStatus}>
            {t.explore.scrollMore}
          </p>
        )}
        <button
          type="button"
          className={styles.loadMoreBtn}
          onClick={() => void fetchMore(2)}
          disabled={loading}
        >
          {loading ? t.explore.loading : t.explore.discoverMore}
        </button>
      </div>

      <h2 className={styles.sectionLabel}>{t.explore.wisdomPaths}</h2>
      <p className={styles.pathsIntro}>{t.explore.pathsIntro}</p>
      <p className={styles.scrollHint}>{t.explore.pathsSwipe}</p>

      <div className={styles.pathScroll}>
        {wisdomPaths.map((path) => (
          <article key={path.id} className={styles.pathCard}>
            <h3 className={styles.pathName}>{path.name}</h3>
            <p className={styles.pathInsight}>{path.insight}</p>
            <p className={styles.pathPractice}>
              <span className={styles.pathPracticeLabel}>{t.explore.tryLabel}</span>
              {path.practice}
            </p>
            <button
              type="button"
              className={styles.pathDialogue}
              onClick={() => openPath(path)}
            >
              {t.explore.explorePath}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
