import { getAdminClient } from "@/lib/supabase/admin-server";
import {
  nextScoutedStatus,
  type ScoutedIntentType,
  type ScoutedReviewAction,
} from "@/lib/scouted/profile-engine";

export interface ScoutedProfileRow {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  github_url: string | null;
  observed_source_urls: string[];
  public_summary: string | null;
  status: string;
  index_status: string;
  project_id: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export async function getScoutedProfiles(): Promise<ScoutedProfileRow[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data } = await client
    .from("scouted_profiles")
    .select("id, slug, name, website_url, github_url, observed_source_urls, public_summary, status, index_status, project_id, created_at, reviewed_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []) as ScoutedProfileRow[];
}

export async function getScoutedProfileById(id: string): Promise<ScoutedProfileRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data } = await client
    .from("scouted_profiles")
    .select("id, slug, name, website_url, github_url, observed_source_urls, public_summary, status, index_status, project_id, created_at, reviewed_at")
    .eq("id", id)
    .single();

  return (data as ScoutedProfileRow) ?? null;
}

export async function reviewScoutedProfile(
  id: string,
  action: ScoutedReviewAction,
  reviewerId: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from("scouted_profiles")
    .update({
      status: nextScoutedStatus(action),
      index_status: "noindex",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq("id", id);

  return !error;
}

export async function recordScoutedIntent(
  scoutedProfileId: string,
  intentType: ScoutedIntentType,
  payloadSummary: Record<string, unknown>
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client.from("scouted_profile_intents").insert({
    scouted_profile_id: scoutedProfileId,
    intent_type: intentType,
    status: "pending_review",
    payload_summary: payloadSummary,
  });

  return !error;
}
