import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "lib/alternatives/curated-alternatives.json");
const helperPath = path.join(root, "lib/alternatives/curated-alternatives.ts");
const pagePath = path.join(root, "app/alternatives/[slug]/page.tsx");
const sitemapPath = path.join(root, "app/sitemap.ts");
const demoProjectsPath = path.join(root, "lib/demo-projects.ts");

const errors = [];
const routeCap = 4;
const allowedStatuses = new Set(["draft", "noindex", "published", "archived"]);
const requiredCanonicalSlugs = new Set([
  "aurora-code-vs-nucleus-ml",
  "nucleus-ml-vs-vectorbase",
  "complykit-vs-pulse-analytics",
  "aurora-code-vs-vectorbase",
]);
const forbiddenCopyPatterns = [
  /guaranteed/i,
  /ranking/i,
  /traffic promise/i,
  /disparag/i,
  /defam/i,
  /certification/i,
  /formal review result/i,
  new RegExp(["back", "link"].join(""), "i"),
  new RegExp(["citation", " ", "guarantee"].join(""), "i"),
  new RegExp(["do", "follow"].join(""), "i"),
  new RegExp(["SEO", " ", "juice"].join(""), "i"),
  new RegExp(["invest", " ", "now"].join(""), "i"),
  new RegExp(["guaranteed", " ", "return"].join(""), "i"),
  new RegExp(["rank", " ", "boost"].join(""), "i"),
  /\bbest\b/i,
];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function canonicalSlugFor(firstSlug, secondSlug) {
  return [firstSlug, secondSlug].sort().join("-vs-");
}

function projectStatus(projectSlug, demoSource) {
  const blockPattern = new RegExp(
    `slug:\\s*"${projectSlug}"[\\s\\S]*?status:\\s*"([^"]+)"`,
    "m"
  );
  const match = demoSource.match(blockPattern);
  return match?.[1] ?? null;
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
  fail("alternatives registry must be a non-empty array");
}

const slugs = new Set();
const publishedEntries = registry.filter((entry) => entry.status === "published");

if (publishedEntries.length > routeCap) {
  fail(`published alternatives route count exceeds cap ${routeCap}`);
}

if (publishedEntries.length !== requiredCanonicalSlugs.size) {
  fail(`published alternatives route count must be ${requiredCanonicalSlugs.size}`);
}

for (const slug of requiredCanonicalSlugs) {
  if (!publishedEntries.some((entry) => entry.canonicalSlug === slug)) {
    fail(`missing required published alternatives route: ${slug}`);
  }
}

for (const entry of registry) {
  const {
    canonicalSlug,
    leftProjectSlug,
    rightProjectSlug,
    canonicalPath,
    status,
  } = entry;

  if (!canonicalSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*-vs-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(canonicalSlug)) {
    fail(`invalid canonical alternatives slug: ${canonicalSlug}`);
  }

  if (slugs.has(canonicalSlug)) {
    fail(`duplicate canonical alternatives slug: ${canonicalSlug}`);
  }
  slugs.add(canonicalSlug);

  if (!allowedStatuses.has(status)) {
    fail(`invalid status for ${canonicalSlug}: ${status}`);
  }

  if (!requiredCanonicalSlugs.has(canonicalSlug)) {
    fail(`alternatives route is outside the PR126 allowlist: ${canonicalSlug}`);
  }

  const expectedCanonicalSlug = canonicalSlugFor(leftProjectSlug, rightProjectSlug);
  if (canonicalSlug !== expectedCanonicalSlug) {
    fail(`${canonicalSlug} does not match canonical pair order ${expectedCanonicalSlug}`);
  }

  if (canonicalPath !== `/alternatives/${canonicalSlug}`) {
    fail(`${canonicalSlug} has invalid canonicalPath ${canonicalPath}`);
  }

  const reversedSlug = `${rightProjectSlug}-vs-${leftProjectSlug}`;
  if (slugs.has(reversedSlug)) {
    fail(`${canonicalSlug} has a reversed duplicate route`);
  }

  if (status === "published" && entry.sitemapEligible !== true) {
    fail(`published alternatives route must be sitemap eligible: ${canonicalSlug}`);
  }

  for (const projectSlug of [leftProjectSlug, rightProjectSlug]) {
    const statusValue = projectStatus(projectSlug, demoSource);
    if (statusValue === null) {
      fail(`project slug not found in local project records: ${projectSlug}`);
    } else if (statusValue !== "published") {
      fail(`project ${projectSlug} has status ${statusValue}, expected published`);
    }
  }

  const copyFields = [
    entry.title,
    entry.summary,
    entry.neutralRationale,
    entry.sourceNotes,
    entry.boundaryNote,
  ];

  for (const value of copyFields) {
    if (typeof value !== "string" || value.trim().length === 0) {
      fail(`${canonicalSlug} has an empty required copy field`);
      continue;
    }

    for (const pattern of forbiddenCopyPatterns) {
      if (pattern.test(value)) {
        fail(`${canonicalSlug} contains forbidden alternatives copy pattern`);
      }
    }
  }
}

if (!helperSource.includes("ALTERNATIVES_ROUTE_CAP_V0 = 4")) {
  fail("alternatives helper must define route cap 4");
}

if (!helperSource.includes('project.status === "published"')) {
  fail("alternatives helper must filter projects to status published");
}

if (!helperSource.includes('entry.status === "published"')) {
  fail("alternatives helper must filter entries to status published");
}

if (!helperSource.includes("getCanonicalAlternativesSlug")) {
  fail("alternatives helper must expose canonical slug ordering");
}

if (pageSource) {
  if (!pageSource.includes("generateStaticParams")) {
    fail("alternatives page must define generateStaticParams");
  }

  if (!pageSource.includes("getPublishedCuratedAlternatives")) {
    fail("alternatives page must use the finite published registry");
  }

  if (!pageSource.includes("notFound()")) {
    fail("alternatives page must reject unknown or ineligible slugs");
  }

  if (pageSource.includes("searchParams")) {
    fail("alternatives page must not use query params");
  }

  if (!pageSource.includes("alternates")) {
    fail("alternatives page metadata must expose canonical metadata");
  }
}

if (sitemapSource) {
  if (!sitemapSource.includes("getPublishedCuratedAlternatives")) {
    fail("sitemap must use getPublishedCuratedAlternatives");
  }

  if (!sitemapSource.includes("/alternatives/")) {
    fail("sitemap must include finite alternatives route URLs");
  }

  if (sitemapSource.includes("demoAlternatives")) {
    fail("sitemap must not use demoAlternatives for alternatives entries");
  }
}

const runtimeSources = [helperSource, pageSource, sitemapSource].join("\n");
const forbiddenRuntimePatterns = [
  /IndexNow/i,
  /Google\s+Indexing\s+API/i,
  /stripe|checkout|payment/i,
  /mcp/i,
];

for (const pattern of forbiddenRuntimePatterns) {
  if (pattern.test(runtimeSources)) {
    fail(`alternatives runtime contains forbidden integration pattern: ${pattern}`);
  }
}

if (errors.length > 0) {
  console.error("alternatives-canonical:check failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `alternatives-canonical:check passed (${publishedEntries.length} published routes)`
);
