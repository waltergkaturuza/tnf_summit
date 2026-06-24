/**
 * Payment starter endpoint.
 * - Active provider can be switched via PAYMENT_PROVIDER (`zikimall` | `iveri`).
 * - iVeri flow remains fully implemented for production go-live.
 * - ZikiMall flow redirects users to the hosted biller page for interim use.
 */
import { NextResponse } from "next/server";
import { buildIveriLiteFormFields, getIveriApplicationId } from "@/lib/iveri";
import { logIveriStartCert } from "@/lib/iveriCertLog";
import { getDonationCategoryLabel } from "@/lib/data";
import { getRegistrationFeeUsd } from "@/lib/registrationFee";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  trackId?: string;
  email?: string;
  category?: string;
  isEarlyBird?: boolean;
};

function isDonationTrack(id: string): boolean {
  return id.trim().startsWith("TNF-DON-");
}

function isInnovationTrack(id: string): boolean {
  return id.trim().startsWith("TNF-INN-");
}

function activeProvider(): "zikimall" | "iveri" {
  const raw = (process.env.PAYMENT_PROVIDER || "iveri").trim().toLowerCase();
  return raw === "iveri" ? "iveri" : "zikimall";
}

function buildZikiMallRedirect(args: {
  trackId: string;
  email: string;
  amountUsd: number;
  category: string;
  flow: "registration" | "donation";
}): string {
  const base = process.env.ZIKIMALL_PAYMENT_URL?.trim() || "https://zikimall.com/biller?bId=2484";
  const u = new URL(base);
  // Non-breaking metadata for reconciliation; ZikiMall can ignore unknown params.
  u.searchParams.set("ref", args.trackId);
  u.searchParams.set("email", args.email);
  u.searchParams.set("amount", String(Math.round(args.amountUsd * 100) / 100));
  u.searchParams.set("category", args.category);
  u.searchParams.set("flow", args.flow);
  return u.toString();
}

