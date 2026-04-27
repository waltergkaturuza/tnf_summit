/**
 * Starts iVeri **Full Redirect** (Hosted Payment Page). Returns `action` + `fields` for a
 * client-side form POST to the gateway; all sensitive fields are built here, not from raw client input.
 * Amount is derived from `category` + early-bird rules server-side.
 */
import { NextResponse } from "next/server";
import { buildIveriLiteFormFields, getIveriApplicationId } from "@/lib/iveri";
import { getRegistrationFeeUsd } from "@/lib/registrationFee";

export const runtime = "nodejs";

type Body = {
  trackId?: string;
  email?: string;
  category?: string;
  isEarlyBird?: boolean;
};

export async function POST(req: Request) {
  const applicationId = getIveriApplicationId();
  if (!applicationId) {
    return NextResponse.json({ error: "Card payments are not configured." }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { trackId, email, category, isEarlyBird = true } = body;
  if (!trackId || !email || !category) {
    return NextResponse.json({ error: "Missing trackId, email, or category" }, { status: 400 });
  }

  const feeUsd = getRegistrationFeeUsd(category, isEarlyBird);
  if (feeUsd == null || feeUsd <= 0) {
    return NextResponse.json({ error: "No payable fee for this category" }, { status: 400 });
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
    });
    return NextResponse.json({ action, fields });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Payment setup failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
