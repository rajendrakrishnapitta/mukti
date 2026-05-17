import { useMemo } from "react";
import {
  readingsForPhilosopher,
  type ReadingItem,
  type ReadingKind,
} from "../data/philosopherReadings";
import { useLanguage } from "../i18n";
import styles from "./PhilosopherReadings.module.css";

interface PhilosopherReadingsProps {
  philosopherId: string;
}

const KIND_ORDER: ReadingKind[] = ["primary", "secondary", "reference"];

function groupByKind(items: ReadingItem[]): Map<ReadingKind, ReadingItem[]> {
  const map = new Map<ReadingKind, ReadingItem[]>();
  for (const item of items) {
    const kind = item.kind ?? "primary";
    const list = map.get(kind) ?? [];
    list.push(item);
    map.set(kind, list);
  }
  return map;
}

export function PhilosopherReadings({ philosopherId }: PhilosopherReadingsProps) {
  const { t } = useLanguage();
  const items = readingsForPhilosopher(philosopherId);

  const grouped = useMemo(() => groupByKind(items), [items]);

  const sectionLabel = (kind: ReadingKind): string => {
    switch (kind) {
      case "primary":
        return t.dialogue.readingsPrimary;
      case "secondary":
        return t.dialogue.readingsSecondary;
      case "reference":
        return t.dialogue.readingsReference;
    }
  };

  if (items.length === 0) return null;

  return (
    <section className={styles.wrap} aria-label={t.dialogue.booksAndReferences}>
      <h3 className={styles.title}>{t.dialogue.booksAndReferences}</h3>
      {KIND_ORDER.map((kind) => {
        const list = grouped.get(kind);
        if (!list?.length) return null;
        return (
          <div key={kind} className={styles.group}>
            <h4 className={styles.groupTitle}>{sectionLabel(kind)}</h4>
            <ul>
              {list.map((item) => (
                <li key={item.title}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
