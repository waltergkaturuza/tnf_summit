/**
 * db.ts — All database CRUD operations for the TNF Summit platform.
 * Every function talks to Supabase and returns typed results.
 */

import { supabase } from "./supabase";
import { generateRegistrationTrackId } from "./trackId";
import type { Registration, ContactMessage, NewsletterSubscriber, Speaker, Update, Abstract, UpdateComment, UpdateReactionCounts, UpdateAttachment } from "./adminData";

// ── Type map: JS camelCase → Postgres snake_case ──────────────────────────────

function regToRow(r: Partial<Registration>) {
  return {
    track_id:               r.trackId ?? undefined,
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
    trackId:                (row.track_id as string) ?? null,
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

export async function insertRegistration(reg: Omit<Registration, "id" | "createdAt" | "trackId">): Promise<{ id: string; trackId: string }> {
  const trackId = generateRegistrationTrackId();
  const row = { ...regToRow(reg as Partial<Registration>), track_id: trackId };
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("registrations")
    .insert(row)
    .select("id, track_id")
    .single();
  if (error) throw error;
  return { id: data.id as string, trackId: (data.track_id as string) ?? trackId };
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

// ── UPDATES & NEWS ─────────────────────────────────────────────────────────────

function rowToUpdate(row: Record<string, unknown>): Update {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    type: row.type as Update["type"],
    category: (row.category as string) ?? "News",
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    link: (row.link as string) ?? "",
    imageUrl: (row.image_url as string) ?? "",
    published: !!(row.published as boolean),
    publishedAt: (row.published_at as string) ?? null,
    eventDate: (row.event_date as string) ?? null,
    eventStartAt: (row.event_start_at as string) ?? null,
    eventEndAt: (row.event_end_at as string) ?? null,
    eventVenue: (row.event_venue as string) ?? "",
    eventCity: (row.event_city as string) ?? "",
    eventCountry: (row.event_country as string) ?? "",
    registrationType: (row.registration_type as Update["registrationType"]) ?? "none",
    registrationUrl: (row.registration_url as string) ?? "",
    registrationPageSlug: (row.registration_page_slug as string) ?? "",
    displayOrder: (row.display_order as number) ?? 0,
  };
}

export async function fetchUpdates(): Promise<Update[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("updates")
    .select("*")
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToUpdate);
}

export async function fetchPublishedUpdates(): Promise<Update[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("updates")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToUpdate);
}

export async function insertUpdate(u: Omit<Update, "id" | "createdAt" | "updatedAt">): Promise<Update> {
  const row = {
    type: u.type,
    category: u.category || "News",
    title: u.title,
    description: u.description,
    link: u.link || null,
    image_url: u.imageUrl || null,
    published: u.published,
    published_at: u.published ? new Date().toISOString() : null,
    event_date: u.eventDate || null,
    event_start_at: u.eventStartAt || null,
    event_end_at: u.eventEndAt || null,
    event_venue: u.eventVenue || null,
    event_city: u.eventCity || null,
    event_country: u.eventCountry || null,
    registration_type: u.registrationType || "none",
    registration_url: u.registrationUrl || null,
    registration_page_slug: u.registrationPageSlug || null,
    display_order: u.displayOrder ?? 0,
  };
  const { data, error } = await supabase.schema("tnf_summit").from("updates").insert(row).select("*").single();
  if (error) throw error;
  return rowToUpdate(data as Record<string, unknown>);
}

