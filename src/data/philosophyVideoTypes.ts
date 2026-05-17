import type { AppLanguage } from "../i18n/types";

export interface PhilosophyVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  /** e.g. https://www.youtube.com/@KFoundation */
  channelUrl?: string;
  /** Theme ids from content.ts, or "featured" for highlights */
  themeIds: string[];
  /** Primary audio language; omit for English-only catalog entries */
  languages?: AppLanguage[];
  /** Dialogue “Great philosophers” ids this talk matches */
  philosopherIds?: string[];
}
