import { useMemo } from "react";
import type { PhilosopherProfile } from "../data/philosophers";
import { getPhilosopherById } from "../data/philosophers";
import { useLanguage } from "../i18n";
import { PhilosopherAvatar } from "./PhilosopherAvatar";
import styles from "./PhilosopherSelect.module.css";

interface PhilosopherSelectProps {
  philosophers: PhilosopherProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function sortByName(list: PhilosopherProfile[]): PhilosopherProfile[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

function isHindi(p: PhilosopherProfile): boolean {
  if (/[\u0900-\u097F]/.test(p.name)) return true;
  return p.tradition.toLowerCase().includes("hindi");
}

function isTeluguOrSouthIndian(p: PhilosopherProfile): boolean {
  if (isHindi(p)) return false;
  if (/[\u0C00-\u0C7F]/.test(p.name)) return true;
  const t = p.tradition.toLowerCase();
  return (
    t.includes("telugu") ||
    (t.includes("indian") && !t.includes("hindi")) ||
    t.includes("bahujan") ||
    t.includes("dalit")
  );
}

export function PhilosopherSelect({
  philosophers,
  selectedId,
  onSelect,
}: PhilosopherSelectProps) {
  const { t } = useLanguage();

  const { hindi, teluguIndian, world } = useMemo(() => {
    const sorted = sortByName(philosophers);
    const hindi: PhilosopherProfile[] = [];
    const teluguIndian: PhilosopherProfile[] = [];
    const world: PhilosopherProfile[] = [];
    for (const p of sorted) {
      if (isHindi(p)) hindi.push(p);
      else if (isTeluguOrSouthIndian(p)) teluguIndian.push(p);
      else world.push(p);
    }
    return { hindi, teluguIndian, world };
  }, [philosophers]);

  const selected = getPhilosopherById(selectedId);

  return (
    <label className={styles.wrap}>
      <span className={styles.label}>{t.dialogue.selectPhilosopher}</span>
      <div className={styles.row}>
        {selected ? (
          <PhilosopherAvatar id={selected.id} name={selected.name} size="sm" />
        ) : null}
      <select
        className={styles.select}
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        aria-label={t.dialogue.selectPhilosopher}
      >
        {hindi.length > 0 ? (
          <optgroup label={t.dialogue.philosopherGroupHindi}>
            {hindi.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.tradition}
              </option>
            ))}
          </optgroup>
        ) : null}
        {teluguIndian.length > 0 ? (
          <optgroup label={t.dialogue.philosopherGroupTelugu}>
            {teluguIndian.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.tradition}
              </option>
            ))}
          </optgroup>
        ) : null}
        {world.length > 0 ? (
          <optgroup label={t.dialogue.philosopherGroupWorld}>
            {world.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.tradition}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
      </div>
    </label>
  );
}
