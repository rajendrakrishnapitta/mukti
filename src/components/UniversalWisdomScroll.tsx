import { useCallback, useEffect, useRef, useState } from "react";
import {
  UNIVERSAL_TRADITION,
  universalWisdomScroll,
  type DailyWisdom,
} from "../data/content";
import { useLanguage } from "../i18n";
import { TraditionBadge } from "./TraditionBadge";
import styles from "./UniversalWisdomScroll.module.css";

/** Time each quote stays visible before moving to the next */
const HOLD_MS = 7000;

export function UniversalWisdomScroll() {
  const { t } = useLanguage();
  const quotes = universalWisdomScroll;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollRef.current;
      if (!container) return;
      const child = container.children[index] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior, inline: "start", block: "nearest" });
      activeRef.current = index;
      setActiveIndex(index);
    },
    [],
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let timeoutId = 0;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        if (pausedRef.current) {
          scheduleNext();
          return;
        }
        const next = (activeRef.current + 1) % quotes.length;
        scrollToIndex(next, "smooth");
        scheduleNext();
      }, HOLD_MS);
    };

    scheduleNext();
    return () => window.clearTimeout(timeoutId);
  }, [quotes.length, scrollToIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const width = container.clientWidth;
      if (width <= 0) return;
      const index = Math.round(container.scrollLeft / width);
      const clamped = Math.max(0, Math.min(index, quotes.length - 1));
      if (clamped !== activeRef.current) {
        activeRef.current = clamped;
        setActiveIndex(clamped);
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [quotes.length]);

  const pause = () => {
    pausedRef.current = true;
  };

  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="universal-wisdom-heading"
      aria-roledescription="carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <h1 id="universal-wisdom-heading" className={styles.srOnly}>
        {t.home.srDaily}
      </h1>
      <TraditionBadge label={UNIVERSAL_TRADITION} />

      <div className={styles.viewport} aria-live="polite" aria-atomic="true">
        <div ref={scrollRef} className={styles.track}>
          {quotes.map((quote, i) => (
            <QuoteSlide
              key={`${quote.text}-${quote.source}`}
              quote={quote}
              isActive={i === activeIndex}
            />
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label={t.home.quotesNav}>
        {quotes.map((quote, i) => (
          <button
            key={`dot-${quote.source}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`${i + 1} / ${quotes.length}`}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

function QuoteSlide({
  quote,
  isActive,
}: {
  quote: DailyWisdom;
  isActive: boolean;
}) {
  return (
    <article
      className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}
      aria-hidden={!isActive}
    >
      <blockquote className={styles.quote}>{quote.text}</blockquote>
      <cite className={styles.cite}>
        — {quote.source}
        {quote.tradition !== UNIVERSAL_TRADITION ? (
          <span className={styles.traditionNote}> · {quote.tradition}</span>
        ) : null}
      </cite>
    </article>
  );
}
