"use client";

import { useState } from "react";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

function PaymentCompleteInner() {
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string>("");
  const search = useSearchParams();
  const kind = search.get("kind") ?? "";
  const trace = search.get("trace") ?? "";
  const payerEmail =
    search.get("Ecom_BillTo_Online_Email") ??
    search.get("ecom_billto_online_email") ??
    "";
  const status = search.get("Lite_Payment_Card_Status") ?? search.get("lite_payment_card_status") ?? "";
  const desc =
    search.get("Lite_Result_Description") ?? search.get("lite_result_description") ?? "";

  let title = "Payment";
  let message = "";
  let icon: ReactNode = <AlertTriangle className="w-12 h-12 text-amber-400" />;

  if (kind === "success" || status === "0" || status === "00") {
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
    if (!status && !desc.trim()) {
      message =
        "The secure payment page may not have opened (e.g. blocked popup or network issue), or the session ended before payment. Try again from Registration, use another browser, or pay by bank transfer — we will invoice you by email. If this keeps happening, contact info@tnfzim.com with your registration reference below.";
    } else {
      message =
        "Something went wrong while starting or completing the payment. Please contact info@tnfzim.com with your registration reference, or try again.";
      if (desc.trim()) {
        message += ` Details: ${desc}`;
      }
    }
    icon = <XCircle className="w-12 h-12 text-red-400" />;
  } else {
    title = "Payment status";
    message = "Return to the home page or contact us if you need help completing registration.";
  }

  const canRetry = !!trace && !(kind === "success" || status === "0" || status === "00");

  async function retryPayment() {
    if (!trace || retrying) return;
    setRetryError("");
    setRetrying(true);
    try {
      const res = await fetch("/api/payments/iveri/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: trace, email: payerEmail || undefined }),
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
      setRetryError(data.error || "Could not restart card payment. Please try again in a moment.");
    } catch {
      setRetryError("Could not connect to payment service. Please check your internet and try again.");
    } finally {
      setRetrying(false);
    }
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
        {retryError && (
          <p className="text-xs mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-red-200">
            {retryError}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {canRetry && (
            <button
              type="button"
              onClick={() => void retryPayment()}
              disabled={retrying}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {retrying ? "Opening payment..." : "Try Different Card"}
            </button>
          )}
          <Link href="/" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold">
            Home
          </Link>
          <Link href="/registration" className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm font-semibold">
            Registration
          </Link>
          <Link href="/pay-by-reference" className="btn-outline-gold px-6 py-2.5 rounded-xl text-sm font-semibold">
            Pay by Reference
          </Link>
        </div>
        {canRetry && (
          <p className="text-xs mt-4 text-theme-primary/90">
            On the secure payment page, enter a different card number/expiry/CVV or update the saved card details before submitting.
          </p>
        )}
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
