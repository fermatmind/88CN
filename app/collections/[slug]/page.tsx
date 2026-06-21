import { notFound } from "next/navigation";
import {
  getCuratedCollectionBySlug,
  getProjectsForCuratedCollection,
  getPublishedCuratedCollections,
} from "@/lib/collections/curated-collections";
import { CollectionGrid } from "@/components/collection-grid";
import { collectionPageJSONLD } from "@/lib/structured-data";
import { siteTitle, siteDescription } from "@/lib/seo";
import { isCollectionSitemapEligible } from "@/lib/projects/search-index";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedCuratedCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = getCuratedCollectionBySlug(params.slug);
  const projects = collection ? getProjectsForCuratedCollection(collection) : [];

  if (
    !collection ||
    collection.status !== "published" ||
    projects.length < collection.minimumPublishedProjects
  ) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: siteTitle(collection.title),
    description: siteDescription(collection.summary.slice(0, 150)),
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
    robots: isCollectionSitemapEligible(collection)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = getCuratedCollectionBySlug(params.slug);
  if (!collection || collection.status !== "published") {
    notFound();
  }

  const projects = getProjectsForCuratedCollection(collection);

  if (projects.length < collection.minimumPublishedProjects) {
    notFound();
  }

  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";
  const pageUrl = `${baseUrl}/collections/${collection.slug}`;

  const collectionLD = collectionPageJSONLD(
    pageUrl,
    collection.title,
    collection.summary,
    projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      name: p.project_name,
    }))
  );

  const collectionView = {
    slug: collection.slug,
    title: collection.title,
    inclusionCriteria: collection.inclusionCriteria,
    editorialSummary: collection.summary,
    whyIncluded: collection.whyIncluded,
    projectSlugs: collection.projectSlugs,
    lastUpdated: collection.lastReviewed,
    methodologyNote: collection.methodologyNote,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLD) }}
      />
      <CollectionGrid collection={collectionView} projects={projects} />
    </div>
  );
}
