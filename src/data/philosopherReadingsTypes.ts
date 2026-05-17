export type ReadingKind = "primary" | "secondary" | "reference";

/** Curated books & references — title, optional link, category */
export interface ReadingItem {
  title: string;
  url?: string;
  kind?: ReadingKind;
}
