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

const page = read('app/reports/ai-project-submission-channels-2026/page.tsx');
const report = read('lib/reports/submission-channels-report.ts');
const registry = read('lib/reports/published-reports.ts');
const reportsIndex = read('app/reports/page.tsx');
const docs = read('docs/54_SUBMISSION_CHANNELS_REPORT_PAGE_V0.md');
const sitemap = read('app/sitemap.ts');

const requiredStrings = [
  'SUBMISSION_CHANNELS_REPORT_PATH',
  '/submit',
  '/geo-checker',
  '/projects',
  'reviewed',
  'canonical',
  'No automated posting workflow',
];

for (const value of requiredStrings) {
  if (!page.includes(value) && !report.includes(value) && !docs.includes(value)) {
    errors.push(`required boundary text missing: ${value}`);
  }
}

const forbiddenPhrases = [
  'dofollow',
  'backlink',
  `seo ${'juice'}`,
  'guaranteed',
  'ranking guarantee',
  'traffic promise',
  'ai citation guarantee',
  'paid link',
  'link marketplace',
  'bulk submission list',
  'automated pseo spam',
];

for (const [label, content] of Object.entries({ page, report, docs })) {
  const lower = content.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (lower.includes(phrase)) {
      errors.push(`${label} contains forbidden phrase: ${phrase}`);
    }
  }
}

if (!page.includes('robots: { index: true, follow: true }')) {
  errors.push('submission channels report must be intentionally indexable');
}
if (!registry.includes('SUBMISSION_CHANNELS_REPORT_PATH')) {
  errors.push('published reports registry missing submission channels route');
}
if (!reportsIndex.includes('SUBMISSION_CHANNELS_REPORT_PATH')) {
  errors.push('reports index missing submission channels link');
}
if (sitemap.includes('ai-project-submission-channels-2026')) {
  errors.push('sitemap should include reports through published report registry, not hardcoded page strings');
}
if (page.includes('app/api') || page.includes('admin') || page.includes('scouted')) {
  errors.push('submission channels page must not expose API, admin, or scouted surfaces');
}

if (errors.length > 0) {
  console.error('submission-channels:check failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('submission-channels:check passed');
