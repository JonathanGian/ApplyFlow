/****
 * Application Domain Types
 *
 * Type helpers derived from Supabase-generated `Database` types.
 *
 * These types provide compile-time safety for:
 * - Selecting rows from `public.applications`
 * - Insert/update payloads
 * - Enum values (e.g., `application_stage`)
 */

import type { Database } from "@/types/supabase/database.types";

/**
 * Represents a row returned from `public.applications`.
 *
 * @returns The full row shape as defined in the database schema.
 */
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];

/**
 * Represents the allowed insert payload for `public.applications`.
 *
 * @returns The insertable column set as defined in the database schema.
 */
export type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];

/**
 * Represents the allowed update payload for `public.applications`.
 *
 * @returns The updatable column set as defined in the database schema.
 */
export type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"];

/**
 * Union type of all valid values for the `application_stage` enum.
 *
 * @returns The set of permitted enum values as string literals.
 */
export type ApplicationStage = Database["public"]["Enums"]["application_stage"];