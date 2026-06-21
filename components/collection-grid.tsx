import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import {
  ConsolePageHeader,
  EmptyState,
  EvidencePanel,
  EvidenceStat,
  ProjectAssetCard,
  ProjectSignalPill,
  formatReviewDate,
} from "@/components/public-ui";
import { cn } from "@/lib/utils";
import { Bookmark, Filter, ShieldCheck } from "lucide-react";

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
    <div className={cn("space-y-8", className)}>
      <ConsolePageHeader
        eyebrow="Curated collection"
        title={collection.title}
        description={collection.editorialSummary}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <EvidenceStat
          label="Profiles"
          value={String(projects.length)}
          detail="Published projections"
        />
        <EvidenceStat
          label="Reviewed"
          value={formatReviewDate(collection.lastUpdated)}
          detail="Collection review timestamp"
        />
        <EvidenceStat
          label="Navigation"
          value="Finite"
          detail="Manual inclusion criteria"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidencePanel
          title="Inclusion criteria"
          icon={<Filter className="h-4 w-4 text-slate-500" />}
        >
          <p className="text-sm leading-6 text-slate-600">
            {collection.inclusionCriteria}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ProjectSignalPill label={collection.matchTag} tone="blue" />
            <ProjectSignalPill label="Published only" tone="green" />
            <ProjectSignalPill label="Finite collection" tone="slate" />
          </div>
        </EvidencePanel>

        <EvidencePanel
          title="Why included"
          icon={<Bookmark className="h-4 w-4 text-slate-500" />}
        >
          <p className="text-sm leading-6 text-slate-600">
            {collection.whyIncluded}
          </p>
        </EvidencePanel>
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Projects in this collection
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Reviewed public profiles that match this finite collection.
            </p>
          </div>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            title="No public profiles in this collection"
            body="This collection stays empty until eligible published projections match its finite criteria."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectAssetCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <EvidencePanel
        title="Methodology note"
        icon={<ShieldCheck className="h-4 w-4 text-slate-500" />}
      >
        <p className="text-sm leading-6 text-slate-600">
          {collection.methodologyNote}
        </p>
      </EvidencePanel>
    </div>
  );
}
