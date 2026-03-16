-- ============================================================
-- TNF Summit — Updates & News table (run in Supabase SQL Editor)
-- ============================================================
SET search_path TO tnf_summit, public;

CREATE TYPE tnf_summit.update_type AS ENUM ('news', 'event');

CREATE TABLE IF NOT EXISTS tnf_summit.updates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  type         tnf_summit.update_type NOT NULL DEFAULT 'news',
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  link         TEXT DEFAULT '',
  image_url    TEXT DEFAULT '',
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  -- Legacy simple event date (kept for backwards-compatibility / filtering)
  event_date   DATE,
  -- New richer event metadata
  event_start_at   TIMESTAMPTZ,
  event_end_at     TIMESTAMPTZ,
  event_venue      TEXT,
  event_city       TEXT,
  event_country    TEXT,
  registration_type TEXT DEFAULT 'none',          -- none | external | internal
  registration_url  TEXT DEFAULT '',
  registration_page_slug TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,

  CONSTRAINT updates_title_not_empty CHECK (title <> '')
);

CREATE INDEX idx_updates_published ON tnf_summit.updates (published) WHERE published = TRUE;
CREATE INDEX idx_updates_published_at ON tnf_summit.updates (published_at DESC NULLS LAST);
CREATE INDEX idx_updates_type ON tnf_summit.updates (type);
CREATE INDEX idx_updates_event_start_at ON tnf_summit.updates (event_start_at);

ALTER TABLE tnf_summit.updates ENABLE ROW LEVEL SECURITY;

-- Public can read only published updates
CREATE POLICY "public_read_published_updates"
  ON tnf_summit.updates FOR SELECT
  TO anon, authenticated
  USING (published = TRUE);

-- Admins can do everything
CREATE POLICY "admin_all_updates"
  ON tnf_summit.updates FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Trigger updated_at
CREATE TRIGGER set_updated_at_updates
  BEFORE UPDATE ON tnf_summit.updates
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();
