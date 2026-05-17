import { useState } from "react";
import { getPhilosopherPortraitSrc } from "../data/philosopherPortraits";
import {
  portraitHue,
  portraitInitials,
} from "../lib/philosopherPortrait";
import styles from "./PhilosopherAvatar.module.css";

export type PhilosopherAvatarSize = "sm" | "md" | "lg" | "xl";

const WIDTH: Record<PhilosopherAvatarSize, number> = {
  sm: 40,
  md: 48,
  lg: 72,
  xl: 96,
};

interface PhilosopherAvatarProps {
  id: string;
  name: string;
  size?: PhilosopherAvatarSize;
  className?: string;
  alt?: string;
}

export function PhilosopherAvatar({
  id,
  name,
  size = "md",
  className = "",
  alt,
}: PhilosopherAvatarProps) {
  const [failed, setFailed] = useState(false);
  const px = WIDTH[size];
  const src = getPhilosopherPortraitSrc(id);
  const initials = portraitInitials(name);
  const hue = portraitHue(id);

  const rootClass = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(" ");

  if (src && !failed) {
    return (
      <span className={rootClass}>
        <img
          className={styles.img}
          src={src}
          alt={alt ?? name}
          width={px}
          height={px}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={rootClass}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 32% 88%), hsl(${hue} 22% 78%))`,
      }}
      role="img"
      aria-label={alt ?? name}
    >
      <span className={styles.initials} style={{ color: `hsl(${hue} 30% 24%)` }}>
        {initials}
      </span>
    </span>
  );
}
