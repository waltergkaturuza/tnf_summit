/**
 * Unified outbound email helper.
 *
 * Sending order of preference:
 *   1. Gmail SMTP via nodemailer when `GMAIL_USER` + `GMAIL_APP_PASSWORD`
 *      are set. This is the primary transport because the project owner
 *      asked auto-replies to come from `mazhawidzaet@gmail.com`.
 *   2. Resend (existing dependency) as a fallback when only `RESEND_API_KEY`
 *      is configured (useful in CI / preview deployments without SMTP).
 *   3. No-op + console warning in development when neither is configured,
 *      so local builds keep working.
 *
 * To enable Gmail SMTP, set the following on the host (Vercel project
 * environment variables, or `.env.local` for local dev):
 *
 *   GMAIL_USER=mazhawidzaet@gmail.com
 *   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx   # 16-char Google App Password
 *   GMAIL_FROM_NAME=Zimbabwe TNF Global Summit   # optional, defaults below
 *   GMAIL_REPLY_TO=info@tnfzim.com               # optional
 *
 * Generate the app password at https://myaccount.google.com/apppasswords
 * (2-Step Verification must be enabled first).
 */

import nodemailer from "nodemailer";
import { Resend } from "resend";

export type SendMailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendMailResult =
  | { ok: true; provider: "gmail" | "resend"; id?: string }
  | { ok: false; provider: "gmail" | "resend" | "none"; error: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fromHeader(): string {
  const name = process.env.GMAIL_FROM_NAME?.trim() || "Zimbabwe TNF Global Summit";
  const user = process.env.GMAIL_USER?.trim() || "";
  return user ? `"${name}" <${user}>` : `"${name}" <updates@resend.dev>`;
}

async function sendViaGmail(args: SendMailArgs): Promise<SendMailResult> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return { ok: false, provider: "gmail", error: "Gmail SMTP not configured" };

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    const info = await transport.sendMail({
      from: fromHeader(),
      to: Array.isArray(args.to) ? args.to.join(", ") : args.to,
      subject: args.subject,
      html: args.html,
      text: args.text || htmlToPlainText(args.html),
      replyTo: args.replyTo || process.env.GMAIL_REPLY_TO || user,
    });
    return { ok: true, provider: "gmail", id: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, provider: "gmail", error: msg };
  }
}

async function sendViaResend(args: SendMailArgs): Promise<SendMailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, provider: "resend", error: "Resend not configured" };
  try {
    const resend = new Resend(key);
    const replyTo = args.replyTo || process.env.GMAIL_REPLY_TO || process.env.GMAIL_USER || "";
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || fromHeader(),
      to: Array.isArray(args.to) ? args.to : [args.to],
      subject: args.subject,
      html: args.html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) return { ok: false, provider: "resend", error: error.message || "Resend error" };
    return { ok: true, provider: "resend", id: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, provider: "resend", error: msg };
  }
}

export async function sendMail(args: SendMailArgs): Promise<SendMailResult> {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const r = await sendViaGmail(args);
    if (r.ok) return r;
    console.warn("[email] Gmail send failed, trying Resend:", r.error);
  }
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(args);
  }
  console.warn(
    "[email] No mail transport configured (GMAIL_USER+GMAIL_APP_PASSWORD or RESEND_API_KEY). Skipping send to:",
    args.to,
    "subject:",
    args.subject
  );
  return { ok: false, provider: "none", error: "No mail transport configured" };
}

// ── Branded email template ────────────────────────────────────────────────────

export type EmailDetail = { label: string; value: string };

export type BrandedEmailArgs = {
  /** Big white title in the top banner (e.g. "Zimbabwe TNF Global Summit"). */
  brandTitle?: string;
  /** Smaller subtitle below the title (e.g. "Registration Confirmed"). */
  brandSubtitle?: string;
  /** "Dear {recipientName}," shown above the body. */
  recipientName?: string;
  /** Coloured callout shown immediately under the greeting. */
  noticeText: string;
  /** Optional emphasis on the notice (defaults to emerald). */
  noticeTone?: "emerald" | "amber" | "rose" | "blue";
  /** A "Details" card. */
  detailsHeading?: string;
  details?: EmailDetail[];
  /** Optional plain paragraphs after the details card. */
  bodyParagraphs?: string[];
  /** Optional CTA. */
  cta?: { label: string; url: string };
  /** Footer line under the card. */
  footerLine?: string;
};

