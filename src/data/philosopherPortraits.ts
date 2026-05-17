import { PHILOSOPHER_PORTRAIT_FILES } from "./philosopherPortraitFiles";

/** Same-origin portraits in /public/philosophers/ — reliable on Vercel (no Wikimedia hotlink blocks). */
export function getPhilosopherPortraitSrc(id: string): string | null {
  const file = PHILOSOPHER_PORTRAIT_FILES[id];
  if (!file) return null;
  return `/philosophers/${file}`;
}

export function hasPhilosopherPortrait(id: string): boolean {
  return id in PHILOSOPHER_PORTRAIT_FILES;
}
