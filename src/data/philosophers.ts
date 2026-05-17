export interface PhilosopherProfile {
  id: string;
  name: string;
  tradition: string;
  era: string;
  /** One line for the picker card */
  hook: string;
  starters: string[];
}

import { hindiPhilosophers } from "./philosophersHindi";

const worldPhilosophers: PhilosopherProfile[] = [
  {
    id: "socrates",
    name: "Socrates",
    tradition: "Greek",
    era: "5th c. BCE",
    hook: "Question everything — especially what you think you know.",
    starters: [
      "What is virtue, and can it be taught?",
      "Why should I care about my soul more than my reputation?",
      "Is it better to suffer injustice than to commit it?",
    ],
  },
  {
    id: "plato",
    name: "Plato",
    tradition: "Greek",
    era: "4th c. BCE",
    hook: "Turn the soul toward the Good beyond appearances.",
    starters: [
      "What are the Forms, and why should I believe in them?",
      "Is the just life happier even if it looks unjust?",
      "How does love lead the soul upward?",
    ],
  },
  {
    id: "aristotle",
    name: "Aristotle",
    tradition: "Greek",
    era: "4th c. BCE",
    hook: "Happiness is activity in accord with virtue.",
    starters: [
      "What is happiness for a human being?",
      "How do we become virtuous?",
      "What is the role of friendship in a good life?",
    ],
  },
  {
    id: "buddha",
    name: "Buddha",
    tradition: "Buddhist",
    era: "5th c. BCE",
    hook: "See suffering clearly; walk the path that loosens clinging.",
    starters: [
      "Why is there suffering, and how can it cease?",
      "What does 'no-self' mean in practice?",
      "How should I live day to day on the path?",
    ],
  },
  {
    id: "laozi",
    name: "Laozi",
    tradition: "Taoist",
    era: "6th c. BCE",
    hook: "The Tao is named by not forcing, not grasping.",
    starters: [
      "What is the Tao, if it cannot be spoken?",
      "How do I practice wu wei in a busy life?",
      "Why do you value weakness and yielding?",
    ],
  },
  {
    id: "confucius",
    name: "Confucius",
    tradition: "Confucian",
    era: "6th–5th c. BCE",
    hook: "Cultivate ren — humaneness begins in daily conduct.",
    starters: [
      "What does ren (humaneness) ask of me?",
      "How do ritual and sincerity shape character?",
      "Can society be healed without first healing oneself?",
    ],
  },
  {
    id: "epictetus",
    name: "Epictetus",
    tradition: "Stoic",
    era: "1st–2nd c. CE",
    hook: "Freedom is knowing what is yours to command.",
    starters: [
      "What is actually in my control?",
      "How do I endure what I cannot change?",
      "What does freedom mean for the mind?",
    ],
  },
  {
    id: "marcus-aurelius",
    name: "Marcus Aurelius",
    tradition: "Stoic",
    era: "2nd c. CE",
    hook: "Return to your principles; remember the cosmos is change.",
    starters: [
      "How do I rule myself before ruling anything else?",
      "How should I think about death?",
      "What do I owe others when they wrong me?",
    ],
  },
  {
    id: "rumi",
    name: "Rumi",
    tradition: "Sufi",
    era: "13th c.",
    hook: "Let longing polish the heart toward the Beloved.",
    starters: [
      "What is the guest house of the heart?",
      "How does longing purify the soul?",
      "Can reason alone reach the Beloved?",
    ],
  },
  {
    id: "shankara",
    name: "Shankara",
    tradition: "Advaita",
    era: "8th c.",
    hook: "Discriminate the Real from the apparent — Thou art That.",
    starters: [
      "What is the difference between self and Self?",
      "How do I practice inquiry into 'Who am I?'",
      "Is the world real or illusion — and how should I live?",
    ],
  },
  {
    id: "ramana-maharshi",
    name: "Ramana Maharshi",
    tradition: "Advaita",
    era: "20th c.",
    hook: "Ask 'Who am I?' and trace the I-thought home.",
    starters: [
      "Who am I, really?",
      "What should I do when thoughts will not stop?",
      "Is devotion necessary, or only inquiry?",
    ],
  },
  {
    id: "descartes",
    name: "Descartes",
    tradition: "Modern",
    era: "17th c.",
    hook: "Doubt systematically — rebuild only what is certain.",
    starters: [
      "What can I know for certain?",
      "Are mind and body the same thing?",
      "Why begin with doubt?",
    ],
  },
  {
    id: "spinoza",
    name: "Spinoza",
    tradition: "Rationalist",
    era: "17th c.",
    hook: "Understand necessity — that is freedom.",
    starters: [
      "What does freedom mean if all is determined?",
      "How do emotions yield to understanding?",
      "Is God the same as Nature?",
    ],
  },
  {
    id: "kant",
    name: "Kant",
    tradition: "Enlightenment",
    era: "18th c.",
    hook: "Act so your maxim could be universal law.",
    starters: [
      "What can reason know, and what must it leave unanswered?",
      "How do I know if an action is moral?",
      "Why is treating people as means wrong?",
    ],
  },
  {
    id: "nietzsche",
    name: "Nietzsche",
    tradition: "Existential",
    era: "19th c.",
    hook: "Become who you are — question herd morality.",
    starters: [
      "What happens to morality if God is dead?",
      "What is the will to power — and what is it not?",
      "How do I become who I am?",
    ],
  },
  {
    id: "wittgenstein",
    name: "Wittgenstein",
    tradition: "Analytic",
    era: "20th c.",
    hook: "Where language runs out, philosophy must stop.",
    starters: [
      "How does language create philosophical confusion?",
      "What can and cannot be said clearly?",
      "Is there a private language?",
    ],
  },
  {
    id: "zhuangzi",
    name: "Zhuangzi",
    tradition: "Taoist",
    era: "4th c. BCE",
    hook: "Dreaming butterfly — loosen fixed names and plans.",
    starters: [
      "Am I a person dreaming I am a butterfly, or the reverse?",
      "Why celebrate what seems useless?",
      "How do I stop forcing life into categories?",
    ],
  },
  {
    id: "hypatia",
    name: "Hypatia",
    tradition: "Neoplatonist",
    era: "4th–5th c.",
    hook: "Reason, number, and the stars — teach courage in inquiry.",
    starters: [
      "How does mathematics reveal reality?",
      "What is the philosopher's duty in turbulent times?",
      "How do reason and contemplation work together?",
    ],
  },
  {
    id: "simone-de-beauvoir",
    name: "Simone de Beauvoir",
    tradition: "Existentialist",
    era: "20th c.",
    hook: "Freedom is ambiguous — you choose who you become.",
    starters: [
      "What does it mean that existence precedes essence?",
      "How is freedom tied to responsibility?",
      "What is bad faith in everyday life?",
    ],
  },
  {
    id: "vemana",
    name: "Vemana (వేమన)",
    tradition: "Telugu",
    era: "17th c.",
    hook: "Short verses — cut illusion with wit and moral clarity.",
    starters: [
      "What do your poems teach about pride and humility?",
      "How should one live among hypocrites?",
      "What is true knowledge in everyday life?",
    ],
  },
  {
    id: "ramanuja",
    name: "Ramanuja (రామానుజుడు)",
    tradition: "Telugu · Vishishtadvaita",
    era: "11th–12th c.",
    hook: "Devotion and qualified non-duality — soul belongs to God.",
    starters: [
      "How is the soul related to Brahman in your teaching?",
      "Why is bhakti the path for ordinary seekers?",
      "What is the role of surrender (prapatti)?",
    ],
  },
  {
    id: "madhvacharya",
    name: "Madhvacharya (మధ్వాచార్యుడు)",
    tradition: "Telugu · Dvaita",
    era: "13th c.",
    hook: "God and soul are eternally distinct — know the difference.",
    starters: [
      "Why do you insist on real difference between soul and God?",
      "How does devotion work if we are not one with Brahman?",
      "What is the meaning of eternal dependence on the Divine?",
    ],
  },
  {
    id: "basava",
    name: "Basava (బసవేశ్వరుడు)",
    tradition: "Telugu · Lingayat",
    era: "12th c.",
    hook: "Work is worship — dignity, equality, inner integrity.",
    starters: [
      "Why is honest labor a form of worship?",
      "How do you challenge caste with spiritual equality?",
      "What does it mean to wear the linga on the body?",
    ],
  },
  {
    id: "allama-prabhu",
    name: "Allama Prabhu (అల్లమ ప్రభు)",
    tradition: "Telugu · Lingayat mystic",
    era: "12th c.",
    hook: "Mystic vachanas — fire that burns the false self.",
    starters: [
      "What must burn away before truth appears?",
      "Why do you speak in riddles and paradox?",
      "How does one move from word to direct knowing?",
    ],
  },
  {
    id: "pothana",
    name: "Pothana (పోతన)",
    tradition: "Telugu devotional",
    era: "15th–16th c.",
    hook: "Bhagavatam in Telugu — devotion without selling wisdom.",
    starters: [
      "Why did you refuse payment for sacred translation?",
      "How should one read the Bhagavatam for transformation?",
      "What is the relation between poetry and liberation?",
    ],
  },
  {
    id: "annamacharya",
    name: "Annamacharya (అన్నమాచార్య)",
    tradition: "Telugu · Bhakti",
    era: "15th c.",
    hook: "Songs to Venkateswara — love, humility, everyday ethics.",
    starters: [
      "How does song open the heart to God?",
      "What do your padams teach about desire and detachment?",
      "Can household life be a path of devotion?",
    ],
  },
  {
    id: "krishnamurti",
    name: "J. Krishnamurti (కృష్ణమూర్తి)",
    tradition: "Telugu · Modern inquiry",
    era: "20th c.",
    hook: "No authority, no path — only seeing what is.",
    starters: [
      "Why do you reject gurus and systems?",
      "What does it mean to observe thought without the observer?",
      "How is psychological freedom possible?",
    ],
  },
  {
    id: "radhakrishnan",
    name: "S. Radhakrishnan (రాధాకృష్ణన్)",
    tradition: "Telugu · Indian philosophy",
    era: "20th c.",
    hook: "Bridge East and West — intuition and critical reason.",
    starters: [
      "How do Indian and Western philosophy speak to each other?",
      "What is intuitive reason in the Upanishads?",
      "Can ethics be universal across cultures?",
    ],
  },
  {
    id: "tripuraneni-ramaswamy",
    name: "Tripuraneni Ramaswamy (త్రిపురాణేని రామస్వామి)",
    tradition: "Telugu · Rationalist",
    era: "20th c.",
    hook: "Question superstition — reform society with clear reason.",
    starters: [
      "Why must tradition be tested by reason?",
      "How do we free people from blind custom?",
      "What is the philosopher's duty to society?",
    ],
  },
  {
    id: "kancha-ilaiah",
    name: "Kancha Ilaiah Shepherd (కంచ ఇలైయా)",
    tradition: "Telugu · Bahujan thought",
    era: "Contemporary",
    hook: "Shudra-Dalit-Bahujan knowledge against graded inequality.",
    starters: [
      "What is Bahujan philosophy for today's India?",
      "How does caste shape what counts as knowledge?",
      "What would spiritual and political equality look like?",
    ],
  },
  {
    id: "chaganti-koteswara-rao",
    name: "Chaganti Koteswara Rao (చగంటి కోటేశ్వర రావు)",
    tradition: "Telugu · Dharma & inquiry",
    era: "Contemporary",
    hook: "Puranas and dharma — make ancient wisdom speak to today.",
    starters: [
      "How should we read the epics for daily life?",
      "What is dharma when tradition and modern life conflict?",
      "How do devotion and reason work together?",
    ],
  },
  {
    id: "garikapati-narasimha-rao",
    name: "Garikapati Narasimha Rao (గరికపాటి)",
    tradition: "Telugu · Vedanta today",
    era: "Contemporary",
    hook: "Wit, stories, and Vedanta for ordinary life.",
    starters: [
      "How do you make Vedanta understandable to everyone?",
      "What do the Ramayana and Mahabharata teach about the mind?",
      "Can humor be a path to wisdom?",
    ],
  },
  {
    id: "samavedam-shanmukha-sharma",
    name: "Samavedam Shanmukha Sharma (శన్ముఖ శర్మ)",
    tradition: "Telugu · Upanishadic teaching",
    era: "Contemporary",
    hook: "Upanishads in Telugu — clarity, devotion, and inquiry.",
    starters: [
      "How should a beginner approach the Upanishads?",
      "What is the Self that the sages point to?",
      "How do mantra, meaning, and meditation connect?",
    ],
  },
  {
    id: "amartya-sen",
    name: "Amartya Sen (అమర్త్య సెన్)",
    tradition: "Indian · Contemporary ethics",
    era: "Contemporary",
    hook: "Justice, capability, and freedom in real lives.",
    starters: [
      "What is capability approach to justice?",
      "How do famine and poverty raise moral questions?",
      "Can democracy survive without public reasoning?",
    ],
  },
  {
    id: "gopal-guru",
    name: "Gopal Guru (గోపాల్ గురు)",
    tradition: "Indian · Dalit philosophy",
    era: "Contemporary",
    hook: "Dignity, democracy, and the critique of graded humiliation.",
    starters: [
      "What is the moral wound of caste humiliation?",
      "How should Indian democracy confront inequality?",
      "What is crude reason versus refined hypocrisy?",
    ],
  },
  {
    id: "shiv-visvanathan",
    name: "Shiv Visvanathan (శివ విశ్వనాథన్)",
    tradition: "Indian · Science & society",
    era: "Contemporary",
    hook: "Science as culture — ethics at the limits of knowledge.",
    starters: [
      "How is science also a way of seeing the world?",
      "What do disasters teach us about modernity?",
      "Can plural traditions coexist with technology?",
    ],
  },
  {
    id: "a-raghuramaraju",
    name: "A. Raghuramaraju (రఘురామరాజు)",
    tradition: "Telugu · Indian philosophy",
    era: "Contemporary",
    hook: "Indian thought in dialogue with the modern world.",
    starters: [
      "How should we read Indian philosophy today?",
      "Can Gandhi and Ambedkar speak to each other?",
      "What does comparison across traditions reveal?",
    ],
  },
  {
    id: "lavanam",
    name: "Lavanam (లవణం)",
    tradition: "Telugu · Humanist",
    era: "Contemporary",
    hook: "Atheist humanism — compassion without supernatural fear.",
    starters: [
      "Can morality exist without God?",
      "How do we build an ethical life on reason alone?",
      "What is the humanist response to suffering?",
    ],
  },
  {
    id: "sadhguru",
    name: "Sadhguru (సద్గురు)",
    tradition: "Telugu · Contemporary yogi-philosopher",
    era: "Contemporary",
    hook: "Inner engineering — body, mind, and clarity in action.",
    starters: [
      "What is the difference between belief and experience?",
      "How can one live joyfully in a stressful world?",
      "What role does the body play in awakening?",
    ],
  },
  {
    id: "ug-krishnamurti",
    name: "U.G. Krishnamurti (యు.జి. కృష్ణమూర్తి)",
    tradition: "Telugu · Radical modern",
    era: "20th–21st c.",
    hook: "No path, no method — the natural state is already here.",
    starters: [
      "Why do you reject enlightenment projects?",
      "What is wrong with seeking a transformed mind?",
      "How do you live without hope or despair?",
    ],
  },
];

export const philosophers: PhilosopherProfile[] = [
  ...worldPhilosophers,
  ...hindiPhilosophers,
];

export function getPhilosopherById(id: string): PhilosopherProfile | undefined {
  return philosophers.find((p) => p.id === id);
}
