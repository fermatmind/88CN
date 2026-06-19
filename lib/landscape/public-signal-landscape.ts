import { getPublishedCuratedAlternatives } from "@/lib/alternatives/curated-alternatives";
import { getPublishedCuratedCollections } from "@/lib/collections/curated-collections";
import { getPublishedProjects, type DemoProject } from "@/lib/demo-projects";
import { getPublishedReportRoutes } from "@/lib/reports/published-reports";
import { getPublishedStackClusters } from "@/lib/stacks/tech-stack-clusters";
import { getPublishedVerticalAssetGrids } from "@/lib/verticals/vertical-asset-grids";

export interface LandscapeMetric {
  label: string;
  value: number;
  detail: string;
}

export interface LandscapeLink {
  label: string;
  href: string;
  description: string;
  status: "available" | "future";
}

export interface LandscapeSignal {
  label: string;
  description: string;
}

export interface LandscapeSnapshot {
  projects: DemoProject[];
  metrics: LandscapeMetric[];
  browseLinks: LandscapeLink[];
  machineSignals: LandscapeSignal[];
}

export function getLandscapeSnapshot(): LandscapeSnapshot {
  const projects = getPublishedProjects();
  const stacks = getPublishedStackClusters();
  const collections = getPublishedCuratedCollections();
  const verticals = getPublishedVerticalAssetGrids();
  const alternatives = getPublishedCuratedAlternatives();
  const reports = getPublishedReportRoutes();

  return {
    projects,
    metrics: [
      {
        label: "Reviewed project sample",
        value: projects.length,
        detail: "Published or claimed public project profiles.",
      },
      {
        label: "Stack routes",
        value: stacks.length,
        detail: "Finite published stack clusters.",
      },
      {
        label: "Collections",
        value: collections.length,
        detail: "Curated public project collections.",
      },
      {
        label: "Vertical grids",
        value: verticals.length,
        detail: "Reviewed vertical discovery surfaces.",
      },
      {
        label: "Alternatives",
        value: alternatives.length,
        detail: "Approved neutral comparison routes.",
      },
      {
        label: "Reports",
        value: reports.length,
        detail: "Reviewed public signal reports.",
      },
    ],
    browseLinks: [
      {
        label: "Projects",
        href: "/projects",
        description: "Published and claimed profiles with public signals.",
        status: "available",
      },
      {
        label: "Reports",
        href: "/reports",
        description: "Reviewed snapshots and public-signal methodology.",
        status: "available",
      },
      {
        label: "Geo Checker",
        href: "/geo-checker",
        description: "Public readiness and machine-readability checks.",
        status: "available",
      },
      {
        label: "Founders",
        href: "/founders",
        description: "Submission, claim, and correction boundaries.",
        status: "available",
      },
      {
        label: "Submit",
        href: "/submit",
        description: "Send public project information for human review.",
        status: "available",
      },
      {
        label: "Alpha Feed",
        href: "/alpha-feed",
        description: "Future public-signal evidence boundary.",
        status: "available",
      },
      ...stacks.slice(0, 3).map((stack) => ({
        label: stack.title,
        href: `/stacks/${stack.slug}`,
        description: stack.summary,
        status: "available" as const,
      })),
      ...collections.slice(0, 3).map((collection) => ({
        label: collection.title,
        href: `/collections/${collection.slug}`,
        description: collection.summary,
        status: "available" as const,
      })),
      ...verticals.slice(0, 3).map((vertical) => ({
        label: vertical.title,
        href: `/verticals/${vertical.slug}`,
        description: vertical.summary,
        status: "available" as const,
      })),
      ...alternatives.slice(0, 2).map((entry) => ({
        label: entry.title,
        href: entry.canonicalPath,
        description: entry.summary,
        status: "available" as const,
      })),
    ],
    machineSignals: [
      {
        label: "Website reachable",
        description: "The public site can be reached by the checker.",
      },
      {
        label: "GitHub linked",
        description: "A public repository or organization source is attached.",
      },
      {
        label: "Docs linked",
        description: "Public documentation can be inspected by humans.",
      },
      {
        label: "Sitemap detected",
        description: "The project exposes a crawlable sitemap signal.",
      },
      {
        label: "JSON-LD detected",
        description: "Structured data is visible in public HTML.",
      },
      {
        label: "Canonical detected",
        description: "A canonical URL is present for the public page.",
      },
    ],
  };
}
