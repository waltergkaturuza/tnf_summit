import type { FullTranslations, Language, LocaleOverride } from "./types";
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

function merge(base: FullTranslations, overrides: LocaleOverride): FullTranslations {
  const result = { ...base } as FullTranslations;
  const sectionKeys: (keyof FullTranslations)[] = [
    "nav", "cta", "search", "misc", "home", "about", "footer",
    "program", "speakers", "sponsors", "gallery", "contact", "registration",
    "updates", "trackStatus", "volunteer", "abstracts",
  ];
  for (const key of sectionKeys) {
    const ov = (overrides as Record<string, unknown>)[key];
    const baseSection = (base as Record<string, unknown>)[key];
    if (ov && typeof ov === "object" && !Array.isArray(ov) && ov !== null && baseSection && typeof baseSection === "object") {
      (result as Record<string, unknown>)[key] = { ...baseSection, ...ov };
    }
  }
  return result;
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
