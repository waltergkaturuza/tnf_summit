"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, ChevronDown, Filter, Search,
  Star, Building, Mic, Users, Coffee, Utensils, Music,
  Plane, Sun, Globe
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { program, themes } from "@/lib/data";
import { getSessionTypeColor, getSessionTypeBadge, getRoomLabel } from "@/lib/utils";
import type { Session } from "@/lib/data";

const typeIconMap: Record<string, React.ElementType> = {
  plenary: Mic,
  workshop: Building,
  networking: Users,
  ceremony: Star,
  special: Globe,
  concurrent: Building,
  social: Music,
  excursion: Sun,
};

function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIconMap[session.type] || Star;
  const sessionThemes = themes.filter((t) => session.themes.includes(t.id));

  return (
    <motion.div
      layout
      className={`glass rounded-xl border border-white/5 overflow-hidden card-hover ${
        session.isNew ? "border-amber-500/20" : ""
      }`}
    >
      <button
        className="w-full text-left p-4 sm:p-5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Time */}
          <div className="flex-shrink-0 text-center min-w-[80px]">
            <div className="flex items-center gap-1 text-[#C9921A] text-xs font-bold">
              <Clock className="w-3 h-3" />
              <span>{session.time}</span>
            </div>
            <div className="mt-1">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getSessionTypeColor(session.type)}`}
              >
                {getSessionTypeBadge(session.type)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              {session.isNew && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold flex-shrink-0">
                  ★ NEW
                </span>
              )}
              <h3 className="text-white text-sm font-semibold leading-snug">
                {session.title}
              </h3>
            </div>

            {/* Room & Themes */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {session.room !== "BOTH" && session.room !== "ALL" && (
                <div className="flex items-center gap-1 text-xs text-theme-primary">
                  <MapPin className="w-3 h-3" />
                  <span>{session.room === "A" ? "Room A" : "Room B"}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {sessionThemes.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ color: t.color, background: `${t.color}15` }}
                  >
                    Theme {t.id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Expand */}
          {session.description && (
            <div className="flex-shrink-0 ml-auto">
              <ChevronDown
                className={`w-4 h-4 text-theme-primary transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && session.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5">
              <p className="text-sm leading-relaxed mb-3 text-theme-primary">
                {session.description}
              </p>
              {session.room !== "BOTH" && session.room !== "ALL" && (
                <div className="flex items-center gap-2 text-xs text-theme-primary">
                  <MapPin className="w-3 h-3 text-[#C9921A]" />
                  <span>{getRoomLabel(session.room)}</span>
                </div>
              )}
              {sessionThemes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {sessionThemes.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
                      style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}
                    >
                      <span className="font-black">Theme {t.id}</span>
                      <span className="opacity-70">·</span>
                      <span>{t.label.replace(" ★ NEW", "")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


const dayColors: Record<string, string> = {
  "ARRIVAL DAY": "#64748B",
  "DAY 1": "#3B82F6",
  "DAY 2": "#8B5CF6",
  "DAY 3, OFFICIAL OPENING": "#10B981",
  "DAY 4": "#EC4899",
  "EXCURSIONS DAY": "#F59E0B",
  "DEPARTURE DAY": "#94A3B8",
};

export default function ProgramPage() {
  const { t } = useLanguage();
  const [activeDay, setActiveDay] = useState(0);
  const [activeType, setActiveType] = useState("all");
  const [activeRoom, setActiveRoom] = useState("all");
  const [search, setSearch] = useState("");

  const currentDay = program[activeDay];
  const sessionTypes = t.program.sessionTypes;
  const visibleDaySessions = currentDay.sessions.filter((s) => !s.hidden);

  const filteredSessions = visibleDaySessions.filter((s) => {
    const typeMatch = activeType === "all" || s.type === activeType;
    const roomMatch = activeRoom === "all" || s.room === activeRoom || s.room === "BOTH" || s.room === "ALL";
    const searchMatch =
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase());
    return typeMatch && roomMatch && searchMatch;
  });

  const dayColor = dayColors[currentDay.dayLabel] || "#C9921A";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      {/* Header */}
      <section className="py-16 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.program.heroBadge}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              {t.program.heroTitle.split(" ")[0]} <span className="gradient-text">{t.program.heroTitle.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-theme-primary">
              {t.program.heroSubLine2}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {program.map((day, i) => {
            const color = dayColors[day.dayLabel] || "#C9921A";
            return (
              <button
                key={i}
                onClick={() => { setActiveDay(i); setActiveType("all"); setActiveRoom("all"); setSearch(""); }}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  activeDay === i
                    ? "text-white border-transparent"
                    : "glass border-white/10 hover:text-white text-theme-primary"
                }`}
                style={activeDay === i ? { background: `${color}25`, borderColor: `${color}50`, color: color } : {}}
              >
                <div className="text-xs opacity-70">{day.date.split(",")[0]}</div>
                <div>{day.dayLabel}</div>
              </button>
            );
          })}
        </div>

        {/* Day header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-gold rounded-2xl p-5 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-black"
                    style={{ background: `${dayColor}20`, color: dayColor, border: `1px solid ${dayColor}40` }}
                  >
                    {currentDay.dayLabel}
                  </div>
                </div>
                <h2 className="text-white font-bold text-xl mt-2">{currentDay.theme}</h2>
                <div className="flex items-center gap-2 text-sm mt-1 text-theme-primary">
                  <Calendar className="w-4 h-4 text-[#C9921A]" />
                  <span>{currentDay.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#C9921A] text-2xl font-black">{visibleDaySessions.length}</div>
                <div className="text-xs text-theme-primary">{t.program.sessions}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C9921A]" />
            <span className="text-white text-sm font-semibold">{t.program.filters}</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
            <input
              type="text"
              placeholder={t.program.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/50"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sessionTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeType === t.id
                    ? "bg-[#C9921A] text-[#0A1628] font-bold"
                    : "glass text-theme-primary hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Room filter */}
          <div className="flex gap-2">
            {t.program.rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRoom(r.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeRoom === r.id
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "glass text-theme-primary hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeDay}-${activeType}-${activeRoom}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredSessions.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-theme-primary">{t.program.noSessions}</p>
                <button
                  onClick={() => { setActiveType("all"); setActiveRoom("all"); setSearch(""); }}
                  className="mt-4 text-[#C9921A] text-sm hover:text-[#F5B730] transition-colors"
                >
                  {t.program.clearFilters}
                </button>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="mt-10 glass rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C9921A]" />
            {t.program.sessionTypeLegend}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sessionTypes.slice(1).map((type) => (
              <div key={type.id} className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getSessionTypeColor(type.id)}`}>
                  {type.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Download note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-theme-primary">
            {t.program.downloadNote} · <span className="text-[#C9921A]">info@tnfzim.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
