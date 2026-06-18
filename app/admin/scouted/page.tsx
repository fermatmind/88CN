import { checkAdminGuard } from "@/lib/auth/admin";
import { getScoutedProfiles } from "@/lib/scouted/admin-queries";
import { siteTitle, noIndex } from "@/lib/seo";
import { ScoutedProfileStatus } from "@/components/scouted/scouted-profile-status";
import { ArrowLeft, SearchCheck, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Admin - Scouted Profiles"),
  ...noIndex(),
};

export default async function AdminScoutedProfilesPage() {
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

  const profiles = await getScoutedProfiles();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/admin" className="text-xs text-terminal-dim hover:text-terminal-muted transition-colors">
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <SearchCheck className="h-4 w-4 text-terminal-muted" />
        <h1 className="text-lg font-bold tracking-tight text-terminal-fg">Scouted Profiles</h1>
        <span className="rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-mono text-terminal-dim">
          {profiles.length}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <p className="text-xs leading-relaxed text-terminal-dim">
          Scouted profiles are observed public-source records. They remain noindex, outside sitemap, and outside public
          API surfaces until a separate reviewed project workflow promotes them.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-xs text-terminal-dim">No scouted profiles awaiting review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-terminal-fg">{profile.name}</h2>
                  <p className="text-[10px] text-terminal-dim">{profile.slug}</p>
                </div>
                <ScoutedProfileStatus status={profile.status} indexStatus={profile.index_status} />
              </div>
              {profile.public_summary && (
                <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-terminal-dim">
                  {profile.public_summary}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-[10px] text-terminal-muted">
                {profile.website_url && <span>{profile.website_url.replace(/^https?:\/\//, "")}</span>}
                {profile.github_url && <span>{profile.github_url.replace(/^https?:\/\//, "")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
