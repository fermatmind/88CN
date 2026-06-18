import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: siteTitle("Featured Signals"),
  description: siteDescription("Admin notes for Featured Signals."),
  ...noIndex(),
};

export default function AdminFeaturedSignalsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-terminal-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            Admin
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Featured Signals
        </h1>
        <p className="text-sm leading-relaxed text-terminal-muted">
          Featured Signals are human-visible UI placements only. Eligible
          projects must already be reviewed public projects before placement.
        </p>
      </div>

      <div className="space-y-4">
        {[
          "Payment activation is not implemented in PR50.",
          "Future payment work belongs to PR51 and remains disabled by default.",
          "No machine data layer, sitemap, public API, MCP, score, or source confidence changes are part of this surface.",
          "This page does not approve, activate, or order campaign placement.",
        ].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
