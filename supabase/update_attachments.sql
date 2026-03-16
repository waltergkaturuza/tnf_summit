-- ============================================================
-- TNF Summit — Update attachments (resources for events/updates)
-- Run after updates_table.sql
-- ============================================================
SET search_path TO tnf_summit, public;

CREATE TABLE IF NOT EXISTS tnf_summit.update_attachments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_id        UUID NOT NULL REFERENCES tnf_summit.updates(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'document',   -- pdf | document | link | other
  category         TEXT NOT NULL DEFAULT 'other',     -- concept_note | schedule | brochure | agenda | other
  storage_bucket   TEXT,
  storage_path     TEXT,
  public_url       TEXT NOT NULL,                     -- from storage or external URL
  show_on_event    BOOLEAN NOT NULL DEFAULT TRUE,
  show_in_resources BOOLEAN NOT NULL DEFAULT FALSE,
  display_order    INT NOT NULL DEFAULT 0,
  CONSTRAINT update_attachments_name_not_empty CHECK (name <> ''),
  CONSTRAINT update_attachments_public_url_not_empty CHECK (public_url <> '')
);

CREATE INDEX IF NOT EXISTS idx_update_attachments_update_id ON tnf_summit.update_attachments (update_id);
CREATE INDEX IF NOT EXISTS idx_update_attachments_show_on_event ON tnf_summit.update_attachments (update_id, show_on_event) WHERE show_on_event = TRUE;
CREATE INDEX IF NOT EXISTS idx_update_attachments_show_in_resources ON tnf_summit.update_attachments (show_in_resources) WHERE show_in_resources = TRUE;

ALTER TABLE tnf_summit.update_attachments ENABLE ROW LEVEL SECURITY;

-- Public can read attachments for published updates
CREATE POLICY "public_read_attachments"
  ON tnf_summit.update_attachments FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tnf_summit.updates u
      WHERE u.id = update_attachments.update_id AND u.published = TRUE
    )
  );

-- Admins can do everything (authenticated with admin role or via service role)
CREATE POLICY "admin_all_attachments"
  ON tnf_summit.update_attachments FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
