import { getAdminClient } from "@/lib/supabase/admin-server";
import { readIndexData, type ProjectEntry } from "./source";
import type { IndexDataSyncResult } from "./types";
import {
  addClassificationToSummary,
  createImportQuarantineSummary,
  type QuarantineReasonCode,
} from "./import-summary";
import { classifyIndexProject, type ImportClassificationResult } from "./quarantine";

interface ExistingImportRow {
  id: string;
  import_fingerprint: string | null;
  import_payload: unknown;
}

function getPayloadSlug(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }
  const slug = (payload as Record<string, unknown>).slug;
  return typeof slug === "string" ? slug : null;
}

function createStoredQuarantinePayload(entry: ProjectEntry, classification: ImportClassificationResult) {
  return {
    source_path: entry.path,
    status: classification.status,
    reasons: classification.reasonCodes,
    slug: classification.slug ?? null,
  };
}

function getPrimaryReason(reasonCodes: readonly QuarantineReasonCode[]): QuarantineReasonCode | null {
  return reasonCodes[0] ?? null;
}

export async function syncExternalImports(
  sourceMode: "local" | "github",
  dryRun: boolean
): Promise<IndexDataSyncResult> {
  const result: IndexDataSyncResult = {
    source: sourceMode,
    commit: null,
    total_seen: 0,
    valid_count: 0,
    invalid_count: 0,
    inserted_count: 0,
    skipped_count: 0,
    failed_count: 0,
    errors: [],
    dry_run: dryRun,
    quarantine_summary: createImportQuarantineSummary(),
  };

  // 1. Read projects from source
  let entries: ProjectEntry[];
  try {
    const data = await readIndexData(sourceMode);
    entries = data.entries;
    result.commit = data.commit;
  } catch (e) {
    result.errors.push(`Failed to read index data: ${e instanceof Error ? e.message : "unknown error"}`);
    return result;
  }

  result.total_seen = entries.length;

  const sourceRepo = sourceMode === "github"
    ? `${process.env.INDEX_DATA_GITHUB_OWNER || "fermatmind"}/${process.env.INDEX_DATA_GITHUB_REPO || "88cn-index-data"}`
    : "local";

  const existingSlugs = new Set<string>();
  const existingFingerprints = new Set<string>();
  const client = dryRun ? null : getAdminClient();

  if (!dryRun && !client) {
    result.errors.push("Supabase admin client not configured");
  }

  if (client) {
    const { data: existingImports, error } = await client
      .from("external_project_imports")
      .select("id, import_fingerprint, import_payload")
      .limit(5000);

    if (error) {
      result.errors.push(`Failed to read existing imports: ${error.message}`);
    } else {
      for (const row of (existingImports ?? []) as ExistingImportRow[]) {
        if (row.import_fingerprint) existingFingerprints.add(row.import_fingerprint);
        const slug = getPayloadSlug(row.import_payload);
        if (slug) existingSlugs.add(slug);
      }
    }
  }

  const classifications: { entry: ProjectEntry; classification: ImportClassificationResult }[] = [];
  const batchSlugs = new Set<string>();
  const batchFingerprints = new Set<string>();

  for (const entry of entries) {
    const classification = classifyIndexProject({
      project: entry.project,
      sourcePath: entry.path,
      sourceRepo,
      sourceCommit: result.commit,
      existingSlugs,
      existingFingerprints,
    });

    if (classification.status === "accepted" && classification.slug && classification.fingerprint) {
      if (batchFingerprints.has(classification.fingerprint)) {
        const duplicateClassification: ImportClassificationResult = {
          ...classification,
          status: "duplicate",
          reasonCodes: ["duplicate_fingerprint"],
          details: {
            ...classification.details,
            issue: "import fingerprint already exists in current batch",
          },
        };
        classifications.push({ entry, classification: duplicateClassification });
        addClassificationToSummary(
          result.quarantine_summary,
          duplicateClassification.status,
          duplicateClassification.reasonCodes
        );
        result.skipped_count++;
        continue;
      }
      if (batchSlugs.has(classification.slug)) {
        const duplicateClassification: ImportClassificationResult = {
          ...classification,
          status: "duplicate",
          reasonCodes: ["duplicate_slug"],
          details: {
            ...classification.details,
            issue: "project slug already exists in current batch",
          },
        };
        classifications.push({ entry, classification: duplicateClassification });
        addClassificationToSummary(
          result.quarantine_summary,
          duplicateClassification.status,
          duplicateClassification.reasonCodes
        );
        result.skipped_count++;
        continue;
      }
      batchSlugs.add(classification.slug);
      batchFingerprints.add(classification.fingerprint);
    }

    classifications.push({ entry, classification });
    addClassificationToSummary(
      result.quarantine_summary,
      classification.status,
      classification.reasonCodes
    );

    if (classification.status === "accepted") result.valid_count++;
    if (classification.status === "quarantined" || classification.status === "rejected") result.invalid_count++;
    if (classification.status === "duplicate") result.skipped_count++;
  }

  if (dryRun || !client) {
    return result;
  }

  // 3. Insert accepted/quarantined records into external_project_imports only.
  for (const { entry, classification } of classifications) {
    if (classification.status === "duplicate" || classification.status === "rejected") {
      continue;
    }

    try {
      const { error: insertError } = await client
        .from("external_project_imports")
        .insert({
          source_name: sourceRepo,
          source_url: entry.path,
          import_payload: classification.normalized ?? createStoredQuarantinePayload(entry, classification),
          import_fingerprint: classification.fingerprint ?? null,
          status: classification.status === "accepted" ? "pending_review" : "quarantined",
          quarantine_reason_code: getPrimaryReason(classification.reasonCodes),
          quarantine_details: classification.details,
          last_imported_at: new Date().toISOString(),
        });

      if (insertError) {
        result.failed_count++;
        result.errors.push(`${entry.path}: insert failed: ${insertError.message}`);
      } else {
        result.inserted_count++;
      }
    } catch (e) {
      result.failed_count++;
      result.errors.push(`${entry.path}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }

  return result;
}
