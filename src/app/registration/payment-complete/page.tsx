"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

function PaymentCompleteInner() {
  const search = useSearchParams();
  const kind = search.get("kind") ?? "";
  const trace = search.get("trace") ?? "";
  const status = search.get("Lite_Payment_Card_Status") ?? search.get("lite_payment_card_status") ?? "";
  const desc =
    search.get("Lite_Result_Description") ?? search.get("lite_result_description") ?? "";

  let title = "Payment";
  let message = "";
  let icon: ReactNode = <AlertTriangle className="w-12 h-12 text-amber-400" />;

  if (kind === "success" || status === "0") {
    title = "Payment successful";
    message =
      "Thank you. Your card payment was submitted successfully. You will receive a confirmation by email. Keep your registration reference for your records.";
    icon = <CheckCircle className="w-12 h-12 text-emerald-400" />;
  } else if (kind === "fail") {
    title = "Payment declined";
    message =
      "The bank or card issuer did not authorise this payment. You can try again with another card or complete payment via bank transfer — we will invoice you by email.";
    icon = <XCircle className="w-12 h-12 text-red-400" />;
  } else if (kind === "trylater") {
    title = "Please try again";
    message =
      "The payment service had a temporary issue. Please try your payment again in a few minutes, or use bank transfer and we will send an invoice.";
    icon = <RefreshCw className="w-12 h-12 text-amber-400" />;
  } else if (kind === "error") {
    title = "Payment could not be completed";
    message =
      "Something went wrong while starting or completing the payment. Please contact info@tnfzim.com with your registration reference, or try again.";
    icon = <XCircle className="w-12 h-12 text-red-400" />;
  } else {
    title = "Payment status";
    message = "Return to the home page or contact us if you need help completing registration.";
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full glass-gold rounded-2xl p-8">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
        <h1 className="text-2xl font-black text-white mb-3">{title}</h1>
        <p className="text-theme-primary text-sm mb-6 leading-relaxed">{message}</p>
        {trace && (
          <p className="text-xs text-theme-primary mb-2">
            Registration reference: <span className="text-white font-mono">{trace}</span>
          </p>
        )}
        {(status || desc) && (
          <p className="text-xs text-theme-primary/80 mb-6">
            {status && <>Code: {status} </>}
            {desc && <span>{desc}</span>}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold">
            Home
          </Link>
          <Link href="/registration" className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm font-semibold">
            Registration
          </Link>
        </div>
        <p className="text-xs mt-8 text-theme-primary">
          Questions?{" "}
          <a href="mailto:info@tnfzim.com" className="text-[#C9921A] underline">
            info@tnfzim.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 flex justify-center">
          <p className="text-theme-primary">Loading…</p>
        </div>
      }
    >
      <PaymentCompleteInner />
    </Suspense>
  );
}
