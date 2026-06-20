-- 88CN Supabase Schema
-- Migration: 013_project_contract_staging_schema
-- Description: Staging-only project contract tables for backstage review.
-- Date: 2026-06-21
--
-- Scope:
-- - Schema-only migration for PR184 / PROJECT_CONTRACT_STAGING_SCHEMA_APPLY.
-- - No seed data import.
-- - No production/public read policy.
-- - Fail-closed RLS: admin-only policies on every table.

create table if not exists public.project_entities (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  normalized_name text not null,
  organization_name text,
  product_name text,
  primary_category text,
  collection_tags text[] not null default '{}'::text[],
  open_source_or_commercial text not null default 'unknown'
    check (open_source_or_commercial in ('strict_open_source', 'mixed', 'commercial', 'unknown')),
  lifecycle_status text not null default 'seed_hint'
    check (lifecycle_status in (
      'seed_hint',
      'identity_candidate',
      'canonical_candidate',
      'audit_pending',
      'audit_observation',
      'review_ready',
      'published',
      'stale',
      'archived',
      'quarantined',
      'rejected'
    )),
  review_state text not null default 'not_reviewed'
    check (review_state in (
      'not_reviewed',
      'needs_review',
      'in_review',
      'approved',
      'changes_requested',
      'rejected',
      'published_approved',
      'archived'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (normalized_name, organization_name, product_name)
);

create table if not exists public.source_evidences (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid references public.project_entities(id) on delete cascade,
  source_url text not null,
  source_role text not null default 'unknown',
  source_type text not null default 'unknown',
  is_official_source boolean not null default false,
  observed_at timestamptz not null,
  evidence_hash text not null unique,
  claim_boundary text not null default 'unknown'
    check (claim_boundary in (
      'identity_only',
      'official_docs_link',
      'organization_context',
      'directory_hint_only',
      'audit_observation_source',
      'unknown'
    )),
  visibility text not null default 'backstage_only'
    check (visibility in (
      'private_seed_only',
      'backstage_only',
      'admin_review_only',
      'published_projection',
      'public_chip',
      'public_source_link',
      'never_public'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repo_assets (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  github_url text,
  repo_owner text,
  repo_name text,
  repo_visibility text not null default 'unknown'
    check (repo_visibility in ('public', 'private', 'unknown', 'not_applicable')),
  repo_relationship text not null default 'unknown'
    check (repo_relationship in (
      'primary_repo',
      'official_org_repo',
      'related_repo',
      'model_repo',
      'docs_repo',
      'not_applicable',
      'unknown'
    )),
  source_evidence_id uuid references public.source_evidences(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.web_assets (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  url text not null,
  domain text not null,
  asset_role text not null default 'unknown'
    check (asset_role in (
      'official_website',
      'official_org',
      'docs',
      'api_docs',
      'launch_page',
      'directory_hint',
      'unknown'
    )),
  is_official boolean not null default false,
  source_evidence_id uuid references public.source_evidences(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_observations (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  observation_type text not null,
  observation_value jsonb not null default '{}'::jsonb,
  audit_method text not null default 'not_run',
  checked_at timestamptz,
  ttl_expires_at timestamptz,
  failure_class text,
  audit_observation_hash text,
  visibility text not null default 'backstage_only'
    check (visibility in ('backstage_only', 'admin_review_only', 'public_chip', 'never_public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null references public.project_entities(id) on delete restrict,
  review_state text not null,
  decision text not null
    check (decision in ('needs_review', 'approve_projection', 'reject', 'quarantine', 'archive', 'request_changes')),
  reviewer_ref uuid,
  decision_reason text,
  reviewed_fields jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.published_projections (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null unique references public.project_entities(id) on delete restrict,
  slug text not null unique,
  project_name text not null,
  original_summary text not null,
  official_website_url text not null,
  github_url text,
  docs_url text,
  primary_category text not null,
  collection_tags text[] not null default '{}'::text[],
  open_source_or_commercial text not null,
  public_signal_chips jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz not null,
  lifecycle_status text not null default 'published'
    check (lifecycle_status in ('published', 'stale', 'archived')),
  seo_indexable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (lifecycle_status = 'published' or seo_indexable = false)
);

create table if not exists public.project_collection_links (
  id uuid primary key default gen_random_uuid(),
  project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  collection_slug text not null,
  review_state text not null default 'needs_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_entity_id, collection_slug)
);

create table if not exists public.project_alternative_candidates (
  id uuid primary key default gen_random_uuid(),
  source_project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  target_project_entity_id uuid not null references public.project_entities(id) on delete cascade,
  canonical_pair_key text not null unique,
  review_state text not null default 'needs_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_project_entity_id <> target_project_entity_id)
);

create trigger trg_project_entities_updated_at
  before update on public.project_entities
  for each row execute function public.set_updated_at();

create trigger trg_source_evidences_updated_at
  before update on public.source_evidences
  for each row execute function public.set_updated_at();

create trigger trg_repo_assets_updated_at
  before update on public.repo_assets
  for each row execute function public.set_updated_at();

create trigger trg_web_assets_updated_at
  before update on public.web_assets
  for each row execute function public.set_updated_at();

create trigger trg_audit_observations_updated_at
  before update on public.audit_observations
  for each row execute function public.set_updated_at();

create trigger trg_review_decisions_updated_at
  before update on public.review_decisions
  for each row execute function public.set_updated_at();

create trigger trg_published_projections_updated_at
  before update on public.published_projections
  for each row execute function public.set_updated_at();

create trigger trg_project_collection_links_updated_at
  before update on public.project_collection_links
  for each row execute function public.set_updated_at();

create trigger trg_project_alternative_candidates_updated_at
  before update on public.project_alternative_candidates
  for each row execute function public.set_updated_at();

create index if not exists idx_project_entities_lifecycle_review
  on public.project_entities(lifecycle_status, review_state);

create index if not exists idx_project_entities_normalized_name
  on public.project_entities(normalized_name);

create index if not exists idx_repo_assets_project
  on public.repo_assets(project_entity_id);

create index if not exists idx_web_assets_project_role
  on public.web_assets(project_entity_id, asset_role);

create index if not exists idx_source_evidences_project_claim
  on public.source_evidences(project_entity_id, claim_boundary);

create index if not exists idx_audit_observations_project_checked
  on public.audit_observations(project_entity_id, checked_at desc);

create index if not exists idx_review_decisions_project_created
  on public.review_decisions(project_entity_id, created_at desc);

create index if not exists idx_published_projections_public
  on public.published_projections(slug)
  where lifecycle_status = 'published' and seo_indexable = true;

create index if not exists idx_project_collection_links_collection
  on public.project_collection_links(collection_slug, review_state);

create index if not exists idx_project_alternative_candidates_source
  on public.project_alternative_candidates(source_project_entity_id);

create index if not exists idx_project_alternative_candidates_target
  on public.project_alternative_candidates(target_project_entity_id);

alter table public.project_entities enable row level security;
alter table public.source_evidences enable row level security;
alter table public.repo_assets enable row level security;
alter table public.web_assets enable row level security;
alter table public.audit_observations enable row level security;
alter table public.review_decisions enable row level security;
alter table public.published_projections enable row level security;
alter table public.project_collection_links enable row level security;
alter table public.project_alternative_candidates enable row level security;

create policy "project_entities_select_admin"
  on public.project_entities
  for select
  to authenticated
  using (public.is_admin());

create policy "project_entities_insert_admin"
  on public.project_entities
  for insert
  to authenticated
  with check (public.is_admin());

create policy "project_entities_update_admin"
  on public.project_entities
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "source_evidences_select_admin"
  on public.source_evidences
  for select
  to authenticated
  using (public.is_admin());

create policy "source_evidences_insert_admin"
  on public.source_evidences
  for insert
  to authenticated
  with check (public.is_admin());

create policy "source_evidences_update_admin"
  on public.source_evidences
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "repo_assets_select_admin"
  on public.repo_assets
  for select
  to authenticated
  using (public.is_admin());

create policy "repo_assets_insert_admin"
  on public.repo_assets
  for insert
  to authenticated
  with check (public.is_admin());

create policy "repo_assets_update_admin"
  on public.repo_assets
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "web_assets_select_admin"
  on public.web_assets
  for select
  to authenticated
  using (public.is_admin());

create policy "web_assets_insert_admin"
  on public.web_assets
  for insert
  to authenticated
  with check (public.is_admin());

create policy "web_assets_update_admin"
  on public.web_assets
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "audit_observations_select_admin"
  on public.audit_observations
  for select
  to authenticated
  using (public.is_admin());

create policy "audit_observations_insert_admin"
  on public.audit_observations
  for insert
  to authenticated
  with check (public.is_admin());

create policy "audit_observations_update_admin"
  on public.audit_observations
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "review_decisions_select_admin"
  on public.review_decisions
  for select
  to authenticated
  using (public.is_admin());

create policy "review_decisions_insert_admin"
  on public.review_decisions
  for insert
  to authenticated
  with check (public.is_admin());

create policy "review_decisions_update_admin"
  on public.review_decisions
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "published_projections_select_admin"
  on public.published_projections
  for select
  to authenticated
  using (public.is_admin());

create policy "published_projections_insert_admin"
  on public.published_projections
  for insert
  to authenticated
  with check (public.is_admin());

create policy "published_projections_update_admin"
  on public.published_projections
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "project_collection_links_select_admin"
  on public.project_collection_links
  for select
  to authenticated
  using (public.is_admin());

create policy "project_collection_links_insert_admin"
  on public.project_collection_links
  for insert
  to authenticated
  with check (public.is_admin());

create policy "project_collection_links_update_admin"
  on public.project_collection_links
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "project_alternative_candidates_select_admin"
  on public.project_alternative_candidates
  for select
  to authenticated
  using (public.is_admin());

create policy "project_alternative_candidates_insert_admin"
  on public.project_alternative_candidates
  for insert
  to authenticated
  with check (public.is_admin());

create policy "project_alternative_candidates_update_admin"
  on public.project_alternative_candidates
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.project_entities is
  'PR184 staging-only backstage project entities. Private by default; no public read policy.';

comment on table public.source_evidences is
  'PR184 staging-only source evidence roots. Raw evidence and hashes remain backstage.';

comment on table public.repo_assets is
  'PR184 staging-only repository asset links for admin review.';

comment on table public.web_assets is
  'PR184 staging-only web/docs/launch/directory asset links for admin review.';

comment on table public.audit_observations is
  'PR184 staging-only future audit observations. PR184 does not run audit.';

comment on table public.review_decisions is
  'PR184 admin-only review decisions. Manual review is required before publication.';

comment on table public.published_projections is
  'PR184 staging-only reviewed projections. No anon/public policy is created in this migration.';

comment on table public.project_collection_links is
  'PR184 staging-only reviewed collection links. No arbitrary faceted public pages.';

comment on table public.project_alternative_candidates is
  'PR184 staging-only alternatives candidates for manual review. No public projection.';
