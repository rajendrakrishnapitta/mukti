import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { languageFromWindow, syncLanguageInUrl } from "../lib/appLanguageUrl";
import { en } from "./messages/en";
import { hi } from "./messages/hi";
import { te } from "./messages/te";
import { ta } from "./messages/ta";
import type { AppLanguage, Messages } from "./types";

export type { AppLanguage, Messages };

const STORAGE_KEY = "mukti-language-v1";

export const LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
];

const messages: Record<AppLanguage, Messages> = { en, hi, te, ta };

const LOCALES: Record<AppLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
};

function loadLanguage(): AppLanguage {
  const fromUrl = languageFromWindow();
  if (fromUrl) return fromUrl;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "hi" || raw === "te" || raw === "ta" || raw === "en") return raw;
  } catch {
    /* ignore */
  }
  return "en";
}

export function formatTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? ""),
  );
}

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: Messages;
  locale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const lang = loadLanguage();
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* ignore */
      }
      if (languageFromWindow()) syncLanguageInUrl(lang);
    }
    return lang;
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
    syncLanguageInUrl(lang);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: messages[language],
      locale: LOCALES[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
