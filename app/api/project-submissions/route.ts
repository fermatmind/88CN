import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import {
  badRequest,
  methodNotAllowed,
  serviceUnavailable,
} from "@/lib/api/problem";
import {
  projectSubmissionSchema,
  type ProjectSubmissionInput,
} from "@/lib/validation/project-submission";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();

  const client = getSupabaseClient();
  if (!client) {
    return errorResponse(
      serviceUnavailable(
        "Submission service is not configured. Set Supabase environment variables.",
        "/api/project-submissions",
        requestId
      ),
      requestId
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      badRequest(
        "Request body must be valid JSON.",
        "/api/project-submissions",
        undefined,
        requestId
      ),
      requestId
    );
  }

  const parsed = projectSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return errorResponse(
      badRequest(
        "Validation failed. Check the errors field for details.",
        "/api/project-submissions",
        fieldErrors,
        requestId
      ),
      requestId
    );
  }

  const data = parsed.data;

  const { error: insertError } = await client
    .from("project_submissions")
    .insert({
      name: data.project_name,
      tagline: data.one_liner,
      website_url: data.website_url || null,
      github_url: data.github_url || null,
      category_slug: data.category_slug,
      submitter_note: [
        data.description,
        data.growth_note
          ? `Growth note: ${data.growth_note}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

  if (insertError) {
    return errorResponse(
      serviceUnavailable(
        "Failed to save submission. Please try again later.",
        "/api/project-submissions",
        requestId
      ),
      requestId
    );
  }

  await recordAudit(client, "project_submission", {
    project_name: data.project_name,
    category_slug: data.category_slug,
  }, requestId);

  await recordNotification(client, "submission_received", {
    founder_email: data.founder_email || null,
    project_name: data.project_name,
  }, requestId);

  return success(
    { message: "Project submitted for review." },
    requestId,
    201
  );
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("GET is not supported. Use POST.", "/api/project-submissions", requestId),
    requestId
  );
}

export async function PUT() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("PUT is not supported. Use POST.", "/api/project-submissions", requestId),
    requestId
  );
}

export async function DELETE() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("DELETE is not supported.", "/api/project-submissions", requestId),
    requestId
  );
}

async function recordAudit(
  client: ReturnType<typeof getSupabaseClient>,
  eventSource: string,
  payload: Record<string, unknown>,
  requestId: string
) {
  try {
    await client!.from("audit_events").insert({
      event_type: eventSource,
      event_source: eventSource,
      event_payload: payload,
      request_id: requestId,
    });
  } catch {
    // Audit failure is non-blocking
  }
}

async function recordNotification(
  client: ReturnType<typeof getSupabaseClient>,
  eventType: string,
  payload: Record<string, unknown>,
  requestId: string
) {
  try {
    await client!.from("notification_events").insert({
      event_type: eventType,
      payload,
      is_sent: false,
      request_id: requestId,
    });
  } catch {
    // Notification failure is non-blocking
  }
}
