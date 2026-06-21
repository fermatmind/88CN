import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import type { CuratedCollection } from "@/lib/collections/curated-collections";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  Filter,
  ExternalLink,
  FileText,
  Github,
  Globe2,
  Layers,
  ListChecks,
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

export function formatReviewDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getProjectInitials(projectName: string) {
  return projectName
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join("");
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

export function DiscoveryShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </main>
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

export function HeroSearchConsole({
  className,
}: {
  className?: string;
}) {
  return (
    <form
      action="/projects"
      className={cn(
        "group flex min-h-[64px] w-full max-w-4xl items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-colors focus-within:border-sky-400 sm:px-5",
        className
      )}
    >
      <Search className="h-6 w-6 shrink-0 text-slate-500 transition-colors group-focus-within:text-sky-500" />
      <label className="min-w-0 flex-1">
        <span className="sr-only">Search reviewed AI projects</span>
        <input
          name="q"
          placeholder="Search AI projects..."
          className="h-14 w-full border-0 bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>
      <button className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:inline-flex">
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

export function ProjectSignalPill({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: "blue" | "green" | "slate" | "amber" | "cyan";
}) {
  const toneClass = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold",
        toneClass
      )}
    >
      {label}
    </span>
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

export function DiscoveryStatusPanel({
  reviewedCount,
  collectionCount,
  latestReviewed,
}: {
  reviewedCount: number;
  collectionCount: number;
  latestReviewed: string;
}) {
  const rows = [
    ["Reviewed profiles", String(reviewedCount)],
    ["Curated collections", String(collectionCount)],
    ["Official source linked", "Yes"],
    ["Updated", formatReviewDate(latestReviewed)],
  ];

  return (
    <aside className="rounded-[1.35rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Index status</h2>
        <BadgeCheck className="h-5 w-5 text-sky-300" />
      </div>
      <dl className="grid gap-4">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
          >
            <dt className="text-sm text-slate-300">{label}</dt>
            <dd className="text-sm font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">
        Reviewed public profiles only. Public source fields are shown.
      </p>
    </aside>
  );
}

export function DiscoveryFilterPanel({
  categories,
  sourceCounts,
}: {
  categories: Array<{ label: string; count: number; href: string }>;
  sourceCounts: {
    official: number;
    docs: number;
    github: number;
  };
}) {
  const sourceRows = [
    ["Official site", sourceCounts.official],
    ["Docs", sourceCounts.docs],
    ["GitHub", sourceCounts.github],
  ];

  return (
    <aside className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
        <Filter className="h-4 w-4 text-slate-500" />
        Filter
      </h2>
      <div className="space-y-7">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Category
          </p>
          <div className="grid gap-2.5">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.label}
                href={category.href}
                className="group flex items-center justify-between gap-3 rounded-lg text-sm text-slate-600 transition-colors hover:text-slate-950"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      index === 0
                        ? "border-sky-400 bg-sky-50 text-sky-600"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {index === 0 && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{category.label}</span>
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Source availability
          </p>
          <div className="grid gap-2.5">
            {sourceRows.map(([label, count], index) => (
              <Link
                key={label}
                href="/projects"
                className="flex items-center justify-between gap-3 text-sm text-slate-600 transition-colors hover:text-slate-950"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      index === 0
                        ? "border-sky-400 bg-sky-50 text-sky-600"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {index === 0 && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                  {label}
                </span>
                <span className="text-xs text-slate-400">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ReviewedProjectList({
  projects,
}: {
  projects: PublishedProjectProjection[];
}) {
  return (
    <section className="min-w-0 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Reviewed project profiles
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Recent public profiles with official source links.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-300 hover:text-slate-950"
        >
          Recently reviewed
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {projects.map((project) => (
          <ReviewedProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

export function ReviewedProjectRow({
  project,
}: {
  project: PublishedProjectProjection;
}) {
  return (
    <article className="grid gap-3 py-3.5 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
          {getProjectInitials(project.project_name)}
        </div>
        <div className="min-w-0">
          <Link
            href={`/projects/${project.slug}`}
            className="group inline-flex max-w-full items-center gap-1 text-base font-semibold text-slate-950"
          >
            <span className="truncate">{project.project_name}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-sky-500" />
          </Link>
          <p className="mt-0.5 line-clamp-1 max-w-2xl text-sm leading-5 text-slate-500">
            {project.original_summary}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 2xl:justify-end">
        <ProjectSignalPill label={project.primary_category} tone="slate" />
        <ProjectSignalPill label="Official" tone="cyan" />
        {project.docs_url && <ProjectSignalPill label="Docs" tone="green" />}
        {project.github_url && <ProjectSignalPill label="GitHub" tone="slate" />}
        <span className="ml-0 text-xs font-medium text-slate-400 2xl:ml-2">
          {formatReviewDate(project.last_reviewed_at)}
        </span>
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          View
        </Link>
      </div>
    </article>
  );
}

export function SignalExplainerPanel() {
  const rows = [
    ["Official site", "Reviewed public website link"],
    ["Docs", "Documentation link if available"],
    ["GitHub", "Public repository signal"],
    ["Reviewed timestamp", "Profile freshness marker"],
    ["Machine-readable checks", "Public-readiness indicators"],
  ];

  return (
    <aside className="rounded-[1.25rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
      <h2 className="text-xl font-semibold tracking-tight">
        What public signals mean
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Source-linked indicators, not endorsements.
      </p>
      <div className="mt-8 grid gap-6">
        {rows.map(([title, body]) => (
          <div key={title} className="flex gap-3">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-sky-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-0.5 text-xs leading-5 text-slate-400">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-slate-300">
        Private review workspace is excluded from public pages.
      </div>
    </aside>
  );
}

export function UseCaseRail({
  items,
}: {
  items: Array<{ label: string; initials: string; href: string }>;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Browse by use case
        </h2>
        <p className="mt-1 text-base text-slate-500">
          Compact paths into common AI project workflows.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group inline-flex min-h-12 min-w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-sky-300 hover:text-slate-950"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-700">
              {item.initials}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ConsolePageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-7 shadow-sm sm:px-8",
        className
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold text-sky-600">{eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {description}
          </p>
        </div>
        {action}
      </div>
    </section>
  );
}

export function EvidenceStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  );
}

export function ProjectLogoMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm",
        className
      )}
    >
      {getProjectInitials(name) || "AI"}
    </div>
  );
}

export function ProjectAssetCard({
  project,
  featured = false,
}: {
  project: PublishedProjectProjection;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group rounded-[1.25rem] border bg-white p-5 shadow-sm transition-colors hover:border-sky-300",
        featured ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <ProjectLogoMark name={project.project_name} />
          <div className="min-w-0">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex max-w-full items-center gap-1 text-xl font-semibold tracking-tight text-slate-950"
            >
              <span className="truncate">{project.project_name}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-sky-500" />
            </Link>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-600">
              {project.original_summary}
            </p>
          </div>
        </div>
        <div className="shrink-0 sm:text-right">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            View
          </Link>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            No ranking
            <br />
            No paid boost
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <ProjectSignalPill label={formatModel(project.open_source_or_commercial)} tone="amber" />
        <ProjectSignalPill label="Official site" tone="cyan" />
        {project.docs_url && <ProjectSignalPill label="Docs" tone="blue" />}
        <ProjectSignalPill label="Reviewed profile" tone="green" />
        {project.github_url && <ProjectSignalPill label="GitHub" tone="slate" />}
        <ProjectSignalPill label={formatReviewDate(project.last_reviewed_at)} tone="slate" />
      </div>
    </article>
  );
}

export function EvidencePanel({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function EntityScopePanel({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <EvidencePanel title="Entity scope" icon={<Layers className="h-4 w-4 text-slate-500" />}>
      <dl className="grid gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="max-w-[55%] text-right font-semibold text-slate-950">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </EvidencePanel>
  );
}

export function PublicSignalChecklist({
  project,
}: {
  project: PublishedProjectProjection;
}) {
  const rows = [
    ["Website", Boolean(project.official_website_url), "checked"],
    ["Docs", Boolean(project.docs_url), project.docs_url ? "checked" : "unavailable"],
    ["GitHub", Boolean(project.github_url), project.github_url ? "checked" : "unavailable"],
    ["Collection", project.collection_tags.length > 0, "checked"],
    ["Last reviewed", Boolean(project.last_reviewed_at), "checked"],
  ];

  return (
    <EvidencePanel
      title="Public signals"
      icon={<ListChecks className="h-4 w-4 text-slate-500" />}
    >
      <ul className="grid gap-3 text-sm">
        {rows.map(([label, ok, state]) => (
          <li key={String(label)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span
                className={cn(
                  "h-3.5 w-3.5 rounded-full border",
                  ok
                    ? "border-emerald-200 bg-emerald-100"
                    : "border-amber-200 bg-amber-100"
                )}
              />
              {label}
            </span>
            <span className="text-xs text-slate-400">{state}</span>
          </li>
        ))}
      </ul>
    </EvidencePanel>
  );
}

export function ProjectDetailHero({
  project,
}: {
  project: PublishedProjectProjection;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row">
          <ProjectLogoMark name={project.project_name} className="h-20 w-20 text-lg" />
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold text-sky-600">
              Reviewed public profile
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {project.project_name}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              {project.original_summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProjectSignalPill label="Reviewed profile" tone="green" />
              <ProjectSignalPill label={formatModel(project.open_source_or_commercial)} tone="amber" />
              <ProjectSignalPill label={project.primary_category} tone="blue" />
              <ProjectSignalPill label="Official source linked" tone="cyan" />
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:min-w-48">
          <a
            href={project.official_website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Official site
          </a>
          {project.docs_url && (
            <a
              href={project.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-slate-950"
            >
              Docs
            </a>
          )}
        </div>
      </div>
    </section>
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
  className,
  accentClassName,
}: {
  collection: CuratedCollection;
  projectCount: number;
  representativeProjects?: PublishedProjectProjection[];
  className?: string;
  accentClassName?: string;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm transition-colors hover:border-terminal-ring",
        className
      )}
    >
      {accentClassName && (
        <span
          className={cn("absolute inset-x-0 top-0 h-1", accentClassName)}
          aria-hidden="true"
        />
      )}
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
