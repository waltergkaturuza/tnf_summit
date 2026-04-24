import { NextRequest, NextResponse } from "next/server";

/**
 * iVeri often POSTs the payment result back to the merchant return URL. Next.js
 * `page.tsx` only handles GET, so a POST to `/registration/payment-complete` returns 405.
 * Return URLs in `iveri.ts` point here; we 303-redirect to the public page with merged query.
 */
export const runtime = "nodejs";

function mergeToPaymentCompleteQuery(requestUrl: URL, form: URLSearchParams | null): URLSearchParams {
  const out = new URLSearchParams();
  new URLSearchParams(requestUrl.search).forEach((v, k) => {
    out.set(k, v);
  });
  if (form) {
    form.forEach((v, k) => {
      if (typeof v !== "string" || v.length > 2000) return;
      if (/^(Lite_|Ecom_|Merchant)/i.test(k) || k === "trace" || k === "kind") {
        out.set(k, v);
      }
    });
  }
  let trace = out.get("trace");
  if (!trace && form) {
    trace = form.get("Lite_Merchant_Trace") || form.get("lite_merchant_trace") || "";
    if (trace) out.set("trace", trace);
  }
  if (!out.get("kind") && form) {
    const st = form.get("Lite_Payment_Card_Status") || form.get("lite_payment_card_status");
    if (st === "0") out.set("kind", "success");
  }
  return out;
}

export async function GET(request: NextRequest) {
  const u = new URL(request.url);
  const out = mergeToPaymentCompleteQuery(u, null);
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
