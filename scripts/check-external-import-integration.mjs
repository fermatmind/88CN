import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];

function fail(msg) {
  errors.push(msg);
}

// 1. Docs exist
if (!fs.existsSync(path.join(ROOT, "docs/37_EXTERNAL_IMPORT_INTEGRATION_V0.md"))) {
  fail("Missing docs/37_EXTERNAL_IMPORT_INTEGRATION_V0.md");
}

// 2. Core lib files exist
const libFiles = [
  "lib/index-data/types.ts",
  "lib/index-data/validate.ts",
  "lib/index-data/normalize.ts",
  "lib/index-data/sync.ts",
  "lib/index-data/quarantine.ts",
  "lib/index-data/import-summary.ts",
];
for (const f of libFiles) {
  if (!fs.existsSync(path.join(ROOT, f))) {
    fail(`Missing lib file: ${f}`);
  }
}

// 3. Admin page exists
if (!fs.existsSync(path.join(ROOT, "app/admin/external-imports/page.tsx"))) {
  fail("Missing app/admin/external-imports/page.tsx");
}

// 4. Sync API route exists
if (!fs.existsSync(path.join(ROOT, "app/api/admin/external-imports/sync/route.ts"))) {
  fail("Missing app/api/admin/external-imports/sync/route.ts");
}

// 5. package.json has external-import:check
const pkgPath = path.join(ROOT, "package.json");
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (!pkg.scripts?.["external-import:check"]) {
    fail("package.json missing script: external-import:check");
  }
}

// 6. No autoPublish in sync logic
const syncPath = path.join(ROOT, "lib/index-data/sync.ts");
if (fs.existsSync(syncPath)) {
  const content = fs.readFileSync(syncPath, "utf8");
  if (content.includes("autoPublish") || content.includes("auto_publish")) {
    fail("sync.ts must not contain autoPublish");
  }
}

// 7. No direct insert into projects from external import sync
if (fs.existsSync(syncPath)) {
  const content = fs.readFileSync(syncPath, "utf8");
  if (content.includes('.from("projects")')) {
    fail("sync.ts must not insert directly into projects table");
  }
}

// 8. No published hardcoded status in sync
if (fs.existsSync(syncPath)) {
  const content = fs.readFileSync(syncPath, "utf8");
  if (content.includes("published")) {
    fail("sync.ts must not contain hardcoded 'published' status");
  }
}

// 9. Docs state imports do not auto-publish
const docsPath = path.join(ROOT, "docs/37_EXTERNAL_IMPORT_INTEGRATION_V0.md");
if (fs.existsSync(docsPath)) {
  const docs = fs.readFileSync(docsPath, "utf8");
  if (!docs.includes("not automatically") && !docs.includes("not auto")) {
    fail("docs must state imports do not auto-publish");
  }
}

// 10. Migration 006 exists
if (!fs.existsSync(path.join(ROOT, "supabase/migrations/006_external_import_indexes.sql"))) {
  fail("Missing migration 006_external_import_indexes.sql");
}

// 11. Migration 007 exists
if (!fs.existsSync(path.join(ROOT, "supabase/migrations/007_external_import_quarantine_summary.sql"))) {
  fail("Missing migration 007_external_import_quarantine_summary.sql");
}

if (errors.length > 0) {
  console.error("external-import:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("external-import:check passed");
console.log("Verified: lib files, admin routes, no auto-publish, migration 006");
