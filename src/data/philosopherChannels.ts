import { K_FOUNDATION_YOUTUBE } from "./kFoundation";

export interface PhilosopherChannel {
  url: string;
  name: string;
}

/** Official or primary YouTube channels for Dialogue philosophers */
export const PHILOSOPHER_CHANNELS: Record<string, PhilosopherChannel> = {
  krishnamurti: {
    url: K_FOUNDATION_YOUTUBE.url,
    name: K_FOUNDATION_YOUTUBE.channel,
  },
  "ug-krishnamurti": {
    url: "https://www.youtube.com/results?search_query=U.G.+Krishnamurti",
    name: "U.G. Krishnamurti (archived talks)",
  },
  sadhguru: { url: "https://www.youtube.com/sadhguru", name: "Sadhguru" },
  socrates: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  plato: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  aristotle: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  buddha: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  laozi: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  confucius: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  zhuangzi: { url: "https://www.youtube.com/c/theschooloflife", name: "The School of Life" },
  epictetus: { url: "https://www.youtube.com/@academyofideas", name: "Academy of Ideas" },
  "marcus-aurelius": {
    url: "https://www.youtube.com/@academyofideas",
    name: "Academy of Ideas",
  },
  nietzsche: { url: "https://www.youtube.com/@academyofideas", name: "Academy of Ideas" },
  descartes: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  spinoza: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  kant: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  wittgenstein: { url: "https://www.youtube.com/@theschooloflifetv", name: "The School of Life" },
  rumi: { url: "https://www.youtube.com/results?search_query=Rumi+poetry+lecture", name: "Rumi lectures" },
  shankara: {
    url: "https://www.youtube.com/results?search_query=Advaita+Shankara",
    name: "Advaita Vedanta",
  },
  "ramana-maharshi": {
    url: "https://www.youtube.com/results?search_query=Ramana+Maharshi",
    name: "Ramana Maharshi",
  },
  hypatia: { url: "https://www.youtube.com/@TEDEd", name: "TED-Ed" },
  "simone-de-beauvoir": {
    url: "https://www.youtube.com/@TEDEd",
    name: "TED-Ed",
  },
  annamacharya: {
    url: "https://www.youtube.com/results?search_query=Annamacharya+sankeertana",
    name: "Annamacharya",
  },
  "garikapati-narasimha-rao": {
    url: "https://www.youtube.com/channel/UCs-R8HFk3PQHu3nWb1C1Maw",
    name: "Sri Garikipati Narasimha Rao",
  },
  "chaganti-koteswara-rao": {
    url: "https://www.youtube.com/results?search_query=Chaganti+Koteswara+Rao",
    name: "Chaganti Koteswara Rao",
  },
  "amartya-sen": { url: "https://www.youtube.com/@UChicago", name: "University of Chicago" },
  "kancha-ilaiah": {
    url: "https://www.youtube.com/results?search_query=Kancha+Ilaiah",
    name: "Kancha Ilaiah Shepherd",
  },
  kabir: {
    url: "https://www.youtube.com/results?search_query=Kabir+philosophy+Hindi",
    name: "Kabir",
  },
  tulsidas: {
    url: "https://www.youtube.com/results?search_query=Tulsidas+Ramcharitmanas",
    name: "Tulsidas",
  },
  surdas: {
    url: "https://www.youtube.com/results?search_query=Surdas+bhakti",
    name: "Surdas",
  },
  mirabai: {
    url: "https://www.youtube.com/results?search_query=Mirabai+bhajan",
    name: "Mirabai",
  },
  vivekananda: {
    url: "https://www.youtube.com/@AdvaitaAshrama",
    name: "Advaita Ashrama / Vivekananda",
  },
  "dayananda-saraswati": {
    url: "https://www.youtube.com/results?search_query=Dayananda+Saraswati+Arya+Samaj",
    name: "Arya Samaj",
  },
  ramakrishna: {
    url: "https://www.youtube.com/@AdvaitaAshrama",
    name: "Advaita Ashrama",
  },
  aurobindo: {
    url: "https://www.youtube.com/results?search_query=Sri+Aurobindo+Integral+Yoga",
    name: "Sri Aurobindo",
  },
  gandhi: {
    url: "https://www.youtube.com/results?search_query=Gandhi+philosophy+Hindi",
    name: "Mahatma Gandhi",
  },
  ambedkar: {
    url: "https://www.youtube.com/results?search_query=Ambedkar+speech",
    name: "Dr. B.R. Ambedkar",
  },
  tagore: {
    url: "https://www.youtube.com/results?search_query=Rabindranath+Tagore",
    name: "Rabindranath Tagore",
  },
  "bhagat-singh": {
    url: "https://www.youtube.com/results?search_query=Bhagat+Singh+philosophy",
    name: "Bhagat Singh",
  },
  premchand: {
    url: "https://www.youtube.com/results?search_query=Premchand+documentary",
    name: "Premchand",
  },
  osho: {
    url: "https://www.youtube.com/@OSHOhindi",
    name: "OSHO Hindi",
  },
};

export function getPhilosopherChannel(
  philosopherId: string,
  relatedVideos: { channelUrl?: string; channel: string }[],
): PhilosopherChannel | null {
  const mapped = PHILOSOPHER_CHANNELS[philosopherId];
  if (mapped) return mapped;
  const fromVideo = relatedVideos.find((v) => v.channelUrl);
  if (fromVideo?.channelUrl) {
    return { url: fromVideo.channelUrl, name: fromVideo.channel };
  }
  return null;
}
