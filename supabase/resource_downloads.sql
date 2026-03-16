-- ============================================================
-- Resource download tracking for admin statistics
-- ============================================================
SET search_path TO tnf_summit, public;

CREATE TABLE IF NOT EXISTS tnf_summit.resource_downloads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attachment_id UUID REFERENCES tnf_summit.update_attachments(id) ON DELETE SET NULL,
  media_file_id UUID,  -- optional, for media_files downloads
  resource_name TEXT NOT NULL,
  resource_url  TEXT NOT NULL,
  ip_hash       TEXT,  -- hashed for privacy
  user_agent    TEXT,
  referrer      TEXT
);

CREATE INDEX idx_resource_downloads_attachment ON tnf_summit.resource_downloads (attachment_id);
CREATE INDEX idx_resource_downloads_created ON tnf_summit.resource_downloads (created_at DESC);

ALTER TABLE tnf_summit.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Only authenticated (admin) can read
CREATE POLICY "admin_read_downloads"
  ON tnf_summit.resource_downloads FOR SELECT
  TO authenticated USING (TRUE);

-- Allow anon to insert (for tracking public downloads)
CREATE POLICY "anon_insert_downloads"
  ON tnf_summit.resource_downloads FOR INSERT
  TO anon, authenticated WITH CHECK (TRUE);
