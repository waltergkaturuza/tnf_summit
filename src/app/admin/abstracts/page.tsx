"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, X, CheckCircle, Clock, XCircle, Eye,
  Mail, Building2, Calendar, Tag, User, ExternalLink, Trash2,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { Abstract, AbstractStatus } from "@/lib/adminData";
import { themes } from "@/lib/data";

const statusConfig: Record<AbstractStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
  under_review: { label: "Under Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  accepted: { label: "Accepted", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

const participationLabels: Record<string, string> = {
  oral: "Oral",
  poster: "Poster",
  panel: "Panel",
  workshop: "Workshop",
  other: "Other",
};

function AbstractModal({
  abs,
  onClose,
  onUpdate,
  onDelete,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4"
      >
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
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
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
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {abs.gender && <span className="px-2 py-0.5 rounded bg-white/5">{abs.gender}</span>}
              {abs.dateOfBirth && <span className="px-2 py-0.5 rounded bg-white/5">DOB: {abs.dateOfBirth}</span>}
              {abs.tShirtSize && <span className="px-2 py-0.5 rounded bg-white/5">T-shirt: {abs.tShirtSize}</span>}
            </div>
          </div>

          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Abstract</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{abs.abstractText}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {abs.keywords?.map((k) => (
                <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9921A]/15 text-[#F5B730]">{k}</span>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-2">Word count: {abs.wordCount} (350–500 required)</p>
          </div>

          {abs.coAuthors && abs.coAuthors.length > 0 && (
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Co-authors</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                {abs.coAuthors.map((c, i) => (
                  <li key={i}>{c.name}{c.institution ? ` · ${c.institution}` : ""}{c.email ? ` · ${c.email}` : ""}</li>
                ))}
              </ul>
            </div>
          )}

          {abs.documentUrl && (
            <div>
              <a href={abs.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C9921A] text-sm font-semibold hover:underline">
                <FileText className="w-4 h-4" /> View uploaded document {abs.fileName && `(${abs.fileName})`}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AbstractStatus)}
              className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60"
            >
              {(Object.keys(statusConfig) as AbstractStatus[]).map((s) => (
                <option key={s} value={s}>{statusConfig[s].label}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Admin notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60 resize-none"
              placeholder="Internal notes..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-white/5">
          <button
            onClick={() => { if (confirm("Delete this abstract?")) onDelete(abs.id); onClose(); }}
            className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl glass text-slate-300 hover:text-white text-sm">Cancel</button>
            <button onClick={save} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">Save changes</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AbstractsPage() {
  const { abstracts, abstractsLoading, updateAbstract, deleteAbstract, refreshAbstracts } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AbstractStatus>("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [selected, setSelected] = useState<Abstract | null>(null);

  const filtered = useMemo(() => {
    return abstracts.filter((a) => {
      const q = search.toLowerCase();
      const matchQ = !q || `${a.title} ${a.firstName} ${a.lastName} ${a.email} ${a.institution} ${a.trackId} ${a.keywords?.join(" ")}`.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || a.status === statusFilter;
      const matchT = themeFilter === "all" || a.themeId === themeFilter;
      return matchQ && matchS && matchT;
    });
  }, [abstracts, search, statusFilter, themeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Abstract Submissions</h1>
          <p className="text-slate-400 text-sm mt-1">
            {abstracts.filter((a) => a.status === "submitted").length} new · {abstracts.filter((a) => a.status === "accepted").length} accepted
          </p>
        </div>
        <button onClick={refreshAbstracts} className="flex items-center gap-2 glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold">
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, email, track ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60"
          />
        </div>
        {(["all", "submitted", "under_review", "accepted", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              statusFilter === s ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30" : "glass text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {s === "all" ? "All" : statusConfig[s].label}
          </button>
        ))}
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All themes</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.label.slice(0, 40)}</option>
          ))}
        </select>
      </div>

      {abstractsLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Track ID</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Title / Author</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Theme</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Type</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
                  <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((abs) => {
                  const cfg = statusConfig[abs.status];
                  const themeLabel = themes.find((t) => t.id === abs.themeId)?.label ?? abs.themeId;
                  return (
                    <tr key={abs.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-[#C9921A] text-xs font-mono font-bold">{abs.trackId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-white text-sm font-semibold line-clamp-2">{abs.title}</div>
                          <div className="text-slate-500 text-xs">{abs.firstName} {abs.lastName} · {abs.institution}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-xs max-w-[180px] truncate">{themeLabel}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{participationLabels[abs.participation] ?? abs.participation}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs">
                        {new Date(abs.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(abs)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-slate-300 hover:text-white text-xs font-semibold"
                        >
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
      )}

      {!abstractsLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No abstract submissions found.</p>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <AbstractModal
            abs={selected}
            onClose={() => setSelected(null)}
            onUpdate={updateAbstract}
            onDelete={deleteAbstract}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
