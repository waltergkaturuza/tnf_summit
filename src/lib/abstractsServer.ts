import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Abstract } from "@/lib/adminData";

function abstractToRow(a: Omit<Abstract, "id" | "createdAt" | "updatedAt">) {
  return {
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
    co_authors: a.coAuthors ?? [],
    first_name: a.firstName,
    last_name: a.lastName,
    email: a.email,
    phone: a.phone || null,
    status: a.status ?? "submitted",
    admin_notes: a.adminNotes ?? null,
  };
}

function rowToAbstract(row: Record<string, unknown>): Abstract {
  const coAuthorsRaw = row.co_authors;
  let coAuthors: Abstract["coAuthors"] = [];
  if (Array.isArray(coAuthorsRaw)) {
    coAuthors = coAuthorsRaw as Abstract["coAuthors"];
  } else if (typeof coAuthorsRaw === "string" && coAuthorsRaw) {
    try {
      coAuthors = JSON.parse(coAuthorsRaw) as Abstract["coAuthors"];
    } catch {
      coAuthors = [];
    }
  }

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
    coAuthors,
    firstName: (row.first_name as string) ?? "",
    lastName: (row.last_name as string) ?? "",
    email: (row.email as string) ?? "",
    phone: (row.phone as string) ?? "",
    status: (row.status as Abstract["status"]) ?? "submitted",
    adminNotes: (row.admin_notes as string) ?? "",
  };
}

/** Trusted server-side insert for the public abstract form (bypasses RLS via service role). */
export async function insertAbstractPublic(
  a: Omit<Abstract, "id" | "createdAt" | "updatedAt">
): Promise<Abstract> {
  if (!supabaseAdmin) {
    throw new Error("Server configuration error: missing Supabase service role credentials.");
  }

  const { data, error } = await supabaseAdmin
    .schema("tnf_summit")
    .from("abstracts")
    .insert(abstractToRow(a))
    .select("*")
    .single();

  if (error) throw error;
  return rowToAbstract(data as Record<string, unknown>);
}
