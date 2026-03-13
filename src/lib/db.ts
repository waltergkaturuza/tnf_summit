/**
 * db.ts — All database CRUD operations for the TNF Summit platform.
 * Every function talks to Supabase and returns typed results.
 */

import { supabase } from "./supabase";
import type { Registration, ContactMessage, NewsletterSubscriber, Speaker } from "./adminData";

// ── Type map: JS camelCase → Postgres snake_case ──────────────────────────────

function regToRow(r: Partial<Registration>) {
  return {
    status:                 r.status,
    admin_notes:            r.adminNotes,
    salutation:             r.salutation,
    first_name:             r.firstName,
    last_name:              r.lastName,
    gender:                 r.gender,
    date_of_birth:          r.dateOfBirth || null,
    nationality:            r.nationality,
    passport_number:        r.passportNumber,
    organisation:           r.organisation,
    department:             r.department,
    job_title:              r.jobTitle,
    sector:                 r.sector,
    org_website:            r.organisationWebsite,
    email:                  r.email,
    phone:                  r.phone,
    whatsapp:               r.whatsapp,
    country:                r.country,
    city:                   r.city,
    category:               r.category,
    attendance_mode:        r.attendanceMode,
    days_attending:         r.daysAttending,
    requires_accommodation: r.requiresAccommodation,
    arrival_date:           r.arrivalDate || null,
    departure_date:         r.departureDate || null,
    room_type:              r.roomType,
    airport_transfer:       r.airportTransfer,
    special_needs:          r.specialNeeds,
    dietary_requirements:   r.dietaryRequirements,
    session_interests:      r.sessionInterests,
    excursion_preference:   r.excursionPreference,
    apply_innovation:       r.applyInnovation,
    startup_name:           r.startupName,
    startup_stage:          r.startupStage,
    startup_description:    r.startupDescription,
    bilateral_meetings:     r.bilateralMeetings,
    investment_interests:   r.investmentInterests,
    is_media:               r.isMedia,
    media_organisation:     r.mediaOrganisation,
    media_type:             r.mediaType,
    payment_method:         r.paymentMethod,
    invoice_required:       r.invoiceRequired,
    billing_organisation:   r.billingOrganisation,
    fee_amount:             r.feeAmount,
    payment_status:         r.paymentStatus,
    privacy_consent:        r.privacyConsent,
    photo_consent:          r.photoConsent,
    newsletter_opt_in:      r.newsletterOptIn,
    terms_accepted:         r.termsAccepted,
  };
}

