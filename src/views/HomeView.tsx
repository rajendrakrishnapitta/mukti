import { useEffect, useMemo, useState } from "react";
import { PhilosophyInquirySelect } from "../components/PhilosophyInquirySelect";
import { PhilosophyVideoRow } from "../components/PhilosophyVideoRow";
import { TraditionBadge } from "../components/TraditionBadge";
import { UniversalWisdomScroll } from "../components/UniversalWisdomScroll";
import { useDialogueInterest } from "../context/DialogueInterestContext";
import { festivalForToday } from "../data/festivalWisdom";
import { philosopherIdForInquiry } from "../data/inquiryPhilosopherMap";
import {
  getPhilosophyInquiry,
  themeIdsForPhilosophyInquiry,
  type PhilosophyInquiryId,
} from "../data/philosophyInquiries";
import { getPhilosopherById } from "../data/philosophers";
import { formatTemplate, useLanguage } from "../i18n";
import { recommendVideos } from "../lib/recommendVideos";
import { getStreak, recordDailyVisit } from "../lib/dialogueStorage";
import type { DialogueRequest, ViewId } from "../types";
import styles from "./HomeView.module.css";

interface HomeViewProps {
  onNavigate: (view: ViewId) => void;
  onOpenDialogue: (request: Omit<DialogueRequest, "id">) => void;
}

export function HomeView({ onNavigate, onOpenDialogue }: HomeViewProps) {
  const { t, locale, language } = useLanguage();
  const { interest, getRecommendedVideos } = useDialogueInterest();
  const [philosophyId, setPhilosophyId] = useState<PhilosophyInquiryId>("daily");
  const [streak, setStreak] = useState(() => getStreak());

  useEffect(() => {
    setStreak(recordDailyVisit());
  }, []);

  const activeInquiry = useMemo(
    () => getPhilosophyInquiry(philosophyId),
    [philosophyId],
  );

  const matchedPhilosopherId = useMemo(
    () => philosopherIdForInquiry(philosophyId),
    [philosophyId],
  );
  const matchedPhilosopher = useMemo(
    () => (matchedPhilosopherId ? getPhilosopherById(matchedPhilosopherId) : undefined),
    [matchedPhilosopherId],
  );

  const festival = useMemo(() => festivalForToday(), []);

  const recommendedVideos = useMemo(() => {
    const themeIds = themeIdsForPhilosophyInquiry(philosophyId);
    if (themeIds.length > 0) {
      return recommendVideos(
        {
          ...interest,
          themeIds: [...new Set([...interest.themeIds, ...themeIds])],
        },
        { limit: 5, language },
      );
    }
    return getRecommendedVideos(5);
  }, [philosophyId, interest, language, getRecommendedVideos]);

  const dateLabel = new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const shareInquiry = async () => {
    const text = `${activeInquiry.tradition}\n\n${activeInquiry.prompt}\n\n— Mukti`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mukti inquiry", text });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={styles.home}>
      <p className={styles.date}>{dateLabel}</p>

      {streak.count > 1 ? (
        <p className={styles.streak}>
          {formatTemplate(t.home.streakDays, { count: String(streak.count) })}
        </p>
      ) : null}

      {festival ? (
        <aside className={styles.festival} aria-label={t.home.festivalNote}>
          <span className={styles.festivalLabel}>{festival.label}</span>
          <p className={styles.festivalQuote}>&ldquo;{festival.quote}&rdquo;</p>
          <cite className={styles.festivalSource}>{festival.source}</cite>
        </aside>
      ) : null}

      <UniversalWisdomScroll />

      <section className={styles.intro}>
        <h2 className={styles.heading}>{t.home.knowYourself}</h2>
        <p>
          {language === "en" ? (
            <>
              Mukti is an open space for <strong>{t.home.introStrong1}</strong> through
              humanity&apos;s philosophies, sciences, mystic paths, and psychology —
              plus what lives on the internet today, when you use{" "}
              <strong>{t.home.introStrong2}</strong> with web search. No single tradition
              owns the door.
            </>
          ) : (
            t.home.intro
          )}
        </p>
      </section>

      <section className={styles.preview}>
        <h2 className={styles.heading}>{t.home.todaysInquiry}</h2>
        <PhilosophyInquirySelect value={philosophyId} onChange={setPhilosophyId} />
        <div className={styles.previewCard}>
          <TraditionBadge label={activeInquiry.tradition} />
          <p className={styles.previewPrompt}>{activeInquiry.prompt}</p>
          {activeInquiry.hint ? (
            <p className={styles.previewHint}>{activeInquiry.hint}</p>
          ) : null}
          <div className={styles.inquiryActions}>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() =>
                onOpenDialogue({
                  prompt: activeInquiry.prompt,
                  label: activeInquiry.tradition,
                  tradition: activeInquiry.tradition,
                  source: "inquire",
                })
              }
            >
              {t.home.sitWithQuestion}
            </button>
            {matchedPhilosopher && matchedPhilosopherId ? (
              <button
                type="button"
                className={styles.linkBtnSecondary}
                onClick={() =>
                  onOpenDialogue({
                    prompt: activeInquiry.prompt,
                    label: activeInquiry.tradition,
                    tradition: activeInquiry.tradition,
                    philosopherId: matchedPhilosopherId,
                    source: "inquire",
                  })
                }
              >
                {formatTemplate(t.home.speakWithPhilosopher, {
                  name: matchedPhilosopher.name,
                })}
              </button>
            ) : null}
            <button
              type="button"
              className={styles.shareBtn}
              onClick={() => void shareInquiry()}
            >
              {t.home.shareInquiry}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.watch} aria-labelledby="home-watch-heading">
        <h2 id="home-watch-heading" className={styles.heading}>
          {t.watch.sectionTitle}
        </h2>
        <p className={styles.watchIntro}>{t.watch.contextualSubtitle}</p>
        <PhilosophyVideoRow
          videos={recommendedVideos}
          label={t.watch.sectionTitle}
        />
      </section>

      <div className={styles.cards}>
        <button
          type="button"
          className={styles.card}
          onClick={() => onNavigate("dialogue")}
        >
          <span className={styles.cardIcon}>問</span>
          <span className={styles.cardTitle}>{t.home.cardDialogueTitle}</span>
          <span className={styles.cardDesc}>{t.home.cardDialogueDesc}</span>
        </button>
        <button
          type="button"
          className={styles.card}
          onClick={() => onNavigate("practice")}
        >
          <span className={styles.cardIcon}>坐</span>
          <span className={styles.cardTitle}>{t.home.cardSitTitle}</span>
          <span className={styles.cardDesc}>{t.home.cardSitDesc}</span>
        </button>
      </div>
    </div>
  );
}
