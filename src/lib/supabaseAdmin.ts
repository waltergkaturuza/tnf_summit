/**
 * Server-side Supabase client with service role.
 * Bypasses RLS, use only for trusted server operations (e.g. public registration form).
 * NEVER expose this client to the browser.
 */
import { createClient } from "@supabase/supabase-js";

/** Vercel Supabase integration often sets `SUPABASE_URL`; app also supports `NEXT_PUBLIC_SUPABASE_URL`. */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.SUPABASE_URL?.trim() ||
  "";
/** Prefer `SUPABASE_SERVICE_ROLE_KEY`; Vercel / Supabase integrations sometimes expose the same secret as `SUPABASE_SECRET_KEY`. */
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.SUPABASE_SECRET_KEY?.trim() ||
  "";

export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;
