import type { ChatMessage } from "../hooks/useDialogueChat";

const THREAD_PREFIX = "mukti-thread-";
const STREAK_KEY = "mukti-streak-v1";
const FEEDBACK_KEY = "mukti-feedback-v1";

export function threadKey(
  mode: "open" | "philosopher" | "compare",
  id?: string,
): string {
  if (mode === "open") return `${THREAD_PREFIX}open`;
  if (mode === "compare" && id) return `${THREAD_PREFIX}compare-${id}`;
  return `${THREAD_PREFIX}philosopher-${id ?? "unknown"}`;
}

export function loadThread(key: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThread(key: string, messages: ChatMessage[]): void {
  try {
    if (messages.length === 0) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(messages.slice(-80)));
  } catch {
    /* quota */
  }
}

export function exportThreadMarkdown(
  title: string,
  messages: ChatMessage[],
): string {
  const lines = [`# ${title}`, "", `Exported from Mukti`, ""];
  for (const m of messages) {
    lines.push(`## ${m.role === "user" ? "You" : "Guide"}`, "", m.content, "");
  }
  return lines.join("\n");
}

export interface StreakState {
  count: number;
  lastDate: string;
}

export function recordDailyVisit(): StreakState {
  const today = new Date().toISOString().slice(0, 10);
  let state: StreakState = { count: 1, lastDate: today };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) state = JSON.parse(raw) as StreakState;
    if (state.lastDate === today) return state;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().slice(0, 10);
    state.count = state.lastDate === y ? state.count + 1 : 1;
    state.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  return state;
}

export function getStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakState;
  } catch {
    /* ignore */
  }
  return { count: 0, lastDate: "" };
}

export function saveFeedback(
  philosopherId: string,
  messageId: string,
  vote: "up" | "down",
): void {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, "up" | "down">) : {};
    all[`${philosopherId}:${messageId}`] = vote;
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
