import { cn } from "@/lib/utils";

interface SignalScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SignalScore({ score, size = "md", className }: SignalScoreProps) {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-4 py-2 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-mono font-semibold tabular-nums",
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
      title={`Signal Score: ${score}/100`}
    >
      <span className="text-terminal-dim">SS</span>
      <span>{score}</span>
    </span>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (score >= 60) return "border-sky-500/30 bg-sky-500/10 text-sky-400";
  if (score >= 40) return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  return "border-terminal-border bg-terminal-surface text-terminal-dim";
}

interface SignalDimensionBarProps {
  label: string;
  value: number;
  className?: string;
}

export function SignalDimensionBar({
  label,
  value,
  className,
}: SignalDimensionBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-36 shrink-0 text-xs text-terminal-muted">
        {label}
      </span>
      <div className="flex flex-1 items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-terminal-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              value >= 80
                ? "bg-emerald-500"
                : value >= 60
                  ? "bg-sky-500"
                  : value >= 40
                    ? "bg-amber-500"
                    : "bg-terminal-dim"
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs font-mono tabular-nums text-terminal-dim">
          {value}
        </span>
      </div>
    </div>
  );
}
