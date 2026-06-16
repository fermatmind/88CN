-- 88CN Supabase Schema v0
-- Migration: 004_needs_info_status
-- Description: Add needs_info status to project_submissions and project_claims
-- Date: 2026-06-15

-- project_submissions: add needs_info status
alter table public.project_submissions
  drop constraint if exists project_submissions_status_check;

alter table public.project_submissions
  add constraint project_submissions_status_check
  check (status in ('pending_review', 'approved', 'rejected', 'duplicate', 'needs_info'));

-- project_claims: add needs_info status
alter table public.project_claims
  drop constraint if exists project_claims_status_check;

alter table public.project_claims
  add constraint project_claims_status_check
  check (status in ('pending', 'under_review', 'approved', 'rejected', 'needs_info'));
