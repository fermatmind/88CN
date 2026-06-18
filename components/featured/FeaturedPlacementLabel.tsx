import { BadgeCheck } from "lucide-react";

export function FeaturedPlacementLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
      <BadgeCheck className="h-3 w-3 text-terminal-muted" />
      Featured placement
    </span>
  );
}
