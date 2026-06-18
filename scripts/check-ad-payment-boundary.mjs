import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const ignoredDirs = new Set([".git", ".next", "node_modules", "coverage", "dist", "build"]);
const scannedExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".md", ".json"]);

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function exists(file) {
  return fs.existsSync(repoPath(file));
}

function readAbsolute(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function read(file) {
  return readAbsolute(repoPath(file));
}

function fail(message) {
  failures.push(message);
}

function walkAbsolute(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) return [];
      return walkAbsolute(fullPath);
    }
    if (!entry.isFile()) return [];
    return scannedExtensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function toLabel(filePath) {
  if (filePath.startsWith(root)) {
    return path.relative(root, filePath).split(path.sep).join("/");
  }
  return filePath;
}

function allRepoFiles() {
  return walkAbsolute(root);
}

function filesUnder(relativeDir) {
  return walkAbsolute(repoPath(relativeDir));
}

function extraFixtureFiles() {
  const roots = (process.env.PAYMENT_BOUNDARY_EXTRA_SCAN_ROOTS ?? "")
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
  return roots.flatMap((fixtureRoot) => walkAbsolute(fixtureRoot));
}

function includesAny(content, terms) {
  return terms.find((term) => content.includes(term));
}

const helperFile = "lib/payments/feature-flags.ts";
const checkoutRoute = "app/api/payments/featured-signals/checkout/route.ts";
const typesFile = "lib/payments/featured-signals/types.ts";
const packageJson = JSON.parse(read("package.json"));

for (const file of [helperFile, checkoutRoute, typesFile]) {
  if (!exists(file)) fail(`${file} is missing`);
}

if (exists(helperFile)) {
  const helper = read(helperFile);
  for (const flag of [
    "AD_PAYMENTS_ENABLED",
    "STRIPE_CHECKOUT_ENABLED",
    "FEATURED_SIGNAL_CHECKOUT_ENABLED",
  ]) {
    if (!helper.includes(flag)) fail(`${flag} is missing from feature flag helper`);
  }
  for (const fn of [
    "isAdPaymentsEnabled",
    "isStripeCheckoutEnabled",
    "isFeaturedSignalCheckoutEnabled",
    "isFeaturedSignalCommercialFlowEnabled",
  ]) {
    if (!helper.includes(`function ${fn}`)) fail(`${fn} is missing`);
  }
  if (!helper.includes('process.env[name] === "true"')) {
    fail("payment flags must default false and only enable on explicit true");
  }
  if (/NEXT_PUBLIC/i.test(helper)) {
    fail("payment feature flags must not be client-exposed");
  }
}

