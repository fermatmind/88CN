import {
  getPublishedProjectBySlug,
  type PublishedProjectProjection,
} from "@/lib/projects/published-projection";
import registry from "./curated-collections.json";

export const CURATED_COLLECTION_STATUSES = [
  "draft",
  "noindex",
  "published",
  "archived",
] as const;

export type CuratedCollectionStatus =
  (typeof CURATED_COLLECTION_STATUSES)[number];

export interface CuratedCollection {
  slug: string;
  title: string;
  summary: string;
  status: CuratedCollectionStatus;
  sitemapEligible: boolean;
  lastReviewed: string;
  minimumPublishedProjects: number;
  projectSlugs: string[];
  inclusionCriteria: string;
  whyIncluded: string;
  methodologyNote: string;
}

const collections = registry as CuratedCollection[];

export function getAllCuratedCollections(): CuratedCollection[] {
  return collections;
}

export function getPublishedCuratedCollections(): CuratedCollection[] {
  return collections.filter((collection) => {
    const projects = getProjectsForCuratedCollection(collection);

    return (
      collection.status === "published" &&
      collection.sitemapEligible &&
      projects.length >= collection.minimumPublishedProjects
    );
  });
}

export function getCuratedCollectionBySlug(
  slug: string
): CuratedCollection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProjectsForCuratedCollection(
  collection: CuratedCollection
): PublishedProjectProjection[] {
  return collection.projectSlugs
    .map((slug) => getPublishedProjectBySlug(slug))
    .filter(
      (project): project is PublishedProjectProjection =>
        project !== undefined && project.lifecycle_status === "published"
    );
}
