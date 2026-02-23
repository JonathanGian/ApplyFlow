/**
 * Application Detail API Route
 *
 * Supported endpoints:
 * - GET    /api/applications/:id     -> Fetch a single application
 * - PATCH  /api/applications/:id     -> Update an application (partial)
 * - DELETE /api/applications/:id     -> Delete an application
 *
 * Authentication:
 * - Supports Bearer token (Postman / external clients)
 * - Supports cookie-based auth (browser sessions)
 *
 * Security:
 * - Enforces RLS via authenticated Supabase client
 * - Scopes all operations to the authenticated owner (`created_by`)
 */

import { NextResponse } from "next/server";
import { requireAuthedSupabase } from "@/server/auth";

import { isApplicationStage } from "@/types/applications/application.stage";
import type { ApplicationUpdate } from "@/types/applications/application.type";

import {
  deleteApplication,
  getApplicationById,
  updateApplication,
} from "@/server/applications";

/**
 * GET /api/applications/:id
 *
 * @param _request - Incoming Request.
 * @param context - Route context containing params.
 * @returns Application record (if owned by user), otherwise 404.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  let supabase;
  let user;

  try {
    ({ supabase, user } = await requireAuthedSupabase(_request));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const application = await getApplicationById(supabase, user.id, id);

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * PATCH /api/applications/:id
 *
 * Partial update. Only provided fields are updated.
 *
 * @param request - Incoming Request.
 * @param context - Route context containing params.
 * @returns Updated application (if owned by user), otherwise 404.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  let supabase;
  let user;

  try {
    ({ supabase, user } = await requireAuthedSupabase(request));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } = body as Partial<ApplicationUpdate>;

  // Validate types (only when provided)
  if (company != null && typeof company !== "string") {
    return NextResponse.json({ error: "company must be a string" }, { status: 400 });
  }
  if (role_title != null && typeof role_title !== "string") {
    return NextResponse.json({ error: "role_title must be a string" }, { status: 400 });
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
  if (stage != null && typeof stage !== "string") {
    return NextResponse.json({ error: "stage must be a string" }, { status: 400 });
  }
  if (typeof stage === "string" && !isApplicationStage(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
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

  // Build patch (only include provided keys)
  const patch: ApplicationUpdate = {};

  if (typeof company === "string") patch.company = company.trim();
  if (typeof role_title === "string") patch.role_title = role_title.trim();
  if (typeof job_url === "string") patch.job_url = job_url.trim();
  if (typeof stage === "string") patch.stage = stage;
  if (typeof applied_at === "string") patch.applied_at = applied_at;
  if (typeof next_follow_up_at === "string") patch.next_follow_up_at = next_follow_up_at;
  if (typeof salary_min === "number") patch.salary_min = salary_min;
  if (typeof salary_max === "number") patch.salary_max = salary_max;
  if (typeof location === "string") patch.location = location.trim();
  if (typeof remote_type === "string") patch.remote_type = remote_type.trim();
  if (typeof notes === "string") patch.notes = notes;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided" },
      { status: 400 },
    );
  }

  try {
    const updated = await updateApplication(supabase, user.id, id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/applications/:id
 *
 * @param request - Incoming Request.
 * @param context - Route context containing params.
 * @returns Deleted application (if owned by user), otherwise 404.
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  let supabase;
  let user;

  try {
    ({ supabase, user } = await requireAuthedSupabase(request));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await deleteApplication(supabase, user.id, id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application: deleted });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