function merchantReferenceForAttempt(trackId: string): string {
  // Keep iVeri trace stable (trackId), but vary merchant reference to avoid duplicate-order lockouts.
  const base = trackId.trim().replace(/[^A-Za-z0-9-]/g, "").slice(0, 14);
  const stamp = String(Date.now()).slice(-6);
  return `${base}-${stamp}`.slice(0, 20);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function notifyPaymentLink(args: {
  trackId: string;
  email: string;
  amountUsd: number;
  flow: "registration" | "donation";
  category: string;
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!baseUrl) return;

  const retryUrl = `${baseUrl}/api/payments/iveri/start?trackId=${encodeURIComponent(args.trackId)}`;
  const resend = new Resend(key);
  const subjectPrefix = args.flow === "donation" ? "Donation payment link" : "Registration payment link";
  const html = `
    <h3>${escapeHtml(subjectPrefix)}</h3>
    <p>Reference: <strong>${escapeHtml(args.trackId)}</strong></p>
    <p>Category: ${escapeHtml(args.category)}</p>
    <p>Amount (USD): <strong>${escapeHtml(args.amountUsd.toFixed(2))}</strong></p>
    <p>You can retry payment using this secure link:</p>
    <p><a href="${escapeHtml(retryUrl)}">${escapeHtml(retryUrl)}</a></p>
    <p style="color:#666;font-size:12px;">If your previous attempt failed or was interrupted, open the link above to try again.</p>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "TNF Summit <updates@resend.dev>",
      to: [args.email],
      subject: `Zimbabwe TNF Global Summit: ${subjectPrefix} (${args.trackId})`,
      html,
    });
  } catch (err) {
    console.warn("[payments/start] payment-link email send failed:", err);
  }
}

async function resolveAndBuildStart(body: Body): Promise<
  | { status: number; payload: { error: string } }
  | { status: 200; payload: { provider: "zikimall" | "iveri"; redirectUrl?: string; action?: string; fields?: Record<string, string> } }
> {
  const provider = activeProvider();
  const applicationId = provider === "iveri" ? getIveriApplicationId() : "standby";
  if (provider === "iveri" && !applicationId) {
    return { status: 503, payload: { error: "Card payments are not configured." } };
  }

  const { trackId, email, category, isEarlyBird = true } = body;
  if (!trackId) {
    return { status: 400, payload: { error: "Missing trackId" } };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!baseUrl) {
    return {
      status: 503,
      payload: { error: "Set NEXT_PUBLIC_SITE_URL (or VERCEL_URL) so payment return URLs are valid." },
    };
  }

  try {
    if (isDonationTrack(trackId)) {
      if (!supabaseAdmin) {
        return { status: 500, payload: { error: "Server configuration error." } };
      }
      const { data: row, error: qErr } = await supabaseAdmin
        .schema("tnf_summit")
        .from("donations")
        .select("email, amount_usd, category_key, payment_status")
        .eq("track_id", trackId.trim())
        .maybeSingle();

      if (qErr || !row) {
        return { status: 404, payload: { error: "Donation not found." } };
      }
      if (row.payment_status === "paid") {
        return { status: 400, payload: { error: "This donation is already marked as paid." } };
      }
      const amountUsd = Number(row.amount_usd);
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
        return { status: 400, payload: { error: "Invalid stored donation amount." } };
      }
      const payerEmail = String(row.email ?? "").trim();
      if (!payerEmail) {
        return { status: 400, payload: { error: "Donation has no email on file." } };
      }
      const catKey = String(row.category_key ?? "general");
      const catLabel = getDonationCategoryLabel(catKey);
      const lineItemDescription = `Zimbabwe TNF Global Summit 2026, Donation (${catLabel})`.slice(0, 255);

      if (provider === "zikimall") {
        const redirectUrl = buildZikiMallRedirect({
          trackId: trackId.trim(),
          email: payerEmail,
          amountUsd,
          category: catKey,
          flow: "donation",
        });
        void notifyPaymentLink({
          trackId: trackId.trim(),
          email: payerEmail,
          amountUsd,
          flow: "donation",
          category: catLabel,
        });
        return { status: 200, payload: { provider, redirectUrl } };
      }

      const { action, fields } = buildIveriLiteFormFields({
        applicationIdRaw: applicationId,
        gatewayUrl: process.env.IVERI_GATEWAY_URL,
        sharedSecret: process.env.IVERI_SHARED_SECRET,
        amountUsd,
        email: payerEmail,
        merchantReference: merchantReferenceForAttempt(trackId),
        merchantTrace: trackId.slice(0, 64),
        lineItemDescription,
        baseUrl,
        returnNext: "donate",
      });
      logIveriStartCert({
        trackId: trackId.trim(),
        amountUsd,
        category: catKey,
        payerEmail,
        flow: "donation",
      });
      return { status: 200, payload: { provider, action, fields } };
    }

    if (isInnovationTrack(trackId)) {
      if (!supabaseAdmin) {
        return { status: 500, payload: { error: "Server configuration error." } };
      }
      const { data: row, error: qErr } = await supabaseAdmin
        .schema("tnf_summit")
        .from("innovation_applications")
        .select("email, startup_name, fee_amount, payment_status")
        .eq("track_id", trackId.trim())
        .maybeSingle();

      if (qErr || !row) {
        return { status: 404, payload: { error: "Innovation application not found." } };
      }
      if (row.payment_status === "paid") {
        return { status: 400, payload: { error: "This application is already marked as paid." } };
      }
      const amountUsd = Number(row.fee_amount);
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
        return { status: 400, payload: { error: "Invalid stored application fee." } };
      }
      const payerEmail = String(row.email ?? email?.trim() ?? "").trim();
      if (!payerEmail) {
        return { status: 400, payload: { error: "Application has no email on file." } };
      }
      const startupName = String(row.startup_name ?? "Youth Innovation Challenge").slice(0, 120);

      if (provider === "zikimall") {
        const redirectUrl = buildZikiMallRedirect({
          trackId: trackId.trim(),
          email: payerEmail,
          amountUsd,
          category: "Youth Innovation Challenge",
          flow: "registration",
        });
        void notifyPaymentLink({
          trackId: trackId.trim(),
          email: payerEmail,
          amountUsd,
          flow: "registration",
          category: `Innovation: ${startupName}`,
        });
        return { status: 200, payload: { provider, redirectUrl } };
      }

      const { action, fields } = buildIveriLiteFormFields({
        applicationIdRaw: applicationId,
        gatewayUrl: process.env.IVERI_GATEWAY_URL,
        sharedSecret: process.env.IVERI_SHARED_SECRET,
        amountUsd,
        email: payerEmail,
        merchantReference: merchantReferenceForAttempt(trackId),
        merchantTrace: trackId.slice(0, 64),
        lineItemDescription: `Zimbabwe TNF Global Summit 2026, Youth Innovation (${startupName})`.slice(0, 255),
        baseUrl,
        returnNext: "registration",
      });
      logIveriStartCert({
        trackId: trackId.trim(),
        amountUsd,
        category: "Youth Innovation Challenge",
        payerEmail,
        flow: "registration",
      });
      return { status: 200, payload: { provider, action, fields } };
    }

    let resolvedEmail = email?.trim() || "";
    let resolvedCategory = category?.trim() || "";
    let feeUsd: number | null = null;

    if (supabaseAdmin) {
      const { data: reg } = await supabaseAdmin
        .schema("tnf_summit")
        .from("registrations")
        .select("email, category, fee_amount")
        .eq("track_id", trackId.trim())
        .maybeSingle();
      if (reg) {
        resolvedEmail = String(reg.email ?? resolvedEmail).trim();
        resolvedCategory = String(reg.category ?? resolvedCategory).trim();
        const rowFee = Number(reg.fee_amount);
        if (Number.isFinite(rowFee) && rowFee > 0) feeUsd = rowFee;
      }
    }

    if (!resolvedEmail || !resolvedCategory) {
      return { status: 400, payload: { error: "Missing email or category" } };
    }

    if (feeUsd == null) {
      feeUsd = getRegistrationFeeUsd(resolvedCategory, isEarlyBird) ?? null;
    }
    if (feeUsd == null || feeUsd <= 0) {
      return { status: 400, payload: { error: "No payable fee for this category" } };
    }

    if (provider === "zikimall") {
      const redirectUrl = buildZikiMallRedirect({
        trackId: trackId.trim(),
        email: resolvedEmail,
        amountUsd: feeUsd,
        category: resolvedCategory,
        flow: "registration",
      });
      void notifyPaymentLink({
        trackId: trackId.trim(),
        email: resolvedEmail,
        amountUsd: feeUsd,
        flow: "registration",
        category: resolvedCategory,
      });
      return { status: 200, payload: { provider, redirectUrl } };
    }

    const { action, fields } = buildIveriLiteFormFields({
      applicationIdRaw: applicationId,
      gatewayUrl: process.env.IVERI_GATEWAY_URL,
      sharedSecret: process.env.IVERI_SHARED_SECRET,
      amountUsd: feeUsd,
      email: resolvedEmail,
      merchantReference: merchantReferenceForAttempt(trackId),
      merchantTrace: trackId.slice(0, 64),
      lineItemDescription: "Zimbabwe TNF Global Summit 2026, Delegate registration",
      baseUrl,
      returnNext: "registration",
    });
    logIveriStartCert({
      trackId: trackId.trim(),
      amountUsd: feeUsd,
      category: resolvedCategory,
      payerEmail: resolvedEmail,
      flow: "registration",
    });
    return { status: 200, payload: { provider, action, fields } };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Payment setup failed";
    return { status: 400, payload: { error: msg } };
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const result = await resolveAndBuildStart(body);
  return NextResponse.json(result.payload, { status: result.status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const trackId = (url.searchParams.get("trackId") || "").trim();
  const email = (url.searchParams.get("email") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const earlyRaw = (url.searchParams.get("isEarlyBird") || "").trim().toLowerCase();
  const isEarlyBird =
    earlyRaw === "true" || earlyRaw === "1" || earlyRaw === "yes"
      ? true
      : earlyRaw === "false" || earlyRaw === "0" || earlyRaw === "no"
        ? false
        : undefined;
  if (!trackId) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }
  const result = await resolveAndBuildStart({
    trackId,
    email: email || undefined,
    category: category || undefined,
    isEarlyBird,
  });
  if (result.status !== 200) {
    return NextResponse.json(result.payload, { status: result.status });
  }
  const payload = result.payload as {
    provider: "zikimall" | "iveri";
    redirectUrl?: string;
    action?: string;
    fields?: Record<string, string>;
  };
  if (payload.redirectUrl) {
    return NextResponse.redirect(payload.redirectUrl, 302);
  }
  if (payload.action && payload.fields) {
    const inputs = Object.entries(payload.fields)
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${escapeHtml(k)}" value="${escapeHtml(String(v))}" />`
      )
      .join("");
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Redirecting to secure payment…</title>
  </head>
  <body style="font-family:system-ui,sans-serif;background:#0a1f3d;color:#fff;">
    <div style="max-width:560px;margin:40px auto;padding:20px;border:1px solid rgba(255,255,255,.15);border-radius:14px;background:rgba(255,255,255,.03);">
      <h2 style="margin:0 0 8px 0;">Redirecting to secure payment…</h2>
      <p style="opacity:.9;line-height:1.5;">If you are not automatically redirected, tap the button below.</p>
      <p id="count" style="font-size:13px;opacity:.8;margin:6px 0 10px 0;">Auto-redirect in 6 seconds…</p>
    <form id="pay" method="POST" action="${escapeHtml(payload.action)}">
      ${inputs}
        <button type="submit" style="margin-top:10px;background:#c9921a;color:#0a1628;font-weight:700;border:0;border-radius:10px;padding:10px 14px;cursor:pointer;">
          Continue to Secure Payment
        </button>
    </form>
      <p style="margin-top:12px;font-size:12px;opacity:.7;">You will be taken to our payment partner (iVeri).</p>
    </div>
    <script>
      (function () {
        var secs = 6;
        var countEl = document.getElementById('count');
        var timer = setInterval(function () {
          secs -= 1;
          if (secs <= 0) {
            clearInterval(timer);
            document.getElementById('pay')?.submit();
            return;
          }
          if (countEl) countEl.textContent = 'Auto-redirect in ' + secs + ' seconds…';
        }, 1000);
      })();
    </script>
  </body>
</html>`;
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return NextResponse.json({ error: "Payment restart payload missing." }, { status: 500 });
}
