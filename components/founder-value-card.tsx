import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FounderValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FounderValueCard({
  icon: Icon,
  title,
  description,
  className,
}: FounderValueCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-terminal-border bg-terminal-surface p-5",
        className
      )}
    >
      <Icon className="mb-3 h-5 w-5 text-terminal-muted" />
      <h3 className="mb-1.5 text-sm font-semibold text-terminal-fg">
        {title}
      </h3>
      <p className="text-xs text-terminal-dim leading-relaxed">
        {description}
      </p>
    </div>
  );
}