const TONE_STYLES: Record<NonNullable<BrandedEmailArgs["noticeTone"]>, { border: string; bg: string; text: string }> = {
  emerald: { border: "#10B981", bg: "#ECFDF5", text: "#047857" },
  amber: { border: "#F5B730", bg: "#FFFBEB", text: "#92400E" },
  rose: { border: "#F43F5E", bg: "#FFF1F2", text: "#9F1239" },
  blue: { border: "#3B82F6", bg: "#EFF6FF", text: "#1D4ED8" },
};

export function renderBrandedEmail(args: BrandedEmailArgs): string {
  const brandTitle = args.brandTitle || "Zimbabwe TNF Global Summit";
  const brandSubtitle = args.brandSubtitle || "Notification";
  const tone = TONE_STYLES[args.noticeTone || "emerald"];
  const greeting = args.recipientName ? `Dear ${escapeHtml(args.recipientName)},` : "Hello,";

  const detailsHtml =
    args.details && args.details.length
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:14px;margin-top:18px;">
          <tr><td style="padding:18px 22px;">
            <h3 style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#0F172A;font-family:Arial,Helvetica,sans-serif;">
              ${escapeHtml(args.detailsHeading || "Details")}
            </h3>
            ${args.details
              .map(
                (d) => `
              <p style="margin:4px 0;font-size:14px;line-height:1.55;color:#0F172A;font-family:Arial,Helvetica,sans-serif;">
                <strong style="color:#475569;font-weight:600;">${escapeHtml(d.label)}:</strong>
                <span style="color:#0F172A;">${escapeHtml(d.value)}</span>
              </p>`
              )
              .join("")}
          </td></tr>
        </table>`
      : "";

  const bodyHtml = (args.bodyParagraphs ?? [])
    .map(
      (p) => `
      <p style="margin:14px 0 0 0;font-size:14px;line-height:1.6;color:#334155;font-family:Arial,Helvetica,sans-serif;">
        ${escapeHtml(p)}
      </p>`
    )
    .join("");

  const ctaHtml = args.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;background:#F1F5F9;border-radius:14px;">
        <tr><td style="padding:22px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#0F172A;">Continue</p>
          <a href="${escapeHtml(args.cta.url)}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#C9921A 0%,#F5B730 100%);color:#0A1628;font-weight:700;text-decoration:none;border-radius:10px;padding:12px 22px;font-size:14px;font-family:Arial,Helvetica,sans-serif;">
            ${escapeHtml(args.cta.label)}
          </a>
        </td></tr>
      </table>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(brandTitle)}</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#0F172A;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F1F5F9;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.06);">
        <!-- Header banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#0A6E3A 0%,#10B981 55%,#C9921A 100%);padding:36px 28px;text-align:center;">
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:.3px;line-height:1.2;">${escapeHtml(brandTitle)}</h1>
            <p style="margin:6px 0 0 0;font-size:14px;color:#F8FAFC;opacity:.95;">${escapeHtml(brandSubtitle)}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 8px 28px;">
            <p style="margin:0 0 18px 0;font-size:15px;color:#0F172A;">${greeting}</p>
            <!-- Notice callout -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${tone.bg};border-left:4px solid ${tone.border};border-radius:10px;">
              <tr><td style="padding:14px 18px;">
                <p style="margin:0;font-size:14px;line-height:1.55;font-weight:600;color:${tone.text};">
                  ${escapeHtml(args.noticeText)}
                </p>
              </td></tr>
            </table>
            ${detailsHtml}
            ${bodyHtml}
            ${ctaHtml}
            <p style="margin:24px 0 4px 0;font-size:12px;color:#94A3B8;line-height:1.5;">
              ${escapeHtml(args.footerLine || "If you did not initiate this request, please ignore this email or contact us at info@tnfzim.com.")}
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#0A1628;padding:18px 28px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#CBD5E1;">
              © ${new Date().getFullYear()} Zimbabwe TNF Global Summit · Victoria Falls 2026
            </p>
            <p style="margin:6px 0 0 0;font-size:11px;color:#94A3B8;">
              <a href="https://summit.tnfzim.com" style="color:#F5B730;text-decoration:none;">summit.tnfzim.com</a> ·
              <a href="mailto:info@tnfzim.com" style="color:#F5B730;text-decoration:none;">info@tnfzim.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|h\d|li|tr|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://summit.tnfzim.com")
  );
}
