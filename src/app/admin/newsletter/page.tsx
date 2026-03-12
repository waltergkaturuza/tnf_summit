"use client";

import { useState } from "react";
import { Bell, Search, Download, Trash2, UserX, UserCheck, Mail, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

export default function NewsletterPage() {
  const { subscribers, updateSubscriber, deleteSubscriber } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [addEmail, setAddEmail] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = subscribers.filter(s => {
    const matchQ = !search || s.email.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === "all" || s.status === filter;
    return matchQ && matchF;
  });

  const active = subscribers.filter(s => s.status === "active").length;

  const exportCSV = () => {
    const csv = ["Email,Status,Subscribed At", ...filtered.map(s => `${s.email},${s.status},${new Date(s.subscribedAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tnf_subscribers.csv"; a.click();
  };

  const handleAdd = () => {
    if (!addEmail.includes("@")) return;
    // In production this would call an API
    setAddEmail("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Newsletter Subscribers</h1>
          <p className="text-slate-400 text-sm mt-1">{active} active · {subscribers.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />Add
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 btn-gold px-4 py-2 rounded-xl text-sm font-bold">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[["Active", active, "text-emerald-400"], ["Unsubscribed", subscribers.length - active, "text-slate-400"], ["Total", subscribers.length, "text-[#F5B730]"]].map(([label, count, color]) => (
          <div key={label as string} className="glass rounded-2xl p-4 text-center">
            <div className={`text-3xl font-black ${color}`}>{count}</div>
            <div className="text-slate-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
        </div>
        {(["all", "active", "unsubscribed"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter === f ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30" : "glass text-slate-400 border-white/10 hover:border-white/20"}`}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? subscribers.length : subscribers.filter(s => s.status === f).length})
          </button>
        ))}
      </div>

      {/* Add subscriber inline */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass rounded-xl p-4 flex items-center gap-3 border border-[#C9921A]/20">
            <Mail className="w-4 h-4 text-[#C9921A]" />
            <input type="email" placeholder="Enter email address to add..." value={addEmail} onChange={e => setAddEmail(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none" onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <button onClick={handleAdd} className="px-4 py-1.5 rounded-lg bg-[#C9921A] text-[#0A1628] text-xs font-bold">Add</button>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Email</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3 hidden sm:table-cell">Subscribed</th>
              <th className="text-left text-slate-500 text-xs font-bold uppercase px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-slate-200 text-sm">{sub.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-slate-500 text-xs">
                  {new Date(sub.subscribedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${sub.status === "active" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-slate-400 bg-slate-400/10 border-slate-400/20"}`}>
                    {sub.status === "active" ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => updateSubscriber(sub.id, { status: sub.status === "active" ? "unsubscribed" : "active" })}
                      className={`p-1.5 rounded-lg glass transition-colors ${sub.status === "active" ? "text-slate-600 hover:text-amber-400" : "text-slate-600 hover:text-emerald-400"}`}
                      title={sub.status === "active" ? "Unsubscribe" : "Reactivate"}
                    >
                      {sub.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { if (confirm("Delete subscriber?")) deleteSubscriber(sub.id); }} className="p-1.5 rounded-lg glass text-slate-600 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-slate-500"><Bell className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>No subscribers found.</p></div>}
      </div>
    </div>
  );
}
