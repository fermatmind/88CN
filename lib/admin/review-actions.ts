import {
  getSubmissionById,
  getClaimById,
  updateClaimStatus,
  updateProjectClaimStatus,
  createProjectFromSubmission,
  updateProjectStatus,
  insertAuditEvent,
  insertNotificationEvent,
} from "./review-queries";

export type ReviewAction = "approve" | "reject" | "needs_info";

export interface ReviewResult {
  success: boolean;
  error?: string;
  projectId?: string;
}

/** Mask email for display: fo***@example.com */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const [local, domain] = email.split("@");
  if (!domain) return email.slice(0, 2) + "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

/**
 * Approve a submission → create project in approved/preview_noindex state.
 * Does NOT publish. Publish is a separate action.
 */
export async function approveSubmission(
  submissionId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const sub = await getSubmissionById(submissionId);
  if (!sub) return { success: false, error: "Submission not found." };
  if (sub.status !== "pending_review")
    return {
      success: false,
      error: `Cannot approve: submission is in "${sub.status}" status.`,
    };

  // Create project record
  const project = await createProjectFromSubmission(sub);
  if (!project)
    return { success: false, error: "Failed to create project record." };

  // Mark submission approved
  const client = (await import("@/lib/supabase/admin-server")).getAdminClient();
  if (client) {
    await client
      .from("project_submissions")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", submissionId);
  }

  // Audit
  await insertAuditEvent(
    "submission_approved",
    "admin_review",
    {
      submission_id: submissionId,
      project_id: project.id,
      project_slug: project.slug,
      reviewer: reviewerId,
    },
    requestId
  );

  await insertNotificationEvent(
    "submission_approved",
    { submission_id: submissionId, project_slug: project.slug },
    null,
    requestId
  );

  return { success: true, projectId: project.id };
}

/**
 * Reject a submission.
 */
export async function rejectSubmission(
  submissionId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const sub = await getSubmissionById(submissionId);
  if (!sub) return { success: false, error: "Submission not found." };

  const client = (await import("@/lib/supabase/admin-server")).getAdminClient();
  if (client) {
    await client
      .from("project_submissions")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", submissionId);
  }

  await insertAuditEvent(
    "submission_rejected",
    "admin_review",
    { submission_id: submissionId, reviewer: reviewerId },
    requestId
  );

  return { success: true };
}

/**
 * Mark a submission as needing more info.
 */
export async function needsInfoSubmission(
  submissionId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const sub = await getSubmissionById(submissionId);
  if (!sub) return { success: false, error: "Submission not found." };

  const client = (await import("@/lib/supabase/admin-server")).getAdminClient();
  if (client) {
    await client
      .from("project_submissions")
      .update({ status: "needs_info", reviewed_at: new Date().toISOString() })
      .eq("id", submissionId);
  }

  await insertAuditEvent(
    "submission_needs_info",
    "admin_review",
    { submission_id: submissionId, reviewer: reviewerId },
    requestId
  );

  return { success: true };
}

/**
 * Publish a project: approved → published, indexable.
 * Only works on projects in "approved" status.
 */
export async function publishProject(
  projectId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const ok = await updateProjectStatus(projectId, "published", "indexable");
  if (!ok) return { success: false, error: "Failed to publish project." };

  await insertAuditEvent(
    "project_published",
    "admin_review",
    { project_id: projectId, reviewer: reviewerId },
    requestId
  );

  return { success: true };
}

/**
 * Approve a claim.
 */
export async function approveClaim(
  claimId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const claim = await getClaimById(claimId);
  if (!claim) return { success: false, error: "Claim not found." };

  const ok = await updateClaimStatus(claimId, "approved");
  if (!ok) return { success: false, error: "Failed to update claim status." };

  if (claim.project_id) {
    await updateProjectClaimStatus(claim.project_id, "claimed");
  }

  await insertAuditEvent(
    "claim_approved",
    "admin_review",
    {
      claim_id: claimId,
      project_id: claim.project_id,
      claim_method: claim.claim_method,
      reviewer: reviewerId,
    },
    requestId
  );

  await insertNotificationEvent(
    "claim_approved",
    { claim_id: claimId, project_id: claim.project_id },
    null,
    requestId
  );

  return { success: true };
}

/**
 * Reject a claim.
 */
export async function rejectClaim(
  claimId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const claim = await getClaimById(claimId);
  if (!claim) return { success: false, error: "Claim not found." };

  const ok = await updateClaimStatus(claimId, "rejected");
  if (!ok) return { success: false, error: "Failed to update claim status." };

  await insertAuditEvent(
    "claim_rejected",
    "admin_review",
    { claim_id: claimId, reviewer: reviewerId },
    requestId
  );

  return { success: true };
}

/**
 * Mark a claim as needing more info.
 */
export async function needsInfoClaim(
  claimId: string,
  reviewerId: string,
  requestId?: string
): Promise<ReviewResult> {
  const claim = await getClaimById(claimId);
  if (!claim) return { success: false, error: "Claim not found." };

  const ok = await updateClaimStatus(claimId, "needs_info");
  if (!ok) return { success: false, error: "Failed to update claim status." };

  await insertAuditEvent(
    "claim_needs_info",
    "admin_review",
    { claim_id: claimId, reviewer: reviewerId },
    requestId
  );

  return { success: true };
}
