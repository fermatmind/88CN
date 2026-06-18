-- Migration: 010_conversion_metrics
-- Description: Aggregate conversion counters and pivot gate snapshots.

create table if not exists public.conversion_metric_daily_counts (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null
    check (metric_key in ('report_view', 'geo_checker_run', 'project_submission', 'project_claim')),
  surface text not null
    check (surface ~ '^/[a-z0-9][a-z0-9/_-]{0,127}$' and position('//' in surface) = 0),
  bucket_date date not null default current_date,
  count_total integer not null default 0 check (count_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (metric_key, surface, bucket_date)
);

create trigger trg_conversion_metric_daily_counts_updated_at
  before update on public.conversion_metric_daily_counts
  for each row execute function public.set_updated_at();

create index if not exists idx_conversion_metric_daily_counts_key_date
  on public.conversion_metric_daily_counts(metric_key, bucket_date desc);

alter table public.conversion_metric_daily_counts enable row level security;

create policy "conversion_metric_daily_counts_select_admin"
  on public.conversion_metric_daily_counts
  for select
  to authenticated
  using (public.is_admin());

create policy "conversion_metric_daily_counts_insert_admin"
  on public.conversion_metric_daily_counts
  for insert
  to authenticated
  with check (public.is_admin());

create policy "conversion_metric_daily_counts_update_admin"
  on public.conversion_metric_daily_counts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.conversion_pivot_gate_snapshots (
  id uuid primary key default gen_random_uuid(),
  day_mark integer not null check (day_mark in (30, 60, 100)),
  status text not null default 'collecting'
    check (status in ('collecting', 'ready_for_review', 'continue_recommended', 'redesign_recommended')),
  report_view_count integer not null default 0 check (report_view_count >= 0),
  geo_checker_run_count integer not null default 0 check (geo_checker_run_count >= 0),
  project_submission_count integer not null default 0 check (project_submission_count >= 0),
  project_claim_count integer not null default 0 check (project_claim_count >= 0),
  review_note text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_conversion_pivot_gate_snapshots_updated_at
  before update on public.conversion_pivot_gate_snapshots
  for each row execute function public.set_updated_at();

create index if not exists idx_conversion_pivot_gate_snapshots_day_status
  on public.conversion_pivot_gate_snapshots(day_mark, status);

alter table public.conversion_pivot_gate_snapshots enable row level security;

create policy "conversion_pivot_gate_snapshots_select_admin"
  on public.conversion_pivot_gate_snapshots
  for select
  to authenticated
  using (public.is_admin());

create policy "conversion_pivot_gate_snapshots_insert_admin"
  on public.conversion_pivot_gate_snapshots
  for insert
  to authenticated
  with check (public.is_admin());

create policy "conversion_pivot_gate_snapshots_update_admin"
  on public.conversion_pivot_gate_snapshots
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.conversion_metric_daily_counts is
  'Admin-only aggregate conversion counters. Stores no email, IP address, user agent, cookie, or personal founder payload.';

comment on table public.conversion_pivot_gate_snapshots is
  'Admin-only Day 30, Day 60, and Day 100 pivot gate snapshots from aggregate counters.';
