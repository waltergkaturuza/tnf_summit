import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateInnovationTrackId } from "@/lib/trackId";
import { calculateInnovationFeeUsd, normalizeInnovationExcursions } from "@/lib/innovationFee";
import { sendMail, renderBrandedEmail, getSiteBaseUrl } from "@/lib/email";

export const runtime = "nodejs";

type Body = {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  organisation?: string;
  startupName?: string;
  startupStage?: string;
  startupDescription?: string;
  projectUrl?: string;
  excursions?: string[];
  dietaryRequirements?: string;
  requiresAccommodation?: boolean;
  arrivalDate?: string;
  departureDate?: string;
  specialNeeds?: string;
  paymentMethod?: string;
  invoiceRequired?: boolean;
  billingOrganisation?: string;
  privacyConsent?: boolean;
  photoConsent?: boolean;
  newsletterOptIn?: boolean;
  termsAccepted?: boolean;
};

function innovationToRow(body: Body, trackId: string, fees: ReturnType<typeof calculateInnovationFeeUsd>) {
  const excursions = normalizeInnovationExcursions(body.excursions ?? []);
  return {
    track_id: trackId,
    status: "pending",
    admin_notes: "",
    salutation: (body.salutation ?? "").trim(),
    first_name: (body.firstName ?? "").trim(),
    last_name: (body.lastName ?? "").trim(),
    gender: (body.gender ?? "").trim(),
    date_of_birth: (body.dateOfBirth ?? "").trim() || null,
    nationality: (body.nationality ?? "").trim(),
    email: (body.email ?? "").trim().toLowerCase(),
    phone: (body.phone ?? "").trim(),
    whatsapp: (body.whatsapp ?? "").trim() || null,
    country: (body.country ?? "").trim(),
    city: (body.city ?? "").trim(),
    organisation: (body.organisation ?? "").trim(),
    startup_name: (body.startupName ?? "").trim(),
    startup_stage: (body.startupStage ?? "").trim(),
    startup_description: (body.startupDescription ?? "").trim(),
    project_url: (body.projectUrl ?? "").trim() || null,
    attendance_mode: "in-person",
    excursions,
    excursion_count: fees.excursionCount,
    dietary_requirements: (body.dietaryRequirements ?? "").trim(),
    requires_accommodation: !!body.requiresAccommodation,
    arrival_date: body.requiresAccommodation ? (body.arrivalDate ?? "").trim() || null : null,
    departure_date: body.requiresAccommodation ? (body.departureDate ?? "").trim() || null : null,
    special_needs: (body.specialNeeds ?? "").trim() || null,
    payment_method: (body.paymentMethod ?? "").trim(),
    invoice_required: body.invoiceRequired !== false,
    billing_organisation: (body.billingOrganisation ?? "").trim() || null,
    base_fee_usd: fees.baseFeeUsd,
    excursion_fee_usd: fees.excursionFeeUsd,
    fee_amount: fees.totalUsd,
    payment_status: "unpaid",
    privacy_consent: !!body.privacyConsent,
    photo_consent: !!body.photoConsent,
    newsletter_opt_in: !!body.newsletterOptIn,
    terms_accepted: !!body.termsAccepted,
  };
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
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const startupName = (body.startupName ?? "").trim();
  const startupDescription = (body.startupDescription ?? "").trim();
  const paymentMethod = (body.paymentMethod ?? "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!startupName || !startupDescription) {
    return NextResponse.json({ error: "Start-up name and solution description are required." }, { status: 400 });
  }
  if (startupDescription.length < 50) {
    return NextResponse.json({ error: "Please provide a fuller description of your solution (at least 50 characters)." }, { status: 400 });
  }
  if (!paymentMethod) {
    return NextResponse.json({ error: "Please select a payment method." }, { status: 400 });
  }
  if (!body.privacyConsent || !body.termsAccepted) {
    return NextResponse.json({ error: "Privacy consent and terms acceptance are required." }, { status: 400 });
  }

  const fees = calculateInnovationFeeUsd(body.excursions ?? []);
  const trackId = generateInnovationTrackId();
  const row = innovationToRow(body, trackId, fees);

  const { data, error } = await supabaseAdmin
    .schema("tnf_summit")
    .from("innovation_applications")
    .insert(row)
    .select("id, track_id")
    .single();

  if (error) {
    console.error("[api/innovation/apply] insert:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  void sendInnovationConfirmation({
    trackId: data.track_id ?? trackId,
    email,
    firstName,
    lastName,
    salutation: (body.salutation ?? "").trim(),
    startupName,
    excursions: normalizeInnovationExcursions(body.excursions ?? []),
    feeAmount: fees.totalUsd,
    paymentMethod,
  }).catch((e) => console.warn("[api/innovation/apply] confirmation email failed:", e));

  return NextResponse.json({
    id: data.id,
    trackId: data.track_id ?? trackId,
    feeAmount: fees.totalUsd,
  });
}

async function sendInnovationConfirmation(args: {
  trackId: string;
  email: string;
  firstName: string;
  lastName: string;
  salutation: string;
  startupName: string;
  excursions: string[];
  feeAmount: number;
  paymentMethod: string;
}) {
  const recipientName = [args.salutation, args.firstName, args.lastName].filter(Boolean).join(" ").trim() || args.firstName;
  const trackUrl = `${getSiteBaseUrl()}/track-status?ref=${encodeURIComponent(args.trackId)}`;
  const payUrl = `${getSiteBaseUrl()}/api/payments/iveri/start?trackId=${encodeURIComponent(args.trackId)}`;

  const html = renderBrandedEmail({
    brandSubtitle: "Innovation Challenge Application Received",
    recipientName,
    noticeText:
      "Thank you for applying to the TNF Innovation Challenge 2026. Your application has been received and is pending payment confirmation.",
    noticeTone: "emerald",
    detailsHeading: "Application details",
    details: [
      { label: "Reference", value: args.trackId },
      { label: "Applicant", value: recipientName },
      { label: "Email", value: args.email },
      { label: "Start-up / project", value: args.startupName },
      { label: "Excursions", value: args.excursions.length ? args.excursions.join("; ") : "None selected" },
      { label: "Total fee", value: `USD ${args.feeAmount.toLocaleString("en-US")}` },
      { label: "Payment method", value: args.paymentMethod },
      { label: "Status", value: "PENDING PAYMENT" },
    ],
    bodyParagraphs: [
      "Attendance is in person at Victoria Falls. Complete payment on our secure hosted page (card, bank transfer, or mobile money).",
      "Shortlisted finalists will be contacted separately about pitching schedules.",
    ],
    cta: { label: "Complete payment securely", url: payUrl },
    footerLine: `You can also track this application at ${trackUrl}`,
  });

  await sendMail({
    to: args.email,
    subject: `TNF Innovation Challenge 2026 · Application received (${args.trackId})`,
    html,
  });
}
