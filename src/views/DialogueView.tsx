import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComparePhilosophersPanel } from "../components/ComparePhilosophersPanel";
import { DialogueChatPanel } from "../components/DialogueChatPanel";
import { PhilosopherPickerRow } from "../components/PhilosopherPickerRow";
import { PhilosopherReadings } from "../components/PhilosopherReadings";
import { PhilosopherSelect } from "../components/PhilosopherSelect";
import { PhilosophyVideoRow } from "../components/PhilosophyVideoRow";
import { exportThreadMarkdown } from "../lib/dialogueStorage";
import { useDialogueInterest } from "../context/DialogueInterestContext";
import { getPhilosopherChannel } from "../data/philosopherChannels";
import { getPhilosopherById, philosophers } from "../data/philosophers";
import { useDialogueChat } from "../hooks/useDialogueChat";
import { recommendVideosForPhilosopher } from "../lib/recommendVideos";
import { formatTemplate, useLanguage } from "../i18n";
import type { DialogueRequest } from "../types";
import styles from "./DialogueView.module.css";

type DialogueTab = "open" | "philosophers" | "compare";

interface DialogueViewProps {
  pendingRequest: DialogueRequest | null;
  onRequestHandled: () => void;
}

function SetupNotice({
  error,
  quotaError,
  groqQuota,
  googleQuota,
  setupTitle,
}: {
  error: string | null;
  quotaError: boolean;
  groqQuota: boolean;
  googleQuota: boolean;
  setupTitle: string;
}) {
  const { t } = useLanguage();
  const errText = (error ?? "").toLowerCase();
  const setupError =
    quotaError ||
    errText.includes("503") ||
    errText.includes("api_key") ||
    errText.includes("missing") ||
    errText.includes("failed to fetch");

  if (!error && !quotaError) return null;

  return (
    <div className={styles.setupNotice} role="alert">
      <strong>{setupTitle}</strong>
      {setupError && <ol className={styles.setupList}>
        {quotaError ? (
          <li>
            {groqQuota ? (
              <>
                <strong>Groq free daily limit is full.</strong> Mukti will try Google
                Gemini next if <code>GOOGLE_GENERATIVE_AI_API_KEY</code> is set on
                Vercel.
              </>
            ) : googleQuota ? (
              <>
                <strong>Google Gemini quota is full.</strong> Add or check keys in
                Vercel env vars, then redeploy.
              </>
            ) : (
              <>
                <strong>AI rate limit reached.</strong> Wait a few hours or add another
                provider key.
              </>
            )}
          </li>
        ) : (
          <>
            <li>
              Open{" "}
              <a href="/api/health" target="_blank" rel="noopener noreferrer">
                /api/health
              </a>{" "}
              — <code>ok</code> must be <code>true</code>.
            </li>
            <li>
              Add <code>GROQ_API_KEY</code> or <code>GOOGLE_GENERATIVE_AI_API_KEY</code>{" "}
              on Vercel, then redeploy.
            </li>
          </>
        )}
      </ol>}
      <p><a href="#journey">{t.nav.journeyCta}</a></p>
      {error && <p className={styles.setupDetail}>Detail: {error}</p>}
    </div>
  );
}

