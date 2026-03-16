import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateRegistrationTrackId } from "@/lib/trackId";

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
