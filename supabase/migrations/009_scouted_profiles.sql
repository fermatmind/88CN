-- Migration: 009_scouted_profiles
-- Description: Admin-reviewed scouted profile state and intent records.

create table if not exists public.scouted_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text,
  github_url text,
  observed_source_urls text[] not null default '{}'::text[],
  public_summary text,
  source_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'observed'
    check (status in ('observed', 'pending_review', 'approved_for_project', 'rejected', 'removed', 'archived')),
  index_status text not null default 'noindex'
    check (index_status in ('noindex', 'preview_noindex')),
  project_id uuid references public.projects(id) on delete set null,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_scouted_profiles_updated_at
  before update on public.scouted_profiles
  for each row execute function public.set_updated_at();

create index if not exists idx_scouted_profiles_status_created_at
  on public.scouted_profiles(status, created_at desc);

create index if not exists idx_scouted_profiles_project_id
  on public.scouted_profiles(project_id)
  where project_id is not null;

alter table public.scouted_profiles enable row level security;

create policy "scouted_profiles_select_admin"
  on public.scouted_profiles
  for select
  to authenticated
  using (public.is_admin());

create policy "scouted_profiles_insert_admin"
  on public.scouted_profiles
  for insert
  to authenticated
  with check (public.is_admin());

create policy "scouted_profiles_update_admin"
  on public.scouted_profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.scouted_profile_intents (
  id uuid primary key default gen_random_uuid(),
  scouted_profile_id uuid not null references public.scouted_profiles(id) on delete cascade,
  intent_type text not null check (intent_type in ('claim', 'correct', 'remove')),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected', 'needs_info', 'archived')),
  payload_summary jsonb not null default '{}'::jsonb,
  reviewer_note text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_scouted_profile_intents_updated_at
  before update on public.scouted_profile_intents
  for each row execute function public.set_updated_at();

create index if not exists idx_scouted_profile_intents_profile_status
  on public.scouted_profile_intents(scouted_profile_id, status);

alter table public.scouted_profile_intents enable row level security;

create policy "scouted_profile_intents_select_admin"
  on public.scouted_profile_intents
  for select
  to authenticated
  using (public.is_admin());

create policy "scouted_profile_intents_insert_admin"
  on public.scouted_profile_intents
  for insert
  to authenticated
  with check (public.is_admin());

create policy "scouted_profile_intents_update_admin"
  on public.scouted_profile_intents
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.scouted_profiles is
  'Admin-only observed project profiles. Default noindex state; no sitemap or public API exposure.';

comment on table public.scouted_profile_intents is
  'Admin-reviewed claim, correction, and removal intents for scouted profiles. Intents do not automatically mutate projects.';
