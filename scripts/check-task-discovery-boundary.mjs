import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const failures = [];

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function exists(file) {
  return fs.existsSync(repoPath(file));
}

function read(file) {
  return fs.readFileSync(repoPath(file), "utf8");
}

function fail(message) {
  failures.push(message);
}

function gitLines(args) {
  try {
    const output = execFileSync("git", args, { cwd: root, encoding: "utf8" });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function containsAny(content, terms) {
  const lowered = content.toLowerCase();
  return terms.filter((term) => lowered.includes(term.toLowerCase()));
}

const requiredFiles = [
  "app/tasks/[slug]/page.tsx",
  "lib/tasks/task-discovery.ts",
  "scripts/check-task-discovery-boundary.mjs",
  "docs/traffic/TRAFFIC4A_TASK_TO_PROJECT_DISCOVERY_BOUNDARY_V0.md",
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`${file} is missing`);
}

for (const forbiddenPath of [
  "app/tasks/page.tsx",
  "app/zh-CN",
  "app/landscape/sectors",
  "app/api/tasks",
]) {
  if (exists(forbiddenPath)) fail(`${forbiddenPath} must not exist`);
}

const changed = new Set([
  ...gitLines(["diff", "--name-only", "origin/main...HEAD"]),
  ...gitLines(["diff", "--name-only"]),
  ...gitLines(["ls-files", "--others", "--exclude-standard"]),
]);

for (const forbiddenChange of ["package-lock.json", "supabase", "deploy"]) {
  for (const file of changed) {
    if (file === forbiddenChange || file.startsWith(`${forbiddenChange}/`)) {
      fail(`${file} must not change in PR123`);
    }
  }
}

if (exists("lib/tasks/task-discovery.ts")) {
  const registry = read("lib/tasks/task-discovery.ts");
  for (const required of [
    "TASK_DISCOVERY_MINIMUM_PROJECTS = 3",
    "TASK_DISCOVERY_ROUTE_CAP_V0 = 1",
    "evaluate-ai-builder-infrastructure",
    "aurora-code",
    "nucleus-ml",
    "vectorbase",
    "status: \"published\"",
    "sitemapEligible: true",
    "status: \"noindex\"",
    "sitemapEligible: false",
    "getPublishedTaskDiscoveryEntries",
    "INDEXABLE_STATES",
  ]) {
    if (!registry.includes(required)) {
      fail(`lib/tasks/task-discovery.ts missing: ${required}`);
    }
  }

  const publishedMatches = registry.match(/status: "published"/g) || [];
  if (publishedMatches.length !== 1) {
    fail(`expected exactly one published task route, found ${publishedMatches.length}`);
  }
}

if (exists("app/tasks/[slug]/page.tsx")) {
  const page = read("app/tasks/[slug]/page.tsx");
  for (const required of [
    "dynamicParams = false",
    "generateStaticParams",
    "getPublishedTaskDiscoveryEntries",
    "notFound()",
    "robots: { index: true, follow: true }",
    "canonical: `/tasks/${entry.slug}`",
    "Reviewed Projects for This Task",
  ]) {
    if (!page.includes(required)) {
      fail(`app/tasks/[slug]/page.tsx missing: ${required}`);
    }
  }
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");
  for (const required of [
    "getPublishedTaskDiscoveryEntries",
    "`${baseUrl}/tasks/${entry.slug}`",
  ]) {
    if (!sitemap.includes(required)) {
      fail(`app/sitemap.ts missing task sitemap boundary: ${required}`);
    }
  }

  for (const forbidden of [
    "review-model-search-infrastructure",
    "review-analytics-operations-tools",
    "choose-local-on-device-productivity",
    "compare-open-source-ai-project-tooling",
  ]) {
    if (sitemap.includes(forbidden)) {
      fail(`app/sitemap.ts must not hard-code deferred task slug: ${forbidden}`);
    }
  }
}

const taskContent = [
  "app/tasks/[slug]/page.tsx",
  "lib/tasks/task-discovery.ts",
].filter(exists).map(read).join("\n");

const forbiddenCopy = [
  "best tools",
  "top tools",
  "ai for anything",
  "guaranteed",
  "paid inclusion",
  "dofollow",
  "backlink",
  "funding",
  "revenue",
  "customer count",
  "global market",
  "complete coverage",
  "buy now",
  "sponsored ranking",
  "external crawl",
  "query parameter",
];

for (const match of containsAny(taskContent, forbiddenCopy)) {
  fail(`task discovery contains forbidden phrase: ${match}`);
}

try {
  const dataRepoStatus = execFileSync("git", ["status", "--short", "--branch"], {
    cwd: path.resolve(root, "../88cn-index-data"),
    encoding: "utf8",
  }).trim();
  const dirty = dataRepoStatus
    .split(/\r?\n/)
    .some((line) => line && !line.startsWith("## "));
  if (dirty) fail("../88cn-index-data must remain clean");
} catch (error) {
  fail(`could not inspect ../88cn-index-data: ${error.message}`);
}

if (failures.length > 0) {
  console.error("task-discovery:check failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("task-discovery:check passed");
