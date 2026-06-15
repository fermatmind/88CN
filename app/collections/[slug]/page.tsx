import { notFound } from "next/navigation";
import {
  getCollectionBySlug,
  demoCollections,
} from "@/lib/demo-collections";
import { getProjectBySlug } from "@/lib/demo-projects";
import { CollectionGrid } from "@/components/collection-grid";
import { collectionPageJSONLD } from "@/lib/structured-data";
import { siteTitle, siteDescription } from "@/lib/seo";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return demoCollections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) return { title: "Not Found" };

  return {
    title: siteTitle(collection.title),
    description: siteDescription(collection.editorialSummary.slice(0, 150)),
    robots: { index: true, follow: true },
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";
  const pageUrl = `${baseUrl}/collections/${collection.slug}`;

  const projects = collection.projectSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const collectionLD = collectionPageJSONLD(
    pageUrl,
    collection.title,
    collection.editorialSummary,
    projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      name: p.name,
    }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLD) }}
      />
      <CollectionGrid collection={collection} projects={projects} />
    </div>
  );
}
