"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, CheckCircle, Clock, XCircle, Mic, Mail, Globe, Search, Save } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { Speaker } from "@/lib/adminData";

const statusConfig = {
  confirmed: { label: "Confirmed", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  tentative: { label: "Tentative", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  declined: { label: "Declined", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

const blankSpeaker: Omit<Speaker, "id" | "addedAt"> = {
  name: "", title: "", organisation: "", country: "", bio: "",
  sessionTitle: "", sessionDate: "", sessionType: "", status: "tentative",
  photoUrl: "", email: "",
};

function SpeakerModal({ speaker, onClose, onSave, isNew }: {
  speaker: Omit<Speaker, "id" | "addedAt">;
  onClose: () => void;
  onSave: (data: Omit<Speaker, "id" | "addedAt">) => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState(speaker);
  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60";
  const selectClass = "w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-black text-lg flex items-center gap-2"><Mic className="w-5 h-5 text-[#C9921A]" />{isNew ? "Add Speaker" : "Edit Speaker"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Full Name *</label><input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={inputClass} placeholder="Dr Jane Smith" /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Title / Role *</label><input type="text" value={form.title} onChange={e => set("title", e.target.value)} className={inputClass} placeholder="Director-General, ILO" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Organisation *</label><input type="text" value={form.organisation} onChange={e => set("organisation", e.target.value)} className={inputClass} /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Country</label><input type="text" value={form.country} onChange={e => set("country", e.target.value)} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value as Speaker["status"])} className={selectClass}>
                <option value="tentative">Tentative</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
          <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Session Title</label><input type="text" value={form.sessionTitle} onChange={e => set("sessionTitle", e.target.value)} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Session Date</label><input type="text" value={form.sessionDate} onChange={e => set("sessionDate", e.target.value)} className={inputClass} placeholder="Monday, 21 September 2026" /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Session Type</label>
              <select value={form.sessionType} onChange={e => set("sessionType", e.target.value)} className={selectClass}>
                <option value="">Select type</option>
                {["Keynote", "Plenary", "Special Session", "Panel", "Opening Ceremony", "Other"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Biography</label><textarea rows={4} value={form.bio} onChange={e => set("bio", e.target.value)} className={inputClass + " resize-none"} placeholder="Brief professional biography..." /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave(form)} className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" />{isNew ? "Add Speaker" : "Save Changes"}</button>
            <button onClick={onClose} className="px-5 py-3 rounded-xl glass text-slate-300 hover:text-white text-sm">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SpeakersPage() {
  const { speakers, updateSpeaker, addSpeaker, deleteSpeaker } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = speakers.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || `${s.name} ${s.organisation} ${s.sessionTitle} ${s.country}`.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || s.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Speakers & Panelists</h1>
          <p className="text-slate-400 text-sm mt-1">{speakers.filter(s => s.status === "confirmed").length} confirmed · {speakers.filter(s => s.status === "tentative").length} tentative</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
          <Plus className="w-4 h-4" />Add Speaker
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search speakers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
        </div>
        {(["all", "confirmed", "tentative", "declined"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30" : "glass text-slate-400 border-white/10 hover:border-white/20"}`}>
            {s === "all" ? "All" : statusConfig[s].label} ({s === "all" ? speakers.length : speakers.filter(sp => sp.status === s).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(speaker => {
          const cfg = statusConfig[speaker.status];
          return (
            <motion.div key={speaker.id} layout className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#C9921A]/20 flex items-center justify-center text-[#C9921A] font-black text-lg flex-shrink-0">
                  {speaker.name.split(" ").filter(p => !["Dr", "Prof", "H.E.", "Mr", "Ms", "Mrs", "Hon", "Amb"].includes(p)).map(p => p[0]).slice(0, 2).join("")}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-0.5">{speaker.name}</h3>
              <p className="text-[#C9921A] text-xs mb-0.5">{speaker.title}</p>
              <p className="text-slate-400 text-xs mb-3">{speaker.organisation} · {speaker.country}</p>
              {speaker.sessionTitle && (
                <div className="glass rounded-lg p-2.5 mb-3">
                  <div className="text-slate-500 text-[10px] uppercase mb-0.5">{speaker.sessionType}</div>
                  <div className="text-slate-300 text-xs">{speaker.sessionTitle}</div>
                  {speaker.sessionDate && <div className="text-slate-500 text-[10px] mt-0.5">{speaker.sessionDate}</div>}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(speaker)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-slate-300 hover:text-white text-xs font-semibold"><Edit3 className="w-3 h-3" />Edit</button>
                {speaker.email && <a href={`mailto:${speaker.email}`} className="p-2 rounded-lg glass text-slate-400 hover:text-[#C9921A]"><Mail className="w-3.5 h-3.5" /></a>}
                <button onClick={() => { if (confirm("Remove this speaker?")) deleteSpeaker(speaker.id); }} className="p-2 rounded-lg glass text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Mic className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>No speakers found.</p></div>}

      <AnimatePresence>
        {editing && <SpeakerModal speaker={editing} onClose={() => setEditing(null)} onSave={data => { updateSpeaker(editing.id, data); setEditing(null); }} />}
        {adding && <SpeakerModal speaker={blankSpeaker} isNew onClose={() => setAdding(false)} onSave={data => { addSpeaker(data); setAdding(false); }} />}
      </AnimatePresence>
    </div>
  );
}
