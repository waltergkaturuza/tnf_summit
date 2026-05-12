import { NextResponse } from "next/server";
import { donationCategories, getDonationCategoryLabel, themes } from "@/lib/data";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateDonationTrackId } from "@/lib/trackId";

export const runtime = "nodejs";

const ALLOWED = new Set(donationCategories.map((c) => c.key));
const MIN_USD = 1;
const MAX_USD = 99_999_999.99;

type Body = {
  donorType?: "individual" | "organisation";
  firstName?: string;
  lastName?: string;
  organisation?: string;
  email?: string;
  phone?: string;
  categoryKey?: string;
  themeId?: string;
  categoryOther?: string;
  amountUsd?: number;
  message?: string;
};

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const donorType = body.donorType === "organisation" ? "organisation" : "individual";
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const organisation = (body.organisation ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim().slice(0, 40);
  const categoryKey = (body.categoryKey ?? "").trim() || "general";
  const themeId = (body.themeId ?? "").trim().toUpperCase();
  const categoryOther = (body.categoryOther ?? "").trim().slice(0, 120);
  const message = (body.message ?? "").trim().slice(0, 2000);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!ALLOWED.has(categoryKey)) {
    return NextResponse.json({ error: "Invalid donation category." }, { status: 400 });
  }
  const theme = themes.find((t) => t.id === themeId);
  if (categoryKey === "global_themes_fund" && !theme) {
    return NextResponse.json({ error: "Please select a valid Summit theme." }, { status: 400 });
  }
  if (categoryKey === "other" && !categoryOther) {
    return NextResponse.json({ error: "Please provide your donation category." }, { status: 400 });
  }

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (donorType === "organisation" && !organisation) {
    return NextResponse.json({ error: "Organisation name is required for organisational gifts." }, { status: 400 });
  }

  const amountUsd = Number(body.amountUsd);
  if (!Number.isFinite(amountUsd) || amountUsd < MIN_USD || amountUsd > MAX_USD) {
    return NextResponse.json(
      { error: `Amount must be between USD ${MIN_USD} and USD ${MAX_USD.toLocaleString("en-US")}.` },
      { status: 400 }
    );
  }

  const trackId = generateDonationTrackId();
  const categoryLabel =
    categoryKey === "other"
      ? categoryOther
      : categoryKey === "global_themes_fund" && theme
        ? `${getDonationCategoryLabel(categoryKey)}, Theme ${theme.id}: ${theme.label}`
        : getDonationCategoryLabel(categoryKey);

  const { data, error } = await supabaseAdmin
    .schema("tnf_summit")
    .from("donations")
    .insert({
      track_id: trackId,
      donor_type: donorType,
      first_name: firstName,
      last_name: lastName,
      organisation: organisation || null,
      email,
      phone: phone || null,
      category_key: categoryKey,
      category_label: categoryLabel,
      amount_usd: amountUsd,
      currency: "USD",
      payment_method: "card",
      payment_status: "unpaid",
      message: message || null,
    })
    .select("id, track_id")
    .single();

  if (error) {
    console.error("[api/donate] insert:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.id as string,
    trackId: (data.track_id as string) ?? trackId,
  });
}
