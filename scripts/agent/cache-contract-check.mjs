import fs from 'node:fs';

const contract = JSON.parse(fs.readFileSync('ops/contracts/cache-tags.json', 'utf8'));
const requiredTags = [
  'project:{slug}',
  'category:{category_slug}',
  'stack:{tech_slug}',
  'vertical:{vertical_slug}',
  'collection:{collection_slug}',
  'report:{report_slug}',
  'home:featured',
  'sitemap:public'
];

const failures = [];
for (const tag of requiredTags) {
  if (!contract.tags?.[tag]) failures.push(`missing tag ${tag}`);
}

const forbiddenText = JSON.stringify(contract.forbidden || []);
if (!forbiddenText.includes('global revalidatePath root')) {
  failures.push('missing global invalidation ban');
}
if (!forbiddenText.includes('unscoped full-site invalidation')) {
  failures.push('missing unscoped invalidation ban');
}

if (failures.length > 0) {
  console.error('cache-contract-check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('cache-contract-check passed');
