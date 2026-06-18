import type { Metadata } from "next";
import { ClipboardList, ShieldCheck } from "lucide-react";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";
import { CHANGELOG_ENTRY_STATUSES } from "@/lib/changelog/engine";

export const metadata: Metadata = {
  title: siteTitle("Changelog Review"),
  description: siteDescription("Admin boundary notes for reviewed changelog entries."),
  ...noIndex(),
};

const notes = [
  "Changelog entries are draft by default.",
  "Entries can be staged for admin review before any public visibility.",
  "Approval records readiness only; PR53 does not publish changelog entries.",
  "Changelog review does not mutate Signal Score.",
  "Changelog review does not mutate Source Confidence.",
  "No changelog data is exposed through public endpoints in v0.",
];

export default function AdminChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-terminal-muted" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-terminal-dim">
            Admin
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Changelog Review
        </h1>
        <p className="text-sm leading-relaxed text-terminal-muted">
          Changelog entries can be drafted, staged, and approved for future
          publication review. This v0 surface does not publish entries.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-terminal-dim">
          Review states
        </p>
        <div className="flex flex-wrap gap-2">
          {CHANGELOG_ENTRY_STATUSES.map((status) => (
            <span
              key={status}
              className="rounded-md border border-terminal-border px-2 py-1 font-mono text-[10px] text-terminal-muted"
            >
              {status}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note}
            className="flex gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-muted" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
