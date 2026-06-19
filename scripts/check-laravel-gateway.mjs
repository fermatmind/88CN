import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const rootIndex = args.indexOf("--root");
const root = path.resolve(rootIndex >= 0 ? args[rootIndex + 1] : process.cwd());
const fixtureMode = rootIndex >= 0;

const requiredFiles = [
  "gateway/README.md",
  "gateway/disabled-scaffold.contract.json",
  "gateway/disabled-scaffold.example.json",
  "docs/PR92_LARAVEL_GATEWAY_DISABLED_SCAFFOLD_V0.md"
];

const requiredFlags = [
  "LARAVEL_GATEWAY_ENABLED",
  "LARAVEL_RUNTIME_ENABLED",
  "COMPOSER_DEPENDENCY_ENABLED",
  "PHP_RUNTIME_ENABLED",
  "SUPABASE_WEBHOOK_SYNC_ENABLED",
  "REDIS_GATEWAY_CACHE_ENABLED",
  "GATEWAY_CUSTOMER_ACCESS_ENABLED",
  "GATEWAY_API_KEY_RUNTIME_ENABLED",
  "GATEWAY_METERING_RUNTIME_ENABLED"
];

const checkpointTriggers = [
  "composer_dependency",
  "laravel_runtime",
  "php_runtime",
  "server_config",
  "live_deploy",
  "supabase_schema_change",
  "supabase_webhook_secret",
  "redis_production_usage",
  "customer_access",
  "api_key_runtime",
  "metering_runtime",
  "external_service_connection",
  "data_repo_mutation"
];

const deniedFileClasses = [
  "composer.json",
  "composer.lock",
  "artisan",
  "bootstrap/**",
  "routes/**",
  "**/*.php",
  "supabase/migrations/**",
  "deploy/**",
  ".env*"
];

const deniedFields = [
  "founder_email",
  "contact_email",
  "admin_notes",
  "review_notes",
  "payment_state",
  "stripe_customer_id",
  "api_key_plaintext",
  "api_key_hash",
  "api_key_hash_salt",
  "bearer_credential",
  "session_credential",
  "service_role_credential",
  "raw_database_row",
  "raw_payload",
  "private_telemetry",
  "source_confidence_internal",
  "signal_score_internal",
  "claim_credential"
];

const allowedChangedPaths = new Set([
  "docs/PR92_LARAVEL_GATEWAY_DISABLED_SCAFFOLD_V0.md",
  "gateway/README.md",
  "gateway/disabled-scaffold.contract.json",
  "gateway/disabled-scaffold.example.json",
  "scripts/check-laravel-gateway.mjs",
  "docs/BUILD_ERRORS.md",
  "docs/SIDECAR_ISSUES.md",
  "docs/TASK_STATUS.md",
  "ops/tasks/current.json",
  "ops/tasks/roadmap.json"
]);

const failures = [];

function rel(file) {
  return file.split(path.sep).join("/");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function addFailure(message) {
  failures.push(message);
}

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".next") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

function listRelativeFiles() {
  return walk(root).map((file) => rel(path.relative(root, file)));
}

function hasAnyUnder(prefix) {
  return listRelativeFiles().some((file) => file === prefix || file.startsWith(`${prefix}/`));
}

function hasPhpRuntimeFile() {
  return listRelativeFiles().some((file) => file.endsWith(".php"));
}

