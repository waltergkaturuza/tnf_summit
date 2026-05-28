import { NextResponse } from "next/server";
import {
  donationCategories,
  getDonationCategoryLabel,
  themes,
  getThemeSponsorshipOfferTier,
  getThemeSponsorshipTiers,
  getSummitWidePartnershipTier,
  getSponsorshipTiersForSelectValue,
  isEventSponsorshipPackageId,
  parseUsdFromPriceBand,
  type ThemeSponsorshipPackageTier,
} from "@/lib/data";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateDonationTrackId } from "@/lib/trackId";
import { sendMail, renderBrandedEmail, getSiteBaseUrl } from "@/lib/email";

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
  /** When set to sponsorship, amount must match the selected package (validated server-side). */
  contributionType?: "donation" | "sponsorship";
  sponsorshipScope?: "theme" | "event_package" | "summit_wide";
  /** Welcome Cocktail, Ministerial Dinner, Magazine, or Lanyards id (when sponsorshipScope is event_package). */
  eventPackageId?: string;
  packageTier?: ThemeSponsorshipPackageTier;
  summitWideTierId?: string;
};

const TIER_KEYS = new Set<string>(["platinum", "gold", "silver", "official_partner"]);

function expectedSponsorshipUsd(b: Body): number | null {
  if (b.sponsorshipScope === "summit_wide") {
    const id = (b.summitWideTierId ?? "").trim().toLowerCase();
    const sw = getSummitWidePartnershipTier(id);
    if (!sw) return null;
    return parseUsdFromPriceBand(sw.priceBand);
  }
  if (b.sponsorshipScope === "event_package") {
    const pid = (b.eventPackageId ?? "").trim().toLowerCase();
    if (!isEventSponsorshipPackageId(pid)) return null;
    const tiers = getSponsorshipTiersForSelectValue(pid);
    if (tiers.length === 0) return null;
    const ptRaw = (b.packageTier ?? "").trim().toLowerCase();
    const o = tiers.find((t) => t.packageTier === ptRaw) ?? tiers[0];
    return o?.priceUsd ?? null;
  }
  if (b.sponsorshipScope !== "theme") return null;
  const tid = (b.themeId ?? "").trim().toUpperCase();
  if (!tid) return null;
  const pt = (b.packageTier ?? "").trim().toLowerCase();
  if (pt && TIER_KEYS.has(pt)) {
    const o = getThemeSponsorshipOfferTier(tid, pt as ThemeSponsorshipPackageTier);
    return o?.priceUsd ?? null;
  }
  const tiers = getThemeSponsorshipTiers(tid);
  return tiers[0]?.priceUsd ?? null;
}

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
  const contributionType = body.contributionType === "sponsorship" ? "sponsorship" : "donation";
  const theme = themes.find((t) => t.id === themeId);

  const amountUsd = Number(body.amountUsd);
  if (!Number.isFinite(amountUsd) || amountUsd < MIN_USD || amountUsd > MAX_USD) {
    return NextResponse.json(
      { error: `Amount must be between USD ${MIN_USD} and USD ${MAX_USD.toLocaleString("en-US")}.` },
      { status: 400 }
    );
  }

  if (contributionType === "sponsorship") {
    if (body.sponsorshipScope === "theme") {
      if (categoryKey !== "theme_sponsorship") {
        return NextResponse.json(
          { error: "Use the Theme spotlight sponsorship category for theme packages." },
          { status: 400 }
        );
      }
      if (!theme) {
        return NextResponse.json({ error: "Please select a valid Summit theme." }, { status: 400 });
      }
      const exp = expectedSponsorshipUsd({ ...body, themeId, sponsorshipScope: "theme" });
      if (exp == null || Math.abs(amountUsd - exp) > 0.02) {
        return NextResponse.json(
          { error: "Amount must match the selected theme sponsorship package." },
          { status: 400 }
        );
      }
    } else if (body.sponsorshipScope === "event_package") {
      if (categoryKey !== "event_package_sponsorship") {
        return NextResponse.json(
          { error: "Use the Event package sponsorship category for Welcome, Ministerial, Magazine, or Lanyards." },
          { status: 400 }
        );
      }
      const pid = (body.eventPackageId ?? "").trim().toLowerCase();
      if (!isEventSponsorshipPackageId(pid)) {
        return NextResponse.json({ error: "Please select a valid event package." }, { status: 400 });
      }
      const exp = expectedSponsorshipUsd({
        ...body,
        eventPackageId: pid,
        sponsorshipScope: "event_package",
      });
      if (exp == null || Math.abs(amountUsd - exp) > 0.02) {
        return NextResponse.json(
          { error: "Amount must match the selected event package and tier." },
          { status: 400 }
        );
      }
    } else if (body.sponsorshipScope === "summit_wide") {
      if (categoryKey !== "summit_wide_sponsorship") {
        return NextResponse.json(
          { error: "Use the Summit-wide partnership category for full-summit tiers." },
          { status: 400 }
        );
      }
      const exp = expectedSponsorshipUsd({ ...body, sponsorshipScope: "summit_wide" });
      if (exp == null || Math.abs(amountUsd - exp) > 0.02) {
        return NextResponse.json(
          { error: "Amount must match the selected summit-wide tier." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Select theme spotlight, event packages, or summit-wide sponsorship." },
        { status: 400 }
      );
    }
  } else {
    if (
      categoryKey === "theme_sponsorship" ||
      categoryKey === "summit_wide_sponsorship" ||
      categoryKey === "event_package_sponsorship"
    ) {
      return NextResponse.json(
        { error: "Use Sponsorship on the donate form for fixed packages, or choose another category." },
        { status: 400 }
      );
    }
    if (categoryKey === "global_themes_fund" && !theme) {
      return NextResponse.json({ error: "Please select a valid Summit theme." }, { status: 400 });
    }
    if (categoryKey === "other" && !categoryOther) {
      return NextResponse.json({ error: "Please provide your donation category." }, { status: 400 });
    }
  }

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (donorType === "organisation" && !organisation) {
    return NextResponse.json({ error: "Organisation name is required for organisational gifts." }, { status: 400 });
  }

  const trackId = generateDonationTrackId();

  let categoryLabel: string;
  if (categoryKey === "other") {
    categoryLabel = categoryOther;
  } else if (categoryKey === "global_themes_fund" && theme) {
    categoryLabel = `${getDonationCategoryLabel(categoryKey)}, Theme ${theme.id}: ${theme.label}`;
  } else if (categoryKey === "theme_sponsorship" && contributionType === "sponsorship" && body.sponsorshipScope === "theme" && theme) {
    const ptRaw = (body.packageTier ?? "").trim().toLowerCase();
    const pt = (TIER_KEYS.has(ptRaw) ? ptRaw : getThemeSponsorshipTiers(themeId)[0]?.packageTier) as
      | ThemeSponsorshipPackageTier
      | undefined;
    const offer = pt ? getThemeSponsorshipOfferTier(themeId, pt) : undefined;
    categoryLabel =
      offer && theme
        ? `Sponsorship: Theme ${theme.id} · ${theme.label} · ${offer.packageLabel} · USD ${offer.priceUsd.toLocaleString("en-US")}`
        : getDonationCategoryLabel(categoryKey);
  } else if (
    categoryKey === "summit_wide_sponsorship" &&
    contributionType === "sponsorship" &&
    body.sponsorshipScope === "summit_wide"
  ) {
    const sw = getSummitWidePartnershipTier((body.summitWideTierId ?? "").trim().toLowerCase());
    categoryLabel = sw ? `Sponsorship: Summit-wide · ${sw.title} · ${sw.priceBand}` : getDonationCategoryLabel(categoryKey);
  } else if (
    categoryKey === "event_package_sponsorship" &&
    contributionType === "sponsorship" &&
    body.sponsorshipScope === "event_package"
  ) {
    const pid = (body.eventPackageId ?? "").trim().toLowerCase();
    const tiers = isEventSponsorshipPackageId(pid) ? getSponsorshipTiersForSelectValue(pid) : [];
    const ptRaw = (body.packageTier ?? "").trim().toLowerCase();
    const offer = tiers.find((t) => t.packageTier === ptRaw) ?? tiers[0];
    categoryLabel = offer
      ? `Sponsorship: ${offer.themeLabel} · ${offer.packageLabel} · USD ${offer.priceUsd.toLocaleString("en-US")}`
      : getDonationCategoryLabel(categoryKey);
  } else {
    categoryLabel = getDonationCategoryLabel(categoryKey);
  }

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

  void sendDonationConfirmation({
    trackId: (data.track_id as string) ?? trackId,
    donorType,
    firstName,
    lastName,
    organisation,
    email,
    contributionType,
    categoryLabel,
    amountUsd,
  }).catch((e) => console.warn("[api/donate] confirmation email failed:", e));

  return NextResponse.json({
    id: data.id as string,
    trackId: (data.track_id as string) ?? trackId,
  });
}

async function sendDonationConfirmation(args: {
  trackId: string;
  donorType: "individual" | "organisation";
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  contributionType: "donation" | "sponsorship";
  categoryLabel: string;
  amountUsd: number;
}) {
  if (!args.email || !args.email.includes("@")) return;
  const isSponsorship = args.contributionType === "sponsorship";
  const recipientName =
    args.donorType === "organisation" && args.organisation
      ? args.organisation
      : [args.firstName, args.lastName].filter(Boolean).join(" ").trim() || args.firstName;
  const payUrl = `${getSiteBaseUrl()}/api/payments/iveri/start?trackId=${encodeURIComponent(args.trackId)}`;
  const subjectKind = isSponsorship ? "Sponsorship pledge received" : "Donation pledge received";

  const html = renderBrandedEmail({
    brandSubtitle: subjectKind,
    recipientName,
    noticeText: isSponsorship
      ? "Thank you for pledging your sponsorship support. Your contribution will help power the Zimbabwe TNF Global Summit 2026."
      : "Thank you for your generous pledge to the Zimbabwe TNF Global Summit 2026. Every contribution helps shape an inclusive future of work.",
    noticeTone: "emerald",
    detailsHeading: isSponsorship ? "Sponsorship details" : "Donation details",
    details: [
      { label: "Reference", value: args.trackId },
      { label: "Name", value: recipientName },
      { label: "Email", value: args.email },
      ...(args.organisation ? [{ label: "Organisation", value: args.organisation }] : []),
      { label: "Category", value: args.categoryLabel },
      { label: "Amount", value: `USD ${args.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      { label: "Status", value: "AWAITING PAYMENT" },
    ],
    bodyParagraphs: [
      "Use the secure link below to complete payment on our payment partner's hosted page. You can choose card, bank transfer, or mobile money (EcoCash / InnBucks) there.",
      "If you would like a tax invoice or receipt issued to a specific organisation, reply to this email with the details.",
    ],
    cta: { label: "Complete payment securely", url: payUrl },
    footerLine: "Keep this reference safe. You can resume payment any time using the button above.",
  });

  await sendMail({
    to: args.email,
    subject: `Zimbabwe TNF Global Summit 2026 · ${subjectKind} (${args.trackId})`,
    html,
  });
}
