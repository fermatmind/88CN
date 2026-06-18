import type { MethodologyPoint } from "@/lib/reports/seed-100-readiness-report";

interface ReportMethodologyBlockProps {
  points: MethodologyPoint[];
}

export function ReportMethodologyBlock({
  points,
}: ReportMethodologyBlockProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {points.map((point) => (
        <div
          key={point.label}
          className="rounded-md border border-terminal-border bg-terminal-surface p-4"
        >
          <h3 className="text-xs font-semibold text-terminal-fg">
            {point.label}
          </h3>
          <p className="mt-2 text-[11px] leading-relaxed text-terminal-dim">
            {point.body}
          </p>
        </div>
      ))}
    </div>
  );
}
