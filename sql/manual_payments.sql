-- Run in the Supabase SQL editor.
--
-- WHAT IT IS FOR
-- Most programme money arrives by bank transfer. A bank feed carries a date, an
-- amount and a reference line, and never an email, so Meta could not match
-- those buyers. The pixel was therefore trained on card payers only, which is
-- roughly a third of real customers and a biased third.
--
-- `/paid <email|phone> <amount> [product]` in Telegram is the human step that
-- supplies the identity. It fires the Meta event and writes a row here, which
-- also gives the business its first structured answer to "what is a customer
-- worth". Bank statements alone cannot answer that.
--
-- Until this table exists the command still works and still reaches Meta; it
-- just replies saying the row was not saved.

create table if not exists public.manual_payments (
  id          bigint generated always as identity primary key,
  -- Whatever was typed: an email or a phone number.
  identifier  text not null,
  matched_on  text not null check (matched_on in ('email', 'phone')),
  amount      numeric(10, 2) not null check (amount > 0),
  currency    text not null default 'AUD',
  product     text,
  -- Purchase for an assessment, ProgrammeStart for an enrolment.
  event_name  text not null,
  -- Deterministic per person, amount and day, so logging the same payment
  -- twice cannot double count it in Meta.
  event_id    text not null unique,
  capi_ok     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Holds customer contact details and amounts, so only the service role should
-- read it. RLS on with no policies denies anon and authenticated outright.
alter table public.manual_payments enable row level security;

-- "What has this customer paid us" and "what came in this month".
create index if not exists manual_payments_identifier_idx
  on public.manual_payments (identifier);
create index if not exists manual_payments_created_at_idx
  on public.manual_payments (created_at desc);

comment on table public.manual_payments is
  'Payments taken outside Stripe, logged by hand through the Telegram /paid command. Fires the Meta Purchase or ProgrammeStart event and doubles as the customer revenue record.';
