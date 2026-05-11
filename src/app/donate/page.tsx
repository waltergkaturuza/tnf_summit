"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, CreditCard, Copy, Check, Building2, Hash, Globe, Loader2 } from "lucide-react";
import { getSetting } from "@/lib/db";
import { donationCategories, themes } from "@/lib/data";

const PAYMENT_KEYS = [
  "payment_bank_name",
  "payment_account_name",
  "payment_account_number",
  "payment_branch_code",
  "payment_swift",
  "payment_currency",
] as const;

function CopyField({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 glass rounded-xl px-4 py-3 border border-white/10">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
        <div>
          <h4 className="text-white font-semibold text-sm">{label}</h4>
          <p className="text-theme-primary text-sm font-mono truncate">{value}</p>
        </div>
      </div>
      <button onClick={copy} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-[#C9921A] transition-colors flex-shrink-0">
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

type DonorType = "individual" | "organisation";

export default function DonatePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [donorType, setDonorType] = useState<DonorType>("individual");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [categoryKey, setCategoryKey] = useState(donationCategories[0]?.key ?? "general");
  const [themeId, setThemeId] = useState("");
  const [categoryOther, setCategoryOther] = useState("");
  const [amountUsd, setAmountUsd] = useState<string>("");
  const [message, setMessage] = useState("");

  const [cardSubmitting, setCardSubmitting] = useState(false);
  const [iveriRedirecting, setIveriRedirecting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all(PAYMENT_KEYS.map((k) => getSetting(k))).then((vals) => {
      const map: Record<string, string> = {};
      PAYMENT_KEYS.forEach((k, i) => {
        map[k] = vals[i] ?? "";
      });
      setSettings(map);
      setLoadingSettings(false);
    });
  }, []);

  const bankName = settings.payment_bank_name || "";
  const accountName = settings.payment_account_name || "";
  const accountNumber = settings.payment_account_number || "";
  const branchCode = settings.payment_branch_code || "";
  const swift = settings.payment_swift || "";
  const currency = settings.payment_currency || "USD";

  const hasBankDetails = bankName || accountName || accountNumber || swift;

  async function submitCardDonation(e: React.FormEvent) {
    e.preventDefault();
    setCardError(null);
    setCardSubmitting(true);
    try {
      const amt = Number(amountUsd);
      if (!Number.isFinite(amt) || amt < 1) {
        setCardError("Enter a valid amount in USD (minimum 1).");
        setCardSubmitting(false);
        return;
      }
      if (categoryKey === "global_themes_fund" && !themeId) {
        setCardError("Please select a Summit theme.");
        setCardSubmitting(false);
        return;
      }
      if (categoryKey === "other" && !categoryOther.trim()) {
        setCardError("Please provide your donation category under Other.");
        setCardSubmitting(false);
        return;
      }

      const createRes = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorType,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          organisation: organisation.trim(),
          email: email.trim(),
          phone: phone.trim(),
          categoryKey,
          themeId: themeId || undefined,
          categoryOther: categoryOther.trim(),
          amountUsd: amt,
          message: message.trim(),
        }),
      });
      const createJson = (await createRes.json().catch(() => ({}))) as { error?: string; trackId?: string };
      if (!createRes.ok) {
        throw new Error(createJson.error || "Could not start donation.");
      }
      const trackId = createJson.trackId;
      if (!trackId) throw new Error("No reference returned.");

      setIveriRedirecting(true);
      const payRes = await fetch("/api/payments/iveri/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      const payData = (await payRes.json().catch(() => ({}))) as {
        redirectUrl?: string;
        action?: string;
        fields?: Record<string, string>;
        error?: string;
      };
      if (payRes.ok && payData.redirectUrl) {
        window.location.href = payData.redirectUrl;
        return;
      }
      if (payRes.ok && payData.action && payData.fields) {
        const formEl = document.createElement("form");
        formEl.method = "POST";
        formEl.action = payData.action;
        formEl.style.display = "none";
        for (const [name, value] of Object.entries(payData.fields)) {
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
      setCardError(payData.error || "Secure checkout could not start. Try bank transfer or try again later.");
    } catch (err: unknown) {
      setCardError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCardSubmitting(false);
      setIveriRedirecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4">
      {iveriRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm">
          <div className="w-12 h-12 border-2 border-[#d49a26] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold">Redirecting to secure card payment…</p>
          <p className="text-sm text-theme-primary mt-2 max-w-sm text-center">You are being sent to our payment partner. Do not close this window.</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9921A] text-sm font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9921A]/20 border border-[#C9921A]/30 mb-6">
              <Heart className="w-8 h-8 text-[#C9921A]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Support the Zimbabwe TNF Global Summit</h1>
            <p className="text-theme-primary max-w-2xl mx-auto">
              Your donation helps us deliver inclusive growth, decent work, and investment promotion. Choose an amount and category below to pay by card, or use bank transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Card donation — short form */}
            <div className="glass rounded-2xl p-6 border border-white/10 xl:col-span-2">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d49a26]" /> Donate by card
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Choose your USD amount — there is no fixed fee. The charge matches what you enter (subject to our payment partner&apos;s limits).
            </p>

            <form onSubmit={(e) => void submitCardDonation(e)} className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === "individual"}
                    onChange={() => setDonorType("individual")}
                    className="accent-[#d49a26]"
                  />
                  Individual
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === "organisation"}
                    onChange={() => setDonorType("organisation")}
                    className="accent-[#d49a26]"
                  />
                  Organisation
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First name</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last name</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              </div>

              {donorType === "organisation" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Organisation</label>
                  <input
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone (optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                <select
                  value={categoryKey}
                  onChange={(e) => {
                    const next = e.target.value;
                    setCategoryKey(next);
                    if (next !== "global_themes_fund") setThemeId("");
                    if (next !== "other") setCategoryOther("");
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                >
                  {donationCategories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {donationCategories.find((c) => c.key === categoryKey)?.description}
                </p>
              </div>
              {categoryKey === "global_themes_fund" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select theme</label>
                  <select
                    required
                    value={themeId}
                    onChange={(e) => setThemeId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  >
                    <option value="">Choose a theme</option>
                    {themes.map((th) => (
                      <option key={th.id} value={th.id}>
                        Theme {th.id}: {th.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {categoryKey === "other" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Other category</label>
                  <input
                    required
                    value={categoryOther}
                    onChange={(e) => setCategoryOther(e.target.value)}
                    placeholder="Enter donation category"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (USD)</label>
                <input
                  required
                  type="number"
                  min={1}
                  step="0.01"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40 resize-y min-h-[72px]"
                />
              </div>

              {cardError && (
                <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">{cardError}</div>
              )}

              <button
                type="submit"
                disabled={cardSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-[#1a2b44] bg-[#d49a26] hover:bg-[#e0a82e] transition-colors disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-black/20"
              >
                {cardSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Please wait…
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current" /> Donate with card
                  </>
                )}
              </button>
            </form>
            </div>

            {/* Bank transfer details (side panel on desktop) */}
            <aside className="glass rounded-2xl p-6 border border-white/10 xl:sticky xl:top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9921A]" /> Bank transfer
              </h2>

              {loadingSettings ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
                </div>
              ) : hasBankDetails ? (
                <div className="space-y-3">
                  <CopyField label="Bank Name" value={bankName} icon={Building2} />
                  <CopyField label="Account Name" value={accountName} icon={CreditCard} />
                  <CopyField label="Account Number" value={accountNumber} icon={Hash} />
                  <CopyField label="Branch Code" value={branchCode} icon={Hash} />
                  <CopyField label="SWIFT / BIC" value={swift} icon={Globe} />
                  <div className="glass rounded-xl px-4 py-3 border border-white/10">
                    <h4 className="text-white font-semibold text-sm">Currency</h4>
                    <p className="text-theme-primary text-sm font-mono">{currency}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-4">
                  Bank details are being configured. Please contact{" "}
                  <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline">
                    info@tnfzim.com
                  </a>{" "}
                  for donation instructions.
                </p>
              )}

              {hasBankDetails && (
                <div className="mt-6 p-4 rounded-xl bg-[#C9921A]/10 border border-[#C9921A]/20">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-[#F5B730]">Payment reference:</strong> Include your name or organisation when making the transfer so we can acknowledge your donation. For international transfers, use the SWIFT code above.
                  </p>
                </div>
              )}
            </aside>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Questions?{" "}
              <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline font-medium">
                Contact us
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
