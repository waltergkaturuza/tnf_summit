import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Full Redirect return handler: iVeri often **POSTs** the result to the merchant URL.
 * Next.js `page.tsx` only allows GET, so this route accepts POST, merges gateway fields, optionally
 * marks the registration **paid** when `Lite_Payment_Card_Status` is approved, then 303-redirects
 * to `/registration/payment-complete`.
 */
export const runtime = "nodejs";

/** When the gateway reports an approved card, mark the registration row as paid (best-effort). */
async function syncRegistrationPaidFromGateway(out: URLSearchParams) {
  const card =
    out.get("Lite_Payment_Card_Status") ||
    out.get("lite_payment_card_status") ||
    "";
  if (card !== "0" && card !== "00") return;
  const trace =
    (out.get("trace") || out.get("Lite_Merchant_Trace") || "").trim();
  if (!trace || !supabaseAdmin) return;
  const { error } = await supabaseAdmin
    .schema("tnf_summit")
    .from("registrations")
    .update({ payment_status: "paid" })
    .eq("track_id", trace);
  if (error) {
    console.error("[api/payments/iveri/return] payment_status update:", error.message);
  }
}

function copyRelevantFormFields(out: URLSearchParams, form: URLSearchParams) {
  form.forEach((v, k) => {
    if (typeof v !== "string" || v.length > 2000) return;
    const lower = k.toLowerCase();
    if (
      lower.startsWith("lite_") ||
      lower.startsWith("ecom_") ||
      lower.startsWith("merchant") ||
      k === "trace" ||
      k === "kind"
    ) {
      out.set(k, v);
    }
  });
}

/**
 * iVeri may send the browser to the "error" or another return URL, but the POST body
 * is authoritative for approval. Prefer card status / result over `kind` in the URL.
 */
function normalizeIveriKind(out: URLSearchParams) {
  const card =
    out.get("Lite_Payment_Card_Status") ||
    out.get("lite_payment_card_status") ||
    out.get("Lite_Payment_CardStatus");
  if (card === "0" || card === "00") {
    out.set("kind", "success");
  }
}

function mergeToPaymentCompleteQuery(requestUrl: URL, form: URLSearchParams | null): URLSearchParams {
  const out = new URLSearchParams();
  new URLSearchParams(requestUrl.search).forEach((v, k) => {
    out.set(k, v);
  });
  if (form) {
    copyRelevantFormFields(out, form);
  }
  let trace = out.get("trace");
  if (!trace && form) {
    trace = form.get("Lite_Merchant_Trace") || form.get("lite_merchant_trace") || "";
    if (trace) out.set("trace", trace);
  }
  if (!out.get("kind") && form) {
    const st = form.get("Lite_Payment_Card_Status") || form.get("lite_payment_card_status");
    if (st === "0" || st === "00") out.set("kind", "success");
  }
  normalizeIveriKind(out);
  return out;
}

export async function GET(request: NextRequest) {
  const u = new URL(request.url);
  const out = mergeToPaymentCompleteQuery(u, null);
  await syncRegistrationPaidFromGateway(out);
  return NextResponse.redirect(
    new URL(`${u.origin}/registration/payment-complete?${out.toString()}`),
    303
  );
}

export async function POST(request: NextRequest) {
  const u = new URL(request.url);
  const ct = request.headers.get("content-type") || "";
  let form: URLSearchParams | null = null;
  try {
    if (ct.includes("multipart/form-data")) {
      const fd = await request.formData();
      form = new URLSearchParams();
      fd.forEach((v, k) => {
        if (typeof v === "string") form!.set(k, v);
      });
    } else {
      const text = await request.text();
      if (text?.trim()) {
        if (ct.includes("application/x-www-form-urlencoded") || !ct.includes("json")) {
          form = new URLSearchParams(text);
        }
      }
    }
  } catch {
    form = null;
  }

  const out = mergeToPaymentCompleteQuery(u, form);
  await syncRegistrationPaidFromGateway(out);
  const dest = new URL(`${u.origin}/registration/payment-complete?${out.toString()}`);

  if (dest.toString().length > 8000) {
    const m = new URLSearchParams();
    m.set("kind", out.get("kind") || "error");
    m.set("trace", out.get("trace") || "");
    m.set(
      "Lite_Payment_Card_Status",
      out.get("Lite_Payment_Card_Status") || out.get("lite_payment_card_status") || ""
    );
    m.set(
      "Lite_Result_Description",
      (out.get("Lite_Result_Description") || out.get("lite_result_description") || "").slice(0, 500)
    );
    return NextResponse.redirect(
      new URL(`${u.origin}/registration/payment-complete?${m.toString()}`),
      303
    );
  }

  return NextResponse.redirect(dest, 303);
}
