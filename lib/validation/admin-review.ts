import { z } from "zod";

const REVIEW_ACTIONS = ["approve", "reject", "needs_info", "publish"] as const;

export const adminReviewActionSchema = z.object({
  action: z.enum(REVIEW_ACTIONS, {
    message: `Action must be one of: ${REVIEW_ACTIONS.join(", ")}`,
  }),
});

export type AdminReviewActionInput = z.infer<
  typeof adminReviewActionSchema
>;
