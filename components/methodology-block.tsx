import { cn } from "@/lib/utils";
import { BookOpen, ShieldCheck } from "lucide-react";

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
      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
          <BookOpen className="h-4 w-4 text-terminal-ring" />
          Methodology
        </h2>
        <p className="text-sm leading-6 text-terminal-dim">
          {methodologyNote}
        </p>
      </section>

      {sourceConfidenceNote && (
        <section className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <ShieldCheck className="h-4 w-4 text-terminal-ring" />
            Public Data Boundary
          </h2>
          <p className="text-sm leading-6 text-terminal-dim">
            {sourceConfidenceNote}
          </p>
        </section>
      )}
    </div>
  );
}
