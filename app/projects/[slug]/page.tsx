import { notFound } from "next/navigation";
import {
  getPublishedProjectBySlug,
  getPublishedProjectProjections,
} from "@/lib/projects/published-projection";
import { isProjectSitemapEligible } from "@/lib/projects/search-index";
import { getPublishedCuratedAlternatives } from "@/lib/alternatives/curated-alternatives";
import { siteTitle } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Github,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedProjectProjections().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = getPublishedProjectBySlug(params.slug);
  if (!project) return { title: "Not Found" };

  return {
    title: siteTitle(project.project_name),
    description: project.original_summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    robots: isProjectSitemapEligible(project)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getPublishedProjectBySlug(params.slug);
  if (!project) notFound();

  const reviewedAlternatives = getPublishedCuratedAlternatives().filter(
    (entry) =>
      entry.leftProjectSlug === project.slug ||
      entry.rightProjectSlug === project.slug
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
            {project.primary_category}
          </span>
          <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-dim">
            Published projection
          </span>
          <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-dim">
            {formatModel(project.open_source_or_commercial)}
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-terminal-fg">
          {project.project_name}
        </h1>

        <p className="text-sm text-terminal-muted leading-relaxed max-w-2xl">
          {project.original_summary}
        </p>

        <div className="mt-3 flex items-center gap-1 text-xs text-terminal-dim">
          <ExternalLink className="h-3 w-3" />
          <a
            href={project.official_website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terminal-muted transition-colors underline underline-offset-2"
          >
            {project.official_website_url.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>

      <section className="mb-10 rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-4 text-sm font-semibold tracking-tight text-terminal-fg">
          Public Signal Chips
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.public_signal_chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-md bg-terminal-elevated px-2.5 py-1 text-xs font-medium text-terminal-muted"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            Source Links
          </h2>
          <ul className="space-y-2">
            {[
              {
                href: project.official_website_url,
                label: "Official website",
                icon: ExternalLink,
              },
              project.github_url
                ? {
                    href: project.github_url,
                    label: "Public GitHub",
                    icon: Github,
                  }
                : undefined,
              project.docs_url
                ? {
                    href: project.docs_url,
                    label: "Public docs",
                    icon: FileText,
                  }
                : undefined,
            ]
              .filter((source): source is SourceLink => source !== undefined)
              .map((source) => {
                const Icon = source.icon;

                return (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-terminal-muted hover:text-terminal-fg transition-colors underline underline-offset-2"
                    >
                      <Icon className="h-3 w-3" />
                      {source.label}
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            Entity Scope
          </h2>
          <div className="space-y-2 text-xs leading-relaxed text-terminal-dim">
            <p>Project profile</p>
            <p>Lifecycle: {project.lifecycle_status}</p>
            <p>Last reviewed: {project.last_reviewed_at}</p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            Collections
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.collection_tags.map((tag) => (
              <Link
                key={tag}
                href={`/collections/${tag}`}
                className="inline-flex items-center gap-1 rounded-md border border-terminal-border px-2.5 py-1 text-xs font-medium text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
              >
                {tag}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            Reviewed Alternatives
          </h2>
          {reviewedAlternatives.length === 0 ? (
            <p className="text-xs leading-relaxed text-terminal-dim">
              No reviewed alternatives entry is attached to this projection.
            </p>
          ) : (
            <ul className="space-y-2">
              {reviewedAlternatives.map((entry) => (
                <li key={entry.canonicalSlug}>
                  <Link
                    href={entry.canonicalPath}
                    className="inline-flex items-center gap-1.5 text-xs text-terminal-muted transition-colors hover:text-terminal-fg"
                  >
                    {entry.title}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <div>
              <h2 className="text-sm font-semibold text-terminal-fg mb-1">
                Founder Claim
              </h2>
              <p className="text-xs text-terminal-dim leading-relaxed max-w-md">
                Founders can claim a free project profile to request public
                projection corrections. Claim review stays separate from public
                indexing and does not expose private review material.
              </p>
            </div>
          </div>

          <Link
            href={`/claim/${project.slug}`}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-terminal-border px-4 py-2 text-xs font-semibold text-terminal-fg hover:bg-terminal-elevated transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Claim Project
          </Link>
        </div>
      </section>
    </div>
  );
}

interface SourceLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

function formatModel(value: "open_source" | "commercial" | "hybrid") {
  if (value === "open_source") return "Open source";
  if (value === "commercial") return "Commercial";
  return "Hybrid";
}
