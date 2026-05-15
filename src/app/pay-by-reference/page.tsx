"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function PayByReferencePage() {
  const [trackId, setTrackId] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function restartPayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const u = new URL("/api/payments/iveri/start", window.location.origin);
      u.searchParams.set("trackId", trackId.trim().toUpperCase());
      u.searchParams.set("email", email.trim());
      window.location.href = u.toString();
      return;
    } catch {
      setError("Could not connect to the payment service. Please try again.");
      setSubmitting(false);
    } finally {
      // redirect path above leaves page; keep submitting state on success
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PageHeader
        title="Pay by Reference"
        subtitle="Restart card payment with your existing registration or donation track ID."
      />
      <div className="max-w-xl mx-auto px-4 pb-20 pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9921A] text-sm font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass rounded-2xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#C9921A]" />
            Pay by Reference
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter your registration/donation reference and the same email used during submission to restart card payment.
          </p>

          <form onSubmit={(e) => void restartPayment(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Track ID</label>
              <input
                required
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="e.g. TNF-REG-080526-NP2XUX"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm"
              />
            </div>
            {error && (
              <p className="text-xs rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-red-200">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Opening payment..." : "Restart Card Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
