import { getPublishedProjects } from "@/lib/demo-projects";
import { demoCategories } from "@/lib/demo-categories";
import { demoCollections } from "@/lib/demo-collections";
import { demoReports } from "@/lib/demo-reports";
import { INDEXABLE_STATES } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/founders`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/genesis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/geo-checker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const published = getPublishedProjects();
  const projectEntries: MetadataRoute.Sitemap = published
    .filter((p) => INDEXABLE_STATES.has(p.status))
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const categoryEntries: MetadataRoute.Sitemap = demoCategories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionEntries: MetadataRoute.Sitemap = demoCollections.map(
    (c) => ({
      url: `${baseUrl}/collections/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const reportListEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/reports`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  const reportEntries: MetadataRoute.Sitemap = demoReports.map((r) => ({
    url: `${baseUrl}/reports/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...projectEntries,
    ...categoryEntries,
    ...collectionEntries,
    ...reportListEntries,
    ...reportEntries,
  ];
}
