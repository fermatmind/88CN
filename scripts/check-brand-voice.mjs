import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RULES_PATH = "ops/copy/brand-voice-rules.json";
const errors = [];

function fail(message) {
  errors.push(message);
}

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function toRepoPath(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createMatcher(phrase) {
  const escaped = escapeRegExp(phrase);
  return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, "gi");
}

function hasNegatedContext(line, matchIndex) {
  const context = line.slice(Math.max(0, matchIndex - 90), matchIndex);
  return /\b(no|not|never|without|cannot|can't|does not|doesn't|do not|don't)\b/i.test(
    context
  );
}

function walk(dir, extensions, ignoredPrefixes) {
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) return [];

  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(fullDir, entry.name);
    const repoPath = toRepoPath(fullPath);

    if (ignoredPrefixes.some((prefix) => repoPath.startsWith(prefix))) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...walk(repoPath, extensions, ignoredPrefixes));
      continue;
    }

    if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
      files.push(repoPath);
    }
  }

  return files;
}

function normalizeRule(rule) {
  return {
    id: rule.id,
    severity: rule.severity,
    allowNegatedContext: Boolean(rule.allow_negated_context),
    matchers: (rule.phrases || []).map((phrase) => ({
      phrase,
      matcher: createMatcher(phrase),
    })),
  };
}

function findViolationsInText(content, fileLabel, rules) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of rules) {
      for (const { phrase, matcher } of rule.matchers) {
        matcher.lastIndex = 0;
        let match;
        while ((match = matcher.exec(line)) !== null) {
          if (rule.allowNegatedContext && hasNegatedContext(line, match.index)) {
            continue;
          }
          violations.push({
            file: fileLabel,
            line: index + 1,
            rule: rule.id,
            severity: rule.severity,
            phrase,
          });
        }
      }
    }
  });

  return violations;
}

function validateRulesShape(rules) {
  if (rules.version !== 1) fail("brand rules version must be 1");
  if (!Array.isArray(rules.public_surface_roots) || rules.public_surface_roots.length === 0) {
    fail("public_surface_roots must be a non-empty array");
  }
  if (
    !Array.isArray(rules.public_surface_extensions) ||
    rules.public_surface_extensions.length === 0
  ) {
    fail("public_surface_extensions must be a non-empty array");
  }
  if (!Array.isArray(rules.restricted_public_claims)) {
    fail("restricted_public_claims must be an array");
  }
  if (!Array.isArray(rules.positive_probes) || rules.positive_probes.length === 0) {
    fail("positive_probes must be a non-empty array");
  }
  if (!Array.isArray(rules.negative_probes) || rules.negative_probes.length === 0) {
    fail("negative_probes must be a non-empty array");
  }

  for (const rule of rules.restricted_public_claims || []) {
    if (!rule.id) fail("restricted claim rule missing id");
    if (!rule.severity) fail(`restricted claim rule ${rule.id || "<missing>"} missing severity`);
    if (!Array.isArray(rule.phrases) || rule.phrases.length === 0) {
      fail(`restricted claim rule ${rule.id || "<missing>"} missing phrases`);
    }
  }
}

if (!fs.existsSync(path.join(ROOT, RULES_PATH))) {
  fail(`Missing brand voice rules: ${RULES_PATH}`);
}

const rulesConfig = fs.existsSync(path.join(ROOT, RULES_PATH))
  ? readJson(RULES_PATH)
  : {};

validateRulesShape(rulesConfig);

const rules = (rulesConfig.restricted_public_claims || []).map(normalizeRule);

for (const probe of rulesConfig.positive_probes || []) {
  const violations = findViolationsInText(probe, "positive_probe", rules);
  if (violations.length > 0) {
    fail(`positive probe should pass but matched ${violations[0].rule}: ${probe}`);
  }
}

for (const probe of rulesConfig.negative_probes || []) {
  const violations = findViolationsInText(probe, "negative_probe", rules);
  if (violations.length === 0) {
    fail(`negative probe should fail closed: ${probe}`);
  }
}

const files = (rulesConfig.public_surface_roots || []).flatMap((root) =>
  walk(
    root,
    rulesConfig.public_surface_extensions || [],
    rulesConfig.ignored_path_prefixes || []
  )
);

const sourceViolations = files.flatMap((file) =>
  findViolationsInText(readText(file), file, rules)
);

if (sourceViolations.length > 0) {
  fail("restricted public copy claims found in public source files:");
  for (const violation of sourceViolations) {
    fail(
      `- ${violation.file}:${violation.line} [${violation.severity}/${violation.rule}] matched "${violation.phrase}"`
    );
  }
}

if (errors.length > 0) {
  console.error("brand-voice:check failed");
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log("brand-voice:check passed");
console.log(
  `Verified: ${rules.length} restricted claim groups, ${files.length} public source files, ${rulesConfig.positive_probes.length} positive probes, ${rulesConfig.negative_probes.length} negative probes`
);
