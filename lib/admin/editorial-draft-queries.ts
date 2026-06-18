import { getAdminClient } from "@/lib/supabase/admin-server";
import {
  nextEditorialDraftStatus,
  toEditorialDraftInsert,
  type EditorialDraftAction,
  type EditorialDraftInput,
} from "@/lib/editorial/draft-pipeline";

export interface EditorialDraftRow {
  id: string;
  project_id: string;
  source_job_id: string | null;
  status: string;
  draft_title: string | null;
  draft_note: string;
  draft_growth_opportunity: string | null;
  reviewer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  projects?: {
    slug: string;
    name: string;
    status: string;
    index_status: string;
  } | null;
}

export async function getEditorialDrafts(): Promise<EditorialDraftRow[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data } = await client
    .from("editorial_drafts")
    .select("id, project_id, source_job_id, status, draft_title, draft_note, draft_growth_opportunity, reviewer_note, reviewed_at, created_at, projects(slug, name, status, index_status)")
    .in("status", ["draft", "pending_review", "needs_info"])
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as EditorialDraftRow[];
}

export async function getEditorialDraftById(id: string): Promise<EditorialDraftRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("editorial_drafts")
    .select("id, project_id, source_job_id, status, draft_title, draft_note, draft_growth_opportunity, reviewer_note, reviewed_at, created_at, projects(slug, name, status, index_status)")
    .eq("id", id)
    .single();

  return (data as unknown as EditorialDraftRow) ?? null;
}

export async function createEditorialDraft(input: EditorialDraftInput): Promise<EditorialDraftRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("editorial_drafts")
    .insert(toEditorialDraftInsert(input))
    .select("id, project_id, source_job_id, status, draft_title, draft_note, draft_growth_opportunity, reviewer_note, reviewed_at, created_at")
    .single();

  return (data as EditorialDraftRow) ?? null;
}

export async function reviewEditorialDraft(
  draftId: string,
  action: EditorialDraftAction,
  reviewerId: string,
  reviewerNote?: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from("editorial_drafts")
    .update({
      status: nextEditorialDraftStatus(action),
      reviewer_note: reviewerNote ?? null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq("id", draftId);

  return !error;
}
