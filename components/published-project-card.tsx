import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PublishedProjectCardProps {
  project: PublishedProjectProjection;
  className?: string;
}

export function PublishedProjectCard({
  project,
  className,
}: PublishedProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block rounded-lg border border-terminal-border bg-terminal-surface p-5 transition-colors hover:border-terminal-ring",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-terminal-fg transition-colors group-hover:text-terminal-muted">
              {project.project_name}
            </h2>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-terminal-dim opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-terminal-dim">
            {project.original_summary}
          </p>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
              {project.primary_category}
            </span>
            <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-dim">
              {formatModel(project.open_source_or_commercial)}
            </span>
            <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-dim">
              Published projection
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.public_signal_chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-md bg-terminal-elevated px-2 py-0.5 text-[10px] font-medium text-terminal-muted"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1 text-[10px] text-terminal-dim">
            <ExternalLink className="h-3 w-3" />
            <span>{project.official_website_url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatModel(value: PublishedProjectProjection["open_source_or_commercial"]) {
  if (value === "open_source") return "Open source";
  if (value === "commercial") return "Commercial";
  return "Hybrid";
}
