"use server";

import { insertAbstract } from "@/lib/db";
import { generateAbstractTrackId } from "@/lib/trackId";
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
    await insertAbstract({
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

    return { ok: true, trackId };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Submission failed. Please try again or contact info@tnfzim.com." };
  }
}
