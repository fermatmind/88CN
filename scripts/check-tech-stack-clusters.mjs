import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(
  root,
  "lib/stacks/tech-stack-clusters.json"
);
const contractPath = path.join(
  root,
  "ops/contracts/tech-stack-cluster-boundary.json"
);
const demoProjectsPath = path.join(root, "lib/demo-projects.ts");
const routePath = path.join(root, "app/stacks/[slug]/page.tsx");
const sitemapPath = path.join(root, "app/sitemap.ts");

const errors = [];
const allowedStatuses = new Set(["draft", "noindex", "published", "archived"]);
const excludedProjectStatuses = new Set([
  "submitted",
  "pending_review",
  "approved",
  "claimed",
  "owner_verified",
  "archived",
  "scouted",
  "quarantined",
  "rejected",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  errors.push(message);
}

const registry = readJson(registryPath);
const contract = readJson(contractPath);
const demoSource = fs.readFileSync(demoProjectsPath, "utf8");
const routeSource = fs.readFileSync(routePath, "utf8");
const sitemapSource = fs.readFileSync(sitemapPath, "utf8");

if (!Array.isArray(registry) || registry.length === 0) {
  fail("tech stack cluster registry must be a non-empty array");
}

const maxAllowlistedRoutes = contract.route_generation?.max_allowlisted_routes;
if (
  Number.isInteger(maxAllowlistedRoutes) &&
  registry.length > maxAllowlistedRoutes
) {
  fail(
    `registry has ${registry.length} routes, above max ${maxAllowlistedRoutes}`
  );
}

const slugs = new Set();
const publishedClusters = registry.filter(
  (cluster) => cluster.status === "published"
);

for (const cluster of registry) {
  if (!cluster.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cluster.slug)) {
    fail(`invalid cluster slug: ${cluster.slug}`);
  }

  if (slugs.has(cluster.slug)) {
    fail(`duplicate cluster slug: ${cluster.slug}`);
  }
  slugs.add(cluster.slug);

  if (!allowedStatuses.has(cluster.status)) {
    fail(`invalid status for ${cluster.slug}: ${cluster.status}`);
  }

  if (cluster.status === "published" && cluster.sitemapEligible !== true) {
    fail(`published cluster must be sitemap eligible: ${cluster.slug}`);
  }

  if (!Array.isArray(cluster.projectSlugs) || cluster.projectSlugs.length === 0) {
    fail(`cluster must include at least one project slug: ${cluster.slug}`);
  }

  for (const projectSlug of cluster.projectSlugs ?? []) {
    const blockPattern = new RegExp(
      `slug:\\s*"${projectSlug}"[\\s\\S]*?status:\\s*"([^"]+)"`,
      "m"
    );
    const match = demoSource.match(blockPattern);

    if (!match) {
      fail(`project slug not found in local demo projects: ${projectSlug}`);
      continue;
    }

    const projectStatus = match[1];
    if (projectStatus !== "published") {
      fail(
        `project ${projectSlug} has status ${projectStatus}, expected published`
      );
    }

    if (excludedProjectStatuses.has(projectStatus)) {
      fail(`excluded project status leaked into cluster: ${projectSlug}`);
    }
  }
}

if (!routeSource.includes("generateStaticParams")) {
  fail("stack route must define generateStaticParams");
}

if (!routeSource.includes("getPublishedStackClusters")) {
  fail("stack route must use the finite published cluster allowlist");
}

if (!routeSource.includes("notFound()")) {
  fail("unknown or ineligible stack routes must call notFound()");
}

if (!sitemapSource.includes("getPublishedStackClusters")) {
  fail("sitemap must use getPublishedStackClusters");
}

if (!sitemapSource.includes("/stacks/")) {
  fail("sitemap must include finite stack route URLs");
}

const forbiddenRuntimePatterns = [
  "google.indexing",
  "indexnow",
  "88cn-index-data",
  "source_type",
  "maintainer-scouted",
  "quarantined",
  "pending_review",
];
const runtimeFiles = [registryPath, routePath, sitemapPath];
for (const filePath of runtimeFiles) {
  const source = fs.readFileSync(filePath, "utf8").toLowerCase();
  for (const pattern of forbiddenRuntimePatterns) {
    if (source.includes(pattern)) {
      fail(`${path.relative(root, filePath)} contains forbidden pattern ${pattern}`);
    }
  }
}

if (publishedClusters.length === 0) {
  fail("at least one published stack cluster is required");
}

if (errors.length > 0) {
  console.error("Tech stack cluster check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `tech-stack-clusters:check passed (${publishedClusters.length} published routes)`
);
