export interface FestivalNote {
  id: string;
  /** MM-DD in local calendar (approximate; lunar festivals use fixed guide dates) */
  monthDay: string;
  label: string;
  quote: string;
  source: string;
}

export const festivalNotes: FestivalNote[] = [
  {
    id: "diwali",
    monthDay: "11-01",
    label: "Diwali season",
    quote: "Lead me from darkness to light.",
    source: "Bṛhadāraṇyaka Upaniṣad (approx.)",
  },
  {
    id: "buddha-purnima",
    monthDay: "05-12",
    label: "Buddha Purnima",
    quote: "Hatred is never appeased by hatred; by love alone is hatred appeased.",
    source: "Dhammapada",
  },
  {
    id: "christmas",
    monthDay: "12-25",
    label: "Christmas",
    quote: "What you are is what you have been; what you will be is what you do now.",
    source: "Buddhist teaching (universal ethic)",
  },
  {
    id: "republic",
    monthDay: "01-26",
    label: "Republic Day (India)",
    quote: "Freedom is not worth having if it does not include the freedom to make mistakes.",
    source: "Mahatma Gandhi",
  },
];

export function festivalForToday(date = new Date()): FestivalNote | null {
  const md = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return festivalNotes.find((f) => f.monthDay === md) ?? null;
}