export async function updateUpdate(id: string, updates: Partial<Update>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.type !== undefined) clean.type = updates.type;
  if (updates.category !== undefined) clean.category = updates.category;
  if (updates.title !== undefined) clean.title = updates.title;
  if (updates.description !== undefined) clean.description = updates.description;
  if (updates.link !== undefined) clean.link = updates.link;
  if (updates.imageUrl !== undefined) clean.image_url = updates.imageUrl;
  if (updates.published !== undefined) {
    clean.published = updates.published;
    clean.published_at = updates.published ? new Date().toISOString() : null;
  }
  if (updates.eventDate !== undefined) clean.event_date = updates.eventDate || null;
  if (updates.eventStartAt !== undefined) clean.event_start_at = updates.eventStartAt || null;
  if (updates.eventEndAt !== undefined) clean.event_end_at = updates.eventEndAt || null;
  if (updates.eventVenue !== undefined) clean.event_venue = updates.eventVenue || null;
  if (updates.eventCity !== undefined) clean.event_city = updates.eventCity || null;
  if (updates.eventCountry !== undefined) clean.event_country = updates.eventCountry || null;
  if (updates.registrationType !== undefined) clean.registration_type = updates.registrationType || "none";
  if (updates.registrationUrl !== undefined) clean.registration_url = updates.registrationUrl || null;
  if (updates.registrationPageSlug !== undefined) clean.registration_page_slug = updates.registrationPageSlug || null;
  if (updates.displayOrder !== undefined) clean.display_order = updates.displayOrder;
  const { error } = await supabase.schema("tnf_summit").from("updates").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteUpdate(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("updates").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchUpdateById(id: string): Promise<Update | null> {
  const { data, error } = await supabase.schema("tnf_summit").from("updates").select("*").eq("id", id).eq("published", true).maybeSingle();
  if (error) throw error;
  return data ? rowToUpdate(data as Record<string, unknown>) : null;
}

export async function fetchUpdateComments(updateId: string): Promise<UpdateComment[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("update_comments")
    .select("*")
    .eq("update_id", updateId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    updateId: r.update_id as string,
    authorName: (r.author_name as string) ?? null,
    isAnonymous: !!(r.is_anonymous as boolean),
    content: (r.content as string) ?? "",
    createdAt: r.created_at as string,
  }));
}

export async function insertUpdateComment(updateId: string, content: string, authorName: string | null, isAnonymous: boolean): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("update_comments").insert({
    update_id: updateId,
    author_name: authorName || null,
    is_anonymous: isAnonymous,
    content: content.trim(),
  });
  if (error) throw error;
}

export async function getUpdateReactionCounts(updateId: string, voterKey?: string | null): Promise<UpdateReactionCounts> {
  const { data: rows, error } = await supabase
    .schema("tnf_summit")
    .from("update_reactions")
    .select("is_like, voter_key")
    .eq("update_id", updateId);
  if (error) throw error;
  const reactions = (rows ?? []) as { is_like: boolean; voter_key: string }[];
  const likes = reactions.filter((r) => r.is_like).length;
  const dislikes = reactions.filter((r) => !r.is_like).length;
  let userReaction: "like" | "dislike" | null = null;
  if (voterKey) {
    const mine = reactions.find((r) => r.voter_key === voterKey);
    if (mine) userReaction = mine.is_like ? "like" : "dislike";
  }
  return { likes, dislikes, userReaction };
}

export async function setUpdateReaction(updateId: string, voterKey: string, isLike: boolean): Promise<void> {
  const { error } = await supabase
    .schema("tnf_summit")
    .from("update_reactions")
    .upsert({ update_id: updateId, voter_key: voterKey, is_like: isLike }, { onConflict: "update_id,voter_key" });
  if (error) throw error;
}

// ── UPDATE ATTACHMENTS ────────────────────────────────────────────────────────

function rowToAttachment(row: Record<string, unknown>): UpdateAttachment {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updateId: row.update_id as string,
    name: (row.name as string) ?? "",
    type: (row.type as UpdateAttachment["type"]) ?? "document",
    category: (row.category as UpdateAttachment["category"]) ?? "other",
    storageBucket: (row.storage_bucket as string) ?? null,
    storagePath: (row.storage_path as string) ?? null,
    publicUrl: (row.public_url as string) ?? "",
    showOnEvent: !!(row.show_on_event),
    showInResources: !!(row.show_in_resources),
    displayOrder: (row.display_order as number) ?? 0,
  };
}

