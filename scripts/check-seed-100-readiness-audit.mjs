import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_REPO = path.resolve(ROOT, process.env.SEED_DATA_REPO || "../88cn-index-data");
const OUT_DIR = path.join(ROOT, "data/audits/seed-100-readiness");
const errors = [];

const REQUIRED_ITEM_FIELDS = [
  "slug",
  "category",
  "source_type",
  "website_host",
  "audit_outcome",
  "http_status",
  "status_class",
  "redirect_count",
  "final_url_same_origin",
  "body_bytes",
  "readable_text_bucket",
  "title_present",
  "meta_description_present",
  "canonical_present",
  "jsonld_present",
  "jsonld_count",
  "schema_types",
  "software_application_schema_present",
  "organization_schema_present",
  "open_graph_present",
  "robots_status",
  "sitemap_status",
  "issue_codes",
  "audited_at",
];

const OUTCOMES = new Set([
  "ok",
  "invalid_url",
  "blocked_by_guard",
  "dns_error",
  "tls_error",
  "timeout",
  "redirect_limit",
  "http_4xx",
  "http_5xx",
  "fetch_error",
  "empty_html",
  "parse_error",
]);

const ISSUE_CODES = new Set([
  ...OUTCOMES,
  "no_readable_text",
  "low_readable_text",
  "missing_title",
  "missing_meta_description",
  "missing_canonical",
  "missing_jsonld",
  "missing_open_graph",
  "robots_unavailable",
  "sitemap_unavailable",
]);

const SECRET_PATTERNS = [
  { name: "email", regex: /[^\s@]+@[^\s@]+\.[^\s@]+/ },
  { name: "private_key", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "github_credential", regex: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { name: "generic_secret", regex: /\b(?:api_key|access_secret|password)=/i },
  { name: "credential_url", regex: /\bhttps?:\/\/[^/\s:@]+:[^@\s/]+@[^\s"'`<>),]+/ },
  { name: "ip_address", regex: /\b\d{1,3}(?:\.\d{1,3}){3}\b/ },
];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        fail(`${path.relative(ROOT, filePath)} line ${index + 1} is not valid JSON`);
        return null;
      }
    })
    .filter(Boolean);
}

function requireFile(repoPath) {
  const filePath = path.join(ROOT, repoPath);
  if (!fs.existsSync(filePath)) fail(`Missing ${repoPath}`);
  return filePath;
}

function countManifestItems() {
  const manifestPath = path.join(DATA_REPO, "seed", "seed-100-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    fail(`Missing seed manifest at ${manifestPath}`);
    return 0;
  }
  const manifest = readJson(manifestPath);
  return Array.isArray(manifest.items) ? manifest.items.length : 0;
}

function scanTextFile(repoPath) {
  const filePath = path.join(ROOT, repoPath);
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  if (/<html[\s>]|<\/html>|<body[\s>]|<\/body>|<!doctype html/i.test(text)) {
    fail(`${repoPath} appears to contain raw HTML`);
  }
  if (/\bserver\s*:/i.test(text) || /\bset-cookie\s*:/i.test(text)) {
    fail(`${repoPath} appears to contain raw headers`);
  }
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.regex.test(text)) fail(`${repoPath} contains ${pattern.name} pattern`);
  }
}

function validateItems(items, expectedCount) {
  if (items.length !== expectedCount) fail(`items.ndjson has ${items.length} rows; expected ${expectedCount}`);
  const slugs = new Set();

  for (const item of items) {
    for (const field of REQUIRED_ITEM_FIELDS) {
      if (!(field in item)) fail(`${item.slug || "unknown"} missing field ${field}`);
    }
    if (typeof item.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      fail(`Invalid slug field: ${String(item.slug)}`);
    }
    if (slugs.has(item.slug)) fail(`Duplicate item slug: ${item.slug}`);
    slugs.add(item.slug);

    if (!OUTCOMES.has(item.audit_outcome)) fail(`${item.slug} has invalid outcome ${item.audit_outcome}`);
    if (!Array.isArray(item.issue_codes)) fail(`${item.slug} issue_codes must be an array`);
    for (const issue of item.issue_codes || []) {
      if (!ISSUE_CODES.has(issue)) fail(`${item.slug} has invalid issue code ${issue}`);
    }
    if (!Array.isArray(item.schema_types)) fail(`${item.slug} schema_types must be an array`);
    for (const schemaType of item.schema_types || []) {
      if (typeof schemaType !== "string" || !/^[A-Za-z][A-Za-z0-9_-]{0,60}$/.test(schemaType)) {
        fail(`${item.slug} has unsanitized schema type`);
      }
    }
    if (item.website_host && /\d{1,3}(?:\.\d{1,3}){3}/.test(item.website_host)) {
      fail(`${item.slug} stores an IP-like host`);
    }
    if (typeof item.body_bytes !== "number" || item.body_bytes < 0 || item.body_bytes > 262144) {
      fail(`${item.slug} body_bytes outside bounds`);
    }
  }
}

function validateSummary(summary, items, expectedCount) {
  if (summary.total_projects !== expectedCount) fail("summary total_projects mismatch");
  if (summary.audited_projects !== items.length) fail("summary audited_projects mismatch");
  if (!summary.data_repo_commit || summary.data_repo_commit === "unknown") fail("summary missing data_repo_commit");
  if (!summary.main_repo_commit || summary.main_repo_commit === "unknown") fail("summary missing main_repo_commit");

  const outcomeCounts = {};
  for (const item of items) {
    outcomeCounts[item.audit_outcome] = (outcomeCounts[item.audit_outcome] || 0) + 1;
  }
  for (const [outcome, count] of Object.entries(outcomeCounts)) {
    if (summary.outcome_counts?.[outcome] !== count) fail(`summary outcome count mismatch for ${outcome}`);
  }

  const jsonldCount = items.filter((item) => item.jsonld_present).length;
  if (summary.jsonld_present_count !== jsonldCount) fail("summary jsonld_present_count mismatch");
  const htmlFailures = items.filter((item) => item.audit_outcome !== "ok").length;
  if (summary.html_fetch_failure_count !== htmlFailures) fail("summary html_fetch_failure_count mismatch");
}

const summaryPath = requireFile("data/audits/seed-100-readiness/summary.json");
const itemsPath = requireFile("data/audits/seed-100-readiness/items.ndjson");
requireFile("data/audits/seed-100-readiness/README.md");

if (errors.length === 0) {
  const expectedCount = countManifestItems();
  const summary = readJson(summaryPath);
  const items = readNdjson(itemsPath);
  validateItems(items, expectedCount);
  validateSummary(summary, items, expectedCount);
}

for (const repoPath of [
  "data/audits/seed-100-readiness/summary.json",
  "data/audits/seed-100-readiness/items.ndjson",
  "data/audits/seed-100-readiness/failures.ndjson",
  "data/audits/seed-100-readiness/schema.json",
  "data/audits/seed-100-readiness/README.md",
]) {
  scanTextFile(repoPath);
}

if (errors.length > 0) {
  console.error("seed-audit:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("seed-audit:check passed");
