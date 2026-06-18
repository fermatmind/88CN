import type { Metadata } from "next";
import { CreditCard, ShieldCheck } from "lucide-react";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: siteTitle("Featured Signals Orders"),
  description: siteDescription("Admin boundary notes for Featured Signals orders."),
  ...noIndex(),
};

const notes = [
  "Commercial flows are disabled by default.",
  "Payment does not activate placement.",
  "Any future paid order requires admin review.",
  "Featured placement affects human-visible UI only.",
  "Payment never affects sitemap, Public API, MCP, Signal Score, Source Confidence, or organic ordering.",
  "No Stripe is configured in this environment.",
];

export default function FeaturedSignalOrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-terminal-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            Admin
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Featured Signals Orders
        </h1>
        <p className="text-sm leading-relaxed text-terminal-muted">
          This page documents the disabled commercial boundary for Featured
          Signals. It has no mutation controls and no checkout links.
        </p>
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
