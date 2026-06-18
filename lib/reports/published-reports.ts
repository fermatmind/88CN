import { demoReports } from "@/lib/demo-reports";
import {
  FOUNDER_INTENT_REPORT_PATH,
  FOUNDER_INTENT_REPORT_SLUG,
  FOUNDER_INTENT_REPORT_SUBTITLE,
  FOUNDER_INTENT_REPORT_TITLE,
} from "@/lib/reports/seed-100-readiness-report";
import {
  SUBMISSION_CHANNELS_REPORT_PATH,
  SUBMISSION_CHANNELS_REPORT_SLUG,
  SUBMISSION_CHANNELS_REPORT_SUBTITLE,
  SUBMISSION_CHANNELS_REPORT_TITLE,
} from "@/lib/reports/submission-channels-report";
import type { MetadataRoute } from "next";

export interface PublishedReportRoute {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  status: "published";
  kind: "founder-intent" | "demo-report";
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
}

const founderIntentReport: PublishedReportRoute = {
  slug: FOUNDER_INTENT_REPORT_SLUG,
  path: FOUNDER_INTENT_REPORT_PATH,
  title: FOUNDER_INTENT_REPORT_TITLE,
  description: FOUNDER_INTENT_REPORT_SUBTITLE,
  date: "2026-06-18",
  status: "published",
  kind: "founder-intent",
  changeFrequency: "monthly",
  priority: 0.7,
};

const submissionChannelsReport: PublishedReportRoute = {
  slug: SUBMISSION_CHANNELS_REPORT_SLUG,
  path: SUBMISSION_CHANNELS_REPORT_PATH,
  title: SUBMISSION_CHANNELS_REPORT_TITLE,
  description: SUBMISSION_CHANNELS_REPORT_SUBTITLE,
  date: "2026-06-18",
  status: "published",
  kind: "founder-intent",
  changeFrequency: "monthly",
  priority: 0.65,
};

const demoPublishedReports: PublishedReportRoute[] = demoReports.map(
  (report) => ({
    slug: report.slug,
    path: `/reports/${report.slug}`,
    title: report.title,
    description: report.executiveSummary,
    date: report.date,
    status: "published",
    kind: "demo-report",
    changeFrequency: "weekly",
    priority: 0.7,
  })
);

export function getPublishedReportRoutes(): PublishedReportRoute[] {
  const byPath = new Map<string, PublishedReportRoute>();

  for (const report of [
    founderIntentReport,
    submissionChannelsReport,
    ...demoPublishedReports,
  ]) {
    if (report.status === "published") byPath.set(report.path, report);
  }

  return [...byPath.values()];
}

export function getPublishedReportSitemapEntries(
  baseUrl: string
): MetadataRoute.Sitemap {
  return getPublishedReportRoutes().map((report) => ({
    url: `${baseUrl}${report.path}`,
    lastModified: new Date(report.date),
    changeFrequency: report.changeFrequency,
    priority: report.priority,
  }));
}

export function getPublishedReportListItems(baseUrl: string) {
  return getPublishedReportRoutes().map((report) => ({
    url: `${baseUrl}${report.path}`,
    name: report.title,
  }));
}
