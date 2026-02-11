/**
 * Supabase Browser Client
 *
 * Creates and caches a typed Supabase client for use in
 * Client Components and browser-side logic.
 *
 * Uses the project's publishable key.
 *
 * Important:
 * - Safe to expose publishable key in browser
 * - Never use service_role key in frontend
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase/database.types";
let _browserClient: SupabaseClient<Database> | null = null;

/**
 * Returns a singleton Supabase browser client.
 *
 * Ensures only one client instance is created per browser session
 * to prevent duplicate connections.
 *
 * Throws if required environment variables are missing.
 */
export function getBrowserClient() {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  _browserClient = createBrowserClient<Database>(url, key);
  return _browserClient;
}