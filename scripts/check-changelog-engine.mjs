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

function assertFile(file) {
  if (!exists(file)) fail(`${file} is missing`);
}

const requiredFiles = [
  "lib/changelog/engine.ts",
  "app/admin/changelog/page.tsx",
  "app/api/admin/changelog/[id]/route.ts",
  "supabase/migrations/012_changelog_entries.sql",
  "docs/60_CHANGELOG_ENGINE_V0.md",
];

requiredFiles.forEach(assertFile);

if (exists("lib/changelog/engine.ts")) {
  const engine = read("lib/changelog/engine.ts");
  for (const term of [
    "status: \"draft\"",
    "public_visible: false",
    "affects_signal_score: false",
    "affects_source_confidence: false",
    "approved_for_publication",
    "isChangelogPublicationSideEffectBlocked",
    "update_signal_score",
    "update_source_confidence",
    "canChangelogMutateSignalScore(): false",
  ]) {
    if (!engine.includes(term)) fail(`changelog engine missing ${term}`);
  }
}

if (exists("supabase/migrations/012_changelog_entries.sql")) {
  const migration = read("supabase/migrations/012_changelog_entries.sql");
  for (const term of [
    "project_changelog_entries",
    "status text not null default 'draft'",
    "approved_for_publication",
    "public_visible boolean not null default false",
    "check (public_visible = false)",
    "affects_signal_score boolean not null default false",
    "check (affects_signal_score = false)",
    "affects_source_confidence boolean not null default false",
    "check (affects_source_confidence = false)",
    "alter table public.project_changelog_entries enable row level security",
    "using (public.is_admin())",
  ]) {
    if (!migration.includes(term)) fail(`changelog migration missing ${term}`);
  }
}

if (exists("app/api/admin/changelog/[id]/route.ts")) {
  const route = read("app/api/admin/changelog/[id]/route.ts");
  for (const term of [
    "public_visible: false",
    "affects_signal_score: false",
    "affects_source_confidence: false",
    "changelog_publication_blocked",
  ]) {
    if (!route.includes(term)) fail(`changelog admin route missing ${term}`);
  }
  if (/from\(["']projects["']\)\.update|signalScore|sourceConfidence|index_status\s*:\s*["']indexable/.test(route)) {
    fail("changelog admin route appears to mutate project score, confidence, or indexing");
  }
}

if (exists("app/admin/changelog/page.tsx")) {
  const page = read("app/admin/changelog/page.tsx");
  for (const term of [
    "noIndex()",
    "does not publish",
    "does not mutate Signal Score",
    "does not mutate Source Confidence",
    "No changelog data is exposed through public endpoints in v0.",
  ]) {
    if (!page.includes(term)) fail(`changelog admin page missing ${term}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (
  packageJson.scripts?.["changelog-engine:check"] !==
  "node scripts/check-changelog-engine.mjs"
) {
  fail("package.json missing changelog-engine:check script");
}

const forbiddenDiff = execFileSync(
  "git",
  [
    "diff",
    "--name-only",
    "HEAD",
    "--",
    "app/api/public",
    "app/api/projects",
    "app/projects",
    "app/sitemap.ts",
    "lib/score",
    "lib/source-confidence",
    "lib/public-api",
    "lib/mcp",
    "deploy",
  ],
  { cwd: root, encoding: "utf8" }
).trim();

if (forbiddenDiff) {
  fail(`PR53 must not modify forbidden public or machine surfaces: ${forbiddenDiff}`);
}

if (failures.length > 0) {
  console.error("changelog-engine:check failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("changelog-engine:check passed");
