import { PublishedProjectCard } from "@/components/published-project-card";
import { searchPublishedProjectProjections } from "@/lib/projects/published-projection";
import { siteTitle, siteDescription } from "@/lib/seo";
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-terminal-fg">
          Projects
        </h1>
        <p className="text-sm text-terminal-dim">
          Search reviewed published projections. Filters are finite and do not
          create faceted index pages.
        </p>
      </div>

      <form
        action="/projects"
        className="mb-6 grid gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-4 md:grid-cols-[minmax(0,1fr)_220px_180px_auto]"
      >
        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
            Search
          </span>
          <input
            name="q"
            defaultValue={activeQuery}
            placeholder="Project, category, public signal"
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
            className="h-10 rounded-md border border-terminal-ring bg-terminal-elevated px-4 text-xs font-semibold text-terminal-fg transition-colors hover:bg-terminal-border"
          >
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-terminal-dim">
            No published projections matched this search.
          </p>
          <p className="mt-1 text-xs text-terminal-dim/60">
            Adjust the query or finite filters. Unreviewed records are not shown.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((project) => (
            <PublishedProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
