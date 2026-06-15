-- 88CN Supabase Schema v0
-- Migration: 002_audit_notification
-- Description: Add audit_events and notification_events tables
-- Date: 2026-06-15

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_source text not null,
  event_payload jsonb not null default '{}'::jsonb,
  request_id text,
  created_at timestamptz not null default now()
);

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  recipient_hint text,
  payload jsonb not null default '{}'::jsonb,
  is_sent boolean not null default false,
  request_id text,
  created_at timestamptz not null default now()
);

create index idx_audit_events_event_source on public.audit_events(event_source);
create index idx_audit_events_created_at on public.audit_events(created_at desc);
create index idx_notification_events_event_type on public.notification_events(event_type);
create index idx_notification_events_created_at on public.notification_events(created_at desc);

alter table public.audit_events enable row level security;
alter table public.notification_events enable row level security;

-- Anonymous insert allowed; no select for anon
create policy "audit_events_insert_anon"
  on public.audit_events
  for insert
  to anon
  with check (true);

create policy "notification_events_insert_anon"
  on public.notification_events
  for insert
  to anon
  with check (true);

-- Admin select only
create policy "audit_events_select_admin"
  on public.audit_events
  for select
  to authenticated
  using (public.is_admin());

create policy "notification_events_select_admin"
  on public.notification_events
  for select
  to authenticated
  using (public.is_admin());
