import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateRegistrationTrackId } from "@/lib/trackId";
import { sendMail, renderBrandedEmail, getSiteBaseUrl } from "@/lib/email";

export const runtime = "nodejs";

function regToRow(r: Record<string, unknown>) {
  return {
    track_id: r.trackId ?? undefined,
    status: r.status,
    admin_notes: r.adminNotes ?? "",
    salutation: r.salutation,
    first_name: r.firstName,
    last_name: r.lastName,
    gender: r.gender ?? null,
    date_of_birth: r.dateOfBirth || null,
    nationality: r.nationality,
    passport_number: r.passportNumber || null,
    organisation: r.organisation,
    department: r.department ?? null,
    job_title: r.jobTitle,
    sector: r.sector,
    org_website: r.organisationWebsite ?? null,
    email: r.email,
    phone: r.phone,
    whatsapp: r.whatsapp ?? null,
    country: r.country,
    city: r.city,
    category: r.category,
    attendance_mode: r.attendanceMode,
    days_attending: r.daysAttending ?? [],
    requires_accommodation: !!r.requiresAccommodation,
    arrival_date: r.arrivalDate || null,
    departure_date: r.departureDate || null,
    room_type: r.roomType ?? null,
    airport_transfer: !!r.airportTransfer,
    special_needs: r.specialNeeds ?? null,
    dietary_requirements: r.dietaryRequirements ?? null,
    session_interests: r.sessionInterests ?? [],
    excursion_preference: r.excursionPreference ?? null,
    apply_innovation: !!r.applyInnovation,
    startup_name: r.startupName ?? null,
    startup_stage: r.startupStage ?? null,
    startup_description: r.startupDescription ?? null,
    bilateral_meetings: !!r.bilateralMeetings,
    investment_interests: r.investmentInterests ?? [],
    is_media: !!r.isMedia,
    media_organisation: r.mediaOrganisation ?? null,
    media_type: r.mediaType ?? null,
    payment_method: r.paymentMethod,
    invoice_required: !!r.invoiceRequired,
    billing_organisation: r.billingOrganisation ?? null,
    fee_amount: r.feeAmount ?? 0,
    payment_status: r.paymentStatus ?? "unpaid",
    privacy_consent: !!r.privacyConsent,
    photo_consent: !!r.photoConsent,
    newsletter_opt_in: !!r.newsletterOptIn,
    terms_accepted: !!r.termsAccepted,
  };
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server configuration error. Please contact support." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const trackId = generateRegistrationTrackId();
    const row = { ...regToRow(body), track_id: trackId };

    const { data, error } = await supabaseAdmin
      .schema("tnf_summit")
      .from("registrations")
      .insert(row)
      .select("id, track_id")
      .single();

    if (error) {
      console.error("Registration insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    void sendRegistrationConfirmation({
      trackId: data.track_id ?? trackId,
      email: String(body.email ?? ""),
      firstName: String(body.firstName ?? ""),
      lastName: String(body.lastName ?? ""),
      salutation: String(body.salutation ?? ""),
      category: String(body.category ?? ""),
      attendanceMode: String(body.attendanceMode ?? ""),
      paymentMethod: String(body.paymentMethod ?? ""),
      feeAmount: Number(body.feeAmount ?? 0),
    }).catch((e) => console.warn("[api/register] confirmation email failed:", e));

    return NextResponse.json({
      id: data.id,
      trackId: data.track_id ?? trackId,
    });
  } catch (e) {
    console.error("Registration API error:", e);
    return NextResponse.json(
      { error: "Submission failed. Please try again or contact info@tnfzim.com." },
      { status: 500 }
    );
  }
}

async function sendRegistrationConfirmation(args: {
  trackId: string;
  email: string;
  firstName: string;
  lastName: string;
  salutation: string;
  category: string;
  attendanceMode: string;
  paymentMethod: string;
  feeAmount: number;
}) {
  if (!args.email || !args.email.includes("@")) return;
  const recipientName = [args.salutation, args.firstName, args.lastName].filter(Boolean).join(" ").trim() || args.firstName;
  const trackUrl = `${getSiteBaseUrl()}/track-status?ref=${encodeURIComponent(args.trackId)}`;
  const feeLine = args.feeAmount > 0 ? `USD ${args.feeAmount.toLocaleString("en-US")}` : "Complimentary";

  const html = renderBrandedEmail({
    brandSubtitle: "Registration Received",
    recipientName,
    noticeText:
      "Thank you for registering for the Zimbabwe TNF Global Summit 2026. Your details have been received and are pending confirmation.",
    noticeTone: "emerald",
    detailsHeading: "Registration details",
    details: [
      { label: "Reference", value: args.trackId },
      { label: "Name", value: recipientName },
      { label: "Email", value: args.email },
      { label: "Category", value: args.category || "—" },
      { label: "Attendance", value: args.attendanceMode || "—" },
      { label: "Payment method", value: args.paymentMethod || "—" },
      { label: "Fee", value: feeLine },
      { label: "Status", value: "PENDING" },
    ],
    bodyParagraphs: [
      args.feeAmount > 0 && args.paymentMethod
        ? "Payment is due within 3 days of registration. Your place is only confirmed once we have received payment."
        : "Your delegate badge will be ready for collection at Delegate Registration on 21 September 2026 in Victoria Falls.",
      "You can track your registration status anytime using the reference above.",
    ],
    cta: { label: "Track my registration", url: trackUrl },
    footerLine: "If anything in this email looks wrong, reply to this message and we will sort it out.",
  });

  await sendMail({
    to: args.email,
    subject: `Zimbabwe TNF Global Summit 2026 · Registration received (${args.trackId})`,
    html,
  });
}
