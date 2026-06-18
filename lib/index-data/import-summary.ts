export const QUARANTINE_REASON_CODES = [
  "invalid_url",
  "invalid_category",
  "duplicate_slug",
  "duplicate_fingerprint",
  "forbidden_field",
  "privacy_risk",
  "malformed_payload",
  "source_not_allowed",
] as const;

export type QuarantineReasonCode = (typeof QUARANTINE_REASON_CODES)[number];

export type ImportClassificationStatus =
  | "accepted"
  | "quarantined"
  | "duplicate"
  | "rejected";

export type ImportStorageStatus =
  | "pending_review"
  | "quarantined"
  | "duplicate"
  | "rejected"
  | "imported";

export type QuarantineReasonCounts = Record<QuarantineReasonCode, number>;

export interface ImportQuarantineSummary {
  total: number;
  accepted: number;
  quarantined: number;
  rejected: number;
  duplicates: number;
  reasons: QuarantineReasonCounts;
}

export function createReasonCounts(): QuarantineReasonCounts {
  return Object.fromEntries(
    QUARANTINE_REASON_CODES.map((reason) => [reason, 0])
  ) as QuarantineReasonCounts;
}

export function createImportQuarantineSummary(): ImportQuarantineSummary {
  return {
    total: 0,
    accepted: 0,
    quarantined: 0,
    rejected: 0,
    duplicates: 0,
    reasons: createReasonCounts(),
  };
}

export function addClassificationToSummary(
  summary: ImportQuarantineSummary,
  status: ImportClassificationStatus,
  reasonCodes: readonly QuarantineReasonCode[] = []
): void {
  summary.total++;
  if (status === "accepted") summary.accepted++;
  if (status === "quarantined") summary.quarantined++;
  if (status === "rejected") summary.rejected++;
  if (status === "duplicate") summary.duplicates++;

  for (const reason of reasonCodes) {
    summary.reasons[reason]++;
  }
}

export function summarizeImportRows(
  rows: readonly { status?: string | null; quarantine_reason_code?: string | null }[]
): ImportQuarantineSummary {
  const summary = createImportQuarantineSummary();

  for (const row of rows) {
    summary.total++;
    if (row.status === "quarantined") summary.quarantined++;
    else if (row.status === "duplicate") summary.duplicates++;
    else if (row.status === "rejected") summary.rejected++;
    else summary.accepted++;

    const reason = row.quarantine_reason_code;
    if (reason && reason in summary.reasons) {
      summary.reasons[reason as QuarantineReasonCode]++;
    }
  }

  return summary;
}
