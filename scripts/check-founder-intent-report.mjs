import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_SLUG = "early-ai-project-machine-readability-2026";
const REPORT_ROUTE = `app/reports/${REPORT_SLUG}/page.tsx`;
const PUBLISHED_REPORTS = "lib/reports/published-reports.ts";
const SUMMARY = "data/audits/seed-100-readiness/summary.json";
const ITEMS = "data/audits/seed-100-readiness/items.ndjson";
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

const requiredFiles = [
  REPORT_ROUTE,
  "lib/reports/seed-100-readiness-report.ts",
  PUBLISHED_REPORTS,
  "components/reports/report-metric-grid.tsx",
  "components/reports/issue-code-table.tsx",
  "components/reports/methodology-block.tsx",
  "components/reports/founder-next-steps.tsx",
  "components/seo/report-json-ld.tsx",
  "lib/seo/report-json-ld.ts",
  SUMMARY,
  ITEMS,
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`Missing required file: ${file}`);
}

const route = exists(REPORT_ROUTE) ? read(REPORT_ROUTE) : "";
const loader = exists("lib/reports/seed-100-readiness-report.ts")
  ? read("lib/reports/seed-100-readiness-report.ts")
  : "";
const publishedReports = exists(PUBLISHED_REPORTS) ? read(PUBLISHED_REPORTS) : "";
const sitemap = exists("app/sitemap.ts") ? read("app/sitemap.ts") : "";
const packageJson = exists("package.json")
  ? JSON.parse(read("package.json"))
  : { scripts: {} };

if (
  !publishedReports.includes("FOUNDER_INTENT_REPORT_SLUG") ||
  !publishedReports.includes("FOUNDER_INTENT_REPORT_PATH")
) {
  fail("Published report registry must include the founder intent report constants");
}

if (!publishedReports.includes('status: "published"')) {
  fail("Published report registry must mark public report routes as published");
}

if (!publishedReports.includes("getPublishedReportSitemapEntries")) {
  fail("Published report registry must export sitemap entries for reports");
}

if (!sitemap.includes("getPublishedReportSitemapEntries")) {
  fail("Sitemap source must use the published report registry");
}

if (sitemap.includes(REPORT_SLUG)) {
  fail("Sitemap source must not hardcode the founder intent report slug");
}

if (/items\.ndjson|seed-100-readiness|data\/audits/.test(sitemap)) {
  fail("Sitemap source must not read Seed 100 audit files directly");
}

if (/items\.ndjson|data\/audits/.test(publishedReports)) {
  fail("Published report registry must not read item-level Seed 100 data");
}

if (!loader.includes("summary.json") || !loader.includes("items.ndjson")) {
  fail("Report loader must read PR33 summary.json and items.ndjson");
}

if (!exists(SUMMARY) || !exists(ITEMS)) {
  fail("PR33 audit dataset files must exist");
} else {
  const summary = JSON.parse(read(SUMMARY));
  const items = read(ITEMS)
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  if (summary.total_projects !== 100) {
    fail("summary.json must describe the Seed 100 corpus");
  }
  if (items.length !== summary.total_projects) {
    fail("items.ndjson count must match summary total_projects");
  }
  for (const item of items) {
    const projectRoute = `/projects/${item.slug}`;
    const reportRoute = `/reports/${item.slug}`;
    if (route.includes(projectRoute)) {
      fail(`Report route must not expose Seed 100 project slug: ${item.slug}`);
    }
    if (
      publishedReports.includes(projectRoute) ||
      publishedReports.includes(reportRoute)
    ) {
      fail(
        `Published report registry must not expose Seed 100 item route: ${item.slug}`
      );
    }
    if (sitemap.includes(projectRoute) || sitemap.includes(reportRoute)) {
      fail(`Sitemap source must not expose Seed 100 item route: ${item.slug}`);
    }
  }
}

const publicFiles = [
  REPORT_ROUTE,
  "app/reports/page.tsx",
  "lib/reports/seed-100-readiness-report.ts",
  PUBLISHED_REPORTS,
  "components/reports/report-metric-grid.tsx",
  "components/reports/issue-code-table.tsx",
  "components/reports/methodology-block.tsx",
  "components/reports/founder-next-steps.tsx",
];

const forbiddenPublicCopy = [
  "dofollow",
  "backlink",
  ["SEO", "juice"].join(" "),
  "guarantee",
  "guaranteed",
  "rank boost",
  "traffic promise",
  "AI citation promise",
  "indexing guarantee",
  "paid link",
  "link marketplace",
];

for (const file of publicFiles) {
  const content = exists(file) ? read(file) : "";
  for (const term of forbiddenPublicCopy) {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      fail(`${file} contains forbidden public-copy term: ${term}`);
    }
  }
}

if (!route.includes('href="/geo-checker"')) {
  fail("Report page must link to /geo-checker");
}

if (!route.includes('href="/submit"')) {
  fail("Report page must link to /submit");
}

const implementationFiles = [
  REPORT_ROUTE,
  "app/reports/page.tsx",
  "lib/reports/seed-100-readiness-report.ts",
  PUBLISHED_REPORTS,
  "components/reports/report-metric-grid.tsx",
  "components/reports/issue-code-table.tsx",
  "components/reports/methodology-block.tsx",
  "components/reports/founder-next-steps.tsx",
  "components/seo/report-json-ld.tsx",
  "lib/seo/report-json-ld.ts",
];

for (const file of implementationFiles) {
  const content = exists(file) ? read(file) : "";
  if (/supabase/i.test(content)) {
    fail(`${file} must not import or reference Supabase`);
  }
  if (/(openai|anthropic|google|stripe)/i.test(content)) {
    fail(`${file} must not call external AI/search/payment providers`);
  }
}

if (/website_host|schema_types|source_type/.test(route)) {
  fail("Report page must not expose item-level raw audit fields");
}

if (/items\.ndjson/.test(route)) {
  fail("Report route must read dataset through the report loader");
}

if (/aggregateRating|Review|Offer|Product/.test(read("lib/seo/report-json-ld.ts"))) {
  fail("Report JSON-LD must remain report-level and must not include fake ratings, reviews, offers, or products");
}

if (/Signal Score\s*[:=]|Source Confidence\s*[:=]/.test(route)) {
  fail("Report page must not present Signal Score or Source Confidence as computed report claims");
}

if (!route.includes("ReportJsonLd")) {
  fail("Report page must render JSON-LD");
}

if (!packageJson.scripts?.["report:founder-intent:check"]) {
  fail("package.json missing report:founder-intent:check script");
}

if (errors.length > 0) {
  console.error("report:founder-intent:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("report:founder-intent:check passed");
console.log(
  "Verified: PR33 aggregate input, published-only report registry, sitemap entry, public-copy guardrails, report-level JSON-LD, and no project-level exposure"
);
