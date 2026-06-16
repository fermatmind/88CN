-- 88CN Supabase Schema v0
-- Migration: 006_external_import_indexes
-- Description: Add fingerprint column and performance indexes for external_project_imports
-- Date: 2026-06-16

-- Add import_fingerprint column for idempotent duplicate detection
alter table public.external_project_imports
  add column if not exists import_fingerprint text;

-- Unique partial index on fingerprint (only non-null values)
create unique index if not exists idx_external_project_imports_fingerprint
  on public.external_project_imports (import_fingerprint)
  where import_fingerprint is not null;

-- Index for listing imports by status and date
create index if not exists idx_external_project_imports_status_created_at
  on public.external_project_imports (status, created_at desc);

-- Index on source_name for filtering by source repo
create index if not exists idx_external_project_imports_source_name
  on public.external_project_imports (source_name);
