import type { LifecycleState } from "@/lib/constants";

export interface PublishedProjectProjection {
  slug: string;
  project_name: string;
  original_summary: string;
  official_website_url: string;
  github_url?: string;
  docs_url?: string;
  primary_category: string;
  collection_tags: string[];
  open_source_or_commercial: "open_source" | "commercial" | "hybrid";
  public_signal_chips: string[];
  last_reviewed_at: string;
  lifecycle_status: Extract<LifecycleState, "published">;
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

const publishedProjectionFixtures: PublishedProjectProjection[] = [
  {
    slug: "aurora-code",
    project_name: "Aurora Code",
    original_summary:
      "AI code review assistant for teams that want public repository checks and documented review workflows.",
    official_website_url: "https://auroracode.dev",
    github_url: "https://github.com/aurora-code/aurora",
    docs_url: "https://docs.auroracode.dev",
    primary_category: "AI Coding",
    collection_tags: ["open-source-ai-agents", "ai-tool-alternatives"],
    open_source_or_commercial: "open_source",
    public_signal_chips: ["Official site", "Public GitHub", "Docs reviewed"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
  {
    slug: "pulse-analytics",
    project_name: "Pulse Analytics",
    original_summary:
      "Privacy-aware product analytics surface with first-party tracking and public documentation.",
    official_website_url: "https://pulseanalytics.io",
    github_url: "https://github.com/pulse-analytics/pulse",
    docs_url: "https://docs.pulseanalytics.io",
    primary_category: "Analytics",
    collection_tags: ["ai-outbound"],
    open_source_or_commercial: "commercial",
    public_signal_chips: ["Official site", "Public docs", "Founder claim ready"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
  {
    slug: "nucleus-ml",
    project_name: "Nucleus ML",
    original_summary:
      "Model training infrastructure for small teams evaluating self-managed AI builder workflows.",
    official_website_url: "https://nucleusml.com",
    github_url: "https://github.com/nucleus-ml/nucleus",
    docs_url: "https://docs.nucleusml.com",
    primary_category: "AI Infrastructure",
    collection_tags: ["rag-projects", "open-source-ai-agents"],
    open_source_or_commercial: "hybrid",
    public_signal_chips: ["Official site", "Public GitHub", "Docs reviewed"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
  {
    slug: "vectorbase",
    project_name: "VectorBase",
    original_summary:
      "Vector search infrastructure project with public repository and implementation documentation.",
    official_website_url: "https://vectorbase.dev",
    github_url: "https://github.com/vectorbase/vectorbase",
    docs_url: "https://docs.vectorbase.dev",
    primary_category: "Search Infrastructure",
    collection_tags: ["rag-projects", "ai-tool-alternatives"],
    open_source_or_commercial: "open_source",
    public_signal_chips: ["Official site", "Public GitHub", "Docs reviewed"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
  {
    slug: "complykit",
    project_name: "ComplyKit",
    original_summary:
      "Compliance preparation workspace for software teams reviewing public trust and readiness signals.",
    official_website_url: "https://complykit.io",
    github_url: "https://github.com/complykit/complykit",
    docs_url: "https://docs.complykit.io",
    primary_category: "Trust Operations",
    collection_tags: ["ai-outbound", "ai-tool-alternatives"],
    open_source_or_commercial: "commercial",
    public_signal_chips: ["Official site", "Public GitHub", "Docs reviewed"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
  {
    slug: "scribe-ai",
    project_name: "Scribe AI",
    original_summary:
      "Local-first meeting transcription project with public product materials and founder claim path.",
    official_website_url: "https://scribeai.app",
    github_url: "https://github.com/scribeai/scribe",
    docs_url: "https://docs.scribeai.app",
    primary_category: "Productivity",
    collection_tags: ["ai-outbound"],
    open_source_or_commercial: "hybrid",
    public_signal_chips: ["Official site", "Public GitHub", "Founder claim ready"],
    last_reviewed_at: "2026-06-21",
    lifecycle_status: "published",
  },
];

export function getPublishedProjectProjections(): PublishedProjectProjection[] {
  return publishedProjectionFixtures.filter(
    (project) => project.lifecycle_status === "published"
  );
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
