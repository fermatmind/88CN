import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "lib/collections/curated-collections.json");
const helperPath = path.join(root, "lib/collections/curated-collections.ts");
const pagePath = path.join(root, "app/collections/[slug]/page.tsx");
const sitemapPath = path.join(root, "app/sitemap.ts");
const contractPath = path.join(
  root,
  "ops/contracts/curated-collections-boundary.json"
);
const publishedProjectionPath = path.join(
  root,
  "lib/projects/published-projection.jsonl"
);

const errors = [];
const allowedStatuses = new Set(["draft", "noindex", "published", "archived"]);
const forbiddenCopyPatterns = [
  /guaranteed/i,
  /ranking/i,
  /traffic promise/i,
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
const contract = readJson(contractPath);
const helperSource = fs.readFileSync(helperPath, "utf8");
const pageSource = fs.existsSync(pagePath)
  ? fs.readFileSync(pagePath, "utf8")
  : "";
const sitemapSource = fs.existsSync(sitemapPath)
  ? fs.readFileSync(sitemapPath, "utf8")
  : "";
const minimumPublishedProjects =
  contract.evidence_thresholds?.minimum_published_projects ?? 2;
const maxPublishedCollections =
  contract.route_generation?.max_published_collections_v0 ?? 4;
const publishedProjectionRows = fs
  .readFileSync(publishedProjectionPath, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const publishedProjectsBySlug = new Map(
  publishedProjectionRows.map((project) => [project.slug, project])
);

if (!Array.isArray(registry) || registry.length === 0) {
  fail("curated collection registry must be a non-empty array");
}

const slugs = new Set();
const publishedCollections = registry.filter(
  (collection) => collection.status === "published"
);

if (publishedCollections.length > maxPublishedCollections) {
  fail(
    `published collection count ${publishedCollections.length} exceeds ${maxPublishedCollections}`
  );
}

for (const collection of registry) {
  if (!collection.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(collection.slug)) {
    fail(`invalid collection slug: ${collection.slug}`);
  }

  if (slugs.has(collection.slug)) {
    fail(`duplicate collection slug: ${collection.slug}`);
  }
  slugs.add(collection.slug);

  if (!allowedStatuses.has(collection.status)) {
    fail(`invalid status for ${collection.slug}: ${collection.status}`);
  }

  if (collection.status === "published" && collection.sitemapEligible !== true) {
    fail(`published collection must be sitemap eligible: ${collection.slug}`);
  }

  if (
    !Number.isInteger(collection.minimumPublishedProjects) ||
    collection.minimumPublishedProjects < minimumPublishedProjects
  ) {
    fail(
      `${collection.slug} minimumPublishedProjects must be at least ${minimumPublishedProjects}`
    );
  }

  if (
    !Array.isArray(collection.projectSlugs) ||
    collection.projectSlugs.length < collection.minimumPublishedProjects
  ) {
    fail(
      `${collection.slug} must reference at least minimumPublishedProjects projects`
    );
  }

  if (
    !collection.match ||
    typeof collection.match.collectionTag !== "string" ||
    collection.match.collectionTag !== collection.slug
  ) {
    fail(`${collection.slug} must declare a matching collectionTag`);
  }

  const copyFields = [
    collection.title,
    collection.summary,
    collection.inclusionCriteria,
    collection.whyIncluded,
    collection.methodologyNote,
  ];

  for (const value of copyFields) {
    if (typeof value !== "string" || value.trim().length === 0) {
      fail(`${collection.slug} has an empty required copy field`);
      continue;
    }

    for (const pattern of forbiddenCopyPatterns) {
      if (pattern.test(value)) {
        fail(`${collection.slug} contains forbidden public claim pattern`);
      }
    }
  }

  for (const projectSlug of collection.projectSlugs ?? []) {
    const project = publishedProjectsBySlug.get(projectSlug);

    if (!project) {
      fail(`project slug not found in published projection: ${projectSlug}`);
      continue;
    }

    if (project.lifecycle_status !== "published") {
      fail(
        `project ${projectSlug} has status ${project.lifecycle_status}, expected published`
      );
    }

    if (!project.collection_tags?.includes(collection.match.collectionTag)) {
      fail(
        `project ${projectSlug} does not include collection tag ${collection.match.collectionTag}`
      );
    }
  }
}

if (!helperSource.includes('project.lifecycle_status === "published"')) {
  fail("curated collection helper must filter projects to status published");
}

if (!helperSource.includes("collection.status === \"published\"")) {
  fail("curated collection helper must filter collections to status published");
}

if (!helperSource.includes("minimumPublishedProjects")) {
  fail("curated collection helper must enforce minimumPublishedProjects");
}

if (pageSource) {
  if (!pageSource.includes("generateStaticParams")) {
    fail("collection page must define generateStaticParams");
  }

  if (!pageSource.includes("dynamicParams = false")) {
    fail("collection page must fail closed for unknown static slugs");
  }

  if (!pageSource.includes("getPublishedCuratedCollections")) {
    fail("collection page must use the finite published registry");
  }

  if (!pageSource.includes("notFound()")) {
    fail("collection page must reject unknown or ineligible slugs");
  }

  if (pageSource.includes("demoCollections")) {
    fail("collection page must not use demoCollections for route generation");
  }

  if (!pageSource.includes("getProjectsForCuratedCollection")) {
    fail("collection page must use published-only project resolution");
  }
}

if (sitemapSource) {
  if (!sitemapSource.includes("getCollectionSitemapEntries")) {
    fail("sitemap must use collection sitemap entries");
  }

  if (!sitemapSource.includes("collectionEntries")) {
    fail("sitemap must include finite collection route URLs");
  }

  if (sitemapSource.includes("demoCollections")) {
    fail("sitemap must not use demoCollections for collection entries");
  }
}

if (errors.length > 0) {
  console.error("curated-collections:check failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `curated-collections:check passed (${publishedCollections.length} published collections)`
);
