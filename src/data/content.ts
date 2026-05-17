export interface DailyWisdom {
  text: string;
  source: string;
  tradition: string;
}

export interface ThemeExploration {
  id: string;
  theme: string;
  overview: string;
  perspectives: { tradition: string; insight: string }[];
  /** Set when loaded from /api/themes */
  generated?: boolean;
}

export interface WisdomPath {
  id: string;
  name: string;
  insight: string;
  practice: string;
}

export type InquiryCategory =
  | "inquiry"
  | "paradox"
  | "ethics"
  | "existential";

export interface Contemplation {
  id: string;
  tradition: string;
  category: InquiryCategory;
  prompt: string;
  hint?: string;
  source?: string;
}

export const dailyWisdom: DailyWisdom[] = [
  {
    text: "The unexamined life is not worth living.",
    source: "Socrates (Plato, Apology)",
    tradition: "Greek philosophy",
  },
  {
    text: "You have power over your mind — not outside events.",
    source: "Marcus Aurelius",
    tradition: "Stoicism",
  },
  {
    text: "The Tao that can be told is not the eternal Tao.",
    source: "Tao Te Ching",
    tradition: "Taoism",
  },
  {
    text: "Existence precedes essence.",
    source: "Jean-Paul Sartre (paraphrase)",
    tradition: "Existentialism",
  },
  {
    text: "The curious mind is already halfway to wisdom.",
    source: "Philosophical reflection",
    tradition: "Universal",
  },
  {
    text: "That thou art.",
    source: "Chandogya Upanishad",
    tradition: "Advaita Vedānta",
  },
  {
    text: "Know thyself.",
    source: "Delphic maxim",
    tradition: "Greek philosophy",
  },
  {
    text: "The wound is the place where the Light enters you.",
    source: "Rumi (attributed)",
    tradition: "Sufi mysticism",
  },
  {
    text: "What you are looking for is where you are looking from.",
    source: "Contemplative saying",
    tradition: "Mysticism",
  },
  {
    text: "To know yourself is the beginning of all wisdom.",
    source: "Aristotle (attributed)",
    tradition: "Philosophy",
  },
  {
    text: "We see the world not as it is, but as we are.",
    source: "Talmudic proverb (attributed)",
    tradition: "Jewish wisdom",
  },
  {
    text: "Consciousness is always consciousness of something.",
    source: "Edmund Husserl (paraphrase)",
    tradition: "Phenomenology",
  },
  {
    text: "Wonder is the beginning of wisdom.",
    source: "Socrates (attributed)",
    tradition: "Universal",
  },
  {
    text: "The only true wisdom is knowing you know nothing.",
    source: "Socrates (attributed)",
    tradition: "Universal",
  },
  {
    text: "In the beginner's mind there are many possibilities.",
    source: "Shunryu Suzuki",
    tradition: "Universal",
  },
  {
    text: "Wherever you go, there you are.",
    source: "Jon Kabat-Zinn",
    tradition: "Universal",
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    source: "Lao Tzu (attributed)",
    tradition: "Universal",
  },
];

export const UNIVERSAL_TRADITION = "Universal";

/** Quotes for the home hero — cycles through all paths under one banner */
export const universalWisdomScroll: DailyWisdom[] = dailyWisdom;

