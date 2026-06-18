import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const failures = [];

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function read(file) {
  return fs.readFileSync(repoPath(file), "utf8");
}

function exists(file) {
  return fs.existsSync(repoPath(file));
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

function assertFile(file) {
  if (!exists(file)) fail(`${file} is missing`);
}

const requiredFiles = [
  "components/featured/FeaturedVerifiedSignals.tsx",
  "components/featured/FeaturedSignalCard.tsx",
  "components/featured/FeaturedPlacementLabel.tsx",
  "lib/featured/flags.ts",
  "lib/featured/eligibility.ts",
  "lib/featured/featured-signals.ts",
  "app/admin/featured-signals/page.tsx",
];

requiredFiles.forEach(assertFile);

if (exists("lib/featured/flags.ts")) {
  const flags = read("lib/featured/flags.ts");
  if (!flags.includes("FEATURED_SIGNALS_ENABLED")) {
    fail("FEATURED_SIGNALS_ENABLED flag is missing");
  }
  if (!flags.includes('=== "true"')) {
    fail("featured signals flag must default closed and only enable on explicit true");
  }
  if (flags.includes("NEXT_PUBLIC")) {
    fail("featured signals flag must stay server-side");
  }
}

if (exists("lib/featured/eligibility.ts")) {
  const eligibility = read("lib/featured/eligibility.ts");
  for (const status of ["published", "claimed", "owner_verified"]) {
    if (!eligibility.includes(status)) {
      fail(`eligible status ${status} is missing`);
    }
  }
  for (const status of ["submitted", "pending_review", "quarantined", "rejected", "archived"]) {
    if (!eligibility.includes(status)) {
      fail(`blocked status ${status} is missing`);
    }
  }
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["featured-signals:check"] !== "node scripts/check-featured-signals-boundary.mjs") {
  fail("package.json missing featured-signals:check script");
}

const forbiddenImportRoots = [
  "app/sitemap.ts",
  ...walk("app/api"),
  ...walk("lib").filter((file) => {
    if (file.startsWith("lib/featured/")) return false;
    return /(score|source-confidence|public-api|mcp)/i.test(file);
  }),
];

for (const file of forbiddenImportRoots) {
  if (exists(file) && read(file).includes("@/lib/featured")) {
    fail(`${file} must not import featured signals`);
  }
}

const featuredFiles = [
  ...walk("components/featured"),
  ...walk("lib/featured"),
  ...walk("app/admin/featured-signals"),
];

for (const file of featuredFiles) {
  const content = read(file);
  const importLines = content
    .split(/\r?\n/)
    .filter((line) => /^\s*import\b/.test(line));
  if (importLines.some((line) => /stripe|checkout|billing|payment/i.test(line))) {
    fail(`${file} must not import payment or checkout modules`);
  }
}

const copyTerms = [
  ["do", "follow"].join(""),
  ["back", "link"].join(""),
  ["SEO", " ", "juice"].join(""),
  ["guaranteed", " ", "ranking"].join(""),
  ["traffic", " ", "promise"].join(""),
  ["AI", " ", "citation", " ", "guarantee"].join(""),
  ["paid", " ", "link"].join(""),
  ["rank", " ", "boost"].join(""),
  ["traffic", " ", "boost"].join(""),
];

for (const file of featuredFiles) {
  const content = read(file);
  for (const term of copyTerms) {
    if (new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(content)) {
      fail(`${file} contains blocked featured-surface wording: ${term}`);
    }
  }
}

for (const file of walk("components/featured")) {
  const content = read(file);
  if (content.includes('target="_blank"')) {
    const hasRequiredRel =
      content.includes('rel="sponsored noopener noreferrer"') ||
      content.includes("rel='sponsored noopener noreferrer'");
    if (!hasRequiredRel) {
      fail(`${file} external featured links must use sponsored noopener noreferrer`);
    }
  }
}

const sitemapDiff = execFileSync("git", ["diff", "--name-only", "HEAD", "--", "app/sitemap.ts"], {
  cwd: root,
  encoding: "utf8",
}).trim();
if (sitemapDiff) {
  fail("app/sitemap.ts must not change for featured signals");
}

if (failures.length > 0) {
  console.error("featured-signals:check failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("featured-signals:check passed");
