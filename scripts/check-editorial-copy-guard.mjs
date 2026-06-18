import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RULES_PATH = path.join(ROOT, "ops/copy/brand-voice-rules.json");
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createMatcher(phrase) {
  return new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(phrase)}(?![A-Za-z0-9])`, "i");
}

function hasNegatedContext(line, matchIndex) {
  const context = line.slice(Math.max(0, matchIndex - 90), matchIndex);
  return /\b(no|not|never|without|cannot|can't|does not|doesn't|do not|don't)\b/i.test(
    context
  );
}

function normalizeRule(rule) {
  return {
    id: rule.id,
    allowNegatedContext: Boolean(rule.allow_negated_context),
    matchers: (rule.phrases || []).map((phrase) => ({
      phrase,
      matcher: createMatcher(phrase),
    })),
  };
}

function findViolations(text, rules) {
  const violations = [];
  for (const rule of rules) {
    for (const { phrase, matcher } of rule.matchers) {
      const match = matcher.exec(text);
      if (!match) continue;
      if (rule.allowNegatedContext && hasNegatedContext(text, match.index)) continue;
      violations.push({ rule: rule.id, phrase });
    }
  }
  return violations;
}

if (!fs.existsSync(RULES_PATH)) {
  fail("brand voice rules file missing");
}

const config = fs.existsSync(RULES_PATH) ? readJson(RULES_PATH) : {};
const surfaces = config.extension_surfaces || [];
const requiredSurfaces = [
  "editorial_drafts",
  "scouted_profiles",
  "conversion_ctas",
  "claim_correct_remove",
];
const surfaceIds = new Set(surfaces.map((surface) => surface.id));

for (const id of requiredSurfaces) {
  if (!surfaceIds.has(id)) fail(`missing extension surface: ${id}`);
}

const rules = (config.restricted_public_claims || []).map(normalizeRule);
if (rules.length === 0) fail("restricted claim rules missing");

const extensionPositive = config.extension_positive_probes || [];
const extensionNegative = config.extension_negative_probes || [];

for (const id of requiredSurfaces) {
  if (!extensionPositive.some((probe) => probe.surface === id)) {
    fail(`missing positive probe for ${id}`);
  }
  if (!extensionNegative.some((probe) => probe.surface === id)) {
    fail(`missing negative probe for ${id}`);
  }
}

for (const probe of extensionPositive) {
  const violations = findViolations(probe.text, rules);
  if (violations.length > 0) {
    fail(`positive extension probe should pass for ${probe.surface}: ${violations[0].rule}`);
  }
}

for (const probe of extensionNegative) {
  const violations = findViolations(probe.text, rules);
  if (violations.length === 0) {
    fail(`negative extension probe should fail closed for ${probe.surface}`);
  }
}

const surfaceText = JSON.stringify(surfaces).toLowerCase();
for (const required of ["editorial", "scouted", "conversion", "claim", "correct", "remove"]) {
  if (!surfaceText.includes(required)) fail(`surface coverage missing ${required}`);
}

if (errors.length > 0) {
  console.error("editorial-copy:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("editorial-copy:check passed");
console.log(
  `Verified: ${surfaces.length} extension surfaces, ${extensionPositive.length} positive probes, ${extensionNegative.length} negative probes`
);
