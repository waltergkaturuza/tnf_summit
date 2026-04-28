"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity, RefreshCw, Search, Filter, ChevronDown,
  LogIn, LogOut, UserPlus, Settings, Trash2, Edit3,
  Upload, FileText, CreditCard, Bell, Mic, Globe,
  Newspaper, Paperclip, Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

type AuditEntry = {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  performedBy: string;
  details: Record<string, unknown>;
};

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  login:                   { icon: LogIn,    color: "#10B981", label: "Logged In" },
  logout:                  { icon: LogOut,   color: "#64748b", label: "Logged Out" },
  registration_created:    { icon: UserPlus, color: "#0EA5E9", label: "Registration Created" },
  registration_updated:    { icon: Edit3,    color: "#C9921A", label: "Registration Updated" },
  registration_deleted:    { icon: Trash2,   color: "#EF4444", label: "Registration Deleted" },
  speaker_created:         { icon: Mic,      color: "#0EA5E9", label: "Speaker Added" },
  speaker_updated:         { icon: Edit3,    color: "#C9921A", label: "Speaker Updated" },
  speaker_deleted:         { icon: Trash2,   color: "#EF4444", label: "Speaker Deleted" },
  sponsor_created:         { icon: Globe,    color: "#0EA5E9", label: "Sponsor Added" },
  sponsor_updated:         { icon: Edit3,    color: "#C9921A", label: "Sponsor Updated" },
  sponsor_deleted:         { icon: Trash2,   color: "#EF4444", label: "Sponsor Deleted" },
  message_replied:         { icon: Bell,     color: "#10B981", label: "Message Replied" },
  message_deleted:         { icon: Trash2,   color: "#EF4444", label: "Message Deleted" },
  subscriber_added:        { icon: Bell,     color: "#0EA5E9", label: "Subscriber Added" },
  subscriber_removed:      { icon: Trash2,   color: "#EF4444", label: "Subscriber Removed" },
  media_uploaded:          { icon: Upload,   color: "#8B5CF6", label: "Media Uploaded" },
  media_deleted:           { icon: Trash2,   color: "#EF4444", label: "Media Deleted" },
  invoice_generated:       { icon: FileText, color: "#0EA5E9", label: "Invoice Generated" },
  invoice_marked_paid:     { icon: CreditCard, color: "#10B981", label: "Invoice Marked Paid" },
  payment_updated:         { icon: CreditCard, color: "#C9921A", label: "Payment Updated" },
  settings_updated:        { icon: Settings, color: "#F59E0B", label: "Settings Updated" },
  user_created:            { icon: UserPlus, color: "#0EA5E9", label: "User Added" },
  user_updated:            { icon: Edit3,    color: "#C9921A", label: "User Updated" },
  user_deleted:            { icon: Trash2,   color: "#EF4444", label: "User Removed" },
  update_created:          { icon: Newspaper, color: "#0EA5E9", label: "Update Created" },
  update_updated:          { icon: Edit3,    color: "#C9921A", label: "Update Updated" },
  update_deleted:          { icon: Trash2,    color: "#EF4444", label: "Update Deleted" },
  attachment_created:     { icon: Paperclip, color: "#0EA5E9", label: "Attachment Added" },
  attachment_deleted:     { icon: Trash2,    color: "#EF4444", label: "Attachment Removed" },
  resource_download:      { icon: Download,  color: "#8B5CF6", label: "Resource Downloaded" },
  iveri_gateway_event:    { icon: CreditCard, color: "#C9921A", label: "iVeri gateway (card)" },
};

function getActionCfg(action: string) {
  return ACTION_CONFIG[action] ?? { icon: Activity, color: "#64748b", label: action.replace(/_/g, " ") };
}

