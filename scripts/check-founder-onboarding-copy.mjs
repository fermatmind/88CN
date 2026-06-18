import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "app/founding-slots/page.tsx",
  "components/founder/submission-onboarding-faq.tsx",
  "app/submit/page.tsx",
  "app/claim/[slug]/page.tsx",
  "app/founders/page.tsx",
  "docs/55_FOUNDER_SUBMISSION_ONBOARDING_V0.md",
];

const requiredPhrases = [
  "does not publish automatically",
  "correction",
  "removal",
  "public sources",
  "reviewed publication boundary",
  "outside public indexing",
];

const forbiddenPhrases = [
  ["dofollow", "backlink"].join(" "),
  ["301", "backlink"].join(" "),
  ["seo", "juice"].join(" "),
  ["guaranteed", "ranking"].join(" "),
  ["invest", "now"].join(" "),
  ["guaranteed", "return"].join(" "),
  ["guaranteed", "yield"].join(" "),
  ["principal", "protection"].join(" "),
  ["buy", "equ" + "ity"].join(" "),
  ["deposit", "funds"].join(" "),
  ["real-money", "commitment"].join(" "),
  ["ai", "citation", "guarantee"].join(" "),
  ["traffic", "guarantee"].join(" "),
];

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

const contents = requiredFiles
  .map((file) => [file, readRequired(file)])
  .map(([file, content]) => `${file}\n${content}`)
  .join("\n\n")
  .toLowerCase();

for (const phrase of requiredPhrases) {
  if (!contents.includes(phrase)) {
    throw new Error(`Missing required founder onboarding phrase: ${phrase}`);
  }
}

for (const phrase of forbiddenPhrases) {
  if (contents.includes(phrase)) {
    throw new Error(`Forbidden founder onboarding phrase found: ${phrase}`);
  }
}

const page = readRequired("app/founding-slots/page.tsx");
if (!page.includes("force-static")) {
  throw new Error("Founder onboarding page must be static.");
}

const component = readRequired("components/founder/submission-onboarding-faq.tsx");
if (component.includes("/api/") || component.includes("supabase")) {
  throw new Error("Founder onboarding component must not call APIs or Supabase.");
}

const submitPage = readRequired("app/submit/page.tsx");
const claimPage = readRequired("app/claim/[slug]/page.tsx");
const foundersPage = readRequired("app/founders/page.tsx");

for (const [name, content] of [
  ["submit", submitPage],
  ["claim", claimPage],
  ["founders", foundersPage],
]) {
  if (!content.includes("/founding-slots")) {
    throw new Error(`${name} page must link to /founding-slots.`);
  }
}

console.log("founder-onboarding:check passed");
