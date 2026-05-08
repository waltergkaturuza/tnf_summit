"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

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
      const res = await fetch("/api/payments/iveri/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: trackId.trim().toUpperCase(),
          email: email.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        redirectUrl?: string;
        action?: string;
        fields?: Record<string, string>;
        error?: string;
      };

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (res.ok && data.action && data.fields) {
        const formEl = document.createElement("form");
        formEl.method = "POST";
        formEl.action = data.action;
        formEl.style.display = "none";
        for (const [name, value] of Object.entries(data.fields)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          formEl.appendChild(input);
        }
        document.body.appendChild(formEl);
        formEl.submit();
        return;
      }
      setError(data.error || "Could not restart payment. Check your details and try again.");
    } catch {
      setError("Could not connect to the payment service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9921A] text-sm font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass rounded-2xl border border-white/10 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#C9921A]" />
            Pay by Reference
          </h1>
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
