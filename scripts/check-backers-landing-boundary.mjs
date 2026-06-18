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

function fail(message) {
  failures.push(message);
}

const requiredFiles = [
  "app/backers/page.tsx",
  "components/backers/AlphaDataFeedLanding.tsx",
  "lib/seo/backers.ts",
  "docs/61_BACKERS_ALPHA_DATA_FEED_LANDING_V0.md",
];

requiredFiles.forEach((file) => {
  if (!exists(file)) fail(`${file} is missing`);
});

const contentFiles = [
  ...walk("app/backers"),
  ...walk("components/backers"),
  ...walk("lib/seo"),
  "docs/61_BACKERS_ALPHA_DATA_FEED_LANDING_V0.md",
].filter((file) => exists(file));

const combined = contentFiles.map((file) => read(file)).join("\n").toLowerCase();

for (const phrase of [
  "future data feed interest",
  "read-only signal snapshots",
  "public project metadata",
  "aggregate public signals",
  "research-oriented",
  "no private backer data collection",
  "no payment or commitment flow",
]) {
  if (!combined.includes(phrase)) fail(`missing required boundary phrase: ${phrase}`);
}

const blockedTerms = [
  ["invest", "now"].join(" "),
  ["guaranteed", "return"].join(" "),
  ["guaranteed", "yield"].join(" "),
  ["fixed", "return"].join(" "),
  ["passive", "income"].join(" "),
  ["financial", "advice"].join(" "),
  ["buy", "allocation"].join(" "),
  ["roi", "guarantee"].join(" "),
  ["fu", "nd"].join(""),
  ["sp", "v"].join(""),
  ["equ", "ity"].join(""),
  ["tok", "en"].join(""),
  ["secur", "ities"].join(""),
];

for (const file of contentFiles) {
  const lower = read(file).toLowerCase();
  for (const term of blockedTerms) {
    if (lower.includes(term)) {
      fail(`${file} contains restricted backers landing wording: ${term}`);
    }
  }
  for (const term of ["<form", "<input", "textarea", "app/api", "supabase"]) {
    if (lower.includes(term)) {
      fail(`${file} contains collection or API behavior: ${term}`);
    }
  }
}

if (exists("app/backers/page.tsx")) {
  const page = read("app/backers/page.tsx");
  if (!page.includes("force-static")) fail("backers page must be static");
  if (!page.includes("robots: { index: true, follow: true }")) {
    fail("backers page must declare intentional indexability");
  }
}

const forbiddenDiff = execFileSync(
  "git",
  [
    "diff",
    "--name-only",
    "HEAD",
    "--",
    "app/api",
    "lib/payments",
    "lib/public-api",
    "lib/mcp",
    "supabase",
    "deploy",
    "app/sitemap.ts",
  ],
  { cwd: root, encoding: "utf8" }
).trim();

if (forbiddenDiff) {
  fail(`PR54 must not modify forbidden runtime surfaces: ${forbiddenDiff}`);
}

if (failures.length > 0) {
  console.error("backers-landing:check failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("backers-landing:check passed");
