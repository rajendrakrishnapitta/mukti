import { useRef, useState } from "react";
import { curatedComparisons, journeyDays, journeyTitle } from "../data/journey";
import styles from "./JourneyView.module.css";

const storageKey = "mukti:who-am-i:v1";

type JourneyProgress = {
  dayId: string;
  notes: Record<string, string>;
  completed: string[];
};

function readProgress(): JourneyProgress {
  const initial = { dayId: journeyDays[0].id, notes: {}, completed: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (!saved) return initial;
    const notes: Record<string, string> = {};
    for (const day of journeyDays) {
      const note = saved.notes?.[day.id];
      if (typeof note === "string") notes[day.id] = note;
    }
    return {
      dayId: journeyDays.find((day) => day.id === saved.dayId)?.id ?? initial.dayId,
      notes,
      completed: Array.isArray(saved.completed)
        ? journeyDays.filter((day) => saved.completed.includes(day.id)).map((day) => day.id)
        : [],
    };
  } catch {
    return initial;
  }
}

export function JourneyView() {
  const [progress, setProgress] = useState(readProgress);
  const [storageError, setStorageError] = useState(false);
  const lessonHeading = useRef<HTMLHeadingElement>(null);
  const index = journeyDays.findIndex((day) => day.id === progress.dayId);
  const day = journeyDays[index];
  const complete = progress.completed.includes(day.id);

  function save(next: JourneyProgress) {
    setProgress(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function selectDay(dayId: string) {
    save({ ...progress, dayId });
    requestAnimationFrame(() => lessonHeading.current?.focus());
  }

  return (
    <div className={styles.journey} lang="en">
      <header className={styles.hero}>
        <h1>{journeyTitle}</h1>
        <p>Seven days with early Buddhism and Advaita Vedānta</p>
        <p>Read a short passage, compare the two traditions, and write about what you notice in your own life.</p>
      </header>

      <div className={styles.lessons}>
        <aside className={styles.outline} aria-label="Journey outline">
          <h2>Journey outline</h2>
          <p aria-live="polite">{progress.completed.length} of {journeyDays.length} days complete</p>
          <ol>
            {journeyDays.map((item, position) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={item.id === day.id ? "step" : undefined}
                  onClick={() => selectDay(item.id)}
                >
                  <span>Day {position + 1}{progress.completed.includes(item.id) ? " · Complete" : ""}</span>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <article className={styles.lesson} aria-labelledby="journey-day">
          <p className={styles.dayLabel}>Day {index + 1}</p>
          <h2 id="journey-day" ref={lessonHeading} tabIndex={-1}>{day.title}</h2>
          <h3>Reading in brief</h3>
          <p>{day.reading}</p>
          <h3>Compare the traditions</h3>
          <p>{day.comparison}</p>
          <ul className={styles.sources} aria-label="Read the sources">
            {day.sources.map((source) => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>
            ))}
          </ul>
          <div className={styles.reflection}>
            <h3><label htmlFor="journey-note">Private reflection</label></h3>
            <p id="journey-prompt">{day.prompt}</p>
            <textarea
              id="journey-note"
              aria-describedby="journey-prompt journey-storage"
              value={progress.notes[day.id] ?? ""}
              onChange={(event) => save({
                ...progress,
                notes: { ...progress.notes, [day.id]: event.target.value },
              })}
            />
            <p id="journey-storage" role="status">
              {storageError ? "This browser couldn’t save your changes. Copy your note before leaving." : "Your notes and progress stay in this browser."}
            </p>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => save({
                ...progress,
                completed: complete
                  ? progress.completed.filter((id) => id !== day.id)
                  : [...progress.completed, day.id],
              })}
            >
              {complete ? "Mark incomplete" : "Mark complete"}
            </button>
            {index + 1 < journeyDays.length && (
              <button type="button" onClick={() => selectDay(journeyDays[index + 1].id)}>Next day</button>
            )}
          </div>
        </article>
      </div>

      <section className={styles.comparisons} aria-labelledby="curated-comparisons">
        <h2 id="curated-comparisons">Compare perspectives</h2>
        {curatedComparisons.map((comparison) => (
          <details key={comparison.title}>
            <summary>{comparison.title}</summary>
            <div className={styles.perspectives}>
              {comparison.perspectives.map((perspective) => (
                <div key={perspective.name}>
                  <h3>{perspective.name}</h3>
                  <p>{perspective.text}</p>
                  <a href={perspective.source.url} target="_blank" rel="noreferrer">{perspective.source.label}</a>
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
