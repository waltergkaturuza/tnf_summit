-- ============================================================
-- Allow anonymous users to INSERT into registrations
-- (Public registration form submits as anon)
-- Run this in Supabase SQL Editor if registration form returns 401 RLS error
-- ============================================================
SET search_path TO tnf_summit, public;

-- Ensure RLS is enabled
ALTER TABLE tnf_summit.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new registrations (public form)
DROP POLICY IF EXISTS "anon_insert_registrations" ON tnf_summit.registrations;
CREATE POLICY "anon_insert_registrations"
  ON tnf_summit.registrations FOR INSERT
  TO anon
  WITH CHECK (TRUE);
