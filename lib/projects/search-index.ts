import {
  getPublishedProjectProjections,
  type PublishedProjectProjection,
} from "@/lib/projects/published-projection";
import {
  getPublishedCuratedCollections,
  getProjectsForCuratedCollection,
  type CuratedCollection,
} from "@/lib/collections/curated-collections";
import type { MetadataRoute } from "next";

export const PROJECT_SITEMAP_SEGMENT_SIZE = 10000;
export const COLLECTION_SITEMAP_SEGMENT_SIZE = 1000;

export interface ProjectSearchIndexRecord {
  slug: string;
  title: string;
  summary: string;
  category: string;
  collection_tags: string[];
  source_signal_chips: string[];
  url_path: string;
  last_reviewed_at: string;
}

export interface SitemapSegment<T> {
  id: string;
  offset: number;
  limit: number;
  entries: T[];
}

interface InternalSitemapEligibility {
  seo_indexable: boolean;
  canonical_slug: string;
  stale_blocker: boolean;
  quarantine_blocker: boolean;
  rejected_blocker: boolean;
  copied_competitor_content_risk: boolean;
  directory_hint_only: boolean;
}

const sitemapEligibilityBySlug: Record<string, InternalSitemapEligibility> = {
  "aurora-code": eligible("aurora-code"),
  "pulse-analytics": eligible("pulse-analytics"),
  "nucleus-ml": eligible("nucleus-ml"),
  vectorbase: eligible("vectorbase"),
  complykit: eligible("complykit"),
  "scribe-ai": eligible("scribe-ai"),
};

export function buildProjectSearchIndex(): ProjectSearchIndexRecord[] {
  return getPublishedProjectProjections()
    .filter(isProjectSearchIndexEligible)
    .map((project) => ({
      slug: project.slug,
      title: project.project_name,
      summary: project.original_summary,
      category: project.primary_category,
      collection_tags: [...project.collection_tags],
      source_signal_chips: [...project.public_signal_chips],
      url_path: `/projects/${project.slug}`,
      last_reviewed_at: project.last_reviewed_at,
    }));
}

export function getProjectSitemapSegments(): SitemapSegment<PublishedProjectProjection>[] {
  return segmentEntries(
    getPublishedProjectProjections().filter(isProjectSitemapEligible),
    "projects",
    PROJECT_SITEMAP_SEGMENT_SIZE
  );
}

export function getCollectionSitemapSegments(): SitemapSegment<CuratedCollection>[] {
  return segmentEntries(
    getPublishedCuratedCollections().filter(isCollectionSitemapEligible),
    "collections",
    COLLECTION_SITEMAP_SEGMENT_SIZE
  );
}

export function getProjectSitemapEntries(baseUrl: string): MetadataRoute.Sitemap {
  return getProjectSitemapSegments().flatMap((segment) =>
    segment.entries.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.last_reviewed_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );
}

export function getCollectionSitemapEntries(
  baseUrl: string
): MetadataRoute.Sitemap {
  return getCollectionSitemapSegments().flatMap((segment) =>
    segment.entries.map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: new Date(collection.lastReviewed),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );
}

export function isProjectSitemapEligible(
  project: PublishedProjectProjection
): boolean {
  const eligibility = sitemapEligibilityBySlug[project.slug] ?? eligible(project.slug);

  return (
    project.lifecycle_status === "published" &&
    Boolean(project.original_summary.trim()) &&
    Boolean(project.official_website_url.trim()) &&
    project.seo_indexable !== false &&
    eligibility.seo_indexable === true &&
    eligibility.canonical_slug === project.slug &&
    eligibility.stale_blocker === false &&
    eligibility.quarantine_blocker === false &&
    eligibility.rejected_blocker === false &&
    eligibility.copied_competitor_content_risk === false &&
    eligibility.directory_hint_only === false
  );
}

export function isCollectionSitemapEligible(
  collection: CuratedCollection
): boolean {
  return (
    collection.status === "published" &&
    collection.sitemapEligible === true &&
    getProjectsForCuratedCollection(collection).length >=
      collection.minimumPublishedProjects
  );
}

function isProjectSearchIndexEligible(
  project: PublishedProjectProjection
): boolean {
  return isProjectSitemapEligible(project);
}

function segmentEntries<T>(
  entries: T[],
  prefix: string,
  segmentSize: number
): SitemapSegment<T>[] {
  const segments: SitemapSegment<T>[] = [];

  for (let offset = 0; offset < entries.length; offset += segmentSize) {
    segments.push({
      id: `${prefix}-${segments.length + 1}`,
      offset,
      limit: segmentSize,
      entries: entries.slice(offset, offset + segmentSize),
    });
  }

  return segments;
}

function eligible(slug: string): InternalSitemapEligibility {
  return {
    seo_indexable: true,
    canonical_slug: slug,
    stale_blocker: false,
    quarantine_blocker: false,
    rejected_blocker: false,
    copied_competitor_content_risk: false,
    directory_hint_only: false,
  };
}
