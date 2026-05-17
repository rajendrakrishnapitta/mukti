import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  emptyInterest,
  mergeInterest,
  interestFromText,
  recommendVideos,
  type DialogueInterest,
} from "../lib/recommendVideos";
import type { PhilosophyVideo } from "../data/philosophyVideoTypes";
import { useLanguage } from "../i18n";
import type { DialogueRequest } from "../types";

const STORAGE_KEY = "mukti-dialogue-interest-v1";

function loadInterest(): DialogueInterest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyInterest();
    const parsed = JSON.parse(raw) as DialogueInterest;
    if (!parsed.themeIds || !parsed.corpus) return emptyInterest();
    return parsed;
  } catch {
    return emptyInterest();
  }
}

function saveInterest(interest: DialogueInterest) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interest));
  } catch {
    /* private mode */
  }
}

interface DialogueInterestContextValue {
  interest: DialogueInterest;
  recordExplore: (payload: {
    themeId?: string;
    label?: string;
    prompt?: string;
    tradition?: string;
  }) => void;
  recordInquire: (payload: {
    label?: string;
    prompt?: string;
    tradition?: string;
    category?: string;
  }) => void;
  recordDialogue: (text: string) => void;
  recordThemeBrowse: (themeId: string, themeName: string, overview?: string) => void;
  clearInterest: () => void;
  getRecommendedVideos: (limit: number, themeId?: string) => PhilosophyVideo[];
}

const DialogueInterestContext = createContext<DialogueInterestContextValue | null>(
  null,
);

export function DialogueInterestProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [interest, setInterest] = useState<DialogueInterest>(() => loadInterest());

  const apply = useCallback((patch: Partial<DialogueInterest>) => {
    setInterest((prev) => {
      const next = mergeInterest(prev, patch);
      saveInterest(next);
      return next;
    });
  }, []);

  const recordExplore = useCallback(
    (payload: {
      themeId?: string;
      label?: string;
      prompt?: string;
      tradition?: string;
    }) => {
      const fromText = interestFromText(
        payload.label ?? "",
        payload.prompt ?? "",
        payload.tradition ?? "",
      );
      const themeIds = [
        ...(payload.themeId ? [payload.themeId] : []),
        ...(fromText.themeIds ?? []),
      ];
      const corpus = [
        payload.label,
        payload.tradition,
        payload.prompt?.slice(0, 400),
      ].filter(Boolean) as string[];
      apply({ themeIds, corpus });
    },
    [apply],
  );

  const recordInquire = useCallback(
    (payload: {
      label?: string;
      prompt?: string;
      tradition?: string;
      category?: string;
    }) => {
      const fromText = interestFromText(
        payload.label ?? "",
        payload.prompt ?? "",
        payload.tradition ?? "",
        payload.category ?? "",
      );
      apply({
        themeIds: fromText.themeIds,
        corpus: [
          payload.tradition,
          payload.category,
          payload.prompt?.slice(0, 400),
          payload.label,
        ].filter(Boolean) as string[],
      });
    },
    [apply],
  );

  const recordDialogue = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const fromText = interestFromText(trimmed);
      apply({
        themeIds: fromText.themeIds,
        corpus: [trimmed.slice(0, 500)],
      });
    },
    [apply],
  );

  const recordThemeBrowse = useCallback(
    (themeId: string, themeName: string, overview?: string) => {
      const fromText = interestFromText(themeName, overview ?? "");
      apply({
        themeIds: [themeId, ...(fromText.themeIds ?? [])],
        corpus: [themeName, overview?.slice(0, 200) ?? ""].filter(Boolean),
      });
    },
    [apply],
  );

  const clearInterest = useCallback(() => {
    const next = emptyInterest();
    setInterest(next);
    saveInterest(next);
  }, []);

  const getRecommendedVideos = useCallback(
    (limit: number, themeId?: string) =>
      recommendVideos(interest, { limit, themeId, language }),
    [interest, language],
  );

  const value = useMemo(
    () => ({
      interest,
      recordExplore,
      recordInquire,
      recordDialogue,
      recordThemeBrowse,
      clearInterest,
      getRecommendedVideos,
    }),
    [
      interest,
      recordExplore,
      recordInquire,
      recordDialogue,
      recordThemeBrowse,
      clearInterest,
      getRecommendedVideos,
    ],
  );

  return (
    <DialogueInterestContext.Provider value={value}>
      {children}
    </DialogueInterestContext.Provider>
  );
}

export function useDialogueInterest() {
  const ctx = useContext(DialogueInterestContext);
  if (!ctx) {
    throw new Error("useDialogueInterest must be used within DialogueInterestProvider");
  }
  return ctx;
}

export function useDialogueInterestOptional() {
  return useContext(DialogueInterestContext);
}

/** Called from App when opening Dialogue from Explore / Inquire / starters */
export function applyDialogueRequestToInterest(
  record: DialogueInterestContextValue,
  request: Omit<DialogueRequest, "id">,
) {
  if (request.source === "explore") {
    record.recordExplore({
      themeId: request.themeId,
      label: request.label,
      prompt: request.prompt,
      tradition: request.tradition,
    });
  } else if (request.source === "inquire") {
    record.recordInquire({
      label: request.label,
      prompt: request.prompt,
      tradition: request.tradition,
      category: request.category,
    });
  } else {
    record.recordDialogue(request.prompt);
    if (request.label) record.recordDialogue(request.label);
  }
}
