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

function walk(dir) {
  const absolute = repoPath(dir);
  if (!fs.existsSync(absolute)) return [];

  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return walk(relative);
    return entry.isFile() ? [relative] : [];
  });
}

function changedFiles() {
  const commands = [
    ["diff", "--name-only", "origin/main...HEAD"],
    ["diff", "--name-only"],
    ["ls-files", "--others", "--exclude-standard"],
  ];
  const names = new Set();

  for (const args of commands) {
    try {
      const output = execFileSync("git", args, {
        cwd: root,
        encoding: "utf8",
      }).trim();
      for (const line of output.split(/\r?\n/).filter(Boolean)) {
        names.add(line);
      }
    } catch {
      // Some contexts, such as shallow local checks, may not have origin/main.
    }
  }

  return [...names].sort();
}

function fail(message) {
  failures.push(message);
}

function assertExists(file) {
  if (!exists(file)) fail(`${file} is missing`);
}

function literal(parts) {
  return parts.join("");
}

function contains(content, term) {
  return new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
    content
  );
}

assertExists("app/landscape/page.tsx");
assertExists("lib/landscape/public-signal-landscape.ts");
assertExists("docs/traffic/TRAFFIC2B_AI_PROJECT_LANDSCAPE_LANDING_IMPLEMENTATION_V0.md");

if (exists("app/tasks")) fail("app/tasks must not exist");
if (exists("app/zh-CN")) fail("app/zh-CN must not exist");
if (exists("app/landscape/sectors")) fail("app/landscape/sectors must not exist");

const changed = changedFiles();
for (const file of changed) {
  if (file.startsWith("app/api/")) {
    fail(`${file} must not be changed by TRAFFIC2B`);
  }
  if (file === "package-lock.json") {
    fail("package-lock.json must not change");
  }
  if (file.startsWith("app/tasks/") || file.startsWith("app/zh-CN/")) {
    fail(`${file} is outside TRAFFIC2B route scope`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (
  packageJson.scripts?.["landscape:check"] !==
  "node scripts/check-landscape-boundary.mjs"
) {
  fail("package.json missing landscape:check script");
}

try {
  const basePackageJson = JSON.parse(
    execFileSync("git", ["show", "origin/main:package.json"], {
      cwd: root,
      encoding: "utf8",
    })
  );
  const currentWithoutLandscape = structuredClone(packageJson);
  delete currentWithoutLandscape.scripts?.["landscape:check"];
  if (
    JSON.stringify(currentWithoutLandscape) !== JSON.stringify(basePackageJson)
  ) {
    fail("package.json changes must be limited to landscape:check script registration");
  }
} catch {
  // origin/main may be unavailable in isolated local checks; scope gate covers diffs.
}

const sourceFiles = [
  "app/landscape/page.tsx",
  ...walk("components/landscape"),
  ...walk("lib/landscape"),
];

for (const file of sourceFiles) {
  const content = read(file);
  const importLines = content
    .split(/\r?\n/)
    .filter((line) => /^\s*import\b/.test(line));

  const forbiddenImportPattern =
    /supabase|admin|payment|api-key|apiKeys|metering|buyer-interest|buyerInterest|mcp|gateway|private|telemetry/i;
  for (const line of importLines) {
    if (forbiddenImportPattern.test(line)) {
      fail(`${file} has forbidden import: ${line.trim()}`);
    }
  }
}

const forbiddenFields = [
  literal(["founder", " ", "email"]),
  "founder_email",
  literal(["admin", " ", "notes"]),
  literal(["payment", " ", "state"]),
  "payment_state",
  literal(["API", " ", "key"]),
  "api_key",
  "metering",
  literal(["buyer", " ", "interest"]),
  "buyer_interest",
  literal(["raw", " ", "database", " ", "row"]),
  literal(["private", " ", "telemetry"]),
];

const blockedCopy = [
  literal(["best", " ", "AI", " ", "tools"]),
  literal(["top", " ", "AI", " ", "tools"]),
  literal(["largest", " ", "directory"]),
  literal(["guaranteed", " ", "ranking"]),
  literal(["guaranteed", " ", "traffic"]),
  literal(["guaranteed", " ", "AI", " ", "citation"]),
  literal(["guaranteed", " ", "ChatGPT", " ", "visibility"]),
  literal(["paid", " ", "inclusion"]),
  "backlink",
  literal(["live", " ", "feed", " ", "access"]),
  literal(["customer", " ", "signup"]),
  literal(["paid", " ", "access"]),
  literal(["buyer-interest", " ", "capture"]),
  literal(["private", " ", "data"]),
  "supabase",
  "app/tasks",
  "app/zh-CN",
];

for (const file of sourceFiles) {
  const content = read(file);
  for (const term of forbiddenFields) {
    if (contains(content, term)) {
      fail(`${file} contains forbidden rendered field or phrase: ${term}`);
    }
  }
  for (const term of blockedCopy) {
    if (contains(content, term)) {
      fail(`${file} contains restricted public copy: ${term}`);
    }
  }
}

if (exists("app/landscape/page.tsx")) {
  const page = read("app/landscape/page.tsx");
  const safePhrases = ["reviewed sample", "not global market estimate"];
  for (const phrase of safePhrases) {
    if (!contains(page, phrase)) {
      fail(`app/landscape/page.tsx must include low-data phrase: ${phrase}`);
    }
  }

  const unsafeLinks = [
    'href="/tasks',
    'href="/zh-CN',
    'href="/landscape/sectors',
    'href="/api',
    'href="/admin',
    'href="/auth',
    'href="/scouted',
    'href="/api/alpha-feed/buyer-interest',
    'href="/api/alpha-feed/api-keys',
    'href="/api/payments',
  ];
  for (const link of unsafeLinks) {
    if (page.includes(link)) {
      fail(`app/landscape/page.tsx contains unsafe link: ${link}`);
    }
  }

  for (const route of [
    "/projects",
    "/reports",
    "/geo-checker",
    "/founders",
    "/submit",
    "/alpha-feed",
  ]) {
    if (!page.includes(`href="${route}"`)) {
      fail(`app/landscape/page.tsx missing safe route link: ${route}`);
    }
  }
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");
  if (!sitemap.includes("/landscape")) {
    fail("app/sitemap.ts must include /landscape after safe route implementation");
  }
  for (const route of ["/landscape/sectors", "/tasks", "/zh-CN"]) {
    if (sitemap.includes(route)) {
      fail(`app/sitemap.ts must not include ${route}`);
    }
  }
}

const statusDocs = ["docs/TASK_STATUS.md", "ops/tasks/current.json"];
for (const file of statusDocs) {
  if (!exists(file)) fail(`${file} is missing`);
}

if (exists("ops/tasks/current.json")) {
  const current = JSON.parse(read("ops/tasks/current.json"));
  if (current.current_task !== "TRAFFIC2B") {
    fail("ops/tasks/current.json must mark TRAFFIC2B as current task");
  }
  if (!["PASS", "PASS_WITH_FINDINGS"].includes(current.result)) {
    fail("ops/tasks/current.json must record PASS or PASS_WITH_FINDINGS");
  }
}

const dataRepoStatus = execFileSync("git", ["status", "--short", "--branch"], {
  cwd: path.resolve(root, "../88cn-index-data"),
  encoding: "utf8",
}).trim();
const dataRepoDirty = dataRepoStatus
  .split(/\r?\n/)
  .some((line) => line && !line.startsWith("## "));
if (dataRepoDirty) {
  fail("../88cn-index-data must remain clean");
}

if (failures.length > 0) {
  console.error("landscape:check failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("landscape:check passed");
