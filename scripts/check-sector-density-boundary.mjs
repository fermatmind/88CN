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

let taskDiscoveryBoundaryChecked = false;

function ensureTaskDiscoveryBoundary(reason) {
  if (taskDiscoveryBoundaryChecked) return;
  taskDiscoveryBoundaryChecked = true;

  try {
    execFileSync(process.execPath, [repoPath("scripts/check-task-discovery-boundary.mjs")], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const output = [error.stdout, error.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();
    fail(
      `${reason} requires passing scripts/check-task-discovery-boundary.mjs` +
        (output ? `: ${output}` : "")
    );
  }
}

function gitLines(args) {
  try {
    const output = execFileSync("git", args, { cwd: root, encoding: "utf8" });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function containsAny(content, terms) {
  const lowered = content.toLowerCase();
  return terms.filter((term) => lowered.includes(term.toLowerCase()));
}

function importLines(file) {
  return read(file)
    .split(/\r?\n/)
    .filter((line) => /^\s*import\b/.test(line));
}

const requiredFiles = [
  "app/landscape/page.tsx",
  "lib/landscape/public-signal-landscape.ts",
  "scripts/check-sector-density-boundary.mjs",
  "docs/traffic/TRAFFIC3B_SECTOR_DENSITY_MARKET_MAP_IMPLEMENTATION_V0.md",
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`${file} is missing`);
}

for (const dir of ["app/landscape/sectors", "app/zh-CN"]) {
  if (exists(dir)) fail(`${dir} must not exist`);
}

if (exists("app/tasks")) {
  ensureTaskDiscoveryBoundary("finite task routes");
}

const changed = new Set([
  ...gitLines(["diff", "--name-only", "origin/main...HEAD"]),
  ...gitLines(["diff", "--name-only"]),
  ...gitLines(["ls-files", "--others", "--exclude-standard"]),
]);

if (changed.has("package-lock.json")) {
  fail("package-lock.json must not change");
}

const sourceFiles = [
  "app/landscape/page.tsx",
  "lib/landscape/public-signal-landscape.ts",
].filter(exists);

const forbiddenImportPattern =
  /supabase|admin|payment|api-key|apiKeys|metering|buyer-interest|buyerInterest|mcp|gateway|customer|private|telemetry/i;

for (const file of sourceFiles) {
  for (const line of importLines(file)) {
    if (forbiddenImportPattern.test(line)) {
      fail(`${file} has forbidden import: ${line.trim()}`);
    }
  }
}

if (exists("app/landscape/page.tsx")) {
  const page = read("app/landscape/page.tsx");
  for (const required of [
    "Sector density map",
    "reviewed sample count",
    "not global market estimates",
    "limited reviewed samples",
    "Module only",
  ]) {
    if (!page.toLowerCase().includes(required.toLowerCase())) {
      fail(`app/landscape/page.tsx missing sector module wording: ${required}`);
    }
  }

  if (/href=["']\/tasks(?:["'?#])/.test(page)) {
    fail("app/landscape/page.tsx must not link to a broad /tasks index");
  }

  if (/href=["']\/tasks\//.test(page)) {
    ensureTaskDiscoveryBoundary("landscape task links");
  }

  for (const unsafeLink of [
    'href="/landscape/sectors',
    'href="/zh-CN',
    'href="/api',
    'href="/admin',
    'href="/auth',
    'href="/scouted',
  ]) {
    if (page.includes(unsafeLink)) {
      fail(`app/landscape/page.tsx contains unsafe sector link: ${unsafeLink}`);
    }
  }
}

if (exists("lib/landscape/public-signal-landscape.ts")) {
  const helper = read("lib/landscape/public-signal-landscape.ts");
  for (const required of [
    "SectorDensityCandidate",
    "sectorDensity",
    "sectorCandidates",
    "reviewedSampleCount",
    "limited reviewed sample",
    "Open-source/commercial split is not shown until source-backed fields exist.",
  ]) {
    if (!helper.includes(required)) {
      fail(`lib/landscape/public-signal-landscape.ts missing: ${required}`);
    }
  }
}

const sectorContent = sourceFiles.map(read).join("\n");
const forbiddenCopy = [
  "global market count",
  "global sector count",
  "complete sector coverage",
  "total market size",
  "market size estimate",
  "fake density",
  "best sector",
  "top sector",
  "hottest sector",
  "highest roi",
  "investment opportunity",
  "investment score",
  "opportunity score",
  "guaranteed demand",
  "least competitive",
  "you should build here",
  "better than",
  "superior to",
  "sector ranking",
  "ranked sector",
  "startup advice",
  "financial advice",
];

for (const match of containsAny(sectorContent, forbiddenCopy)) {
  fail(`sector module contains forbidden claim phrase: ${match}`);
}

const forbiddenFields = [
  "founder_email",
  "founder email",
  "admin notes",
  "payment_state",
  "payment state",
  "api_key",
  "api key",
  "metering",
  "buyer_interest",
  "buyer interest",
  "private analytics",
  "raw database row",
  "raw payload",
  "supabase",
];

for (const match of containsAny(sectorContent, forbiddenFields)) {
  fail(`sector module contains forbidden field phrase: ${match}`);
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");

  if (
    sitemap.includes("`${baseUrl}/tasks`") ||
    sitemap.includes('" /tasks"') ||
    sitemap.includes("'/tasks'")
  ) {
    fail("app/sitemap.ts must not include a broad /tasks index");
  }

  if (sitemap.includes("/tasks/") || sitemap.includes("/tasks/${")) {
    ensureTaskDiscoveryBoundary("task sitemap entries");
  }

  for (const route of [
    "/admin",
    "/api",
    "/auth",
    "/scouted",
    "/api/alpha-feed/buyer-interest",
    "/api/alpha-feed/api-keys",
    "/api/payments",
    "checkout",
    "buyer-interest",
    "api-keys",
  ]) {
    if (sitemap.includes(route)) {
      fail(`app/sitemap.ts must not include unsafe route entry: ${route}`);
    }
  }

  for (const route of ["/landscape/sectors", "/zh-CN"]) {
    if (sitemap.includes(route)) {
      fail(`app/sitemap.ts must not include ${route}`);
    }
  }
}

try {
  const dataRepoStatus = execFileSync("git", ["status", "--short", "--branch"], {
    cwd: path.resolve(root, "../88cn-index-data"),
    encoding: "utf8",
  }).trim();
  const dirty = dataRepoStatus
    .split(/\r?\n/)
    .some((line) => line && !line.startsWith("## "));
  if (dirty) fail("../88cn-index-data must remain clean");
} catch (error) {
  fail(`could not inspect ../88cn-index-data: ${error.message}`);
}

if (failures.length > 0) {
  console.error("sector-density:check failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("sector-density:check passed");
