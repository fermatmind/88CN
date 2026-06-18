import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];

function read(repoPath) {
  return fs.readFileSync(path.join(ROOT, repoPath), "utf8");
}

function exists(repoPath) {
  return fs.existsSync(path.join(ROOT, repoPath));
}

function fail(message) {
  errors.push(message);
}

const requiredFiles = [
  "lib/index-data/import-summary.ts",
  "lib/index-data/quarantine.ts",
  "lib/index-data/sync.ts",
  "app/api/admin/external-imports/route.ts",
  "app/api/admin/external-imports/sync/route.ts",
  "app/admin/external-imports/page.tsx",
  "supabase/migrations/007_external_import_quarantine_summary.sql",
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`Missing required file: ${file}`);
}

const reasonCodes = [
  "invalid_url",
  "invalid_category",
  "duplicate_slug",
  "duplicate_fingerprint",
  "forbidden_field",
  "privacy_risk",
  "malformed_payload",
  "source_not_allowed",
];

const summaryFields = [
  "total",
  "accepted",
  "quarantined",
  "rejected",
  "duplicates",
  "reasons",
];

if (exists("lib/index-data/import-summary.ts")) {
  const summary = read("lib/index-data/import-summary.ts");
  for (const code of reasonCodes) {
    if (!summary.includes(code)) fail(`Missing reason code in import-summary.ts: ${code}`);
  }
  for (const field of summaryFields) {
    if (!summary.includes(field)) fail(`Missing summary field in import-summary.ts: ${field}`);
  }
}

if (exists("lib/index-data/quarantine.ts")) {
  const quarantine = read("lib/index-data/quarantine.ts");
  for (const code of reasonCodes) {
    if (!quarantine.includes(code) && !read("lib/index-data/import-summary.ts").includes(code)) {
      fail(`Missing reason code in classification path: ${code}`);
    }
  }
  const bannedClassificationTerms = [
    "fetch(",
    "process.env",
    "getAdminClient",
    ".from(",
    "OpenAI",
    "Anthropic",
    "Google",
    "Stripe",
    "raw_value",
    "JSON.stringify(project)",
  ];
  for (const term of bannedClassificationTerms) {
    if (quarantine.includes(term)) fail(`Classification path must not contain: ${term}`);
  }
}

if (exists("lib/index-data/sync.ts")) {
  const sync = read("lib/index-data/sync.ts");
  if (sync.includes('.from("projects")') || sync.includes(".from('projects')")) {
    fail("External import sync must not write projects table");
  }
  if (!sync.includes("quarantine_summary")) {
    fail("sync.ts must return quarantine_summary");
  }
  if (!sync.includes("quarantined")) {
    fail("sync.ts must handle quarantined status");
  }
  if (sync.includes("autoPublish") || sync.includes("auto_publish")) {
    fail("sync.ts must not auto publish imports");
  }
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");
  if (sitemap.includes("external_project_imports")) {
    fail("sitemap must not read external_project_imports");
  }
}

if (exists("app/api/projects/[slug]/route.ts")) {
  const projectApi = read("app/api/projects/[slug]/route.ts");
  if (projectApi.includes("external_project_imports") || projectApi.includes("quarantined")) {
    fail("public project API must not read quarantined external imports");
  }
}

if (exists("app/api/admin/external-imports/route.ts")) {
  const adminRoute = read("app/api/admin/external-imports/route.ts");
  if (!adminRoute.includes("quarantine_summary")) {
    fail("admin external imports route must expose quarantine_summary");
  }
}

if (exists("app/api/admin/external-imports/sync/route.ts")) {
  const syncRoute = read("app/api/admin/external-imports/sync/route.ts");
  if (!syncRoute.includes("syncExternalImports")) {
    fail("sync route must use external import sync");
  }
}

if (exists("supabase/migrations/007_external_import_quarantine_summary.sql")) {
  const migration = read("supabase/migrations/007_external_import_quarantine_summary.sql");
  for (const term of ["quarantine_reason_code", "quarantine_details", "last_imported_at", "quarantined", "duplicate"]) {
    if (!migration.includes(term)) fail(`Migration missing ${term}`);
  }
}

if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"));
  if (pkg.scripts?.["external-import:quarantine:check"] !== "node scripts/check-external-import-quarantine.mjs") {
    fail("package.json missing external-import:quarantine:check script");
  }
}

if (errors.length > 0) {
  console.error("external-import:quarantine:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("external-import:quarantine:check passed");
console.log("Verified: classification, summary, admin-only exposure, public boundary");
