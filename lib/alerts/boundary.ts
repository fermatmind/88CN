import { getSignalAlertRuntimePolicy } from "@/lib/alerts/flags";

export const SIGNAL_ALERT_RULE_STATUSES = [
  "disabled",
  "draft",
  "admin_review",
] as const;

export type SignalAlertRuleStatus =
  (typeof SIGNAL_ALERT_RULE_STATUSES)[number];

export interface SignalAlertRuleDraft {
  projectId: string;
  alertType: "source_stale" | "lifecycle_inactive" | "archive_candidate";
  status: SignalAlertRuleStatus;
  transport: "none";
}

export function createDisabledSignalAlertRule(
  projectId: string,
  alertType: SignalAlertRuleDraft["alertType"]
): SignalAlertRuleDraft {
  return {
    projectId,
    alertType,
    status: "disabled",
    transport: "none",
  };
}

export function canSendSignalAlert(): false {
  const policy = getSignalAlertRuntimePolicy();
  void policy;
  return false;
}
