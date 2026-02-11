/**
 * Applications API Route
 *
 * Handles CRUD operations for job applications.
 *
 * Supported endpoints:
 * - GET    /api/applications        -> List applications (pagination, filtering, sorting)
 * - POST   /api/applications        -> Create new application
 *
 * Authentication:
 * - Supports Bearer token (Postman / external clients)
 * - Supports cookie-based auth (browser sessions)
 *
 * Security:
 * - Enforces RLS via authenticated Supabase client
 * - Validates enum values at runtime
 * - Uses allowlists for sorting
 */
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase/database.types";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isApplicationStage } from "@/types/applications/application.stage";
import type { ApplicationStage } from "@/types/applications/application.stage";
import type { ApplicationInsert } from "@/types/applications/application.type";
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

/**
 * Result type returned by getAuthedSupabase.
 * Ensures route handlers only execute when a user is authenticated.
 */
type AuthedSupabaseResult =
  | { supabase: SupabaseClient<Database>; user: User; error: null }
  | { supabase: null; user: null; error: string };

// Allowlist the only columns we permit clients to sort by.
const ALLOWED_SORT_COLUMNS = new Set([
  "created_at",
  "updated_at",
  "company",
  "role_title",
  "stage",
]);

/**
 * Safely parses a query param into an integer.
 * Falls back to a default value if parsing fails.
 */
function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Safely narrows a string query param into a valid ApplicationStage enum.
 * Returns null if the value is invalid.
 */
function asStage(value: string | null): ApplicationStage | null {
  if (!value) return null;
  return isApplicationStage(value) ? value : null;
}

/**
 * Resolves an authenticated Supabase client.
 *
 * Strategy:
 * 1. Prefer Bearer token (useful for API testing / Postman)
 * 2. Fallback to cookie-based session (browser flow)
 *
 * Ensures all database queries run under the authenticated user's context.
 */
async function getAuthedSupabase(request: Request): Promise<AuthedSupabaseResult> {
  // 1) Prefer Bearer token (useful for Postman/testing)
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = bearerMatch?.[1];

  if (accessToken) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return { supabase: null, user: null, error: "Server missing Supabase env" };
    }

    const supabase = createSupabaseClient<Database>(url, key);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return { supabase: null, user: null, error: "Unauthorized" };
    }

    // Ensure all DB queries run as this user
    const authed = createSupabaseClient<Database>(url, key, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    return { supabase: authed, user, error: null };
  }

  // 2) Fallback: cookie-based auth (normal browser app flow)
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, user: null, error: "Unauthorized" };
  }

  return { supabase, user, error: null };
}

/**
 * GET /api/applications
 *
 * @Returns paginated list of applications for the authenticated user.
 *
 * @Params (query params for filtering, sorting, pagination):
 * - stage   -> filter by enum value
 * - q       -> text search (company, role_title)
 * - sort    -> allowed column name
 * - dir     -> asc | desc
 * - limit   -> page size (1-100)
 * - offset  -> pagination offset
 */
export async function GET(request: Request) {
  const auth = await getAuthedSupabase(request);

  if (auth.error || !auth.supabase || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = auth.supabase;
  const user = auth.user;

  const { searchParams } = new URL(request.url);

  // Filters
  const stageParam = searchParams.get("stage");
  const stage = asStage(stageParam);
  const q = searchParams.get("q");

  // Sorting
  const sortParam = searchParams.get("sort") ?? "created_at";
  const dirParam = (searchParams.get("dir") ?? "desc").toLowerCase();

  const sort = ALLOWED_SORT_COLUMNS.has(sortParam) ? sortParam : "created_at";
  const ascending = dirParam === "asc";

  // Pagination
  const limit = Math.min(
    Math.max(toInt(searchParams.get("limit"), DEFAULT_LIMIT), 1),
    MAX_LIMIT,
  );
  const offset = Math.max(toInt(searchParams.get("offset"), 0), 0);

  // Basic input hardening
  if (q && q.length > 100) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  if (stageParam && !stage) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }

  // Build query
  let query = supabase
    .from("applications")
    // exact count is helpful for pagination UI
    .select("*", { count: "exact" })
    .eq("created_by", user.id);

  if (stage) {
    query = query.eq("stage", stage);
  }

  // Simple search across company + role_title
  if (q && q.trim()) {
    const needle = q.trim().replace(/[,]/g, " ");
    query = query.or(`company.ilike.*${needle}*,role_title.ilike.*${needle}*`);
  }

  // Order + range (offset pagination)
  query = query.order(sort, { ascending }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    applications: data ?? [],
    page: {
      limit,
      offset,
      sort,
      dir: ascending ? "asc" : "desc",
      total: count ?? 0,
    },
  });
}

