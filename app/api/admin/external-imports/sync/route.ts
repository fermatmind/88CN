import { NextRequest } from "next/server";
import { checkAdminGuard } from "@/lib/auth/admin";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import { badRequest, unauthorized, forbidden, methodNotAllowed, serviceUnavailable } from "@/lib/api/problem";
import { syncExternalImports } from "@/lib/index-data/sync";

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId();
  const instance = "/api/admin/external-imports/sync";
  const guard = await checkAdminGuard();

  if (!guard.isAuthenticated) {
    return errorResponse(unauthorized("Authentication required.", instance, requestId), requestId);
  }
  if (!guard.isAdmin) {
    return errorResponse(forbidden("Admin privileges required.", instance, requestId), requestId);
  }

  let source = "local";
  let dryRun = true;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      source = body?.source || "local";
      dryRun = body?.dry_run !== false;
    } catch {
      return errorResponse(badRequest("Request body must be valid JSON.", instance, undefined, requestId), requestId);
    }
  } else {
    try {
      const fd = await request.formData();
      source = (fd.get("source") as string) || "local";
      dryRun = fd.get("dry_run") !== "false";
    } catch {
      source = "local";
    }
  }

  if (source !== "local" && source !== "github") {
    return errorResponse(badRequest('source must be "local" or "github".', instance, undefined, requestId), requestId);
  }

  const result = await syncExternalImports(source as "local" | "github", dryRun);
  if (!dryRun && result.errors.some((message) => message.includes("Supabase admin client not configured"))) {
    return errorResponse(serviceUnavailable("Admin service is not configured.", instance, requestId), requestId);
  }

  return success(result, requestId);
}

export async function GET() {
  const requestId = getOrCreateRequestId();
  return errorResponse(methodNotAllowed("GET is not supported. Use POST.", "/api/admin/external-imports/sync", requestId), requestId);
}
