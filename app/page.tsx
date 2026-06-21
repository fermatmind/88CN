import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/constants";
import {
  CollectionCard,
  DiscoveryFilterPanel,
  DiscoveryShell,
  DiscoveryStatusPanel,
  HeroSearchConsole,
  ReviewedProjectList,
  SignalExplainerPanel,
  UseCaseRail,
  formatReviewDate,
} from "@/components/public-ui";
import {
  getProjectsForCuratedCollection,
  getPublishedCuratedCollections,
} from "@/lib/collections/curated-collections";
import {
  getPublishedProjectProjections,
  type PublishedProjectProjection,
} from "@/lib/projects/published-projection";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const allProjects = getPublishedProjectProjections()
    .slice()
    .sort((a, b) => b.last_reviewed_at.localeCompare(a.last_reviewed_at));
  const reviewedProjects = allProjects.slice(0, 8);
  const collections = getPublishedCuratedCollections();
  const visibleCollections = collections.slice(0, 4);
  const latestReviewed = allProjects[0]?.last_reviewed_at ?? "2026-06-21";
  const categoryFilters = buildCategoryFilters(allProjects);
  const sourceCounts = {
    official: allProjects.filter((project) => project.official_website_url)
      .length,
    docs: allProjects.filter((project) => project.docs_url).length,
    github: allProjects.filter((project) => project.github_url).length,
  };
  const useCases = [
    {
      label: "Build AI agents",
      initials: "AG",
      href: "/collections/open-source-ai-agents",
    },
    {
      label: "Add RAG to products",
      initials: "RA",
      href: "/collections/rag-projects",
    },
    {
      label: "Find AI developer infrastructure",
      initials: "DV",
      href: "/projects?category=AI+Developer+Infrastructure",
    },
    {
      label: "Explore open-source AI",
      initials: "OS",
      href: "/collections/open-source-ai-agents",
    },
    {
      label: "Review workflow automation",
      initials: "WF",
      href: "/projects?category=Workflow+Automation+%26+Integration",
    },
    {
      label: "Browse public tool categories",
      initials: "CT",
      href: "/projects",
    },
  ];

  return (
    <DiscoveryShell className="space-y-14">
      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-7 shadow-sm sm:px-8 lg:px-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold text-sky-600">
              {SITE_TAGLINE}
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Reviewed AI Project Index
            </h1>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
              Find AI projects through official links, reviewed public signals,
              and curated project collections.
            </p>
            <div className="mt-7">
              <HeroSearchConsole />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ["Open-source agents", "/collections/open-source-ai-agents"],
                ["RAG", "/collections/rag-projects"],
                [
                  "Developer tools",
                  "/projects?category=AI+Developer+Infrastructure",
                ],
                [
                  "Workflow automation",
                  "/projects?category=Workflow+Automation+%26+Integration",
                ],
                ["Global AI products", "/projects"],
                ["Recently reviewed", "/projects"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-sky-300 hover:text-slate-950"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <DiscoveryStatusPanel
            reviewedCount={allProjects.length}
            collectionCount={collections.length}
            latestReviewed={latestReviewed}
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            Live Reviewed Index
          </h2>
          <p className="mt-1 text-base text-slate-500">
            Browse public project profiles generated from reviewed projections.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_290px]">
          <DiscoveryFilterPanel
            categories={categoryFilters}
            sourceCounts={sourceCounts}
          />
          <ReviewedProjectList projects={reviewedProjects} />
          <SignalExplainerPanel />
        </div>
      </section>

      <UseCaseRail items={useCases} />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Curated Collections
            </h2>
            <p className="mt-1 text-base text-slate-500">
              Finite paths for focused AI project discovery.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-sky-300 hover:text-slate-950"
          >
            All collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCollections.map((collection, index) => {
            const collectionProjects = getProjectsForCuratedCollection(collection);
            const accents = [
              "bg-sky-400",
              "bg-violet-500",
              "bg-emerald-500",
              "bg-amber-500",
            ];

            return (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                projectCount={collectionProjects.length}
                representativeProjects={collectionProjects}
                accentClassName={accents[index % accents.length]}
                className="rounded-[1.25rem] border-slate-200 p-5"
              />
            );
          })}
        </div>
        <p className="mt-5 text-xs font-medium text-slate-400">
          Updated {formatReviewDate(latestReviewed)}
        </p>
      </section>
    </DiscoveryShell>
  );
}

function buildCategoryFilters(projects: PublishedProjectProjection[]) {
  const counts = new Map<string, number>();

  for (const project of projects) {
    counts.set(
      project.primary_category,
      (counts.get(project.primary_category) ?? 0) + 1
    );
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({
      label,
      count,
      href: `/projects?category=${encodeURIComponent(label)}`,
    }));
}
