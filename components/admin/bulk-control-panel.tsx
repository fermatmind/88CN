import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Filter,
  Search,
  Shield,
  GitPullRequestArrow,
} from "lucide-react";
import Link from "next/link";
import {
  BULK_ISSUE_FILTERS,
  BULK_LIFECYCLE_STATUSES,
  BULK_REVIEW_STATES,
  type BulkControlPanelData,
  type BulkControlPanelFilters,
  type BulkControlPanelRow,
} from "@/lib/admin/bulk-control-panel";

export function BulkControlPanel({
  data,
  filters,
}: {
  data: BulkControlPanelData;
  filters: BulkControlPanelFilters;
}) {
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 border-b border-terminal-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Database className="h-4 w-4 text-terminal-muted" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-terminal-fg">
            Bulk Review
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-terminal-dim">
            Internal review queue for backstage project entities. This surface is
            guarded by admin auth, does not publish records, and does not expose
            unreviewed records to public routes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-terminal-dim">
          <span className="inline-flex items-center gap-1 rounded-md border border-terminal-border px-2 py-1">
            <Shield className="h-3 w-3" />
            Admin only
          </span>
          <span className="rounded-md border border-terminal-border px-2 py-1">
            Read only
          </span>
        </div>
      </div>

      <BulkFilters filters={filters} />

      {data.mode === "unavailable" ? (
        <UnavailablePanel error={data.error} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between text-xs text-terminal-dim">
            <span>
              Showing {data.rows.length} of {data.total} matching records
            </span>
            <span>
              Page {data.page} / {totalPages}
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-terminal-border">
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full border-collapse text-left">
                <thead className="bg-terminal-surface text-[10px] uppercase tracking-widest text-terminal-dim">
                  <tr>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Entity Scope</th>
                    <th className="px-4 py-3 font-medium">Source Links</th>
                    <th className="px-4 py-3 font-medium">Signal Preview</th>
                    <th className="px-4 py-3 font-medium">Review Flags</th>
                    <th className="px-4 py-3 font-medium">Manual State</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs text-terminal-dim">
                        No records match the current filters.
                      </td>
                    </tr>
                  ) : (
                    data.rows.map((row) => <BulkRow key={row.id} row={row} />)
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination filters={filters} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}

function BulkFilters({ filters }: { filters: BulkControlPanelFilters }) {
  return (
    <form className="mb-6 grid gap-3 rounded-lg border border-terminal-border bg-terminal-surface p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
      <label className="block">
        <span className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-terminal-dim">
          <Search className="h-3 w-3" />
          Search
        </span>
        <input
          name="q"
          defaultValue={filters.search}
          placeholder="Name, normalized key, org, product"
          className="h-9 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 text-xs text-terminal-fg outline-none focus:border-terminal-muted"
        />
      </label>
      <SelectFilter
        label="Lifecycle"
        name="lifecycle"
        value={filters.lifecycleStatus}
        options={BULK_LIFECYCLE_STATUSES}
      />
      <SelectFilter
        label="Review"
        name="review"
        value={filters.reviewState}
        options={BULK_REVIEW_STATES}
      />
      <SelectFilter
        label="Flag"
        name="issue"
        value={filters.issueFilter}
        options={BULK_ISSUE_FILTERS}
      />
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-terminal-border px-3 text-xs font-medium text-terminal-fg transition-colors hover:bg-terminal-bg"
        >
          <Filter className="h-3.5 w-3.5" />
          Apply
        </button>
        <Link
          href="/admin/bulk-review"
          className="inline-flex h-9 items-center rounded-md border border-terminal-border px-3 text-xs text-terminal-dim transition-colors hover:bg-terminal-bg hover:text-terminal-fg"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}

function SelectFilter({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-widest text-terminal-dim">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-9 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 text-xs text-terminal-fg outline-none focus:border-terminal-muted"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function BulkRow({ row }: { row: BulkControlPanelRow }) {
  return (
    <tr className="border-t border-terminal-border align-top">
      <td className="px-4 py-4">
        <div className="text-sm font-semibold text-terminal-fg">{row.displayName}</div>
        <div className="mt-1 font-mono text-[10px] text-terminal-dim">{row.normalizedName}</div>
        <div className="mt-2 text-[10px] text-terminal-dim">
          Updated {formatDate(row.updatedAt)}
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusChip label={row.lifecycleStatus} />
        <div className="mt-2">
          <StatusChip label={row.reviewState} muted />
        </div>
      </td>
      <td className="px-4 py-4 text-xs text-terminal-dim">
        <div>Org: <span className="text-terminal-muted">{row.organizationName}</span></div>
        <div>Product: <span className="text-terminal-muted">{row.productName}</span></div>
        <div>Category: <span className="text-terminal-muted">{row.primaryCategory}</span></div>
        <div>Class: <span className="text-terminal-muted">{row.openSourceOrCommercial}</span></div>
        {row.collectionTags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {row.collectionTags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md border border-terminal-border px-1.5 py-0.5 text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          {row.sourceLinks.length === 0 ? (
            <span className="text-xs text-terminal-dim">Source unavailable</span>
          ) : (
            row.sourceLinks.map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url}
                rel="noreferrer"
                target="_blank"
                className="flex max-w-[260px] items-center gap-1 truncate text-xs text-terminal-muted hover:text-terminal-fg"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span className="truncate">{link.label}</span>
                <span className="shrink-0 text-[10px] text-terminal-dim">({link.role})</span>
              </a>
            ))
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex max-w-[220px] flex-wrap gap-1">
          {row.publicSignalChips.length === 0 ? (
            <span className="text-xs text-terminal-dim">Not enough data</span>
          ) : (
            row.publicSignalChips.map((chip) => (
              <span key={chip} className="rounded-md border border-terminal-border px-1.5 py-0.5 text-[10px] text-terminal-muted">
                {chip.replaceAll("_", " ")}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex max-w-[240px] flex-wrap gap-1">
          {reviewFlags(row).map((flag) => (
            <span key={flag} className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300">
              {flag}
            </span>
          ))}
        </div>
        {row.latestReview ? (
          <div className="mt-3 max-w-[240px] text-[10px] leading-relaxed text-terminal-dim">
            Last: {row.latestReview.decision} on {formatDate(row.latestReview.createdAt)}
            <div className="truncate">{row.latestReview.reason}</div>
          </div>
        ) : null}
      </td>
      <td className="px-4 py-4">
        <form action={`/api/admin/project-entities/${row.id}/review-state`} method="post" className="w-[230px] space-y-2">
          <select
            name="next_state"
            required
            className="h-8 w-full rounded-md border border-terminal-border bg-terminal-bg px-2 text-xs text-terminal-fg outline-none focus:border-terminal-muted"
            defaultValue=""
          >
            <option value="" disabled>
              Select state
            </option>
            <option value="review_ready">review ready</option>
            <option value="published">published</option>
            <option value="quarantined">quarantined</option>
            <option value="rejected">rejected</option>
            <option value="stale">stale</option>
            <option value="archived">archived</option>
          </select>
          <input
            name="decision_reason"
            required
            minLength={8}
            placeholder="Decision reason"
            className="h-8 w-full rounded-md border border-terminal-border bg-terminal-bg px-2 text-xs text-terminal-fg outline-none focus:border-terminal-muted"
          />
          <div className="grid grid-cols-2 gap-1 text-[10px] text-terminal-dim">
            <label className="flex items-center gap-1">
              <input type="checkbox" name="reviewed_fields" value="identity" />
              Identity
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" name="reviewed_fields" value="sources" />
              Sources
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" name="reviewed_fields" value="canonical" />
              Canonical
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" name="reviewed_fields" value="reachability" />
              Reachability
            </label>
          </div>
          <label className="flex items-center gap-1 text-[10px] text-terminal-dim">
            <input type="checkbox" name="original_summary_checked" />
            Original summary checked
          </label>
          <label className="flex items-center gap-1 text-[10px] text-terminal-dim">
            <input type="checkbox" name="public_fields_checked" />
            Public fields checked
          </label>
          <button
            type="submit"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-terminal-border px-2 text-xs font-medium text-terminal-fg transition-colors hover:bg-terminal-surface"
          >
            <GitPullRequestArrow className="h-3.5 w-3.5" />
            Record
          </button>
        </form>
      </td>
    </tr>
  );
}

function StatusChip({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={
        muted
          ? "inline-flex rounded-md border border-terminal-border px-2 py-0.5 text-[10px] text-terminal-dim"
          : "inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300"
      }
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}

function UnavailablePanel({ error }: { error?: string }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
        <AlertTriangle className="h-4 w-4" />
        Bulk review data unavailable
      </div>
      <p className="text-xs leading-relaxed text-terminal-dim">
        The admin surface is present, but the staging/admin data adapter is not
        available in this environment. No fixture product data is shown and no
        public route is exposed.
      </p>
      {error ? <p className="mt-3 font-mono text-[10px] text-terminal-dim">{error}</p> : null}
    </div>
  );
}

function Pagination({
  filters,
  totalPages,
}: {
  filters: BulkControlPanelFilters;
  totalPages: number;
}) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <PageLink
        disabled={filters.page <= 1}
        href={buildPageHref(filters, filters.page - 1)}
        label="Previous"
        icon="prev"
      />
      <PageLink
        disabled={filters.page >= totalPages}
        href={buildPageHref(filters, filters.page + 1)}
        label="Next"
        icon="next"
      />
    </div>
  );
}

function PageLink({
  href,
  label,
  icon,
  disabled,
}: {
  href: string;
  label: string;
  icon: "prev" | "next";
  disabled: boolean;
}) {
  const content = (
    <>
      {icon === "prev" ? <ChevronLeft className="h-3.5 w-3.5" /> : null}
      {label}
      {icon === "next" ? <ChevronRight className="h-3.5 w-3.5" /> : null}
    </>
  );

  if (disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border px-3 py-1.5 text-xs text-terminal-dim opacity-50">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border px-3 py-1.5 text-xs text-terminal-muted transition-colors hover:bg-terminal-surface hover:text-terminal-fg"
    >
      {content}
    </Link>
  );
}

function buildPageHref(filters: BulkControlPanelFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.lifecycleStatus) params.set("lifecycle", filters.lifecycleStatus);
  if (filters.reviewState) params.set("review", filters.reviewState);
  if (filters.issueFilter) params.set("issue", filters.issueFilter);
  params.set("page", String(page));
  return `/admin/bulk-review?${params.toString()}`;
}

function reviewFlags(row: BulkControlPanelRow) {
  return [
    row.flags.missingDocs ? "missing docs" : "",
    row.flags.canonicalReview ? "canonical review" : "",
    row.flags.reachabilityReview ? "reachability review" : "",
    row.flags.quarantined ? "quarantined" : "",
    row.flags.rejected ? "rejected" : "",
    row.flags.stale ? "stale" : "",
    row.flags.published ? "published" : "",
  ].filter(Boolean);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
