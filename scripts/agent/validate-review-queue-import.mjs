#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dirFlagIndex = args.indexOf("--dir");
const artifactDir =
  dirFlagIndex >= 0 && args[dirFlagIndex + 1]
    ? args[dirFlagIndex + 1]
    : "fixtures/agent-integration";

const root = process.cwd();
const resolvedDir = path.resolve(root, artifactDir);
const errors = [];

const fileCandidates = {
  manifest: ["manifest.json", "sample-manifest.json"],
  reviewReady: ["review-ready.jsonl", "sample-review-ready.jsonl"],
  reviewBlocked: ["review-blocked.jsonl", "sample-review-blocked.jsonl"],
  quarantine: ["quarantine.jsonl", "sample-quarantine.jsonl"],
  recommendations: [
    "publish-recommendations.jsonl",
    "sample-publish-recommendations.jsonl",
  ],
};

const forbiddenPublicCandidateFields = new Set([
  "seed_hint",
  "identity_candidate",
  "canonical_candidate",
  "raw_audit",
  "raw_source_evidence",
  "review_notes",
  "quarantine_reason",
  "rejected_reason",
  "row_hash",
  "evidence_hash",
  "manifest_hash",
  "private_artifact_path",
  "internal_confidence",
  "canonical_ambiguity",
  "source_evidence_ids",
  "worker_job_payload",
  "lifecycle_status",
  "published_status",
]);

const forbiddenWriteIntentKeys = new Set([
  "published_projection_write",
  "published_projection_write_intent",
  "sitemap_target",
  "frontend_target",
  "public_api_target",
  "mcp_target",
  "supabase_write",
  "staging_db_write",
  "production_db_write",
  "db_write",
  "auto_publish",
]);

const requiredManifestFields = [
  "schema_version",
  "run_id",
  "generated_at",
  "worker_repo",
  "worker_repo_sha",
  "worker_task_range",
  "source_manifest_hash",
  "artifact_hashes",
  "counts",
  "mode",
  "network_used",
  "runtime_started",
  "db_write_performed",
  "auto_publish_performed",
];

const requiredReviewReadyFields = [
  "project_name",
  "slug_candidate",
  "official_website_url",
  "source_status",
  "canonical_status",
  "audit_status",
  "recommendation",
  "review_blockers",
  "source_links",
  "public_field_candidates",
  "worker_trace",
];

const requiredReviewBlockedFields = [
  "project_name",
  "slug_candidate",
  "blocker_codes",
  "source_stage",
  "observed_at",
  "human_unblock_required",
];

const requiredQuarantineFields = [
  "quarantine_id",
  "project_name",
  "reason_code",
  "severity",
  "source_stage",
  "observed_at",
  "retry_allowed",
  "human_review_required",
  "admin_only_details",
];

const requiredRecommendationFields = [
  "project_name",
  "slug_candidate",
  "recommendation",
  "reason_codes",
  "missing_fields",
  "risk_flags",
  "human_review_required",
  "recommendation_confidence_band",
];

const allowedRecommendations = new Set([
  "recommend_publish",
  "recommend_review",
  "recommend_quarantine",
  "recommend_reject",
  "recommend_recheck",
]);

const allowedReviewBlockers = new Set([
  "missing_official_source",
  "directory_hint_only",
  "canonical_ambiguous",
  "duplicate_conflict",
  "http_unreachable",
  "waf_or_blocked",
  "docs_missing",
  "github_mismatch",
  "copied_content_risk",
  "pii_or_private_data_risk",
  "manual_review_required",
]);

function fail(message) {
  errors.push(message);
}

function resolveRequiredFile(kind) {
  const candidates = fileCandidates[kind];
  const found = candidates.find((candidate) =>
    fs.existsSync(path.join(resolvedDir, candidate))
  );
  if (!found) {
    fail(`missing required artifact for ${kind}: ${candidates.join(" or ")}`);
    return undefined;
  }
  return path.join(resolvedDir, found);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${path.basename(filePath)} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function readJsonl(filePath) {
  const lines = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.flatMap((line, index) => {
    try {
      return [JSON.parse(line)];
    } catch (error) {
      fail(`${path.basename(filePath)}:${index + 1} invalid JSONL: ${error.message}`);
      return [];
    }
  });
}

function requireFields(label, record, fields) {
  for (const field of fields) {
    if (!(field in record)) {
      fail(`${label} missing required field ${field}`);
    }
  }
}

function scanForbiddenValues(label, value, pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      scanForbiddenValues(label, item, [...pathParts, String(index)])
    );
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value)) {
    const pathLabel = [...pathParts, key].join(".");

    if (forbiddenWriteIntentKeys.has(key)) {
      fail(`${label} contains forbidden write intent key ${pathLabel}`);
    }

    if (key === "lifecycle_status" && nested === "published") {
      fail(`${label} emits published lifecycle at ${pathLabel}`);
    }

    if (key === "target" && isForbiddenPublicTarget(nested)) {
      fail(`${label} targets forbidden public surface at ${pathLabel}`);
    }

    scanForbiddenValues(label, nested, [...pathParts, key]);
  }
}

