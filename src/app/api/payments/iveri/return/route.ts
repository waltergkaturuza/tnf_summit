import { NextRequest, NextResponse } from "next/server";
import { getIveriApplicationId, queryLiteAuthoriseInfo, type LiteAuthoriseInfoResult } from "@/lib/iveri";
import { logIveriReturnCert } from "@/lib/iveriCertLog";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Full Redirect return handler: iVeri often **POSTs** the result to the merchant URL.
 * Next.js `page.tsx` only allows GET, so this route accepts POST, merges fields, then responds with
 * **HTTP 303 See Other** to `/registration/payment-complete`, that status is expected (redirect after POST),
 * not an error. We **do not** mark `paid` from the return payload alone, we confirm via
 * **AuthoriseInfo.aspx** + `Lite_Merchant_Trace` first.
 */
export const runtime = "nodejs";

/**
 * After return, re-query the gateway; only then set `payment_status: paid` in Supabase.
 * If AuthoriseInfo does not confirm approval, we set `kind=error` and pass the gateway
 * message in `Lite_Result_Description` so the payment-complete page is not a vague failure.
 * AuthoriseInfo runs whenever we have a trace + application id (even if Supabase is unset) for certification logs.
 */
async function verifyAuthoriseInfoAndMarkPaidIfApproved(out: URLSearchParams): Promise<{
  authorise: LiteAuthoriseInfoResult | null;
  dbMarkedPaid: boolean;
  authoriseSkipped?: string;
}> {
  const trace = (out.get("trace") || out.get("Lite_Merchant_Trace") || "").trim();
  if (!trace) {
    return { authorise: null, dbMarkedPaid: false, authoriseSkipped: "missing_trace" };
  }
  const appId = getIveriApplicationId();
  if (!appId) {
    console.error("[api/payments/iveri/return] IVERI_APPLICATION_ID missing; cannot run AuthoriseInfo verification");
    return { authorise: null, dbMarkedPaid: false, authoriseSkipped: "missing_application_id" };
  }
  const info = await queryLiteAuthoriseInfo({
    applicationIdRaw: appId,
    merchantTrace: trace,
  });
  if (!info.approved) {
    console.warn(
      "[api/payments/iveri/return] AuthoriseInfo did not confirm success:",
      info.error || info.cardStatus,
      "http=",
      info.httpStatus
    );
    out.set("kind", "error");
    const err = (info.error || "").trim();
    if (err && !out.get("Lite_Result_Description")?.trim() && !out.get("lite_result_description")?.trim()) {
      out.set("Lite_Result_Description", err.slice(0, 500));
    }
    if (info.cardStatus) {
      out.set("Lite_Payment_Card_Status", info.cardStatus);
    }
    return { authorise: info, dbMarkedPaid: false };
  }
  if (!supabaseAdmin) {
    return { authorise: info, dbMarkedPaid: false, authoriseSkipped: "no_supabase_admin" };
  }
  const paidAt = new Date().toISOString();
  if (trace.startsWith("TNF-DON-")) {
    const { error } = await supabaseAdmin
      .schema("tnf_summit")
      .from("donations")
      .update({ payment_status: "paid", paid_at: paidAt })
      .eq("track_id", trace);
    if (error) {
      console.error("[api/payments/iveri/return] donations payment update:", error.message);
      return { authorise: info, dbMarkedPaid: false };
    }
    return { authorise: info, dbMarkedPaid: true };
  }

  const { error } = await supabaseAdmin
    .schema("tnf_summit")
    .from("registrations")
    .update({ payment_status: "paid" })
    .eq("track_id", trace);
  if (error) {
    console.error("[api/payments/iveri/return] payment_status update:", error.message);
    return { authorise: info, dbMarkedPaid: false };
  }
  return { authorise: info, dbMarkedPaid: true };
}

function paymentCompletePath(out: URLSearchParams): string {
  return out.get("next") === "donate" ? "/donate/payment-complete" : "/registration/payment-complete";
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
      k === "kind" ||
      k === "next"
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
  const tr = (out.get("trace") || "").trim();
  if (!out.get("next") && tr.startsWith("TNF-DON-")) out.set("next", "donate");
  return out;
}

export async function GET(request: NextRequest) {
  const u = new URL(request.url);
  const out = mergeToPaymentCompleteQuery(u, null);
  const v = await verifyAuthoriseInfoAndMarkPaidIfApproved(out);
  logIveriReturnCert({ method: "GET", out, authorise: v.authorise, dbMarkedPaid: v.dbMarkedPaid, authoriseSkipped: v.authoriseSkipped });
  const pathGet = paymentCompletePath(out);
  return NextResponse.redirect(new URL(`${u.origin}${pathGet}?${out.toString()}`), 303);
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
  const v = await verifyAuthoriseInfoAndMarkPaidIfApproved(out);
  logIveriReturnCert({ method: "POST", out, authorise: v.authorise, dbMarkedPaid: v.dbMarkedPaid, authoriseSkipped: v.authoriseSkipped });
  const pathPost = paymentCompletePath(out);
  const dest = new URL(`${u.origin}${pathPost}?${out.toString()}`);

  if (dest.toString().length > 8000) {
    const m = new URLSearchParams();
    m.set("kind", out.get("kind") || "error");
    m.set("trace", out.get("trace") || "");
    const nxt = out.get("next");
    if (nxt) m.set("next", nxt);
    m.set(
      "Lite_Payment_Card_Status",
      out.get("Lite_Payment_Card_Status") || out.get("lite_payment_card_status") || ""
    );
    m.set(
      "Lite_Result_Description",
      (out.get("Lite_Result_Description") || out.get("lite_result_description") || "").slice(0, 500)
    );
    return NextResponse.redirect(new URL(`${u.origin}${pathPost}?${m.toString()}`), 303);
  }

  return NextResponse.redirect(dest, 303);
}
