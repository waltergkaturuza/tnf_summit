import { supabase } from "./supabase";

export type MediaCategory = "gallery" | "speakers" | "documents" | "resources" | "sponsors";
export type MediaType = "image" | "video" | "document" | "audio";

export type MediaFile = {
  id: string;
  createdAt: string;
  bucketName: string;
  filePath: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  mediaType: MediaType;
  altText: string;
  caption: string;
  category: MediaCategory;
  publicUrl: string;
  thumbnailUrl: string;
  isPublished: boolean;
  sortOrder: number;
};

const BUCKET_MAP: Record<MediaCategory, string> = {
  gallery:   "tnf-gallery",
  speakers:  "tnf-speakers",
  documents: "tnf-documents",
  resources: "tnf-resources",
  sponsors:  "tnf-gallery",
};

function detectMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}

function rowToMedia(row: Record<string, unknown>): MediaFile {
  return {
    id:           row.id as string,
    createdAt:    row.created_at as string,
    bucketName:   row.bucket_name as string,
    filePath:     row.file_path as string,
    fileName:     row.file_name as string,
    originalName: (row.original_name as string) ?? "",
    mimeType:     (row.mime_type as string) ?? "",
    sizeBytes:    (row.size_bytes as number) ?? 0,
    mediaType:    (row.media_type as MediaType) ?? "image",
    altText:      (row.alt_text as string) ?? "",
    caption:      (row.caption as string) ?? "",
    category:     (row.category as MediaCategory) ?? "gallery",
    publicUrl:    (row.public_url as string) ?? "",
    thumbnailUrl: (row.thumbnail_url as string) ?? "",
    isPublished:  !!(row.is_published),
    sortOrder:    (row.sort_order as number) ?? 0,
  };
}

// ── Get public URL for a file in a bucket ────────────────────────────────────
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ── Upload a file ─────────────────────────────────────────────────────────────
export async function uploadFile(
  file: File,
  category: MediaCategory,
  altText = "",
  caption = ""
): Promise<MediaFile> {
  const bucket = BUCKET_MAP[category];
  const ext    = file.name.split(".").pop() ?? "";
  const slug   = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
  const path   = `${category}/${Date.now()}_${slug}`;
  const mType  = detectMediaType(file.type);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const publicUrl = getPublicUrl(bucket, path);

  // Save metadata to media_files table
  const { data, error: dbError } = await supabase
    .schema("tnf_summit")
    .from("media_files")
    .insert({
      bucket_name:   bucket,
      file_path:     path,
      file_name:     `${Date.now()}_${slug}`,
      original_name: file.name,
      mime_type:     file.type,
      size_bytes:    file.size,
      media_type:    mType,
      alt_text:      altText || file.name.replace(/\.[^.]+$/, ""),
      caption:       caption,
      category:      category,
      public_url:    publicUrl,
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return rowToMedia(data as Record<string, unknown>);
}

// ── Fetch all media files ─────────────────────────────────────────────────────
export async function fetchMediaFiles(category?: MediaCategory): Promise<MediaFile[]> {
  let query = supabase
    .schema("tnf_summit")
    .from("media_files")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => rowToMedia(row as Record<string, unknown>));
}

// ── Fetch public gallery (published only) ────────────────────────────────────
export async function fetchPublicGallery(): Promise<MediaFile[]> {
  const { data, error } = await supabase
    .schema("tnf_summit")
    .from("media_files")
    .select("*")
    .eq("category", "gallery")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => rowToMedia(row as Record<string, unknown>));
}

// ── Update media file metadata ────────────────────────────────────────────────
export async function updateMediaFile(id: string, updates: Partial<{
  altText: string; caption: string; isPublished: boolean; sortOrder: number; category: MediaCategory;
}>): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (updates.altText     !== undefined) clean.alt_text    = updates.altText;
  if (updates.caption     !== undefined) clean.caption     = updates.caption;
  if (updates.isPublished !== undefined) clean.is_published = updates.isPublished;
  if (updates.sortOrder   !== undefined) clean.sort_order  = updates.sortOrder;
  if (updates.category    !== undefined) clean.category    = updates.category;

  const { error } = await supabase
    .schema("tnf_summit")
    .from("media_files")
    .update(clean)
    .eq("id", id);
  if (error) throw error;
}

// ── Delete a media file (storage + DB) ───────────────────────────────────────
export async function deleteMediaFile(id: string, bucketName: string, filePath: string): Promise<void> {
  await supabase.storage.from(bucketName).remove([filePath]);
  const { error } = await supabase
    .schema("tnf_summit")
    .from("media_files")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── Format bytes for display ──────────────────────────────────────────────────
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
