-- ============================================================
-- REQUIRED: Allow anonymous users to INSERT into registrations
-- The public registration form submits as anon. Without this
-- policy, registration will fail with RLS error 42501.
-- Run in Supabase Dashboard → SQL Editor → New Query
-- ============================================================
SET search_path TO tnf_summit, public;

ALTER TABLE tnf_summit.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_registrations" ON tnf_summit.registrations;
CREATE POLICY "anon_insert_registrations"
  ON tnf_summit.registrations FOR INSERT
  TO anon
  WITH CHECK (TRUE);
