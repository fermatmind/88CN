-- Migration: 011_lifecycle_alerts
-- Description: Admin-reviewed lifecycle archive snapshots and disabled signal alert rules.

create table if not exists public.project_lifecycle_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  previous_status text not null,
  archive_status text not null
    check (archive_status in ('inactive_warning', 'candidate_archive', 'archived_research', 'archived_noindex')),
  index_status text not null default 'noindex'
    check (index_status in ('noindex', 'archived_indexable')),
  public_record_action text not null default 'keep_public_snapshot'
    check (public_record_action = 'keep_public_snapshot'),
  snapshot_payload jsonb not null default '{}'::jsonb,
  private_payload_included boolean not null default false,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_project_lifecycle_snapshots_updated_at
  before update on public.project_lifecycle_snapshots
  for each row execute function public.set_updated_at();

create index if not exists idx_project_lifecycle_snapshots_project_created
  on public.project_lifecycle_snapshots(project_id, created_at desc);

alter table public.project_lifecycle_snapshots enable row level security;

create policy "project_lifecycle_snapshots_select_admin"
  on public.project_lifecycle_snapshots
  for select
  to authenticated
  using (public.is_admin());

create policy "project_lifecycle_snapshots_insert_admin"
  on public.project_lifecycle_snapshots
  for insert
  to authenticated
  with check (public.is_admin());

create policy "project_lifecycle_snapshots_update_admin"
  on public.project_lifecycle_snapshots
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.signal_alert_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  alert_type text not null
    check (alert_type in ('source_stale', 'lifecycle_inactive', 'archive_candidate')),
  status text not null default 'disabled'
    check (status in ('disabled', 'draft', 'admin_review')),
  transport text not null default 'none'
    check (transport = 'none'),
  external_delivery_allowed boolean not null default false
    check (external_delivery_allowed = false),
  private_contact_payload jsonb,
  last_evaluated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, alert_type)
);

create trigger trg_signal_alert_rules_updated_at
  before update on public.signal_alert_rules
  for each row execute function public.set_updated_at();

create index if not exists idx_signal_alert_rules_status
  on public.signal_alert_rules(status, alert_type);

alter table public.signal_alert_rules enable row level security;

create policy "signal_alert_rules_select_admin"
  on public.signal_alert_rules
  for select
  to authenticated
  using (public.is_admin());

create policy "signal_alert_rules_insert_admin"
  on public.signal_alert_rules
  for insert
  to authenticated
  with check (public.is_admin());

create policy "signal_alert_rules_update_admin"
  on public.signal_alert_rules
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.project_lifecycle_snapshots is
  'Admin-reviewed historical project snapshots. Public history is preserved and private payloads are excluded.';

comment on table public.signal_alert_rules is
  'Disabled-by-default signal alert rules. V0 has no external delivery transport.';