if (exists(checkoutRoute)) {
  const route = read(checkoutRoute);
  if (!route.includes("commercial-flow-disabled")) {
    fail("disabled checkout route must return commercial-flow-disabled problem");
  }
  if (!route.includes("status: 503")) {
    fail("disabled checkout route must return 503");
  }
  if (!route.includes("errorResponse")) {
    fail("disabled checkout route must use the existing error response helper");
  }
  if (/from\s+["']stripe["']|@stripe\//i.test(route)) {
    fail("checkout route must not import Stripe SDK");
  }
}

if (exists(typesFile)) {
  const types = read(typesFile);
  for (const state of [
    "commercial_disabled",
    "checkout_disabled",
    "checkout_requested",
    "payment_pending",
    "paid_pending_admin_review",
    "admin_approved_for_display",
    "admin_rejected",
    "refunded",
    "cancelled",
  ]) {
    if (!types.includes(state)) fail(`commercial state ${state} is missing`);
  }
  if (!types.includes('PAYMENT_SUCCESS_NEXT_STATE') || !types.includes('"paid_pending_admin_review"')) {
    fail("payment success must resolve only to paid_pending_admin_review in v0");
  }
}

if (
  packageJson.scripts?.["ad-payment-boundary:check"] !==
  "node scripts/check-ad-payment-boundary.mjs"
) {
  fail("package.json missing ad-payment-boundary:check script");
}

if (packageJson.scripts?.["ad-payment:check"] !== "npm run ad-payment-boundary:check") {
  fail("package.json missing ad-payment:check compatibility script");
}

if (packageJson.dependencies?.stripe || packageJson.devDependencies?.stripe) {
  fail("package.json must not add a stripe dependency");
}

const dangerousSessionCreate = ["stripe", ".", "checkout", ".", "sessions", ".", "create"].join("");
const dangerousConstructor = ["new", " ", "Stripe", "("].join("");
const secretName = ["STRIPE", "_", "SECRET", "_", "KEY"].join("");
const webhookTerms = [
  ["construct", "Event"].join(""),
  ["payment", "_", "intent", ".", "succeeded"].join(""),
  ["checkout", ".", "session", ".", "completed"].join(""),
];
const automaticActivationTerms = [
  ["activate", "Featured", "Signal", "Campaign"].join(""),
  ["set", "Featured", "Signal", "Active"].join(""),
  ["featured", "_", "signal", "_", "active", " = true"].join(""),
];
const projectMutationTerms = [
  "status: \"published\"",
  "status = 'published'",
  "publication_status",
  "setProjectPublished",
];

const repoFiles = allRepoFiles();
const runtimePaymentFiles = [
  ...filesUnder("lib/payments"),
  ...filesUnder("app/api/payments"),
  ...filesUnder("app/admin/featured-signals/orders"),
];
const fixtureFiles = extraFixtureFiles();
const globalScanFiles = [...repoFiles, ...fixtureFiles];

for (const filePath of globalScanFiles) {
  const content = readAbsolute(filePath);
  const label = toLabel(filePath);
  for (const term of [dangerousSessionCreate, dangerousConstructor]) {
    if (content.includes(term)) fail(`${label} contains live Stripe checkout code`);
  }
}

for (const filePath of [...runtimePaymentFiles, ...fixtureFiles]) {
  const content = readAbsolute(filePath);
  const label = toLabel(filePath);
  const webhookTerm = includesAny(content, webhookTerms);
  if (webhookTerm) fail(`${label} contains webhook handling code: ${webhookTerm}`);
  const activationTerm = includesAny(content, automaticActivationTerms);
  if (activationTerm) fail(`${label} contains automatic featured activation code`);
}

for (const filePath of [...runtimePaymentFiles, ...fixtureFiles]) {
  const content = readAbsolute(filePath);
  const label = toLabel(filePath);
  if (content.includes(secretName)) {
    fail(`${label} must not require Stripe secret env in runtime payment code`);
  }
  const mutationTerm = includesAny(content, projectMutationTerms);
  if (mutationTerm) {
    fail(`${label} must not mutate project publication status: ${mutationTerm}`);
  }
  const forbiddenImport = [
    "@/app/sitemap",
    "@/lib/public-api",
    "@/lib/mcp",
    "@/lib/score",
    "@/lib/source-confidence",
  ].find((term) => content.includes(term));
  if (forbiddenImport) {
    fail(`${label} imports forbidden machine-layer code: ${forbiddenImport}`);
  }
}

const copyScanFiles = [
  ...runtimePaymentFiles,
  repoPath("docs/58_AD_PAYMENT_FEATURE_FLAG_STRIPE_CHECKOUT_V0.md"),
  ...fixtureFiles,
].filter((filePath) => fs.existsSync(filePath));

const restrictedCopyTerms = [
  ["do", "follow"].join(""),
  ["back", "link"].join(""),
  ["SEO", " ", "juice"].join(""),
  ["guaranteed"].join(""),
  ["ranking", " ", "guarantee"].join(""),
  ["traffic", " ", "promise"].join(""),
  ["AI", " ", "citation", " ", "guarantee"].join(""),
  ["boost", " ", "ranking"].join(""),
  ["boost", " ", "traffic"].join(""),
];

for (const filePath of copyScanFiles) {
  const content = readAbsolute(filePath);
  const label = toLabel(filePath);
  for (const term of restrictedCopyTerms) {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (pattern.test(content)) {
      fail(`${label} contains restricted commercial copy: ${term}`);
    }
  }
}

if (failures.length > 0) {
  console.error("ad-payment-boundary:check failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("ad-payment-boundary:check passed");
