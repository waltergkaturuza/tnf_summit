"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Eye, CheckCircle, XCircle,
  Clock, Rocket, X, Mail, Phone, Globe,
  Trash2, AlertCircle, RefreshCw, MapPin,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { InnovationApplication, RegistrationStatus } from "@/lib/adminData";

const statusConfig: Record<RegistrationStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", icon: Clock },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", icon: XCircle },
  waitlisted: { label: "Waitlisted", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icon: Clock },
};

function StatusBadge({ status }: { status: RegistrationStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>
      <Icon className="w-2.5 h-2.5" />{cfg.label}
    </span>
  );
}

function InnovationModal({ app, onClose, onUpdate }: {
  app: InnovationApplication;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<InnovationApplication>) => void;
}) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.adminNotes);
  const [payStatus, setPayStatus] = useState(app.paymentStatus);

  const save = () => {
    onUpdate(app.id, { status, adminNotes: notes, paymentStatus: payStatus });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-6 sm:pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="relative w-[min(1400px,calc(100vw-1rem))] bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4">
        <div className="flex items-start justify-between p-6 lg:p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-black text-lg">
              {app.firstName[0]}{app.lastName[0]}
            </div>
            <div>
              <h2 className="text-white font-black text-xl">{app.salutation} {app.firstName} {app.lastName}</h2>
              <p className="text-slate-400 text-sm">{app.startupName} · {app.startupStage || "Stage not set"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C9921A] text-sm font-mono font-bold">{app.trackId}</span>
            <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-5">
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><a href={`mailto:${app.email}`} className="text-[#C9921A] hover:underline">{app.email}</a></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{app.phone || "—"}</span></div>
                {app.whatsapp && (
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">WhatsApp: {app.whatsapp}</span></div>
                )}
                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{app.city ? `${app.city}, ` : ""}{app.country}</span></div>
                {app.nationality && (
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">Nationality: {app.nationality}</span></div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Application Details</h3>
              <div className="space-y-1.5 text-sm">
                {[
                  ["Attendance", "In-person"],
                  ["Excursions", app.excursions.length ? `${app.excursionCount} selected` : "None"],
                  ["Dietary", app.dietaryRequirements || "None"],
                  ["Accommodation", app.requiresAccommodation ? "Assistance requested" : "Self-arranged"],
                  ["Invoice", app.invoiceRequired ? "Yes" : "No"],
                  ["Payment method", app.paymentMethod || "—"],
                  ["Applied", new Date(app.createdAt).toLocaleDateString("en-GB")],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 flex-wrap">
                    <span className="text-slate-500 w-28 flex-shrink-0">{k}:</span>
                    <span className="text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Payment</h3>
              <div className="flex items-center justify-between glass rounded-xl p-3">
                <div>
                  <div className="text-white font-black text-xl">USD {app.feeAmount}</div>
                  <div className="text-slate-400 text-xs">Base USD {app.baseFeeUsd} + excursions USD {app.excursionFeeUsd}</div>
                </div>
                <select value={payStatus} onChange={(e) => setPayStatus(e.target.value as typeof payStatus)}
                  className="bg-[var(--bg-primary)] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Venture</h3>
              <div className="glass rounded-xl p-4 space-y-2 text-sm h-full">
                <div><span className="text-slate-500">Start-up:</span> <span className="text-white font-semibold">{app.startupName}</span></div>
                <div><span className="text-slate-500">Stage:</span> <span className="text-slate-300">{app.startupStage || "—"}</span></div>
                {app.organisation && <div><span className="text-slate-500">Organisation:</span> <span className="text-slate-300">{app.organisation}</span></div>}
                {app.projectUrl && (
                  <div><span className="text-slate-500">Link:</span> <a href={app.projectUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9921A] hover:underline break-all">{app.projectUrl}</a></div>
                )}
                <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-white/5 whitespace-pre-wrap">{app.startupDescription}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Application Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(statusConfig) as RegistrationStatus[]).map((s) => {
                  const cfg = statusConfig[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s} type="button" onClick={() => setStatus(s)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${status === s ? `${cfg.bg} ${cfg.color} border-opacity-100` : "glass text-slate-400 border-white/10 hover:border-white/20"}`}>
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {app.excursions.length > 0 && (
              <div>
                <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Excursions Selected</h3>
                <div className="space-y-1">
                  {app.excursions.map((ex) => (
                    <div key={ex} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{ex}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {app.requiresAccommodation && (
              <div className="glass rounded-xl p-3 text-sm">
                <div className="text-sky-400 text-xs font-bold mb-1">Accommodation</div>
                <div className="text-slate-300 text-xs">
                  {app.arrivalDate && app.departureDate
                    ? `${app.arrivalDate} → ${app.departureDate}`
                    : "Dates not specified"}
                </div>
              </div>
            )}

            {app.specialNeeds && (
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1"><AlertCircle className="w-3.5 h-3.5" />Special Requirements</div>
                <p className="text-slate-300 text-xs">{app.specialNeeds}</p>
              </div>
            )}

            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Admin Notes</h3>
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes (not visible to applicant)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60 resize-none" />
            </div>

            <div className="flex gap-2">
              <button onClick={save} className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />Save Changes
              </button>
              <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass text-slate-300 hover:text-white text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />Email
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminInnovationPage() {
  const {
    innovationApplications,
    innovationLoading,
    updateInnovationApplication,
    deleteInnovationApplication,
    refreshInnovationApplications,
  } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFilter, setPayFilter] = useState("all");
  const [selected, setSelected] = useState<InnovationApplication | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");

  const filtered = useMemo(() => {
    return innovationApplications
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch = !q || `${a.firstName} ${a.lastName} ${a.startupName} ${a.email} ${a.country} ${a.trackId} ${a.organisation}`.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || a.status === statusFilter;
        const matchPay = payFilter === "all" || a.paymentStatus === payFilter;
        return matchSearch && matchStatus && matchPay;
      })
      .sort((a, b) => {
        if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "name") return `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
        return a.status.localeCompare(b.status);
      });
  }, [innovationApplications, search, statusFilter, payFilter, sortBy]);

  const exportCSV = () => {
    const headers = ["Track ID", "Status", "First Name", "Last Name", "Email", "Phone", "Country", "Start-up", "Stage", "Excursions", "Fee (USD)", "Payment Status", "Applied"];
    const rows = filtered.map((a) => [
      a.trackId, a.status, a.firstName, a.lastName, a.email, a.phone, a.country,
      a.startupName, a.startupStage, a.excursionCount, a.feeAmount, a.paymentStatus,
      new Date(a.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tnf_innovation_applications.csv";
    link.click();
  };

  const totalRevenue = filtered.filter((a) => a.paymentStatus === "paid").reduce((s, a) => s + a.feeAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Rocket className="w-7 h-7 text-[#C9921A]" />
            Innovation Challenge
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} of {innovationApplications.length} applications · USD {totalRevenue.toLocaleString()} confirmed revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => refreshInnovationApplications()} disabled={innovationLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-slate-300 hover:text-white text-sm font-semibold disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${innovationLoading ? "animate-spin" : ""}`} />Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
            <Download className="w-4 h-4" />Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(["all", "confirmed", "pending", "cancelled", "waitlisted"] as const).map((s) => {
          const count = s === "all" ? innovationApplications.length : innovationApplications.filter((a) => a.status === s).length;
          const cfg = s !== "all" ? statusConfig[s] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? (cfg ? `${cfg.bg} ${cfg.color}` : "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30") : "glass text-slate-400 border-white/10 hover:border-white/20"}`}>
              {count} {s === "all" ? "All" : statusConfig[s].label}
            </button>
          );
        })}
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, start-up, email, reference..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
        </div>
        <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Track ID</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Applicant</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden sm:table-cell">Start-up</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Country</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Excursions</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Fee</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {innovationLoading && !innovationApplications.length ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-500">Loading…</td></tr>
              ) : filtered.map((app) => (
                <tr key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[#C9921A] text-xs font-mono font-bold">{app.trackId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-300 text-xs font-black">{app.firstName[0]}{app.lastName[0]}</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold whitespace-nowrap">{app.salutation} {app.firstName} {app.lastName}</div>
                        <div className="text-slate-500 text-xs truncate max-w-[160px]">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-slate-300 text-sm truncate max-w-[160px]">{app.startupName}</div>
                    <div className="text-slate-500 text-xs">{app.startupStage}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-300 text-sm">{app.country}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400 text-sm">{app.excursionCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className={`text-sm font-bold ${app.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}>
                      USD {app.feeAmount}
                    </div>
                    <div className="text-slate-500 text-xs capitalize">{app.paymentStatus}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(app)} className="p-1.5 rounded-lg glass text-slate-400 hover:text-white transition-colors" title="View / Edit">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Delete application ${app.trackId}?`)) deleteInnovationApplication(app.id); }}
                        className="p-1.5 rounded-lg glass text-slate-600 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!innovationLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Rocket className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No applications match your filters.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <InnovationModal
            app={selected}
            onClose={() => setSelected(null)}
            onUpdate={(id, updates) => {
              updateInnovationApplication(id, updates);
              setSelected((prev) => (prev ? { ...prev, ...updates } : null));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
