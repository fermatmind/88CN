import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const defaultBoundaryPath = path.join(root, "ops/indexing/sitemap-notification-boundary.json");
const defaultDocPath = path.join(root, "docs/81_SITEMAP_NOTIFICATION_INDEXNOW_BOUNDARY_V0.md");
const defaultPackagePath = path.join(root, "package.json");
const errors = [];

const endpointPatterns = [
  new RegExp(["api", "\\.", "index", "now", "\\.", "org"].join(""), "i"),
  new RegExp(["www", "\\.", "google", "\\.", "com", "\\/", "indexing"].join(""), "i"),
  /indexing\/v3\/urlNotifications/i
];
const keyPatterns = [
  new RegExp(["INDEX", "NOW", "_", "KEY"].join(""), "i"),
  new RegExp(["INDEX", "NOW", "_", "API", "_", "KEY"].join(""), "i"),
  new RegExp(["index", "now", "_", "key"].join(""), "i")
];
const externalHttpPatterns = [
  /\bfetch\s*\(/,
  /\bhttps?\.(request|get)\s*\(/,
  /\baxios\b/,
  /\bnode-fetch\b/,
  /\bundici\b/,
  /\bgot\s*\(/
];
const deniedSources = new Set([
  "submitted",
  "pending",
  "quarantined",
  "scouted",
  "rejected",
  "admin",
  "api",
  "mcp",
  "payment"
]);
const requiredAllowedSources = new Set([
  "sitemap_published_pages_only",
  "allowlisted_intent_registry_published_only"
]);

function parseArgs(argv) {
  const options = {
    boundaryPath: defaultBoundaryPath,
    docPath: defaultDocPath,
    packagePath: defaultPackagePath,
    extraScanRoots: []
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--boundary") {
      options.boundaryPath = path.resolve(argv[++i]);
    } else if (arg === "--doc") {
      options.docPath = path.resolve(argv[++i]);
    } else if (arg === "--package") {
      options.packagePath = path.resolve(argv[++i]);
    } else if (arg === "--extra-scan-root") {
      options.extraScanRoots.push(path.resolve(argv[++i]));
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function listFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if ([".git", ".next", "node_modules"].includes(entry.name)) {
        continue;
      }
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function gitChangedFiles() {
  try {
    const output = execFileSync("git", ["diff", "--name-only", "origin/main...HEAD"], {
      cwd: root,
      encoding: "utf8"
    });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function relativeToRoot(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function checkBoundary(boundary) {
  if (boundary.google_indexing_api_allowed !== false) {
    fail("google_indexing_api_allowed must be false");
  }

  if (boundary.indexnow_live_ping_default !== false) {
    fail("indexnow_live_ping_default must be false");
  }

  if (boundary.live_ping_requires_human_checkpoint !== true) {
    fail("live_ping_requires_human_checkpoint must be true");
  }

  if (boundary.dry_run_allowed !== true) {
    fail("dry_run_allowed must be true");
  }

  if (boundary.external_network_calls_in_pr78 !== false) {
    fail("external_network_calls_in_pr78 must be false");
  }

  if (boundary.sitemap_runtime_change_allowed_in_pr78 !== false) {
    fail("sitemap_runtime_change_allowed_in_pr78 must be false");
  }

  const allowed = new Set(boundary.allowed_url_sources || []);
  for (const required of requiredAllowedSources) {
    if (!allowed.has(required)) {
      fail(`allowed_url_sources missing ${required}`);
    }
  }

  const denied = new Set(boundary.denied_url_sources || []);
  for (const required of deniedSources) {
    if (!denied.has(required)) {
      fail(`denied_url_sources missing ${required}`);
    }
  }

  for (const source of boundary.allowed_url_sources || []) {
    if (deniedSources.has(source)) {
      fail(`denied source must not be allowed: ${source}`);
    }
  }

  if (boundary.future_key_storage_policy?.commit_keys !== false) {
    fail("future_key_storage_policy.commit_keys must be false");
  }

  if (boundary.future_key_storage_policy?.env_secret_required_in_pr78 !== false) {
    fail("future_key_storage_policy.env_secret_required_in_pr78 must be false");
  }

  if (boundary.future_pr79_dry_run_policy?.dry_run_only !== true) {
    fail("future_pr79_dry_run_policy.dry_run_only must be true");
  }

  if (boundary.future_pr79_dry_run_policy?.live_ping_allowed !== false) {
    fail("future_pr79_dry_run_policy.live_ping_allowed must be false");
  }
}

function checkDoc(docSource) {
  const requiredSnippets = [
    "Google Indexing API is forbidden",
    "IndexNow live ping is disabled by default",
    "human checkpoint",
    "dry-run only",
    "No external search endpoint is called in PR78",
    "No keys are committed",
    "PR79"
  ];

  for (const snippet of requiredSnippets) {
    if (!docSource.includes(snippet)) {
      fail(`boundary doc missing required snippet: ${snippet}`);
    }
  }
}

function checkPackage(packageJson) {
  if (packageJson.scripts?.["sitemap-notification:check"] !== "node scripts/check-sitemap-notification-boundary.mjs") {
    fail("package.json must define sitemap-notification:check");
  }
}

function checkChangedFiles() {
  const changed = gitChangedFiles();
  const forbiddenRuntimeChanges = changed.filter((file) => (
    file === "app/sitemap.ts" ||
    file.startsWith("app/") ||
    file.startsWith("lib/") ||
    file.startsWith("public/") ||
    file.startsWith("deploy/") ||
    file === "middleware.ts" ||
    file === "package-lock.json"
  ));

  for (const file of forbiddenRuntimeChanges) {
    fail(`PR78 must not modify runtime/deploy/public path: ${file}`);
  }
}

function checkSourceFiles(scanRoots) {
  const files = scanRoots.flatMap(listFiles);

  for (const file of files) {
    const rel = relativeToRoot(file);
    const source = readText(file);

    for (const pattern of endpointPatterns) {
      if (pattern.test(source)) {
        fail(`external search endpoint reference found in ${rel}`);
      }
    }

    for (const pattern of keyPatterns) {
      if (pattern.test(source)) {
        fail(`IndexNow key-like material found in ${rel}`);
      }
    }

    if (rel.includes("indexing/") || file.includes(`${path.sep}indexing${path.sep}`)) {
      for (const pattern of externalHttpPatterns) {
        if (pattern.test(source)) {
          fail(`external network call pattern found in indexing boundary file ${rel}`);
        }
      }
    }
  }
}

const options = parseArgs(process.argv.slice(2));

if (!fs.existsSync(options.boundaryPath)) {
  fail(`boundary contract missing: ${options.boundaryPath}`);
}

if (!fs.existsSync(options.docPath)) {
  fail(`boundary doc missing: ${options.docPath}`);
}

if (!fs.existsSync(options.packagePath)) {
  fail(`package file missing: ${options.packagePath}`);
}

if (errors.length === 0) {
  checkBoundary(readJson(options.boundaryPath));
  checkDoc(readText(options.docPath));
  checkPackage(readJson(options.packagePath));
  checkChangedFiles();
  checkSourceFiles([
    path.join(root, "app"),
    path.join(root, "lib"),
    path.join(root, "scripts"),
    path.join(root, "ops/indexing"),
    ...options.extraScanRoots
  ]);
}

if (errors.length > 0) {
  console.error("sitemap-notification-boundary check failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("sitemap-notification-boundary check passed");
