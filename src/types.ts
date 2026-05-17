export type ViewId = "home" | "practice" | "dialogue";

/** Passed from Explore, Inquire, or elsewhere into Dialogue */
export interface DialogueRequest {
  id: string;
  prompt: string;
  /** Shown in Dialogue (e.g. prompt excerpt or theme name) */
  label?: string;
  source?: "explore" | "inquire";
  /** Explore theme id — used for video recommendations */
  themeId?: string;
  /** Perspective tradition or inquire tradition */
  tradition?: string;
  /** Inquire category */
  category?: string;
  /** Default true — send immediately with web search when enabled */
  autoSend?: boolean;
  /** Open Great philosophers tab with this thinker */
  philosopherId?: string;
}

export const views: { id: ViewId; label: string; subtitle: string }[] = [
  { id: "home", label: "Today", subtitle: "Daily wisdom" },
  { id: "dialogue", label: "Dialogue", subtitle: "Ask anything" },
  { id: "practice", label: "Sit", subtitle: "Meditation" },
];
