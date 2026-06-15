import type { SourceConfidenceLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SourceConfidenceBadgeProps {
  level: SourceConfidenceLevel;
  className?: string;
}

const LABELS: Record<SourceConfidenceLevel, string> = {
  verified: "Verified",
  public_signals: "Public Signals",
  not_enough_data: "Not Enough Data",
  founder_not_claimed: "Founder Not Claimed",
  source_unavailable: "Source Unavailable",
};

const STYLES: Record<SourceConfidenceLevel, string> = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  public_signals: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  not_enough_data: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  founder_not_claimed: "border-terminal-border bg-transparent text-terminal-dim",
  source_unavailable: "border-terminal-border bg-terminal-surface text-terminal-dim",
};

export function SourceConfidenceBadge({
  level,
  className,
}: SourceConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium",
        STYLES[level],
        className
      )}
    >
      {LABELS[level]}
    </span>
  );
}
