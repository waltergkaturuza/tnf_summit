"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileText, Calendar, Mic, Users, Image, Phone, Shield, BookOpen, Star } from "lucide-react";
import { program, themes } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

type Result = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
  icon: React.ElementType;
};

const pageResults: Result[] = [
  { id: "home", title: "Home", subtitle: "Summit overview, countdown, themes", href: "/", category: "Pages", icon: FileText },
  { id: "about", title: "About the Summit", subtitle: "Mission, SDG 8, tripartite model, venue", href: "/about", category: "Pages", icon: FileText },
  { id: "program", title: "Programme", subtitle: "Full 7-day schedule, concurrent sessions", href: "/program", category: "Pages", icon: Calendar },
  { id: "speakers", title: "Speakers & Panelists", subtitle: "Keynote speakers, Innovation Challenge", href: "/speakers", category: "Pages", icon: Mic },
  { id: "registration", title: "Registration", subtitle: "Delegate registration, fees, categories", href: "/registration", category: "Pages", icon: Users },
  { id: "sponsors", title: "Sponsors & Partners", subtitle: "Platinum, Gold, Silver sponsorship tiers", href: "/sponsors", category: "Pages", icon: Star },
  { id: "gallery", title: "Media Gallery", subtitle: "Photos, videos, presentations, proceedings", href: "/gallery", category: "Pages", icon: Image },
  { id: "contact", title: "Contact & FAQ", subtitle: "Secretariat contact, enquiry form", href: "/contact", category: "Pages", icon: Phone },
  { id: "privacy", title: "Privacy Policy", subtitle: "Data protection, cookies, user rights", href: "/privacy", category: "Legal", icon: Shield },
  { id: "terms", title: "Terms of Use", subtitle: "Registration policies, code of conduct", href: "/terms", category: "Legal", icon: Shield },
];

function buildSessionResults(): Result[] {
  const results: Result[] = [];
  program.forEach(day => {
    day.sessions.forEach(session => {
      if (session.title && session.title.length > 5) {
        results.push({
          id: `session-${day.date}-${session.time}-${session.id}`,
          title: session.title,
          subtitle: `${day.dayLabel} · ${session.time} · Room ${session.room}`,
          href: `/program`,
          category: "Sessions",
          icon: Calendar,
        });
      }
    });
  });
  return results;
}

function buildThemeResults(): Result[] {
  return themes.map(theme => ({
    id: `theme-${theme.id}`,
    title: theme.label,
    subtitle: "Spotlight theme · View on About page",
    href: "/about",
    category: "Themes",
    icon: BookOpen,
  }));
}

const allResults = [...pageResults, ...buildSessionResults(), ...buildThemeResults()];

const categoryOrder = ["Pages", "Sessions", "Themes", "Legal"];
const categoryIcons: Record<string, React.ElementType> = {
  Pages: FileText, Sessions: Calendar, Themes: BookOpen, Legal: Shield,
};

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const filtered = query.trim().length === 0
    ? pageResults.slice(0, 6)
    : allResults.filter(r =>
        `${r.title} ${r.subtitle} ${r.category}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12);

  const grouped = categoryOrder.reduce((acc, cat) => {
    const items = filtered.filter(r => r.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, Result[]>);

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && flatFiltered[activeIndex]) { navigate(flatFiltered[activeIndex].href); }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, flatFiltered, activeIndex, navigate, onClose]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", damping: 25 }}
            className="relative w-full max-w-2xl z-10"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: "var(--border)" }}>
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#C9921A" }} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t.search.placeholder}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-base focus:outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                {query && (
                  <button onClick={() => setQuery("")} style={{ color: "var(--text-muted)" }} className="hover:opacity-70">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-mono" style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: `1px solid var(--border)` }}>
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {flatFiltered.length === 0 ? (
                  <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t.search.noResults}</p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([cat, items]) => {
                    const CatIcon = categoryIcons[cat] || FileText;
                    return (
                      <div key={cat} className="mb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
                          <CatIcon className="w-3 h-3" style={{ color: "#C9921A" }} />
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C9921A" }}>{cat}</span>
                        </div>
                        {items.map(item => {
                          flatIndex++;
                          const isActive = flatIndex === activeIndex;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => navigate(item.href)}
                              onMouseEnter={() => setActiveIndex(flatIndex)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? "bg-[#C9921A]/10" : ""}`}
                              style={{ borderLeft: isActive ? "2px solid #C9921A" : "2px solid transparent" }}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "bg-[#C9921A]/20" : ""}`} style={{ background: isActive ? undefined : "var(--bg-card)" }}>
                                <Icon className={`w-4 h-4 ${isActive ? "text-[#C9921A]" : ""}`} style={{ color: isActive ? "#C9921A" : "var(--text-muted)" }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold truncate ${isActive ? "text-[#F5B730]" : ""}`} style={{ color: isActive ? undefined : "var(--text-primary)" }}>{item.title}</div>
                                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{item.subtitle}</div>
                              </div>
                              {isActive && <ArrowRight className="w-4 h-4 text-[#C9921A] flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-faint)" }}>
                  <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}>↑↓</kbd>Navigate</span>
                  <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}>↵</kbd>Open</span>
                  <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}>ESC</kbd>Close</span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>TNF Summit 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
