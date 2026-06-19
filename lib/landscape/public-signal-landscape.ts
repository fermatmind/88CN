import { getPublishedCuratedAlternatives } from "@/lib/alternatives/curated-alternatives";
import { getPublishedCuratedCollections } from "@/lib/collections/curated-collections";
import {
  getProjectBySlug,
  getPublishedProjects,
  type DemoProject,
} from "@/lib/demo-projects";
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

export interface SectorDensityCandidate {
  slug: string;
  title: string;
  summary: string;
  projectSlugs: readonly string[];
  reviewedSampleCount: number;
  thresholdLabel: "meets basic threshold" | "limited reviewed sample";
  statusNote: string;
  sourceEvidence: LandscapeMetric[];
  projectExamples: DemoProject[];
  methodologyNote: string;
}

export interface LandscapeSnapshot {
  projects: DemoProject[];
  metrics: LandscapeMetric[];
  browseLinks: LandscapeLink[];
  machineSignals: LandscapeSignal[];
  sectorDensity: SectorDensityCandidate[];
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
    sectorDensity: getSectorDensityCandidates(),
  };
}

const sectorCandidates = [
  {
    slug: "ai-builder-infrastructure",
    title: "AI builder infrastructure",
    summary:
      "Builder-facing projects with reviewed local profiles, public source links, and infrastructure or workflow relevance.",
    projectSlugs: ["aurora-code", "nucleus-ml", "vectorbase"],
  },
  {
    slug: "model-and-search-infrastructure",
    title: "Model and search infrastructure",
    summary:
      "Projects connected to model workflow, semantic search, and infrastructure review from local public-signal records.",
    projectSlugs: ["nucleus-ml", "vectorbase"],
  },
  {
    slug: "analytics-and-operations-tools",
    title: "Analytics and operations tools",
    summary:
      "Operations-oriented projects with reviewed public product context and source-linked local profiles.",
    projectSlugs: ["pulse-analytics", "complykit"],
  },
  {
    slug: "local-on-device-productivity",
    title: "Local and on-device productivity",
    summary:
      "A sparse reviewed sample for local-first productivity tooling. This is internal discovery context only.",
    projectSlugs: ["scribe-ai"],
  },
] as const;

function countSources(
  projects: DemoProject[],
  predicate: (source: string, project: DemoProject) => boolean
): number {
  return projects.filter((project) =>
    project.publicSources.some((source) => predicate(source, project))
  ).length;
}

function getSectorDensityCandidates(): SectorDensityCandidate[] {
  return sectorCandidates.map((candidate) => {
    const projectExamples = candidate.projectSlugs
      .map((slug) => getProjectBySlug(slug))
      .filter(
        (project): project is DemoProject =>
          project !== undefined &&
          ["published", "claimed", "owner_verified"].includes(project.status)
      );
    const reviewedSampleCount = projectExamples.length;
    const meetsBasicThreshold = reviewedSampleCount >= 3;
    const githubLinkedCount = countSources(projectExamples, (source) =>
      source.includes("github.com")
    );
    const docsLinkedCount = countSources(projectExamples, (source) =>
      source.includes("docs.")
    );
    const websiteLinkedCount = projectExamples.filter(Boolean).length;

    return {
      ...candidate,
      reviewedSampleCount,
      thresholdLabel: meetsBasicThreshold
        ? "meets basic threshold"
        : "limited reviewed sample",
      statusNote: meetsBasicThreshold
        ? "Basic reviewed-sample threshold met. Density-framed pages still require a higher threshold and a separate route task."
        : "Below the indexable sector-page threshold. Keep as internal landscape context only.",
      sourceEvidence: [
        {
          label: "Source-linked websites",
          value: websiteLinkedCount,
          detail: "Official public site links in reviewed local records.",
        },
        {
          label: "GitHub linked",
          value: githubLinkedCount,
          detail: "Public GitHub links in reviewed local records.",
        },
        {
          label: "Docs linked",
          value: docsLinkedCount,
          detail: "Public documentation links in reviewed local records.",
        },
      ],
      projectExamples,
      methodologyNote:
        "Counts are reviewed sample counts from finite local records, not global market estimates. Open-source/commercial split is not shown until source-backed fields exist.",
    };
  });
}