export function DialogueView({
  pendingRequest,
  onRequestHandled,
}: DialogueViewProps) {
  const { t, language } = useLanguage();
  const { recordDialogue, clearInterest, getRecommendedVideos } =
    useDialogueInterest();
  const [tab, setTab] = useState<DialogueTab>("open");
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [contextLabel, setContextLabel] = useState<string | null>(null);
  const [contextSource, setContextSource] = useState<"explore" | "inquire" | null>(
    null,
  );
  const [selectedPhilosopherId, setSelectedPhilosopherId] = useState(
    philosophers[0]?.id ?? "socrates",
  );
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);
  const compareTopicRef = useRef<string | null>(null);
  const handledRequestId = useRef<string | null>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const greetedPhilosopherRef = useRef<string | null>(null);

  const openChat = useDialogueChat({ useWebSearch, language });
  const philosopherChat = useDialogueChat({
    useWebSearch: false,
    language,
    philosopherId: selectedPhilosopherId,
  });
  const compareChat = useDialogueChat({
    useWebSearch: false,
    language,
    comparePhilosopherIds: compareIds,
  });

  const activePhilosopher = useMemo(
    () => getPhilosopherById(selectedPhilosopherId),
    [selectedPhilosopherId],
  );

  const activeChat =
    tab === "open"
      ? openChat
      : tab === "philosophers"
        ? philosopherChat
        : compareChat;
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    send,
    clear,
  } = activeChat;

  const scrollToChat = useCallback(() => {
    requestAnimationFrame(() => {
      chatPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, []);

  const handleSelectPhilosopher = useCallback(
    (id: string) => {
      const picked = getPhilosopherById(id);
      if (picked) {
        recordDialogue(`${picked.name} ${picked.tradition}`);
      }
      if (id !== selectedPhilosopherId) {
        greetedPhilosopherRef.current = null;
        setSelectedPhilosopherId(id);
      } else if (messages.length === 0 && !isLoading) {
        greetedPhilosopherRef.current = null;
        void philosopherChat.sendGreeting();
      }
      scrollToChat();
    },
    [
      selectedPhilosopherId,
      scrollToChat,
      messages.length,
      isLoading,
      philosopherChat,
      recordDialogue,
    ],
  );

  useEffect(() => {
    if (tab !== "philosophers") return;
    if (isLoading) return;
    if (messages.length > 0) {
      greetedPhilosopherRef.current = selectedPhilosopherId;
      return;
    }
    if (greetedPhilosopherRef.current === selectedPhilosopherId) return;
    greetedPhilosopherRef.current = selectedPhilosopherId;
    scrollToChat();
    void philosopherChat.sendGreeting();
  }, [
    tab,
    selectedPhilosopherId,
    isLoading,
    messages.length,
    philosopherChat.sendGreeting,
    scrollToChat,
  ]);

  const relatedVideos = useMemo(() => {
    const limit = 8;
    if (tab === "philosophers" && activePhilosopher) {
      return recommendVideosForPhilosopher(
        activePhilosopher.id,
        {
          name: activePhilosopher.name,
          tradition: activePhilosopher.tradition,
          hook: activePhilosopher.hook,
        },
        { limit, language },
      );
    }
    return getRecommendedVideos(limit);
  }, [
    tab,
    activePhilosopher,
    language,
    getRecommendedVideos,
    selectedPhilosopherId,
  ]);

  const philosopherChannel = useMemo(() => {
    if (tab !== "philosophers" || !activePhilosopher) return null;
    return getPhilosopherChannel(activePhilosopher.id, relatedVideos);
  }, [tab, activePhilosopher, relatedVideos]);

  const sendWithInterest = useCallback(
    (text: string) => {
      if (tab === "philosophers" && activePhilosopher) {
        recordDialogue(`${activePhilosopher.name} ${activePhilosopher.tradition}: ${text}`);
      } else if (tab === "compare") {
        recordDialogue(`Compare: ${text}`);
      } else {
        recordDialogue(text);
      }
      return send(text);
    },
    [recordDialogue, send, tab, activePhilosopher],
  );

  useEffect(() => {
    if (!compareIds || !compareTopicRef.current) return;
    const topic = compareTopicRef.current;
    compareTopicRef.current = null;
    recordDialogue(`Compare: ${topic}`);
    void compareChat.send(topic);
  }, [compareIds, compareChat, recordDialogue]);

  const handleCompare = useCallback(
    (idA: string, idB: string, topic: string) => {
      setCompareIds([idA, idB]);
      compareTopicRef.current = topic;
      setTab("compare");
      scrollToChat();
    },
    [scrollToChat],
  );

  const handleExport = useCallback(() => {
    const title =
      tab === "compare"
        ? `Compare: ${compareIds?.join(" vs ") ?? "thinkers"}`
        : tab === "philosophers"
          ? activePhilosopher?.name ?? "Philosopher"
          : "Open dialogue";
    const md = exportThreadMarkdown(title, messages);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mukti-${tab}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tab, compareIds, activePhilosopher?.name, messages]);

  useEffect(() => {
    if (!pendingRequest || pendingRequest.id === handledRequestId.current) return;
    handledRequestId.current = pendingRequest.id;
    const {
      prompt,
      autoSend = true,
      label,
      source,
      philosopherId: reqPhilosopherId,
    } = pendingRequest;
    if (reqPhilosopherId) {
      setTab("philosophers");
      setSelectedPhilosopherId(reqPhilosopherId);
      greetedPhilosopherRef.current = null;
    } else {
      setTab("open");
    }
    if (label) setContextLabel(label);
    if (source) setContextSource(source);
    onRequestHandled();
    const chat = reqPhilosopherId ? philosopherChat : openChat;
    if (autoSend !== false) {
      recordDialogue(prompt);
      void chat.send(prompt);
    } else {
      chat.setInput(prompt);
    }
  }, [pendingRequest, onRequestHandled, openChat, philosopherChat, recordDialogue]);

  const errText = (error ?? "").toLowerCase();
  const groqQuota =
    errText.includes("groq") &&
    (errText.includes("429") ||
      errText.includes("rate limit") ||
      errText.includes("tokens per day"));
  const googleQuota =
    errText.includes("google") ||
    errText.includes("gemini") ||
    (errText.includes("429") && errText.includes("quota") && !groqQuota);
  const quotaError =
    errText.includes("429") ||
    errText.includes("quota") ||
    errText.includes("rate limit") ||
    groqQuota;

  const handleClear = () => {
    clear();
    if (tab === "open") {
      clearInterest();
      setContextLabel(null);
      setContextSource(null);
    } else if (tab === "compare") {
      setCompareIds(null);
      compareTopicRef.current = null;
    } else {
      greetedPhilosopherRef.current = null;
      scrollToChat();
      void philosopherChat.sendGreeting();
    }
  };

  const philosopherGuideLabel = activePhilosopher
    ? formatTemplate(t.dialogue.speakingWith, { name: activePhilosopher.name })
    : t.dialogue.guide;

  return (
    <div className={styles.dialogue}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.dialogue.title}</h1>
        <p className={styles.subtitle}>
          {tab === "open"
            ? t.dialogue.subtitle
            : tab === "philosophers"
              ? t.dialogue.philosophersSubtitle
              : t.dialogue.compareSubtitle}
        </p>
      </header>

      <div className={styles.modeTabs} role="tablist" aria-label={t.dialogue.modeTabsLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "open"}
          className={`${styles.modeTab} ${tab === "open" ? styles.modeTabActive : ""}`}
          onClick={() => setTab("open")}
        >
          {t.dialogue.tabOpen}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "philosophers"}
          className={`${styles.modeTab} ${tab === "philosophers" ? styles.modeTabActive : ""}`}
          onClick={() => setTab("philosophers")}
        >
          {t.dialogue.tabPhilosophers}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "compare"}
          className={`${styles.modeTab} ${tab === "compare" ? styles.modeTabActive : ""}`}
          onClick={() => setTab("compare")}
        >
          {t.dialogue.tabCompare}
        </button>
      </div>

      {tab === "open" ? (
        <div className={styles.toolbar}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
            />
            <span>{t.dialogue.webSearch}</span>
          </label>
          {messages.length > 0 && (
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              {t.dialogue.clear}
            </button>
          )}
        </div>
      ) : null}

      {tab === "philosophers" ? (
        <div className={styles.philosopherSection}>
          <PhilosopherSelect
            philosophers={philosophers}
            selectedId={selectedPhilosopherId}
            onSelect={handleSelectPhilosopher}
          />
          <p className={styles.philosopherHint}>{t.dialogue.philosophersSwipe}</p>
          <PhilosopherPickerRow
            philosophers={philosophers}
            selectedId={selectedPhilosopherId}
            onSelect={handleSelectPhilosopher}
            label={t.dialogue.selectPhilosopher}
          />
          <PhilosopherReadings philosopherId={selectedPhilosopherId} />
          {messages.length > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              {t.dialogue.clear}
            </button>
          )}
        </div>
      ) : null}

      {tab === "compare" ? (
        <div className={styles.compareSection}>
          <ComparePhilosophersPanel
            philosophers={philosophers}
            onCompare={handleCompare}
          />
          {messages.length > 0 && (
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              {t.dialogue.clear}
            </button>
          )}
        </div>
      ) : null}

      {tab === "open" && contextLabel && (
        <p className={styles.exploreContext}>
          {contextSource === "inquire" ? t.dialogue.fromInquire : t.dialogue.fromExplore}:{" "}
          <strong>{contextLabel}</strong>
        </p>
      )}

      <SetupNotice
        error={error}
        quotaError={quotaError}
        groqQuota={groqQuota}
        googleQuota={googleQuota}
        setupTitle={t.dialogue.setupTitle}
      />

      <div ref={chatPanelRef} className={styles.chatAnchor}>
        <DialogueChatPanel
          messages={messages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          error={null}
          onSend={sendWithInterest}
          youLabel={t.dialogue.you}
          guideLabel={
            tab === "open"
              ? t.dialogue.guide
              : tab === "compare"
                ? t.dialogue.tabCompare
                : philosopherGuideLabel
          }
          philosopherId={tab === "philosophers" ? selectedPhilosopherId : null}
          onExport={messages.length > 0 ? handleExport : undefined}
          exportLabel={t.dialogue.exportChat}
          philosopherName={activePhilosopher?.name}
          philosopherTradition={activePhilosopher?.tradition}
          philosopherEra={activePhilosopher?.era}
          emptyLead={
            tab === "open"
              ? t.dialogue.emptyLead
              : tab === "compare"
                ? t.dialogue.compareSubtitle
                : formatTemplate(t.dialogue.philosopherEmptyLead, {
                    name: activePhilosopher?.name ?? "",
                  })
          }
          starters={
            tab === "open"
              ? t.dialogue.starters
              : tab === "compare"
                ? []
                : activePhilosopher?.starters ?? []
          }
          placeholder={
            tab === "open"
              ? t.dialogue.placeholder
              : tab === "compare"
                ? t.dialogue.placeholder
                : formatTemplate(t.dialogue.philosopherPlaceholder, {
                    name: activePhilosopher?.name ?? "",
                  })
          }
          sendLabel={t.dialogue.send}
          thinkingLabel={t.dialogue.thinking}
          showStarters={
            tab === "open" ||
            (tab === "philosophers" && messages.length === 0 && !isLoading)
          }
        />
      </div>

      {relatedVideos.length > 0 ? (
        <section
          className={styles.relatedVideos}
          aria-labelledby="dialogue-videos-heading"
        >
          <h2 id="dialogue-videos-heading" className={styles.relatedTitle}>
            {t.dialogue.relatedVideos}
          </h2>
          <p className={styles.relatedVideosHint}>{t.dialogue.relatedVideosScroll}</p>
          <PhilosophyVideoRow
            key={tab === "philosophers" ? selectedPhilosopherId : "open"}
            videos={relatedVideos}
            label={t.dialogue.relatedVideos}
            autoScroll
          />
          {philosopherChannel ? (
            <p className={styles.kFoundationLink}>
              <a
                href={philosopherChannel.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatTemplate(t.dialogue.philosopherMoreChannel, {
                  channel: philosopherChannel.name,
                })}
              </a>
            </p>
          ) : null}
        </section>
      ) : null}

      <p className={styles.disclaimer}>
        {tab === "open" ? t.dialogue.disclaimer : t.dialogue.philosopherDisclaimer}
      </p>
    </div>
  );
}
