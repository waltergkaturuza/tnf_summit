"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, X, Eye, Mail, Building2, User, ExternalLink, Trash2,
  Users, ClipboardList, Star, RefreshCw,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { Abstract, AbstractStatus } from "@/lib/adminData";
import { themes } from "@/lib/data";
import AssignReviewersModal from "@/components/admin/abstracts/AssignReviewersModal";

type AbstractTab = "all" | "reviewers" | "assign" | "graded";
type ScoreFilter = "all" | "none" | "1-10" | "11-20" | "21-30";

const TABS: { id: AbstractTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All Abstracts", icon: FileText },
  { id: "reviewers", label: "Reviewers", icon: Users },
  { id: "assign", label: "Assign Abstracts", icon: ClipboardList },
  { id: "graded", label: "Graded Abstracts", icon: Star },
];

const statusConfig: Record<AbstractStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
  under_review: { label: "Under Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  accepted: { label: "Accepted", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

const participationLabels: Record<string, string> = {
  oral: "Oral", poster: "Poster", panel: "Panel", workshop: "Workshop", other: "Other",
};

const SCORE_FILTERS: { id: ScoreFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "none", label: "No marks yet" },
  { id: "1-10", label: "1–10" },
  { id: "11-20", label: "11–20" },
  { id: "21-30", label: "21–30" },
];

function scoreInBand(score: number, band: ScoreFilter): boolean {
  if (band === "1-10") return score >= 1 && score <= 10;
  if (band === "11-20") return score >= 11 && score <= 20;
  if (band === "21-30") return score >= 21 && score <= 30;
  return true;
}

function abstractMatchesScoreFilter(
  abstractId: string,
  filter: ScoreFilter,
  reviewsByAbstract: Map<string, { score: number }[]>
): boolean {
  const reviews = reviewsByAbstract.get(abstractId) ?? [];
  if (filter === "all") return true;
  if (filter === "none") return reviews.length === 0;
  return reviews.some((r) => scoreInBand(r.score, filter));
}

