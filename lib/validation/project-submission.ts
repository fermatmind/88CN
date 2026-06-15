import { z } from "zod";

export const projectSubmissionSchema = z.object({
  project_name: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name must be under 200 characters"),
  website_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  category_slug: z
    .string()
    .min(1, "Category is required")
    .max(100),
  one_liner: z
    .string()
    .min(1, "One-liner is required")
    .max(300, "One-liner must be under 300 characters"),
  description: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("")),
  founder_name: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  founder_email: z
    .string()
    .email("Must be a valid email")
    .max(300)
    .optional()
    .or(z.literal("")),
  founder_public_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  docs_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  pricing_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  launch_url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  growth_note: z
    .string()
    .max(1000, "Growth note must be under 1000 characters")
    .optional()
    .or(z.literal("")),
}).strict();

export type ProjectSubmissionInput = z.infer<
  typeof projectSubmissionSchema
>;