export const themeExplorations: ThemeExploration[] = [
  {
    id: "self",
    theme: "The self",
    overview:
      "Who is the one asking? Traditions disagree on whether there is a fixed self, a stream, or pure awareness.",
    perspectives: [
      {
        tradition: "Buddhism",
        insight: "No permanent self — five aggregates, process, release from clinging.",
      },
      {
        tradition: "Advaita Vedānta",
        insight: "One changeless awareness; the separate 'I' is misperception.",
      },
      {
        tradition: "Existentialism",
        insight: "You constitute yourself through choice — no essence given in advance.",
      },
      {
        tradition: "Neuroscience",
        insight: "Self-models in the brain — useful fiction, not a single entity.",
      },
    ],
  },
  {
    id: "suffering",
    theme: "Suffering",
    overview:
      "Why is there dissatisfaction? Maps differ: desire, ignorance, attachment, meaninglessness, or structural harm.",
    perspectives: [
      {
        tradition: "Buddhism",
        insight: "Duḥkha and craving; the Second Noble Truth traces thirst.",
      },
      {
        tradition: "Stoicism",
        insight: "Suffering from judging externals; work the judgments.",
      },
      {
        tradition: "Schopenhauer",
        insight: "Will drives endless wanting — art and ethics as partial relief.",
      },
      {
        tradition: "Psychology",
        insight: "Pain vs suffering — narrative, trauma, and reframing matter.",
      },
    ],
  },
  {
    id: "reality",
    theme: "Reality & appearance",
    overview:
      "Is the world as it seems? Idealists, materialists, mystics, and physicists each tell a different story.",
    perspectives: [
      {
        tradition: "Platonism",
        insight: "Forms beyond changing appearances — the Good as ultimate.",
      },
      {
        tradition: "Taoism",
        insight: "The Way cannot be fixed in words; align with natural unfolding.",
      },
      {
        tradition: "Phenomenology",
        insight: "Return to experience before theory — what actually appears?",
      },
      {
        tradition: "Modern physics",
        insight: "Models of spacetime and fields — useful, revisable maps.",
      },
    ],
  },
  {
    id: "ethics",
    theme: "How to live",
    overview:
      "Virtue, duty, consequence, care, liberation — ethics is where philosophy meets the street.",
    perspectives: [
      {
        tradition: "Aristotle",
        insight: "Flourishing (eudaimonia) through cultivated virtue and community.",
      },
      {
        tradition: "Kant",
        insight: "Act from universalizable duty — persons as ends.",
      },
      {
        tradition: "Confucianism",
        insight: "Ritual, relationship, and humane character (ren) in society.",
      },
      {
        tradition: "Feminist ethics",
        insight: "Care, context, and power — who is heard in moral theory?",
      },
    ],
  },
  {
    id: "liberation",
    theme: "Liberation & awakening",
    overview:
      "Freedom from what? Ignorance, ego, sin, bad faith, or systemic oppression — maps overlap and diverge.",
    perspectives: [
      {
        tradition: "Zen",
        insight: "Sudden seeing — ordinary mind is the Way.",
      },
      {
        tradition: "Sufism",
        insight: "Fana — dissolution of ego in divine love.",
      },
      {
        tradition: "Stoicism",
        insight: "Inner freedom when externals are held lightly.",
      },
      {
        tradition: "Liberation theology",
        insight: "Freedom tied to justice for the oppressed — not only inward.",
      },
    ],
  },
  {
    id: "method",
    theme: "Methods of inquiry",
    overview:
      "How do we know ourselves? Logic, meditation, dialogue, experiment, and art each open a door.",
    perspectives: [
      {
        tradition: "Socratic method",
        insight: "Questions that expose contradiction — maieutics, midwifing insight.",
      },
      {
        tradition: "Meditation traditions",
        insight: "Train attention — witness thoughts without fusing with them.",
      },
      {
        tradition: "Phenomenology",
        insight: "Bracket assumptions; describe the structure of experience.",
      },
      {
        tradition: "Psychoanalysis & depth psychology",
        insight: "Unconscious patterns — dreams, slips, repetition compulsion.",
      },
    ],
  },
];

