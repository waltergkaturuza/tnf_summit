-- Youth Innovation Challenge applications (separate from delegate registrations)
SET search_path TO tnf_summit, public;

CREATE TABLE IF NOT EXISTS tnf_summit.innovation_applications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  track_id              TEXT NOT NULL UNIQUE,
  status                tnf_summit.registration_status NOT NULL DEFAULT 'pending',
  admin_notes           TEXT DEFAULT '',

  salutation            TEXT DEFAULT '',
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  gender                TEXT DEFAULT '',
  date_of_birth         DATE,
  nationality           TEXT DEFAULT '',
  email                 TEXT NOT NULL,
  phone                 TEXT DEFAULT '',
  whatsapp              TEXT DEFAULT '',
  country               TEXT DEFAULT '',
  city                  TEXT DEFAULT '',

  organisation          TEXT DEFAULT '',
  startup_name          TEXT NOT NULL,
  startup_stage         TEXT DEFAULT '',
  startup_description   TEXT NOT NULL,
  project_url           TEXT DEFAULT '',

  attendance_mode       TEXT NOT NULL DEFAULT 'in-person',
  excursions            TEXT[] DEFAULT '{}',
  excursion_count       INT NOT NULL DEFAULT 0,

  dietary_requirements  TEXT DEFAULT '',
  requires_accommodation BOOLEAN DEFAULT FALSE,
  arrival_date          DATE,
  departure_date        DATE,
  special_needs         TEXT DEFAULT '',

  payment_method        TEXT DEFAULT '',
  invoice_required      BOOLEAN DEFAULT TRUE,
  billing_organisation  TEXT DEFAULT '',
  base_fee_usd          INT NOT NULL DEFAULT 200,
  excursion_fee_usd     INT NOT NULL DEFAULT 0,
  fee_amount            INT NOT NULL DEFAULT 200,
  payment_status        tnf_summit.payment_status NOT NULL DEFAULT 'unpaid',

  privacy_consent       BOOLEAN NOT NULL DEFAULT FALSE,
  photo_consent         BOOLEAN DEFAULT FALSE,
  newsletter_opt_in     BOOLEAN DEFAULT FALSE,
  terms_accepted        BOOLEAN NOT NULL DEFAULT FALSE,

  CONSTRAINT innovation_email_not_empty CHECK (email <> ''),
  CONSTRAINT innovation_name_not_empty CHECK (first_name <> '' AND last_name <> ''),
  CONSTRAINT innovation_startup_not_empty CHECK (startup_name <> '' AND startup_description <> '')
);

CREATE INDEX IF NOT EXISTS idx_innovation_track_id ON tnf_summit.innovation_applications (track_id);
CREATE INDEX IF NOT EXISTS idx_innovation_email ON tnf_summit.innovation_applications (email);
CREATE INDEX IF NOT EXISTS idx_innovation_status ON tnf_summit.innovation_applications (status);
CREATE INDEX IF NOT EXISTS idx_innovation_created ON tnf_summit.innovation_applications (created_at DESC);

CREATE TRIGGER trg_innovation_applications_updated_at
  BEFORE UPDATE ON tnf_summit.innovation_applications
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

ALTER TABLE tnf_summit.innovation_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_innovation_applications"
  ON tnf_summit.innovation_applications FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Extend public track lookup to include innovation applications
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
    UNION ALL
    (SELECT 'innovation'::TEXT AS track_type, i.status::TEXT AS status, (i.first_name || ' ' || i.last_name)::TEXT AS title_or_name
     FROM tnf_summit.innovation_applications i
     WHERE i.track_id = p_track_id
     LIMIT 1)
  ) sub
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION tnf_summit.get_track_status(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION tnf_summit.get_track_status(TEXT) TO authenticated;
