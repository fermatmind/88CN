import { checkAdminGuard } from "@/lib/auth/admin";
import { getApiKeyShellFlags } from "@/lib/api-keys/flags";
import { noIndex, siteTitle } from "@/lib/seo";
import { ArrowLeft, KeyRound, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Admin - API Keys"),
  ...noIndex(),
};

export default async function AdminApiKeysPage() {
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

  const flagRows = Object.entries(getApiKeyShellFlags());

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-xs text-terminal-dim transition-colors hover:text-terminal-muted"
        >
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Dashboard
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">
          API Key Access
        </h1>
      </div>

      <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-surface p-5">
        <h2 className="mb-2 text-sm font-semibold text-terminal-fg">
          Disabled Shell
        </h2>
        <p className="text-xs leading-relaxed text-terminal-dim">
          Alpha Data Feed API key issuance is disabled. No real keys exist in
          this shell, and future access requires admin review plus an explicit
          human checkpoint.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {flagRows.map(([name, enabled]) => (
          <div
            key={name}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-4"
          >
            <div className="mb-1 font-mono text-[11px] text-terminal-muted">
              {name}
            </div>
            <div className="text-xs text-terminal-dim">
              {enabled ? "enabled in environment" : "disabled"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-terminal-border bg-terminal-surface p-4 text-xs leading-relaxed text-terminal-dim">
        This page does not list customers, does not list keys, does not create
        keys, does not submit forms, and does not call an API key issuance
        endpoint.
      </div>
    </div>
  );
}
