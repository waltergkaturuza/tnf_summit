import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await supabase.auth.setSession({ access_token: token, refresh_token: "" });

    const body = await request.json();
    const { title, description, link } = body as { updateId?: string; title: string; description?: string; link?: string };
    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const { data: rows, error } = await supabase
      .schema("tnf_summit")
      .from("newsletter_subscribers")
      .select("email")
      .eq("status", "active");

    if (error) {
      console.error("[notify-subscribers] DB error:", error);
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }

    const emails = (rows ?? []).map((r) => r.email as string);
    if (emails.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: "No active subscribers" });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tnf-summit.vercel.app";
    const updatesUrl = `${appUrl}/updates`;

    if (resendKey) {
      const resend = new Resend(resendKey);
      const html = `
        <h2>New update: ${escapeHtml(title)}</h2>
        ${description ? `<p>${escapeHtml(description.slice(0, 500))}${description.length > 500 ? "…" : ""}</p>` : ""}
        ${link ? `<p><a href="${escapeHtml(link)}">Read more</a></p>` : ""}
        <p><a href="${updatesUrl}">View all updates & news</a></p>
        <p style="color:#888;font-size:12px;">You received this because you subscribed to Zimbabwe TNF Global Summit updates.</p>
      `;
      const { data: sendData, error: sendError } = await resend.emails.send({
        from: process.env.RESEND_FROM || "TNF Summit <updates@resend.dev>",
        to: emails,
        subject: `Zimbabwe TNF Global Summit: ${title.slice(0, 80)}`,
        html,
      });
      if (sendError) {
        console.error("[notify-subscribers] Resend error:", sendError);
        return NextResponse.json({ error: "Failed to send emails", details: sendError.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, sent: emails.length, id: sendData?.id });
    }

    console.log("[notify-subscribers] No RESEND_API_KEY; would have emailed", emails.length, "subscribers:", title);
    return NextResponse.json({ ok: true, sent: 0, message: "RESEND_API_KEY not set; emails not sent" });
  } catch (err) {
    console.error("[notify-subscribers]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
