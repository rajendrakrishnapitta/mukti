import { useCallback, useEffect, useRef, useState } from "react";
import { loadThread, saveThread, threadKey } from "../lib/dialogueStorage";
import type { AppLanguage } from "../i18n";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string }[];
}

export interface WebSource {
  title: string;
  url: string;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export interface DialogueChatOptions {
  useWebSearch: boolean;
  language: AppLanguage;
  philosopherId?: string | null;
  comparePhilosopherIds?: [string, string] | null;
  storageKey?: string;
}

export function useDialogueChat(options: DialogueChatOptions) {
  const {
    useWebSearch,
    language,
    philosopherId,
    comparePhilosopherIds,
    storageKey,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  const persistKey =
    storageKey ??
    (comparePhilosopherIds
      ? threadKey("compare", comparePhilosopherIds.join("-"))
      : philosopherId
        ? threadKey("philosopher", philosopherId)
        : threadKey("open"));

  useEffect(() => {
    hydrated.current = false;
    const saved = loadThread(persistKey);
    setMessages(saved);
    setInput("");
    setError(null);
    hydrated.current = true;
  }, [persistKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    saveThread(persistKey, messages);
  }, [messages, persistKey]);

  const parseSources = (res: Response): WebSource[] => {
    const raw = res.headers.get("X-Mukti-Sources");
    if (!raw) return [];
    try {
      return JSON.parse(raw) as WebSource[];
    } catch {
      return [];
    }
  };

  const streamResponse = useCallback(
    async (assistantId: string, res: Response) => {
      const sources = parseSources(res);

      if (!res.body) throw new Error("No response stream from server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const snapshot = full;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: snapshot,
                  sources: sources.length ? sources : m.sources,
                }
              : m,
          ),
        );
      }
    },
    [],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = nextId();
      const history = [...messages, userMsg];

      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setIsLoading(true);

      try {
        const body: Record<string, unknown> = {
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          useWebSearch:
            !philosopherId && !comparePhilosopherIds ? useWebSearch : false,
          language,
        };
        if (philosopherId) body.philosopherId = philosopherId;
        if (comparePhilosopherIds) {
          body.comparePhilosopherIds = comparePhilosopherIds;
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          let detail = `Request failed (${res.status})`;
          try {
            const json = (await res.json()) as { error?: string };
            if (json.error) detail = json.error;
          } catch {
            detail = (await res.text()).slice(0, 200) || detail;
          }
          throw new Error(detail);
        }

        await streamResponse(assistantId, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      messages,
      useWebSearch,
      language,
      philosopherId,
      comparePhilosopherIds,
      streamResponse,
    ],
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
    saveThread(persistKey, []);
  }, [persistKey]);

  const sendGreeting = useCallback(async () => {
    if (!philosopherId || isLoading) return;

    setError(null);
    const assistantId = nextId();
    setMessages([{ id: assistantId, role: "assistant", content: "" }]);
    setIsLoading(true);

    const opening =
      "The seeker has come to speak with you personally. Greet them briefly in your own voice (two or three short paragraphs), then invite their question.";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: opening }],
          useWebSearch: false,
          language,
          philosopherId,
        }),
      });

      if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        try {
          const json = (await res.json()) as { error?: string };
          if (json.error) detail = json.error;
        } catch {
          detail = (await res.text()).slice(0, 200) || detail;
        }
        throw new Error(detail);
      }

      await streamResponse(assistantId, res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language, philosopherId, streamResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    error,
    send,
    sendGreeting,
    handleSubmit,
    clear,
    persistKey,
  };
}
