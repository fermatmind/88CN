-- 88CN Supabase Schema v0
-- Migration: 003_admin_users
-- Description: Add admin_users table and update is_admin() to support user-based admin
-- Date: 2026-06-15

-- Table: admin_users — maps auth.users UUIDs to admin role
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  granted_by text,
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Replace is_admin() to check both service_role and admin_users
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- service_role always passes
  if coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role',
    ''
  ) = 'service_role' then
    return true;
  end if;

  -- Check admin_users table for authenticated users
  if auth.uid() is not null then
    return exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    );
  end if;

  return false;
end;
$$;

-- RLS: no public access
alter table public.admin_users enable row level security;

-- Only admins can read admin_users (via is_admin)
create policy "admin_users_select_admin"
  on public.admin_users
  for select
  to authenticated
  using (public.is_admin());

create policy "admin_users_all_service_role"
  on public.admin_users
  for all
  to authenticated
  using (coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role',
    ''
  ) = 'service_role');
