import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendMail, renderBrandedEmail, getSiteBaseUrl } from "@/lib/email";

export const runtime = "nodejs";

type Body = { email?: string; source?: string };

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = (body.source ?? "footer").trim().slice(0, 60) || "footer";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { data: existing, error: lookupError } = await supabaseAdmin
    .schema("tnf_summit")
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) {
    console.error("[api/subscribe] lookup:", lookupError);
    return NextResponse.json({ error: "Subscription lookup failed." }, { status: 500 });
  }

  let result: "subscribed" | "already_subscribed";

  if (existing) {
    if (existing.status === "unsubscribed") {
      const { error } = await supabaseAdmin
        .schema("tnf_summit")
        .from("newsletter_subscribers")
        .update({ status: "active", unsubscribed_at: null })
        .eq("email", email);
      if (error) {
        console.error("[api/subscribe] reactivate:", error);
        return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
      }
      result = "subscribed";
    } else {
      result = "already_subscribed";
    }
  } else {
    const { error } = await supabaseAdmin
      .schema("tnf_summit")
      .from("newsletter_subscribers")
      .insert({ email, source });
    if (error) {
      console.error("[api/subscribe] insert:", error);
      return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
    }
    result = "subscribed";
  }

  if (result === "subscribed") {
    void sendWelcomeEmail(email, source).catch((e) =>
      console.warn("[api/subscribe] welcome email failed:", e)
    );
  }

  return NextResponse.json({ ok: true, result });
}

async function sendWelcomeEmail(email: string, source: string) {
  const siteUrl = getSiteBaseUrl();
  const sourceLabel: Record<string, string> = {
    footer: "Footer newsletter form",
    registration: "Registration form",
    donate: "Donation form",
  };
  const html = renderBrandedEmail({
    brandSubtitle: "Welcome to the Summit Newsletter",
    recipientName: "there",
    noticeText:
      "You're now subscribed to Zimbabwe TNF Global Summit updates. We'll send you key announcements, speaker reveals, programme updates and ticket reminders for Victoria Falls 2026.",
    noticeTone: "emerald",
    detailsHeading: "Subscription details",
    details: [
      { label: "Email", value: email },
      { label: "Source", value: sourceLabel[source] || source },
      { label: "Status", value: "ACTIVE" },
    ],
    bodyParagraphs: [
      "We respect your inbox. Expect a steady, infrequent cadence and no spam, ever.",
      "If you ever want to step away, just reply with the word 'unsubscribe' and we will remove you immediately.",
    ],
    cta: { label: "Explore the Summit", url: siteUrl },
    footerLine: "Glad to have you on board. See you in Victoria Falls.",
  });

  await sendMail({
    to: email,
    subject: "Welcome to Zimbabwe TNF Global Summit updates",
    html,
  });
}
