import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    errors.push(`missing file: ${file}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function requireIncludes(file, needles) {
  const content = read(file);
  for (const needle of needles) {
    if (!content.includes(needle)) errors.push(`${file} missing ${needle}`);
  }
}

const migration = read('supabase/migrations/008_editorial_drafts.sql');
if (!/create table if not exists public\.editorial_drafts/i.test(migration)) {
  errors.push('editorial_drafts table missing');
}
if (!/alter table public\.editorial_drafts enable row level security/i.test(migration)) {
  errors.push('editorial_drafts RLS missing');
}
if (!/to authenticated\s+using \(public\.is_admin\(\)\)/i.test(migration)) {
  errors.push('editorial_drafts admin-only select policy missing');
}
if (/index_status\s*=\s*'indexable'|status\s*=\s*'published'|from\("projects"\)\.update|\.from\("projects"\)\s*\.update/.test(read('app/api/admin/editorial-drafts/[id]/route.ts'))) {
  errors.push('editorial admin API appears to publish or index projects');
}

requireIncludes('lib/editorial/draft-pipeline.ts', [
  'approved_for_publication',
  'isPublicationSideEffectBlocked',
  'make_indexable',
]);
requireIncludes('app/admin/editorial/page.tsx', [
  'Draft-only',
  'does not publish',
  'noIndex()',
]);
requireIncludes('docs/49_EDITORIAL_DRAFT_PIPELINE_V0.md', [
  'draft-only',
  'Admin-only',
  'No sitemap',
  'No public API',
]);

const forbiddenPublicFiles = [
  'app/sitemap.ts',
  'app/api/projects/[slug]/route.ts',
  'lib/reports/published-reports.ts',
];
for (const file of forbiddenPublicFiles) {
  const content = fs.existsSync(path.join(root, file)) ? read(file) : '';
  if (content.includes('editorial_drafts')) {
    errors.push(`${file} must not reference editorial_drafts`);
  }
}

if (errors.length > 0) {
  console.error('editorial-draft-pipeline check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('editorial-draft-pipeline check passed');
