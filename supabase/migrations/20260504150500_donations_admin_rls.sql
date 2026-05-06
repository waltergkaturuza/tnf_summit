-- Ensure admin users can read/update donations in the dashboard.
-- Safe to run multiple times.

set search_path to tnf_summit, public;

alter table if exists tnf_summit.donations enable row level security;

drop policy if exists "donations_admin_select" on tnf_summit.donations;
create policy "donations_admin_select"
  on tnf_summit.donations
  for select
  to authenticated
  using (true);

drop policy if exists "donations_admin_update" on tnf_summit.donations;
create policy "donations_admin_update"
  on tnf_summit.donations
  for update
  to authenticated
  using (true)
  with check (true);
