import { cn } from "@/lib/utils";
import { Beaker, ShieldAlert } from "lucide-react";

interface MethodologyBlockProps {
  methodologyNote: string;
  sourceConfidenceNote?: string;
  className?: string;
}

export function MethodologyBlock({
  methodologyNote,
  sourceConfidenceNote,
  className,
}: MethodologyBlockProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
          <Beaker className="h-4 w-4 text-terminal-muted" />
          Methodology
        </h2>
        <p className="text-xs text-terminal-dim leading-relaxed">
          {methodologyNote}
        </p>
      </section>

      {sourceConfidenceNote && (
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <ShieldAlert className="h-4 w-4 text-terminal-muted" />
            Source Confidence
          </h2>
          <p className="text-xs text-terminal-dim leading-relaxed">
            {sourceConfidenceNote}
          </p>
        </section>
      )}
    </div>
  );
}
