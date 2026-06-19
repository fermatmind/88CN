import { getProjectBySlug, type DemoProject } from "@/lib/demo-projects";
import registry from "./tech-stack-clusters.json";

export const STACK_CLUSTER_STATUSES = [
  "draft",
  "noindex",
  "published",
  "archived",
] as const;

export type StackClusterStatus = (typeof STACK_CLUSTER_STATUSES)[number];

export interface TechStackCluster {
  slug: string;
  title: string;
  summary: string;
  status: StackClusterStatus;
  sitemapEligible: boolean;
  lastReviewed: string;
  projectSlugs: string[];
  inclusionCriteria: string;
  whyIncluded: string;
  methodologyNote: string;
}

const clusters = registry as TechStackCluster[];

export function getAllStackClusters(): TechStackCluster[] {
  return clusters;
}

export function getPublishedStackClusters(): TechStackCluster[] {
  return clusters.filter(
    (cluster) =>
      cluster.status === "published" &&
      cluster.sitemapEligible &&
      getProjectsForStackCluster(cluster).length > 0
  );
}

export function getStackClusterBySlug(
  slug: string
): TechStackCluster | undefined {
  return clusters.find((cluster) => cluster.slug === slug);
}

export function getProjectsForStackCluster(
  cluster: TechStackCluster
): DemoProject[] {
  return cluster.projectSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter(
      (project): project is DemoProject =>
        project !== undefined && project.status === "published"
    );
}
