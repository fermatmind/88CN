import { checkAdminGuard } from "@/lib/auth/admin";
import { getPendingClaims } from "@/lib/admin/review-queries";
import { siteTitle, noIndex } from "@/lib/seo";
import { Shield, ShieldAlert, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReviewActions from "@/app/admin/submissions/review-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Admin — Claims"),
  ...noIndex(),
};

export default async function AdminClaimsPage() {
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

  const claims = await getPendingClaims();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-xs text-terminal-dim hover:text-terminal-muted transition-colors">
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">Claims</h1>
        <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-dim">
          {claims.length}
        </span>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-xs text-terminal-dim">No pending claims.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-lg border border-terminal-border bg-terminal-surface p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-sm font-semibold text-terminal-fg">
                    Claim #{claim.id.slice(0, 8)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="rounded border border-terminal-border px-1.5 py-0.5 text-terminal-muted">
                      {claim.claim_method}
                    </span>
                    {claim.project_id && (
                      <span className="text-terminal-dim">
                        Project: {claim.project_id.slice(0, 8)}
                      </span>
                    )}
                  </div>
                  {claim.claim_evidence && (
                    <p className="text-[10px] text-terminal-dim line-clamp-2">
                      {claim.claim_evidence}
                    </p>
                  )}
                  <div className="text-[10px] text-terminal-dim">
                    {claim.created_at ? new Date(claim.created_at).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div className="shrink-0">
                  <ReviewActions claimId={claim.id} type="claim" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
