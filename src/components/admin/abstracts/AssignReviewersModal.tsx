"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import type { Abstract, AbstractReviewer } from "@/lib/adminData";

export default function AssignReviewersModal({
  abstract,
  reviewers,
  assignedReviewerIds,
  onClose,
  onSave,
}: {
  abstract: Abstract;
  reviewers: AbstractReviewer[];
  assignedReviewerIds: string[];
  onClose: () => void;
  onSave: (reviewerIds: string[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>(assignedReviewerIds);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(assignedReviewerIds);
  }, [assignedReviewerIds, abstract.id]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-white/5">
          <div>
            <p className="text-[#C9921A] text-xs font-mono font-bold">{abstract.trackId}</p>
            <h2 className="text-white font-bold text-lg mt-1">Assign reviewers</h2>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{abstract.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg glass text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-2">
          {reviewers.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No reviewers yet. Create reviewer accounts in User Management with role &quot;Reviewer&quot; and their university or institution.
            </p>
          ) : (
            reviewers.map((r) => (
              <label key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(r.id) ? "border-[#C9921A]/40 bg-[#C9921A]/10" : "border-white/10 glass hover:border-white/20"}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => toggle(r.id)}
                  className="mt-1 accent-[#C9921A]"
                />
                <div>
                  <div className="text-white text-sm font-semibold">{r.fullName || r.email}</div>
                  <div className="text-slate-400 text-xs">{r.email}</div>
                  {(r.institution || r.department) && (
                    <div className="text-slate-500 text-xs mt-0.5">{r.institution || r.department}</div>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex gap-2 p-5 border-t border-white/5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass text-slate-300 text-sm">Cancel</button>
          <button onClick={save} disabled={saving || reviewers.length === 0} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50">
            <CheckCircle className="w-4 h-4" />{saving ? "Saving…" : "Save assignment"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
