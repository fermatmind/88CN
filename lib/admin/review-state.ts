import type { BulkLifecycleStatus, BulkReviewState } from "@/lib/admin/bulk-control-panel";

export const MANUAL_REVIEW_STATES = [
  "review_ready",
  "published",
  "quarantined",
  "rejected",
  "stale",
  "archived",
] as const;

export type ManualReviewState = (typeof MANUAL_REVIEW_STATES)[number];

export interface ReviewStateInput {
  nextState: ManualReviewState;
  decisionReason: string;
  reviewedFields: string[];
  originalSummaryChecked: boolean;
  publicFieldsChecked: boolean;
}

export function parseReviewStateForm(formData: FormData): ReviewStateInput {
  const nextState = String(formData.get("next_state") ?? "");
  const decisionReason = String(formData.get("decision_reason") ?? "").trim();
  const reviewedFields = formData
    .getAll("reviewed_fields")
    .map((value) => String(value))
    .filter(Boolean);

  if (!isManualReviewState(nextState)) {
    throw new Error("Unsupported next state.");
  }

  if (decisionReason.length < 8) {
    throw new Error("Decision reason must be at least 8 characters.");
  }

  if (nextState === "published") {
    const originalSummaryChecked = formData.get("original_summary_checked") === "on";
    const publicFieldsChecked = formData.get("public_fields_checked") === "on";
    if (!originalSummaryChecked || !publicFieldsChecked) {
      throw new Error("Published transition requires original summary and public field checks.");
    }
  }

  return {
    nextState,
    decisionReason,
    reviewedFields,
    originalSummaryChecked: formData.get("original_summary_checked") === "on",
    publicFieldsChecked: formData.get("public_fields_checked") === "on",
  };
}

export function isManualReviewState(value: string): value is ManualReviewState {
  return MANUAL_REVIEW_STATES.includes(value as ManualReviewState);
}

export function reviewStateForLifecycle(nextState: ManualReviewState): BulkReviewState {
  if (nextState === "published") return "published_approved";
  if (nextState === "rejected") return "rejected";
  if (nextState === "archived") return "archived";
  if (nextState === "review_ready") return "approved";
  return "changes_requested";
}

export function reviewDecisionForLifecycle(
  nextState: ManualReviewState,
): "approve_projection" | "reject" | "quarantine" | "archive" | "request_changes" {
  if (nextState === "published" || nextState === "review_ready") return "approve_projection";
  if (nextState === "rejected") return "reject";
  if (nextState === "quarantined") return "quarantine";
  if (nextState === "archived") return "archive";
  return "request_changes";
}

export function buildReviewedFieldsPayload({
  previousLifecycle,
  previousReviewState,
  input,
  reviewer,
}: {
  previousLifecycle: BulkLifecycleStatus;
  previousReviewState: BulkReviewState;
  input: ReviewStateInput;
  reviewer: { userId?: string; email?: string };
}) {
  return {
    who: reviewer.email ?? reviewer.userId ?? "admin",
    when: new Date().toISOString(),
    why: input.decisionReason,
    previous_state: {
      lifecycle_status: previousLifecycle,
      review_state: previousReviewState,
    },
    next_state: {
      lifecycle_status: input.nextState,
      review_state: reviewStateForLifecycle(input.nextState),
    },
    reviewed_fields: input.reviewedFields,
    decision_reason: input.decisionReason,
    checks: {
      original_summary_checked: input.originalSummaryChecked,
      public_fields_checked: input.publicFieldsChecked,
    },
  };
}