function rowToReg(row: Record<string, unknown>): Registration {
  return {
    id:                     row.id as string,
    createdAt:              row.created_at as string,
    status:                 row.status as Registration["status"],
    adminNotes:             (row.admin_notes as string) ?? "",
    salutation:             (row.salutation as string) ?? "",
    firstName:              (row.first_name as string) ?? "",
    lastName:               (row.last_name as string) ?? "",
    gender:                 (row.gender as string) ?? "",
    dateOfBirth:            (row.date_of_birth as string) ?? "",
    nationality:            (row.nationality as string) ?? "",
    passportNumber:         (row.passport_number as string) ?? "",
    organisation:           (row.organisation as string) ?? "",
    department:             (row.department as string) ?? "",
    jobTitle:               (row.job_title as string) ?? "",
    sector:                 (row.sector as string) ?? "",
    organisationWebsite:    (row.org_website as string) ?? "",
    email:                  (row.email as string) ?? "",
    phone:                  (row.phone as string) ?? "",
    whatsapp:               (row.whatsapp as string) ?? "",
    country:                (row.country as string) ?? "",
    city:                   (row.city as string) ?? "",
    category:               (row.category as string) ?? "",
    attendanceMode:         (row.attendance_mode as Registration["attendanceMode"]) ?? "in-person",
    daysAttending:          (row.days_attending as string[]) ?? [],
    requiresAccommodation:  !!(row.requires_accommodation),
    arrivalDate:            (row.arrival_date as string) ?? "",
    departureDate:          (row.departure_date as string) ?? "",
    roomType:               (row.room_type as string) ?? "",
    airportTransfer:        !!(row.airport_transfer),
    specialNeeds:           (row.special_needs as string) ?? "",
    dietaryRequirements:    (row.dietary_requirements as string) ?? "",
    sessionInterests:       (row.session_interests as string[]) ?? [],
    excursionPreference:    (row.excursion_preference as string) ?? "",
    applyInnovation:        !!(row.apply_innovation),
    startupName:            (row.startup_name as string) ?? "",
    startupStage:           (row.startup_stage as string) ?? "",
    startupDescription:     (row.startup_description as string) ?? "",
    bilateralMeetings:      !!(row.bilateral_meetings),
    investmentAreas:        (row.investment_interests as string[])?.join(", ") ?? "",
    investmentInterests:    (row.investment_interests as string[]) ?? [],
    isMedia:                !!(row.is_media),
    mediaOrganisation:      (row.media_organisation as string) ?? "",
    mediaType:              (row.media_type as string) ?? "",
    paymentMethod:          (row.payment_method as string) ?? "",
    invoiceRequired:        !!(row.invoice_required),
    billingOrganisation:    (row.billing_organisation as string) ?? "",
    feeAmount:              (row.fee_amount as number) ?? 0,
    paymentStatus:          (row.payment_status as Registration["paymentStatus"]) ?? "unpaid",
    privacyConsent:         !!(row.privacy_consent),
    photoConsent:           !!(row.photo_consent),
    newsletterOptIn:        !!(row.newsletter_opt_in),
    termsAccepted:          !!(row.terms_accepted),
  };
}

function rowToSpeaker(row: Record<string, unknown>): Speaker {
  return {
    id:           row.id as string,
    addedAt:      row.created_at as string,
    name:         (row.name as string) ?? "",
    title:        (row.title as string) ?? "",
    organisation: (row.organisation as string) ?? "",
    country:      (row.country as string) ?? "",
    bio:          (row.bio as string) ?? "",
    email:        (row.email as string) ?? "",
    photoUrl:     (row.photo_url as string) ?? "",
    sessionTitle: (row.session_title as string) ?? "",
    sessionDate:  (row.session_date as string) ?? "",
    sessionType:  (row.session_type as string) ?? "",
    status:       (row.status as Speaker["status"]) ?? "tentative",
  };
}

function rowToMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id:           row.id as string,
    createdAt:    row.created_at as string,
    name:         (row.name as string) ?? "",
    email:        (row.email as string) ?? "",
    phone:        (row.phone as string) ?? "",
    organisation: (row.organisation as string) ?? "",
    enquiryType:  (row.enquiry_type as string) ?? "",
    message:      (row.message as string) ?? "",
    status:       (row.status as ContactMessage["status"]) ?? "unread",
    adminReply:   (row.admin_reply as string) ?? "",
  };
}

function rowToSubscriber(row: Record<string, unknown>): NewsletterSubscriber {
  return {
    id:           row.id as string,
    email:        (row.email as string) ?? "",
    subscribedAt: row.created_at as string,
    status:       (row.status as NewsletterSubscriber["status"]) ?? "active",
  };
}

// ── REGISTRATIONS ──────────────────────────────────────────────────────────────

export async function fetchRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReg);
}

