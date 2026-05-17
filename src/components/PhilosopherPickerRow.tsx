import { useMemo, useState, type CSSProperties } from "react";
import type { PhilosopherProfile } from "../data/philosophers";
import { PhilosopherAvatar } from "./PhilosopherAvatar";
import styles from "./PhilosopherPickerRow.module.css";

interface PhilosopherPickerRowProps {
  philosophers: PhilosopherProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}

export function PhilosopherPickerRow({
  philosophers,
  selectedId,
  onSelect,
  label,
}: PhilosopherPickerRowProps) {
  const [hoverPaused, setHoverPaused] = useState(false);
  const [holdPaused, setHoldPaused] = useState(false);

  const loopPhilosophers = useMemo(
    () => [...philosophers, ...philosophers],
    [philosophers],
  );

  const durationSec = Math.max(48, philosophers.length * 10);
  const isPaused = hoverPaused || holdPaused;

  return (
    <section
      className={styles.row}
      aria-label={label}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => {
        setHoverPaused(false);
        setHoldPaused(false);
      }}
      onFocus={() => setHoverPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHoverPaused(false);
          setHoldPaused(false);
        }
      }}
    >
      <div className={styles.viewport}>
        <div
          className={`${styles.track} ${isPaused ? styles.trackPaused : ""}`}
          style={
            {
              "--philosopher-marquee-duration": `${durationSec}s`,
            } as CSSProperties
          }
        >
          {loopPhilosophers.map((p, i) => (
            <button
              key={`${p.id}-${i}`}
              type="button"
              role="tab"
              data-philosopher-id={p.id}
              aria-selected={p.id === selectedId}
              className={`${styles.card} ${
                p.id === selectedId ? styles.cardActive : ""
              }`}
              onClick={() => {
                setHoldPaused(true);
                onSelect(p.id);
              }}
            >
              <PhilosopherAvatar
                id={p.id}
                name={p.name}
                size="md"
                className={styles.cardAvatar}
              />
              <span className={styles.name}>{p.name}</span>
              <span className={styles.meta}>
                {p.tradition} · {p.era}
              </span>
              <span className={styles.hook}>{p.hook}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
