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

function activeProvider(): "zikimall" | "iveri" {
  const raw = (process.env.PAYMENT_PROVIDER || "zikimall").trim().toLowerCase();
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

export async function POST(req: Request) {
  const provider = activeProvider();
  const applicationId = provider === "iveri" ? getIveriApplicationId() : "standby";
  if (provider === "iveri" && !applicationId) {
    return NextResponse.json({ error: "Card payments are not configured." }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { trackId, email, category, isEarlyBird = true } = body;
  if (!trackId) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!baseUrl) {
    return NextResponse.json(
      { error: "Set NEXT_PUBLIC_SITE_URL (or VERCEL_URL) so payment return URLs are valid." },
      { status: 503 }
    );
  }

  try {
    if (isDonationTrack(trackId)) {
      if (!supabaseAdmin) {
        return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
      }
      const { data: row, error: qErr } = await supabaseAdmin
        .schema("tnf_summit")
        .from("donations")
        .select("email, amount_usd, category_key, payment_status")
        .eq("track_id", trackId.trim())
        .maybeSingle();

      if (qErr || !row) {
        return NextResponse.json({ error: "Donation not found." }, { status: 404 });
      }
      if (row.payment_status === "paid") {
        return NextResponse.json({ error: "This donation is already marked as paid." }, { status: 400 });
      }
      const amountUsd = Number(row.amount_usd);
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
        return NextResponse.json({ error: "Invalid stored donation amount." }, { status: 400 });
      }
      const payerEmail = String(row.email ?? "").trim();
      if (!payerEmail) {
        return NextResponse.json({ error: "Donation has no email on file." }, { status: 400 });
      }
      const catKey = String(row.category_key ?? "general");
      const catLabel = getDonationCategoryLabel(catKey);
      const lineItemDescription = `Zimbabwe TNF Global Summit 2026 — Donation (${catLabel})`.slice(0, 255);

      if (provider === "zikimall") {
        const redirectUrl = buildZikiMallRedirect({
          trackId: trackId.trim(),
          email: payerEmail,
          amountUsd,
          category: catKey,
          flow: "donation",
        });
        return NextResponse.json({ provider, redirectUrl });
      }

      const { action, fields } = buildIveriLiteFormFields({
        applicationIdRaw: applicationId,
        gatewayUrl: process.env.IVERI_GATEWAY_URL,
        sharedSecret: process.env.IVERI_SHARED_SECRET,
        amountUsd,
        email: payerEmail,
        merchantReference: trackId.slice(0, 20),
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
      return NextResponse.json({ provider, action, fields });
    }

    if (!email || !category) {
      return NextResponse.json({ error: "Missing email or category" }, { status: 400 });
    }

    const feeUsd = getRegistrationFeeUsd(category, isEarlyBird);
    if (feeUsd == null || feeUsd <= 0) {
      return NextResponse.json({ error: "No payable fee for this category" }, { status: 400 });
    }

    if (provider === "zikimall") {
      const redirectUrl = buildZikiMallRedirect({
        trackId: trackId.trim(),
        email: email.trim(),
        amountUsd: feeUsd,
        category: category.trim(),
        flow: "registration",
      });
      return NextResponse.json({ provider, redirectUrl });
    }

    const { action, fields } = buildIveriLiteFormFields({
      applicationIdRaw: applicationId,
      gatewayUrl: process.env.IVERI_GATEWAY_URL,
      sharedSecret: process.env.IVERI_SHARED_SECRET,
      amountUsd: feeUsd,
      email: email.trim(),
      merchantReference: trackId.slice(0, 20),
      merchantTrace: trackId.slice(0, 64),
      lineItemDescription: "Zimbabwe TNF Global Summit 2026 — Delegate registration",
      baseUrl,
      returnNext: "registration",
    });
    logIveriStartCert({
      trackId: trackId.trim(),
      amountUsd: feeUsd,
      category: category.trim(),
      payerEmail: email.trim(),
      flow: "registration",
    });
    return NextResponse.json({ provider, action, fields });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Payment setup failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
