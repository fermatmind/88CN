import type { DemoProject } from "@/lib/demo-projects";
import type { LifecycleState } from "@/lib/constants";

const eligibleStates = new Set<LifecycleState>([
  "published",
  "claimed",
  "owner_verified",
]);

const blockedStates = new Set<string>([
  "submitted",
  "pending_review",
  "approved",
  "archived",
  "draft",
  "quarantined",
  "rejected",
  "removed",
  "inactive",
  "noindex_only",
  "policy_blocked",
]);

export function isFeaturedEligibleProject(
  project: DemoProject | undefined
): project is DemoProject {
  if (!project) return false;
  if (!project.status) return false;
  if (blockedStates.has(project.status)) return false;
  if (!eligibleStates.has(project.status)) return false;
  if (!project.sourceConfidence) return false;
  if (!Array.isArray(project.publicSources) || project.publicSources.length === 0) {
    return false;
  }
  return true;
}
