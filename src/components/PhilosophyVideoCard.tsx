import { useState } from "react";
import type { PhilosophyVideo } from "../data/philosophyVideos";
import {
  thumbnailUrl,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "../data/philosophyVideos";
import { useLanguage } from "../i18n";
import styles from "./PhilosophyVideoCard.module.css";

interface PhilosophyVideoCardProps {
  video: PhilosophyVideo;
  className?: string;
  onPlayStateChange?: (playing: boolean) => void;
}

export function PhilosophyVideoCard({
  video,
  className,
  onPlayStateChange,
}: PhilosophyVideoCardProps) {
  const { t, language } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const embedSrc = youtubeEmbedUrl(
    video.youtubeId,
    typeof window !== "undefined" ? window.location.origin : undefined,
    language,
  );

  return (
    <article className={`${styles.card} ${className ?? ""}`.trim()}>
      <div className={styles.playerWrap}>
        {playing ? (
          <iframe
            className={styles.iframe}
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className={styles.thumbBtn}
            onClick={() => {
              setPlaying(true);
              onPlayStateChange?.(true);
            }}
            aria-label={`${t.watch.play}: ${video.title}`}
          >
            <img
              className={styles.thumb}
              src={thumbnailUrl(video.youtubeId)}
              alt=""
              loading="lazy"
            />
            <span className={styles.playIcon} aria-hidden>
              ▶
            </span>
          </button>
        )}
      </div>
      <div className={styles.meta}>
        <h4 className={styles.title}>{video.title}</h4>
        <p className={styles.channel}>
          {video.channelUrl ? (
            <a
              href={video.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelLink}
            >
              {video.channel}
            </a>
          ) : (
            video.channel
          )}
        </p>
        <a
          className={styles.youtubeLink}
          href={youtubeWatchUrl(video.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.watch.onYouTube}
        </a>
      </div>
    </article>
  );
}
