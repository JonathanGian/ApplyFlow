import "server-only";

import {
  createClient as createSupabaseJsClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase/database.types";

/**
 * Server-side auth utilities.
 *
 * This module centralizes how API routes resolve an authenticated user and a
 * Supabase client bound to that user's auth context.
 *
 * Strategy:
 * 1) Prefer Bearer token (Postman / external clients)
 * 2) Fallback to cookie-based session (browser)
 */

export type AuthedSupabaseOk = { supabase: SupabaseClient<Database>; user: User };
export type AuthedSupabaseErr = { error: string };
export type AuthedSupabaseResult = AuthedSupabaseOk | AuthedSupabaseErr;

/**
 * Type guard for narrowing auth results.
 *
 * @param result - Auth result.
 * @returns True when result contains a Supabase client and user.
 */
export function isAuthedOk(result: AuthedSupabaseResult): result is AuthedSupabaseOk {
  return "supabase" in result;
}

/**
 * Extracts a Bearer token from the Authorization header.
 *
 * @param request - Incoming request.
 * @returns Token string, or null.
 */
export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token;
}

/**
 * Resolves an authenticated Supabase client + user.
 *
 * @param request - Incoming request.
 * @returns Authenticated client and user, or an error.
 */
export async function getAuthedSupabase(request: Request): Promise<AuthedSupabaseResult> {
  const bearer = getBearerToken(request);

  // 1) Prefer Bearer token for API clients like Postman.
  if (bearer) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return { error: "Server missing Supabase env vars" };
    }

    const supabase = createSupabaseJsClient<Database>(url, key, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${bearer}` } },
    });

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return { error: "Unauthorized" };
    }

    return { supabase, user: data.user };
  }

  // 2) Cookie-based session for normal browser flow.
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { error: "Unauthorized" };
  }

  return { supabase: supabase as unknown as SupabaseClient<Database>, user: data.user };
}

/**
 * Convenience helper that throws on unauthenticated requests.
 *
 * Use this at the top of route handlers to keep code minimal.
 *
 * @param request - Incoming request.
 * @returns Authenticated client and user.
 * @throws Error when unauthorized.
 */
export async function requireAuthedSupabase(request: Request): Promise<AuthedSupabaseOk> {
  const result = await getAuthedSupabase(request);
  if (!isAuthedOk(result)) {
    throw new Error(result.error);
  }
  return result;
}
