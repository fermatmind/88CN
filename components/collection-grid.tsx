import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import {
  EmptyState,
  MethodologyPanel,
  ProjectGrid,
  ReviewTimestamp,
} from "@/components/public-ui";
import { cn } from "@/lib/utils";
import { Bookmark, Filter } from "lucide-react";

interface CollectionView {
  slug: string;
  title: string;
  inclusionCriteria: string;
  editorialSummary: string;
  whyIncluded: string;
  projectSlugs: string[];
  matchTag: string;
  lastUpdated: string;
  methodologyNote: string;
}

interface CollectionGridProps {
  collection: CollectionView;
  projects: PublishedProjectProjection[];
  className?: string;
}

export function CollectionGrid({
  collection,
  projects,
  className,
}: CollectionGridProps) {
  return (
    <div className={cn("space-y-10", className)}>
      <section className="border-b border-terminal-border pb-8">
        <div className="mb-2 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-terminal-ring" />
          <span className="text-xs font-semibold text-terminal-ring">
            Curated Collection
          </span>
        </div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-terminal-fg sm:text-5xl">
          {collection.title}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-terminal-muted">
          {collection.editorialSummary}
        </p>
        <ReviewTimestamp
          value={collection.lastUpdated}
          label="Collection reviewed"
          className="mt-4"
        />
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <Filter className="h-4 w-4 text-terminal-ring" />
            Inclusion Criteria
          </h2>
          <p className="text-sm leading-6 text-terminal-dim">
            {collection.inclusionCriteria}
          </p>
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <Bookmark className="h-4 w-4 text-terminal-ring" />
            Why included
          </h2>
          <p className="text-sm leading-6 text-terminal-dim">
            {collection.whyIncluded}
          </p>
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-terminal-fg">
          Projects in This Collection
        </h2>
        {projects.length === 0 ? (
          <EmptyState
            title="No public profiles in this collection"
            body="This collection stays empty until eligible published projections match its finite criteria."
          />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>

      <MethodologyPanel body={collection.methodologyNote} />
    </div>
  );
}