function isForbiddenPublicTarget(value) {
  return (
    value === "published_projection" ||
    value === "sitemap" ||
    value === "frontend" ||
    value === "public_api" ||
    value === "mcp"
  );
}

function validateManifest(manifest) {
  requireFields("manifest", manifest, requiredManifestFields);

  if (!["dry_run", "review_packaging"].includes(manifest.mode)) {
    fail("manifest mode must be dry_run or review_packaging");
  }

  for (const field of [
    "network_used",
    "runtime_started",
    "db_write_performed",
    "auto_publish_performed",
  ]) {
    if (manifest[field] !== false) {
      fail(`manifest ${field} must be false`);
    }
  }

  if (manifest.worker_repo !== "88cn-scout-worker") {
    fail("manifest worker_repo must be 88cn-scout-worker");
  }
}

function validateReviewReady(records) {
  records.forEach((record, index) => {
    const label = `review-ready[${index}]`;
    requireFields(label, record, requiredReviewReadyFields);

    const candidates = record.public_field_candidates ?? {};
    for (const key of Object.keys(candidates)) {
      if (forbiddenPublicCandidateFields.has(key)) {
        fail(`${label}.public_field_candidates contains forbidden field ${key}`);
      }
    }

    if (record.original_summary_candidate && !record.review_blockers) {
      fail(`${label} original_summary_candidate must remain review-gated`);
    }
  });
}

function validateReviewBlocked(records) {
  records.forEach((record, index) => {
    const label = `review-blocked[${index}]`;
    requireFields(label, record, requiredReviewBlockedFields);
    if (record.human_unblock_required !== true) {
      fail(`${label} human_unblock_required must be true`);
    }
    for (const code of record.blocker_codes ?? []) {
      if (!allowedReviewBlockers.has(code)) {
        fail(`${label} has unsupported blocker code ${code}`);
      }
    }
  });
}

function validateQuarantine(records) {
  records.forEach((record, index) => {
    const label = `quarantine[${index}]`;
    requireFields(label, record, requiredQuarantineFields);
    if (record.human_review_required !== true) {
      fail(`${label} human_review_required must be true`);
    }
    if (!record.admin_only_details) {
      fail(`${label} admin_only_details is required`);
    }
  });
}

function validateRecommendations(records) {
  records.forEach((record, index) => {
    const label = `publish-recommendations[${index}]`;
    requireFields(label, record, requiredRecommendationFields);
    if (!allowedRecommendations.has(record.recommendation)) {
      fail(`${label} has unsupported recommendation ${record.recommendation}`);
    }
    if (record.human_review_required !== true) {
      fail(`${label} human_review_required must be true`);
    }
    if (typeof record.recommendation_confidence === "number") {
      fail(`${label} must not emit absolute confidence score`);
    }
  });
}

if (!fs.existsSync(resolvedDir)) {
  fail(`artifact directory not found: ${resolvedDir}`);
}

const manifestPath = resolveRequiredFile("manifest");
const reviewReadyPath = resolveRequiredFile("reviewReady");
const reviewBlockedPath = resolveRequiredFile("reviewBlocked");
const quarantinePath = resolveRequiredFile("quarantine");
const recommendationsPath = resolveRequiredFile("recommendations");

const manifest = manifestPath ? readJson(manifestPath) : undefined;
const reviewReady = reviewReadyPath ? readJsonl(reviewReadyPath) : [];
const reviewBlocked = reviewBlockedPath ? readJsonl(reviewBlockedPath) : [];
const quarantine = quarantinePath ? readJsonl(quarantinePath) : [];
const recommendations = recommendationsPath ? readJsonl(recommendationsPath) : [];

if (manifest) {
  validateManifest(manifest);
  const counts = manifest.counts ?? {};
  if (counts.review_ready_count !== reviewReady.length) {
    fail("manifest review_ready_count does not match review-ready records");
  }
  if (counts.review_blocked_count !== reviewBlocked.length) {
    fail("manifest review_blocked_count does not match review-blocked records");
  }
  if (counts.quarantine_count !== quarantine.length) {
    fail("manifest quarantine_count does not match quarantine records");
  }
  if (counts.publish_recommendation_count !== recommendations.length) {
    fail(
      "manifest publish_recommendation_count does not match recommendation records"
    );
  }
}

validateReviewReady(reviewReady);
validateReviewBlocked(reviewBlocked);
validateQuarantine(quarantine);
validateRecommendations(recommendations);

for (const [label, records] of [
  ["manifest", manifest ? [manifest] : []],
  ["review-ready", reviewReady],
  ["review-blocked", reviewBlocked],
  ["quarantine", quarantine],
  ["publish-recommendations", recommendations],
]) {
  scanForbiddenValues(label, records);
}

if (errors.length > 0) {
  console.error("review-queue-import validation failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      result: "review_queue_import_contract_valid",
      artifact_dir: path.relative(root, resolvedDir),
      review_ready_count: reviewReady.length,
      review_blocked_count: reviewBlocked.length,
      quarantine_count: quarantine.length,
      publish_recommendation_count: recommendations.length,
      runtime_started: false,
      db_write_performed: false,
      auto_publish_performed: false,
    },
    null,
    2
  )
);
