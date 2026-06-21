import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import { PublishedProjectCard } from "@/components/published-project-card";
import { MethodologyBlock } from "@/components/methodology-block";
import { cn } from "@/lib/utils";
import { Bookmark, Filter, Clock } from "lucide-react";

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
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-terminal-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            Curated Collection
          </span>
        </div>
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-terminal-fg">
          {collection.title}
        </h1>
        <p className="max-w-3xl text-sm text-terminal-muted leading-relaxed">
          {collection.editorialSummary}
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <Filter className="h-4 w-4 text-terminal-muted" />
            Inclusion Criteria
          </h2>
          <p className="text-xs text-terminal-dim leading-relaxed">
            {collection.inclusionCriteria}
          </p>
        </section>

        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <Bookmark className="h-4 w-4 text-terminal-muted" />
            Why These Projects Are Included
          </h2>
          <p className="text-xs text-terminal-dim leading-relaxed">
            {collection.whyIncluded}
          </p>
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-terminal-fg">
          Projects in This Collection
        </h2>
        {projects.length === 0 ? (
          <p className="text-xs text-terminal-dim">
            No reviewed projects are available in this collection yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <PublishedProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <Clock className="h-4 w-4 shrink-0 text-terminal-dim" />
        <p className="text-xs text-terminal-dim">
          Last updated: {collection.lastUpdated}
        </p>
      </div>

      <MethodologyBlock methodologyNote={collection.methodologyNote} />
    </div>
  );
}
