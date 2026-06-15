import { SignalScore } from "@/components/signal-score";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import type { DemoProject } from "@/lib/demo-projects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: DemoProject;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
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
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="truncate text-sm font-semibold text-terminal-fg group-hover:text-terminal-muted transition-colors">
              {project.name}
            </h3>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-terminal-dim opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p className="text-xs text-terminal-dim leading-relaxed line-clamp-2 mb-3">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
              {project.category}
            </span>

            <SignalScore score={project.signalScore} size="sm" />

            <SourceConfidenceBadge level={project.sourceConfidence} />

            <ClaimStatusBadge status={project.status} verification={project.verificationStatus} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ClaimStatusBadge({
  status,
}: {
  status: string;
  verification: string;
}) {
  const isClaimed = status === "claimed" || status === "owner_verified";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium",
        isClaimed
          ? "border border-terminal-ring bg-terminal-elevated text-terminal-fg"
          : "border border-terminal-border bg-transparent text-terminal-dim"
      )}
    >
      {isClaimed ? "Claimed" : "Unclaimed"}
    </span>
  );
}
