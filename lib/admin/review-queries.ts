import { getAdminClient } from "@/lib/supabase/admin-server";

export interface SubmissionRow {
  id: string;
  name: string;
  tagline: string | null;
  website_url: string | null;
  github_url: string | null;
  category_slug: string | null;
  submitter_note: string | null;
  status: string;
  created_at: string;
}

export interface ClaimRow {
  id: string;
  project_id: string | null;
  claim_method: string;
  claim_evidence: string | null;
  status: string;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  status: string;
  index_status: string;
  claim_status: string;
}

export async function getPendingSubmissions(): Promise<SubmissionRow[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data } = await client
    .from("project_submissions")
    .select("id, name, tagline, website_url, github_url, category_slug, submitter_note, status, created_at")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  return (data ?? []) as SubmissionRow[];
}

export async function getSubmissionById(id: string): Promise<SubmissionRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("project_submissions")
    .select("id, name, tagline, website_url, github_url, category_slug, submitter_note, status, created_at")
    .eq("id", id)
    .single();

  return (data as SubmissionRow) ?? null;
}

export async function getPendingClaims(): Promise<ClaimRow[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data } = await client
    .from("project_claims")
    .select("id, project_id, claim_method, claim_evidence, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (data ?? []) as ClaimRow[];
}

export async function getClaimById(id: string): Promise<ClaimRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("project_claims")
    .select("id, project_id, claim_method, claim_evidence, status, created_at")
    .eq("id", id)
    .single();

  return (data as ClaimRow) ?? null;
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("projects")
    .select("id, slug, name, status, index_status, claim_status")
    .eq("slug", slug)
    .single();

  return (data as ProjectRow) ?? null;
}

export async function createProjectFromSubmission(sub: SubmissionRow): Promise<ProjectRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const slug = (sub.name || `project-${sub.id.slice(0, 8)}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data } = await client
    .from("projects")
    .insert({
      slug,
      name: sub.name,
      tagline: sub.tagline,
      website_url: sub.website_url,
      github_url: sub.github_url,
      category_id: null,
      status: "approved",
      index_status: "preview_noindex",
      claim_status: "unclaimed",
    })
    .select("id, slug, name, status, index_status, claim_status")
    .single();

  return (data as ProjectRow) ?? null;
}

export async function updateProjectStatus(
  projectId: string,
  status: string,
  indexStatus: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from("projects")
    .update({ status, index_status: indexStatus, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  return !error;
}

export async function updateClaimStatus(
  claimId: string,
  status: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from("project_claims")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", claimId);

  return !error;
}

export async function updateProjectClaimStatus(
  projectId: string,
  claimStatus: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from("projects")
    .update({ claim_status: claimStatus, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  return !error;
}

export async function insertAuditEvent(
  eventType: string,
  eventSource: string,
  payload: Record<string, unknown>,
  requestId?: string
): Promise<void> {
  const client = getAdminClient();
  if (!client) return;
  try {
    await client.from("audit_events").insert({
      event_type: eventType,
      event_source: eventSource,
      event_payload: payload,
      request_id: requestId ?? null,
    });
  } catch { /* non-blocking */ }
}

export async function insertNotificationEvent(
  eventType: string,
  payload: Record<string, unknown>,
  recipientHint: string | null,
  requestId?: string
): Promise<void> {
  const client = getAdminClient();
  if (!client) return;
  try {
    await client.from("notification_events").insert({
      event_type: eventType,
      payload,
      recipient_hint: recipientHint,
      is_sent: false,
      request_id: requestId ?? null,
    });
  } catch { /* non-blocking */ }
}
