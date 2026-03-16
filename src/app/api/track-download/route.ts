import { NextRequest, NextResponse } from "next/server";
import { recordResourceDownload } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const attachmentId = searchParams.get("attachmentId") || undefined;
  const name = searchParams.get("name") || "Resource";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    await recordResourceDownload({
      attachmentId: attachmentId || undefined,
      resourceName: decodeURIComponent(name),
      resourceUrl: url,
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
    });
  } catch (e) {
    console.warn("Download tracking failed:", e);
  }

  return NextResponse.redirect(url);
}