export default function AuditTrailPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage]       = useState(0);
  const PAGE_SIZE = 50;

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.schema("tnf_summit").from("audit_trail")
      .select("*").order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (filterAction !== "all") q = q.eq("action", filterAction);
    const { data } = await q;
    setEntries((data ?? []).map((r: Record<string, unknown>) => ({
      id:          r.id as string,
      createdAt:   r.created_at as string,
      action:      r.action as string,
      entityType:  (r.entity_type as string) ?? "",
      entityId:    (r.entity_id as string) ?? "",
      entityLabel: (r.entity_label as string) ?? "",
      performedBy: (r.performed_by as string) ?? "system",
      details:     (r.details as Record<string, unknown>) ?? {},
    })));
    setLoading(false);
  }, [filterAction, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = entries.filter(e =>
    e.performedBy.toLowerCase().includes(search.toLowerCase()) ||
    e.entityLabel.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase())
  );

  const actionGroups = [
    { label: "All Actions", value: "all" },
    { label: "Auth", values: ["login", "logout"] },
    { label: "Registrations", values: ["registration_created", "registration_updated", "registration_deleted"] },
    { label: "Content", values: ["speaker_created", "speaker_updated", "speaker_deleted", "sponsor_created", "sponsor_updated"] },
    { label: "Updates & News", values: ["update_created", "update_updated", "update_deleted", "attachment_created", "attachment_deleted"] },
    { label: "Resources", values: ["resource_download"] },
    { label: "Payments", values: ["invoice_generated", "invoice_marked_paid", "payment_updated"] },
    { label: "Settings & Users", values: ["settings_updated", "user_created", "user_updated", "user_deleted"] },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#C9921A]" /> Audit Trail
          </h1>
          <p className="text-slate-400 text-sm mt-1">System activity log — every admin action recorded</p>
        </div>
        <button onClick={() => load()} className="p-2 glass rounded-xl text-slate-400 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or action…"
            className="w-64 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/50" />
        </div>
        <div className="relative">
          <button onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-white border border-white/10 hover:border-[#C9921A]/30">
            <Filter className="w-4 h-4 text-slate-400" />
            {filterAction === "all" ? "All Actions" : getActionCfg(filterAction).label}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showFilter ? "rotate-180" : ""}`} />
          </button>
          {showFilter && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
              <button onClick={() => { setFilterAction("all"); setShowFilter(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm ${filterAction === "all" ? "text-[#F5B730] bg-[#C9921A]/10" : "text-slate-300 hover:bg-white/5"}`}>
                All Actions
              </button>
              {actionGroups.slice(1).map(g => (
                <div key={g.label}>
                  <p className="px-4 py-1.5 text-slate-600 text-[10px] font-bold uppercase tracking-widest border-t border-white/5">{g.label}</p>
                  {g.values?.map(v => (
                    <button key={v} onClick={() => { setFilterAction(v); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-xs ${filterAction === v ? "text-[#F5B730] bg-[#C9921A]/10" : "text-slate-300 hover:bg-white/5"}`}>
                      {getActionCfg(v).label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No audit entries yet. Actions you perform will appear here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((e, i) => {
            const cfg = getActionCfg(e.action);
            const Icon = cfg.icon;
            return (
              <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.01 }}
                className="flex items-start gap-4 px-5 py-3.5 glass rounded-xl border border-white/3 hover:border-white/8 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${cfg.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">{cfg.label}</span>
                    {e.entityLabel && (
                      <span className="text-slate-400 text-xs">— <span className="text-slate-300">{e.entityLabel}</span></span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-slate-500 text-xs">{e.performedBy}</span>
                    {Object.keys(e.details).length > 0 && (
                      <span className="text-slate-600 text-[10px] font-mono truncate max-w-xs">
                        {JSON.stringify(e.details).slice(0, 80)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-slate-600 text-xs flex-shrink-0 text-right">
                  <div>{format(parseISO(e.createdAt), "d MMM yyyy")}</div>
                  <div>{format(parseISO(e.createdAt), "HH:mm:ss")}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-slate-500 text-sm">Showing {filtered.length} entries</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="px-4 py-2 glass rounded-xl text-sm text-slate-300 hover:text-white disabled:opacity-30">← Previous</button>
          <span className="px-4 py-2 text-slate-400 text-sm">Page {page + 1}</span>
          <button onClick={() => setPage(page + 1)} disabled={entries.length < PAGE_SIZE}
            className="px-4 py-2 glass rounded-xl text-sm text-slate-300 hover:text-white disabled:opacity-30">Next →</button>
        </div>
      </div>
    </div>
  );
}
