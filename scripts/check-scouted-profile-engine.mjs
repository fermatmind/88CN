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

const migration = read('supabase/migrations/009_scouted_profiles.sql');
if (!/create table if not exists public\.scouted_profiles/i.test(migration)) {
  errors.push('scouted_profiles table missing');
}
if (!/create table if not exists public\.scouted_profile_intents/i.test(migration)) {
  errors.push('scouted_profile_intents table missing');
}
if (!/index_status text not null default 'noindex'/i.test(migration)) {
  errors.push('scouted profiles must default to noindex');
}
if (/indexable/.test(migration)) {
  errors.push('scouted profile migration must not allow indexable status');
}
if (!/alter table public\.scouted_profiles enable row level security/i.test(migration)) {
  errors.push('scouted profile RLS missing');
}
if (!/public\.is_admin\(\)/.test(migration)) {
  errors.push('admin-only policies missing');
}

const publicPage = read('app/scouted/[slug]/page.tsx');
if (!publicPage.includes('noIndex()') || !publicPage.includes('follow: false')) {
  errors.push('scouted public page must be noindex/nofollow');
}
if (!publicPage.includes('not included in sitemap') || !publicPage.includes('not exposed through public API')) {
  errors.push('scouted public page must state non-public boundary');
}

const lifecycle = read('lib/scouted/profile-engine.ts');
for (const required of ['claim', 'correct', 'remove', 'approved_for_project', 'noindex']) {
  if (!lifecycle.includes(required)) errors.push(`scouted lifecycle missing ${required}`);
}

const sitemap = read('app/sitemap.ts');
if (sitemap.includes('scouted')) {
  errors.push('sitemap must not include scouted profiles');
}

const publicApi = read('app/api/projects/[slug]/route.ts');
if (publicApi.includes('scouted')) {
  errors.push('public project API must not expose scouted metadata');
}

if (errors.length > 0) {
  console.error('scouted-profile:check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('scouted-profile:check passed');
