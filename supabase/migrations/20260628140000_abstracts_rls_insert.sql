-- Ensure public abstract submissions are allowed when using the anon key (optional fallback).
-- The app submits via service role on the server; run this if you rely on direct anon inserts.
SET search_path TO tnf_summit, public;

ALTER TABLE tnf_summit.abstracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_abstracts" ON tnf_summit.abstracts;
CREATE POLICY "public_insert_abstracts"
  ON tnf_summit.abstracts FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "admin_all_abstracts" ON tnf_summit.abstracts;
CREATE POLICY "admin_all_abstracts"
  ON tnf_summit.abstracts FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
