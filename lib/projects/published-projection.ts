import fs from "node:fs";
import path from "node:path";
import type { LifecycleState } from "@/lib/constants";

export interface PublishedProjectProjection {
  slug: string;
  project_name: string;
  original_summary: string;
  official_website_url: string;
  github_url?: string;
  docs_url?: string;
  category?: string;
  primary_category: string;
  collection_tags: string[];
  open_source_or_commercial: "open_source" | "commercial" | "hybrid";
  public_signal_chips: string[];
  last_reviewed_at: string;
  lifecycle_status: Extract<LifecycleState, "published">;
  seo_indexable?: boolean;
}

export interface PublishedProjectSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  page?: number;
}

export interface PublishedProjectSearchResult {
  items: PublishedProjectProjection[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  filters: {
    categories: string[];
    tags: string[];
  };
}

export const PROJECT_LISTING_PAGE_SIZE = 24;

const PUBLISHED_PROJECTION_JSONL_PATH = path.join(
  process.cwd(),
  "lib/projects/published-projection.jsonl"
);

const forbiddenPublicFields = new Set(
  [
    ["seed", "hint"],
    ["identity", "candidate"],
    ["canonical", "candidate"],
    ["audit", "pending"],
    ["raw", "audit"],
    ["raw", "source", "evidence"],
    ["review", "notes"],
    ["quarantine", "reason"],
    ["rejected", "reason"],
    ["row", "hash"],
    ["evidence", "hash"],
    ["manifest", "hash"],
    ["private", "artifact", "path"],
    ["internal", "confidence"],
    ["canonical", "ambiguity"],
    ["source", "evidence", "ids"],
    ["worker", "job", "payload"],
  ].map((parts) => parts.join("_"))
);

let publishedProjectionCache: PublishedProjectProjection[] | undefined;

export function getPublishedProjectProjections(): PublishedProjectProjection[] {
  if (!publishedProjectionCache) {
    publishedProjectionCache = loadPublishedProjectionJsonl();
  }

  return publishedProjectionCache;
}

export function getPublishedProjectBySlug(
  slug: string
): PublishedProjectProjection | undefined {
  return getPublishedProjectProjections().find(
    (project) => project.slug === slug
  );
}

export function searchPublishedProjectProjections(
  params: PublishedProjectSearchParams = {}
): PublishedProjectSearchResult {
  const projects = getPublishedProjectProjections();
  const filters = getPublishedProjectFilters(projects);
  const query = normalizeParam(params.query);
  const category = normalizeParam(params.category);
  const tag = normalizeParam(params.tag);

  const filtered = projects.filter((project) => {
    const matchesQuery =
      !query ||
      [
        project.project_name,
        project.original_summary,
        project.primary_category,
        project.open_source_or_commercial,
        ...project.collection_tags,
        ...project.public_signal_chips,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesCategory =
      !category || project.primary_category.toLowerCase() === category;
    const matchesTag =
      !tag ||
      project.collection_tags.some(
        (collectionTag) => collectionTag.toLowerCase() === tag
      );

    return matchesQuery && matchesCategory && matchesTag;
  });

  const requestedPage = Number.isFinite(params.page) ? params.page ?? 1 : 1;
  const page = Math.max(1, Math.floor(requestedPage));
  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PROJECT_LISTING_PAGE_SIZE)
  );
  const boundedPage = Math.min(page, pageCount);
  const start = (boundedPage - 1) * PROJECT_LISTING_PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PROJECT_LISTING_PAGE_SIZE),
    total: filtered.length,
    page: boundedPage,
    pageSize: PROJECT_LISTING_PAGE_SIZE,
    pageCount,
    filters,
  };
}

function getPublishedProjectFilters(projects: PublishedProjectProjection[]) {
  return {
    categories: [...new Set(projects.map((project) => project.primary_category))]
      .sort((a, b) => a.localeCompare(b)),
    tags: [...new Set(projects.flatMap((project) => project.collection_tags))]
      .sort((a, b) => a.localeCompare(b)),
  };
}

function normalizeParam(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function loadPublishedProjectionJsonl(): PublishedProjectProjection[] {
  if (!fs.existsSync(PUBLISHED_PROJECTION_JSONL_PATH)) return [];

  return fs
    .readFileSync(PUBLISHED_PROJECTION_JSONL_PATH, "utf8")
    .split(/\r?\n/)
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [];

      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>;
        const projection = toPublishedProjectProjection(parsed);
        return projection ? [projection] : [];
      } catch {
        return [];
      }
    });
}

function toPublishedProjectProjection(
  row: Record<string, unknown>
): PublishedProjectProjection | undefined {
  if (hasForbiddenPublicField(row)) return undefined;

  const slug = stringValue(row.slug);
  const projectName = stringValue(row.project_name);
  const originalSummary = stringValue(row.original_summary);
  const officialWebsiteUrl = stringValue(row.official_website_url);
  const lifecycleStatus = stringValue(row.lifecycle_status);
  const primaryCategory =
    stringValue(row.primary_category) ?? stringValue(row.category);

  if (
    !slug ||
    !projectName ||
    !originalSummary ||
    !officialWebsiteUrl ||
    !primaryCategory ||
    lifecycleStatus !== "published"
  ) {
    return undefined;
  }

  return {
    slug,
    project_name: projectName,
    original_summary: originalSummary,
    official_website_url: officialWebsiteUrl,
    github_url: stringValue(row.github_url),
    docs_url: stringValue(row.docs_url),
    category: stringValue(row.category),
    primary_category: primaryCategory,
    collection_tags: stringArrayValue(row.collection_tags),
    open_source_or_commercial: openSourceOrCommercialValue(
      row.open_source_or_commercial
    ),
    public_signal_chips: stringArrayValue(row.public_signal_chips),
    last_reviewed_at: stringValue(row.last_reviewed_at) ?? "2026-06-21",
    lifecycle_status: "published",
    seo_indexable: booleanValue(row.seo_indexable),
  };
}

function hasForbiddenPublicField(row: Record<string, unknown>): boolean {
  return Object.keys(row).some((key) => forbiddenPublicFields.has(key));
}

function stringValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function stringArrayValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const normalized = stringValue(item);
    return normalized ? [normalized] : [];
  });
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function openSourceOrCommercialValue(
  value: unknown
): PublishedProjectProjection["open_source_or_commercial"] {
  if (
    value === "open_source" ||
    value === "commercial" ||
    value === "hybrid"
  ) {
    return value;
  }

  return "hybrid";
}
