import { getAdminClient } from "@/lib/supabase/admin-server";

export const BULK_LIFECYCLE_STATUSES = [
  "seed_hint",
  "identity_candidate",
  "canonical_candidate",
  "audit_pending",
  "audit_observation",
  "review_ready",
  "published",
  "stale",
  "archived",
  "quarantined",
  "rejected",
] as const;

export const BULK_REVIEW_STATES = [
  "not_reviewed",
  "needs_review",
  "in_review",
  "approved",
  "changes_requested",
  "rejected",
  "published_approved",
  "archived",
] as const;

export const BULK_ISSUE_FILTERS = [
  "missing_docs",
  "canonical_review",
  "reachability_review",
  "quarantined",
  "rejected",
  "stale",
  "published",
] as const;

export type BulkLifecycleStatus = (typeof BULK_LIFECYCLE_STATUSES)[number];
export type BulkReviewState = (typeof BULK_REVIEW_STATES)[number];
export type BulkIssueFilter = (typeof BULK_ISSUE_FILTERS)[number];

export interface BulkControlPanelFilters {
  page: number;
  search: string;
  lifecycleStatus: BulkLifecycleStatus | "";
  reviewState: BulkReviewState | "";
  issueFilter: BulkIssueFilter | "";
}

export interface BulkControlPanelSourceLink {
  label: string;
  url: string;
  role: string;
}

export interface BulkControlPanelRow {
  id: string;
  displayName: string;
  normalizedName: string;
  organizationName: string;
  productName: string;
  primaryCategory: string;
  collectionTags: string[];
  openSourceOrCommercial: string;
  lifecycleStatus: BulkLifecycleStatus;
  reviewState: BulkReviewState;
  sourceLinks: BulkControlPanelSourceLink[];
  publicSignalChips: string[];
  latestReview: {
    decision: string;
    reason: string;
    createdAt: string;
  } | null;
  flags: {
    missingDocs: boolean;
    canonicalReview: boolean;
    reachabilityReview: boolean;
    quarantined: boolean;
    rejected: boolean;
    stale: boolean;
    published: boolean;
  };
  updatedAt: string;
}

