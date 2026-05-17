import { useMemo } from "react";
import type { Contemplation } from "../data/content";
import { PhilosophyVideoRow } from "./PhilosophyVideoRow";
import { TraditionBadge } from "./TraditionBadge";
import { useDialogueInterest } from "../context/DialogueInterestContext";
import { useJournal } from "../hooks/useJournal";
import { useLanguage } from "../i18n";
import { recommendVideosForInquire } from "../lib/recommendVideos";
import {
  contemplationDialoguePrompt,
  contemplationDialogueStarters,
} from "../lib/inquireDialogue";
import type { DialogueRequest } from "../types";
import styles from "./InquiryCard.module.css";

interface InquiryCardProps {
  contemplation: Contemplation;
  onOpenDialogue: (request: Omit<DialogueRequest, "id">) => void;
}

function labelFor(c: Contemplation) {
  const short = c.prompt.length > 48 ? `${c.prompt.slice(0, 45)}…` : c.prompt;
  return `${c.tradition}: ${short}`;
}

export function InquiryCard({ contemplation, onOpenDialogue }: InquiryCardProps) {
  const { t, language } = useLanguage();
  const { interest } = useDialogueInterest();
  const { entry, save } = useJournal(contemplation.id);
  const starters = contemplationDialogueStarters(contemplation);

  const relatedVideos = useMemo(
    () =>
      recommendVideosForInquire(interest, {
        limit: 3,
        tradition: contemplation.tradition,
        category: contemplation.category,
        prompt: contemplation.prompt,
        language,
      }),
    [interest, contemplation, language],
  );

  const openInquiry = (prompt: string) => {
    onOpenDialogue({
      source: "inquire",
      label: labelFor(contemplation),
      prompt,
      tradition: contemplation.tradition,
      category: contemplation.category,
      autoSend: true,
    });
  };

  const discussInDialogue = () => {
    openInquiry(contemplationDialoguePrompt(contemplation, entry));
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.badges}>
          <TraditionBadge label={contemplation.tradition} />
          <span className={styles.categoryTag}>{contemplation.category}</span>
        </div>
        <button
          type="button"
          className={styles.dialogueBtn}
          onClick={discussInDialogue}
        >
            {t.inquire.discussDialogue}
          </button>
      </div>
      <p className={styles.prompt}>{contemplation.prompt}</p>
      {contemplation.hint && (
        <p className={styles.hint}>
            <span className={styles.hintLabel}>{t.inquire.hint}</span>
          {contemplation.hint}
        </p>
      )}
      {contemplation.source && (
        <p className={styles.source}>— {contemplation.source}</p>
      )}

      <label className={styles.journalLabel} htmlFor={`journal-${contemplation.id}`}>
        {t.inquire.journalLabel}
      </label>
      <textarea
        id={`journal-${contemplation.id}`}
        className={styles.journal}
        value={entry}
        onChange={(e) => save(e.target.value)}
        placeholder={t.inquire.journalPlaceholder}
        rows={4}
      />

      {relatedVideos.length > 0 ? (
        <section
          className={styles.videos}
          aria-label={t.inquire.videosForQuestion}
        >
          <h3 className={styles.videosLabel}>{t.inquire.videosForQuestion}</h3>
          <PhilosophyVideoRow
            videos={relatedVideos}
            label={t.inquire.videosForQuestion}
          />
        </section>
      ) : null}

      <p className={styles.scrollHint}>{t.inquire.followUpsSwipe}</p>
      <div className={styles.starterScroll}>
        {starters.map((s) => (
          <button
            key={s}
            type="button"
            className={styles.starterBtn}
            onClick={() => openInquiry(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </article>
  );
}
