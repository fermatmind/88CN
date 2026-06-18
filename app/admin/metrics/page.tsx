import { checkAdminGuard } from "@/lib/auth/admin";
import { getConversionMetricSummary } from "@/lib/metrics/conversion-metrics";
import { siteTitle, noIndex } from "@/lib/seo";
import { ConversionMetricSummaryPanel } from "@/components/admin/conversion-metric-summary";
import { ArrowLeft, BarChart3, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Admin - Conversion Metrics"),
  ...noIndex(),
};

export default async function AdminMetricsPage() {
  const guard = await checkAdminGuard();

  if (!guard.isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Shield className="mb-4 inline-block h-12 w-12 text-terminal-muted" />
        <h1 className="mb-2 text-xl font-bold text-terminal-fg">
          Sign In Required
        </h1>
        <Link href="/admin/login" className="text-xs text-terminal-muted underline">
          Sign In
        </Link>
      </div>
    );
  }

  if (!guard.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mb-4 inline-block h-12 w-12 text-red-400" />
        <h1 className="mb-2 text-xl font-bold text-terminal-fg">
          Not Authorized
        </h1>
      </div>
    );
  }

  const summary = await getConversionMetricSummary();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-xs text-terminal-dim hover:text-terminal-muted transition-colors"
        >
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">
          Conversion Metrics
        </h1>
      </div>

      <div className="mb-4 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <p className="text-xs leading-relaxed text-terminal-dim">
          This view uses aggregate counters only. It does not collect personal founder data,
          third-party tracking identifiers, or public launch automation signals.
        </p>
      </div>

      <ConversionMetricSummaryPanel summary={summary} />
    </div>
  );
}
