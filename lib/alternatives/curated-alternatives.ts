import { getProjectBySlug, type DemoProject } from "@/lib/demo-projects";
import registry from "./curated-alternatives.json";

export const ALTERNATIVES_ROUTE_CAP_V0 = 4;

export const CURATED_ALTERNATIVES_STATUSES = [
  "draft",
  "noindex",
  "published",
  "archived",
] as const;

export type CuratedAlternativesStatus =
  (typeof CURATED_ALTERNATIVES_STATUSES)[number];

export interface CuratedAlternativesEntry {
  canonicalSlug: string;
  title: string;
  summary: string;
  status: CuratedAlternativesStatus;
  sitemapEligible: boolean;
  lastReviewed: string;
  leftProjectSlug: string;
  rightProjectSlug: string;
  canonicalPath: string;
  neutralRationale: string;
  sourceNotes: string;
  boundaryNote: string;
}

const entries = registry as CuratedAlternativesEntry[];

export function getCanonicalAlternativesSlug(
  firstSlug: string,
  secondSlug: string
): string {
  return [firstSlug, secondSlug].sort().join("-vs-");
}

export function getAllCuratedAlternatives(): CuratedAlternativesEntry[] {
  return entries;
}

export function getPublishedCuratedAlternatives(): CuratedAlternativesEntry[] {
  return entries.filter((entry) => {
    const projects = getProjectsForCuratedAlternatives(entry);

    return (
      entry.status === "published" &&
      entry.sitemapEligible &&
      entry.canonicalSlug ===
        getCanonicalAlternativesSlug(entry.leftProjectSlug, entry.rightProjectSlug) &&
      entry.canonicalPath === `/alternatives/${entry.canonicalSlug}` &&
      projects.length === 2
    );
  });
}

export function getCuratedAlternativesBySlug(
  slug: string
): CuratedAlternativesEntry | undefined {
  return entries.find((entry) => entry.canonicalSlug === slug);
}

export function getProjectsForCuratedAlternatives(
  entry: CuratedAlternativesEntry
): DemoProject[] {
  return [entry.leftProjectSlug, entry.rightProjectSlug]
    .map((slug) => getProjectBySlug(slug))
    .filter(
      (project): project is DemoProject =>
        project !== undefined && project.status === "published"
    );
}
