"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Save, Newspaper, Calendar, Image as ImageIcon, Link as LinkIcon, FileDown, Upload, FolderOpen } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import {
  fetchUpdateAttachments,
  insertUpdateAttachment,
  deleteUpdateAttachment,
  insertAuditLog,
} from "@/lib/db";
import { uploadFile, fetchMediaFiles, type MediaFile } from "@/lib/storage";
import type { Update, UpdateType, UpdateAttachment, UpdateAttachmentType, UpdateAttachmentCategory } from "@/lib/adminData";

const UPDATE_CATEGORIES = ["News", "Business", "International Relations", "Social", "Social Justice & Labour Affairs", "Staff", "Events"];

const ATTACHMENT_TYPES: UpdateAttachmentType[] = ["concept_note", "programme", "schedule", "brochure", "press_release", "other"];
const ATTACHMENT_TYPE_LABELS: Record<UpdateAttachmentType, string> = {
  concept_note: "Concept Note",
  programme: "Programme",
  schedule: "Schedule",
  brochure: "Brochure",
  press_release: "Press Release",
  other: "Other",
};
const ATTACHMENT_CATEGORIES: UpdateAttachmentCategory[] = ["documents", "media", "programme", "press", "reports"];
const ATTACHMENT_CATEGORY_LABELS: Record<UpdateAttachmentCategory, string> = {
  documents: "Documents",
  media: "Media",
  programme: "Programme",
  press: "Press",
  reports: "Reports",
};

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
  eventStartAt: null,
  eventEndAt: null,
  eventVenue: "",
  eventCity: "",
  eventCountry: "",
  eventRoom: "",
  registrationType: "none",
  registrationUrl: "",
  registrationPageSlug: "",
  displayOrder: 0,
};

