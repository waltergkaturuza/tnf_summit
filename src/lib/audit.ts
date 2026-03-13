import { supabase } from "./supabase";

export type AuditAction =
  | "login" | "logout"
  | "registration_created" | "registration_updated" | "registration_deleted"
  | "speaker_created" | "speaker_updated" | "speaker_deleted"
  | "sponsor_created" | "sponsor_updated" | "sponsor_deleted"
  | "message_replied" | "message_deleted"
  | "subscriber_added" | "subscriber_removed"
  | "media_uploaded" | "media_deleted"
  | "invoice_generated" | "invoice_marked_paid" | "payment_updated"
  | "settings_updated" | "user_created" | "user_updated" | "user_deleted";

export async function logAudit(
  action: AuditAction,
  entityType: string,
  entityLabel: string,
  entityId = "",
  details: Record<string, unknown> = {}
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.schema("tnf_summit").from("audit_trail").insert({
      action,
      entity_type:  entityType,
      entity_id:    entityId,
      entity_label: entityLabel,
      performed_by: user?.email ?? "system",
      details,
    });
  } catch {
    // Never break the UI for audit logging failures
  }
}
