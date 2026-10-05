import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client (service role). Used by lead/nurture routes.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin not configured");
  // no-store: Next 14 caches fetch() in GET route handlers (crons included), and a cached read once hid a fresh row
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