export const wisdomPaths: WisdomPath[] = [
  {
    id: "greek",
    name: "Greek philosophy",
    insight: "Reason, virtue, and the examined life — from Plato to the Stoics.",
    practice: "What belief about yourself have you never tested with a question?",
  },
  {
    id: "stoic",
    name: "Stoicism",
    insight: "Control judgments; accept what is not up to you.",
    practice: "List one thing in your control today and one you must release.",
  },
  {
    id: "tao",
    name: "Taoism",
    insight: "Wu wei — effortless fitting with the Way.",
    practice: "Where are you forcing what wants to unfold on its own?",
  },
  {
    id: "buddhist",
    name: "Buddhism",
    insight: "Four Noble Truths, interdependence, compassion.",
    practice: "Trace one craving: sensation → feeling → story → action.",
  },
  {
    id: "zen",
    name: "Zen Buddhism",
    insight: "Direct pointing beyond words — ordinary mind.",
    practice: "Sit ten minutes with no goal. What notices the sitting?",
  },
  {
    id: "advaita",
    name: "Advaita Vedānta",
    insight: "Non-dual Self — neti neti, self-inquiry.",
    practice: "Ask: Who is aware of this thought? Follow the knower.",
  },
  {
    id: "sufi",
    name: "Sufi mysticism",
    insight: "Polish the heart; love dissolves the separate self.",
    practice: "Repeat a phrase until meaning thins and presence remains.",
  },
  {
    id: "existential",
    name: "Existentialism",
    insight: "Freedom, anguish, authenticity — you author meaning.",
    practice: "What would you choose if no one were watching?",
  },
  {
    id: "phenomenology",
    name: "Phenomenology",
    insight: "Describe experience before explaining it.",
    practice: "Observe one sensation for one minute without naming it.",
  },
  {
    id: "psychology",
    name: "Psychology & science",
    insight: "Mind as process — patterns, healing, evidence.",
    practice: "What repeats in your life? Who notices the pattern?",
  },
  {
    id: "indigenous",
    name: "Indigenous & oral wisdom",
    insight: "Land, community, story — knowledge embedded in place and relation.",
    practice: "What place or community taught you who you are?",
  },
  {
    id: "modern",
    name: "Critical & contemporary thought",
    insight: "Power, identity, ecology — philosophy meets the present.",
    practice: "Whose voices are missing from the answers you already accept?",
  },
];

export const contemplations: Contemplation[] = [
  {
    id: "inq-1",
    tradition: "Socratic",
    category: "inquiry",
    prompt: "What can you know with certainty without memory or authority?",
    hint: "Notice what is aware of doubting.",
    source: "Cartesian & Socratic roots",
  },
  {
    id: "par-1",
    tradition: "Zen",
    category: "paradox",
    prompt: "What is the sound of one hand clapping?",
    hint: "Do not solve — soften the solver.",
  },
  {
    id: "eth-1",
    tradition: "Kantian",
    category: "ethics",
    prompt: "Could everyone act as you are about to act?",
    source: "Categorical imperative",
  },
  {
    id: "ex-1",
    tradition: "Existential",
    category: "existential",
    prompt: "If you were free of others' judgment, what would you choose to become?",
  },
  {
    id: "inq-2",
    tradition: "Advaita",
    category: "inquiry",
    prompt: "Who am I?",
    hint: "Follow the knower, not the known.",
    source: "Ramana Maharshi",
  },
  {
    id: "par-2",
    tradition: "Taoist",
    category: "paradox",
    prompt: "Is the Tao that moves the river the same stillness you touch in silence?",
  },
  {
    id: "eth-2",
    tradition: "Stoic",
    category: "ethics",
    prompt: "What is in your control today — and what must you release?",
    source: "Epictetus",
  },
  {
    id: "inq-3",
    tradition: "Phenomenology",
    category: "inquiry",
    prompt: "Before you name this experience, what is here?",
  },
  {
    id: "ex-2",
    tradition: "Camus (paraphrase)",
    category: "existential",
    prompt: "If life has no given meaning, what meaning will you affirm anyway?",
  },
  {
    id: "par-3",
    tradition: "Zen",
    category: "paradox",
    prompt: "Does a dog have Buddha-nature?",
    hint: "Mu — what wants a yes or no?",
  },
  {
    id: "eth-3",
    tradition: "Universal",
    category: "ethics",
    prompt: "Who bears the cost of the life you are living — including you?",
  },
  {
    id: "inq-4",
    tradition: "Psychology",
    category: "inquiry",
    prompt: "What story about yourself are you defending — and who defends it?",
  },
];

export const inquiryCategories: { id: InquiryCategory; label: string }[] = [
  { id: "inquiry", label: "Inquiry" },
  { id: "paradox", label: "Paradox" },
  { id: "ethics", label: "Ethics" },
  { id: "existential", label: "Existential" },
];

export function wisdomForDay(date = new Date()): DailyWisdom {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return dailyWisdom[day % dailyWisdom.length]!;
}

export function contemplationForDay(date = new Date()): Contemplation {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return contemplations[day % contemplations.length]!;
}

// Legacy export for any stale imports
export const bridgePairs = themeExplorations;
export const philosophyPaths = wisdomPaths;
