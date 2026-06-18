import type { ConversionMetricSummary } from "@/lib/metrics/conversion-metrics";

export function ConversionMetricSummaryPanel({
  summary,
}: {
  summary: ConversionMetricSummary;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-terminal-fg">
            Aggregate counters
          </h2>
          <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-dim">
            {summary.configured ? "configured" : "not configured"}
          </span>
        </div>
        {summary.rows.length === 0 ? (
          <p className="text-xs leading-relaxed text-terminal-dim">
            No aggregate conversion rows are available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-widest text-terminal-dim">
                <tr>
                  <th className="py-2 pr-4">Metric</th>
                  <th className="py-2 pr-4">Surface</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="text-terminal-muted">
                {summary.rows.map((row) => (
                  <tr
                    key={`${row.metric_key}:${row.surface}:${row.bucket_date}`}
                    className="border-t border-terminal-border"
                  >
                    <td className="py-2 pr-4 font-mono">{row.metric_key}</td>
                    <td className="py-2 pr-4">{row.surface}</td>
                    <td className="py-2 pr-4">{row.bucket_date}</td>
                    <td className="py-2 text-right font-mono">
                      {row.count_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
          Pivot gates
        </h2>
        <div className="grid gap-3">
          {summary.pivotGates.map((gate) => (
            <div
              key={gate.day}
              className="rounded-md border border-terminal-border p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold text-terminal-fg">
                  Day {gate.day}: {gate.name}
                </h3>
                <span className="text-[10px] font-mono text-terminal-dim">
                  {gate.requiredSignals.length} signals
                </span>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-terminal-dim">
                {gate.decisionRule}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {gate.requiredSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-muted"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
