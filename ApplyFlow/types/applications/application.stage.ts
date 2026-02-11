
/**
 * Application Stage Utilities
 *
 * Provides a runtime allowlist and type guard for the `application_stage` enum.
 *
 * Why this exists:
 * - Supabase-generated enum types are compile-time only.
 * - Query params are runtime strings and must be validated at runtime.
 */
import type { Database } from "@/types/supabase/database.types";

/**
 * Runtime allowlist of valid application stages.
 *
 * This list is used for runtime validation (e.g., API query params, form inputs).
 **/
export const APPLICATION_STAGES = [
  "Interested",
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Onsite Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Accepted",
] as const satisfies readonly ApplicationStage[];

export type ApplicationStage = Database["public"]["Enums"]["application_stage"];

/**
 * Type guard that validates whether a string is a valid ApplicationStage.
 *
 * @param v - The string value to validate.
 * @returns True if `v` is a valid `ApplicationStage`, otherwise false.
 **/
export function isApplicationStage(v: string): v is ApplicationStage {
  return (APPLICATION_STAGES as readonly string[]).includes(v);
}