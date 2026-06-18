import type { ReportMetric } from "@/lib/reports/seed-100-readiness-report";

interface ReportMetricGridProps {
  metrics: ReportMetric[];
}

export function ReportMetricGrid({ metrics }: ReportMetricGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-md border border-terminal-border bg-terminal-surface p-4"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            {metric.label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-terminal-fg">
            {metric.value}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-terminal-dim">
            {metric.note}
          </p>
        </div>
      ))}
    </div>
  );
}
