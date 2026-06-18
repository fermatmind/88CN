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

function walk(dir) {
  const absolute = repoPath(dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return walk(relative);
    return entry.isFile() ? [relative] : [];
  });
}

const requiredFiles = [
  "lib/lifecycle/archive-policy.ts",
  "lib/alerts/flags.ts",
  "lib/alerts/boundary.ts",
  "app/admin/lifecycle/page.tsx",
  "app/admin/alerts/page.tsx",
  "supabase/migrations/011_lifecycle_alerts.sql",
  "docs/59_SIGNAL_ALERT_SOFT_ARCHIVE_V0.md",
];

requiredFiles.forEach((file) => {
  if (!exists(file)) fail(`${file} is missing`);
});

if (exists("lib/lifecycle/archive-policy.ts")) {
  const policy = read("lib/lifecycle/archive-policy.ts");
  for (const term of [
    "inactive_warning",
    "candidate_archive",
    "archived_research",
    "archived_noindex",
    "keep_public_snapshot",
    "HARD_DELETE_PUBLIC_HISTORY_ALLOWED = false",
  ]) {
    if (!policy.includes(term)) fail(`archive policy missing ${term}`);
  }
  if (!policy.includes("allowHardDelete: false")) {
    fail("archive decisions must deny hard delete");
  }
}

if (exists("lib/alerts/flags.ts")) {
  const flags = read("lib/alerts/flags.ts");
  if (!flags.includes("SIGNAL_ALERTS_ENABLED")) {
    fail("SIGNAL_ALERTS_ENABLED flag is missing");
  }
  if (!flags.includes("SIGNAL_ALERT_DELIVERY_ENABLED")) {
    fail("SIGNAL_ALERT_DELIVERY_ENABLED flag is missing");
  }
  if (!flags.includes("return false")) {
    fail("signal alert delivery must be hard-disabled in v0");
  }
  if (/NEXT_PUBLIC/i.test(flags)) {
    fail("signal alert flags must not be client-exposed");
  }
}

if (exists("lib/alerts/boundary.ts")) {
  const boundary = read("lib/alerts/boundary.ts");
  for (const term of ["disabled", "admin_review", "transport: \"none\"", "canSendSignalAlert(): false"]) {
    if (!boundary.includes(term)) fail(`alert boundary missing ${term}`);
  }
}

if (exists("supabase/migrations/011_lifecycle_alerts.sql")) {
  const migration = read("supabase/migrations/011_lifecycle_alerts.sql");
  for (const term of [
    "project_lifecycle_snapshots",
    "signal_alert_rules",
    "on delete restrict",
    "keep_public_snapshot",
    "private_payload_included boolean not null default false",
    "external_delivery_allowed boolean not null default false",
    "check (external_delivery_allowed = false)",
    "transport text not null default 'none'",
    "alter table public.project_lifecycle_snapshots enable row level security",
    "alter table public.signal_alert_rules enable row level security",
  ]) {
    if (!migration.includes(term)) fail(`lifecycle migration missing ${term}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (
  packageJson.scripts?.["lifecycle-archive:check"] !==
  "node scripts/check-lifecycle-archive.mjs"
) {
  fail("package.json missing lifecycle-archive:check script");
}

const scopedFiles = [
  ...walk("lib/lifecycle"),
  ...walk("lib/alerts"),
  ...walk("app/admin/lifecycle"),
  ...walk("app/admin/alerts"),
  "supabase/migrations/011_lifecycle_alerts.sql",
  "docs/59_SIGNAL_ALERT_SOFT_ARCHIVE_V0.md",
].filter((file) => exists(file));

const forbiddenRuntimeTerms = [
  "resend",
  "sendgrid",
  "smtp",
  "nodemailer",
  "twilio",
  "webhook.site",
  "fetch(",
  "axios",
];

for (const file of scopedFiles) {
  const content = read(file);
  for (const term of forbiddenRuntimeTerms) {
    if (content.toLowerCase().includes(term)) {
      fail(`${file} contains forbidden delivery/runtime term: ${term}`);
    }
  }
}

const forbiddenDiff = execFileSync(
  "git",
  ["diff", "--name-only", "HEAD", "--", "app/api", "app/projects", "app/sitemap.ts", "lib/payments", "lib/public-api", "lib/mcp", "deploy"],
  { cwd: root, encoding: "utf8" }
).trim();

if (forbiddenDiff) {
  fail(`PR52 must not modify forbidden runtime surfaces: ${forbiddenDiff}`);
}

if (failures.length > 0) {
  console.error("lifecycle-archive:check failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("lifecycle-archive:check passed");
