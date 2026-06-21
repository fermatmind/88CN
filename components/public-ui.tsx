import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import type { CuratedCollection } from "@/lib/collections/curated-collections";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Github,
  Globe2,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export function formatModel(
  value: PublishedProjectProjection["open_source_or_commercial"]
) {
  if (value === "open_source") return "Open source";
  if (value === "commercial") return "Commercial";
  return "Hybrid";
}

export function formatHost(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function formatChipLabel(chip: string) {
  const labels: Record<string, string> = {
    has_docs: "Docs linked",
    has_community: "Public community",
    has_github: "GitHub linked",
    official_site: "Official site",
    public_signals_only: "Public signals only",
  };

  return labels[chip] ?? chip.replace(/_/g, " ");
}

export function PageShell({
  children,
  className,
  size = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "wide" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-10 sm:px-6 sm:py-12",
        size === "wide" ? "max-w-7xl" : "max-w-4xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 border-b border-terminal-border pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold text-terminal-ring">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-terminal-fg sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm leading-6 text-terminal-dim">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function HeroSearch({
  defaultValue,
  className,
  compact = false,
}: {
  defaultValue?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <form
      action="/projects"
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border border-terminal-border bg-terminal-surface p-2 shadow-sm sm:flex-row",
        compact ? "max-w-xl" : "max-w-3xl",
        className
      )}
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search public projects</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-dim" />
        <input
          name="q"
          defaultValue={defaultValue}
          placeholder="Search projects, categories, or public signals"
          className="h-11 w-full rounded-md border border-transparent bg-terminal-bg pl-10 pr-3 text-sm text-terminal-fg placeholder:text-terminal-dim focus:border-terminal-ring"
        />
      </label>
      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-terminal-fg px-4 text-sm font-semibold text-terminal-surface transition-colors hover:bg-terminal-muted">
        Search
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export function ProjectSignalChips({
  chips,
  className,
}: {
  chips: string[];
  className?: string;
}) {
  const visibleChips = chips.slice(0, 4);

  return (
    <div className={cn("flex max-h-[58px] flex-wrap gap-1.5 overflow-hidden", className)}>
      {visibleChips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-800 ring-1 ring-inset ring-blue-100"
        >
          <CheckCircle2 className="h-3 w-3" />
          {formatChipLabel(chip)}
        </span>
      ))}
    </div>
  );
}

export function ReviewTimestamp({
  value,
  label = "Last reviewed",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium text-terminal-dim",
        className
      )}
    >
      <Clock3 className="h-3.5 w-3.5" />
      {label}: {value}
    </span>
  );
}

export function ProjectOfficialLinks({
  project,
  className,
}: {
  project: PublishedProjectProjection;
  className?: string;
}) {
  const links = [
    {
      href: project.official_website_url,
      label: "Official website",
      detail: formatHost(project.official_website_url),
      icon: Globe2,
    },
    project.github_url
      ? {
          href: project.github_url,
          label: "Public GitHub",
          detail: formatHost(project.github_url),
          icon: Github,
        }
      : undefined,
    project.docs_url
      ? {
          href: project.docs_url,
          label: "Public docs",
          detail: formatHost(project.docs_url),
          icon: FileText,
        }
      : undefined,
  ].filter((link): link is NonNullable<typeof link> => link !== undefined);

  return (
    <div className={cn("grid gap-2", className)}>
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-11 items-center justify-between gap-3 rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-sm transition-colors hover:border-terminal-ring"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-terminal-ring" />
              <span className="min-w-0">
                <span className="block font-medium text-terminal-fg">
                  {link.label}
                </span>
                <span className="block truncate text-xs text-terminal-dim">
                  {link.detail}
                </span>
              </span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-terminal-dim transition-colors group-hover:text-terminal-ring" />
          </a>
        );
      })}
    </div>
  );
}

export function ProjectCard({
  project,
  className,
}: {
  project: PublishedProjectProjection;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border border-terminal-border bg-terminal-surface p-4 shadow-sm transition-colors hover:border-terminal-ring",
        className
      )}
    >
      <div className="min-w-0">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex max-w-full items-center gap-1 text-base font-semibold text-terminal-fg"
            >
              <span className="truncate">{project.project_name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-terminal-dim transition-colors group-hover:text-terminal-ring" />
            </Link>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-md border border-terminal-border px-2 py-0.5 font-medium text-terminal-muted">
                {project.primary_category}
              </span>
              <span className="rounded-md border border-terminal-border px-2 py-0.5 text-terminal-dim">
                {formatModel(project.open_source_or_commercial)}
              </span>
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-terminal-dim">
          {project.original_summary}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <ProjectSignalChips chips={project.public_signal_chips} />
        <ReviewTimestamp value={project.last_reviewed_at} />
      </div>

      <div className="mt-auto pt-4">
        <a
          href={project.official_website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-terminal-ring underline-offset-4 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{formatHost(project.official_website_url)}</span>
        </a>
      </div>
    </article>
  );
}

export function ProjectGrid({
  projects,
  className,
}: {
  projects: PublishedProjectProjection[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

export function CollectionCard({
  collection,
  projectCount,
  representativeProjects = [],
}: {
  collection: CuratedCollection;
  projectCount: number;
  representativeProjects?: PublishedProjectProjection[];
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group flex h-full flex-col rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm transition-colors hover:border-terminal-ring"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold text-terminal-ring">
            Finite collection
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-terminal-fg">
            {collection.title}
          </h2>
        </div>
        <ArrowUpRight className="h-4 w-4 text-terminal-dim transition-colors group-hover:text-terminal-ring" />
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-terminal-dim">
        {collection.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-terminal-dim">
        <span className="rounded-md border border-terminal-border px-2 py-1">
          {projectCount} public profiles
        </span>
        <span className="rounded-md border border-terminal-border px-2 py-1">
          Reviewed {collection.lastReviewed}
        </span>
      </div>
      {representativeProjects.length > 0 && (
        <p className="mt-4 text-xs leading-5 text-terminal-dim">
          Includes{" "}
          {representativeProjects
            .slice(0, 3)
            .map((project) => project.project_name)
            .join(", ")}
        </p>
      )}
    </Link>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-terminal-border bg-terminal-surface px-5 py-12 text-center",
        className
      )}
    >
      <ShieldCheck className="mx-auto mb-3 h-5 w-5 text-terminal-ring" />
      <h2 className="text-base font-semibold text-terminal-fg">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-terminal-dim">
        {body}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function MethodologyPanel({
  title = "Methodology",
  body,
  className,
}: {
  title?: string;
  body: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm",
        className
      )}
    >
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
        <BookOpen className="h-4 w-4 text-terminal-ring" />
        {title}
      </h2>
      <p className="text-sm leading-6 text-terminal-dim">{body}</p>
    </section>
  );
}
