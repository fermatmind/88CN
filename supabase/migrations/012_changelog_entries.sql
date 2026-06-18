-- Migration: 012_changelog_entries
-- Description: Admin-staged changelog entries with no public publication side effects.

create table if not exists public.project_changelog_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  status text not null default 'draft'
    check (status in (
      'draft',
      'staged',
      'pending_review',
      'approved_for_publication',
      'needs_info',
      'rejected',
      'archived'
    )),
  change_type text not null
    check (change_type in ('product', 'source', 'lifecycle', 'editorial')),
  title text not null,
  body text not null,
  source_summary jsonb not null default '{}'::jsonb,
  public_visible boolean not null default false
    check (public_visible = false),
  affects_signal_score boolean not null default false
    check (affects_signal_score = false),
  affects_source_confidence boolean not null default false
    check (affects_source_confidence = false),
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_project_changelog_entries_updated_at
  before update on public.project_changelog_entries
  for each row execute function public.set_updated_at();

create index if not exists idx_project_changelog_entries_project_created
  on public.project_changelog_entries(project_id, created_at desc);

create index if not exists idx_project_changelog_entries_status
  on public.project_changelog_entries(status, change_type);

alter table public.project_changelog_entries enable row level security;

create policy "project_changelog_entries_select_admin"
  on public.project_changelog_entries
  for select
  to authenticated
  using (public.is_admin());

create policy "project_changelog_entries_insert_admin"
  on public.project_changelog_entries
  for insert
  to authenticated
  with check (public.is_admin());

create policy "project_changelog_entries_update_admin"
  on public.project_changelog_entries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.project_changelog_entries is
  'Admin-staged changelog entries. PR53 keeps public_visible false and does not mutate scoring or source confidence.';