function AbstractModal({
  abs, onClose, onUpdate, onDelete,
}: {
  abs: Abstract;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Abstract>) => void;
  onDelete: (id: string) => void;
}) {
  const [status, setStatus] = useState(abs.status);
  const [notes, setNotes] = useState(abs.adminNotes);
  const themeLabel = themes.find((t) => t.id === abs.themeId)?.label ?? abs.themeId;

  const save = () => {
    onUpdate(abs.id, { status, adminNotes: notes });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="relative w-full max-w-3xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4">
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#C9921A] text-sm font-mono font-bold">{abs.trackId}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusConfig[abs.status].color} ${statusConfig[abs.status].bg}`}>
                {statusConfig[abs.status].label}
              </span>
            </div>
            <h2 className="text-white font-black text-xl">{abs.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{themeLabel} · {participationLabels[abs.participation] ?? abs.participation}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Author</h3>
            <p className="text-white font-semibold">{abs.firstName} {abs.lastName}</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{abs.email}</span>
              {abs.phone && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{abs.phone}</span>}
              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{abs.institution}, {abs.country}</span>
            </div>
          </div>
          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Abstract</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{abs.abstractText}</p>
            <p className="text-slate-500 text-xs mt-2">Word count: {abs.wordCount}</p>
          </div>
          {abs.documentUrl && (
            <a href={abs.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C9921A] text-sm font-semibold hover:underline">
              <FileText className="w-4 h-4" /> View document <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value as AbstractStatus)} className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60">
              {(Object.keys(statusConfig) as AbstractStatus[]).map((s) => (
                <option key={s} value={s}>{statusConfig[s].label}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Admin notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-[#C9921A]/60" />
          </div>
        </div>
        <div className="flex items-center justify-between p-6 border-t border-white/5">
          <button onClick={() => { if (confirm("Delete this abstract?")) onDelete(abs.id); onClose(); }} className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl glass text-slate-300 text-sm">Cancel</button>
            <button onClick={save} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">Save changes</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AbstractsPage() {
  const {
    abstracts, abstractsLoading, updateAbstract, deleteAbstract, refreshAbstracts,
    abstractReviewers, abstractAssignments, abstractReviews, abstractReviewLoading,
    refreshAbstractReviewData, assignAbstractReviewers,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<AbstractTab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AbstractStatus>("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [selected, setSelected] = useState<Abstract | null>(null);
  const [assignTarget, setAssignTarget] = useState<Abstract | null>(null);

  const reviewerById = useMemo(() => new Map(abstractReviewers.map((r) => [r.id, r])), [abstractReviewers]);

  const assignmentsByAbstract = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const a of abstractAssignments) {
      const list = map.get(a.abstractId) ?? [];
      list.push(a.reviewerId);
      map.set(a.abstractId, list);
    }
    return map;
  }, [abstractAssignments]);

  const reviewsByAbstract = useMemo(() => {
    const map = new Map<string, { score: number; reviewerId: string }[]>();
    for (const r of abstractReviews) {
      const list = map.get(r.abstractId) ?? [];
      list.push({ score: r.score, reviewerId: r.reviewerId });
      map.set(r.abstractId, list);
    }
    return map;
  }, [abstractReviews]);

  const filteredAll = useMemo(() => {
    return abstracts.filter((a) => {
      const q = search.toLowerCase();
      const matchQ = !q || `${a.title} ${a.firstName} ${a.lastName} ${a.email} ${a.institution} ${a.trackId}`.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || a.status === statusFilter;
      const matchT = themeFilter === "all" || a.themeId === themeFilter;
      return matchQ && matchS && matchT;
    });
  }, [abstracts, search, statusFilter, themeFilter]);

  const filteredAssign = useMemo(() => {
    return abstracts.filter((a) => {
      const q = search.toLowerCase();
      const matchQ = !q || `${a.title} ${a.trackId}`.toLowerCase().includes(q);
      return matchQ && abstractMatchesScoreFilter(a.id, scoreFilter, reviewsByAbstract);
    });
  }, [abstracts, search, scoreFilter, reviewsByAbstract]);

  const gradedRows = useMemo(() => {
    return abstractReviews
      .filter((r) => scoreFilter === "all" || scoreInBand(r.score, scoreFilter))
      .map((r) => {
        const abs = abstracts.find((a) => a.id === r.abstractId);
        const reviewer = reviewerById.get(r.reviewerId);
        return { review: r, abstract: abs, reviewer };
      })
      .filter((row) => {
        if (!row.abstract) return false;
        const q = search.toLowerCase();
        if (!q) return true;
        return `${row.abstract.title} ${row.abstract.trackId} ${row.reviewer?.fullName ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => b.review.score - a.review.score);
  }, [abstractReviews, abstracts, reviewerById, scoreFilter, search]);

  const refreshAll = async () => {
    await Promise.all([refreshAbstracts(), refreshAbstractReviewData()]);
  };

  const tabBtn = (tab: AbstractTab) => {
    const cfg = TABS.find((t) => t.id === tab)!;
    const Icon = cfg.icon;
    const active = activeTab === tab;
    return (
      <button
        key={tab}
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
          active ? "border-[#C9921A] text-[#F5B730]" : "border-transparent text-slate-400 hover:text-white hover:border-white/20"
        }`}
      >
        <Icon className="w-4 h-4" />{cfg.label}
      </button>
    );
  };

  const scoreFilterChips = (target: "assign" | "graded") => (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
        Filter by reviewer mark (1–30)
      </p>
      <div className="flex flex-wrap gap-2">
        {SCORE_FILTERS.map((chip) => (
          <button
            key={`${target}-${chip.id}`}
            type="button"
            onClick={() => setScoreFilter(chip.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              scoreFilter === chip.id
                ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30"
                : "glass text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );

  const loading = abstractsLoading || abstractReviewLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Abstract Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            {abstracts.length} submissions · {abstractReviewers.length} reviewers · {abstractReviews.length} graded reviews
          </p>
        </div>
        <button onClick={refreshAll} className="flex items-center gap-2 glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="glass rounded-xl px-4 pt-2 border border-white/10">
        <div className="flex flex-wrap gap-1 border-b border-white/10">
          {TABS.map((t) => tabBtn(t.id))}
        </div>
      </div>

      {/* ── All Abstracts ── */}
      {activeTab === "all" && (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by title, author, email, track ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
            </div>
            {(["all", "submitted", "under_review", "accepted", "rejected"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30" : "glass text-slate-400 border-white/10"}`}>
                {s === "all" ? "All" : statusConfig[s].label}
              </button>
            ))}
            <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
              <option value="all">All themes</option>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.label.slice(0, 40)}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" /></div>
          ) : (
            <AbstractsTable rows={filteredAll} onView={setSelected} />
          )}
        </>
      )}

      {/* ── Reviewers ── */}
      {activeTab === "reviewers" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-white font-bold text-lg">Reviewers</h2>
            <p className="text-slate-400 text-sm mt-1">
              Users with the Reviewer role from universities and institutions. Create accounts in{" "}
              <Link href="/admin/users" className="text-[#C9921A] hover:underline">User Management</Link>.
            </p>
          </div>
          {abstractReviewers.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">No reviewers found yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Name</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Email</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Institution / University</th>
                </tr>
              </thead>
              <tbody>
                {abstractReviewers.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="px-4 py-3 text-white text-sm font-semibold">{r.fullName || "—"}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{r.email}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{r.institution || r.department || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Assign Abstracts ── */}
      {activeTab === "assign" && (
        <>
          <div className="glass rounded-xl p-5 space-y-4 border border-white/10">
            <div>
              <h2 className="text-white font-bold text-lg">Assign Abstracts to Reviewers</h2>
              <p className="text-slate-400 text-sm mt-1">
                See which abstracts are unassigned and assign one or more reviewers. Reviewers score submissions on a 1–30 rubric.
              </p>
            </div>
            {scoreFilterChips("assign")}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search submissions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
            </div>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Submission</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Assigned</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Reviewer marks</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredAssign.map((abs) => {
                  const assigned = assignmentsByAbstract.get(abs.id) ?? [];
                  const marks = reviewsByAbstract.get(abs.id) ?? [];
                  const cfg = statusConfig[abs.status];
                  return (
                    <tr key={abs.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                      <td className="px-4 py-3">
                        <div className="text-white text-sm font-semibold line-clamp-2">{abs.title}</div>
                        <div className="text-[#C9921A] text-xs font-mono mt-0.5">{abs.trackId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        {assigned.length ? `${assigned.length} reviewer${assigned.length > 1 ? "s" : ""}` : "Unassigned"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {marks.length === 0 ? (
                            <span className="text-slate-500 text-xs">—</span>
                          ) : marks.map((m, i) => {
                            const rev = reviewerById.get(m.reviewerId);
                            return (
                              <div key={i} className="text-xs text-slate-300">
                                <span className="text-[#F5B730] font-bold">{m.score}</span>
                                {" "}{rev?.fullName || rev?.email || "Reviewer"}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setAssignTarget(abs)} className="btn-gold px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap">
                          Assign / Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAssign.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-sm">No abstracts match this filter.</div>
            )}
          </div>
        </>
      )}

      {/* ── Graded Abstracts ── */}
      {activeTab === "graded" && (
        <>
          <div className="glass rounded-xl p-5 space-y-4 border border-white/10">
            <div>
              <h2 className="text-white font-bold text-lg">Graded Abstracts</h2>
              <p className="text-slate-400 text-sm mt-1">All submitted reviewer scores (1–30 rubric) across institutions.</p>
            </div>
            {scoreFilterChips("graded")}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by title or reviewer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
            </div>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Submission</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Reviewer</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Institution</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Score</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Recommendation</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {gradedRows.map(({ review, abstract, reviewer }) => {
                  if (!abstract) return null;
                  const cfg = statusConfig[abstract.status];
                  return (
                    <tr key={review.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                      <td className="px-4 py-3">
                        <div className="text-white text-sm font-semibold line-clamp-2">{abstract.title}</div>
                        <div className="text-[#C9921A] text-xs font-mono">{abstract.trackId}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{reviewer?.fullName || "—"}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{reviewer?.institution || reviewer?.department || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="text-[#F5B730] font-black text-lg">{review.score}</span>
                        <span className="text-slate-500 text-xs"> / 30</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs capitalize">{review.recommendation.replace(/-/g, " ")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {gradedRows.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-sm">No graded reviews yet.</div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {selected && (
          <AbstractModal abs={selected} onClose={() => setSelected(null)} onUpdate={updateAbstract} onDelete={deleteAbstract} />
        )}
        {assignTarget && (
          <AssignReviewersModal
            abstract={assignTarget}
            reviewers={abstractReviewers}
            assignedReviewerIds={assignmentsByAbstract.get(assignTarget.id) ?? []}
            onClose={() => setAssignTarget(null)}
            onSave={(ids) => assignAbstractReviewers(assignTarget.id, ids)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AbstractsTable({ rows, onView }: { rows: Abstract[]; onView: (a: Abstract) => void }) {
  if (!rows.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No abstract submissions found.</p>
      </div>
    );
  }
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Track ID</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Title / Author</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Theme</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((abs) => {
              const cfg = statusConfig[abs.status];
              const themeLabel = themes.find((t) => t.id === abs.themeId)?.label ?? abs.themeId;
              return (
                <tr key={abs.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                  <td className="px-4 py-3"><span className="text-[#C9921A] text-xs font-mono font-bold">{abs.trackId}</span></td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-semibold line-clamp-2">{abs.title}</div>
                    <div className="text-slate-500 text-xs">{abs.firstName} {abs.lastName} · {abs.institution}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-xs max-w-[180px] truncate">{themeLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs">
                    {new Date(abs.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => onView(abs)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-slate-300 hover:text-white text-xs font-semibold">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
