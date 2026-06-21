import {
  CollectionCard,
  EmptyState,
  MethodologyPanel,
  PageShell,
  SectionHeader,
} from "@/components/public-ui";
import {
  getProjectsForCuratedCollection,
  getPublishedCuratedCollections,
} from "@/lib/collections/curated-collections";
import { siteDescription, siteTitle } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Collections"),
  description: siteDescription(
    "Browse finite 88CN collections assembled from reviewed published project projections."
  ),
};

export default function CollectionsPage() {
  const collections = getPublishedCuratedCollections();

  return (
    <PageShell className="space-y-8">
      <SectionHeader
        eyebrow="Finite browsing"
        title="Collections"
        description="Collections group public project profiles by explicit inclusion criteria. They are designed for navigation, not broad faceted search pages."
      />

      {collections.length === 0 ? (
        <EmptyState
          title="No public collections"
          body="Collections appear here only after they are published and sitemap eligible."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      )}

      <MethodologyPanel body="Each public collection resolves to published projections only. A collection page fails closed when the collection is not published, not sitemap eligible, or has no eligible public profiles." />
    </PageShell>
  );
}
