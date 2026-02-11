/**
 * Supabase Server Client
 *
 * Creates a typed Supabase client configured for server-side usage
 * in Next.js App Router.
 *
 * Responsibilities:
 * - Attaches cookies for session persistence
 * - Enables RLS enforcement on server requests
 * - Used inside API routes and Server Components
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase/database.types";

/**
 * Creates a Supabase server client bound to the current request's cookies.
 *
 * This allows:
 * - Session-based authentication
 * - Proper RLS enforcement
 * - Cookie updates when Supabase refreshes tokens
 *
 * Must only be used in server contexts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Safe fallback in Server Components
          }
        },
      },
    }
  );
}