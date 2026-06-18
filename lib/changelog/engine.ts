export const CHANGELOG_ENTRY_STATUSES = [
  "draft",
  "staged",
  "pending_review",
  "approved_for_publication",
  "needs_info",
  "rejected",
  "archived",
] as const;

export type ChangelogEntryStatus = (typeof CHANGELOG_ENTRY_STATUSES)[number];

export const CHANGELOG_REVIEW_ACTIONS = [
  "stage",
  "submit_review",
  "approve",
  "needs_info",
  "reject",
  "archive",
] as const;

export type ChangelogReviewAction = (typeof CHANGELOG_REVIEW_ACTIONS)[number];

export interface ChangelogEntryInput {
  projectId: string;
  title: string;
  body: string;
  changeType: "product" | "source" | "lifecycle" | "editorial";
  sourceSummary?: Record<string, unknown>;
}

export interface ChangelogEntryInsert {
  project_id: string;
  status: ChangelogEntryStatus;
  change_type: ChangelogEntryInput["changeType"];
  title: string;
  body: string;
  source_summary: Record<string, unknown>;
  public_visible: false;
  affects_signal_score: false;
  affects_source_confidence: false;
}

const ACTION_TO_STATUS: Record<ChangelogReviewAction, ChangelogEntryStatus> = {
  stage: "staged",
  submit_review: "pending_review",
  approve: "approved_for_publication",
  needs_info: "needs_info",
  reject: "rejected",
  archive: "archived",
};

export function toChangelogEntryInsert(
  input: ChangelogEntryInput
): ChangelogEntryInsert {
  return {
    project_id: input.projectId,
    status: "draft",
    change_type: input.changeType,
    title: input.title,
    body: input.body,
    source_summary: input.sourceSummary ?? {},
    public_visible: false,
    affects_signal_score: false,
    affects_source_confidence: false,
  };
}

export function nextChangelogStatus(
  action: ChangelogReviewAction
): ChangelogEntryStatus {
  return ACTION_TO_STATUS[action];
}

export function isChangelogReviewAction(
  value: unknown
): value is ChangelogReviewAction {
  return (
    typeof value === "string" &&
    CHANGELOG_REVIEW_ACTIONS.includes(value as ChangelogReviewAction)
  );
}

export function isChangelogPublicationSideEffectBlocked(action: string): boolean {
  return (
    action === "publish" ||
    action === "make_public" ||
    action === "make_indexable" ||
    action === "update_signal_score" ||
    action === "update_source_confidence"
  );
}

export function canChangelogMutateSignalScore(): false {
  return false;
}

export function canChangelogMutateSourceConfidence(): false {
  return false;
}
