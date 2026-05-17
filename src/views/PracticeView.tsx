import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n";
import type { DialogueRequest } from "../types";
import styles from "./PracticeView.module.css";

const PRESETS = [5, 10, 20, 30, 45] as const;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface PracticeViewProps {
  onOpenDialogue: (request: Omit<DialogueRequest, "id">) => void;
}

export function PracticeView({ onOpenDialogue }: PracticeViewProps) {
  const { t } = useLanguage();
  const [minutes, setMinutes] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "running" | "complete">("idle");
  const [journal, setJournal] = useState("");
  const [ambient, setAmbient] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ambientRef = useRef<{
    ctx: AudioContext;
    osc: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  useEffect(() => {
    if (!ambient || !running) {
      if (ambientRef.current) {
        try {
          ambientRef.current.gain.gain.setValueAtTime(
            0,
            ambientRef.current.ctx.currentTime,
          );
          ambientRef.current.osc.stop();
          ambientRef.current.ctx.close();
        } catch {
          /* ignore */
        }
        ambientRef.current = null;
      }
      return;
    }

    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 136.1;
      gain.gain.value = 0.04;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ambientRef.current = { ctx, osc, gain };
    } catch {
      /* audio unavailable */
    }

    return () => {
      if (ambientRef.current) {
        try {
          ambientRef.current.osc.stop();
          ambientRef.current.ctx.close();
        } catch {
          /* ignore */
        }
        ambientRef.current = null;
      }
    };
  }, [ambient, running]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          setPhase("complete");
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 432;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
            osc.start();
            osc.stop(ctx.currentTime + 2);
          } catch {
            /* audio unavailable */
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [running, clearTimer]);

  const selectPreset = (m: number) => {
    clearTimer();
    setMinutes(m);
    setSecondsLeft(m * 60);
    setRunning(false);
    setPhase("idle");
  };

  const start = () => {
    if (secondsLeft === 0) setSecondsLeft(minutes * 60);
    setPhase("running");
    setRunning(true);
  };

  const pause = () => {
    clearTimer();
    setRunning(false);
  };

  const reset = () => {
    clearTimer();
    setSecondsLeft(minutes * 60);
    setRunning(false);
    setPhase("idle");
    setJournal("");
  };

  const progress = minutes > 0 ? 1 - secondsLeft / (minutes * 60) : 0;

  const phaseLabel =
    phase === "complete"
      ? t.sit.phases.done
      : running
        ? t.sit.phases.running
        : t.sit.phases.ready;

  return (
    <div className={styles.practice}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.sit.title}</h1>
        <p className={styles.subtitle}>{t.sit.subtitle}</p>
      </header>

      <label className={styles.ambientToggle}>
        <input
          type="checkbox"
          checked={ambient}
          onChange={(e) => setAmbient(e.target.checked)}
        />
        <span>{t.sit.ambientSound}</span>
      </label>

      <div className={styles.timerWrap}>
        <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true">
          <circle className={styles.ringBg} cx="60" cy="60" r="54" />
          <circle
            className={styles.ringProgress}
            cx="60"
            cy="60"
            r="54"
            style={{
              strokeDashoffset: 339.292 * (1 - progress),
            }}
          />
        </svg>
        <div className={styles.timerDisplay}>
          <span className={styles.time}>{formatTime(secondsLeft)}</span>
          <span className={styles.phase}>{phaseLabel}</span>
        </div>
      </div>

      <div className={styles.presets} role="group" aria-label={t.sit.duration}>
        {PRESETS.map((m) => (
          <button
            key={m}
            type="button"
            className={`${styles.preset} ${minutes === m ? styles.presetActive : ""}`}
            onClick={() => selectPreset(m)}
          >
            {m} {t.sit.minLabel}
          </button>
        ))}
      </div>

      <section className={styles.micro} aria-label={t.sit.microPracticeLabel}>
        <h2 className={styles.microTitle}>{t.sit.microPracticeLabel}</h2>
        <ul>
          {t.sit.microPractices.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={styles.microBtn}
                onClick={() => {
                  setMinutes(1);
                  setSecondsLeft(60);
                  setRunning(false);
                  setPhase("idle");
                }}
              >
                {item} (1 min)
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.controls}>
        {!running ? (
          <button type="button" className={styles.primaryBtn} onClick={start}>
            {phase === "complete" ? t.sit.sitAgain : t.sit.start}
          </button>
        ) : (
          <button type="button" className={styles.primaryBtn} onClick={pause}>
            {t.sit.pause}
          </button>
        )}
        <button type="button" className={styles.secondaryBtn} onClick={reset}>
          {t.sit.reset}
        </button>
      </div>

      {phase === "complete" ? (
        <section className={styles.journal}>
          <h2 className={styles.guideTitle}>{t.sit.journalTitle}</h2>
          <textarea
            className={styles.journalInput}
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder={t.sit.journalPlaceholder}
            rows={4}
          />
          <button
            type="button"
            className={styles.reflectBtn}
            onClick={() =>
              onOpenDialogue({
                prompt: journal.trim()
                  ? `After sitting, I noticed: ${journal.trim()}. Help me reflect without fixing me.`
                  : "I just finished sitting. Help me reflect on what might be worth noticing.",
                label: t.sit.journalTitle,
                source: "inquire",
                autoSend: true,
              })
            }
          >
            {t.sit.reflectInDialogue}
          </button>
        </section>
      ) : null}

      <section className={styles.guide}>
        <h2 className={styles.guideTitle}>{t.sit.guideTitle}</h2>
        <ul>
          {t.sit.guideItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
