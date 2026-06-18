import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];

const contractPath = path.join(ROOT, "ops/contracts/public-api-boundary.json");
const docPath = path.join(
  ROOT,
  "docs/64_PUBLIC_API_DATA_BOUNDARY_THREAT_MODEL_V0.md"
);
const packagePath = path.join(ROOT, "package.json");

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Invalid JSON: ${path.relative(ROOT, filePath)} (${error.message})`);
    return null;
  }
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function includesAll(values, required) {
  return required.every((item) => values.includes(item));
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanDir(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

if (!fs.existsSync(contractPath)) {
  fail("Missing ops/contracts/public-api-boundary.json");
}

const contract = fs.existsSync(contractPath) ? readJson(contractPath) : null;

if (contract) {
  const allowedFields = contract.allowed_public_fields;
  const deniedFields = contract.denied_fields;
  const allowedStatuses = contract.allowed_statuses;
  const deniedStatuses = contract.denied_statuses;

  if (!isNonEmptyArray(allowedFields)) {
    fail("Contract must include non-empty allowed_public_fields");
  }

  if (!isNonEmptyArray(deniedFields)) {
    fail("Contract must include non-empty denied_fields");
  }

  if (!isNonEmptyArray(allowedStatuses)) {
    fail("Contract must include non-empty allowed_statuses");
  }

  if (isNonEmptyArray(allowedStatuses)) {
    if (allowedStatuses.length !== 1 || allowedStatuses[0] !== "published") {
      fail("Contract allowed_statuses must be exactly [\"published\"]");
    }
  }

  const requiredDeniedStatuses = [
    "submitted",
    "pending_review",
    "quarantined",
    "rejected",
    "scouted_unreviewed",
    "admin_review",
  ];
  if (!isNonEmptyArray(deniedStatuses)) {
    fail("Contract must include non-empty denied_statuses");
  } else if (!includesAll(deniedStatuses, requiredDeniedStatuses)) {
    fail(
      `Contract denied_statuses must include: ${requiredDeniedStatuses.join(", ")}`
    );
  }

  const requiredDeniedFields = [
    "founder_email",
    "submitter_email",
    "claim_email",
    "admin_notes",
    "review_comments",
    "payment_data",
    "payment_state",
    "commercial_order_state",
    "raw_supabase_row",
    "source_confidence_internal",
    "signal_score_internal",
  ];
  if (isNonEmptyArray(deniedFields) && !includesAll(deniedFields, requiredDeniedFields)) {
    fail(`Contract denied_fields must include: ${requiredDeniedFields.join(", ")}`);
  }

  const forbiddenAllowedFieldFragments = [
    "email",
    "payment",
    "admin",
    "review",
    "audit",
    "notification",
    "raw",
    "payload",
    "confidence_internal",
    "score_internal",
    "commercial_order",
  ];
  if (isNonEmptyArray(allowedFields)) {
    for (const field of allowedFields) {
      for (const fragment of forbiddenAllowedFieldFragments) {
        if (field.toLowerCase().includes(fragment)) {
          fail(`Allowed field must not include private/admin/payment fragment: ${field}`);
        }
      }
    }
  }

  if (contract.endpoint_exposure !== "none") {
    fail("Contract endpoint_exposure must be none for PR57");
  }

  if (contract.public_api_release_allowed !== false) {
    fail("Contract public_api_release_allowed must be false for PR57");
  }

  if (!isNonEmptyArray(contract.serialization_rules)) {
    fail("Contract must include serialization_rules");
  }

  if (!isNonEmptyArray(contract.privacy_rules)) {
    fail("Contract must include privacy_rules");
  }

  if (!isNonEmptyArray(contract.machine_data_rules)) {
    fail("Contract must include machine_data_rules");
  }

  if (!isNonEmptyArray(contract.rate_limit_expectations)) {
    fail("Contract must include rate_limit_expectations");
  }

  if (!isNonEmptyArray(contract.future_pr58_preconditions)) {
    fail("Contract must include future_pr58_preconditions");
  }
}

if (!fs.existsSync(docPath)) {
  fail("Missing docs/64_PUBLIC_API_DATA_BOUNDARY_THREAT_MODEL_V0.md");
} else {
  const doc = fs.readFileSync(docPath, "utf8");
  const requiredDocPhrases = [
    "PR57 does not implement or expose a public API endpoint",
    "published",
    "field allowlist",
    "denied fields",
    "denied statuses",
    "PR58 remains a human-checkpoint implementation train",
  ];
  for (const phrase of requiredDocPhrases) {
    if (!doc.includes(phrase)) {
      fail(`Threat model doc missing phrase: ${phrase}`);
    }
  }
}

const publicRouteFiles = scanDir(path.join(ROOT, "app/api")).filter((file) => {
  const relative = path.relative(ROOT, file).split(path.sep).join("/");
  return relative.includes("/public/") || relative.endsWith("/public/route.ts");
});

if (publicRouteFiles.length > 0) {
  const allowedPublicRoutes = new Set([
    "app/api/public/v0/projects/[slug]/route.ts",
    "app/api/public/v0/projects/route.ts",
  ]);
  const routeNames = publicRouteFiles
    .map((file) => path.relative(ROOT, file).split(path.sep).join("/"))
    .sort();
  for (const route of routeNames) {
    if (!allowedPublicRoutes.has(route)) {
      fail(`Unexpected public API route file: ${route}`);
    }
  }
  const requiredPr58Files = [
    "lib/public-api/feature-flags.ts",
    "lib/public-api/serializer.ts",
    "scripts/check-public-api-v0.mjs",
    "docs/65_PUBLIC_READ_ONLY_API_V0.md",
  ];
  for (const file of requiredPr58Files) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      fail(`Public API route requires PR58 boundary file: ${file}`);
    }
  }
}

const mcpDirs = [
  path.join(ROOT, "app/api/mcp"),
  path.join(ROOT, "lib/mcp"),
  path.join(ROOT, "mcp"),
];
for (const dir of mcpDirs) {
  if (fs.existsSync(dir)) {
    fail(`MCP runtime directory must not be introduced for PR57: ${path.relative(ROOT, dir)}`);
  }
}

const filesToScanForActiveMcpEndpoint = [
  ...scanDir(path.join(ROOT, "app")),
  ...scanDir(path.join(ROOT, "lib")),
].filter((file) => /\.(ts|tsx|js|jsx|mjs)$/.test(file));
for (const file of filesToScanForActiveMcpEndpoint) {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("public-api-boundary") && content.includes("mcp")) {
    fail(
      `Runtime code must not reference public-api-boundary as active MCP endpoint: ${path.relative(
        ROOT,
        file
      )}`
    );
  }
}

if (fs.existsSync(packagePath)) {
  const pkg = readJson(packagePath);
  if (pkg && pkg.scripts?.["public-api-boundary:check"] !== "node scripts/check-public-api-boundary.mjs") {
    fail("package.json missing script: public-api-boundary:check");
  }
}

if (errors.length > 0) {
  console.error("public-api-boundary:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("public-api-boundary:check passed");
console.log(
  "Verified: published-only status, explicit field allowlist, denied private/admin/payment fields, PR58 v0 route boundary, no MCP runtime exposure"
);
