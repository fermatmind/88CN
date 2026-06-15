import type { DemoReport } from "@/lib/demo-reports";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

interface ReportCardProps {
  report: DemoReport;
  className?: string;
}

export default function ReportCard({ report, className }: ReportCardProps) {
  return (
    <Link
      href={`/reports/${report.slug}`}
      className={cn(
        "group block rounded-lg border border-terminal-border bg-terminal-surface p-5 transition-colors hover:border-terminal-ring",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-terminal-muted" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
          Report
        </span>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-terminal-fg group-hover:text-terminal-muted transition-colors">
        {report.title}
      </h3>

      <div className="mb-3 flex items-center gap-1.5 text-[10px] text-terminal-dim">
        <Calendar className="h-3 w-3" />
        <span>{report.date}</span>
      </div>

      <p className="text-xs text-terminal-dim leading-relaxed line-clamp-3">
        {report.executiveSummary}
      </p>
    </Link>
  );
}
