"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink, Search, Sun, Moon, Monitor, ChevronDown, Command } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, type Language } from "@/context/LanguageContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, langs } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const participateRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<HTMLDivElement>(null);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);

  const participateItems = [
    { label: t.nav.registration, href: "/registration" },
    { label: t.nav.submitAbstract, href: "/abstracts/submit" },
    { label: t.nav.volunteer, href: "/volunteer" },
    { label: t.nav.trackStatus, href: "/track-status" },
  ];
  const programItems = [
    { label: t.nav.programmeSchedule, href: "/program" },
    { label: t.nav.sessions, href: "/program#sessions" },
    { label: t.nav.speakers, href: "/speakers" },
  ];
  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.sponsors, href: "/sponsors" },
    { label: t.nav.gallery, href: "/gallery" },
    { label: t.nav.updates, href: "/updates" },
    { label: t.nav.contact, href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
      if (participateRef.current && !participateRef.current.contains(e.target as Node)) setParticipateOpen(false);
      if (programRef.current && !programRef.current.contains(e.target as Node)) setProgramOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const isDark = !mounted ? true : theme !== "light";

  const themeOptions = [
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
  ];

  const navbarBg = scrolled
    ? isDark
      ? "bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-2xl border-b border-white/5"
      : "bg-white/95 backdrop-blur-xl shadow-lg border-b border-black/5"
    : "bg-transparent";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
      >
        <div className="w-full px-10">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image src="/tnf-icon.png" alt="TNF Logo" fill className="object-contain" priority />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className={`font-bold text-sm transition-colors ${isDark ? "text-white" : "text-[#0A1628]"}`}>TNF Global Summit</div>
                <div className="text-[#C9921A] text-xs">Victoria Falls 2026</div>
              </div>
            </Link>

            {/* Desktop Nav — with dropdowns for Participate & Program */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${pathname === link.href ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-[#0A1628] hover:bg-black/5"}`}>
                  {link.label}
                </Link>
              ))}
              {/* Participate dropdown */}
              <div ref={participateRef} className="relative">
                <button
                  onClick={() => { setParticipateOpen(!participateOpen); setProgramOpen(false); }}
                  className={`flex items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${participateItems.some(i => pathname === i.href) ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-[#0A1628] hover:bg-black/5"}`}
                >
                  {t.nav.participate}
                  <ChevronDown className={`w-3 h-3 transition-transform ${participateOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {participateOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 min-w-[200px] rounded-xl overflow-hidden shadow-2xl border z-50" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                      {participateItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setParticipateOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-all ${pathname === item.href ? "bg-[#C9921A]/15 text-[#F5B730]" : ""}`} style={{ color: pathname === item.href ? undefined : "var(--text-secondary)" }}>
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Program dropdown */}
              <div ref={programRef} className="relative">
                <button
                  onClick={() => { setProgramOpen(!programOpen); setParticipateOpen(false); }}
                  className={`flex items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${programItems.some(i => pathname === i.href) ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-[#0A1628] hover:bg-black/5"}`}
                >
                  {t.nav.program}
                  <ChevronDown className={`w-3 h-3 transition-transform ${programOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {programOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 min-w-[200px] rounded-xl overflow-hidden shadow-2xl border z-50" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                      {programItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setProgramOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-all ${pathname === item.href ? "bg-[#C9921A]/15 text-[#F5B730]" : ""}`} style={{ color: pathname === item.href ? undefined : "var(--text-secondary)" }}>
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.slice(2).map((link) => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${pathname === link.href ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-[#0A1628] hover:bg-black/5"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  isDark
                    ? "text-slate-400 hover:text-white bg-white/5 border-white/10 hover:border-white/20"
                    : "text-slate-500 hover:text-[#0A1628] bg-black/5 border-black/10 hover:border-black/20"
                }`}
                title="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline text-xs">{t.search.searchLabel}</span>
                <span className="hidden lg:flex items-center gap-0.5 text-[10px] opacity-50">
                  <Command className="w-3 h-3" />K
                </span>
              </button>

              {/* Language Switcher */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => { setLangOpen(!langOpen); setThemeOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border ${
                    isDark
                      ? "text-slate-300 hover:text-white bg-white/5 border-white/10 hover:border-white/20"
                      : "text-slate-600 hover:text-[#0A1628] bg-black/5 border-black/10 hover:border-black/20"
                  }`}
                  title="Change language"
                >
                  <span className="text-base leading-none">{langs[language].flag}</span>
                  <span className="hidden sm:inline text-xs">{langs[language].short}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden shadow-2xl border z-50"
                      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
                    >
                      {(Object.keys(langs) as Language[]).map(lang => (
                        <button
                          key={lang}
                          onClick={() => { setLanguage(lang); setLangOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                            language === lang ? "bg-[#C9921A]/15 text-[#F5B730]" : ""
                          }`}
                          style={{ color: language === lang ? undefined : "var(--text-secondary)" }}
                        >
                          <span className="text-base">{langs[lang].flag}</span>
                          <span className="flex-1 text-left font-medium">{langs[lang].label}</span>
                          {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#C9921A]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <div ref={themeRef} className="relative">
                <button
                  onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all border ${
                    isDark
                      ? "text-slate-300 hover:text-white bg-white/5 border-white/10 hover:border-white/20"
                      : "text-slate-600 hover:text-[#0A1628] bg-black/5 border-black/10 hover:border-black/20"
                  }`}
                  title="Change theme"
                >
                  {mounted ? (
                    theme === "dark" ? <Moon className="w-4 h-4" /> :
                    theme === "light" ? <Sun className="w-4 h-4" /> :
                    <Monitor className="w-4 h-4" />
                  ) : <Moon className="w-4 h-4" />}
                  <ChevronDown className={`w-3 h-3 transition-transform ${themeOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {themeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-40 rounded-xl overflow-hidden shadow-2xl border z-50"
                      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
                    >
                      {themeOptions.map(opt => {
                        const Icon = opt.icon;
                        const isActive = mounted && theme === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => { setTheme(opt.value); setThemeOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${isActive ? "bg-[#C9921A]/15 text-[#F5B730]" : ""}`}
                            style={{ color: isActive ? undefined : "var(--text-secondary)" }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1 text-left font-medium">{opt.label}</span>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C9921A]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* External link — desktop only */}
              <a
                href="https://tnfzim.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden lg:flex items-center gap-1 text-xs transition-colors ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden xl:inline">tnfzim.com</span>
              </a>

              {/* Register CTA — desktop */}
              <Link
                href="/registration"
                className="hidden lg:flex btn-gold px-4 py-2 rounded-lg text-xs font-bold"
              >
                {t.cta.register}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-[#0A1628] hover:bg-black/5"}`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-72 border-l p-6 overflow-y-auto"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="relative h-9 w-9">
                    <Image src="/tnf-icon.png" alt="TNF" fill className="object-contain" />
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>TNF Summit 2026</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile search */}
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm border transition-all"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <Search className="w-4 h-4" />
                <span>{t.search.searchLabel}…</span>
              </button>

              <nav className="space-y-0.5 mb-6">
                <Link href="/" onClick={() => setMobileOpen(false)} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${pathname === "/" ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15 border border-[#C9921A]/25" : "text-[#33A852] bg-[#33A852]/10 border border-[#33A852]/25") : ""}`} style={{ color: pathname === "/" ? undefined : "var(--text-secondary)" }}>{t.nav.home}</Link>
                <Link href="/about" onClick={() => setMobileOpen(false)} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${pathname === "/about" ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15 border border-[#C9921A]/25" : "text-[#33A852] bg-[#33A852]/10 border border-[#33A852]/25") : ""}`} style={{ color: pathname === "/about" ? undefined : "var(--text-secondary)" }}>{t.nav.about}</Link>
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{t.nav.participate}</div>
                {participateItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : ""}`} style={{ color: pathname === item.href ? undefined : "var(--text-secondary)" }}>{item.label}</Link>
                ))}
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{t.nav.program}</div>
                {programItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15" : "text-[#33A852] bg-[#33A852]/10") : ""}`} style={{ color: pathname === item.href ? undefined : "var(--text-secondary)" }}>{item.label}</Link>
                ))}
                {navLinks.slice(2).map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${pathname === link.href ? (isDark ? "text-[#F5B730] bg-[#C9921A]/15 border border-[#C9921A]/25" : "text-[#33A852] bg-[#33A852]/10 border border-[#33A852]/25") : ""}`} style={{ color: pathname === link.href ? undefined : "var(--text-secondary)" }}>{link.label}</Link>
                ))}
              </nav>

              {/* Language + Theme controls */}
              <div className="py-4 border-t border-b space-y-3 mb-5" style={{ borderColor: "var(--border)" }}>
                {/* Language picker */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Language</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(Object.keys(langs) as Language[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold border transition-all ${language === lang ? "bg-[#C9921A]/15 border-[#C9921A]/40 text-[#F5B730]" : "border-transparent"}`}
                        style={{ color: language === lang ? undefined : "var(--text-muted)", background: language === lang ? undefined : "var(--bg-card)" }}
                      >
                        <span className="text-lg">{langs[lang].flag}</span>
                        {langs[lang].short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme picker */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Appearance</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {themeOptions.map(opt => {
                      const Icon = opt.icon;
                      const isActive = mounted && theme === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setTheme(opt.value)}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[10px] font-bold border transition-all ${isActive ? "bg-[#C9921A]/15 border-[#C9921A]/40 text-[#F5B730]" : "border-transparent"}`}
                          style={{ color: isActive ? undefined : "var(--text-muted)", background: isActive ? undefined : "var(--bg-card)" }}
                        >
                          <Icon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/registration"
                  onClick={() => setMobileOpen(false)}
                  className="block btn-gold px-5 py-3 rounded-xl text-sm font-bold text-center"
                >
                  {t.cta.register}
                </Link>
                <a
                  href="https://tnfzim.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs transition-colors py-2"
                  style={{ color: "var(--text-faint)" }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.misc.visitSite}
                </a>
                <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>{t.misc.earlyBird}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
