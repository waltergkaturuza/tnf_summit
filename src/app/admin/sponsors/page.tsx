"use client";

import { useState } from "react";
import { Globe, Plus, Edit3, Trash2, X, Save, Star, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Sponsor = {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver" | "partner";
  website: string;
  description: string;
  logoUrl: string;
  contactName: string;
  contactEmail: string;
  status: "confirmed" | "pending" | "negotiating";
  dealValue: string;
  addedAt: string;
};

const initSponsors: Sponsor[] = [
  { id: "SP-001", name: "Reserve Bank of Zimbabwe", tier: "platinum", website: "https://www.rbz.co.zw", description: "Central bank of Zimbabwe — Official Financial Partner", logoUrl: "", contactName: "Dr John Mangudya", contactEmail: "governor@rbz.co.zw", status: "confirmed", dealValue: "USD 50,000", addedAt: "2026-01-15T00:00:00Z" },
  { id: "SP-002", name: "Zimbabwe Investment and Development Agency (ZIDA)", tier: "gold", website: "https://www.zida.gov.zw", description: "Zimbabwe's official investment promotion agency", logoUrl: "", contactName: "Mr Tafadzwa Chinamo", contactEmail: "ceo@zida.gov.zw", status: "confirmed", dealValue: "USD 25,000", addedAt: "2026-01-20T00:00:00Z" },
  { id: "SP-003", name: "FBC Holdings", tier: "gold", website: "https://www.fbc.co.zw", description: "Zimbabwe's leading financial services group", logoUrl: "", contactName: "Mr John Mushayavanhu", contactEmail: "jmushayavanhu@fbc.co.zw", status: "confirmed", dealValue: "USD 20,000", addedAt: "2026-02-01T00:00:00Z" },
  { id: "SP-004", name: "Econet Wireless Zimbabwe", tier: "silver", website: "https://www.econet.co.zw", description: "Zimbabwe's largest mobile network operator", logoUrl: "", contactName: "Mr Douglas Mboweni", contactEmail: "ceo@econet.co.zw", status: "negotiating", dealValue: "USD 15,000", addedAt: "2026-02-10T00:00:00Z" },
  { id: "SP-005", name: "CBZ Holdings", tier: "silver", website: "https://www.cbz.co.zw", description: "Commercial Bank of Zimbabwe — Financial Sector Partner", logoUrl: "", contactName: "Mr Lawrence Nyazema", contactEmail: "ceo@cbz.co.zw", status: "confirmed", dealValue: "USD 10,000", addedAt: "2026-02-15T00:00:00Z" },
];

const tierConfig = {
  platinum: { label: "Platinum", color: "text-slate-200", bg: "bg-slate-300/10 border-slate-300/30", stars: 3 },
  gold: { label: "Gold", color: "text-[#F5B730]", bg: "bg-[#C9921A]/10 border-[#C9921A]/30", stars: 2 },
  silver: { label: "Silver", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30", stars: 1 },
  partner: { label: "Partner", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20", stars: 0 },
};

const statusCfg = {
  confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  negotiating: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const blankSponsor: Omit<Sponsor, "id" | "addedAt"> = {
  name: "", tier: "silver", website: "", description: "", logoUrl: "",
  contactName: "", contactEmail: "", status: "pending", dealValue: "",
};

function SponsorModal({ sponsor, onClose, onSave, isNew }: { sponsor: Omit<Sponsor, "id" | "addedAt">; onClose: () => void; onSave: (d: Omit<Sponsor, "id" | "addedAt">) => void; isNew?: boolean }) {
  const [form, setForm] = useState(sponsor);
  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60";
  const sel = "w-full bg-[#0D1F3C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-xl bg-[#0D1F3C] rounded-2xl border border-white/10 overflow-hidden mb-4">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-black text-lg">{isNew ? "Add Sponsor" : "Edit Sponsor"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Organisation Name *</label><input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={cls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Tier</label>
              <select value={form.tier} onChange={e => set("tier", e.target.value as Sponsor["tier"])} className={sel}>
                {Object.keys(tierConfig).map(t => <option key={t} value={t}>{tierConfig[t as keyof typeof tierConfig].label}</option>)}
              </select>
            </div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value as Sponsor["status"])} className={sel}>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="negotiating">Negotiating</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Website</label><input type="url" value={form.website} onChange={e => set("website", e.target.value)} className={cls} placeholder="https://" /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Deal Value</label><input type="text" value={form.dealValue} onChange={e => set("dealValue", e.target.value)} className={cls} placeholder="USD 10,000" /></div>
          </div>
          <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Description</label><input type="text" value={form.description} onChange={e => set("description", e.target.value)} className={cls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Contact Name</label><input type="text" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={cls} /></div>
            <div><label className="text-slate-400 text-xs font-semibold mb-1.5 block">Contact Email</label><input type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} className={cls} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave(form)} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" />{isNew ? "Add Sponsor" : "Save"}</button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl glass text-slate-300 text-sm">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initSponsors);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [adding, setAdding] = useState(false);

  const totalValue = sponsors.filter(s => s.status === "confirmed").reduce((acc, s) => acc + parseInt(s.dealValue.replace(/[^0-9]/g, "") || "0"), 0);

  const save = (id: string, data: Omit<Sponsor, "id" | "addedAt">) =>
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const add = (data: Omit<Sponsor, "id" | "addedAt">) =>
    setSponsors(prev => [...prev, { ...data, id: `SP-${Date.now()}`, addedAt: new Date().toISOString() }]);
  const del = (id: string) => setSponsors(prev => prev.filter(s => s.id !== id));

  const grouped = Object.keys(tierConfig).reduce((acc, tier) => {
    acc[tier] = sponsors.filter(s => s.tier === tier);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Sponsors & Partners</h1>
          <p className="text-slate-400 text-sm mt-1">{sponsors.filter(s => s.status === "confirmed").length} confirmed · USD {totalValue.toLocaleString()} total value</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"><Plus className="w-4 h-4" />Add Sponsor</button>
      </div>

      {Object.entries(tierConfig).map(([tier, cfg]) => grouped[tier].length > 0 && (
        <div key={tier}>
          <h2 className={`text-sm font-black uppercase mb-3 flex items-center gap-2 ${cfg.color}`}>
            {Array.from({ length: cfg.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            {cfg.label} Sponsors ({grouped[tier].length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[tier].map(sp => (
              <div key={sp.id} className={`glass rounded-2xl p-5 border ${cfg.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-sm">{sp.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{sp.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold border flex-shrink-0 ml-2 ${statusCfg[sp.status]}`}>{sp.status}</span>
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs">
                  {sp.dealValue && <span className={`font-black text-base ${cfg.color}`}>{sp.dealValue}</span>}
                  {sp.website && <a href={sp.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#C9921A] flex items-center gap-1"><ExternalLink className="w-3 h-3" />Website</a>}
                </div>
                <div className="text-slate-500 text-xs border-t border-white/5 pt-2.5">
                  {sp.contactName} · <a href={`mailto:${sp.contactEmail}`} className="text-[#C9921A] hover:underline">{sp.contactEmail}</a>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(sp)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg glass text-slate-300 hover:text-white text-xs font-semibold"><Edit3 className="w-3 h-3" />Edit</button>
                  <button onClick={() => { if (confirm("Remove this sponsor?")) del(sp.id); }} className="p-1.5 rounded-lg glass text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {editing && <SponsorModal sponsor={editing} onClose={() => setEditing(null)} onSave={data => { save(editing.id, data); setEditing(null); }} />}
        {adding && <SponsorModal sponsor={blankSponsor} isNew onClose={() => setAdding(false)} onSave={data => { add(data); setAdding(false); }} />}
      </AnimatePresence>
    </div>
  );
}
