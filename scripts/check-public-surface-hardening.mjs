import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];

function fail(msg) {
  errors.push(msg);
}

// 1. Validation files must exist
const validationFiles = [
  "lib/validation/project-submission.ts",
  "lib/validation/project-claim.ts",
  "lib/validation/shared.ts",
];
for (const file of validationFiles) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    fail(`Missing validation file: ${file}`);
  }
}

// 2. Forbidden fields list must exist in shared.ts
if (fs.existsSync(path.join(ROOT, "lib/validation/shared.ts"))) {
  const shared = fs.readFileSync(
    path.join(ROOT, "lib/validation/shared.ts"),
    "utf8"
  );
  if (!shared.includes("FORBIDDEN_PAYLOAD_FIELDS")) {
    fail("Missing FORBIDDEN_PAYLOAD_FIELDS in lib/validation/shared.ts");
  }
  if (!shared.includes("checkForbiddenFields")) {
    fail("Missing checkForbiddenFields in lib/validation/shared.ts");
  }
}

// 3. Schemas must use .strict()
const schemaFiles = [
  "lib/validation/project-submission.ts",
  "lib/validation/project-claim.ts",
];
for (const file of schemaFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (!content.includes(".strict()")) {
    fail(`Schema ${file} must use .strict()`);
  }
}

// 4. API routes must validate before Supabase check
const routeFiles = [
  "app/api/project-submissions/route.ts",
  "app/api/project-claims/route.ts",
];
for (const file of routeFiles) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    fail(`Missing route file: ${file}`);
    continue;
  }
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  const forbiddenIdx = content.indexOf("checkForbiddenFields");
  const supabaseIdx = content.indexOf("getSupabaseClient()");
  if (forbiddenIdx === -1) {
    fail(`${file} must call checkForbiddenFields`);
  }
  if (forbiddenIdx > supabaseIdx) {
    fail(`${file}: validation must run BEFORE Supabase check`);
  }
}

// 5. Middleware must have X-Robots-Tag noindex logic
if (fs.existsSync(path.join(ROOT, "middleware.ts"))) {
  const middleware = fs.readFileSync(
    path.join(ROOT, "middleware.ts"),
    "utf8"
  );
  if (!middleware.includes("X-Robots-Tag")) {
    fail("middleware.ts must include X-Robots-Tag noindex logic");
  }
  if (!middleware.includes("noindex, nofollow, noarchive")) {
    fail(
      "middleware.ts must set noindex, nofollow, noarchive"
    );
  }
}

// 6. Docs must exist
if (
  !fs.existsSync(
    path.join(ROOT, "docs/25_PUBLIC_SURFACE_HARDENING_V0.md")
  )
) {
  fail("Missing docs/25_PUBLIC_SURFACE_HARDENING_V0.md");
}

// 7. package.json must have public-surface:check
if (fs.existsSync(path.join(ROOT, "package.json"))) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, "package.json"), "utf8")
  );
  if (!pkg.scripts?.["public-surface:check"]) {
    fail("package.json missing script: public-surface:check");
  }
}

if (errors.length > 0) {
  console.error("public-surface:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("public-surface:check passed");
console.log(
  "Verified: validation ordering, forbidden fields, .strict() schemas, query noindex middleware"
);
