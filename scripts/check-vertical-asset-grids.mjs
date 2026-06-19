import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "lib/verticals/vertical-asset-grids.json");
const helperPath = path.join(root, "lib/verticals/vertical-asset-grids.ts");
const pagePath = path.join(root, "app/verticals/[slug]/page.tsx");
const sitemapPath = path.join(root, "app/sitemap.ts");
const demoProjectsPath = path.join(root, "lib/demo-projects.ts");

const errors = [];
const allowedStatuses = new Set(["draft", "noindex", "published", "archived"]);
const requiredPublishedSlugs = new Set([
  "ai-builder-infrastructure",
  "model-and-search-infrastructure",
  "analytics-and-operations-tools",
]);
const forbiddenCopyPatterns = [
  /guaranteed/i,
  /ranking/i,
  /traffic promise/i,
  /professional recommendation/i,
  /certification/i,
  /audit result/i,
  new RegExp(["back", "link"].join(""), "i"),
  new RegExp(["citation", " ", "guarantee"].join(""), "i"),
  new RegExp(["do", "follow"].join(""), "i"),
  new RegExp(["SEO", " ", "juice"].join(""), "i"),
  new RegExp(["invest", " ", "now"].join(""), "i"),
  new RegExp(["guaranteed", " ", "return"].join(""), "i"),
];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const registry = readJson(registryPath);
const helperSource = fs.readFileSync(helperPath, "utf8");
const pageSource = fs.existsSync(pagePath)
  ? fs.readFileSync(pagePath, "utf8")
  : "";
const sitemapSource = fs.existsSync(sitemapPath)
  ? fs.readFileSync(sitemapPath, "utf8")
  : "";
const demoSource = fs.readFileSync(demoProjectsPath, "utf8");

if (!Array.isArray(registry) || registry.length === 0) {
  fail("vertical asset grid registry must be a non-empty array");
}

const slugs = new Set();
const publishedGrids = registry.filter((grid) => grid.status === "published");

if (publishedGrids.length !== requiredPublishedSlugs.size) {
  fail(`published vertical grid count must be ${requiredPublishedSlugs.size}`);
}

for (const slug of requiredPublishedSlugs) {
  if (!publishedGrids.some((grid) => grid.slug === slug)) {
    fail(`missing required published vertical grid: ${slug}`);
  }
}

for (const grid of registry) {
  if (!grid.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(grid.slug)) {
    fail(`invalid vertical grid slug: ${grid.slug}`);
  }

  if (slugs.has(grid.slug)) {
    fail(`duplicate vertical grid slug: ${grid.slug}`);
  }
  slugs.add(grid.slug);

  if (!allowedStatuses.has(grid.status)) {
    fail(`invalid status for ${grid.slug}: ${grid.status}`);
  }

  if (!requiredPublishedSlugs.has(grid.slug)) {
    fail(`vertical grid is outside the PR70 allowlist: ${grid.slug}`);
  }

  if (grid.status === "published" && grid.sitemapEligible !== true) {
    fail(`published vertical grid must be sitemap eligible: ${grid.slug}`);
  }

  if (
    !Number.isInteger(grid.minimumPublishedProjects) ||
    grid.minimumPublishedProjects < 2
  ) {
    fail(`${grid.slug} minimumPublishedProjects must be at least 2`);
  }

  if (
    !Array.isArray(grid.projectSlugs) ||
    grid.projectSlugs.length < grid.minimumPublishedProjects
  ) {
    fail(`${grid.slug} must reference at least minimumPublishedProjects projects`);
  }

  const copyFields = [
    grid.title,
    grid.summary,
    grid.inclusionCriteria,
    grid.whyIncluded,
    grid.methodologyNote,
    grid.boundaryNote,
  ];

  for (const value of copyFields) {
    if (typeof value !== "string" || value.trim().length === 0) {
      fail(`${grid.slug} has an empty required copy field`);
      continue;
    }

    for (const pattern of forbiddenCopyPatterns) {
      if (pattern.test(value)) {
        fail(`${grid.slug} contains forbidden public claim pattern`);
      }
    }
  }

  for (const projectSlug of grid.projectSlugs ?? []) {
    const blockPattern = new RegExp(
      `slug:\\s*"${projectSlug}"[\\s\\S]*?status:\\s*"([^"]+)"`,
      "m"
    );
    const match = demoSource.match(blockPattern);

    if (!match) {
      fail(`project slug not found in local project records: ${projectSlug}`);
      continue;
    }

    if (match[1] !== "published") {
      fail(`project ${projectSlug} has status ${match[1]}, expected published`);
    }
  }
}

if (!helperSource.includes('project.status === "published"')) {
  fail("vertical grid helper must filter projects to status published");
}

if (!helperSource.includes('grid.status === "published"')) {
  fail("vertical grid helper must filter grids to status published");
}

if (!helperSource.includes("minimumPublishedProjects")) {
  fail("vertical grid helper must enforce minimumPublishedProjects");
}

if (pageSource) {
  if (!pageSource.includes("generateStaticParams")) {
    fail("vertical grid page must define generateStaticParams");
  }

  if (!pageSource.includes("getPublishedVerticalAssetGrids")) {
    fail("vertical grid page must use the finite published registry");
  }

  if (!pageSource.includes("notFound()")) {
    fail("vertical grid page must reject unknown or ineligible slugs");
  }

  if (pageSource.includes("demoCollections")) {
    fail("vertical grid page must not use unrelated demoCollections");
  }

  if (!pageSource.includes("getProjectsForVerticalAssetGrid")) {
    fail("vertical grid page must use published-only project resolution");
  }
}

if (sitemapSource) {
  if (!sitemapSource.includes("getPublishedVerticalAssetGrids")) {
    fail("sitemap must use getPublishedVerticalAssetGrids");
  }

  if (!sitemapSource.includes("/verticals/")) {
    fail("sitemap must include finite vertical route URLs");
  }

  if (sitemapSource.includes("demoVerticals")) {
    fail("sitemap must not use demoVerticals for vertical entries");
  }
}

if (errors.length > 0) {
  console.error("vertical-asset-grids:check failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `vertical-asset-grids:check passed (${publishedGrids.length} published grids)`
);