export interface BulkControlPanelData {
  mode: "live" | "unavailable";
  rows: BulkControlPanelRow[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}

interface ProjectEntityRecord {
  id: string;
  display_name: string;
  normalized_name: string;
  organization_name: string | null;
  product_name: string | null;
  primary_category: string | null;
  collection_tags: string[] | null;
  open_source_or_commercial: string | null;
  lifecycle_status: BulkLifecycleStatus;
  review_state: BulkReviewState;
  updated_at: string;
}

interface SourceEvidenceRecord {
  project_entity_id: string | null;
  source_url: string;
  source_role: string;
  source_type: string;
  is_official_source: boolean;
}

interface RepoAssetRecord {
  project_entity_id: string;
  github_url: string | null;
  repo_relationship: string;
}

interface WebAssetRecord {
  project_entity_id: string;
  url: string;
  asset_role: string;
  is_official: boolean;
}

interface AuditObservationRecord {
  project_entity_id: string;
  failure_class: string | null;
  audit_method: string;
}

interface PublishedProjectionRecord {
  project_entity_id: string;
  slug: string;
  public_signal_chips: Record<string, unknown> | null;
  seo_indexable: boolean;
}

interface ReviewDecisionRecord {
  project_entity_id: string;
  decision: string;
  decision_reason: string | null;
  created_at: string;
}

export function parseBulkControlPanelFilters(
  searchParams: Record<string, string | string[] | undefined>,
): BulkControlPanelFilters {
  const pageValue = Number(readParam(searchParams.page));
  const lifecycleStatus = readParam(searchParams.lifecycle);
  const reviewState = readParam(searchParams.review);
  const issueFilter = readParam(searchParams.issue);

  return {
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1,
    search: readParam(searchParams.q).slice(0, 80),
    lifecycleStatus: isBulkLifecycleStatus(lifecycleStatus) ? lifecycleStatus : "",
    reviewState: isBulkReviewState(reviewState) ? reviewState : "",
    issueFilter: isBulkIssueFilter(issueFilter) ? issueFilter : "",
  };
}

export async function getBulkControlPanelData(
  filters: BulkControlPanelFilters,
): Promise<BulkControlPanelData> {
  const client = getAdminClient();
  const pageSize = 25;

  if (!client) {
    return {
      mode: "unavailable",
      rows: [],
      total: 0,
      page: filters.page,
      pageSize,
      error: "Admin service is not configured.",
    };
  }

  const fetchLimit = filters.issueFilter ? 100 : pageSize;
  const from = filters.issueFilter ? 0 : (filters.page - 1) * pageSize;
  const to = filters.issueFilter ? fetchLimit - 1 : from + pageSize - 1;

  let query = client
    .from("project_entities")
    .select(
      "id, display_name, normalized_name, organization_name, product_name, primary_category, collection_tags, open_source_or_commercial, lifecycle_status, review_state, updated_at",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (filters.lifecycleStatus) {
    query = query.eq("lifecycle_status", filters.lifecycleStatus);
  }

  if (filters.reviewState) {
    query = query.eq("review_state", filters.reviewState);
  }

  if (filters.search) {
    const safeSearch = filters.search.replaceAll(",", " ");
    query = query.or(
      `display_name.ilike.%${safeSearch}%,normalized_name.ilike.%${safeSearch}%,organization_name.ilike.%${safeSearch}%,product_name.ilike.%${safeSearch}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return {
      mode: "unavailable",
      rows: [],
      total: 0,
      page: filters.page,
      pageSize,
      error: error.message,
    };
  }

  const entityRows = (data ?? []) as ProjectEntityRecord[];
  const ids = entityRows.map((row) => row.id);
  const related = await getRelatedRecords(ids);
  const rows = entityRows
    .map((row) => toBulkControlPanelRow(row, related))
    .filter((row) => matchesIssueFilter(row, filters.issueFilter));

  const visibleRows = filters.issueFilter
    ? rows.slice((filters.page - 1) * pageSize, filters.page * pageSize)
    : rows;

  return {
    mode: "live",
    rows: visibleRows,
    total: filters.issueFilter ? rows.length : count ?? rows.length,
    page: filters.page,
    pageSize,
  };
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isBulkLifecycleStatus(value: string): value is BulkLifecycleStatus {
  return BULK_LIFECYCLE_STATUSES.includes(value as BulkLifecycleStatus);
}

function isBulkReviewState(value: string): value is BulkReviewState {
  return BULK_REVIEW_STATES.includes(value as BulkReviewState);
}

function isBulkIssueFilter(value: string): value is BulkIssueFilter {
  return BULK_ISSUE_FILTERS.includes(value as BulkIssueFilter);
}

async function getRelatedRecords(ids: string[]) {
  const client = getAdminClient();
  if (!client || ids.length === 0) {
    return {
      sourceEvidence: [] as SourceEvidenceRecord[],
      repoAssets: [] as RepoAssetRecord[],
      webAssets: [] as WebAssetRecord[],
      auditObservations: [] as AuditObservationRecord[],
      publishedProjections: [] as PublishedProjectionRecord[],
      reviewDecisions: [] as ReviewDecisionRecord[],
    };
  }

  const [sourceEvidence, repoAssets, webAssets, auditObservations, publishedProjections, reviewDecisions] =
    await Promise.all([
      client
        .from("source_evidences")
        .select("project_entity_id, source_url, source_role, source_type, is_official_source")
        .in("project_entity_id", ids),
      client
        .from("repo_assets")
        .select("project_entity_id, github_url, repo_relationship")
        .in("project_entity_id", ids),
      client
        .from("web_assets")
        .select("project_entity_id, url, asset_role, is_official")
        .in("project_entity_id", ids),
      client
        .from("audit_observations")
        .select("project_entity_id, failure_class, audit_method")
        .in("project_entity_id", ids),
      client
        .from("published_projections")
        .select("project_entity_id, slug, public_signal_chips, seo_indexable")
        .in("project_entity_id", ids),
      client
        .from("review_decisions")
        .select("project_entity_id, decision, decision_reason, created_at")
        .in("project_entity_id", ids)
        .order("created_at", { ascending: false }),
    ]);

  return {
    sourceEvidence: ((sourceEvidence.data ?? []) as SourceEvidenceRecord[]) ?? [],
    repoAssets: ((repoAssets.data ?? []) as RepoAssetRecord[]) ?? [],
    webAssets: ((webAssets.data ?? []) as WebAssetRecord[]) ?? [],
    auditObservations: ((auditObservations.data ?? []) as AuditObservationRecord[]) ?? [],
    publishedProjections: ((publishedProjections.data ?? []) as PublishedProjectionRecord[]) ?? [],
    reviewDecisions: ((reviewDecisions.data ?? []) as ReviewDecisionRecord[]) ?? [],
  };
}

function toBulkControlPanelRow(
  row: ProjectEntityRecord,
  related: Awaited<ReturnType<typeof getRelatedRecords>>,
): BulkControlPanelRow {
  const sourceEvidence = related.sourceEvidence.filter(
    (source) => source.project_entity_id === row.id,
  );
  const repoAssets = related.repoAssets.filter((asset) => asset.project_entity_id === row.id);
  const webAssets = related.webAssets.filter((asset) => asset.project_entity_id === row.id);
  const auditObservations = related.auditObservations.filter(
    (observation) => observation.project_entity_id === row.id,
  );
  const projection = related.publishedProjections.find(
    (item) => item.project_entity_id === row.id,
  );
  const latestReview = related.reviewDecisions.find(
    (decision) => decision.project_entity_id === row.id,
  );

  const hasDocs = webAssets.some((asset) => asset.asset_role === "docs" || asset.asset_role === "api_docs");
  const sourceLinks = [
    ...webAssets.map((asset) => ({
      label: asset.asset_role,
      role: asset.is_official ? "official" : "candidate",
      url: asset.url,
    })),
    ...repoAssets
      .filter((asset) => Boolean(asset.github_url))
      .map((asset) => ({
        label: "github",
        role: asset.repo_relationship,
        url: asset.github_url ?? "",
      })),
    ...sourceEvidence.map((source) => ({
      label: source.source_type,
      role: source.is_official_source ? "official evidence" : source.source_role,
      url: source.source_url,
    })),
  ].slice(0, 6);

  const publicSignalChips = projection?.public_signal_chips
    ? Object.entries(projection.public_signal_chips)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key)
        .slice(0, 6)
    : [
        sourceEvidence.some((source) => source.is_official_source) ? "official-source" : "",
        repoAssets.some((asset) => Boolean(asset.github_url)) ? "repo-linked" : "",
        hasDocs ? "docs-linked" : "",
        row.review_state === "approved" ? "review-approved" : "",
      ].filter(Boolean);

  return {
    id: row.id,
    displayName: row.display_name,
    normalizedName: row.normalized_name,
    organizationName: row.organization_name ?? "Not verified",
    productName: row.product_name ?? "Not verified",
    primaryCategory: row.primary_category ?? "Not enough data",
    collectionTags: row.collection_tags ?? [],
    openSourceOrCommercial: row.open_source_or_commercial ?? "unknown",
    lifecycleStatus: row.lifecycle_status,
    reviewState: row.review_state,
    sourceLinks,
    publicSignalChips,
    latestReview: latestReview
      ? {
          decision: latestReview.decision,
          reason: latestReview.decision_reason ?? "No reason recorded",
          createdAt: latestReview.created_at,
        }
      : null,
    flags: {
      missingDocs: !hasDocs,
      canonicalReview: row.lifecycle_status === "canonical_candidate",
      reachabilityReview: auditObservations.some(
        (observation) => Boolean(observation.failure_class) || observation.audit_method === "not_run",
      ),
      quarantined: row.lifecycle_status === "quarantined",
      rejected: row.lifecycle_status === "rejected" || row.review_state === "rejected",
      stale: row.lifecycle_status === "stale",
      published: row.lifecycle_status === "published" && Boolean(projection?.seo_indexable),
    },
    updatedAt: row.updated_at,
  };
}

function matchesIssueFilter(row: BulkControlPanelRow, issueFilter: BulkIssueFilter | "") {
  if (!issueFilter) return true;
  if (issueFilter === "missing_docs") return row.flags.missingDocs;
  if (issueFilter === "canonical_review") return row.flags.canonicalReview;
  if (issueFilter === "reachability_review") return row.flags.reachabilityReview;
  if (issueFilter === "quarantined") return row.flags.quarantined;
  if (issueFilter === "rejected") return row.flags.rejected;
  if (issueFilter === "stale") return row.flags.stale;
  if (issueFilter === "published") return row.flags.published;
  return true;
}
