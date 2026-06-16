import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import {
  badRequest,
  methodNotAllowed,
  serviceUnavailable,
  payloadTooLarge,
} from "@/lib/api/problem";
import { projectSubmissionSchema } from "@/lib/validation/project-submission";
import {
  checkForbiddenFields,
  checkHoneypotFields,
  SUBMISSION_HONEYPOT_FIELDS,
  validateUrlField,
  validateCategorySlug,
  scanSuspiciousContent,
  MAX_BODY_SIZE_BYTES,
} from "@/lib/validation/shared";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();
  const instance = "/api/project-submissions";

  // 1. Body size guard
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE_BYTES) {
    return errorResponse(
      payloadTooLarge(
        `Request body exceeds ${MAX_BODY_SIZE_BYTES / 1024}KB limit.`,
        instance,
        requestId
      ),
      requestId
    );
  }

  // 2. Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      badRequest("Request body must be valid JSON.", instance, undefined, requestId),
      requestId
    );
  }

  // Post-parse size check
  try {
    const serialized = JSON.stringify(body);
    if (serialized.length > MAX_BODY_SIZE_BYTES) {
      return errorResponse(
        payloadTooLarge(
          `Request body exceeds ${MAX_BODY_SIZE_BYTES / 1024}KB limit.`,
          instance,
          requestId
        ),
        requestId
      );
    }
  } catch {
    // Cannot stringify, let Zod handle it
  }

  // 3. Reject forbidden monetization fields
  const forbiddenError = checkForbiddenFields(body, "project-submissions");
  if (forbiddenError) {
    return errorResponse(
      badRequest(forbiddenError, instance, undefined, requestId),
      requestId
    );
  }

  // 4. Honeypot check
  const honeypotError = checkHoneypotFields(body, SUBMISSION_HONEYPOT_FIELDS);
  if (honeypotError) {
    return errorResponse(
      badRequest(honeypotError, instance, undefined, requestId),
      requestId
    );
  }

  // 5. URL protocol guards
  const urlFields = [
    "website_url", "founder_public_url", "github_url",
    "docs_url", "pricing_url", "launch_url",
  ];
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    for (const field of urlFields) {
      const err = validateUrlField(b[field] as string | undefined | null, field);
      if (err) {
        return errorResponse(badRequest(err, instance, undefined, requestId), requestId);
      }
    }
  }

  // 6. Category slug allowlist
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    const catErr = validateCategorySlug(b["category_slug"] as string | undefined);
    if (catErr) {
      return errorResponse(badRequest(catErr, instance, undefined, requestId), requestId);
    }
  }

  // 7. Suspicious keyword scan
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    const kwErr = scanSuspiciousContent({
      project_name: b["project_name"] as string,
      one_liner: b["one_liner"] as string,
      description: b["description"] as string,
      growth_note: b["growth_note"] as string,
    });
    if (kwErr) {
      return errorResponse(badRequest(kwErr, instance, undefined, requestId), requestId);
    }
  }

  // 8. Zod strict validation
  const parsed = projectSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return errorResponse(
      badRequest("Validation failed. Check the errors field for details.", instance, fieldErrors, requestId),
      requestId
    );
  }

  // 9. Check Supabase
  const client = getSupabaseClient();
  if (!client) {
    return errorResponse(
      serviceUnavailable("Submission service is not configured. Set Supabase environment variables.", instance, requestId),
      requestId
    );
  }

  const data = parsed.data;

  // 10. Insert
  const { error: insertError } = await client
    .from("project_submissions")
    .insert({
      name: data.project_name,
      tagline: data.one_liner,
      website_url: data.website_url || null,
      github_url: data.github_url || null,
      category_slug: data.category_slug,
      submitter_note: [data.description, data.growth_note ? `Growth note: ${data.growth_note}` : null]
        .filter(Boolean)
        .join("\n\n"),
    });

  if (insertError) {
    return errorResponse(
      serviceUnavailable("Failed to save submission. Please try again later.", instance, requestId),
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

  return success({ message: "Project submitted for review." }, requestId, 201);
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("GET is not supported. Use POST.", "/api/project-submissions", requestId), requestId);
}

export async function PUT() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("PUT is not supported. Use POST.", "/api/project-submissions", requestId), requestId);
}

export async function DELETE() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("DELETE is not supported.", "/api/project-submissions", requestId), requestId);
}

async function recordAudit(
  client: ReturnType<typeof getSupabaseClient>,
  eventSource: string,
  payload: Record<string, unknown>,
  requestId: string
) {
  try {
    await client!.from("audit_events").insert({
      event_type: eventSource, event_source: eventSource,
      event_payload: payload, request_id: requestId,
    });
  } catch { /* non-blocking */ }
}

async function recordNotification(
  client: ReturnType<typeof getSupabaseClient>,
  eventType: string,
  payload: Record<string, unknown>,
  requestId: string
) {
  try {
    await client!.from("notification_events").insert({
      event_type: eventType, payload, is_sent: false, request_id: requestId,
    });
  } catch { /* non-blocking */ }
}
