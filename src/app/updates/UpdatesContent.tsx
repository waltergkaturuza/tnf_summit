"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Calendar, Megaphone, Search, FolderOpen, CalendarDays } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Update } from "@/lib/adminData";

const CATEGORIES = ["News", "Business", "International Relations", "Social", "Social Justice & Labour Affairs", "Staff", "Events"];

export default function UpdatesContent({ initialUpdates }: { initialUpdates: Update[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "news" | "event">("all");
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const updates = useMemo(() => {
    let list = initialUpdates;
    if (filter !== "all") list = list.filter((u) => u.type === filter);
    if (category) list = list.filter((u) => u.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((u) => u.title.toLowerCase().includes(q) || (u.description || "").toLowerCase().includes(q));
    }
    return list;
  }, [initialUpdates, filter, category, search]);

  const featured = updates[0];
  const rest = updates.slice(1);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative pt-28 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9921A]/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-4">
            <Megaphone className="w-4 h-4 text-[#F5B730]" />
            <span className="text-[#F5B730] text-sm font-semibold">{t.nav.updates}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="text-4xl sm:text-5xl font-black text-white mb-2">
            {t.updates.heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-slate-400 text-lg max-w-2xl">
            {t.updates.heroSub}
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(["all", "news", "event"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    filter === f ? "bg-[#C9921A] text-[#0A1628] border-[#C9921A]" : "bg-white/5 text-slate-400 border-white/10 hover:border-[#C9921A]/40 hover:text-[#F5B730]"
                  }`}
                >
                  {f === "all" ? t.updates.filterAll : f === "news" ? t.updates.filterNews : t.updates.filterEvents}
                </button>
              ))}
            </div>

            {updates.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 rounded-2xl glass border border-white/5">
                <Newspaper className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{t.updates.noUpdates}</h2>
                <p className="text-slate-400 max-w-md mx-auto">{t.updates.noUpdatesHint}</p>
              </motion.div>
            ) : (
              <>
                {/* Featured post */}
                {featured && (
                  <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <Link href={`/updates/${featured.id}`} className="block group rounded-2xl overflow-hidden border border-white/10 bg-[var(--bg-alt)] hover:border-[#C9921A]/30 transition-all">
                      {featured.imageUrl ? (
                        <div className="aspect-[16/9] bg-white/5 relative overflow-hidden">
                          <img src={featured.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md bg-[#C9921A]/90 text-[#0A1628]">{featured.category}</span>
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md ${featured.type === "event" ? "bg-amber-500/90 text-[#0A1628]" : "bg-sky-500/90 text-white"}`}>
                              {featured.type === "event" ? t.updates.typeEvent : t.updates.typeNews}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-br from-[#C9921A]/20 to-[#C9921A]/5 flex items-center justify-center">
                          <Newspaper className="w-20 h-20 text-[#C9921A]/50" />
                          <span className="absolute top-4 left-4 text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#C9921A]/20 text-[#F5B730]">{featured.category}</span>
                        </div>
                      )}
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm mb-2">
                          {featured.eventDate ? (
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(featured.eventDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                          ) : featured.publishedAt ? (
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(featured.publishedAt).toLocaleDateString()}</span>
                          ) : null}
                          <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4" />{featured.category}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 group-hover:text-[#F5B730] transition-colors">{featured.title}</h2>
                        <p className="text-slate-400 text-lg line-clamp-3 mb-4">{featured.description || "—"}</p>
                        <span className="inline-flex items-center gap-2 text-[#C9921A] font-bold">Read more →</span>
                      </div>
                    </Link>
                  </motion.article>
                )}

                {/* Recent posts list */}
                {rest.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider">More updates</h3>
                    {rest.map((u, i) => (
                      <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <Link href={`/updates/${u.id}`} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#C9921A]/20 hover:bg-white/5 transition-all group">
                          {u.imageUrl ? (
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                              <img src={u.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-[#C9921A]/10 flex items-center justify-center">
                              {u.type === "event" ? <CalendarDays className="w-8 h-8 text-[#C9921A]/50" /> : <Newspaper className="w-8 h-8 text-[#C9921A]/50" />}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-500 text-xs mb-0.5">{u.category} · {u.eventDate ? new Date(u.eventDate).toLocaleDateString() : u.publishedAt ? new Date(u.publishedAt).toLocaleDateString() : ""}</p>
                            <h4 className="text-white font-bold group-hover:text-[#F5B730] transition-colors line-clamp-2">{u.title}</h4>
                            <p className="text-slate-400 text-sm line-clamp-1 mt-0.5">{u.description || "—"}</p>
                          </div>
                          <span className="text-[#C9921A] self-center font-semibold">→</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Search */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#C9921A]/10 border-[#C9921A]/20">
                <div className="p-4 border-b border-[#C9921A]/20">
                  <h3 className="text-[#F5B730] font-bold flex items-center gap-2">
                    <Search className="w-4 h-4" /> Search
                  </h3>
                </div>
                <div className="p-4">
                  <input
                    type="text"
                    placeholder={t.updates.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60"
                  />
                </div>
              </div>

              {/* Recent posts */}
              <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-[#C9921A] font-bold flex items-center gap-2">Recent posts</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {initialUpdates.slice(0, 6).map((u) => (
                    <Link key={u.id} href={`/updates/${u.id}`} className="block px-4 py-3 hover:bg-white/5 transition-colors text-sm text-slate-300 hover:text-white">
                      <span className="line-clamp-2">{u.title}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{u.category} · {u.publishedAt ? new Date(u.publishedAt).toLocaleDateString() : ""}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-[#C9921A] font-bold flex items-center gap-2"><FolderOpen className="w-4 h-4" /> Categories</h3>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === null ? "bg-[#C9921A]/15 text-[#F5B730]" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? "bg-[#C9921A]/15 text-[#F5B730]" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
