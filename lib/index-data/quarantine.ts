import { checkForbiddenFields } from "./forbidden-fields";
import { computeImportFingerprint, normalizeProject, type NormalizedImportPayload } from "./normalize";
import { validateIndexProject, type ValidationError } from "./validate";
import type { IndexDataProject } from "./types";
import type { ImportClassificationStatus, QuarantineReasonCode } from "./import-summary";

export interface ImportClassificationInput {
  project: unknown;
  sourcePath: string;
  sourceRepo: string;
  sourceCommit: string | null;
  existingSlugs?: ReadonlySet<string>;
  existingFingerprints?: ReadonlySet<string>;
  allowedSourceRepo?: string;
}

export interface SanitizedQuarantineDetail {
  source_path: string;
  issue: string;
  fields?: string[];
}

export interface ImportClassificationResult {
  status: ImportClassificationStatus;
  reasonCodes: QuarantineReasonCode[];
  details: SanitizedQuarantineDetail;
  normalized?: NormalizedImportPayload;
  slug?: string;
  fingerprint?: string;
}

const SAFE_FIELD_NAMES = new Set([
  "schema_version",
  "name",
  "slug",
  "website_url",
  "category_slug",
  "one_liner",
  "description",
  "github_url",
  "docs_url",
  "pricing_url",
  "product_hunt_url",
  "hacker_news_url",
  "founder_public_url",
  "launch_url",
  "tags",
  "tech_stack",
  "source_type",
  "region",
  "language",
  "public_sources",
]);

const CONTACT_LIKE_VALUE = /[^\s@]+@[^\s@]+\.[^\s@]+|\+?\d[\d\s().-]{7,}\d/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringField(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) return undefined;
  const fieldValue = value[key];
  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function hasContactLikeValue(value: unknown): boolean {
  if (typeof value === "string") return CONTACT_LIKE_VALUE.test(value);
  if (Array.isArray(value)) return value.some(hasContactLikeValue);
  if (isRecord(value)) return Object.values(value).some(hasContactLikeValue);
  return false;
}

function collectUnknownFields(value: unknown): string[] {
  if (!isRecord(value)) return [];
  return Object.keys(value)
    .filter((key) => !SAFE_FIELD_NAMES.has(key))
    .sort();
}

function mapValidationReasons(errors: readonly ValidationError[]): QuarantineReasonCode[] {
  const reasons = new Set<QuarantineReasonCode>();

  for (const error of errors) {
    if (error.field?.includes("url")) {
      reasons.add("invalid_url");
    } else if (error.field === "category_slug") {
      reasons.add("invalid_category");
    } else if (error.field === "public_sources") {
      reasons.add("source_not_allowed");
    } else {
      reasons.add("malformed_payload");
    }
  }

  return [...reasons];
}

function result(
  status: ImportClassificationStatus,
  sourcePath: string,
  issue: string,
  reasonCodes: QuarantineReasonCode[],
  extras: Partial<ImportClassificationResult> = {},
  fields?: string[]
): ImportClassificationResult {
  return {
    status,
    reasonCodes,
    details: {
      source_path: sourcePath,
      issue,
      ...(fields?.length ? { fields } : {}),
    },
    ...extras,
  };
}

export function classifyIndexProject(
  input: ImportClassificationInput
): ImportClassificationResult {
  try {
    const {
      project,
      sourcePath,
      sourceRepo,
      sourceCommit,
      existingSlugs = new Set<string>(),
      existingFingerprints = new Set<string>(),
      allowedSourceRepo,
    } = input;

    if (allowedSourceRepo && sourceRepo !== allowedSourceRepo) {
      return result("quarantined", sourcePath, "source repo is not allowed", ["source_not_allowed"]);
    }

    if (!isRecord(project)) {
      return result("rejected", sourcePath, "payload is not a project object", ["malformed_payload"]);
    }

    const forbiddenField = checkForbiddenFields(project, sourcePath);
    if (forbiddenField) {
      return result("quarantined", sourcePath, "blocked field present", ["forbidden_field"]);
    }

    const unknownFields = collectUnknownFields(project);
    if (unknownFields.length > 0) {
      return result(
        "quarantined",
        sourcePath,
        "unknown fields present",
        ["malformed_payload"],
        {},
        unknownFields.slice(0, 8)
      );
    }

    if (hasContactLikeValue(project)) {
      return result("quarantined", sourcePath, "private contact-like value present", ["privacy_risk"]);
    }

    const typedProject = project as unknown as IndexDataProject;
    const validationErrors = validateIndexProject(typedProject, sourcePath);
    if (validationErrors.length > 0) {
      const reasons = mapValidationReasons(validationErrors);
      const missingCore = validationErrors.some((error) =>
        ["schema_version", "name", "slug"].includes(error.field ?? "")
      );

      return result(
        missingCore ? "rejected" : "quarantined",
        sourcePath,
        "project structure failed validation",
        reasons,
        { slug: getStringField(project, "slug") }
      );
    }

    const normalized = normalizeProject(typedProject);
    const fingerprint = computeImportFingerprint(sourceRepo, sourcePath, sourceCommit, typedProject);

    if (existingFingerprints.has(fingerprint)) {
      return result(
        "duplicate",
        sourcePath,
        "import fingerprint already exists",
        ["duplicate_fingerprint"],
        { slug: normalized.slug, fingerprint }
      );
    }

    if (existingSlugs.has(normalized.slug)) {
      return result(
        "duplicate",
        sourcePath,
        "project slug already exists",
        ["duplicate_slug"],
        { slug: normalized.slug, fingerprint }
      );
    }

    return result("accepted", sourcePath, "ready for admin staging", [], {
      normalized,
      slug: normalized.slug,
      fingerprint,
    });
  } catch {
    return result(
      "rejected",
      input.sourcePath,
      "classification failed safely",
      ["malformed_payload"]
    );
  }
}
