import fs from "node:fs";
import path from "node:path";

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

function readJson(file) {
  if (!exists(file)) {
    fail(`${file} is missing`);
    return {};
  }

  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`${file} is invalid JSON: ${error.message}`);
    return {};
  }
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
  "ops/oss/maintainer-automation-policy.json",
  "ops/oss/review-labels.json",
  "scripts/oss/check-maintainer-automation.mjs",
  "docs/62_OSS_MAINTAINER_AUTOMATION_V0.md",
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`${file} is missing`);
}

const policy = readJson("ops/oss/maintainer-automation-policy.json");
const labels = readJson("ops/oss/review-labels.json");
const packageJson = readJson("package.json");

if (policy.mode !== "maintainer_controlled") {
  fail("OSS automation policy must be maintainer controlled");
}

const defaultActions = policy.default_actions ?? {};
for (const [field, expected] of Object.entries({
  validate_payloads: true,
  emit_local_check_summary: true,
  suggest_labels: true,
  write_external_comments: false,
  approve_changes: false,
  merge_changes: false,
  call_external_model_api: false,
  mutate_data_repo: false,
})) {
  if (defaultActions[field] !== expected) {
    fail(`default action ${field} must be ${expected}`);
  }
}

if (labels.application_mode !== "suggest_only") {
  fail("review labels must be suggest_only");
}

if (labels.automatic_application_allowed !== false) {
  fail("review labels must not be applied automatically");
}

if (!Array.isArray(labels.labels) || labels.labels.length < 4) {
  fail("review labels must include maintainer guidance labels");
}

if (
  packageJson.scripts?.["oss-maintainer:check"] !==
  "node scripts/oss/check-maintainer-automation.mjs"
) {
  fail("package.json missing oss-maintainer:check script");
}

const scopedFiles = [
  ...walk("ops/oss"),
  ...walk("scripts/oss"),
  "docs/62_OSS_MAINTAINER_AUTOMATION_V0.md",
].filter((file) => exists(file));

const behaviorScanFiles = scopedFiles.filter(
  (file) => file !== "scripts/oss/check-maintainer-automation.mjs" && !file.endsWith(".md")
);

const blockedPatterns = [
  /auto[-_\s]?merge\s*:\s*true/i,
  /merge_changes"\s*:\s*true/i,
  /auto[-_\s]?approve\s*:\s*true/i,
  /approve_changes"\s*:\s*true/i,
  /write_external_comments"\s*:\s*true/i,
  /call_external_model_api"\s*:\s*true/i,
  /mutate_data_repo"\s*:\s*true/i,
  /gh\s+pr\s+comment|gh\s+issue\s+create|gh\s+pr\s+merge/i,
];

for (const file of behaviorScanFiles) {
  const content = read(file);
  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) {
      fail(`${file} contains blocked automation behavior: ${pattern}`);
    }
  }
}

const summary = [
  "# OSS Maintainer Automation Summary",
  "",
  "- Mode: maintainer-controlled",
  "- Validation: local only",
  "- Label handling: suggestions only",
  "- External comments: disabled",
  "- Approval or merge: disabled",
  "- External model calls: disabled",
  "- Data repo writes: disabled",
  "",
  "Suggested labels:",
  ...(labels.labels ?? []).map((label) => `- ${label.name}: ${label.description}`),
  "",
].join("\n");

if (process.env.OSS_MAINTAINER_SUMMARY_OUT) {
  fs.writeFileSync(process.env.OSS_MAINTAINER_SUMMARY_OUT, summary);
}

if (failures.length > 0) {
  console.error("oss-maintainer:check failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(summary);
console.log("oss-maintainer:check passed");
