import type { FullTranslations, Language } from "./types";
import en from "./en";

// Re-export type for consumers
export type { FullTranslations } from "./types";

// Build other languages by merging en with overrides. Each locale file exports partial overrides.
import { fr } from "@/lib/locales/fr";
import { pt } from "@/lib/locales/pt";
import { sn } from "@/lib/locales/sn";
import { zh } from "@/lib/locales/zh";
import { ja } from "@/lib/locales/ja";
import { ru } from "@/lib/locales/ru";
import { el } from "@/lib/locales/el";

function merge<T extends object>(base: T, overrides: Partial<T>): T {
  return { ...base, ...overrides } as T;
}

export const fullTranslations: Record<Language, FullTranslations> = {
  en,
  fr: merge(en, fr) as FullTranslations,
  pt: merge(en, pt) as FullTranslations,
  sn: merge(en, sn) as FullTranslations,
  zh: merge(en, zh) as FullTranslations,
  ja: merge(en, ja) as FullTranslations,
  ru: merge(en, ru) as FullTranslations,
  el: merge(en, el) as FullTranslations,
};
