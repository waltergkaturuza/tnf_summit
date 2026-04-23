"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Eye, X, Mail, Phone, Building, Clock, CheckCircle, Send, Trash2, Filter } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { ContactMessage } from "@/lib/adminData";

const statusConfig = {
  unread: { label: "Unread", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  read: { label: "Read", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20" },
  replied: { label: "Replied", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
};

const enquiryColors: Record<string, string> = {
  "Sponsorship / Partnership": "text-amber-400",
  "Speaker / Panelist": "text-sky-400",
  "Media Accreditation": "text-purple-400",
  "Group Registration": "text-emerald-400",
  "Bilateral Meeting Request": "text-blue-400",
  "General Enquiry": "text-slate-400",
};

function MessageModal({ msg, onClose, onUpdate }: {
  msg: ContactMessage;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ContactMessage>) => void;
}) {
  const [reply, setReply] = useState(msg.adminReply);
  const [status, setStatus] = useState(msg.status);

  const save = (newStatus: ContactMessage["status"]) => {
    onUpdate(msg.id, { status: newStatus, adminReply: reply });
    setStatus(newStatus);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-white font-black text-lg">{msg.name}</h2>
            <span className={`text-xs font-bold ${enquiryColors[msg.enquiryType] || "text-slate-400"}`}>{msg.enquiryType}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Sender info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><a href={`mailto:${msg.email}`} className="text-[#C9921A]">{msg.email}</a></div>
            {msg.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{msg.phone}</span></div>}
            {msg.organisation && <div className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-300">{msg.organisation}</span></div>}
            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-500" /><span className="text-slate-400 text-xs">{new Date(msg.createdAt).toLocaleString("en-GB")}</span></div>
          </div>

          {/* Message */}
          <div>
            <label className="text-slate-400 text-xs font-semibold uppercase mb-2 block">Message</label>
            <div className="glass rounded-xl p-4 text-slate-300 text-sm leading-relaxed">{msg.message}</div>
          </div>

          {/* Reply */}
          <div>
            <label className="text-slate-400 text-xs font-semibold uppercase mb-2 block">Admin Reply / Notes</label>
            <textarea rows={4} value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply or internal notes..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60 resize-none" />
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={() => { save("replied"); onClose(); }} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />Mark Replied & Save
            </button>
            <button onClick={() => { save("read"); onClose(); }} className="px-4 py-2.5 rounded-xl glass text-slate-300 hover:text-white text-sm font-semibold">Mark Read</button>
            <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.enquiryType)} — Zimbabwe TNF Global Summit 2026`} className="px-4 py-2.5 rounded-xl glass text-[#C9921A] hover:text-[#F5B730] text-sm font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />Email
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MessagesPage() {
  const { messages, updateMessage, deleteMessage } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || `${m.name} ${m.email} ${m.organisation} ${m.enquiryType} ${m.message}`.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || m.status === statusFilter;
    return matchQ && matchS;
  });

  const openMessage = (msg: ContactMessage) => {
    if (msg.status === "unread") updateMessage(msg.id, { status: "read" });
    setSelected(msg);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Messages & Enquiries</h1>
        <p className="text-slate-400 text-sm mt-1">{messages.filter(m => m.status === "unread").length} unread · {messages.length} total</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
        </div>
        {(["all", "unread", "read", "replied"] as const).map(s => {
          const count = s === "all" ? messages.length : messages.filter(m => m.status === s).length;
          const cfg = s !== "all" ? statusConfig[s] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? (cfg ? `${cfg.bg} ${cfg.color}` : "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30") : "glass text-slate-400 border-white/10 hover:border-white/20"}`}>
              {count} {s === "all" ? "All" : cfg!.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map(msg => {
          const cfg = statusConfig[msg.status];
          return (
            <motion.div key={msg.id} layout
              className={`glass rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all cursor-pointer ${msg.status === "unread" ? "border-l-2 border-l-red-400" : ""}`}
              onClick={() => openMessage(msg)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9921A]/15 flex items-center justify-center flex-shrink-0 text-[#C9921A] font-black text-sm">
                  {msg.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-white font-bold text-sm ${msg.status === "unread" ? "font-black" : ""}`}>{msg.name}</span>
                    <span className={`text-xs font-bold ${enquiryColors[msg.enquiryType] || "text-slate-400"}`}>{msg.enquiryType}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ml-auto ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                  </div>
                  <div className="text-slate-400 text-xs mb-1">{msg.organisation} · {msg.email}</div>
                  <p className="text-slate-500 text-xs truncate">{msg.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-600 text-xs whitespace-nowrap hidden sm:block">{new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  <button onClick={e => { e.stopPropagation(); if (confirm("Delete this message?")) deleteMessage(msg.id); }} className="p-1.5 rounded-lg glass text-slate-600 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>No messages found.</p></div>}
      </div>

      <AnimatePresence>
        {selected && <MessageModal msg={selected} onClose={() => setSelected(null)} onUpdate={(id, updates) => { updateMessage(id, updates); setSelected(prev => prev ? { ...prev, ...updates } : null); }} />}
      </AnimatePresence>
    </div>
  );
}
