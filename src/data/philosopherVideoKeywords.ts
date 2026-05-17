/** Extra search terms (incl. common spellings) for matching talks to a philosopher */
export const PHILOSOPHER_VIDEO_KEYWORDS: Record<string, string[]> = {
  socrates: ["socrates", "socratic", "plato's teacher"],
  plato: ["plato", "forms", "cave allegory", "republic"],
  aristotle: ["aristotle", "virtue", "golden mean", "eudaimonia"],
  buddha: ["buddha", "buddhist", "buddhism", "dukkha", "nirvana", "dharma"],
  laozi: ["lao tzu", "laozi", "lao tze", "tao te ching", "taoist"],
  confucius: ["confucius", "confucian", "ren", "filial"],
  epictetus: ["epictetus", "enchiridion", "stoic slave"],
  "marcus-aurelius": ["marcus aurelius", "meditations", "stoic emperor"],
  rumi: ["rumi", "masnavi", "sufi", "shams"],
  shankara: ["shankara", "shankaracharya", "advaita", "non-dual"],
  "ramana-maharshi": ["ramana", "maharshi", "self-inquiry", "who am i"],
  descartes: ["descartes", "cartesian", "cogito", "dualism"],
  spinoza: ["spinoza", "ethics", "pantheism", "substance"],
  kant: ["kant", "categorical imperative", "critique"],
  nietzsche: ["nietzsche", "übermensch", "superman", "will to power", "zarathustra"],
  wittgenstein: ["wittgenstein", "tractatus", "language games"],
  zhuangzi: ["zhuangzi", "chuang tzu", "butterfly dream", "daoist"],
  hypatia: ["hypatia", "alexandria", "neoplatonist"],
  "simone-de-beauvoir": ["beauvoir", "de beauvoir", "second sex", "existentialist feminism"],
  vemana: ["vemana", "vemana satakam", "telugu poet"],
  ramanuja: ["ramanuja", "vishishtadvaita", "qualified non-dual"],
  madhvacharya: ["madhvacharya", "madhva", "dvaita", "dualism vedanta"],
  basava: ["basava", "basavanna", "lingayat", "vachana", "sharana"],
  "allama-prabhu": ["allama prabhu", "allama", "vachana", "lingayat mystic"],
  pothana: ["pothana", "pothanam", "bhagavatam", "andhra maha bhagavata"],
  annamacharya: ["annamacharya", "annamayya", "venkateswara", "padam"],
  krishnamurti: [
    "krishnamurti",
    "krishnamurthi",
    "krishnamurthy",
    "jiddu",
    "j. krishnamurti",
    "k foundation",
    "kfoundation",
    "@kfoundation",
    "brockwood",
  ],
  radhakrishnan: ["radhakrishnan", "sarvepalli", "indian philosophy"],
  "tripuraneni-ramaswamy": ["tripuraneni", "ramaswamy", "kaviraju", "rationalist andhra"],
  "kancha-ilaiah": ["kancha", "ilaiah", "bahujan", "why i am not a hindu"],
  "chaganti-koteswara-rao": ["chaganti", "koteswara rao", "pravachanam"],
  "garikapati-narasimha-rao": ["garikapati", "garikipati", "pravachana", "ashtavadhanam"],
  "samavedam-shanmukha-sharma": ["shanmukha sharma", "samavedam", "upanishad telugu"],
  "amartya-sen": ["amartya sen", "capability approach", "nobel economics"],
  "gopal-guru": ["gopal guru", "dalit philosophy", "humiliation"],
  "shiv-visvanathan": ["shiv visvanathan", "cognitive justice", "science society"],
  "a-raghuramaraju": ["raghuramaraju", "indian philosophy modern"],
  lavanam: ["lavanam", "humanist", "atheist andhra", "gora"],
  sadhguru: ["sadhguru", "isha", "inner engineering", "jaggi"],
  "ug-krishnamurti": ["u.g. krishnamurti", "ug krishnamurti", "anti-guru"],
  kabir: ["kabir", "कबीर", "dohas", "weaver saint", "bhakti hindi"],
  tulsidas: ["tulsidas", "तुलसीदास", "ramcharitmanas", "ramayana awadhi"],
  surdas: ["surdas", "सूरदास", "sursagar", "braj", "krishna bhakti"],
  mirabai: ["mirabai", "मीराबाई", "meera bai", "meera", "krishna devotee"],
  vivekananda: ["vivekananda", "विवेकानंद", "chicago speech", "vedanta modern"],
  "dayananda-saraswati": ["dayananda", "दयानंद", "arya samaj", "satyarth prakash"],
  ramakrishna: ["ramakrishna", "रामकृष्ण", "dakshineswar", "kali"],
  aurobindo: ["aurobindo", "अरविन्द", "integral yoga", "savitri"],
  gandhi: ["gandhi", "गांधी", "ahimsa", "satyagraha", "mahatma"],
  ambedkar: ["ambedkar", "अम्बेडकर", "babasaheb", "constitution", "annihilation of caste"],
  tagore: ["tagore", "टैगोर", "rabindranath", "gitanjali", "nobel"],
  "bhagat-singh": ["bhagat singh", "भगत सिंह", "inqilab", "atheist revolutionary"],
  premchand: ["premchand", "प्रेमचंद", "munshi premchand", "hindi literature"],
  osho: ["osho", "ओशो", "rajneesh", "osho hindi"],
};

export function philosopherSearchTerms(
  philosopherId: string,
  name: string,
  tradition: string,
  hook: string,
): string[] {
  const extra = PHILOSOPHER_VIDEO_KEYWORDS[philosopherId] ?? [];
  const fromMeta = [name, tradition, hook]
    .join(" ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^\x00-\x7F]+/g, " ")
    .toLowerCase();
  const tokens = fromMeta
    .split(/\W+/)
    .filter((t) => t.length > 3 && !["telugu", "modern", "century"].includes(t));
  return [...new Set([...extra, ...tokens])];
}
