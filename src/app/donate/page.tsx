"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, CreditCard, Copy, Check, Building2, Hash, Globe } from "lucide-react";
import { getSetting } from "@/lib/db";

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

export default function DonatePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(PAYMENT_KEYS.map((k) => getSetting(k))).then((vals) => {
      const map: Record<string, string> = {};
      PAYMENT_KEYS.forEach((k, i) => { map[k] = vals[i] ?? ""; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const bankName = settings.payment_bank_name || "";
  const accountName = settings.payment_account_name || "";
  const accountNumber = settings.payment_account_number || "";
  const branchCode = settings.payment_branch_code || "";
  const swift = settings.payment_swift || "";
  const currency = settings.payment_currency || "USD";

  const hasBankDetails = bankName || accountName || accountNumber || swift;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
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
              Your donation helps us deliver inclusive growth, decent work, and investment promotion across Africa. 
              Bank transfer details are below — use your name or organisation as the payment reference.
            </p>
          </div>

          {/* Bank transfer details */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C9921A]" /> Bank Transfer Details
            </h2>

            {loading ? (
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
                <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline">info@tnfzim.com</a> for donation instructions.
              </p>
            )}

            {hasBankDetails && (
              <div className="mt-6 p-4 rounded-xl bg-[#C9921A]/10 border border-[#C9921A]/20">
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong className="text-[#F5B730]">Payment reference:</strong> Include your name or organisation when making the transfer so we can acknowledge your donation. 
                  For international transfers, use the SWIFT code above.
                </p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Questions?{" "}
              <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline font-medium">Contact us</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
