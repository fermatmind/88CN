import type { Metadata } from "next";
import { Archive, ShieldCheck } from "lucide-react";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";
import {
  ARCHIVE_HISTORY_POLICY,
  LIFECYCLE_ARCHIVE_STATES,
} from "@/lib/lifecycle/archive-policy";

export const metadata: Metadata = {
  title: siteTitle("Lifecycle Archive"),
  description: siteDescription("Admin boundary notes for lifecycle archive review."),
  ...noIndex(),
};

const rules = [
  "Inactive projects move through admin review before any archive state.",
  "Reviewed public pages remain historical snapshots.",
  "Public historical records are not hard-deleted by lifecycle automation.",
  "Archive snapshots exclude private founder and admin review payloads.",
  "Historical indexing requires explicit human approval.",
];

export default function AdminLifecyclePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Archive className="h-4 w-4 text-terminal-muted" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-terminal-dim">
            Admin
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Lifecycle Archive
        </h1>
        <p className="text-sm leading-relaxed text-terminal-muted">
          Lifecycle archive review keeps inactive projects as historical
          snapshots instead of removing reviewed public records.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-terminal-dim">
          Archive states
        </p>
        <div className="flex flex-wrap gap-2">
          {LIFECYCLE_ARCHIVE_STATES.map((state) => (
            <span
              key={state}
              className="rounded-md border border-terminal-border px-2 py-1 font-mono text-[10px] text-terminal-muted"
            >
              {state}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule}
            className="flex gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <span>{rule}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim">
        Hard delete public history allowed:{" "}
        <span className="font-mono text-terminal-muted">
          {String(ARCHIVE_HISTORY_POLICY.hardDeletePublicHistoryAllowed)}
        </span>
      </div>
    </div>
  );
}
