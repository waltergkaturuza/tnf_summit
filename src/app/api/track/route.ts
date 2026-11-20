import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const countryCache = new Map<string, { country: string; at: number }>();
const CACHE_MS = 6 * 60 * 60 * 1000;

function clientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "";
  return req.headers.get("x-real-ip")?.trim() ?? "";
}

function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) {
    return true;
  }
  const parts = ip.split(".");
  if (parts[0] === "172") {
    const second = Number(parts[1]);
    return second >= 16 && second <= 31;
  }
  return false;
}

async function countryFromIp(ip: string): Promise<string> {
  if (!ip || isPrivateIp(ip)) return "";
  const cached = countryCache.get(ip);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.country;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { success?: boolean; country?: string };
    const country = data.success && data.country ? String(data.country).slice(0, 80) : "";
    if (countryCache.size > 500) countryCache.clear();
    countryCache.set(ip, { country, at: Date.now() });
    return country;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const path = String(body?.path ?? "").slice(0, 300);
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/admin")) {
    return NextResponse.json({ ok: true });
  }

  const device = String(body?.deviceType ?? "");
  const country = await countryFromIp(clientIp(req));

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, country }, { status: 503 });
  }

  const { error } = await supabaseAdmin.schema("tnf_summit").from("page_views").insert({
    page_path: path,
    referrer: String(body?.referrer ?? "").slice(0, 500),
    session_id: String(body?.sessionId ?? "").slice(0, 80),
    device_type: device === "desktop" || device === "mobile" || device === "tablet" ? device : "",
    country,
  });

  if (error) {
    console.warn("Page view tracking failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
