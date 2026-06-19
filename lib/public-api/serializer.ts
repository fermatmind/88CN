import publicApiBoundary from "@/ops/contracts/public-api-boundary.json";

export const PUBLIC_API_ALLOWED_FIELDS =
  publicApiBoundary.allowed_public_fields;

export interface PublicApiProjectInput {
  slug?: unknown;
  name?: unknown;
  canonical_url?: unknown;
  website?: unknown;
  category?: unknown;
  short_description?: unknown;
  tagline?: unknown;
  public_source_links?: unknown;
  publicSources?: unknown;
  technology_tags?: unknown;
  published_at?: unknown;
  updated_at?: unknown;
  profile_status?: unknown;
  status?: unknown;
  structured_metadata_summary?: unknown;
}

export interface PublicApiProject {
  slug: string;
  name: string;
  canonical_url: string;
  category: string;
  short_description: string;
  public_source_links: string[];
  technology_tags: string[];
  published_at: string | null;
  updated_at: string | null;
  profile_status: "published";
  structured_metadata_summary: Record<string, string>;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function serializePublicApiProject(
  project: PublicApiProjectInput
): PublicApiProject | null {
  if (project.status !== "published") return null;

  const slug = asString(project.slug);
  const name = asString(project.name);
  const canonicalUrl = asString(project.canonical_url ?? project.website);
  const category = asString(project.category);
  const shortDescription = asString(
    project.short_description ?? project.tagline
  );

  if (!slug || !name || !canonicalUrl || !category || !shortDescription) {
    return null;
  }

  return {
    slug,
    name,
    canonical_url: canonicalUrl,
    category,
    short_description: shortDescription,
    public_source_links: asStringArray(
      project.public_source_links ?? project.publicSources
    ),
    technology_tags: asStringArray(project.technology_tags),
    published_at: asString(project.published_at),
    updated_at: asString(project.updated_at),
    profile_status: "published",
    structured_metadata_summary:
      typeof project.structured_metadata_summary === "object" &&
      project.structured_metadata_summary !== null &&
      !Array.isArray(project.structured_metadata_summary)
        ? (project.structured_metadata_summary as Record<string, string>)
        : {
            source: "reviewed local snapshot",
            status: "Public signals only",
          },
  };
}

export function serializePublicApiProjects(
  projects: PublicApiProjectInput[]
): PublicApiProject[] {
  return projects
    .map((project) => serializePublicApiProject(project))
    .filter((project): project is PublicApiProject => project !== null);
}
