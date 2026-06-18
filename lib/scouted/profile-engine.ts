export const SCOUTED_PROFILE_STATUSES = [
  "observed",
  "pending_review",
  "approved_for_project",
  "rejected",
  "removed",
  "archived",
] as const;

export type ScoutedProfileStatus = (typeof SCOUTED_PROFILE_STATUSES)[number];

export const SCOUTED_INDEX_STATUSES = ["noindex", "preview_noindex"] as const;
export type ScoutedIndexStatus = (typeof SCOUTED_INDEX_STATUSES)[number];

export const SCOUTED_INTENT_TYPES = ["claim", "correct", "remove"] as const;
export type ScoutedIntentType = (typeof SCOUTED_INTENT_TYPES)[number];

export const SCOUTED_REVIEW_ACTIONS = [
  "mark_pending_review",
  "approve_for_project",
  "reject",
  "remove",
  "archive",
] as const;

export type ScoutedReviewAction = (typeof SCOUTED_REVIEW_ACTIONS)[number];

const ACTION_TO_STATUS: Record<ScoutedReviewAction, ScoutedProfileStatus> = {
  mark_pending_review: "pending_review",
  approve_for_project: "approved_for_project",
  reject: "rejected",
  remove: "removed",
  archive: "archived",
};

export function nextScoutedStatus(action: ScoutedReviewAction): ScoutedProfileStatus {
  return ACTION_TO_STATUS[action];
}

export function isScoutedReviewAction(value: unknown): value is ScoutedReviewAction {
  return typeof value === "string" && SCOUTED_REVIEW_ACTIONS.includes(value as ScoutedReviewAction);
}

export function isScoutedIntentType(value: unknown): value is ScoutedIntentType {
  return typeof value === "string" && SCOUTED_INTENT_TYPES.includes(value as ScoutedIntentType);
}

export function defaultScoutedIndexStatus(): ScoutedIndexStatus {
  return "noindex";
}

export function isPublicExposureBlockedForScoutedProfile(status: ScoutedProfileStatus): boolean {
  return status !== "approved_for_project";
}
