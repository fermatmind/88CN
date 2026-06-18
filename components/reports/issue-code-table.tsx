import type { IssueRow } from "@/lib/reports/seed-100-readiness-report";

interface IssueCodeTableProps {
  rows: IssueRow[];
}

export function IssueCodeTable({ rows }: IssueCodeTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-terminal-border">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-terminal-elevated text-[10px] uppercase tracking-widest text-terminal-dim">
          <tr>
            <th className="border-b border-terminal-border px-3 py-2 font-medium">
              Issue
            </th>
            <th className="border-b border-terminal-border px-3 py-2 font-medium">
              Count
            </th>
            <th className="border-b border-terminal-border px-3 py-2 font-medium">
              Meaning
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className="bg-terminal-surface">
              <td className="border-b border-terminal-border px-3 py-2 font-mono text-terminal-fg">
                {row.label}
              </td>
              <td className="border-b border-terminal-border px-3 py-2 text-terminal-fg">
                {row.count}
              </td>
              <td className="border-b border-terminal-border px-3 py-2 leading-relaxed text-terminal-dim">
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
