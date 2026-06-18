import { checkAdminGuard } from "@/lib/auth/admin";
import { getAdminClient } from "@/lib/supabase/admin-server";
import { siteTitle, noIndex } from "@/lib/seo";
import { Shield, ShieldAlert, ArrowLeft, Download, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { summarizeImportRows } from "@/lib/index-data/import-summary";

export const metadata: Metadata = {
  title: siteTitle("Admin — External Imports"),
  ...noIndex(),
};

export default async function ExternalImportsPage() {
  const guard = await checkAdminGuard();

  if (!guard.isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Shield className="mb-4 inline-block h-12 w-12 text-terminal-muted" />
        <h1 className="mb-2 text-xl font-bold text-terminal-fg">Sign In Required</h1>
        <Link href="/admin/login" className="text-xs text-terminal-muted underline">Sign In</Link>
      </div>
    );
  }

  if (!guard.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mb-4 inline-block h-12 w-12 text-red-400" />
        <h1 className="mb-2 text-xl font-bold text-terminal-fg">Not Authorized</h1>
      </div>
    );
  }

  const client = getAdminClient();
  if (!client) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mb-4 inline-block h-12 w-12 text-amber-500" />
        <h1 className="mb-2 text-xl font-bold text-terminal-fg">Admin Not Configured</h1>
        <p className="text-xs text-terminal-dim">Set Supabase environment variables to enable the admin panel.</p>
      </div>
    );
  }

  const { data: imports } = await client
    .from("external_project_imports")
    .select("id, source_name, source_url, status, import_fingerprint, quarantine_reason_code, quarantine_details, last_imported_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = imports ?? [];
  const summary = summarizeImportRows(rows);
  const activeReasons = Object.entries(summary.reasons).filter(([, count]) => count > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-xs text-terminal-dim hover:text-terminal-muted transition-colors">
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Download className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">External Imports</h1>
        <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-dim">
          {(imports || []).length}
        </span>
      </div>

      <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-terminal-dim">
            Source: <span className="text-terminal-muted">fermatmind/88cn-index-data</span>
          </span>
          <span className="text-terminal-dim">|</span>
          <span className="text-terminal-dim">
            Last sync: <span className="text-terminal-muted">Manual trigger only</span>
          </span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {[
            ["total", summary.total],
            ["pending review", summary.accepted],
            ["quarantined", summary.quarantined],
            ["duplicates", summary.duplicates],
            ["rejected", summary.rejected],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-md border border-terminal-border bg-terminal-bg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-terminal-dim">{label}</div>
              <div className="mt-1 font-mono text-sm text-terminal-fg">{String(value)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-terminal-border bg-terminal-bg p-3">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-terminal-dim">Reason counts</div>
          {activeReasons.length === 0 ? (
            <p className="text-[10px] text-terminal-dim">No quarantine reasons recorded.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeReasons.map(([reason, count]) => (
                <span key={reason} className="rounded border border-terminal-border px-2 py-1 font-mono text-[10px] text-terminal-muted">
                  {reason}: {count}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <form action="/api/admin/external-imports/sync" method="post">
            <input type="hidden" name="source" value="local" />
            <input type="hidden" name="dry_run" value="true" />
            <button type="submit" className="inline-flex items-center gap-1 rounded-md border border-terminal-border px-3 py-1 text-[10px] font-medium text-terminal-muted hover:text-terminal-fg hover:bg-terminal-surface transition-colors">
              <RefreshCw className="h-3 w-3" />
              Dry Run (Local)
            </button>
          </form>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-xs text-terminal-dim">No external imports staged yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((imp: Record<string, unknown>) => (
            <div
              key={String(imp.id)}
              className="flex items-center justify-between rounded-lg border border-terminal-border bg-terminal-surface p-3 text-xs"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-terminal-fg font-medium">
                  {String(imp.source_url || imp.id).slice(0, 40)}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-terminal-dim">
                  <span>{String(imp.source_name || "—")}</span>
                  <span className="rounded border border-terminal-border px-1 py-0.5 text-[10px]">
                    {String(imp.status || "—")}
                  </span>
                  {imp.quarantine_reason_code ? (
                    <span className="rounded border border-amber-500/30 px-1 py-0.5 text-[10px] text-amber-300">
                      {String(imp.quarantine_reason_code)}
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 text-[10px] text-terminal-dim ml-2">
                {imp.created_at ? new Date(String(imp.created_at)).toLocaleDateString() : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
