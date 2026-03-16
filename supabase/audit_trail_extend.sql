-- ============================================================
-- Extend audit_trail with new action types
-- Run in Supabase SQL Editor (run each ADD VALUE separately if needed)
-- ============================================================
SET search_path TO tnf_summit, public;

-- Add new audit action values for Updates & Attachments
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'update_created';
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'update_updated';
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'update_deleted';
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'attachment_created';
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'attachment_deleted';
ALTER TYPE tnf_summit.audit_action ADD VALUE IF NOT EXISTS 'resource_download';
