import { getAdminClient } from "@/lib/supabase/admin-server";
import { validateIndexProject } from "./validate";
import { normalizeProject, computeImportFingerprint } from "./normalize";
import { readIndexData, type ProjectEntry } from "./source";
import type { IndexDataSyncResult } from "./types";

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

  // 2. Validate
  const valid: ProjectEntry[] = [];
  for (const entry of entries) {
    const validationErrors = validateIndexProject(entry.project, entry.path);
    if (validationErrors.length > 0) {
      result.invalid_count++;
      for (const ve of validationErrors) {
        result.errors.push(`${entry.path}: ${ve.field}: ${ve.message}`);
      }
    } else {
      valid.push(entry);
      result.valid_count++;
    }
  }

  if (dryRun || valid.length === 0) {
    return result;
  }

  // 3. Insert into external_project_imports
  const client = getAdminClient();
  if (!client) {
    result.errors.push("Supabase admin client not configured");
    return result;
  }

  const sourceRepo = sourceMode === "github"
    ? `${process.env.INDEX_DATA_GITHUB_OWNER || "fermatmind"}/${process.env.INDEX_DATA_GITHUB_REPO || "88cn-index-data"}`
    : "local";

  for (const entry of valid) {
    try {
      const normalized = normalizeProject(entry.project);
      const fingerprint = computeImportFingerprint(sourceRepo, entry.path, result.commit, entry.project);

      // Check for existing import with same fingerprint
      const { data: existing } = await client
        .from("external_project_imports")
        .select("id")
        .eq("import_fingerprint", fingerprint)
        .limit(1);

      if (existing && existing.length > 0) {
        result.skipped_count++;
        continue;
      }

      const { error: insertError } = await client
        .from("external_project_imports")
        .insert({
          source_name: sourceRepo,
          source_url: entry.path,
          import_payload: normalized,
          import_fingerprint: fingerprint,
          status: "pending_review",
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
