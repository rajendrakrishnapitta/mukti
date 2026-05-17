import type { ReadingItem } from "./philosopherReadingsTypes";

/** Books & references for all 54 philosophers — primary works + one reference link */
export const PHILOSOPHER_READINGS_DATA: Record<string, ReadingItem[]> = {
  socrates: [
    { title: "Plato, Apology", kind: "primary", url: "https://en.wikisource.org/wiki/Apology_(Plato)" },
    { title: "Plato, Republic", kind: "primary", url: "https://en.wikisource.org/wiki/Republic_(Plato)" },
    { title: "Xenophon, Memorabilia", kind: "primary" },
    { title: "Stanford Encyclopedia: Socrates", kind: "reference", url: "https://plato.stanford.edu/entries/socrates/" },
  ],
  plato: [
    { title: "Republic", kind: "primary", url: "https://en.wikisource.org/wiki/Republic_(Plato)" },
    { title: "Symposium", kind: "primary", url: "https://en.wikisource.org/wiki/Symposium_(Plato)" },
    { title: "Phaedo", kind: "primary" },
    { title: "Stanford Encyclopedia: Plato", kind: "reference", url: "https://plato.stanford.edu/entries/plato/" },
  ],
  aristotle: [
    { title: "Nicomachean Ethics", kind: "primary", url: "https://en.wikisource.org/wiki/Nicomachean_Ethics" },
    { title: "Politics", kind: "primary" },
    { title: "Metaphysics (selections)", kind: "primary" },
    { title: "Stanford Encyclopedia: Aristotle", kind: "reference", url: "https://plato.stanford.edu/entries/aristotle/" },
  ],
  buddha: [
    { title: "Dhammapada", kind: "primary", url: "https://en.wikisource.org/wiki/Dhammapada_(Muller)" },
    { title: "Satipaṭṭhāna Sutta (MN 10)", kind: "primary", url: "https://suttacentral.net/mn10/en/analayo" },
    { title: "Heart Sutra (Mahayana tradition)", kind: "primary" },
    { title: "Stanford Encyclopedia: Buddha", kind: "reference", url: "https://plato.stanford.edu/entries/buddha/" },
  ],
  laozi: [
    { title: "Tao Te Ching (Daodejing)", kind: "primary", url: "https://en.wikisource.org/wiki/Tao_Te_Ching_(Legge)" },
    { title: "Zhuangzi (companion Daoist text)", kind: "secondary" },
    { title: "Stanford Encyclopedia: Laozi", kind: "reference", url: "https://plato.stanford.edu/entries/laozi/" },
  ],
  confucius: [
    { title: "Analects (Lunyu)", kind: "primary", url: "https://en.wikisource.org/wiki/The_Analytics" },
    { title: "Mencius (development of Confucian ethics)", kind: "secondary" },
    { title: "Stanford Encyclopedia: Confucius", kind: "reference", url: "https://plato.stanford.edu/entries/confucius/" },
  ],
  epictetus: [
    { title: "Enchiridion (Handbook)", kind: "primary", url: "https://en.wikisource.org/wiki/Enchiridion_(Epictetus)" },
    { title: "Discourses (Arrian)", kind: "primary" },
    { title: "Stanford Encyclopedia: Epictetus", kind: "reference", url: "https://plato.stanford.edu/entries/epictetus/" },
  ],
  "marcus-aurelius": [
    { title: "Meditations", kind: "primary", url: "https://en.wikisource.org/wiki/The_Thoughts_of_the_Emperor_Marcus_Aurelius" },
    { title: "Stanford Encyclopedia: Marcus Aurelius", kind: "reference", url: "https://plato.stanford.edu/entries/marcus-aurelius/" },
  ],
  rumi: [
    { title: "Masnavi-ye Ma'navi", kind: "primary" },
    { title: "Divan-e Shams-e Tabrizi", kind: "primary" },
    { title: "Coleman Barks translations (popular English)", kind: "secondary" },
    { title: "Stanford Encyclopedia: Rumi", kind: "reference", url: "https://plato.stanford.edu/entries/rumi/" },
  ],
  shankara: [
    { title: "Vivekachudamani (Crest-Jewel of Discrimination)", kind: "primary" },
    { title: "Commentaries on principal Upanishads", kind: "primary" },
    { title: "Brahma Sutra Bhashya", kind: "primary" },
    { title: "Stanford Encyclopedia: Shankara", kind: "reference", url: "https://plato.stanford.edu/entries/shankara/" },
  ],
  "ramana-maharshi": [
    { title: "Who Am I? (Nan Yar)", kind: "primary", url: "https://www.sriramanamaharshi.org/wp-content/uploads/2021/10/who_am_I.pdf" },
    { title: "Talks with Sri Ramana Maharshi (three volumes)", kind: "primary" },
    { title: "Be As You Are (David Godman, ed.)", kind: "secondary" },
    { title: "Sri Ramana Ashram publications", kind: "reference", url: "https://www.sriramanamaharshi.org/books/" },
  ],
  descartes: [
    { title: "Meditations on First Philosophy", kind: "primary", url: "https://en.wikisource.org/wiki/Meditations_on_First_Philosophy" },
    { title: "Discourse on Method", kind: "primary" },
    { title: "Stanford Encyclopedia: Descartes", kind: "reference", url: "https://plato.stanford.edu/entries/descartes/" },
  ],
  spinoza: [
    { title: "Ethics", kind: "primary", url: "https://en.wikisource.org/wiki/Ethics_(Spinoza)" },
    { title: "Theological-Political Treatise", kind: "primary" },
    { title: "Stanford Encyclopedia: Spinoza", kind: "reference", url: "https://plato.stanford.edu/entries/spinoza/" },
  ],
  kant: [
    { title: "Critique of Pure Reason", kind: "primary" },
    { title: "Critique of Practical Reason", kind: "primary" },
    { title: "Groundwork of the Metaphysics of Morals", kind: "primary", url: "https://en.wikisource.org/wiki/Fundamental_Principles_of_the_Metaphysic_of_Morals" },
    { title: "Stanford Encyclopedia: Kant", kind: "reference", url: "https://plato.stanford.edu/entries/kant/" },
  ],
  nietzsche: [
    { title: "Thus Spoke Zarathustra", kind: "primary", url: "https://en.wikisource.org/wiki/Thus_spake_Zarathustra_(Thomas_Common)" },
    { title: "Beyond Good and Evil", kind: "primary" },
    { title: "On the Genealogy of Morality", kind: "primary" },
    { title: "Stanford Encyclopedia: Nietzsche", kind: "reference", url: "https://plato.stanford.edu/entries/nietzsche/" },
  ],
  wittgenstein: [
    { title: "Philosophical Investigations", kind: "primary" },
    { title: "Tractatus Logico-Philosophicus", kind: "primary", url: "https://en.wikisource.org/wiki/Tractatus_Logico-Philosophicus" },
    { title: "Stanford Encyclopedia: Wittgenstein", kind: "reference", url: "https://plato.stanford.edu/entries/wittgenstein/" },
  ],
  zhuangzi: [
    { title: "Zhuangzi (Inner Chapters)", kind: "primary", url: "https://en.wikisource.org/wiki/Zhuang_Zi_(Watson)" },
    { title: "Burton Watson translation", kind: "secondary" },
    { title: "Stanford Encyclopedia: Zhuangzi", kind: "reference", url: "https://plato.stanford.edu/entries/zhuangzi/" },
  ],
  hypatia: [
    { title: "Commentary on Diophantus (lost; fragments via later sources)", kind: "primary" },
    { title: "Maria Dzielska, Hypatia of Alexandria", kind: "secondary" },
    { title: "Stanford Encyclopedia: Hypatia", kind: "reference", url: "https://plato.stanford.edu/entries/hypatia/" },
  ],
  "simone-de-beauvoir": [
    { title: "The Second Sex", kind: "primary" },
    { title: "The Ethics of Ambiguity", kind: "primary" },
    { title: "Stanford Encyclopedia: Beauvoir", kind: "reference", url: "https://plato.stanford.edu/entries/beauvoir/" },
  ],
  vemana: [
    { title: "Vemana Satakam (couplets)", kind: "primary" },
    { title: "C.P. Brown / Telugu scholarly editions", kind: "secondary" },
    { title: "Wikipedia: Vemana", kind: "reference", url: "https://en.wikipedia.org/wiki/Vemana" },
  ],
  ramanuja: [
    { title: "Sri Bhashya (Brahma Sutra commentary)", kind: "primary" },
    { title: "Gita Bhashya", kind: "primary" },
    { title: "Stanford Encyclopedia: Ramanuja", kind: "reference", url: "https://plato.stanford.edu/entries/ramanuja/" },
  ],
  madhvacharya: [
    { title: "Sarvamula Granthas (collected works)", kind: "primary" },
    { title: "Commentary on Brahma Sutras", kind: "primary" },
    { title: "Wikipedia: Madhvacharya", kind: "reference", url: "https://en.wikipedia.org/wiki/Madhvacharya" },
  ],
  basava: [
    { title: "Vachanas of Basava (vacana literature)", kind: "primary" },
    { title: "A.K. Ramanujan, Speaking of Śiva (translations)", kind: "secondary" },
    { title: "Wikipedia: Basava", kind: "reference", url: "https://en.wikipedia.org/wiki/Basava" },
  ],
  "allama-prabhu": [
    { title: "Vachanas of Allama Prabhu", kind: "primary" },
    { title: "Speaking of Śiva (Ramanujan)", kind: "secondary" },
    { title: "Wikipedia: Allama Prabhu", kind: "reference", url: "https://en.wikipedia.org/wiki/Allama_Prabhu" },
  ],
  pothana: [
    { title: "Andhra Maha Bhagavatam (Pothana Bhagavatam)", kind: "primary" },
    { title: "Bhogini Dandakam", kind: "primary" },
    { title: "Wikipedia: Pothana", kind: "reference", url: "https://en.wikipedia.org/wiki/Pothana" },
  ],
  annamacharya: [
    { title: "Sankirtanas of Annamacharya (Telugu padams)", kind: "primary" },
    { title: "Tirumala Tirupati Devasthanams corpus", kind: "reference", url: "https://en.wikipedia.org/wiki/Annamacharya" },
  ],
  krishnamurti: [
    { title: "Freedom from the Known", kind: "primary" },
    { title: "The First and Last Freedom", kind: "primary" },
    { title: "Think On These Things", kind: "secondary" },
    { title: "J. Krishnamurti Foundation Trust", kind: "reference", url: "https://jkrishnamurti.org/" },
  ],
  radhakrishnan: [
    { title: "Indian Philosophy (2 volumes)", kind: "primary" },
    { title: "The Principal Upanishads (translation & intro)", kind: "primary" },
    { title: "The Hindu View of Life", kind: "secondary" },
    { title: "Wikipedia: Sarvepalli Radhakrishnan", kind: "reference", url: "https://en.wikipedia.org/wiki/Sarvepalli_Radhakrishnan" },
  ],
  "tripuraneni-ramaswamy": [
    { title: "Sutapuranamu and social reform plays", kind: "primary" },
    { title: "Writings on caste and rationalism (Telugu)", kind: "primary" },
    { title: "Wikipedia: Tripuraneni Ramaswamy", kind: "reference", url: "https://en.wikipedia.org/wiki/Tripuraneni_Ramaswamy" },
  ],
  "kancha-ilaiah": [
    { title: "Why I Am Not a Hindu", kind: "primary" },
    { title: "Post-Hindu India", kind: "primary" },
    { title: "Buffalo Nationalism", kind: "secondary" },
    { title: "Wikipedia: Kancha Ilaiah", kind: "reference", url: "https://en.wikipedia.org/wiki/Kancha_Ilaiah" },
  ],
  "chaganti-koteswara-rao": [
    { title: "Pravachanams on Bhagavatam & epics (audio/video corpus)", kind: "primary" },
    { title: "Discourses on Dharma and Itihasa", kind: "secondary" },
    { title: "YouTube / official channels (search name)", kind: "reference" },
  ],
  "garikapati-narasimha-rao": [
    { title: "Prapancham & Mahabharata pravachanams", kind: "primary" },
    { title: "Telugu discourses on life & scripture", kind: "secondary" },
    { title: "Wikipedia: Garikapati Narasimha Rao", kind: "reference", url: "https://en.wikipedia.org/wiki/Garikapati_Narasimha_Rao" },
  ],
  "samavedam-shanmukha-sharma": [
    { title: "Upanishad pravachanams (Telugu)", kind: "primary" },
    { title: "Bhagavad Gita exposition series", kind: "secondary" },
    { title: "YouTube: Shanmukha Sharma official", kind: "reference" },
  ],
  "amartya-sen": [
    { title: "Development as Freedom", kind: "primary" },
    { title: "The Idea of Justice", kind: "primary" },
    { title: "Collective Choice and Social Welfare", kind: "secondary" },
    { title: "Nobel Prize biography", kind: "reference", url: "https://www.nobelprize.org/prizes/economic-sciences/1998/sen/facts/" },
  ],
  "gopal-guru": [
    { title: "Humiliation: Claims and Context (ed.)", kind: "primary" },
    { title: "Essays on Dalit politics and democracy", kind: "secondary" },
    { title: "JNU / Columbia academic profile", kind: "reference", url: "https://en.wikipedia.org/wiki/Gopal_Guru" },
  ],
  "shiv-visvanathan": [
    { title: "A Carnival for Science", kind: "primary" },
    { title: "The Long Thirst: Water Ethics in India", kind: "primary" },
    { title: "Fooled by Randomness? (essays on modernity)", kind: "secondary" },
    { title: "Wikipedia: Shiv Visvanathan", kind: "reference", url: "https://en.wikipedia.org/wiki/Shiv_Visvanathan" },
  ],
  "a-raghuramaraju": [
    { title: "Debates in Indian Philosophy", kind: "primary" },
    { title: "Philosophy and India", kind: "primary" },
    { title: "University of Hyderabad faculty publications", kind: "reference" },
  ],
  lavanam: [
    { title: "Writings on Dalit Buddhism & social justice", kind: "primary" },
    { title: "Moola Bandha movement documents", kind: "secondary" },
    { title: "Wikipedia: Lavanam", kind: "reference", url: "https://en.wikipedia.org/wiki/Lavanam" },
  ],
  sadhguru: [
    { title: "Inner Engineering: A Yogi's Guide to Joy", kind: "primary" },
    { title: "Mystic's Musings", kind: "primary" },
    { title: "Isha Foundation books", kind: "reference", url: "https://isha.sadhguru.org/" },
  ],
  "ug-krishnamurti": [
    { title: "The Mind Is a Myth", kind: "primary" },
    { title: "No Way (M. Bennett, ed.)", kind: "primary" },
    { title: "The Mystique of Enlightenment", kind: "secondary" },
    { title: "Wikipedia: U. G. Krishnamurti", kind: "reference", url: "https://en.wikipedia.org/wiki/U._G._Krishnamurti" },
  ],
  kabir: [
    { title: "Kabir Granthavali / Bijak", kind: "primary" },
    { title: "Songs of Kabir (Rabindranath Tagore, tr.)", kind: "secondary", url: "https://en.wikisource.org/wiki/Songs_of_Kabir" },
    { title: "Wikipedia: Kabir", kind: "reference", url: "https://en.wikipedia.org/wiki/Kabir" },
  ],
  tulsidas: [
    { title: "Ramcharitmanas", kind: "primary" },
    { title: "Hanuman Chalisa", kind: "primary" },
    { title: "Wikipedia: Tulsidas", kind: "reference", url: "https://en.wikipedia.org/wiki/Tulsidas" },
  ],
  surdas: [
    { title: "Sursagar (Sur's Ocean of poetry)", kind: "primary" },
    { title: "Surdas padas on Krishna", kind: "primary" },
    { title: "Wikipedia: Surdas", kind: "reference", url: "https://en.wikipedia.org/wiki/Surdas" },
  ],
  mirabai: [
    { title: "Mirabai padas (bhajans)", kind: "primary" },
    { title: "Robert Bly & Jane Hirshfield, Mirabai: Ecstatic Poems", kind: "secondary" },
    { title: "Wikipedia: Mirabai", kind: "reference", url: "https://en.wikipedia.org/wiki/Meera" },
  ],
  vivekananda: [
    { title: "Raja Yoga", kind: "primary", url: "https://en.wikisource.org/wiki/Raja_Yoga_(Swami_Vivekananda)" },
    { title: "Jnana Yoga / Karma Yoga / Bhakti Yoga", kind: "primary" },
    { title: "Chicago addresses (1893 Parliament)", kind: "primary" },
    { title: "Complete Works (Advaita Ashrama)", kind: "reference", url: "https://en.wikisource.org/wiki/Author:Swami_Vivekananda" },
  ],
  "dayananda-saraswati": [
    { title: "Satyarth Prakash (Light of Truth)", kind: "primary" },
    { title: "Rigvedadi Bhashya Bhumika", kind: "primary" },
    { title: "Wikipedia: Dayananda Saraswati", kind: "reference", url: "https://en.wikipedia.org/wiki/Dayananda_Saraswati" },
  ],
  ramakrishna: [
    { title: "The Gospel of Sri Ramakrishna (M.)", kind: "primary" },
    { title: "Sri Ramakrishna Kathamrita", kind: "primary" },
    { title: "Ramakrishna Mission publications", kind: "reference", url: "https://belurmath.org/" },
  ],
  aurobindo: [
    { title: "The Life Divine", kind: "primary" },
    { title: "Savitri", kind: "primary" },
    { title: "The Synthesis of Yoga", kind: "primary" },
    { title: "Sri Aurobindo Ashram publications", kind: "reference", url: "https://www.sriaurobindoashram.org/" },
  ],
  gandhi: [
    { title: "The Story of My Experiments with Truth", kind: "primary", url: "https://en.wikisource.org/wiki/An_Autobiography_or_The_Story_of_My_Experiments_with_Truth" },
    { title: "Hind Swaraj", kind: "primary", url: "https://en.wikisource.org/wiki/Hind_Swaraj_or_Indian_Home_Rule" },
    { title: "Collected Works of Mahatma Gandhi", kind: "reference", url: "https://www.gandhiashramsevagram.org/gandhi-literature/mahatma-gandhi-collected-works/" },
  ],
  ambedkar: [
    { title: "Annihilation of Caste", kind: "primary", url: "https://www.columbia.edu/itc/mealac/pritchett/00ambedkar/txt_ambedkar_annihilation.html" },
    { title: "The Buddha and His Dhamma", kind: "primary" },
    { title: "Riddles in Hinduism", kind: "primary" },
    { title: "Stanford Encyclopedia: Ambedkar", kind: "reference", url: "https://plato.stanford.edu/entries/ambedkar/" },
  ],
  tagore: [
    { title: "Gitanjali", kind: "primary", url: "https://en.wikisource.org/wiki/Gitanjali" },
    { title: "The Home and the World (Ghare Baire)", kind: "primary" },
    { title: "Nationalism (lectures)", kind: "secondary" },
    { title: "Nobel Prize: Rabindranath Tagore", kind: "reference", url: "https://www.nobelprize.org/prizes/literature/1913/tagore/summary/" },
  ],
  "bhagat-singh": [
    { title: "Why I Am an Atheist", kind: "primary", url: "https://en.wikisource.org/wiki/Why_I_am_an_Atheist" },
    { title: "Letters from jail", kind: "primary" },
    { title: "Wikipedia: Bhagat Singh", kind: "reference", url: "https://en.wikipedia.org/wiki/Bhagat_Singh" },
  ],
  premchand: [
    { title: "Godaan (The Gift of a Cow)", kind: "primary" },
    { title: "Nirmala", kind: "primary" },
    { title: "Selected short stories (Mansarovar)", kind: "secondary" },
    { title: "Wikipedia: Premchand", kind: "reference", url: "https://en.wikipedia.org/wiki/Premchand" },
  ],
  osho: [
    { title: "The Book of Secrets (Vigyan Bhairav Tantra)", kind: "primary" },
    { title: "Zen: The Path of Paradox", kind: "secondary" },
    { title: "Osho International library", kind: "reference", url: "https://www.osho.com/library" },
  ],
};
