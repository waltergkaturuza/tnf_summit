"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Plus, Trash2, CheckCircle, ArrowRight } from "lucide-react";
import { themes } from "@/lib/data";
import { submitAbstractAction, type SubmitAbstractState } from "./actions";

const T_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PARTICIPATION_OPTIONS = [
  { value: "oral", label: "Oral presentation" },
  { value: "poster", label: "Poster" },
  { value: "panel", label: "Panel" },
  { value: "workshop", label: "Workshop" },
  { value: "other", label: "Other" },
] as const;

export default function SubmitAbstractPage() {
  const [state, formAction] = useActionState(submitAbstractAction, { ok: false } as SubmitAbstractState);
  const [coAuthors, setCoAuthors] = useState<{ name: string; email?: string; institution?: string }[]>([]);
  const [abstractText, setAbstractText] = useState("");
  const wordCount = abstractText.trim().split(/\s+/).filter(Boolean).length;

  if (state.ok && state.trackId) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Abstract Submitted</h1>
          <p className="text-slate-400 mb-6">Thank you for submitting your abstract to the TNF Global Summit.</p>
          <div className="glass-gold rounded-2xl p-6 mb-6 text-left">
            <p className="text-slate-400 text-sm mb-2">Your abstract ID</p>
            <p className="text-[#F5B730] font-mono font-bold text-2xl tracking-wide">{state.trackId}</p>
            <p className="text-slate-500 text-xs mt-2">Use this ID to track the status of your submission.</p>
          </div>
          <div className="glass rounded-xl p-4 mb-8 text-left border border-[#C9921A]/20">
            <p className="text-white font-semibold mb-2">Planning to attend the Summit?</p>
            <p className="text-slate-400 text-sm mb-4">Register as a delegate to secure your place and receive updates.</p>
            <Link href="/registration" className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
              Register now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link href="/track-status" className="text-[#C9921A] text-sm font-semibold hover:underline">Track your submission status →</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Call for Abstracts</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">Submit Abstract</h1>
          <p className="text-slate-400">Submit your research or presentation abstract for the TNF Global Summit 2026. Abstracts must be 350–500 words.</p>
        </motion.div>

        <form action={formAction} className="space-y-8">
          <input type="hidden" name="coAuthors" value={JSON.stringify(coAuthors)} />

          {/* Theme */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Theme *</label>
            <select name="themeId" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60">
              <option value="">Select a theme</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Title of abstract *</label>
            <input type="text" name="title" required placeholder="e.g. Inclusive growth and decent work in the digital economy" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
          </div>

          {/* Abstract text */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Abstract (350–500 words) *</label>
            <textarea name="abstractText" required rows={10} placeholder="Enter your abstract text..." value={abstractText} onChange={(e) => setAbstractText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60 resize-y" />
            <p className={`text-xs mt-1 ${wordCount >= 350 && wordCount <= 500 ? "text-emerald-400" : "text-slate-500"}`}>Word count: {wordCount} / 350–500</p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Keywords (comma- or semicolon-separated)</label>
            <input type="text" name="keywords" placeholder="e.g. decent work; digitalisation; investment" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
          </div>

          {/* How to participate */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">How do you want to participate? *</label>
            <select name="participation" defaultValue="oral" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60">
              {PARTICIPATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Document URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Document link (optional)</label>
            <input type="url" name="documentUrl" placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
            <input type="text" name="fileName" placeholder="Document name (e.g. Abstract_Smith.pdf)" className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
          </div>

          {/* Author details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">First name *</label>
              <input type="text" name="firstName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Last name *</label>
              <input type="text" name="lastName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Email *</label>
            <input type="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Phone</label>
            <input type="tel" name="phone" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Institution / Organisation *</label>
            <input type="text" name="institution" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Country *</label>
            <input type="text" name="country" required placeholder="e.g. Zimbabwe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Gender</label>
              <select name="gender" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60">
                <option value="">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Date of birth</label>
              <input type="date" name="dateOfBirth" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60" />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">T-shirt size (for summit kit)</label>
            <select name="tShirtSize" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9921A]/60">
              <option value="">Select</option>
              {T_SHIRT_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Co-authors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold">Co-authors (optional)</label>
              <button type="button" onClick={() => setCoAuthors([...coAuthors, { name: "" }])} className="flex items-center gap-1 text-[#C9921A] text-sm font-semibold hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {coAuthors.map((c, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-start mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <input type="text" placeholder="Name" value={c.name} onChange={(e) => { const n = [...coAuthors]; n[i] = { ...n[i], name: e.target.value }; setCoAuthors(n); }} className="flex-1 min-w-[120px] bg-[var(--bg-primary)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <input type="email" placeholder="Email" value={c.email ?? ""} onChange={(e) => { const n = [...coAuthors]; n[i] = { ...n[i], email: e.target.value || undefined }; setCoAuthors(n); }} className="flex-1 min-w-[120px] bg-[var(--bg-primary)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <input type="text" placeholder="Institution" value={c.institution ?? ""} onChange={(e) => { const n = [...coAuthors]; n[i] = { ...n[i], institution: e.target.value || undefined }; setCoAuthors(n); }} className="flex-1 min-w-[120px] bg-[var(--bg-primary)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <button type="button" onClick={() => setCoAuthors(coAuthors.filter((_, j) => j !== i))} className="p-2 rounded-lg text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {state.error && <p className="text-red-400 text-sm">{state.error}</p>}

          <div className="flex flex-wrap gap-4 items-center pt-4">
            <button type="submit" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Submit abstract
            </button>
            <Link href="/registration" className="text-[#C9921A] text-sm font-semibold hover:underline">I also want to register as a delegate →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
