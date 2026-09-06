// Mocked data for the Kiwi prototype, everything is local and on-device in spirit.

export interface TherapyPreset {
  id: string;
  name: string;
  consequence: string;
  detail: string;
  exampleFlag: string;
}

export const PRESETS: TherapyPreset[] = [
  {
    id: "phonetic",
    name: "Phonetic Accuracy Focus",
    consequence: "Kiwi will flag every dropped or altered sound.",
    detail:
      "Best when you and your clinician are working on specific sounds. Expect precise, honest feedback on each word.",
    exampleFlag: "dropped /r/ in “around”",
  },
  {
    id: "pacing",
    name: "Pacing & Rhythm Focus",
    consequence: "Kiwi will focus on speed and rhythm, not pronunciation.",
    detail:
      "Best for rebuilding a steady, even pace. Kiwi listens for rushed or stretched stretches of speech.",
    exampleFlag: "rushed phrase in “wenttothe”",
  },
  {
    id: "fluency",
    name: "Conversational Fluency Focus",
    consequence: "Lighter feedback, for practising natural, connected speech.",
    detail:
      "Best for everyday conversation practice. Kiwi only notes moments where speech broke down noticeably.",
    exampleFlag: "long pause before “yesterday”",
  },
];

export const ASSIGNED_READING = {
  title: "The Morning Walk",
  clinician: "Dr. Meera Rao, SLP",
  text: "Around seven, I walked through the garden and listened to the birds. The air was cool, and the street was quiet except for a delivery truck turning the corner.",
  recommendedPreset: "phonetic",
};

export const TARGET_BANK = [
  { id: 1, word: "around", sound: "/r/ initial", note: "Drops the /r/ when tired", addedBy: "Dr. Rao", flagged: 6 },
  { id: 2, word: "through", sound: "/θr/ cluster", note: "Substitutes /f/ for /θ/", addedBy: "Dr. Rao", flagged: 4 },
  { id: 3, word: "street", sound: "/str/ cluster", note: "Cluster simplification", addedBy: "Dr. Rao", flagged: 3 },
  { id: 4, word: "listened", sound: "final /d/", note: "Swallows word endings", addedBy: "Dr. Rao", flagged: 5 },
  { id: 5, word: "delivery", sound: "4-syllable pacing", note: "Rushes middle syllables", addedBy: "Dr. Rao", flagged: 2 },
];

export interface FlaggedWord {
  word: string;
  label: string;
  icon: "dropped" | "altered" | "rushed";
}

export const MOCK_TRANSCRIPT: Array<{ word: string; flag?: FlaggedWord["label"] }> = [
  { word: "Around", flag: "dropped sound" },
  { word: "seven," },
  { word: "I" },
  { word: "walked" },
  { word: "through", flag: "altered sound" },
  { word: "the" },
  { word: "garden" },
  { word: "and" },
  { word: "listened", flag: "dropped sound" },
  { word: "to" },
  { word: "the" },
  { word: "birds." },
  { word: "The" },
  { word: "air" },
  { word: "was" },
  { word: "cool," },
  { word: "and" },
  { word: "the" },
  { word: "street", flag: "altered sound" },
  { word: "was" },
  { word: "quiet." },
];

export const DRILL_SENTENCES: Record<string, string[]> = {
  around: [
    "I walked around the block twice.",
    "She looked around the quiet room.",
    "We sat around the table after dinner.",
    "The path bends around the old tree.",
  ],
  through: [
    "We drove through the tunnel slowly.",
    "Rain came through the open window.",
    "He read through the letter twice.",
    "The path runs through the garden.",
  ],
  street: [
    "The street was quiet this morning.",
    "She crossed the street at the light.",
    "A truck turned onto our street.",
    "We strolled down the street after lunch.",
  ],
  listened: [
    "I listened to the radio at breakfast.",
    "She listened carefully and nodded.",
    "We listened to the rain on the roof.",
    "He listened to the whole message.",
  ],
  delivery: [
    "The delivery came before noon.",
    "A delivery truck turned the corner.",
    "She signed for the delivery at the door.",
    "His delivery was calm and steady.",
  ],
};

export const PATIENTS = [
  {
    id: "anand",
    name: "Anand K.",
    condition: "Post-stroke, 8 months",
    preset: "phonetic",
    streak: 12,
    sessionsThisWeek: 5,
    trend: [62, 65, 63, 68, 71, 74, 76, 78],
    lastSession: "Today, 9:40",
  },
  {
    id: "priya",
    name: "Priya S.",
    condition: "Post-surgical, 3 months",
    preset: "pacing",
    streak: 4,
    sessionsThisWeek: 3,
    trend: [55, 58, 61, 60, 64, 66, 69, 70],
    lastSession: "Yesterday, 18:12",
  },
  {
    id: "joseph",
    name: "Joseph M.",
    condition: "Lifelong phonetic condition",
    preset: "fluency",
    streak: 21,
    sessionsThisWeek: 6,
    trend: [70, 72, 74, 73, 76, 78, 80, 82],
    lastSession: "Today, 7:05",
  },
];

