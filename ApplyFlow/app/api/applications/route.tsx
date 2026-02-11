import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

type AuthedSupabaseResult =
  | { supabase: SupabaseClient; user: User; error: null }
  | { supabase: null; user: null; error: string };

// Allowlist the only columns we permit clients to sort by.
const ALLOWED_SORT_COLUMNS = new Set([
  "created_at",
  "updated_at",
  "company",
  "role_title",
  "stage",
]);

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

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

    const supabase = createSupabaseClient(url, key);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return { supabase: null, user: null, error: "Unauthorized" };
    }

    // Ensure all DB queries run as this user
    const authed = createSupabaseClient(url, key, {
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

export async function GET(request: Request) {
  const auth = await getAuthedSupabase(request);

  if (auth.error || !auth.supabase || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = auth.supabase;
  const user = auth.user;

  const { searchParams } = new URL(request.url);

  // Filters
  const stage = searchParams.get("stage");
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
  if (stage && stage.length > 64) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }
  if (q && q.length > 100) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
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