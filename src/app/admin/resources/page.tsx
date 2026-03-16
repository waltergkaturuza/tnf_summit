"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download, Trash2, ExternalLink, Edit3, FolderOpen,
  Filter, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  fetchAllAttachmentsForAdmin,
  deleteUpdateAttachment,
  updateUpdateAttachment,
} from "@/lib/db";
import type { UpdateAttachment, UpdateAttachmentCategory } from "@/lib/adminData";

const CATEGORY_LABELS: Record<UpdateAttachmentCategory, string> = {
  concept_note: "Concept Note",
  schedule: "Schedule",
  brochure: "Brochure",
  agenda: "Agenda",
  other: "Other",
};

type AttachmentWithUpdate = UpdateAttachment & { updateTitle?: string };

export default function ResourcesPage() {
  const [attachments, setAttachments] = useState<AttachmentWithUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "gallery">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAllAttachmentsForAdmin();
      setAttachments(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = attachments.filter((a) =>
    filter === "gallery" ? a.showInResources : true
  );

  const handleDelete = async (a: AttachmentWithUpdate) => {
    if (!confirm(`Remove "${a.name}" from resources?`)) return;
    await deleteUpdateAttachment(a.id);
    load();
  };

  const handleToggleGallery = async (a: AttachmentWithUpdate) => {
    await updateUpdateAttachment(a.id, { showInResources: !a.showInResources });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-[#C9921A]" />
            Resources & Downloads
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Attachments from Updates & Events. Toggle &quot;Show in Gallery&quot; to control visibility on the Gallery page.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {(["all", "gallery"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              filter === f
                ? "bg-[#C9921A]/15 text-[#F5B730] border-[#C9921A]/30"
                : "glass text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {f === "all" ? "All attachments" : "Gallery resources only"}{" "}
            ({f === "all" ? attachments.length : attachments.filter((a) => a.showInResources).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/5">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 font-medium">No resources yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Add attachments when editing an Update or Event in Updates & News.
          </p>
          <Link
            href="/admin/updates"
            className="inline-flex items-center gap-2 mt-4 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            Go to Updates & News <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <motion.div
              key={a.id}
              layout
              className="glass rounded-xl border border-white/5 p-4 flex flex-wrap items-center gap-4 hover:border-white/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={a.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-[#C9921A] truncate"
                  >
                    {a.name}
                  </a>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-600 text-slate-400">
                    {a.type}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-600 text-slate-400">
                    {CATEGORY_LABELS[a.category]}
                  </span>
                </div>
                {a.updateTitle && (
                  <p className="text-slate-500 text-xs mt-1 truncate">
                    From: {a.updateTitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleGallery(a)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    a.showInResources
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "glass text-slate-500 border border-white/10 hover:border-white/20"
                  }`}
                  title={a.showInResources ? "Shown in Gallery" : "Hidden from Gallery"}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {a.showInResources ? "In Gallery" : "Add to Gallery"}
                </button>
                <Link
                  href={`/admin/updates?edit=${a.updateId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white text-xs font-medium"
                  title="Edit parent update"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
                <a
                  href={a.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass text-slate-400 hover:text-white"
                  title="Open"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(a)}
                  className="p-2 rounded-lg glass text-slate-500 hover:text-red-400"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
