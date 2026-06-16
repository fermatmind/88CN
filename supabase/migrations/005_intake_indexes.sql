-- 88CN Supabase Schema v0
-- Migration: 005_intake_indexes
-- Description: Add performance indexes for submission/claim intake and public queries
-- Date: 2026-06-15

-- Submissions: filter by status + ordered by date
create index if not exists idx_project_submissions_status_created_at
  on public.project_submissions (status, created_at desc);

-- Claims: filter by status + ordered by date
create index if not exists idx_project_claims_status_created_at
  on public.project_claims (status, created_at desc);

-- Projects: partial index for public indexable slug lookups
create index if not exists idx_projects_public_slug
  on public.projects (slug)
  where index_status in ('indexable', 'archived_indexable');

-- Projects: combined status + index_status for admin queries
create index if not exists idx_projects_status_index_status
  on public.projects (status, index_status);

-- Audit events: lookups by event type + entity + date
create index if not exists idx_audit_events_type_entity_created_at
  on public.audit_events (event_type, event_source, created_at desc);

-- Notification events: filter by sent status + ordered by date
create index if not exists idx_notification_events_sent_created_at
  on public.notification_events (is_sent, created_at desc);
