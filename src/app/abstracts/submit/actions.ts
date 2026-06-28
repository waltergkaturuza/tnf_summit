"use server";

import { insertAbstractPublic } from "@/lib/abstractsServer";
import { generateAbstractTrackId } from "@/lib/trackId";
import { themes } from "@/lib/data";
import { sendMail, renderBrandedEmail, getSiteBaseUrl } from "@/lib/email";
import type { AbstractParticipation } from "@/lib/adminData";

export type SubmitAbstractState = { ok: boolean; trackId?: string; error?: string };

export async function submitAbstractAction(_prev: SubmitAbstractState, formData: FormData): Promise<SubmitAbstractState> {
  try {
    const themeId = (formData.get("themeId") as string)?.trim();
    const title = (formData.get("title") as string)?.trim();
    const abstractText = (formData.get("abstractText") as string)?.trim();
    const keywordsStr = (formData.get("keywords") as string)?.trim();
    const participation = (formData.get("participation") as AbstractParticipation) || "oral";
    const documentUrl = (formData.get("documentUrl") as string)?.trim() || "";
    const fileName = (formData.get("fileName") as string)?.trim() || "";
    const gender = (formData.get("gender") as string)?.trim() || "";
    const dateOfBirth = (formData.get("dateOfBirth") as string)?.trim() || null;
    const country = (formData.get("country") as string)?.trim() || "";
    const institution = (formData.get("institution") as string)?.trim() || "";
    const tShirtSize = (formData.get("tShirtSize") as string)?.trim() || "";
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim() || "";

    if (!themeId || !title || !abstractText || !firstName || !lastName || !email) {
      return { ok: false, error: "Please fill in required fields: theme, title, abstract, name, and email." };
    }

    const keywords = keywordsStr ? keywordsStr.split(/[,;]/).map((k) => k.trim()).filter(Boolean) : [];
    const wordCount = abstractText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 350 || wordCount > 500) {
      return { ok: false, error: "Abstract must be between 350 and 500 words." };
    }

    const coAuthorsJson = formData.get("coAuthors") as string;
    let coAuthors: { name: string; email?: string; institution?: string }[] = [];
    if (coAuthorsJson) {
      try {
        coAuthors = JSON.parse(coAuthorsJson) as typeof coAuthors;
      } catch {
        coAuthors = [];
      }
    }

    const trackId = generateAbstractTrackId();
    await insertAbstractPublic({
      trackId,
      themeId,
      title,
      abstractText,
      keywords,
      wordCount,
      participation,
      documentUrl,
      fileName,
      gender,
      dateOfBirth,
      country,
      institution,
      tShirtSize,
      coAuthors,
      firstName,
      lastName,
      email,
      phone,
      status: "submitted",
      adminNotes: "",
    });

    void sendAbstractAcknowledgement({
      trackId,
      email,
      firstName,
      lastName,
      title,
      themeId,
      participation,
      wordCount,
      institution,
    }).catch((err) => console.warn("[abstracts/submit] confirmation email failed:", err));

    return { ok: true, trackId };
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "";
    if (message.includes("Server configuration error")) {
      return { ok: false, error: "Submission is temporarily unavailable. Please email info@tnfzim.com with your abstract." };
    }
    return { ok: false, error: "Submission failed. Please try again or contact info@tnfzim.com." };
  }
}

async function sendAbstractAcknowledgement(args: {
  trackId: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  themeId: string;
  participation: AbstractParticipation;
  wordCount: number;
  institution: string;
}) {
  if (!args.email || !args.email.includes("@")) return;
  const recipientName = [args.firstName, args.lastName].filter(Boolean).join(" ").trim() || args.firstName;
  const themeLabel = themes.find((t) => t.id === args.themeId)?.label || args.themeId;
  const trackUrl = `${getSiteBaseUrl()}/track-status?ref=${encodeURIComponent(args.trackId)}`;

  const html = renderBrandedEmail({
    brandSubtitle: "Abstract Submission Received",
    recipientName,
    noticeText:
      "Your abstract has been received and is now under review by our scientific committee. We will email you again once a decision has been made.",
    noticeTone: "blue",
    detailsHeading: "Abstract details",
    details: [
      { label: "Submission ID", value: args.trackId },
      { label: "Author", value: recipientName },
      { label: "Email", value: args.email },
      ...(args.institution ? [{ label: "Institution", value: args.institution }] : []),
      { label: "Theme", value: themeLabel },
      { label: "Title", value: args.title },
      { label: "Word count", value: String(args.wordCount) },
      { label: "Participation", value: args.participation },
      { label: "Status", value: "UNDER REVIEW" },
    ],
    bodyParagraphs: [
      "Reviews typically take 2–3 weeks. Please keep this email for your records as it is your proof of submission.",
      "If you also plan to attend the Summit in person, you can register separately to secure your delegate badge.",
    ],
    cta: { label: "Track my submission", url: trackUrl },
    footerLine: "Need to update something? Reply to this email and we will assist.",
  });

  await sendMail({
    to: args.email,
    subject: `Zimbabwe TNF Global Summit 2026 · Abstract received (${args.trackId})`,
    html,
  });
}