export async function fetchUpdateAttachments(updateId: string, options?: { showOnEvent?: boolean; showInResources?: boolean }): Promise<UpdateAttachment[]> {
  let q = supabase
    .schema("tnf_summit")
    .from("update_attachments")
    .select("*")
    .eq("update_id", updateId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (options?.showOnEvent !== undefined) q = q.eq("show_on_event", options.showOnEvent);
  if (options?.showInResources !== undefined) q = q.eq("show_in_resources", options.showInResources);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r) => rowToAttachment(r as Record<string, unknown>));
}

export async function fetchAttachmentsForResources(): Promise<(UpdateAttachment & { updateTitle?: string })[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("update_attachments")
    .select("*, updates!inner(title)")
    .eq("show_in_resources", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as (Record<string, unknown> & { updates?: { title?: string } })[];
  return rows.map((r) => {
    const att = rowToAttachment(r);
    return { ...att, updateTitle: r.updates?.title };
  });
}

export async function insertUpdateAttachment(a: Omit<UpdateAttachment, "id" | "createdAt">): Promise<UpdateAttachment> {
  const row = {
    update_id: a.updateId,
    name: a.name,
    type: a.type ?? "document",
    category: a.category ?? "other",
    storage_bucket: a.storageBucket || null,
    storage_path: a.storagePath || null,
    public_url: a.publicUrl,
    show_on_event: a.showOnEvent ?? true,
    show_in_resources: a.showInResources ?? false,
    display_order: a.displayOrder ?? 0,
  };
  const { data, error } = await supabase.schema("tnf_summit").from("update_attachments").insert(row).select("*").single();
  if (error) throw error;
  return rowToAttachment(data as Record<string, unknown>);
}

export async function updateUpdateAttachment(id: string, updates: Partial<UpdateAttachment>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.name !== undefined) clean.name = updates.name;
  if (updates.type !== undefined) clean.type = updates.type;
  if (updates.category !== undefined) clean.category = updates.category;
  if (updates.storageBucket !== undefined) clean.storage_bucket = updates.storageBucket;
  if (updates.storagePath !== undefined) clean.storage_path = updates.storagePath;
  if (updates.publicUrl !== undefined) clean.public_url = updates.publicUrl;
  if (updates.showOnEvent !== undefined) clean.show_on_event = updates.showOnEvent;
  if (updates.showInResources !== undefined) clean.show_in_resources = updates.showInResources;
  if (updates.displayOrder !== undefined) clean.display_order = updates.displayOrder;
  const { error } = await supabase.schema("tnf_summit").from("update_attachments").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteUpdateAttachment(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("update_attachments").delete().eq("id", id);
  if (error) throw error;
}

export async function getActiveSubscriberEmails(): Promise<string[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("newsletter_subscribers")
    .select("email")
    .eq("status", "active");
  if (error) throw error;
  return (data ?? []).map((r) => r.email as string);
}

// ── TRACK STATUS (public RPC) ─────────────────────────────────────────────────
export type TrackStatusResult = { trackType: "registration" | "abstract"; status: string; titleOrName: string } | null;

export async function getTrackStatus(trackId: string): Promise<TrackStatusResult> {
  const { data, error } = await supabase.schema("tnf_summit").rpc("get_track_status", { p_track_id: trackId });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || !row.track_type) return null;
  return {
    trackType: row.track_type as "registration" | "abstract",
    status: row.status as string,
    titleOrName: (row.title_or_name as string) ?? "",
  };
}

// ── ABSTRACTS ─────────────────────────────────────────────────────────────────