function getChangedFiles() {
  try {
    const output = execFileSync("git", ["diff", "--name-only", "origin/main...HEAD"], {
      cwd: root,
      encoding: "utf8"
    });
    return output.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

for (const file of requiredFiles) {
  if (!exists(file)) addFailure(`Missing required file: ${file}`);
}

const matchingDocs = listRelativeFiles().filter((file) => /^docs\/PR92_.*\.md$/.test(file));
if (matchingDocs.length === 0) {
  addFailure("Missing docs/PR92_*.md document");
}

let contract = null;
if (exists("gateway/disabled-scaffold.contract.json")) {
  try {
    contract = readJson("gateway/disabled-scaffold.contract.json");
  } catch (error) {
    addFailure(`Invalid contract JSON: ${error.message}`);
  }
}

if (contract) {
  for (const flag of requiredFlags) {
    if (contract.required_flags?.[flag] !== false) {
      addFailure(`Contract flag must be false: ${flag}`);
    }
  }
  for (const trigger of checkpointTriggers) {
    if (!contract.checkpoint_triggers?.includes(trigger)) {
      addFailure(`Missing checkpoint trigger: ${trigger}`);
    }
  }
  for (const deniedClass of deniedFileClasses) {
    if (!contract.denied_file_classes?.includes(deniedClass)) {
      addFailure(`Missing denied file class: ${deniedClass}`);
    }
  }
  for (const field of deniedFields) {
    if (!contract.denied_data_fields?.includes(field)) {
      addFailure(`Missing denied data field: ${field}`);
    }
  }
  if (contract.scaffold_status?.documentation_only !== true) {
    addFailure("Contract must mark scaffold documentation_only");
  }
  if (contract.scaffold_status?.non_executable !== true) {
    addFailure("Contract must mark scaffold non_executable");
  }
  if (contract.scaffold_status?.not_a_laravel_application !== true) {
    addFailure("Contract must mark scaffold not_a_laravel_application");
  }
}

if (exists("composer.json")) addFailure("composer.json must not exist");
if (exists("composer.lock")) addFailure("composer.lock must not exist");
if (exists("artisan")) addFailure("artisan must not exist");
if (hasAnyUnder("bootstrap")) addFailure("bootstrap/** must not exist");
if (hasAnyUnder("routes")) addFailure("routes/** must not exist");
if (hasPhpRuntimeFile()) addFailure("PHP runtime files must not exist");

if (fixtureMode) {
  if (hasAnyUnder("supabase/migrations")) addFailure("Supabase migrations must not exist in fixture");
  if (hasAnyUnder("deploy")) addFailure("deploy/server config must not exist in fixture");
  if (listRelativeFiles().some((file) => /^\.env/.test(file))) {
    addFailure(".env* files must not exist in fixture");
  }
  if (exists("DATA_REPO_MUTATION")) {
    addFailure("data repo mutation marker must not exist in fixture");
  }
} else {
  const changedFiles = getChangedFiles();
  for (const file of changedFiles) {
    if (!allowedChangedPaths.has(file)) {
      addFailure(`Changed file is outside PR92 allowed scope: ${file}`);
    }
    if (file.startsWith("app/") || file.startsWith("lib/") || file.startsWith("supabase/")) {
      addFailure(`Runtime route/API/Supabase file changed: ${file}`);
    }
    if (file.startsWith("deploy/") || file === "middleware.ts") {
      addFailure(`Deploy/server config changed: ${file}`);
    }
  }
}

if (exists("ops/tasks/current.json")) {
  const current = readJson("ops/tasks/current.json");
  if (current.current_task === "PR93") {
    addFailure("PR93 must not be started");
  }
}

if (exists("ops/tasks/roadmap.json")) {
  const roadmap = readJson("ops/tasks/roadmap.json");
  const pr92 = roadmap.tasks?.find((task) => task.id === "PR92");
  if (!pr92) {
    addFailure("PR92 roadmap task is missing");
  } else {
    if (pr92.human_checkpoint !== true) {
      addFailure("PR92 must remain human_checkpoint=true");
    }
    if (pr92.deployment !== "none") {
      addFailure("PR92 deployment must remain none");
    }
    if (pr92.allowed_paths?.includes("gateway/**")) {
      addFailure("PR92 must not allow broad gateway/** after OPS7C");
    }
    if (pr92.forbidden_paths?.includes("scripts/**")) {
      addFailure("PR92 must not forbid broad scripts/** while exact checker is allowed");
    }
  }
}

if (failures.length) {
  console.error("laravel-gateway check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("laravel-gateway check passed");
console.log(`root: ${root}`);
console.log(`fixtureMode: ${fixtureMode ? "yes" : "no"}`);
