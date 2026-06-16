import { siteTitle, siteDescription } from "@/lib/seo";
import { Search } from "lucide-react";
import GeoCheckerForm from "@/components/geo-checker-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("AI Search Readiness Checker"),
  description: siteDescription(
    "Check whether your AI project page exposes clean, machine-readable public signals for search engines and AI retrieval systems."
  ),
  robots: { index: true, follow: true },
};

export default function GeoCheckerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-terminal-border bg-terminal-surface">
          <Search className="h-5 w-5 text-terminal-muted" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          AI Search Readiness Checker
        </h1>
        <p className="text-sm text-terminal-dim leading-relaxed max-w-lg mx-auto">
          Check whether your AI project page exposes clean, machine-readable
          public signals for search engines and AI retrieval systems.
        </p>
      </div>

      <GeoCheckerForm />
    </div>
  );
}
