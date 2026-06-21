import {
  EmptyState,
  PageShell,
  ProjectGrid,
  SectionHeader,
} from "@/components/public-ui";
import { searchPublishedProjectProjections } from "@/lib/projects/published-projection";
import { siteDescription, siteTitle } from "@/lib/seo";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: siteTitle("Projects"),
  description: siteDescription(
    "Browse free AI project profiles on 88CN. Discover reviewed public project projections with source signals and founder claim paths."
  ),
};

interface ProjectsPageProps {
  searchParams?: {
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const result = searchPublishedProjectProjections({
    query: searchParams?.q,
    category: searchParams?.category,
    tag: searchParams?.tag,
    page: Number(searchParams?.page ?? "1"),
  });
  const activeQuery = searchParams?.q?.trim() ?? "";
  const activeCategory = searchParams?.category?.trim() ?? "";
  const activeTag = searchParams?.tag?.trim() ?? "";

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Directory"
        title="Projects"
        description="Search reviewed published projections. Results paginate from a segmented public index and filters are finite browsing controls."
      />

      <form
        action="/projects"
        className="mb-6 grid gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_180px_auto]"
      >
        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
            Search
          </span>
          <input
            name="q"
            defaultValue={activeQuery}
            placeholder="Project, category, or public signal"
            className="h-10 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 text-sm text-terminal-fg outline-none transition-colors placeholder:text-terminal-dim focus:border-terminal-ring"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
            Category
          </span>
          <select
            name="category"
            defaultValue={activeCategory}
            className="h-10 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 text-sm text-terminal-fg outline-none transition-colors focus:border-terminal-ring"
          >
            <option value="">All categories</option>
            {result.filters.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
            Collection tag
          </span>
          <select
            name="tag"
            defaultValue={activeTag}
            className="h-10 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 text-sm text-terminal-fg outline-none transition-colors focus:border-terminal-ring"
          >
            <option value="">All tags</option>
            {result.filters.tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-terminal-fg px-4 text-xs font-semibold text-terminal-surface transition-colors hover:bg-terminal-muted"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </button>
          {(activeQuery || activeCategory || activeTag) && (
            <Link
              href="/projects"
              className="inline-flex h-10 items-center rounded-md border border-terminal-border px-3 text-xs font-semibold text-terminal-muted transition-colors hover:text-terminal-fg"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-terminal-dim">
        <span>
          {result.total} published projection{result.total === 1 ? "" : "s"}
        </span>
        <span>
          Page {result.page} of {result.pageCount}, {result.pageSize} per page
        </span>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="No public profiles matched"
          body="Adjust the query or finite filters. Records outside the reviewed published projection are not shown."
          action={
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md border border-terminal-border px-3 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
            >
              Reset search
            </Link>
          }
        />
      ) : (
        <ProjectGrid projects={result.items} />
      )}

      {result.pageCount > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-terminal-border pt-5 text-xs">
          <PaginationLink
            href={paginationHref(searchParams, result.page - 1)}
            disabled={result.page <= 1}
            label="Previous"
            icon="previous"
          />
          <span className="text-terminal-dim">
            Page {result.page} of {result.pageCount}
          </span>
          <PaginationLink
            href={paginationHref(searchParams, result.page + 1)}
            disabled={result.page >= result.pageCount}
            label="Next"
            icon="next"
          />
        </nav>
      )}
    </PageShell>
  );
}

function paginationHref(
  searchParams: ProjectsPageProps["searchParams"],
  page: number
) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.category) params.set("category", searchParams.category);
  if (searchParams?.tag) params.set("tag", searchParams.tag);
  params.set("page", String(page));
  return `/projects?${params.toString()}`;
}

function PaginationLink({
  href,
  disabled,
  label,
  icon,
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: "previous" | "next";
}) {
  const content = (
    <>
      {icon === "previous" && <ArrowLeft className="h-3.5 w-3.5" />}
      {label}
      {icon === "next" && <ArrowRight className="h-3.5 w-3.5" />}
    </>
  );

  if (disabled) {
    return (
      <span className="inline-flex h-9 items-center gap-2 rounded-md border border-terminal-border px-3 font-semibold text-terminal-dim opacity-50">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-terminal-border px-3 font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
    >
      {content}
    </Link>
  );
}
