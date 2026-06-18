import { checkAdminGuard } from "@/lib/auth/admin";
import { getEditorialDrafts } from "@/lib/admin/editorial-draft-queries";
import { siteTitle, noIndex } from "@/lib/seo";
import { ArrowLeft, Edit3, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Admin - Editorial Drafts"),
  ...noIndex(),
};

export default async function AdminEditorialPage() {
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

  const drafts = await getEditorialDrafts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/admin" className="text-xs text-terminal-dim hover:text-terminal-muted transition-colors">
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Edit3 className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">Editorial Drafts</h1>
        <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-dim">
          {drafts.length}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <p className="text-xs leading-relaxed text-terminal-dim">
          Editorial notes remain internal drafts until a human admin review is recorded. This page does not publish,
          index, or expose project data through public endpoints.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-xs text-terminal-dim">No editorial drafts awaiting review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div key={draft.id} className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-terminal-fg">
                    {draft.draft_title ?? draft.projects?.name ?? "Untitled draft"}
                  </h2>
                  <p className="text-[10px] text-terminal-dim">
                    {draft.projects?.slug ?? draft.project_id} / {draft.status}
                  </p>
                </div>
                <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-dim">
                  Draft-only
                </span>
              </div>
              <p className="mb-3 line-clamp-4 text-xs leading-relaxed text-terminal-dim">
                {draft.draft_note}
              </p>
              {draft.draft_growth_opportunity && (
                <p className="text-[10px] leading-relaxed text-terminal-muted">
                  {draft.draft_growth_opportunity}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
