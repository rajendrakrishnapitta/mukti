import { useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "../hooks/useDialogueChat";
import { saveFeedback } from "../lib/dialogueStorage";
import { PhilosopherAvatar } from "./PhilosopherAvatar";
import styles from "./DialogueChatPanel.module.css";

interface DialogueChatPanelProps {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  onSend: (text: string) => void | Promise<void>;
  youLabel: string;
  guideLabel: string;
  emptyLead: string;
  starters: string[];
  placeholder: string;
  sendLabel: string;
  thinkingLabel: string;
  showStarters?: boolean;
  /** When set, assistant messages show this thinker's portrait */
  philosopherId?: string | null;
  philosopherName?: string;
  philosopherTradition?: string;
  philosopherEra?: string;
  onExport?: () => void;
  exportLabel?: string;
}

export function DialogueChatPanel({
  messages,
  input,
  setInput,
  isLoading,
  error,
  onSend,
  youLabel,
  guideLabel,
  emptyLead,
  starters,
  placeholder,
  sendLabel,
  thinkingLabel,
  showStarters = true,
  philosopherId,
  philosopherName,
  philosopherTradition,
  philosopherEra,
  onExport,
  exportLabel = "Export chat",
}: DialogueChatPanelProps) {
  const showPhilosopherPortrait = Boolean(philosopherId && philosopherName);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className={styles.panel}>
      {showPhilosopherPortrait ? (
        <div className={styles.chatHeader}>
          <PhilosopherAvatar
            id={philosopherId!}
            name={philosopherName!}
            size="lg"
          />
          <div className={styles.chatHeaderText}>
            <span className={styles.chatHeaderName}>{philosopherName}</span>
            {(philosopherTradition || philosopherEra) && (
              <span className={styles.chatHeaderMeta}>
                {[philosopherTradition, philosopherEra].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && showStarters && (
          <div className={styles.empty}>
            {showPhilosopherPortrait ? (
              <PhilosopherAvatar
                id={philosopherId!}
                name={philosopherName!}
                size="xl"
                className={styles.emptyPortrait}
              />
            ) : null}
            <p className={styles.emptyLead}>{emptyLead}</p>
            <div className={styles.starters}>
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={styles.starter}
                  onClick={() => void onSend(s)}
                  disabled={isLoading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <article
            key={m.id}
            className={`${styles.message} ${m.role === "user" ? styles.user : styles.assistant}`}
          >
            {m.role === "assistant" && showPhilosopherPortrait ? (
              <PhilosopherAvatar
                id={philosopherId!}
                name={philosopherName!}
                size="md"
                className={styles.messageAvatar}
              />
            ) : null}
            <div className={styles.messageBody}>
              <span className={styles.role}>
                {m.role === "user" ? youLabel : guideLabel}
              </span>
              <div className={styles.bubble}>
                {m.content || (m.role === "assistant" && isLoading ? "…" : "")}
              </div>
              {m.role === "assistant" && m.sources && m.sources.length > 0 ? (
                <ul className={styles.sources}>
                  {m.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              {m.role === "assistant" && philosopherId && m.content ? (
                <div className={styles.feedback}>
                  <button
                    type="button"
                    aria-label="Helpful"
                    onClick={() => saveFeedback(philosopherId, m.id, "up")}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Not helpful"
                    onClick={() => saveFeedback(philosopherId, m.id, "down")}
                  >
                    ↓
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        ))}

        {isLoading && messages.at(-1)?.role === "user" && (
          <p className={styles.thinking}>{thinkingLabel}</p>
        )}
      </div>

      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = input.trim();
          if (!trimmed || isLoading) return;
          void onSend(trimmed);
        }}
      >
        <textarea
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={isLoading}
          aria-label={placeholder}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={isLoading || !input.trim()}
        >
          {sendLabel}
        </button>
      </form>

      {messages.length > 0 && onExport ? (
        <div className={styles.toolbar}>
          <button type="button" className={styles.exportBtn} onClick={onExport}>
            {exportLabel}
          </button>
        </div>
      ) : null}

      {error ? <p className={styles.inlineError}>{error}</p> : null}
    </div>
  );
}
