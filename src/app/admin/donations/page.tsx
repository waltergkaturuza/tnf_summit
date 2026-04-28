"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Heart, Mail, Building2, DollarSign } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { Donation, DonationPaymentStatus } from "@/lib/adminData";

const payLabels: Record<DonationPaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partial: "Partial",
};

function PayBadge({ s }: { s: DonationPaymentStatus }) {
  const cls =
    s === "paid"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
      : s === "unpaid"
        ? "bg-amber-500/15 text-amber-200 border-amber-500/25"
        : "bg-slate-500/15 text-slate-300 border-slate-500/25";
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cls}`}>{payLabels[s]}</span>
  );
}

export default function AdminDonationsPage() {
  const { donations, donationsLoading, updateDonation, refreshDonations } = useAdmin();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Donation | null>(null);
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<DonationPaymentStatus>("unpaid");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return donations;
    return donations.filter(
      (d) =>
        d.firstName.toLowerCase().includes(s) ||
        d.lastName.toLowerCase().includes(s) ||
        (d.organisation ?? "").toLowerCase().includes(s) ||
        d.email.toLowerCase().includes(s) ||
        d.trackId.toLowerCase().includes(s) ||
        d.categoryLabel.toLowerCase().includes(s)
    );
  }, [donations, q]);

  const openEdit = (d: Donation) => {
    setEditing(d);
    setNotes(d.adminNotes ?? "");
    setPay(d.paymentStatus);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateDonation(editing.id, { adminNotes: notes, paymentStatus: pay });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-[#C9921A]" />
            Donations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Card pledges (TNF-DON-*) with names, organisations, categories, and amounts. Update notes or payment status for manual reconciliation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshDonations()}
          disabled={donationsLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${donationsLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, organisation, email, reference, category…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9921A]/40"
        />
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Donor</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold text-right">USD</th>
                <th className="px-4 py-3 font-bold">Payment</th>
                <th className="px-4 py-3 font-bold">Reference</th>
                <th className="px-4 py-3 font-bold w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {donationsLoading && !donations.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No donations yet. Run the Supabase migration for <code className="text-slate-400">tnf_summit.donations</code> if this persists.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-semibold">
                        {d.firstName} {d.lastName}
                        {d.donorType === "organisation" && (
                          <span className="text-[10px] text-slate-500 font-normal ml-1">(org)</span>
                        )}
                      </div>
                      {d.organisation && (
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> {d.organisation}
                        </div>
                      )}
                      <div className="text-xs text-[#C9921A]/90 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {d.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[180px]">
                      <div className="truncate font-medium">{d.categoryLabel}</div>
                      <div className="text-[10px] text-slate-500">{d.categoryKey}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white tabular-nums">
                      <span className="inline-flex items-center justify-end gap-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                        {d.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PayBadge s={d.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#F5B730]">{d.trackId}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEdit(d)}
                        className="text-xs font-bold text-[#C9921A] hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-6 shadow-xl"
          >
            <h2 className="text-lg font-black text-white mb-1">Donation record</h2>
            <p className="text-xs text-slate-400 font-mono mb-4">{editing.trackId}</p>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Payment status</label>
            <select
              value={pay}
              onChange={(e) => setPay(e.target.value as DonationPaymentStatus)}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-white/10 text-white text-sm"
            >
              {(Object.keys(payLabels) as DonationPaymentStatus[]).map((k) => (
                <option key={k} value={k}>
                  {payLabels[k]}
                </option>
              ))}
            </select>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-white/10 text-white text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveEdit()}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#C9921A] text-[#0A1628]"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
