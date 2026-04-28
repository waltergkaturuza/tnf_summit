-- Donations (card + record-keeping). Run in Supabase SQL editor or via CLI after review.
-- Align RLS with your existing tnf_summit tables (e.g. authenticated read for admins).

create table if not exists tnf_summit.donations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  track_id text not null unique,
  donor_type text not null default 'individual'
    check (donor_type in ('individual', 'organisation')),
  first_name text not null default '',
  last_name text not null default '',
  organisation text,
  email text not null,
  phone text,
  category_key text not null default 'general',
  category_label text,
  amount_usd numeric(12, 2) not null check (amount_usd >= 1 and amount_usd <= 99999999.99),
  currency text not null default 'USD',
  payment_method text not null default 'card',
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'failed', 'refunded', 'partial')),
  message text,
  paid_at timestamptz,
  admin_notes text
);

create index if not exists donations_created_at_idx on tnf_summit.donations (created_at desc);
create index if not exists donations_payment_status_idx on tnf_summit.donations (payment_status);

alter table tnf_summit.donations enable row level security;

-- Example policies (adjust to match registrations):
-- create policy "donations_admin_select" on tnf_summit.donations for select to authenticated using (true);
-- create policy "donations_admin_update" on tnf_summit.donations for update to authenticated using (true);
-- Inserts are performed with the service role from /api/donate (bypasses RLS).

comment on table tnf_summit.donations is 'Voluntary donations; track_id correlates with iVeri Lite_Merchant_Trace (TNF-DON-*)';
