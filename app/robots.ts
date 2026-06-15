import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/projects",
          "/projects/*",
          "/categories/",
          "/categories/*",
          "/collections/",
          "/collections/*",
          "/reports",
          "/reports/*",
          "/founders",
          "/genesis",
        ],
        disallow: ["/admin/", "/api/", "/preview/", "/claim/", "/submit/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