function UpdateModal({
  update,
  updateId,
  onClose,
  onSave,
  isNew,
  notifyOnPublish,
}: {
  update: Omit<Update, "id" | "createdAt" | "updatedAt">;
  updateId?: string;
  onClose: () => void;
  onSave: (data: Omit<Update, "id" | "createdAt" | "updatedAt">, notify: boolean, pendingAttachments?: { name: string; type: UpdateAttachmentType; category: UpdateAttachmentCategory; publicUrl: string; showOnEvent: boolean; showInResources: boolean }[]) => void;
  isNew?: boolean;
  notifyOnPublish?: boolean;
}) {
  const [form, setForm] = useState(update);
  const [notify, setNotify] = useState(!!notifyOnPublish);
  const [attachments, setAttachments] = useState<UpdateAttachment[]>([]);
  const [pendingAttachments, setPendingAttachments] = useState<{ name: string; type: UpdateAttachmentType; category: UpdateAttachmentCategory; publicUrl: string; showOnEvent: boolean; showInResources: boolean }[]>([]);
  const [addingAttachment, setAddingAttachment] = useState(false);
  const [newAtt, setNewAtt] = useState({
    name: "",
    type: "other" as UpdateAttachmentType,
    category: "documents" as UpdateAttachmentCategory,
    publicUrl: "",
    showOnEvent: true,
    showInResources: false,
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAttachments = useCallback(async () => {
    if (!updateId) return;
    const list = await fetchUpdateAttachments(updateId);
    setAttachments(list);
  }, [updateId]);

  useEffect(() => {
    if (updateId) loadAttachments();
  }, [updateId, loadAttachments]);

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
          <div>
            <h2 className="text-white font-black text-lg flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#C9921A]" />
              {isNew ? "New Update or Event" : "Edit Update"}
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              For events, please fill in date/time, venue, registration info and resources.
            </p>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Event start (date &amp; time)
                </label>
                <input
                  type="datetime-local"
                  value={form.eventStartAt ?? ""}
                  onChange={(e) => {
                    const value = e.target.value || null;
                    set("eventStartAt", value);
                    if (!form.eventDate && value) {
                      set("eventDate", value.slice(0, 10));
                    }
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Event end (optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.eventEndAt ?? ""}
                  onChange={(e) => set("eventEndAt", e.target.value || null)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Venue</label>
                <input
                  type="text"
                  value={form.eventVenue ?? ""}
                  onChange={(e) => set("eventVenue", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. ZITF Exhibition Centre"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs font-semibold mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={form.eventCity ?? ""}
                    onChange={(e) => set("eventCity", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Bulawayo"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Country</label>
                  <input
                    type="text"
                    value={form.eventCountry ?? ""}
                    onChange={(e) => set("eventCountry", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Zimbabwe"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Room (optional)</label>
                <input
                  type="text"
                  value={form.eventRoom ?? ""}
                  onChange={(e) => set("eventRoom", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Room A, Plenary Hall"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Registration</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={form.registrationType ?? "none"}
                    onChange={(e) => set("registrationType", e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="none">No registration link</option>
                    <option value="external">External link</option>
                    <option value="internal">Internal page</option>
                  </select>
                  {form.registrationType === "external" && (
                    <input
                      type="url"
                      value={form.registrationUrl ?? ""}
                      onChange={(e) => set("registrationUrl", e.target.value)}
                      className={inputClass}
                      placeholder="Registration URL (https://...)"
                    />
                  )}
                  {form.registrationType === "internal" && (
                    <input
                      type="text"
                      value={form.registrationPageSlug ?? ""}
                      onChange={(e) => set("registrationPageSlug", e.target.value)}
                      className={inputClass}
                      placeholder="Internal path, e.g. /job-skills-summit-2026"
                    />
                  )}
                </div>
              </div>
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

          {/* Attachments (common to news + events) */}
          <div className="border-t border-white/10 pt-4">
            <label className="text-slate-400 text-xs font-semibold mb-2 block flex items-center gap-1">
              <FileDown className="w-3.5 h-3.5" /> Resources & Attachments
            </label>
            <p className="text-slate-500 text-xs mb-3">
              Add concept notes, schedules, brochures. Show on event page and/or in Gallery resources.
            </p>
            {(updateId ? attachments : pendingAttachments).length > 0 && (
                <div className="space-y-2 mb-3">
                  {updateId
                    ? attachments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-2 glass rounded-lg px-3 py-2 text-sm">
                          <div className="min-w-0 flex-1">
                            <span className="text-white font-medium truncate block">{a.name}</span>
                            <span className="text-slate-500 text-xs">{ATTACHMENT_TYPE_LABELS[a.type]} · {ATTACHMENT_CATEGORY_LABELS[a.category]}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {a.showOnEvent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Event</span>}
                            {a.showInResources && <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">Resources</span>}
                            <button type="button" onClick={async () => { if (confirm("Remove this attachment?")) { await deleteUpdateAttachment(a.id); const { data } = await supabase.auth.getSession(); await insertAuditLog("attachment_deleted", { entityType: "attachment", entityId: a.id, entityLabel: a.name, performedBy: data.session?.user?.email ?? "system" }); loadAttachments(); } }} className="p-1 rounded text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    : pendingAttachments.map((a, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 glass rounded-lg px-3 py-2 text-sm">
                          <div className="min-w-0 flex-1">
                            <span className="text-white font-medium truncate block">{a.name}</span>
                            <span className="text-slate-500 text-xs">{ATTACHMENT_TYPE_LABELS[a.type]} · {ATTACHMENT_CATEGORY_LABELS[a.category]}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {a.showOnEvent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Event</span>}
                            {a.showInResources && <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">Resources</span>}
                            <button type="button" onClick={() => setPendingAttachments((p) => p.filter((_, j) => j !== i))} className="p-1 rounded text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              )}
              {addingAttachment ? (
                <div className="glass rounded-xl p-4 space-y-3">
                  <input
                    type="text"
                    value={newAtt.name}
                    onChange={(e) => setNewAtt((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Display name (e.g. Concept Note PDF)"
                  />
                  <div className="space-y-2">
                    <label className="text-slate-500 text-xs block">File or URL</label>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingFile(true);
                          try {
                            const m = await uploadFile(file, "documents", file.name.replace(/\.[^.]+$/, ""), "");
                            setNewAtt((p) => ({ ...p, publicUrl: m.publicUrl, name: p.name || m.originalName }));
                          } catch (err) {
                            console.error(err);
                            alert("Upload failed. Try again or paste URL.");
                          } finally {
                            setUploadingFile(false);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-slate-400 hover:text-white text-sm disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingFile ? "Uploading…" : "Upload file"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMediaPicker(true);
                          fetchMediaFiles().then((f) =>
                            setMediaFiles(f.filter((m) => m.category === "documents" || m.category === "resources"))
                          );
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-slate-400 hover:text-white text-sm"
                      >
                        <FolderOpen className="w-4 h-4" /> Pick from Media Library
                      </button>
                    </div>
                    <input
                      type="url"
                      value={newAtt.publicUrl}
                      onChange={(e) => setNewAtt((p) => ({ ...p, publicUrl: e.target.value }))}
                      className={inputClass}
                      placeholder="Or paste URL (external or from Media Library)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 text-xs mb-1 block">Type</label>
                      <select
                        value={newAtt.type}
                        onChange={(e) => setNewAtt((p) => ({ ...p, type: e.target.value as UpdateAttachmentType }))}
                        className={selectClass}
                      >
                        {ATTACHMENT_TYPES.map((t) => (
                          <option key={t} value={t}>{ATTACHMENT_TYPE_LABELS[t]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs mb-1 block">Category</label>
                      <select
                        value={newAtt.category}
                        onChange={(e) => setNewAtt((p) => ({ ...p, category: e.target.value as UpdateAttachmentCategory }))}
                        className={selectClass}
                      >
                        {ATTACHMENT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{ATTACHMENT_CATEGORY_LABELS[c]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                      <input
                        type="checkbox"
                        checked={newAtt.showOnEvent}
                        onChange={(e) => setNewAtt((p) => ({ ...p, showOnEvent: e.target.checked }))}
                        className="w-3.5 h-3.5 rounded border-white/20"
                      />
                      Show on event page
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                      <input
                        type="checkbox"
                        checked={newAtt.showInResources}
                        onChange={(e) => setNewAtt((p) => ({ ...p, showInResources: e.target.checked }))}
                        className="w-3.5 h-3.5 rounded border-white/20"
                      />
                      Show in Gallery resources
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newAtt.name.trim() || !newAtt.publicUrl.trim()) return;
                        if (updateId) {
                          const created = await insertUpdateAttachment({
                            updateId,
                            name: newAtt.name.trim(),
                            type: newAtt.type,
                            category: newAtt.category,
                            storageBucket: null,
                            storagePath: null,
                            publicUrl: newAtt.publicUrl.trim(),
                            showOnEvent: newAtt.showOnEvent,
                            showInResources: newAtt.showInResources,
                            displayOrder: 0,
                          });
                          const { data } = await supabase.auth.getSession();
                          await insertAuditLog("attachment_created", { entityType: "attachment", entityId: created.id, entityLabel: created.name, performedBy: data.session?.user?.email ?? "system" });
                          loadAttachments();
                        } else {
                          setPendingAttachments((p) => [...p, { ...newAtt, name: newAtt.name.trim(), publicUrl: newAtt.publicUrl.trim() }]);
                        }
                        setNewAtt({ name: "", type: "other", category: "documents", publicUrl: "", showOnEvent: true, showInResources: false });
                        setAddingAttachment(false);
                      }}
                      className="btn-gold px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingAttachment(false);
                        setNewAtt({ name: "", type: "other", category: "documents", publicUrl: "", showOnEvent: true, showInResources: false });
                      }}
                      className="px-4 py-2 rounded-lg glass text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingAttachment(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-slate-400 hover:text-white text-sm"
                >
                  <Plus className="w-4 h-4" /> Add attachment
                </button>
              )}
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
              onClick={() => onSave(form, notify, isNew ? pendingAttachments : undefined)}
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

        {/* Media Library picker modal */}
        <AnimatePresence>
          {showMediaPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/80"
              onClick={() => setShowMediaPicker(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-surface)] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#C9921A]" /> Pick from Media Library
                  </h3>
                  <button onClick={() => setShowMediaPicker(false)} className="p-2 rounded-lg glass text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {mediaFiles.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No documents or resources in Media Library. Upload via Media Library first.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {mediaFiles.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setNewAtt((p) => ({ ...p, publicUrl: f.publicUrl, name: p.name || f.originalName }));
                            setShowMediaPicker(false);
                          }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:border-[#C9921A]/40 border border-white/5 text-left w-full"
                        >
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                            <FileDown className="w-6 h-6 text-slate-500" />
                          </div>
                          <span className="text-xs text-white font-medium truncate w-full">{f.originalName}</span>
                          <span className="text-[10px] text-slate-500">{f.category}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function UpdatesPage() {
  const searchParams = useSearchParams();
  const { updates, updatesLoading, addUpdate, updateUpdate, deleteUpdate, refreshUpdates } = useAdmin();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<Update | null>(null);
  const [adding, setAdding] = useState(false);

  const editId = searchParams.get("edit");
  useEffect(() => {
    if (editId && updates.length > 0) {
      const u = updates.find((x) => x.id === editId);
      if (u) setEditing(u);
    }
  }, [editId, updates]);

  const filtered = updates.filter((u) => {
    if (filter === "published") return u.published;
    if (filter === "draft") return !u.published;
    return true;
  });

  const handleSave = async (
    data: Omit<Update, "id" | "createdAt" | "updatedAt">,
    notify: boolean,
    pendingAttachments?: { name: string; type: import("@/lib/adminData").UpdateAttachmentType; category: import("@/lib/adminData").UpdateAttachmentCategory; publicUrl: string; showOnEvent: boolean; showInResources: boolean }[]
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
        if (pendingAttachments?.length) {
          const { insertUpdateAttachment, insertAuditLog } = await import("@/lib/db");
          const { data: sess } = await supabase.auth.getSession();
          const performedBy = sess.session?.user?.email ?? "system";
          for (const att of pendingAttachments) {
            const inserted = await insertUpdateAttachment({
              updateId: created.id,
              name: att.name,
              type: att.type,
              category: att.category,
              storageBucket: null,
              storagePath: null,
              publicUrl: att.publicUrl,
              showOnEvent: att.showOnEvent,
              showInResources: att.showInResources,
              displayOrder: 0,
            });
            await insertAuditLog("attachment_created", { entityType: "attachment", entityId: inserted.id, entityLabel: inserted.name, performedBy });
          }
        }
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
              eventStartAt: editing.eventStartAt ?? null,
              eventEndAt: editing.eventEndAt ?? null,
              eventVenue: editing.eventVenue ?? "",
              eventCity: editing.eventCity ?? "",
              eventCountry: editing.eventCountry ?? "",
              eventRoom: editing.eventRoom ?? "",
              registrationType: editing.registrationType ?? "none",
              registrationUrl: editing.registrationUrl ?? "",
              registrationPageSlug: editing.registrationPageSlug ?? "",
              displayOrder: editing.displayOrder,
            }}
            updateId={editing.id}
            onClose={() => setEditing(null)}
            onSave={handleSave}
            notifyOnPublish={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
