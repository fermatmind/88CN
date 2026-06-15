import { getPublishedProjects } from "@/lib/demo-projects";
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

  return [...staticEntries, ...projectEntries];
}