function rowToAbstract(row: Record<string, unknown>): Abstract {
  const coAuthors = (row.co_authors as unknown[]) ?? [];
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    trackId: (row.track_id as string) ?? "",
    themeId: (row.theme_id as string) ?? "",
    title: (row.title as string) ?? "",
    abstractText: (row.abstract_text as string) ?? "",
    keywords: (row.keywords as string[]) ?? [],
    wordCount: (row.word_count as number) ?? 0,
    participation: (row.participation as Abstract["participation"]) ?? "oral",
    documentUrl: (row.document_url as string) ?? "",
    fileName: (row.file_name as string) ?? "",
    gender: (row.gender as string) ?? "",
    dateOfBirth: (row.date_of_birth as string) ?? null,
    country: (row.country as string) ?? "",
    institution: (row.institution as string) ?? "",
    tShirtSize: (row.t_shirt_size as string) ?? "",
    coAuthors: Array.isArray(coAuthors) ? (coAuthors as Abstract["coAuthors"]) : [],
    firstName: (row.first_name as string) ?? "",
    lastName: (row.last_name as string) ?? "",
    email: (row.email as string) ?? "",
    phone: (row.phone as string) ?? "",
    status: (row.status as Abstract["status"]) ?? "submitted",
    adminNotes: (row.admin_notes as string) ?? "",
  };
}

export async function fetchAbstracts(): Promise<Abstract[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("abstracts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => rowToAbstract(r as Record<string, unknown>));
}

export async function insertAbstract(a: Omit<Abstract, "id" | "createdAt" | "updatedAt">): Promise<Abstract> {
  const row = {
    track_id: a.trackId,
    theme_id: a.themeId,
    title: a.title,
    abstract_text: a.abstractText,
    keywords: a.keywords ?? [],
    word_count: a.wordCount ?? 0,
    participation: a.participation ?? "oral",
    document_url: a.documentUrl || null,
    file_name: a.fileName || null,
    gender: a.gender || null,
    date_of_birth: a.dateOfBirth || null,
    country: a.country,
    institution: a.institution,
    t_shirt_size: a.tShirtSize || null,
    co_authors: JSON.stringify(a.coAuthors ?? []),
    first_name: a.firstName,
    last_name: a.lastName,
    email: a.email,
    phone: a.phone || null,
    status: a.status ?? "submitted",
    admin_notes: a.adminNotes ?? null,
  };
  const { data, error } = await supabase.schema("tnf_summit").from("abstracts").insert(row).select("*").single();
  if (error) throw error;
  return rowToAbstract(data as Record<string, unknown>);
}

export async function updateAbstract(id: string, updates: Partial<Abstract>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.themeId !== undefined) clean.theme_id = updates.themeId;
  if (updates.title !== undefined) clean.title = updates.title;
  if (updates.abstractText !== undefined) clean.abstract_text = updates.abstractText;
  if (updates.keywords !== undefined) clean.keywords = updates.keywords;
  if (updates.wordCount !== undefined) clean.word_count = updates.wordCount;
  if (updates.participation !== undefined) clean.participation = updates.participation;
  if (updates.documentUrl !== undefined) clean.document_url = updates.documentUrl;
  if (updates.fileName !== undefined) clean.file_name = updates.fileName;
  if (updates.gender !== undefined) clean.gender = updates.gender;
  if (updates.dateOfBirth !== undefined) clean.date_of_birth = updates.dateOfBirth || null;
  if (updates.country !== undefined) clean.country = updates.country;
  if (updates.institution !== undefined) clean.institution = updates.institution;
  if (updates.tShirtSize !== undefined) clean.t_shirt_size = updates.tShirtSize;
  if (updates.coAuthors !== undefined) clean.co_authors = JSON.stringify(updates.coAuthors);
  if (updates.firstName !== undefined) clean.first_name = updates.firstName;
  if (updates.lastName !== undefined) clean.last_name = updates.lastName;
  if (updates.email !== undefined) clean.email = updates.email;
  if (updates.phone !== undefined) clean.phone = updates.phone;
  if (updates.status !== undefined) clean.status = updates.status;
  if (updates.adminNotes !== undefined) clean.admin_notes = updates.adminNotes;
  const { error } = await supabase.schema("tnf_summit").from("abstracts").update(clean).eq("id", id);
  if (error) throw error;
}

export async function deleteAbstract(id: string): Promise<void> {
  const { error } = await supabase.schema("tnf_summit").from("abstracts").delete().eq("id", id);
  if (error) throw error;
}
