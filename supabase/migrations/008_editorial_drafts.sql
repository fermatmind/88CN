-- Migration: 008_editorial_drafts
-- Description: Draft-only editorial review records for admin approval.

create table if not exists public.editorial_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_job_id uuid references public.project_editorial_jobs(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'approved_for_publication', 'needs_info', 'rejected', 'archived')),
  draft_title text,
  draft_note text not null,
  draft_growth_opportunity text,
  draft_source_summary jsonb not null default '{}'::jsonb,
  reviewer_note text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_editorial_drafts_updated_at
  before update on public.editorial_drafts
  for each row execute function public.set_updated_at();

create index if not exists idx_editorial_drafts_project_id
  on public.editorial_drafts(project_id);

create index if not exists idx_editorial_drafts_status_created_at
  on public.editorial_drafts(status, created_at desc);

alter table public.editorial_drafts enable row level security;

create policy "editorial_drafts_select_admin"
  on public.editorial_drafts
  for select
  to authenticated
  using (public.is_admin());

create policy "editorial_drafts_insert_admin"
  on public.editorial_drafts
  for insert
  to authenticated
  with check (public.is_admin());

create policy "editorial_drafts_update_admin"
  on public.editorial_drafts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.editorial_drafts is
  'Admin-only editorial drafts. Approval here does not publish a project, alter sitemap, or expose public API data.';
