import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import {
  CollectionCard,
  HeroSearch,
  MethodologyPanel,
  PageShell,
  ProjectGrid,
  SectionHeader,
} from "@/components/public-ui";
import {
  getProjectsForCuratedCollection,
  getPublishedCuratedCollections,
} from "@/lib/collections/curated-collections";
import { getPublishedProjectProjections } from "@/lib/projects/published-projection";
import { ArrowRight, PlusCircle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const projects = getPublishedProjectProjections()
    .slice()
    .sort((a, b) => b.last_reviewed_at.localeCompare(a.last_reviewed_at))
    .slice(0, 6);
  const collections = getPublishedCuratedCollections().slice(0, 3);

  return (
    <PageShell className="space-y-12">
      <section className="grid gap-8 border-b border-terminal-border pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold text-terminal-ring">
            Free AI Project Growth Index
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-terminal-fg sm:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-terminal-muted">
            {SITE_TAGLINE}. Browse reviewed public project profiles with
            source links, timestamped reviews, and finite editorial
            collections.
          </p>
          <div className="mt-7">
            <HeroSearch />
          </div>
        </div>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <ShieldCheck className="h-4 w-4 text-terminal-ring" />
            Public surface rules
          </h2>
          <dl className="mt-4 grid gap-3 text-xs leading-5 text-terminal-dim">
            <div>
              <dt className="font-semibold text-terminal-muted">Reviewed</dt>
              <dd>Only published projections appear on public pages.</dd>
            </div>
            <div>
              <dt className="font-semibold text-terminal-muted">Sourced</dt>
              <dd>
                Official website, docs, and public repository links stay
                visible.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-terminal-muted">Finite</dt>
              <dd>
                Collections are curated sets, not broad faceted landing pages.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Browse"
          title="Finite Collections"
          description="Start from reviewed collection paths designed for scanning, comparison, and source checking."
          action={
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-md border border-terminal-border px-3 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
            >
              All collections
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((collection) => {
            const collectionProjects = getProjectsForCuratedCollection(collection);

            return (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                projectCount={collectionProjects.length}
                representativeProjects={collectionProjects}
              />
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Recently reviewed"
          title="Public Project Profiles"
          description="Cards are optimized for fast scanning: category, model, public signals, review date, and official links."
          action={
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-terminal-fg px-3 py-2 text-xs font-semibold text-terminal-surface transition-colors hover:bg-terminal-muted"
            >
              Browse projects
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <ProjectGrid projects={projects} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <MethodologyPanel body="88CN public pages are assembled from reviewed published projections. Pages show public descriptors, official source links, signal chips, and review timestamps only." />
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <PlusCircle className="h-4 w-4 text-terminal-ring" />
            Submit a public project
          </h2>
          <p className="text-sm leading-6 text-terminal-dim">
            Share a project for editorial review. Submission does not guarantee
            publication, placement, or search treatment.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-terminal-border px-3 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
          >
            Submit project
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
