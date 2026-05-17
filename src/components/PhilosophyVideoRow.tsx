import { useMemo, useState, type CSSProperties } from "react";
import type { PhilosophyVideo } from "../data/philosophyVideos";
import { PhilosophyVideoCard } from "./PhilosophyVideoCard";
import styles from "./PhilosophyVideoRow.module.css";

interface PhilosophyVideoRowProps {
  videos: PhilosophyVideo[];
  label?: string;
  /** Auto-scroll marquee (default on) */
  autoScroll?: boolean;
}

export function PhilosophyVideoRow({
  videos,
  label,
  autoScroll = true,
}: PhilosophyVideoRowProps) {
  const [hoverPaused, setHoverPaused] = useState(false);
  const [holdScroll, setHoldScroll] = useState(false);

  const loopVideos = useMemo(() => {
    if (!autoScroll || videos.length === 0) return videos;
    if (videos.length === 1) {
      const only = videos[0];
      return [only, only, only, only];
    }
    return [...videos, ...videos];
  }, [autoScroll, videos]);

  if (videos.length === 0) return null;

  const durationSec = Math.max(40, loopVideos.length * 12);
  const isPaused = hoverPaused || holdScroll;

  if (!autoScroll) {
    return (
      <section className={styles.row} aria-label={label}>
        <div className={styles.scrollStatic}>
          {videos.map((video) => (
            <PhilosophyVideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.row}
      aria-label={label}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => {
        setHoverPaused(false);
        setHoldScroll(false);
      }}
      onFocus={() => setHoverPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHoverPaused(false);
          setHoldScroll(false);
        }
      }}
    >
      <div className={styles.viewport}>
        <div
          className={`${styles.track} ${isPaused ? styles.trackPaused : ""}`}
          style={
            {
              "--video-marquee-duration": `${durationSec}s`,
            } as CSSProperties
          }
        >
          {loopVideos.map((video, i) => (
            <PhilosophyVideoCard
              key={`${video.id}-${i}`}
              video={video}
              className={styles.trackCard}
              onPlayStateChange={(playing) => {
                if (playing) setHoldScroll(true);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
