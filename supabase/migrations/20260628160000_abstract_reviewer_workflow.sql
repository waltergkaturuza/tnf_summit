-- Abstract reviewer workflow: reviewer role, assignments, and graded reviews (1–30 rubric)
SET search_path TO tnf_summit, public;

DO $$ BEGIN
  ALTER TYPE tnf_summit.admin_role ADD VALUE 'reviewer';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE tnf_summit.admin_users
  ADD COLUMN IF NOT EXISTS institution TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS tnf_summit.abstract_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  abstract_id UUID NOT NULL REFERENCES tnf_summit.abstracts(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES tnf_summit.admin_users(id) ON DELETE CASCADE,
  UNIQUE (abstract_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_abstract_assignments_abstract ON tnf_summit.abstract_assignments (abstract_id);
CREATE INDEX IF NOT EXISTS idx_abstract_assignments_reviewer ON tnf_summit.abstract_assignments (reviewer_id);

CREATE TABLE IF NOT EXISTS tnf_summit.abstract_reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  abstract_id    UUID NOT NULL REFERENCES tnf_summit.abstracts(id) ON DELETE CASCADE,
  reviewer_id    UUID NOT NULL REFERENCES tnf_summit.admin_users(id) ON DELETE CASCADE,
  score          INT NOT NULL CHECK (score BETWEEN 1 AND 30),
  recommendation TEXT NOT NULL DEFAULT 'accept',
  confidence     TEXT DEFAULT 'medium',
  comments       TEXT DEFAULT '',
  UNIQUE (abstract_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_abstract_reviews_abstract ON tnf_summit.abstract_reviews (abstract_id);
CREATE INDEX IF NOT EXISTS idx_abstract_reviews_reviewer ON tnf_summit.abstract_reviews (reviewer_id);
CREATE INDEX IF NOT EXISTS idx_abstract_reviews_score ON tnf_summit.abstract_reviews (score);

CREATE TRIGGER trg_abstract_reviews_updated_at
  BEFORE UPDATE ON tnf_summit.abstract_reviews
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

ALTER TABLE tnf_summit.abstract_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.abstract_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_abstract_assignments" ON tnf_summit.abstract_assignments;
CREATE POLICY "admin_all_abstract_assignments"
  ON tnf_summit.abstract_assignments FOR ALL
  TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "admin_all_abstract_reviews" ON tnf_summit.abstract_reviews;
CREATE POLICY "admin_all_abstract_reviews"
  ON tnf_summit.abstract_reviews FOR ALL
  TO authenticated USING (TRUE) WITH CHECK (TRUE);
