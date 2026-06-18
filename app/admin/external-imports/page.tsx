import { checkAdminGuard } from "@/lib/auth/admin";
import { getAdminClient } from "@/lib/supabase/admin-server";
import { siteTitle, noIndex } from "@/lib/seo";
import { Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { summarizeImportRows } from "@/lib/index-data/import-summary";
import {
  ExternalImportSummary,
  type ExternalImportRowView,
} from "@/components/admin/external-import-summary";

export const metadata: Metadata = {
  title: siteTitle("Admin — External Imports"),
  ...noIndex(),
};

function isDevFixtureEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_EXTERNAL_IMPORTS_FIXTURE === "1";
}

function getFixtureRows(): ExternalImportRowView[] {
  return [
    {
      id: "fixture-pending",
      source_name: "local",
      source_url: "data/projects/fixture-pending.json",
      status: "pending_review",
      created_at: "2026-06-18T00:00:00.000Z",
    },
    {
      id: "fixture-quarantined-url",
      source_name: "local",
      source_url: "data/projects/fixture-invalid-url.json",
      status: "quarantined",
      quarantine_reason_code: "invalid_url",
      created_at: "2026-06-18T00:00:00.000Z",
    },
    {
      id: "fixture-duplicate",
      source_name: "local",
      source_url: "data/projects/fixture-duplicate.json",
      status: "duplicate",
      quarantine_reason_code: "duplicate_slug",
      created_at: "2026-06-18T00:00:00.000Z",
    },
    {
      id: "fixture-rejected",
      source_name: "local",
      source_url: "data/projects/fixture-rejected.json",
      status: "rejected",
      quarantine_reason_code: "malformed_payload",
      created_at: "2026-06-18T00:00:00.000Z",
    },
  ];
}

export default async function ExternalImportsPage() {
  if (isDevFixtureEnabled()) {
    const rows = getFixtureRows();
    return (
      <ExternalImportSummary
        rows={rows}
        summary={summarizeImportRows(rows)}
        fixtureMode
      />
    );
  }

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

  return (
    <ExternalImportSummary
      rows={rows as ExternalImportRowView[]}
      summary={summary}
    />
  );
}
