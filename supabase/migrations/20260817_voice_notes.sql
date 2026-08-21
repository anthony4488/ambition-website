-- Voice-note inbox: one row per inbound WhatsApp voice note.
-- The unique wa_message_id is load-bearing — it is the idempotency lock that
-- stops Meta's webhook retries from transcribing (and replying) twice.

create table if not exists public.voice_notes (
  id            uuid primary key default gen_random_uuid(),
  wa_message_id text        not null unique,
  from_number   text        not null,
  status        text        not null default 'processing',
  transcript    text,
  message       text,
  error         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists voice_notes_created_at_idx
  on public.voice_notes (created_at desc);

-- Server-side only (service role). No anon/authenticated policies, so RLS
-- denies everything else by default.
alter table public.voice_notes enable row level security;