/**
 * POST /api/applications
 *
 * Creates a new application for the authenticated user.
 *
 * Required fields:
 * - company
 * - role_title
 *
 * Optional fields:
 * - stage (defaults to "Interested")
 * - notes
 * - applied_at
 */
export async function POST(request: Request) {
  const auth = await getAuthedSupabase(request);

  if (auth.error || !auth.supabase || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = auth.supabase;
  const user = auth.user;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    company,
    role_title,
    job_url,
    stage,
    applied_at,
    next_follow_up_at,
    salary_min,
    salary_max,
    location,
    remote_type,
    notes,
  } = body as Partial<ApplicationInsert>;

  if (!company || typeof company !== "string") {
    return NextResponse.json({ error: "Company is required" }, { status: 400 });
  }

  if (!role_title || typeof role_title !== "string") {
    return NextResponse.json({ error: "Role title is required" }, { status: 400 });
  }

  if (job_url != null && typeof job_url !== "string") {
    return NextResponse.json({ error: "job_url must be a string" }, { status: 400 });
  }

  if (applied_at != null && typeof applied_at !== "string") {
    return NextResponse.json({ error: "applied_at must be a string (YYYY-MM-DD)" }, { status: 400 });
  }

  if (next_follow_up_at != null && typeof next_follow_up_at !== "string") {
    return NextResponse.json(
      { error: "next_follow_up_at must be a string (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  if (salary_min != null && typeof salary_min !== "number") {
    return NextResponse.json({ error: "salary_min must be a number" }, { status: 400 });
  }

  if (salary_max != null && typeof salary_max !== "number") {
    return NextResponse.json({ error: "salary_max must be a number" }, { status: 400 });
  }

  if (location != null && typeof location !== "string") {
    return NextResponse.json({ error: "location must be a string" }, { status: 400 });
  }

  if (remote_type != null && typeof remote_type !== "string") {
    return NextResponse.json({ error: "remote_type must be a string" }, { status: 400 });
  }

  if (notes != null && typeof notes !== "string") {
    return NextResponse.json({ error: "notes must be a string" }, { status: 400 });
  }

  if (
    typeof salary_min === "number" &&
    typeof salary_max === "number" &&
    salary_min > salary_max
  ) {
    return NextResponse.json(
      { error: "salary_min cannot be greater than salary_max" },
      { status: 400 },
    );
  }

  if (stage && !isApplicationStage(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }

  const insertPayload: ApplicationInsert = {
    company: company.trim(),
    role_title: role_title.trim(),
    job_url: typeof job_url === "string" ? job_url.trim() : null,
    stage: stage ?? "Interested",
    applied_at: typeof applied_at === "string" ? applied_at : null,
    next_follow_up_at:
      typeof next_follow_up_at === "string" ? next_follow_up_at : null,
    salary_min: typeof salary_min === "number" ? salary_min : null,
    salary_max: typeof salary_max === "number" ? salary_max : null,
    location: typeof location === "string" ? location.trim() : null,
    remote_type: typeof remote_type === "string" ? remote_type.trim() : null,
    notes: typeof notes === "string" ? notes : null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ application: data }, { status: 201 });
}