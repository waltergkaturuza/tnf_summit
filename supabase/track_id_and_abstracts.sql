-- ============================================================
-- TNF Summit — Track IDs + Abstracts (run in Supabase SQL Editor)
-- ============================================================
SET search_path TO tnf_summit, public;

-- 1) Add track_id to registrations (format: TNF-REG-DDMMYY-XXXXXX)
ALTER TABLE tnf_summit.registrations
  ADD COLUMN IF NOT EXISTS track_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_registrations_track_id ON tnf_summit.registrations (track_id);

-- Backfill existing rows with a deterministic id (optional; new inserts get proper format)
-- UPDATE tnf_summit.registrations SET track_id = 'REG-' || UPPER(SUBSTRING(id::TEXT, 1, 8)) WHERE track_id IS NULL;

-- 2) Abstracts table
CREATE TYPE tnf_summit.abstract_participation AS ENUM ('oral', 'poster', 'panel', 'workshop', 'other');
CREATE TYPE tnf_summit.abstract_status AS ENUM ('submitted', 'under_review', 'accepted', 'rejected');

CREATE TABLE IF NOT EXISTS tnf_summit.abstracts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  track_id        TEXT NOT NULL UNIQUE,

  theme_id        TEXT NOT NULL,
  title           TEXT NOT NULL,
  abstract_text   TEXT NOT NULL,
  keywords        TEXT[] DEFAULT '{}',
  word_count      INT NOT NULL DEFAULT 0,
  participation   tnf_summit.abstract_participation NOT NULL DEFAULT 'oral',
  document_url    TEXT DEFAULT '',
  file_name       TEXT DEFAULT '',

  gender          TEXT DEFAULT '',
  date_of_birth   DATE,
  country         TEXT NOT NULL DEFAULT '',
  institution     TEXT NOT NULL DEFAULT '',
  t_shirt_size    TEXT DEFAULT '',
  co_authors      JSONB DEFAULT '[]',

  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT DEFAULT '',
  status          tnf_summit.abstract_status NOT NULL DEFAULT 'submitted',
  admin_notes      TEXT DEFAULT '',

  CONSTRAINT abstracts_title_not_empty CHECK (title <> ''),
  CONSTRAINT abstracts_abstract_not_empty CHECK (abstract_text <> ''),
  CONSTRAINT abstracts_email_not_empty CHECK (email <> '')
);

CREATE INDEX idx_abstracts_track_id   ON tnf_summit.abstracts (track_id);
CREATE INDEX idx_abstracts_theme_id  ON tnf_summit.abstracts (theme_id);
CREATE INDEX idx_abstracts_status    ON tnf_summit.abstracts (status);
CREATE INDEX idx_abstracts_created  ON tnf_summit.abstracts (created_at DESC);

ALTER TABLE tnf_summit.abstracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_abstracts"
  ON tnf_summit.abstracts FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "admin_all_abstracts"
  ON tnf_summit.abstracts FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- RPC: public track status lookup (returns only type + status for a given track_id)
CREATE OR REPLACE FUNCTION tnf_summit.get_track_status(p_track_id TEXT)
RETURNS TABLE(track_type TEXT, status TEXT, title_or_name TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = tnf_summit
AS $$
  SELECT sub.track_type, sub.status, sub.title_or_name
  FROM (
    (SELECT 'registration'::TEXT AS track_type, r.status::TEXT AS status, (r.first_name || ' ' || r.last_name)::TEXT AS title_or_name
     FROM tnf_summit.registrations r
     WHERE r.track_id = p_track_id
     LIMIT 1)
    UNION ALL
    (SELECT 'abstract'::TEXT AS track_type, a.status::TEXT AS status, a.title::TEXT AS title_or_name
     FROM tnf_summit.abstracts a
     WHERE a.track_id = p_track_id
     LIMIT 1)
  ) sub
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION tnf_summit.get_track_status(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION tnf_summit.get_track_status(TEXT) TO authenticated;

CREATE TRIGGER set_updated_at_abstracts
  BEFORE UPDATE ON tnf_summit.abstracts
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();
