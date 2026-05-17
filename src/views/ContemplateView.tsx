import { useEffect, useMemo, useState } from "react";
import { PhilosophyVideoRow } from "../components/PhilosophyVideoRow";
import { InquiryCard } from "../components/InquiryCard";
import { useDialogueInterest } from "../context/DialogueInterestContext";
import { contemplations, type InquiryCategory } from "../data/content";
import { recommendVideosForInquire } from "../lib/recommendVideos";
import { formatTemplate, useLanguage } from "../i18n";
import type { DialogueRequest } from "../types";
import styles from "./ContemplateView.module.css";

type Filter = "all" | InquiryCategory;

interface ContemplateViewProps {
  onOpenDialogue: (request: Omit<DialogueRequest, "id">) => void;
}

export function ContemplateView({ onOpenDialogue }: ContemplateViewProps) {
  const { t, language } = useLanguage();
  const { interest, getRecommendedVideos, recordInquire } = useDialogueInterest();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (filter !== "all") {
      recordInquire({ category: filter });
    }
  }, [filter, recordInquire]);

  const featuredVideos = useMemo(() => {
    if (filter === "all") return getRecommendedVideos(5);
    return recommendVideosForInquire(interest, {
      limit: 5,
      category: filter,
      language,
    });
  }, [filter, interest, getRecommendedVideos, language]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? contemplations
        : contemplations.filter((c) => c.category === filter),
    [filter],
  );

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.inquire.all },
    { id: "inquiry", label: t.inquire.inquiry },
    { id: "paradox", label: t.inquire.paradox },
    { id: "ethics", label: t.inquire.ethics },
    { id: "existential", label: t.inquire.existential },
  ];

  const countLabel =
    filtered.length === 1
      ? t.inquire.countOne
      : formatTemplate(t.inquire.count, { count: filtered.length });

  return (
    <div className={styles.contemplate}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.inquire.title}</h1>
        <p className={styles.subtitle}>{t.inquire.subtitle}</p>
        {language !== "en" ? (
          <p className={styles.staticNote}>{t.inquire.staticNote}</p>
        ) : null}
      </header>

      <section
        className={styles.watchFeatured}
        aria-labelledby="inquire-watch-heading"
      >
        <h2 id="inquire-watch-heading" className={styles.watchTitle}>
          {t.watch.sectionTitle}
        </h2>
        <p className={styles.watchIntro}>{t.watch.contextualSubtitle}</p>
        <PhilosophyVideoRow videos={featuredVideos} label={t.watch.sectionTitle} />
      </section>

      <div className={styles.stickyNav}>
        <p className={styles.scrollHint}>{t.inquire.filterSwipe}</p>
        <div className={styles.filters} role="group" aria-label="Filter by type">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count}>{countLabel}</p>

      <div className={styles.inquiryFeed}>
        {filtered.map((c) => (
          <InquiryCard
            key={c.id}
            contemplation={c}
            onOpenDialogue={onOpenDialogue}
          />
        ))}
      </div>
    </div>
  );
}
