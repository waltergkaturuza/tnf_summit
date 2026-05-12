"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

function Inner() {
  const search = useSearchParams();
  const kind = search.get("kind") ?? "";
  const trace = search.get("trace") ?? "";
  const status = search.get("Lite_Payment_Card_Status") ?? search.get("lite_payment_card_status") ?? "";
  const desc =
    search.get("Lite_Result_Description") ?? search.get("lite_result_description") ?? "";

  let title = "Payment";
  let message = "";
  let icon: ReactNode = <AlertTriangle className="w-12 h-12 text-amber-400" />;

  if (kind === "success" || status === "0" || status === "00") {
    title = "Thank you for your support";
    message =
      "Your card donation was received successfully. We are grateful for your contribution to the Zimbabwe TNF Global Summit. You may receive confirmation by email, please keep your donation reference.";
    icon = <CheckCircle className="w-12 h-12 text-emerald-400" />;
  } else if (kind === "fail") {
    title = "Payment declined";
    message =
      "The bank or card issuer did not authorise this payment. You can try again with another card or donate via bank transfer on the Donate page.";
    icon = <XCircle className="w-12 h-12 text-red-400" />;
  } else if (kind === "trylater") {
    title = "Please try again";
    message = "The payment service had a temporary issue. Please try again in a few minutes, or use bank transfer.";
    icon = <RefreshCw className="w-12 h-12 text-amber-400" />;
  } else if (kind === "error") {
    title = "Payment could not be completed";
    if (!status && !desc.trim()) {
      message =
        "The secure payment page may not have opened, or the session ended before payment. Try again from the Donate page, use another browser, or pay by bank transfer.";
    } else {
      message =
        "Something went wrong while starting or completing the payment. Please contact info@tnfzim.com with your donation reference, or try again.";
      if (desc.trim()) {
        message += ` Details: ${desc}`;
      }
    }
    icon = <XCircle className="w-12 h-12 text-red-400" />;
  } else {
    title = "Payment status";
    message = "Return to the Donate page or contact us if you need help.";
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
            Donation reference: <span className="text-white font-mono">{trace}</span>
          </p>
        )}
        {(status || desc) && (
          <p className="text-xs text-theme-primary/80 mb-6">
            {status && <>Code: {status} </>}
            {desc && kind !== "error" && <span>{desc}</span>}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold">
            Home
          </Link>
          <Link href="/donate" className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm font-semibold">
            Donate
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

export default function DonatePaymentCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 flex justify-center">
          <p className="text-theme-primary">Loading…</p>
        </div>
      }
    >
      <Inner />
    </Suspense>
  );
}
