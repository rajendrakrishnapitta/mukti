import { PHILOSOPHER_READINGS_DATA } from "./philosopherReadingsData";
import type { ReadingItem } from "./philosopherReadingsTypes";

export type { ReadingItem, ReadingKind } from "./philosopherReadingsTypes";

export const PHILOSOPHER_READINGS = PHILOSOPHER_READINGS_DATA;

export function readingsForPhilosopher(id: string): ReadingItem[] {
  return PHILOSOPHER_READINGS[id] ?? [];
}

export function hasReadingsForPhilosopher(id: string): boolean {
  return (PHILOSOPHER_READINGS[id]?.length ?? 0) > 0;
}
