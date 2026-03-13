"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Settings, Save, RefreshCw, Calendar, MapPin, Mail,
  CreditCard, Globe, Bell, Shield, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { getSetting, setSetting } from "@/lib/db";
import { logAudit } from "@/lib/audit";

type SettingGroup = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  fields: SettingField[];
};

type SettingField = {
  key: string;
  label: string;
  type: "text" | "email" | "url" | "date" | "number" | "boolean" | "textarea";
  placeholder?: string;
  description?: string;
};

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: "conference", label: "Conference Information", icon: Calendar, color: "#C9921A",
    fields: [
      { key: "conference_name",    label: "Conference Name",  type: "text",  placeholder: "TNF Global Summit…" },
      { key: "conference_theme",   label: "Theme",            type: "text",  placeholder: "Inclusive Growth…" },
      { key: "conference_edition", label: "Edition",          type: "text",  placeholder: "11th" },
      { key: "conference_year",    label: "Year",             type: "text",  placeholder: "2026" },
      { key: "conference_start_date", label: "Start Date",   type: "date" },
      { key: "conference_end_date",   label: "End Date",      type: "date" },
    ],
  },
  {
    id: "venue", label: "Venue Information", icon: MapPin, color: "#0EA5E9",
    fields: [
      { key: "venue_name",    label: "Venue Name",    type: "text",  placeholder: "Elephant Hills Resort" },
      { key: "venue_city",    label: "City",          type: "text",  placeholder: "Victoria Falls" },
      { key: "venue_country", label: "Country",       type: "text",  placeholder: "Zimbabwe" },
      { key: "venue_address", label: "Full Address",  type: "text",  placeholder: "Elephant Hills Drive…" },
    ],
  },
  {
    id: "contact", label: "Contact Information", icon: Mail, color: "#10B981",
    fields: [
      { key: "contact_email",   label: "Contact Email",   type: "email", placeholder: "info@tnfzim.com" },
      { key: "contact_phone",   label: "Phone Number",    type: "text",  placeholder: "+263 242 783 030" },
      { key: "contact_website", label: "Official Website", type: "url",  placeholder: "https://tnfzim.com" },
    ],
  },
  {
    id: "registration", label: "Registration Settings", icon: Shield, color: "#8B5CF6",
    fields: [
      { key: "registration_open",      label: "Registration Open",        type: "boolean", description: "Toggle to open or close registration" },
      { key: "early_bird_deadline",    label: "Early Bird Deadline",      type: "date",    description: "After this date, standard rates apply" },
      { key: "registration_deadline",  label: "Final Registration Date",  type: "date" },
      { key: "max_delegates",          label: "Max Delegates",            type: "number",  placeholder: "2000" },
      { key: "registration_note",      label: "Registration Notice",      type: "textarea", placeholder: "Any special instructions for registrants…" },
    ],
  },
  {
    id: "payment", label: "Payment & Invoice Settings", icon: CreditCard, color: "#F59E0B",
    fields: [
      { key: "payment_currency",      label: "Currency",         type: "text",  placeholder: "USD" },
      { key: "payment_bank_name",     label: "Bank Name",        type: "text",  placeholder: "First Capital Bank Zimbabwe" },
      { key: "payment_account_name",  label: "Account Name",     type: "text",  placeholder: "Tripartite Negotiating Forum" },
      { key: "payment_account_number",label: "Account Number",   type: "text",  placeholder: "••••••••" },
      { key: "payment_swift",         label: "SWIFT / BIC",      type: "text",  placeholder: "FCBAZWHAXXX" },
      { key: "payment_branch_code",   label: "Branch Code",      type: "text",  placeholder: "••••••" },
      { key: "invoice_prefix",        label: "Invoice Number Prefix", type: "text", placeholder: "INV-2026" },
      { key: "vat_rate",              label: "VAT Rate (%)",     type: "number", placeholder: "0" },
      { key: "invoice_footer_note",   label: "Invoice Footer Note", type: "textarea", placeholder: "Thank you for supporting…" },
    ],
  },
  {
    id: "social", label: "Social Media Links", icon: Globe, color: "#EC4899",
    fields: [
      { key: "social_twitter",  label: "X / Twitter", type: "url", placeholder: "https://twitter.com/tnfzim" },
      { key: "social_facebook", label: "Facebook",    type: "url", placeholder: "https://facebook.com/tnfzim" },
      { key: "social_linkedin", label: "LinkedIn",    type: "url", placeholder: "https://linkedin.com/company/tnfzim" },
      { key: "social_youtube",  label: "YouTube",     type: "url", placeholder: "https://youtube.com/@tnfzim" },
    ],
  },
  {
    id: "toggles", label: "Page Visibility", icon: Bell, color: "#64748b",
    fields: [
      { key: "show_speakers_page", label: "Show Speakers Page",  type: "boolean" },
      { key: "show_program_page",  label: "Show Programme Page", type: "boolean" },
      { key: "show_sponsors_page", label: "Show Sponsors Page",  type: "boolean" },
      { key: "show_gallery_page",  label: "Show Gallery Page",   type: "boolean" },
      { key: "maintenance_mode",   label: "Maintenance Mode",    type: "boolean", description: "Warning: puts the site in maintenance mode for public visitors" },
      { key: "announcement_banner",label: "Announcement Banner", type: "textarea", placeholder: "Leave blank to hide the banner. E.g. 'Registration closes 10 Sep 2026'" },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [saved, setSaved]     = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["conference"]));

  const allKeys = SETTING_GROUPS.flatMap(g => g.fields.map(f => f.key));

  const load = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(allKeys.map(k => getSetting(k)));
    const map: Record<string, string> = {};
    allKeys.forEach((k, i) => { map[k] = results[i] ?? ""; });
    setValues(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaveGroup = async (group: SettingGroup) => {
    setSaving(group.id);
    setError(null);
    try {
      await Promise.all(group.fields.map(f => setSetting(f.key, values[f.key] ?? "")));
      await logAudit("settings_updated", "site_settings", group.label, "", { group: group.id });
      setSaved(group.id);
      setTimeout(() => setSaved(null), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(null);
    }
  };

  const toggle = (id: string) => setOpenGroups(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 pb-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C9921A]" /> Site Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure global site settings and conference information</p>
        </div>
        <button onClick={load} className="p-2 glass rounded-xl text-slate-400 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Setting groups */}
      {SETTING_GROUPS.map(group => {
        const Icon = group.icon;
        const isOpen = openGroups.has(group.id);
        const isSaving = saving === group.id;
        const isSaved  = saved === group.id;

        return (
          <div key={group.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
            {/* Group header */}
            <button onClick={() => toggle(group.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${group.color}20` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: group.color }} />
                </div>
                <span className="text-white font-bold">{group.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {isSaved && (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />Saved
                  </span>
                )}
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Fields */}
            {isOpen && (
              <div className="px-6 pb-6 border-t border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {group.fields.map(field => {
                    const val = values[field.key] ?? "";
                    const isBool = field.type === "boolean";
                    const isTextarea = field.type === "textarea";
                    const isWide = isTextarea || field.key === "conference_name" || field.key === "venue_address";

                    return (
                      <div key={field.key} className={isWide ? "sm:col-span-2" : ""}>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                          {field.label}
                          {field.description && <span className="normal-case text-slate-600 ml-2 font-normal">— {field.description}</span>}
                        </label>
                        {isBool ? (
                          <button onClick={() => setValues(v => ({ ...v, [field.key]: val === "true" ? "false" : "true" }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                              val === "true"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "glass border-white/10 text-slate-400 hover:text-white"
                            }`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${val === "true" ? "border-emerald-400 bg-emerald-400" : "border-slate-500"}`}>
                              {val === "true" && <div className="w-1.5 h-1.5 rounded-full bg-[#0A1628]" />}
                            </div>
                            {val === "true" ? "Enabled" : "Disabled"}
                          </button>
                        ) : isTextarea ? (
                          <textarea rows={3} value={val}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60 resize-none" />
                        ) : (
                          <input type={field.type === "url" ? "text" : field.type}
                            value={val}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-center justify-end gap-3">
                  {isSaved && (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" />Changes saved successfully
                    </span>
                  )}
                  <button onClick={() => handleSaveGroup(group)} disabled={isSaving}
                    className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                    {isSaving
                      ? <><div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />Saving…</>
                      : <><Save className="w-4 h-4" />Save {group.label}</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
