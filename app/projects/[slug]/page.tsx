import { notFound } from "next/navigation";
import {
  getPublishedProjectBySlug,
  getPublishedProjectProjections,
} from "@/lib/projects/published-projection";
import { isProjectSitemapEligible } from "@/lib/projects/search-index";
import { getPublishedCuratedAlternatives } from "@/lib/alternatives/curated-alternatives";
import { siteTitle } from "@/lib/seo";
import {
  formatModel,
  MethodologyPanel,
  PageShell,
  ProjectOfficialLinks,
  ProjectSignalChips,
  ReviewTimestamp,
} from "@/components/public-ui";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
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
    <PageShell size="prose" className="space-y-8">
      <section className="border-b border-terminal-border pb-8">
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

        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-terminal-fg sm:text-5xl">
          {project.project_name}
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-terminal-muted">
          {project.original_summary}
        </p>

        <ReviewTimestamp value={project.last_reviewed_at} className="mt-5" />
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-4 text-sm font-semibold text-terminal-fg">
            Public Signal Chips
          </h2>
          <ProjectSignalChips
            chips={project.public_signal_chips}
            className="max-h-none"
          />
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
            Entity Scope
          </h2>
          <dl className="grid gap-2 text-xs leading-5 text-terminal-dim">
            <div className="flex justify-between gap-3">
              <dt>Profile</dt>
              <dd className="text-terminal-muted">Published projection</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Lifecycle</dt>
              <dd className="text-terminal-muted">{project.lifecycle_status}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Model</dt>
              <dd className="text-terminal-muted">
                {formatModel(project.open_source_or_commercial)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
            Official Source Links
          </h2>
          <ProjectOfficialLinks project={project} />
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
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
      </div>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
          Reviewed Alternatives
        </h2>
        {reviewedAlternatives.length === 0 ? (
          <p className="text-xs leading-5 text-terminal-dim">
            No reviewed alternatives entry is attached to this projection.
          </p>
        ) : (
          <ul className="grid gap-2">
            {reviewedAlternatives.map((entry) => (
              <li key={entry.canonicalSlug}>
                <Link
                  href={entry.canonicalPath}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-fg"
                >
                  {entry.title}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <MethodologyPanel body="This page is rendered from a reviewed published projection. Public UI excludes non-public review and pipeline material." />
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <div>
              <h2 className="mb-1 text-sm font-semibold text-terminal-fg">
                Founder Claim
              </h2>
              <p className="max-w-md text-xs leading-5 text-terminal-dim">
                Founders can claim a free project profile to request public
                projection corrections. Claim review stays separate from public
                indexing and does not expose private review material.
              </p>
              <Link
                href={`/claim/${project.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-terminal-border px-3 py-2 text-xs font-semibold text-terminal-fg transition-colors hover:bg-terminal-elevated"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Claim Project
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
