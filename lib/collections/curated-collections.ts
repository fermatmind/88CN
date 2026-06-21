import {
  getPublishedProjectProjections,
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
  match: {
    collectionTag: string;
  };
}

const collections = registry as CuratedCollection[];

export function getAllCuratedCollections(): CuratedCollection[] {
  return collections;
}

export function getPublishedCuratedCollections(): CuratedCollection[] {
  return collections.filter(
    (collection) =>
      collection.status === "published" && collection.sitemapEligible
  );
}

export function getCuratedCollectionBySlug(
  slug: string
): CuratedCollection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProjectsForCuratedCollection(
  collection: CuratedCollection
): PublishedProjectProjection[] {
  const allowedSlugs = new Set(collection.projectSlugs);
  const matchTag = collection.match.collectionTag;

  return getPublishedProjectProjections()
    .filter(
      (project) =>
        project.lifecycle_status === "published" &&
        allowedSlugs.has(project.slug) &&
        project.collection_tags.includes(matchTag)
    )
    .sort(
      (a, b) =>
        collection.projectSlugs.indexOf(a.slug) -
        collection.projectSlugs.indexOf(b.slug)
    );
}
