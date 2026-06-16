import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MIGRATION_FILES = [
  path.join(ROOT, 'supabase', 'migrations', '001_init.sql'),
  path.join(ROOT, 'supabase', 'migrations', '002_audit_notification.sql'),
  path.join(ROOT, 'supabase', 'migrations', '003_admin_users.sql'),
  path.join(ROOT, 'supabase', 'migrations', '004_needs_info_status.sql'),
  path.join(ROOT, 'supabase', 'migrations', '005_intake_indexes.sql'),
  path.join(ROOT, 'supabase', 'migrations', '006_external_import_indexes.sql'),
];

const errors = [];

// 1. Migration files must exist
for (const file of MIGRATION_FILES) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing migration file: ${path.relative(ROOT, file)}`);
  }
}

if (errors.length > 0) {
  console.error('db:schema:check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

// Read all SQL into one string
let sql = '';
for (const file of MIGRATION_FILES) {
  sql += fs.readFileSync(file, 'utf8') + '\n';
}
const sqlLower = sql.toLowerCase();

// 2. Required extensions
if (!sqlLower.includes('create extension')) {
  errors.push('Missing CREATE EXTENSION (pgcrypto required)');
}

// 3. Key table names must exist
const requiredTables = [
  'categories',
  'collections',
  'reports',
  'projects',
  'project_sources',
  'project_source_snapshots',
  'project_raw_payloads',
  'project_scores',
  'project_score_snapshots',
  'project_structured_profiles',
  'project_submissions',
  'project_claims',
  'external_project_imports',
  'project_editorial_jobs',
  'project_badges',
  'project_consents',
  'project_lifecycle_events',
  'source_refresh_jobs',
  'system_flags',
  'system_budgets',
  'audit_events',
  'notification_events',
  'admin_users',
];

for (const table of requiredTables) {
  // Check for CREATE TABLE statement
  const tablePattern = new RegExp(
    `create\\s+table\\s+(if\\s+not\\s+exists\\s+)?(public\\.)?${table.replace(/_/g, '\\_')}\\s`,
    'i'
  );
  if (!tablePattern.test(sql)) {
    errors.push(`Missing CREATE TABLE for: ${table}`);
  }
}

// 4. RLS must be enabled on all required tables
for (const table of requiredTables) {
  const rlsPattern = new RegExp(
    `alter\\s+table\\s+(public\\.)?${table.replace(/_/g, '\\_')}\\s+enable\\s+row\\s+level\\s+security`,
    'i'
  );
  if (!rlsPattern.test(sql)) {
    errors.push(`Missing RLS enable for: ${table}`);
  }
}

// 5. claim_source_refresh_jobs function must exist
if (!sqlLower.includes('claim_source_refresh_jobs')) {
  errors.push('Missing function: claim_source_refresh_jobs');
}

// 6. FOR UPDATE SKIP LOCKED must be used in claim function
if (!sqlLower.includes('for update skip locked')) {
  errors.push('Missing FOR UPDATE SKIP LOCKED in claim_source_refresh_jobs');
}

// 7. Forbidden dangerous strings
const forbiddenPatterns = [
  {
    pattern: 'recalculate_all',
    message: 'Forbidden pattern: recalculate_all (full-table score recalculation)',
  },
  {
    pattern: 'update projects set signal_score',
    message: 'Forbidden pattern: direct full-table score update',
  },
  {
    pattern: 'grant all on',
    message: 'Forbidden pattern: GRANT ALL ON (overly permissive grants)',
  },
  {
    pattern: 'disable row level security',
    message: 'Forbidden pattern: DISABLE ROW LEVEL SECURITY',
  },
];

for (const { pattern, message } of forbiddenPatterns) {
  if (sqlLower.includes(pattern.toLowerCase())) {
    errors.push(message);
  }
}

// 8. project_scores must have all 6 signal dimensions
const scoreDimensions = [
  'product_readiness',
  'dev_momentum',
  'market_presence',
  'commercial_readiness',
  'seo_foundation',
  'trust_confidence',
];

for (const dim of scoreDimensions) {
  if (!sqlLower.includes(dim)) {
    errors.push(`Missing score dimension: ${dim}`);
  }
}

// 9. Source confidence column must exist on project_scores
if (!sqlLower.includes('source_confidence')) {
  errors.push('Missing source_confidence column on project_scores');
}

// 10. project_raw_payloads must have retention fields
const rawPayloadFields = ['raw_summary', 'raw_pointer', 'raw_size_bytes', 'expires_at'];
for (const field of rawPayloadFields) {
  if (!sqlLower.includes(field)) {
    errors.push(`Missing field on project_raw_payloads: ${field}`);
  }
}

// 11. system_flags must include kill switch names
const killSwitches = [
  'disable_external_refresh',
  'disable_editorial_generation',
  'disable_score_recalculation',
  'disable_new_submissions',
  'read_only_mode',
];
for (const flag of killSwitches) {
  if (!sqlLower.includes(flag)) {
    errors.push(`Missing system flag: ${flag}`);
  }
}

// 12. project_consents must include all consent fields
const consentFields = [
  'public_website_scan',
  'public_pricing_scan',
  'github_signal_scan',
  'ad_readiness_scan',
  'structured_profile_exposure',
  'public_api_exposure',
  'future_mcp_exposure',
  'future_verified_data_contact',
];
for (const field of consentFields) {
  if (!sqlLower.includes(field)) {
    errors.push(`Missing consent field: ${field}`);
  }
}

// 13. project_editorial_jobs must have required AI tracking columns
const editorialAiFields = ['model_provider', 'model_name', 'prompt_version', 'hallucination_risk', 'input_snapshot'];
for (const field of editorialAiFields) {
  if (!sqlLower.includes(field)) {
    errors.push(`Missing editorial AI field: ${field}`);
  }
}

// 14. project_status must support all lifecycle states
const lifecycleStates = [
  'draft', 'submitted', 'pending_review', 'approved',
  'published', 'claimed', 'owner_verified',
  'inactive_warning', 'candidate_archive',
  'archived_research', 'archived_noindex', 'rejected_spam',
];
for (const state of lifecycleStates) {
  if (!sqlLower.includes(`'${state}'`)) {
    errors.push(`Missing lifecycle state: ${state}`);
  }
}

// 15. index_status must support required values
const indexStatuses = ['noindex', 'preview_noindex', 'indexable', 'archived_indexable'];
for (const st of indexStatuses) {
  if (!sqlLower.includes(`'${st}'`)) {
    errors.push(`Missing index_status value: ${st}`);
  }
}

// 16. set_updated_at trigger function must exist
if (!sqlLower.includes('set_updated_at')) {
  errors.push('Missing function: set_updated_at');
}

// 17. is_admin function must exist
if (!sqlLower.includes('is_admin')) {
  errors.push('Missing function: is_admin');
}

// Report
if (errors.length > 0) {
  console.error('db:schema:check failed');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('db:schema:check passed');
console.log(`Verified: ${requiredTables.length} tables, RLS enabled, no forbidden patterns`);
