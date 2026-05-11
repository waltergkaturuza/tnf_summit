"use client";

import { cn } from "@/lib/cn";
import { ChevronDown, Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const LANG_STORAGE_KEY = "tnf-summit-lang";

const LANGUAGES = [
  { code: "en", country: "GB", label: "English" },
  { code: "fr", country: "FR", label: "Français" },
  { code: "pt", country: "PT", label: "Português" },
  { code: "sn", country: "ZW", label: "ChiShona" },
  { code: "zh-CN", country: "CN", label: "中文" },
  { code: "ja", country: "JP", label: "日本語" },
  { code: "ru", country: "RU", label: "Русский" },
  { code: "el", country: "GR", label: "Ελληνικά" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

function getStoredLang(): LangCode {
  if (typeof window === "undefined") return "en";
  const raw = localStorage.getItem(LANG_STORAGE_KEY) as LangCode | null;
  if (raw && LANGUAGES.some((l) => l.code === raw)) return raw;
  return "en";
}

function triggerGoogleTranslate(langCode: string) {
  const frame = document.querySelector<HTMLIFrameElement>(".goog-te-menu-frame");
  if (frame?.contentDocument) {
    const items = frame.contentDocument.querySelectorAll<HTMLAnchorElement>(".goog-te-menu2-item a");
    for (const a of items) {
      if (a.textContent?.toLowerCase().includes(langCode.toLowerCase())) {
        a.click();
        return true;
      }
    }
  }

  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  return false;
}

function stripGoogleTranslateBanner() {
  if (typeof document === "undefined") return;
  document.querySelectorAll("iframe.goog-te-banner-frame, .goog-te-banner-frame").forEach((node) => {
    const el = node as HTMLElement;
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("height", "0", "important");
    el.style.setProperty("width", "0", "important");
    el.style.setProperty("overflow", "hidden", "important");
    el.style.setProperty("position", "absolute", "important");
    el.style.setProperty("left", "-9999px", "important");
  });
  document.body.style.setProperty("top", "0", "important");
  document.body.style.setProperty("position", "static", "important");
  document.body.style.setProperty("margin-top", "0", "important");
  document.body.style.setProperty("padding-top", "0", "important");
  document.documentElement.style.setProperty("margin-top", "0", "important");
  document.documentElement.style.setProperty("padding-top", "0", "important");
}

/** Mount once (non-admin public shell). Hidden host + Google script + TranslateElement. */
export function GoogleTranslateRoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (!w.google?.translate?.TranslateElement) return;
      const InlineLayout = w.google.translate.TranslateElement.InlineLayout;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new w.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          ...(InlineLayout?.SIMPLE != null ? { layout: InlineLayout.SIMPLE } : {}),
        },
        "google_translate_element",
      );
      stripGoogleTranslateBanner();
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* Re-apply when Google injects / mutates the banner (CSS alone is sometimes beaten by inline styles). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    stripGoogleTranslateBanner();
    const mo = new MutationObserver(() => stripGoogleTranslateBanner());
    mo.observe(document.documentElement, { childList: true, subtree: true });
    const fast = window.setInterval(stripGoogleTranslateBanner, 400);
    const stopFast = window.setTimeout(() => clearInterval(fast), 20000);
    return () => {
      mo.disconnect();
      clearInterval(fast);
      clearTimeout(stopFast);
    };
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}

export function LanguageSelector({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LangCode>("en");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getStoredLang());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selectLang = useCallback((code: LangCode) => {
    setCurrent(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
    setOpen(false);

    if (code === "en") {
      const frame = document.querySelector<HTMLIFrameElement>(".goog-te-menu-frame");
      if (frame?.contentDocument) {
        const first = frame.contentDocument.querySelector<HTMLAnchorElement>(".goog-te-menu2-item:first-child a");
        first?.click();
      }
      const banner = document.querySelector<HTMLElement>(".goog-te-banner-frame");
      if (banner) banner.style.display = "none";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      window.location.reload();
      return;
    }

    setTimeout(() => {
      if (!triggerGoogleTranslate(code)) {
        setTimeout(() => triggerGoogleTranslate(code), 1000);
      }
    }, 300);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-all",
          dark
            ? "text-slate-300 hover:text-white bg-white/5 border-white/10 hover:border-white/20"
            : "text-slate-600 hover:text-[#0A1628] bg-black/5 border-black/10 hover:border-black/20",
        )}
      >
        <Globe className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
        <span className="text-blue-500 font-bold">{activeLang.country}</span>
        <span className="hidden sm:inline text-xs">{activeLang.label}</span>
        <ChevronDown className={cn("w-3 h-3 shrink-0 opacity-70 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-[12rem] overflow-hidden rounded-xl border shadow-2xl",
            dark ? "border-white/10 bg-slate-950/95 text-white backdrop-blur-md" : "border-slate-200/90 bg-white text-slate-900 shadow-slate-200/50",
          )}
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => selectLang(lang.code)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  dark ? "hover:bg-white/10" : "hover:bg-slate-50",
                  isActive && (dark ? "bg-white/5" : "bg-blue-50"),
                )}
              >
                <span className="w-7 shrink-0 text-xs font-bold text-blue-500">{lang.country}</span>
                <span className="flex-1 font-medium">{lang.label}</span>
                {isActive && <span className="size-2 shrink-0 rounded-full bg-blue-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}
