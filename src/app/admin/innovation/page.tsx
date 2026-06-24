"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Rocket, Mail, DollarSign } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { InnovationApplication, RegistrationStatus } from "@/lib/adminData";

const statusLabels: Record<RegistrationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  waitlisted: "Waitlisted",
};

export default function AdminInnovationPage() {
  const { innovationApplications, innovationLoading, updateInnovationApplication, refreshInnovationApplications } = useAdmin();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<InnovationApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<RegistrationStatus>("pending");
  const [pay, setPay] = useState<"unpaid" | "paid" | "partial">("unpaid");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return innovationApplications;
    return innovationApplications.filter(
      (a) =>
        a.firstName.toLowerCase().includes(s) ||
        a.lastName.toLowerCase().includes(s) ||
        a.startupName.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.trackId.toLowerCase().includes(s)
    );
  }, [innovationApplications, q]);

  const openEdit = (a: InnovationApplication) => {
    setEditing(a);
    setNotes(a.adminNotes);
    setStatus(a.status);
    setPay(a.paymentStatus);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateInnovationApplication(editing.id, { adminNotes: notes, status, paymentStatus: pay });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Rocket className="w-7 h-7 text-[#C9921A]" />
            Innovation Challenge
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Youth Innovation applications (TNF-INN-*). USD 200 base + USD 20 per excursion. In-person only.
          </p>
        </div>
        <button type="button" onClick={() => refreshInnovationApplications()} disabled={innovationLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${innovationLoading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, start-up, email, reference…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9921A]/40" />
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Applicant</th>
                <th className="px-4 py-3 font-bold">Start-up</th>
                <th className="px-4 py-3 font-bold">Excursions</th>
                <th className="px-4 py-3 font-bold text-right">USD</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Reference</th>
                <th className="px-4 py-3 font-bold w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {innovationLoading && !innovationApplications.length ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No applications yet.</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-semibold">{a.firstName} {a.lastName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" />{a.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate">{a.startupName}</td>
                    <td className="px-4 py-3 text-slate-400">{a.excursionCount}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#F5B730]">{a.feeAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${a.paymentStatus === "paid" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" : "bg-amber-500/15 text-amber-200 border-amber-500/25"}`}>
                        {a.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#C9921A]">{a.trackId}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => openEdit(a)} className="text-xs font-bold text-[#C9921A] hover:underline">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg glass rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-black text-white mb-1">{editing.startupName}</h2>
            <p className="text-sm text-slate-400 mb-4">{editing.firstName} {editing.lastName} · {editing.trackId}</p>
            <div className="space-y-3 text-sm text-slate-300 mb-4">
              <p><strong className="text-slate-500">Stage:</strong> {editing.startupStage}</p>
              <p><strong className="text-slate-500">Excursions:</strong> {editing.excursions.length ? editing.excursions.join("; ") : "None"}</p>
              <p className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-[#C9921A]" /> USD {editing.feeAmount} (base {editing.baseFeeUsd} + excursions {editing.excursionFeeUsd})</p>
            </div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Application status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as RegistrationStatus)} className="w-full mb-3 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm">
              {(Object.keys(statusLabels) as RegistrationStatus[]).map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment status</label>
            <select value={pay} onChange={(e) => setPay(e.target.value as typeof pay)} className="w-full mb-3 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm">
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
            </select>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full mb-4 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm text-slate-400">Cancel</button>
              <button type="button" onClick={() => void saveEdit()} className="btn-gold px-4 py-2 rounded-xl text-sm font-bold">Save</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
