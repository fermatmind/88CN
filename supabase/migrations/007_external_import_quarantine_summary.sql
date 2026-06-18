alter table public.external_project_imports
  drop constraint if exists external_project_imports_status_check;

alter table public.external_project_imports
  add constraint external_project_imports_status_check
  check (status in ('pending_review', 'approved', 'rejected', 'partial', 'error', 'quarantined', 'duplicate', 'imported'));

alter table public.external_project_imports
  add column if not exists quarantine_reason_code text,
  add column if not exists quarantine_details jsonb not null default '{}'::jsonb,
  add column if not exists last_imported_at timestamptz;

create index if not exists idx_external_project_imports_quarantine_reason
  on public.external_project_imports(quarantine_reason_code)
  where quarantine_reason_code is not null;

create index if not exists idx_external_project_imports_last_imported
  on public.external_project_imports(last_imported_at desc)
  where last_imported_at is not null;

comment on column public.external_project_imports.quarantine_details is
  'Sanitized import issue summary for admin review. Do not store raw private values.';
