import { getProjectBySlug, type DemoProject } from "@/lib/demo-projects";
import registry from "./vertical-asset-grids.json";

export const VERTICAL_ASSET_GRID_STATUSES = [
  "draft",
  "noindex",
  "published",
  "archived",
] as const;

export type VerticalAssetGridStatus =
  (typeof VERTICAL_ASSET_GRID_STATUSES)[number];

export interface VerticalAssetGrid {
  slug: string;
  title: string;
  summary: string;
  status: VerticalAssetGridStatus;
  sitemapEligible: boolean;
  lastReviewed: string;
  minimumPublishedProjects: number;
  projectSlugs: string[];
  inclusionCriteria: string;
  whyIncluded: string;
  methodologyNote: string;
  boundaryNote: string;
}

const grids = registry as VerticalAssetGrid[];

export function getAllVerticalAssetGrids(): VerticalAssetGrid[] {
  return grids;
}

export function getPublishedVerticalAssetGrids(): VerticalAssetGrid[] {
  return grids.filter((grid) => {
    const projects = getProjectsForVerticalAssetGrid(grid);

    return (
      grid.status === "published" &&
      grid.sitemapEligible &&
      projects.length >= grid.minimumPublishedProjects
    );
  });
}

export function getVerticalAssetGridBySlug(
  slug: string
): VerticalAssetGrid | undefined {
  return grids.find((grid) => grid.slug === slug);
}

export function getProjectsForVerticalAssetGrid(
  grid: VerticalAssetGrid
): DemoProject[] {
  return grid.projectSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter(
      (project): project is DemoProject =>
        project !== undefined && project.status === "published"
    );
}
