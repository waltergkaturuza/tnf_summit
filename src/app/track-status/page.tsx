"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, FileText, User, ArrowRight, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getTrackStatus } from "@/lib/db";

export default function TrackStatusPage() {
  const { t } = useLanguage();
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ trackType: string; status: string; titleOrName: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = trackId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await getTrackStatus(id);
      if (res) setResult({ trackType: res.trackType, status: res.status, titleOrName: res.titleOrName });
      else setError(t.trackStatus.errorNotFound);
    } catch {
      setError(t.trackStatus.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">{t.trackStatus.heroTitle}</h1>
          <p className="text-slate-400">{t.trackStatus.heroSub}</p>
        </motion.div>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder={t.trackStatus.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60 font-mono text-sm"
              />
            </div>
            <button type="submit" disabled={loading || !trackId.trim()} className="btn-gold px-6 py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? t.trackStatus.buttonChecking : t.trackStatus.buttonLookup}
            </button>
          </div>
        </motion.form>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {result.trackType === "abstract" ? (
                  <div className="w-12 h-12 rounded-xl bg-[#C9921A]/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#C9921A]" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-400" />
                  </div>
                )}
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">{result.trackType === "abstract" ? t.trackStatus.abstractLabel : t.trackStatus.registrationLabel}</p>
                  <p className="text-white font-bold">{result.titleOrName || "—"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-white/5">
                <span className="text-slate-400">{t.trackStatus.statusLabel}</span>
                <span className={`font-bold ${result.status === "confirmed" || result.status === "accepted" ? "text-emerald-400" : result.status === "rejected" || result.status === "cancelled" ? "text-red-400" : "text-amber-400"}`}>
                  {t.trackStatus.statusLabels[result.status] ?? result.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-center text-slate-500 text-sm mt-8">
          {t.trackStatus.lostIdContact} <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline">info@tnfzim.com</a> with your name and email.
        </p>
        <div className="text-center mt-6">
          <Link href="/registration" className="inline-flex items-center gap-2 text-[#C9921A] font-semibold hover:underline">
            {t.trackStatus.registerLink} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
