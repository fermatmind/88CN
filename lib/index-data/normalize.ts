import type { IndexDataProject } from "./types";
import { createHash } from "node:crypto";

export interface NormalizedImportPayload {
  name: string;
  slug: string;
  website_url: string;
  category_slug: string;
  one_liner: string;
  description?: string;
  public_sources: Record<string, string | null>;
  tags?: string[];
  tech_stack?: string[];
  source_type: string;
  region: string;
  language: string;
  schema_version: string;
}

export function normalizeProject(
  project: IndexDataProject
): NormalizedImportPayload {
  return {
    name: project.name,
    slug: project.slug,
    website_url: project.website_url,
    category_slug: project.category_slug,
    one_liner: project.one_liner,
    description: project.description || undefined,
    public_sources: {
      github_url: project.github_url || null,
      docs_url: project.docs_url || null,
      pricing_url: project.pricing_url || null,
      product_hunt_url: project.product_hunt_url || null,
      hacker_news_url: project.hacker_news_url || null,
      founder_public_url: project.founder_public_url || null,
      launch_url: project.launch_url || null,
    },
    tags: project.tags?.length ? project.tags : undefined,
    tech_stack: project.tech_stack?.length ? project.tech_stack : undefined,
    source_type: project.source_type,
    region: project.region,
    language: project.language,
    schema_version: project.schema_version,
  };
}

export function computeImportFingerprint(
  sourceRepo: string,
  sourcePath: string,
  sourceCommit: string | null,
  project: IndexDataProject
): string {
  const parts = [
    sourceRepo,
    sourcePath,
    sourceCommit ?? "no-commit",
    project.slug,
    project.website_url,
    JSON.stringify(project),
  ];
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32);
}
