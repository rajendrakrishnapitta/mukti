const notSelf = {
  label: "The Characteristic of Not-Self · SN 22.59",
  url: "https://suttacentral.net/sn22.59/en/sujato/",
};
const khemaka = {
  label: "With Khemaka · SN 22.89",
  url: "https://suttacentral.net/sn22.89/en/sujato",
};
const arrow = {
  label: "The Arrow · SN 36.6",
  url: "https://suttacentral.net/sn36.6/en/sujato",
};
const thatYouAre = {
  label: "Chāndogya Upaniṣad · 6.8.7",
  url: "https://www.wisdomlib.org/hinduism/book/chandogya-upanishad-english/d/doc239302.html",
};
const salt = {
  label: "Chāndogya Upaniṣad with Śaṅkara’s commentary · 6.13",
  url: "https://www.wisdomlib.org/hinduism/book/chandogya-upanishad-shankara-bhashya/d/doc1145316.html",
};
const shankara = {
  label: "Śaṅkara · Stanford Encyclopedia of Philosophy",
  url: "https://plato.stanford.edu/entries/shankara/",
};
const epictetus = {
  label: "Epictetus, Enchiridion · §1",
  url: "https://classics.mit.edu/Epictetus/epicench.html",
};
const existentialism = {
  label: "Existentialism · Stanford Encyclopedia of Philosophy",
  url: "https://plato.stanford.edu/entries/existentialism/",
};

export const journeyTitle = "Who am I?";

export const journeyDays = [
  {
    id: "what-changes",
    title: "What changes?",
    reading: "The Buddha asks his listeners to examine five aspects of experience: form, feeling, perception, mental formations, and consciousness. Each is subject to change and cannot be commanded to stay as we wish.",
    comparison: "Early Buddhism uses this examination to loosen identification. Advaita also questions identification with changing experiences, while holding that the true Self is consciousness itself. The same observation leaves them with different accounts of what you are.",
    prompt: "Think of something you once called an essential part of yourself. What changed, and why does that change matter to you?",
    sources: [notSelf, shankara],
  },
  {
    id: "that-you-are",
    title: "What does “that you are” mean?",
    reading: "Uddālaka tells his son Śvetaketu that the subtle essence is the self of this entire world. Advaita reads the teaching as pointing to the identity of the individual’s true Self and Brahman, ultimate reality.",
    comparison: "The Upaniṣadic teaching makes a claim about what the Self is. The Buddhist discourse asks whether anything in the five aggregates warrants being taken as self. The two questions can sound alike in a conversation while pointing in different directions.",
    prompt: "If your roles and achievements went unmentioned for a day, what would you still take to be yourself?",
    sources: [thatYouAre, notSelf],
  },
  {
    id: "sense-of-i",
    title: "The lingering sense of “I”",
    reading: "Khemaka says he does not identify any aggregate as self, yet a residual sense of “I am” persists. The discourse compares that sense to a flower’s scent, which cannot be assigned to one part of the flower.",
    comparison: "Khemaka distinguishes a view you can give up from a habit of identification that still returns. Advaita also distinguishes hearing a teaching from assimilating it, though its account of what is finally understood is different.",
    prompt: "Recall a mild criticism. When did it begin to feel like a statement about who you are?",
    sources: [khemaka, shankara],
  },
  {
    id: "salt-water",
    title: "Salt in water",
    reading: "Śvetaketu dissolves salt in water. The next morning he cannot find the lump, yet he can taste salt throughout. Uddālaka uses this to teach about a reality that is present without being visible.",
    comparison: "In the Upaniṣad, the analogy invites recognition of a subtle essence. In the early Buddhist discourse, inquiry examines the rise and change of experience without appealing to a shared essence.",
    prompt: "What is the difference between noticing an experience and inferring something from it? Use one example from today.",
    sources: [salt, notSelf],
  },
  {
    id: "second-arrow",
    title: "The second arrow",
    reading: "A Buddhist discourse compares pain followed by distress about that pain to being struck by two arrows. Its practical question is what happens in the mind after the first hurt.",
    comparison: "Both traditions examine what identification adds to experience. The Buddhist teaching here attends to reactions to pain. Advaita inquiry asks how an experience of pain comes to be attributed to the Self.",
    prompt: "Think of a small disappointment. What hurt at first, and what did you add when you told yourself the story again?",
    sources: [arrow, shankara],
  },
  {
    id: "awareness",
    title: "What do we mean by awareness?",
    reading: "Śaṅkara gives a central place to consciousness, which makes experience known and cannot be treated like another object we encounter.",
    comparison: "In SN 22.59, consciousness itself is among the aggregates examined as impermanent and not-self. When you compare the readings, ask what each author means by consciousness before deciding whether they agree.",
    prompt: "Notice a sound as it fades. What did you directly observe, and what are you tempted to conclude about the one who heard it?",
    sources: [shankara, notSelf],
  },
  {
    id: "live-the-question",
    title: "Live with the question",
    reading: "Return to two passages: the Buddha’s examination of the aggregates and Uddālaka’s instruction to Śvetaketu. Read each again with a specific incident from your week in mind.",
    comparison: "One reading asks what warrants being taken as self. The other points to the identity of Self and ultimate reality. You can take both seriously while leaving their disagreement open.",
    prompt: "What would you do differently this week if you held one of your usual stories about yourself more lightly?",
    sources: [notSelf, thatYouAre],
  },
];

export const curatedComparisons = [
  {
    title: "What is the self?",
    perspectives: [
      { name: "Early Buddhism", text: "The five aggregates are changing aspects of experience. Examining them as not-self can loosen the habit of treating them as possessions or as an enduring identity.", source: notSelf },
      { name: "Advaita Vedānta", text: "Śaṅkara distinguishes the changing person from the true Self, which he understands as consciousness and identifies with Brahman.", source: shankara },
    ],
  },
  {
    title: "What makes attachment painful?",
    perspectives: [
      { name: "Early Buddhism", text: "The second-arrow teaching distinguishes painful feeling from the added distress that can follow when the mind resists or chases relief.", source: arrow },
      { name: "Stoicism", text: "Epictetus asks us to distinguish our judgments and actions from outcomes and reputations that depend on other people or circumstances.", source: epictetus },
    ],
  },
  {
    title: "Where does purpose come from?",
    perspectives: [
      { name: "Existentialism", text: "In Sartre’s account, people shape who they become through choices and commitments within the situations they inherit.", source: existentialism },
      { name: "Stoicism", text: "Epictetus directs effort toward the quality of our judgments and actions, even when the result is beyond our control.", source: epictetus },
    ],
  },
];
