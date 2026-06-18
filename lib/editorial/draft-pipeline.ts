export const EDITORIAL_DRAFT_STATUSES = [
  "draft",
  "pending_review",
  "approved_for_publication",
  "needs_info",
  "rejected",
  "archived",
] as const;

export type EditorialDraftStatus = (typeof EDITORIAL_DRAFT_STATUSES)[number];

export const EDITORIAL_DRAFT_ACTIONS = [
  "approve",
  "reject",
  "needs_info",
  "archive",
] as const;

export type EditorialDraftAction = (typeof EDITORIAL_DRAFT_ACTIONS)[number];

export interface EditorialDraftInput {
  projectId: string;
  draftNote: string;
  draftTitle?: string | null;
  draftGrowthOpportunity?: string | null;
  sourceJobId?: string | null;
  sourceSummary?: Record<string, unknown>;
}

export interface EditorialDraftInsert {
  project_id: string;
  source_job_id: string | null;
  status: EditorialDraftStatus;
  draft_title: string | null;
  draft_note: string;
  draft_growth_opportunity: string | null;
  draft_source_summary: Record<string, unknown>;
}

const ACTION_TO_STATUS: Record<EditorialDraftAction, EditorialDraftStatus> = {
  approve: "approved_for_publication",
  reject: "rejected",
  needs_info: "needs_info",
  archive: "archived",
};

export function toEditorialDraftInsert(input: EditorialDraftInput): EditorialDraftInsert {
  return {
    project_id: input.projectId,
    source_job_id: input.sourceJobId ?? null,
    status: "draft",
    draft_title: input.draftTitle ?? null,
    draft_note: input.draftNote,
    draft_growth_opportunity: input.draftGrowthOpportunity ?? null,
    draft_source_summary: input.sourceSummary ?? {},
  };
}

export function nextEditorialDraftStatus(action: EditorialDraftAction): EditorialDraftStatus {
  return ACTION_TO_STATUS[action];
}

export function isEditorialDraftAction(value: unknown): value is EditorialDraftAction {
  return typeof value === "string" && EDITORIAL_DRAFT_ACTIONS.includes(value as EditorialDraftAction);
}

export function isPublicationSideEffectBlocked(action: string): boolean {
  return action === "publish" || action === "publish_project" || action === "make_indexable";
}