export async function insertRegistration(reg: Omit<Registration, "id" | "createdAt">): Promise<string> {
  const row = regToRow(reg as Partial<Registration>);
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("registrations")
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateRegistration(id: string, updates: Partial<Registration>): Promise<void> {
  const row = regToRow(updates);
  // Remove undefined keys
  const clean = Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
  const { error } = await supabase
    .schema("tnf_summit")
    .from("registrations")
    .update(clean)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase
    .schema("tnf_summit")
    .from("registrations")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── SPEAKERS ───────────────────────────────────────────────────────────────────

export async function fetchSpeakers(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("speakers")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToSpeaker);
}

export async function insertSpeaker(s: Omit<Speaker, "id" | "addedAt">): Promise<void> {
  const { error } = await supabase
    .schema("tnf_summit")
    .from("speakers")
    .insert({
      name: s.name, title: s.title, organisation: s.organisation,
      country: s.country, bio: s.bio, email: s.email, photo_url: s.photoUrl,
      session_title: s.sessionTitle, session_date: s.sessionDate,
      session_type: s.sessionType, status: s.status,
    });
  if (error) throw error;
}

export async function updateSpeaker(id: string, s: Partial<Speaker>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (s.name !== undefined)         clean.name          = s.name;
  if (s.title !== undefined)        clean.title         = s.title;
  if (s.organisation !== undefined) clean.organisation  = s.organisation;
  if (s.country !== undefined)      clean.country       = s.country;
  if (s.bio !== undefined)          clean.bio           = s.bio;
  if (s.email !== undefined)        clean.email         = s.email;
  if (s.photoUrl !== undefined)     clean.photo_url     = s.photoUrl;
  if (s.sessionTitle !== undefined) clean.session_title = s.sessionTitle;
  if (s.sessionDate !== undefined)  clean.session_date  = s.sessionDate;
  if (s.sessionType !== undefined)  clean.session_type  = s.sessionType;
  if (s.status !== undefined)       clean.status        = s.status;
  const { error } = await supabase.schema("tnf_summit").from("speakers").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteSpeaker(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("speakers").delete().eq("id", id);
  if (error) throw error;
}

// ── CONTACT MESSAGES ───────────────────────────────────────────────────────────

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToMessage);
}

export async function insertMessage(msg: Omit<ContactMessage, "id" | "createdAt" | "status" | "adminReply">): Promise<void> {
  const { error } = await supabase
    .schema("tnf_summit")
    .from("contact_messages")
    .insert({
      name: msg.name, email: msg.email, phone: msg.phone,
      organisation: msg.organisation, enquiry_type: msg.enquiryType,
      message: msg.message,
    });
  if (error) throw error;
}

export async function updateMessage(id: string, updates: Partial<ContactMessage>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.status !== undefined)     clean.status      = updates.status;
  if (updates.adminReply !== undefined) clean.admin_reply = updates.adminReply;
  if (updates.status === "replied")     clean.replied_at  = new Date().toISOString();
  const { error } = await supabase.schema("tnf_summit").from("contact_messages").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

// ── NEWSLETTER ─────────────────────────────────────────────────────────────────

export async function fetchSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToSubscriber);
}

export async function subscribeEmail(email: string, source = "footer"): Promise<"subscribed" | "already_subscribed"> {
  const { data: existing } = await supabase
    .schema("tnf_summit")
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "unsubscribed") {
      await supabase.schema("tnf_summit").from("newsletter_subscribers")
        .update({ status: "active", unsubscribed_at: null }).eq("email", email);
      return "subscribed";
    }
    return "already_subscribed";
  }

  const { error } = await supabase
    .schema("tnf_summit")
    .from("newsletter_subscribers")
    .insert({ email, source });
  if (error) throw error;
  return "subscribed";
}

export async function updateSubscriber(id: string, updates: Partial<NewsletterSubscriber>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.status !== undefined) {
    clean.status = updates.status;
    if (updates.status === "unsubscribed") clean.unsubscribed_at = new Date().toISOString();
  }
  const { error } = await supabase.schema("tnf_summit").from("newsletter_subscribers").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw error;
}

// ── DASHBOARD STATS ────────────────────────────────────────────────────────────

export type DashboardStats = {
  total_registrations: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  in_person: number;
  virtual: number;
  total_revenue_usd: number;
  countries_represented: number;
};

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("v_dashboard_stats")
    .select("*")
    .single();
  if (error) return null;
  return data as DashboardStats;
}

// ── SITE SETTINGS ──────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabase
    .schema("tnf_summit")
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .schema("tnf_summit")
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
