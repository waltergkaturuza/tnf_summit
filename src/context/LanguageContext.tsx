"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { fullTranslations } from "@/lib/locales";
import type { Language } from "@/lib/locales/types";
import type { FullTranslations } from "@/lib/locales/types";

export type { Language } from "@/lib/locales/types";

const languageLabels: Record<Language, { flag: string; label: string; short: string }> = {
  en: { flag: "🇬🇧", label: "English", short: "EN" },
  fr: { flag: "🇫🇷", label: "Français", short: "FR" },
  pt: { flag: "🇵🇹", label: "Português", short: "PT" },
  sn: { flag: "🇿🇼", label: "ChiShona", short: "SN" },
  zh: { flag: "🇨🇳", label: "中文", short: "ZH" },
  ja: { flag: "🇯🇵", label: "日本語", short: "JA" },
  ru: { flag: "🇷🇺", label: "Русский", short: "RU" },
  el: { flag: "🇬🇷", label: "Ελληνικά", short: "EL" },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: FullTranslations;
  langs: typeof languageLabels;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Site copy is authored in English (`en`). User-facing translation is handled by the
 * Google Translate widget (see `GoogleTranslateRoot` + `LanguageSelector`), not locale bundles.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LanguageContextType>(
    () => ({
      language: "en",
      setLanguage: () => {},
      t: fullTranslations.en,
      langs: languageLabels,
    }),
    [],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
