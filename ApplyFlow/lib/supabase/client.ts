import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Keep a single browser client instance to avoid multiple GoTrueClient instances
// fighting over the same storage key (can cause flaky auth behavior).
let _browserClient: SupabaseClient | null = null;

export function getBrowserClient() {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  _browserClient = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _browserClient;
}

// Back-compat alias (older imports in the codebase)
export const createBrowserClient = getBrowserClient;