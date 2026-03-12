"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "fr" | "pt" | "sn";

type Translations = {
  nav: {
    home: string; about: string; program: string; speakers: string;
    registration: string; sponsors: string; gallery: string; contact: string;
  };
  cta: { register: string; learnMore: string; viewProgram: string; };
  search: { placeholder: string; noResults: string; searchLabel: string; };
  misc: { earlyBird: string; visitSite: string; };
};

const translations: Record<Language, Translations> = {
  en: {
    nav: { home: "Home", about: "About", program: "Program", speakers: "Speakers", registration: "Registration", sponsors: "Sponsors", gallery: "Gallery", contact: "Contact" },
    cta: { register: "Register Now", learnMore: "Learn More", viewProgram: "View Programme" },
    search: { placeholder: "Search pages, sessions, themes…", noResults: "No results found.", searchLabel: "Search" },
    misc: { earlyBird: "Early bird closes 30 June 2026", visitSite: "Visit TNF Secretariat website" },
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", program: "Programme", speakers: "Intervenants", registration: "Inscription", sponsors: "Partenaires", gallery: "Galerie", contact: "Contact" },
    cta: { register: "S'inscrire", learnMore: "En savoir plus", viewProgram: "Voir le programme" },
    search: { placeholder: "Rechercher des pages, séances, thèmes…", noResults: "Aucun résultat trouvé.", searchLabel: "Recherche" },
    misc: { earlyBird: "Tarif précoce jusqu'au 30 juin 2026", visitSite: "Visiter le site du Secrétariat TNF" },
  },
  pt: {
    nav: { home: "Início", about: "Sobre", program: "Programa", speakers: "Oradores", registration: "Registo", sponsors: "Patrocinadores", gallery: "Galeria", contact: "Contacto" },
    cta: { register: "Registar Agora", learnMore: "Saiba Mais", viewProgram: "Ver Programa" },
    search: { placeholder: "Pesquisar páginas, sessões, temas…", noResults: "Nenhum resultado encontrado.", searchLabel: "Pesquisa" },
    misc: { earlyBird: "Inscrição antecipada até 30 de junho de 2026", visitSite: "Visitar o site do Secretariado TNF" },
  },
  sn: {
    nav: { home: "Kumba", about: "Nezve", program: "Chirongwa", speakers: "Vatauriri", registration: "Kunyoresa", sponsors: "Vatsigiri", gallery: "Mifananidzo", contact: "Taura" },
    cta: { register: "Nyoresa Iye Zvino", learnMore: "Dzidza Zvakawanda", viewProgram: "Ona Chirongwa" },
    search: { placeholder: "Tsvaga mapeji, misangano, mazwi…", noResults: "Hapana zvakawanikwa.", searchLabel: "Tsvaga" },
    misc: { earlyBird: "Mutengo wekutanga unopera 30 Chikumi 2026", visitSite: "Shanyira webhusaiti yeTNF Secretariat" },
  },
};

const languageLabels: Record<Language, { flag: string; label: string; short: string }> = {
  en: { flag: "🇬🇧", label: "English", short: "EN" },
  fr: { flag: "🇫🇷", label: "Français", short: "FR" },
  pt: { flag: "🇵🇹", label: "Português", short: "PT" },
  sn: { flag: "🇿🇼", label: "ChiShona", short: "SN" },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translations;
  langs: typeof languageLabels;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], langs: languageLabels }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
