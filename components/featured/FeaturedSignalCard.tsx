import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { FeaturedSignalViewModel } from "@/lib/featured/featured-signals";

export function FeaturedSignalCard({
  signal,
}: {
  signal: FeaturedSignalViewModel;
}) {
  const { project, placementNote } = signal;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-terminal-border bg-terminal-surface p-4 transition-colors hover:border-terminal-ring"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-terminal-fg">
            {project.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-terminal-dim">
            {project.tagline}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-terminal-dim transition-colors group-hover:text-terminal-muted" />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-terminal-muted" />
          Reviewed public signals
        </span>
        <span className="text-terminal-border">|</span>
        <span>{project.status.replaceAll("_", " ")}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-terminal-dim">
        {placementNote}
      </p>
    </Link>
  );
}
