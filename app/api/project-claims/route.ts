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
import { projectClaimSchema } from "@/lib/validation/project-claim";
import {
  checkForbiddenFields,
  checkHoneypotFields,
  CLAIM_HONEYPOT_FIELDS,
  validateUrlField,
  scanSuspiciousContent,
  MAX_BODY_SIZE_BYTES,
} from "@/lib/validation/shared";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();
  const instance = "/api/project-claims";

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
  } catch { /* Zod will catch */ }

  // 3. Forbidden monetization fields
  const forbiddenError = checkForbiddenFields(body, "project-claims");
  if (forbiddenError) {
    return errorResponse(
      badRequest(forbiddenError, instance, undefined, requestId),
      requestId
    );
  }

  // 4. Honeypot check
  const honeypotError = checkHoneypotFields(body, CLAIM_HONEYPOT_FIELDS);
  if (honeypotError) {
    return errorResponse(
      badRequest(honeypotError, instance, undefined, requestId),
      requestId
    );
  }

  // 5. URL protocol guard (proof_url)
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    const urlErr = validateUrlField(b["proof_url"] as string | undefined | null, "proof_url");
    if (urlErr) {
      return errorResponse(badRequest(urlErr, instance, undefined, requestId), requestId);
    }
  }

  // 6. Suspicious keyword scan
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    const kwErr = scanSuspiciousContent({
      proof_note: b["proof_note"] as string,
      claimant_role: b["claimant_role"] as string,
      proof_url: b["proof_url"] as string,
    });
    if (kwErr) {
      return errorResponse(badRequest(kwErr, instance, undefined, requestId), requestId);
    }
  }

  // 7. Zod strict validation
  const parsed = projectClaimSchema.safeParse(body);
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

  // 8. Check Supabase
  const client = getSupabaseClient();
  if (!client) {
    return errorResponse(
      serviceUnavailable("Claim service is not configured. Set Supabase environment variables.", instance, requestId),
      requestId
    );
  }

  const data = parsed.data;

  // 9. Insert
  const { error: insertError } = await client
    .from("project_claims")
    .insert({
      claim_method: data.claim_method,
      claim_evidence: [data.proof_url ? `Proof URL: ${data.proof_url}` : null, data.proof_note ? `Note: ${data.proof_note}` : null]
        .filter(Boolean)
        .join("\n"),
    });

  if (insertError) {
    return errorResponse(
      serviceUnavailable("Failed to save claim. Please try again later.", instance, requestId),
      requestId
    );
  }

  await recordAudit(client, "project_claim", {
    project_slug: data.project_slug,
    claim_method: data.claim_method,
    claimant_name: data.claimant_name,
  }, requestId);

  await recordNotification(client, "claim_received", {
    claimant_email: data.claimant_email,
    project_slug: data.project_slug,
  }, requestId);

  return success({ message: "Claim submitted for review." }, requestId, 201);
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("GET is not supported. Use POST.", "/api/project-claims", requestId), requestId);
}

export async function PUT() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("PUT is not supported. Use POST.", "/api/project-claims", requestId), requestId);
}

export async function DELETE() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("DELETE is not supported.", "/api/project-claims", requestId), requestId);
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
