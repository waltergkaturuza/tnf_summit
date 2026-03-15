"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Save, Newspaper, Calendar, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import type { Update, UpdateType } from "@/lib/adminData";

const UPDATE_CATEGORIES = ["News", "Business", "International Relations", "Social", "Social Justice & Labour Affairs", "Staff", "Events"];

const blankUpdate: Omit<Update, "id" | "createdAt" | "updatedAt"> = {
  type: "news",
  category: "News",
  title: "",
  description: "",
  link: "",
  imageUrl: "",
  published: false,
  publishedAt: null,
  eventDate: null,
  displayOrder: 0,
};

function UpdateModal({
  update,
  onClose,
  onSave,
  isNew,
  notifyOnPublish,
}: {
  update: Omit<Update, "id" | "createdAt" | "updatedAt">;
  onClose: () => void;
  onSave: (data: Omit<Update, "id" | "createdAt" | "updatedAt">, notify: boolean) => void;
  isNew?: boolean;
  notifyOnPublish?: boolean;
}) {
  const [form, setForm] = useState(update);
  const [notify, setNotify] = useState(!!notifyOnPublish);
  const set = (k: keyof typeof form, v: string | number | boolean | null) =>
    setForm((prev) => ({ ...prev, [k]: v }));
  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60";
  const selectClass =
    "w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden mb-4"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#C9921A]" />
            {isNew ? "New Update or Event" : "Edit Update"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as UpdateType)} className={selectClass}>
                <option value="news">News</option>
                <option value="event">Upcoming Event</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={selectClass}>
                {UPDATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
              placeholder="e.g. New keynote speaker announced"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass + " resize-none"}
              placeholder="Brief description or full content..."
            />
          </div>
          {form.type === "event" && (
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Event date
              </label>
              <input
                type="date"
                value={form.eventDate ?? ""}
                onChange={(e) => set("eventDate", e.target.value || null)}
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5" /> Link (optional)
            </label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Image URL (optional)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              className={inputClass}
              placeholder="https://... or paste from Media Library"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9921A] focus:ring-[#C9921A]"
              />
              <span className="text-slate-300 text-sm font-medium">Publish (visible on Updates & News page)</span>
            </label>
          </div>
          {form.published && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-slate-300 text-sm">Notify newsletter subscribers when saving</span>
              </label>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onSave(form, notify)}
              className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isNew ? "Create" : "Save"}
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-xl glass text-slate-300 hover:text-white text-sm">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function UpdatesPage() {
  const { updates, updatesLoading, addUpdate, updateUpdate, deleteUpdate, refreshUpdates } = useAdmin();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<Update | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = updates.filter((u) => {
    if (filter === "published") return u.published;
    if (filter === "draft") return !u.published;
    return true;
  });

  const handleSave = async (
    data: Omit<Update, "id" | "createdAt" | "updatedAt">,
    notify: boolean
  ) => {
    try {
      if (editing) {
        await updateUpdate(editing.id, data);
        if (data.published && notify) {
          const { data: sess } = await supabase.auth.getSession();
          await fetch("/api/notify-subscribers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(sess?.session?.access_token && { Authorization: `Bearer ${sess.session.access_token}` }),
            },
            body: JSON.stringify({ updateId: editing.id, title: data.title, description: data.description, link: data.link }),
          }).catch((e) => console.warn("Notify failed:", e));
        }
        setEditing(null);
      } else {
        const created = await addUpdate(data);
        if (data.published && notify) {
          const { data: sess } = await supabase.auth.getSession();
          await fetch("/api/notify-subscribers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(sess?.session?.access_token && { Authorization: `Bearer ${sess.session.access_token}` }),
            },
            body: JSON.stringify({ updateId: created.id, title: data.title, description: data.description, link: data.link }),
          }).catch((e) => console.warn("Notify failed:", e));
        }
        setAdding(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Updates & News</h1>
          <p className="text-slate-400 text-sm mt-1">
            {updates.filter((u) => u.published).length} published · {updates.filter((u) => !u.published).length} draft
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          <Plus className="w-4 h-4" /> New Update
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              filter === f ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30" : "glass text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {f === "all" ? "All" : f === "published" ? "Published" : "Draft"}{" "}
            ({f === "all" ? updates.length : updates.filter((u) => (f === "published" ? u.published : !u.published)).length})
          </button>
        ))}
      </div>

      {updatesLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <motion.div
              key={u.id}
              layout
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all"
            >
              {u.imageUrl ? (
                <div className="aspect-video bg-white/5 relative">
                  <img src={u.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-[#C9921A]/10 flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-[#C9921A]/50" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      u.type === "event" ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"
                    }`}
                  >
                    {u.type === "event" ? "Event" : "News"}
                  </span>
                  {u.published ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400">
                      Published
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-500/20 text-slate-400">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-1">{u.title}</h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-2">{u.description || "—"}</p>
                {u.eventDate && (
                  <p className="text-[#C9921A] text-xs mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(u.eventDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(u)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this update?")) deleteUpdate(u.id);
                    }}
                    className="p-2 rounded-lg glass text-slate-600 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!updatesLoading && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Newspaper className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No updates yet. Create one to get started.</p>
        </div>
      )}

      <AnimatePresence>
        {adding && (
          <UpdateModal
            update={blankUpdate}
            onClose={() => setAdding(false)}
            onSave={handleSave}
            isNew
            notifyOnPublish
          />
        )}
        {editing && (
          <UpdateModal
            update={{
              type: editing.type,
              category: editing.category,
              title: editing.title,
              description: editing.description,
              link: editing.link,
              imageUrl: editing.imageUrl,
              published: editing.published,
              publishedAt: editing.publishedAt,
              eventDate: editing.eventDate,
              displayOrder: editing.displayOrder,
            }}
            onClose={() => setEditing(null)}
            onSave={handleSave}
            notifyOnPublish={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
