"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Eye, CheckCircle, XCircle,
  Clock, Users, X, Mail, Phone, Globe,
  Trash2, AlertCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { Registration, RegistrationStatus } from "@/lib/adminData";

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

function RegistrationModal({ reg, onClose, onUpdate }: {
  reg: Registration;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Registration>) => void;
}) {
  const [status, setStatus] = useState(reg.status);
  const [notes, setNotes] = useState(reg.adminNotes);
  const [payStatus, setPayStatus] = useState(reg.paymentStatus);

  const save = () => {
    onUpdate(reg.id, { status, adminNotes: notes, paymentStatus: payStatus });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="relative w-full max-w-3xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C9921A]/20 flex items-center justify-center text-[#C9921A] font-black text-lg">
                {reg.firstName[0]}{reg.lastName[0]}
              </div>
              <div>
                <h2 className="text-white font-black text-xl">{reg.salutation} {reg.firstName} {reg.lastName}</h2>
                <p className="text-slate-400 text-sm">{reg.jobTitle} · {reg.organisation}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reg.trackId && <span className="text-[#C9921A] text-sm font-mono font-bold">{reg.trackId}</span>}
            <span className="text-slate-500 text-xs font-mono">{reg.id}</span>
            <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left: details */}
          <div className="space-y-5">
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><a href={`mailto:${reg.email}`} className="text-[#C9921A] hover:underline">{reg.email}</a></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{reg.phone}</span></div>
                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{reg.city}, {reg.country}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Registration Details</h3>
              <div className="space-y-1.5 text-sm">
                {[
                  ["Category", reg.category],
                  ["Attendance", reg.attendanceMode],
                  ["Sector", reg.sector],
                  ["Nationality", reg.nationality],
                  ["Dietary", reg.dietaryRequirements || "None"],
                  ["Accommodation", reg.requiresAccommodation ? "Required" : "Self-arranged"],
                  ["Bilateral Meetings", reg.bilateralMeetings ? "Yes" : "No"],
                  ["Innovation Challenge", reg.applyInnovation ? "Applied" : "No"],
                  ["Registered", new Date(reg.createdAt).toLocaleDateString("en-GB")],
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
                  <div className="text-white font-black text-xl">USD {reg.feeAmount}</div>
                  <div className="text-slate-400 text-xs">{reg.paymentMethod}</div>
                </div>
                <select value={payStatus} onChange={e => setPayStatus(e.target.value as typeof payStatus)}
                  className="bg-[var(--bg-primary)] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: admin controls */}
          <div className="space-y-5">
            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Registration Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(statusConfig) as RegistrationStatus[]).map(s => {
                  const cfg = statusConfig[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s} type="button" onClick={() => setStatus(s)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${status === s ? `${cfg.bg} ${cfg.color} border-opacity-100` : "glass text-slate-400 border-white/10 hover:border-white/20"}`}
                    >
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {reg.sessionInterests && reg.sessionInterests.length > 0 && (
              <div>
                <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Sessions Selected</h3>
                <div className="space-y-1">
                  {reg.sessionInterests.map((s: string) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reg.specialNeeds && (
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1"><AlertCircle className="w-3.5 h-3.5" />Special Requirements</div>
                <p className="text-slate-300 text-xs">{reg.specialNeeds}</p>
              </div>
            )}

            {reg.applyInnovation && reg.startupName && (
              <div className="glass rounded-xl p-3">
                <div className="text-sky-400 text-xs font-bold mb-1">🚀 Innovation Challenge</div>
                <div className="text-white text-xs font-semibold">{reg.startupName}</div>
                <div className="text-slate-400 text-xs">{reg.startupStage}</div>
              </div>
            )}

            <div>
              <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-2">Admin Notes</h3>
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes (not visible to delegate)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60 resize-none" />
            </div>

            <div className="flex gap-2">
              <button onClick={save} className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />Save Changes
              </button>
              <a href={`mailto:${reg.email}`} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass text-slate-300 hover:text-white text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />Email
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RegistrationsPage() {
  const { registrations, updateRegistration, deleteRegistration } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");

  const categories = [...new Set(registrations.map(r => r.category))];

  const filtered = useMemo(() => {
    return registrations
      .filter(r => {
        const q = search.toLowerCase();
        const matchSearch = !q || `${r.firstName} ${r.lastName} ${r.organisation} ${r.email} ${r.country} ${r.id} ${r.trackId ?? ""}`.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchCat = categoryFilter === "all" || r.category === categoryFilter;
        const matchMode = modeFilter === "all" || r.attendanceMode === modeFilter;
        return matchSearch && matchStatus && matchCat && matchMode;
      })
      .sort((a, b) => {
        if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "name") return `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
        return a.status.localeCompare(b.status);
      });
  }, [registrations, search, statusFilter, categoryFilter, modeFilter, sortBy]);

  const exportCSV = () => {
    const headers = ["Track ID", "ID", "Status", "Salutation", "First Name", "Last Name", "Email", "Phone", "Organisation", "Job Title", "Country", "Category", "Attendance", "Fee (USD)", "Payment Status", "Registered"];
    const rows = filtered.map(r => [r.trackId ?? "", r.id, r.status, r.salutation, r.firstName, r.lastName, r.email, r.phone, r.organisation, r.jobTitle, r.country, r.category, r.attendanceMode, r.feeAmount, r.paymentStatus, new Date(r.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tnf_registrations.csv"; a.click();
  };

  const totalRevenue = filtered.filter(r => r.paymentStatus === "paid").reduce((s, r) => s + r.feeAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Registrations</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} of {registrations.length} registrations · USD {totalRevenue.toLocaleString()} confirmed revenue</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {(["all", "confirmed", "pending", "cancelled", "waitlisted"] as const).map(s => {
          const count = s === "all" ? registrations.length : registrations.filter(r => r.status === s).length;
          const cfg = s !== "all" ? statusConfig[s] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? (cfg ? `${cfg.bg} ${cfg.color}` : "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30") : "glass text-slate-400 border-white/10 hover:border-white/20"}`}
            >
              {count} {s === "all" ? "All" : statusConfig[s].label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, org, email, ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
          <option value="all">All Modes</option>
          <option value="in-person">In-Person</option>
          <option value="virtual">Virtual</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Track ID</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Delegate</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden sm:table-cell">Organisation</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Country</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden md:table-cell">Fee</th>
                <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(reg => (
                <tr key={reg.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[#C9921A] text-xs font-mono font-bold">{reg.trackId ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C9921A]/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C9921A] text-xs font-black">{reg.firstName[0]}{reg.lastName[0]}</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold whitespace-nowrap">{reg.salutation} {reg.firstName} {reg.lastName}</div>
                        <div className="text-slate-500 text-xs font-mono">{reg.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-slate-300 text-sm truncate max-w-[160px]">{reg.organisation}</div>
                    <div className="text-slate-500 text-xs">{reg.jobTitle}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-slate-400 text-xs max-w-[140px] truncate">{reg.category.split("/")[0].trim()}</div>
                    <div className="text-slate-600 text-xs capitalize">{reg.attendanceMode}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-300 text-sm">{reg.country}</td>
                  <td className="px-4 py-3"><StatusBadge status={reg.status} /></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className={`text-sm font-bold ${reg.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}>
                      USD {reg.feeAmount}
                    </div>
                    <div className="text-slate-500 text-xs capitalize">{reg.paymentStatus}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                    {new Date(reg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(reg)} className="p-1.5 rounded-lg glass text-slate-400 hover:text-white transition-colors" title="View / Edit">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this registration?")) deleteRegistration(reg.id); }}
                        className="p-1.5 rounded-lg glass text-slate-600 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No registrations match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <RegistrationModal reg={selected} onClose={() => setSelected(null)} onUpdate={(id, updates) => { updateRegistration(id, updates); setSelected(prev => prev ? { ...prev, ...updates } : null); }} />}
      </AnimatePresence>
    </div>
  );
}
