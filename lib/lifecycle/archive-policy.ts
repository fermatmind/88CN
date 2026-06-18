export const LIFECYCLE_ARCHIVE_STATES = [
  "inactive_warning",
  "candidate_archive",
  "archived_research",
  "archived_noindex",
] as const;

export type LifecycleArchiveState = (typeof LIFECYCLE_ARCHIVE_STATES)[number];

export type LifecycleArchiveDecision =
  | {
      action: "keep_public_snapshot";
      nextState: LifecycleArchiveState;
      indexStatus: "archived_indexable" | "noindex";
      allowHardDelete: false;
      reason: string;
    }
  | {
      action: "admin_review_required";
      nextState: "candidate_archive";
      indexStatus: "noindex";
      allowHardDelete: false;
      reason: string;
    };

export const HARD_DELETE_PUBLIC_HISTORY_ALLOWED = false;

export const ARCHIVE_HISTORY_POLICY = {
  publicRecordAction: "keep_public_snapshot",
  rawPrivatePayloadAction: "exclude_from_snapshot",
  adminReviewRequired: true,
  hardDeletePublicHistoryAllowed: HARD_DELETE_PUBLIC_HISTORY_ALLOWED,
} as const;

export function getLifecycleArchiveDecision(input: {
  currentState: string;
  hasReviewedPublicPage: boolean;
  humanApprovedHistoricalIndexing?: boolean;
}): LifecycleArchiveDecision {
  if (!input.hasReviewedPublicPage) {
    return {
      action: "admin_review_required",
      nextState: "candidate_archive",
      indexStatus: "noindex",
      allowHardDelete: false,
      reason: "Project has no reviewed public page snapshot.",
    };
  }

  if (input.humanApprovedHistoricalIndexing === true) {
    return {
      action: "keep_public_snapshot",
      nextState: "archived_research",
      indexStatus: "archived_indexable",
      allowHardDelete: false,
      reason: "Human approval allows historical research indexing.",
    };
  }

  return {
    action: "keep_public_snapshot",
    nextState: "archived_noindex",
    indexStatus: "noindex",
    allowHardDelete: false,
    reason: "Archived project keeps a historical snapshot without indexing.",
  };
}

export function isLifecycleArchiveState(
  state: string
): state is LifecycleArchiveState {
  return LIFECYCLE_ARCHIVE_STATES.includes(state as LifecycleArchiveState);
}
