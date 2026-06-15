import { z } from "zod";

const CLAIM_METHODS = [
  "domain_email",
  "dns_txt",
  "github_repo",
  "website_meta_tag",
  "manual",
] as const;

export const projectClaimSchema = z.object({
  project_slug: z
    .string()
    .min(1, "Project slug is required")
    .max(200),
  claimant_name: z
    .string()
    .min(1, "Your name is required")
    .max(200),
  claimant_email: z
    .string()
    .email("Must be a valid email")
    .max(300),
  claimant_role: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  claim_method: z.enum(CLAIM_METHODS, {
    message: `Claim method must be one of: ${CLAIM_METHODS.join(", ")}`,
  }),
  proof_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  proof_note: z
    .string()
    .max(1000, "Proof note must be under 1000 characters")
    .optional()
    .or(z.literal("")),
}).strict();

export type ProjectClaimInput = z.infer<typeof projectClaimSchema>;
