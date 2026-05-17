import type { Contemplation } from "./content";
import { contemplationForDay } from "./content";

export type PhilosophyInquiryId =
  | "daily"
  | "buddhism"
  | "advaita"
  | "stoicism"
  | "taoism"
  | "zen"
  | "existentialism"
  | "socratic"
  | "upaniṣadic"
  | "sufi"
  | "confucian"
  | "bhakti"
  | "phenomenology"
  | "ethics";

export interface PhilosophyInquiryOption {
  id: PhilosophyInquiryId;
  tradition: string;
  themeIds: string[];
  prompts: { prompt: string; hint?: string; source?: string }[];
}

export const philosophyInquiryOptions: PhilosophyInquiryOption[] = [
  {
    id: "buddhism",
    tradition: "Buddhism",
    themeIds: ["suffering", "method", "self"],
    prompts: [
      {
        prompt: "What is present before you label it pleasant or painful?",
        hint: "Notice craving and aversion as they arise.",
        source: "Mindfulness",
      },
      {
        prompt: "If there is no fixed self, who suffers — and who is aware of suffering?",
        source: "Anatta",
      },
      {
        prompt: "What would change if you treated this moment as enough?",
        source: "Four Noble Truths",
      },
    ],
  },
  {
    id: "advaita",
    tradition: "Advaita Vedanta",
    themeIds: ["self", "reality", "method"],
    prompts: [
      {
        prompt: "Who am I — before name, role, and story?",
        hint: "Neti neti: not this, not this.",
        source: "Upanishads / Ramana Maharshi",
      },
      {
        prompt: "Is the witness of thought the same as thought itself?",
        source: "Self-inquiry",
      },
      {
        prompt: "What remains when you stop identifying with the body-mind?",
        source: "Advaita",
      },
    ],
  },
  {
    id: "stoicism",
    tradition: "Stoicism",
    themeIds: ["suffering", "ethics", "liberation"],
    prompts: [
      {
        prompt: "What is fully in your control right now — and what is not?",
        source: "Epictetus",
      },
      {
        prompt: "How would you act if this difficulty were training for virtue?",
        source: "Marcus Aurelius",
      },
      {
        prompt: "What judgment about events hurts more than the events themselves?",
        source: "Stoic psychology",
      },
    ],
  },
  {
    id: "taoism",
    tradition: "Taoism",
    themeIds: ["reality", "method", "liberation"],
    prompts: [
      {
        prompt: "Where are you forcing the river instead of finding the current?",
        hint: "Wu wei — effortless alignment.",
        source: "Tao Te Ching",
      },
      {
        prompt: "What becomes possible when you stop insisting on one right outcome?",
        source: "Zhuangzi",
      },
      {
        prompt: "Can softness and emptiness be stronger than grasping?",
        source: "Lao Tzu",
      },
    ],
  },
  {
    id: "zen",
    tradition: "Zen Buddhism",
    themeIds: ["method", "self", "reality"],
    prompts: [
      {
        prompt: "What is this moment before you explain it?",
        hint: "Do not solve — attend.",
      },
      {
        prompt: "Who is the one asking the question?",
        source: "Koan spirit",
      },
      {
        prompt: "What does your body know that your commentary forgets?",
        source: "Zen practice",
      },
    ],
  },
  {
    id: "existentialism",
    tradition: "Existentialism",
    themeIds: ["liberation", "ethics", "self"],
    prompts: [
      {
        prompt: "If nothing is given in advance, what will you choose to become?",
        source: "Sartre",
      },
      {
        prompt: "Where are you hiding behind roles instead of owning freedom?",
        hint: "Bad faith.",
      },
      {
        prompt: "What meaning will you affirm even without guarantee?",
        source: "Camus",
      },
    ],
  },
  {
    id: "socratic",
    tradition: "Greek philosophy",
    themeIds: ["method", "ethics", "self"],
    prompts: [
      {
        prompt: "What do you think you know — and what would it take to test it?",
        source: "Socrates",
      },
      {
        prompt: "Is the unexamined belief worth keeping?",
        source: "Apology",
      },
      {
        prompt: "What is virtue, and can it be taught?",
        source: "Plato",
      },
    ],
  },
  {
    id: "upaniṣadic",
    tradition: "Upanishadic",
    themeIds: ["reality", "self", "method"],
    prompts: [
      {
        prompt: "What is the Self that cannot be seen or touched?",
        source: "Katha Upanishad",
      },
      {
        prompt: "From what do all beings draw their life — and do you feel that source?",
        source: "Isha Upanishad",
      },
      {
        prompt: "Tat tvam asi — what would change if that were literally true?",
        source: "Chandogya Upanishad",
      },
    ],
  },
  {
    id: "sufi",
    tradition: "Sufi mysticism",
    themeIds: ["liberation", "self"],
    prompts: [
      {
        prompt: "What are you seeking outside that the heart already touches?",
        source: "Rumi",
      },
      {
        prompt: "Can reason carry you to the Beloved — or only longing?",
        hint: "The guest house of every feeling.",
      },
      {
        prompt: "What must die in you for love to live?",
        source: "Sufi path",
      },
    ],
  },
  {
    id: "confucian",
    tradition: "Confucianism",
    themeIds: ["ethics", "method"],
    prompts: [
      {
        prompt: "How does your conduct shape the people closest to you?",
        source: "Ren — humaneness",
      },
      {
        prompt: "What ritual or habit could restore sincerity in your relationships?",
        source: "Li",
      },
      {
        prompt: "If you led only by example, what would people learn?",
        source: "Analects",
      },
    ],
  },
  {
    id: "bhakti",
    tradition: "Bhakti",
    themeIds: ["liberation", "self", "ethics"],
    prompts: [
      {
        prompt: "Can devotion transform pride without denying the world?",
        source: "Bhakti saints",
      },
      {
        prompt: "What would it mean to offer this day — not only this prayer?",
        source: "Karma yoga spirit",
      },
      {
        prompt: "Who do you love when no one is watching?",
        source: "Mirabai / Kabir",
      },
    ],
  },
  {
    id: "phenomenology",
    tradition: "Phenomenology",
    themeIds: ["self", "reality", "method"],
    prompts: [
      {
        prompt: "Before you name this experience, what is given directly?",
        source: "Husserl",
      },
      {
        prompt: "How does the body hold memory you have not yet put into words?",
        source: "Embodied inquiry",
      },
      {
        prompt: "What appears when you bracket your theories and look afresh?",
        source: "Epoché",
      },
    ],
  },
  {
    id: "ethics",
    tradition: "Ethics",
    themeIds: ["ethics", "method"],
    prompts: [
      {
        prompt: "Could everyone act as you are about to act?",
        source: "Kant",
      },
      {
        prompt: "Who bears the cost of the choice you are making?",
        source: "Applied ethics",
      },
      {
        prompt: "What is the kindest action that is also the most honest?",
        source: "Virtue ethics",
      },
    ],
  },
];

const optionById = new Map(
  philosophyInquiryOptions.map((o) => [o.id, o]),
);

export function philosophyInquiryIds(): PhilosophyInquiryId[] {
  return ["daily", ...philosophyInquiryOptions.map((o) => o.id)];
}

export function getPhilosophyInquiry(
  id: PhilosophyInquiryId,
  date = new Date(),
): Contemplation {
  if (id === "daily") return contemplationForDay(date);

  const option = optionById.get(id);
  if (!option) return contemplationForDay(date);

  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const pick = option.prompts[day % option.prompts.length]!;

  return {
    id: `inq-${id}-${day % option.prompts.length}`,
    tradition: option.tradition,
    category: "inquiry",
    prompt: pick.prompt,
    hint: pick.hint,
    source: pick.source,
  };
}

export function themeIdsForPhilosophyInquiry(id: PhilosophyInquiryId): string[] {
  if (id === "daily") return [];
  return optionById.get(id)?.themeIds ?? [];
}
