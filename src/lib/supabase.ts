import { createClient } from "@supabase/supabase-js";

// Server-side client with service role — full write access. NEVER import in client code.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("SUPABASE env missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

// Browser client — anon key, RLS enforced.
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}
