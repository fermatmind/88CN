import { NextRequest } from "next/server";
import { checkAdminGuard } from "@/lib/auth/admin";
import { getAdminClient } from "@/lib/supabase/admin-server";
import { getOrCreateRequestId } from "@/lib/api/request-id";
import { success, errorResponse } from "@/lib/api/response";
import { unauthorized, forbidden, serviceUnavailable } from "@/lib/api/problem";

export async function GET() {
  const requestId = getOrCreateRequestId();
  const instance = "/api/admin/external-imports";
  const guard = await checkAdminGuard();

  if (!guard.isAuthenticated) {
    return errorResponse(unauthorized("Authentication required.", instance, requestId), requestId);
  }
  if (!guard.isAdmin) {
    return errorResponse(forbidden("Admin privileges required.", instance, requestId), requestId);
  }

  const client = getAdminClient();
  if (!client) {
    return errorResponse(serviceUnavailable("Admin service is not configured.", instance, requestId), requestId);
  }

  const { data, error } = await client
    .from("external_project_imports")
    .select("id, source_name, source_url, status, import_fingerprint, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return errorResponse(serviceUnavailable("Failed to fetch imports.", instance, requestId), requestId);
  }

  return success(data ?? [], requestId);
}
