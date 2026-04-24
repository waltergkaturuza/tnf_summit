import { NextResponse } from "next/server";
import { queryLiteAuthoriseInfo } from "@/lib/iveri";

/**
 * Server-side: re-check a transaction on the iVeri AuthoriseInfo endpoint using `Lite_Merchant_Trace`
 * (same trace as registration / `Lite_Merchant_Trace` on the original authorisation).
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const applicationId = process.env.IVERI_APPLICATION_ID?.trim() || process.env.IVERI_APP_ID?.trim();
  if (!applicationId) {
    return NextResponse.json({ error: "Card payments are not configured." }, { status: 503 });
  }

  let body: { trackId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trace = body.trackId?.trim();
  if (!trace) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }

  const info = await queryLiteAuthoriseInfo({
    applicationIdRaw: applicationId,
    merchantTrace: trace,
  });

  return NextResponse.json({
    approved: info.approved,
    cardStatus: info.cardStatus,
    httpStatus: info.httpStatus,
    queryOk: info.ok,
    error: info.error ?? null,
  });
}
