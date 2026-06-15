import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/demo-projects";
import {
  SignalScore,
  SignalDimensionBar,
} from "@/components/signal-score";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { SIGNAL_DIMENSIONS, INDEXABLE_STATES } from "@/lib/constants";
import { siteTitle } from "@/lib/seo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Not Found" };

  const indexable = INDEXABLE_STATES.has(project.status);

  return {
    title: siteTitle(project.name),
    description: project.tagline,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const claimed =
    project.status === "claimed" || project.status === "owner_verified";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
            {project.category}
          </span>
          <SignalScore score={project.signalScore} size="md" />
          <SourceConfidenceBadge level={project.sourceConfidence} />
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium",
              claimed
                ? "border-terminal-ring bg-terminal-elevated text-terminal-fg"
                : "border-terminal-border bg-transparent text-terminal-dim"
            )}
          >
            {claimed ? "Claimed" : "Unclaimed"}
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-terminal-fg">
          {project.name}
        </h1>

        <p className="text-sm text-terminal-muted leading-relaxed max-w-2xl">
          {project.tagline}
        </p>

        <div className="mt-3 flex items-center gap-1 text-xs text-terminal-dim">
          <ExternalLink className="h-3 w-3" />
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terminal-muted transition-colors underline underline-offset-2"
          >
            {project.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>

      <section className="mb-10 rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-5 text-sm font-semibold tracking-tight text-terminal-fg">
          Signal Score Dimensions
        </h2>

        <div className="flex items-center justify-between mb-5 pb-4 border-b border-terminal-border">
          <span className="text-xs font-mono tracking-widest uppercase text-terminal-dim">
            Composite Score
          </span>
          <SignalScore score={project.signalScore} size="lg" />
        </div>

        <div className="space-y-3">
          {SIGNAL_DIMENSIONS.map((dim) => (
            <SignalDimensionBar
              key={dim.key}
              label={dim.label}
              value={project.scores[dim.key]}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            Public Sources
          </h2>
          <ul className="space-y-1.5">
            {project.publicSources.map((source) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-terminal-muted hover:text-terminal-fg transition-colors underline underline-offset-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  {source.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-terminal-fg">
            88CN Editorial Note
          </h2>
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <p className="text-xs text-terminal-dim leading-relaxed">
              {project.editorialNote}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <div>
              <h2 className="text-sm font-semibold text-terminal-fg mb-1">
                {claimed ? "Project Claimed" : "Claim This Project"}
              </h2>
              <p className="text-xs text-terminal-dim leading-relaxed max-w-md">
                {claimed
                  ? "This project has been claimed by its founder. Verification details are available to the project owner."
                  : "Are you the founder of this project? Claim your free AI project profile to manage public growth signals and editorial information."}
              </p>
            </div>
          </div>

          {!claimed && (
            <Link
              href={`/claim/${project.slug}`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-terminal-border px-4 py-2 text-xs font-semibold text-terminal-fg hover:bg-terminal-elevated transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Claim Project
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