export const FLAG_LOG = [
  { date: "Sep 5", session: "The Morning Walk", patient: "Anand K.", flags: 3, top: "dropped /r/ in “around”", accuracy: 78 },
  { date: "Sep 4", session: "The Morning Walk", patient: "Anand K.", flags: 4, top: "final /d/ in “listened”", accuracy: 76 },
  { date: "Sep 4", session: "At the Market", patient: "Priya S.", flags: 5, top: "rushed middle syllables", accuracy: 69 },
  { date: "Sep 3", session: "The Morning Walk", patient: "Anand K.", flags: 4, top: "dropped /r/ in “around”", accuracy: 74 },
  { date: "Sep 3", session: "Phone Call Practice", patient: "Joseph M.", flags: 1, top: "long pause in “yesterday”", accuracy: 82 },
  { date: "Sep 2", session: "The Morning Walk", patient: "Anand K.", flags: 6, top: "/θr/ cluster in “through”", accuracy: 71 },
];

export const PATIENT_TREND = [62, 65, 63, 68, 71, 74, 76, 78];

export const PATIENT_MISTAKES = [
  { word: "around", label: "dropped sound", tip: "The /r/ at the start went missing, try holding it a beat longer." },
  { word: "through", label: "altered sound", tip: "The “th” came out closer to an “f”, tongue between the teeth." },
  { word: "listened", label: "dropped sound", tip: "The ending was swallowed, land on the final “d”." },
  { word: "street", label: "altered sound", tip: "The “str” cluster simplified, slow into the first syllable." },
];

export function presetById(id: string): TherapyPreset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0]!;
}

/* ---------- languages (patient side) ---------- */

export interface PracticeLanguage {
  code: string;
  label: string;
  native: string;
  title: string;
  text: string;
}

export const LANGUAGES: PracticeLanguage[] = [
  {
    code: "en-US",
    label: "English (US)",
    native: "English",
    title: ASSIGNED_READING.title,
    text: ASSIGNED_READING.text,
  },
  {
    code: "en-IN",
    label: "English (India)",
    native: "English",
    title: ASSIGNED_READING.title,
    text: ASSIGNED_READING.text,
  },
  {
    code: "hi-IN",
    label: "Hindi",
    native: "हिन्दी",
    title: "सुबह की सैर",
    text: "सात बजे मैं बगीचे में टहलने गया और पक्षियों की आवाज़ सुनी। हवा ठंडी थी और सड़क शांत थी।",
  },
  {
    code: "es-ES",
    label: "Spanish",
    native: "Español",
    title: "El paseo de la mañana",
    text: "A las siete caminé por el jardín y escuché a los pájaros. El aire estaba fresco y la calle estaba tranquila.",
  },
  {
    code: "fr-FR",
    label: "French",
    native: "Français",
    title: "La promenade du matin",
    text: "Vers sept heures, j'ai traversé le jardin et j'ai écouté les oiseaux. L'air était frais et la rue était calme.",
  },
];

export function languageByCode(code: string): PracticeLanguage {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]!;
}

/* ---------- per-error recovery (patient dashboard) ---------- */

export interface ErrorRecovery {
  word: string;
  sound: string;
  label: string;
  tip: string;
  /** Times this slipped in each of the last six sessions, oldest first. */
  history: number[];
  practised: number;
  goal: number;
}

export const ERROR_RECOVERY: ErrorRecovery[] = [
  {
    word: "around",
    sound: "/r/ at the start",
    label: "dropped sound",
    tip: "Hold the /r/ a beat longer before the rest of the word.",
    history: [5, 5, 4, 3, 3, 1],
    practised: 18,
    goal: 24,
  },
  {
    word: "through",
    sound: "“th” blend",
    label: "altered sound",
    tip: "Tongue lightly between the teeth, then let the air out.",
    history: [4, 4, 4, 3, 2, 2],
    practised: 12,
    goal: 24,
  },
  {
    word: "listened",
    sound: "final “d”",
    label: "dropped sound",
    tip: "Land firmly on the ending instead of trailing off.",
    history: [6, 5, 5, 4, 4, 3],
    practised: 9,
    goal: 24,
  },
  {
    word: "street",
    sound: "“str” blend",
    label: "altered sound",
    tip: "Slow into the first syllable so all three sounds get their turn.",
    history: [3, 3, 2, 2, 1, 1],
    practised: 21,
    goal: 24,
  },
];
