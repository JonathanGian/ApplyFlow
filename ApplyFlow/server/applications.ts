import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase/database.types";
import type {
  ApplicationInsert,
  ApplicationRow,
  ApplicationStage,
  ApplicationUpdate,
} from "@/types/applications/application.type";

/**
 * Application Data Access Layer (DAL)
 *
 * Server-only functions that encapsulate database access and query building
 * for the `applications` table.
 */

/**
 * Sortable columns for the applications list query.
 */
export type ApplicationSortColumn =
  | "created_at"
  | "updated_at"
  | "company"
  | "role_title"
  | "stage";

/**
 * Direction for ordering list results.
 */
export type SortDirection = "asc" | "desc";

/**
 * Options for listing applications.
 */
export type ListApplicationsOptions = {
  /**
   * Filter results by stage.
   */
  stage?: ApplicationStage | null;

  /**
   * Text search across `company` and `role_title`.
   */
  q?: string | null;

  /**
   * Column to sort by.
   */
  sort: ApplicationSortColumn;

  /**
   * Sort direction.
   */
  dir: SortDirection;

  /**
   * Max number of results to return.
   */
  limit: number;

  /**
   * Offset into the result set.
   */
  offset: number;
};

/**
 * Result returned from listApplications.
 */
export type ListApplicationsResult = {
  applications: ApplicationRow[];
  total: number;
};

/**
 * Lists applications for a given user with pagination, filtering and sorting.
 *
 * @param supabase - An authenticated Supabase client (RLS enforced).
 * @param userId - Authenticated user's ID.
 * @param opts - Listing options (validated/sanitized by the caller).
 * @returns Paginated applications and total count.
 */
export async function listApplications(
  supabase: SupabaseClient<Database>,
  userId: string,
  opts: ListApplicationsOptions,
): Promise<ListApplicationsResult> {
  let query = supabase
    .from("applications")
    .select("*", { count: "exact" })
    .eq("created_by", userId);

  if (opts.stage) {
    query = query.eq("stage", opts.stage);
  }

  if (opts.q && opts.q.trim()) {
    const needle = opts.q.trim().replace(/[,]/g, " ");
    query = query.or(`company.ilike.*${needle}*,role_title.ilike.*${needle}*`);
  }

  const ascending = opts.dir === "asc";

  query = query
    .order(opts.sort, { ascending })
    .range(opts.offset, opts.offset + opts.limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    applications: (data ?? []) as ApplicationRow[],
    total: count ?? 0,
  };
}

/**
 * Creates a new application owned by the given user.
 *
 * Server-controlled fields:
 * - created_by
 * - id / created_at / updated_at are controlled by the database
 *
 * @param supabase - An authenticated Supabase client (RLS enforced).
 * @param userId - Authenticated user's ID.
 * @param input - Client-provided insert fields (validated/sanitized by caller).
 * @returns The created application row.
 */
export async function createApplication(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: Omit<ApplicationInsert, "created_by">,
): Promise<ApplicationRow> {
  const insertPayload: ApplicationInsert = {
    ...input,
    created_by: userId,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ApplicationRow;
}

/**
 * Fetches a single application by id, scoped to the authenticated owner.
 *
 * @param supabase - An authenticated Supabase client (RLS enforced).
 * @param userId - Authenticated user's ID.
 * @param id - Application id.
 * @returns The application row.
 */
export async function getApplicationById(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<ApplicationRow | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("created_by", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as ApplicationRow | null;
}

/**
 * Updates an application (partial update), scoped to the authenticated owner.
 *
 * @param supabase - An authenticated Supabase client (RLS enforced).
 * @param userId - Authenticated user's ID.
 * @param id - Application id.
 * @param patch - Update payload (validated/sanitized by caller).
 * @returns The updated application row.
 */
export async function updateApplication(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
  patch: ApplicationUpdate,
): Promise<ApplicationRow | null> {
  const { data, error } = await supabase
    .from("applications")
    .update(patch)
    .eq("id", id)
    .eq("created_by", userId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as ApplicationRow | null;
}

/**
 * Deletes an application, scoped to the authenticated owner.
 *
 * @param supabase - An authenticated Supabase client (RLS enforced).
 * @param userId - Authenticated user's ID.
 * @param id - Application id.
 * @returns The deleted application row (if found), otherwise null.
 */
export async function deleteApplication(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<ApplicationRow | null> {
  const { data, error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("created_by", userId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as ApplicationRow | null;
}
