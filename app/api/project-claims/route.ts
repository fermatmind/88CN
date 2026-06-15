import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import {
  badRequest,
  methodNotAllowed,
  serviceUnavailable,
} from "@/lib/api/problem";
import { projectClaimSchema } from "@/lib/validation/project-claim";
import { checkForbiddenFields } from "@/lib/validation/shared";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();
  const instance = "/api/project-claims";

  // 1. Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      badRequest("Request body must be valid JSON.", instance, undefined, requestId),
      requestId
    );
  }

  // 2. Reject forbidden monetization/commercial fields
  const forbiddenError = checkForbiddenFields(body, "project-claims");
  if (forbiddenError) {
    return errorResponse(
      badRequest(forbiddenError, instance, undefined, requestId),
      requestId
    );
  }

  // 3. Zod strict validation
  const parsed = projectClaimSchema.safeParse(body);
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
        instance,
        fieldErrors,
        requestId
      ),
      requestId
    );
  }

  // 4. Check Supabase availability (only after valid payload)
  const client = getSupabaseClient();
  if (!client) {
    return errorResponse(
      serviceUnavailable(
        "Claim service is not configured. Set Supabase environment variables.",
        instance,
        requestId
      ),
      requestId
    );
  }

  const data = parsed.data;

  // 5. Insert
  const { error: insertError } = await client
    .from("project_claims")
    .insert({
      claim_method: data.claim_method,
      claim_evidence: [
        data.proof_url ? `Proof URL: ${data.proof_url}` : null,
        data.proof_note ? `Note: ${data.proof_note}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });

  if (insertError) {
    return errorResponse(
      serviceUnavailable(
        "Failed to save claim. Please try again later.",
        instance,
        requestId
      ),
      requestId
    );
  }

  // 6. Audit + notify (non-blocking)
  await recordAudit(client, "project_claim", {
    project_slug: data.project_slug,
    claim_method: data.claim_method,
    claimant_name: data.claimant_name,
  }, requestId);

  await recordNotification(client, "claim_received", {
    claimant_email: data.claimant_email,
    project_slug: data.project_slug,
  }, requestId);

  return success(
    { message: "Claim submitted for review." },
    requestId,
    201
  );
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("GET is not supported. Use POST.", "/api/project-claims", requestId),
    requestId
  );
}

export async function PUT() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("PUT is not supported. Use POST.", "/api/project-claims", requestId),
    requestId
  );
}

export async function DELETE() {
  const requestId = getOrCreateRequestId();
  return errorResponse(
    methodNotAllowed("DELETE is not supported.", "/api/project-claims", requestId),
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
    // Non-blocking
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
    // Non-blocking
  }
}
