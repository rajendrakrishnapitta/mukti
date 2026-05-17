/** Build a resized Wikimedia Commons image URL (Special:FilePath redirect). */
export function commonsPortraitUrl(file: string, width = 256): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

/** Stable hue for initials fallback when no portrait image. */
export function portraitHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

export function portraitInitials(name: string): string {
  const parts = name
    .replace(/[()[\].,]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
