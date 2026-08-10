-- Assessment booking + Meta attribution.
--
-- Apply via the Supabase dashboard SQL editor (migrations are drifted, so
-- `supabase db push` will fail).

-- 1. Persist the Meta leadgen_id on the lead. This is the key that ties a later
--    Stripe payment back to the ad. Without it the CAPI Purchase can't attribute
--    and Meta keeps optimising toward form-fills.
alter table if exists public.assessment_leads
  add column if not exists leadgen_id text,
  add column if not exists email      text,
  add column if not exists lead_tier  text;

create index if not exists assessment_leads_leadgen_id_idx
  on public.assessment_leads (leadgen_id)
  where leadgen_id is not null;

-- 2. Bookings. One row per lead from link-sent through to paid.
create table if not exists public.assessment_bookings (
  id                    bigint generated always as identity primary key,
  -- Stripe client_reference_id — "lg_<leadgenId>__ph_<e164digits>".
  -- Unique so the auto-send and a manual Telegram tap can't create two rows.
  client_ref            text not null unique,
  leadgen_id            text,
  name                  text,
  email                 text,
  phone                 text,
  status                text not null default 'link_sent',
  sent_via              text,
  amount                numeric(10,2),
  currency              text default 'AUD',
  stripe_session_id     text,
  stripe_payment_intent text,
  capi_status           text,
  link_sent_at          timestamptz,
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists assessment_bookings_status_idx  on public.assessment_bookings (status);
create index if not exists assessment_bookings_leadgen_idx on public.assessment_bookings (leadgen_id);
create index if not exists assessment_bookings_paid_at_idx on public.assessment_bookings (paid_at desc);

comment on column public.assessment_bookings.client_ref is
  'Stripe client_reference_id. Carries the Meta leadgen_id through checkout so the CAPI Purchase can attribute to the originating ad.';

-- 3. Locked down: every write goes through the service-role key in the API
--    routes, so no anon policy is granted.
alter table public.assessment_bookings enable row level security;
