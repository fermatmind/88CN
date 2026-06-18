import fs from 'node:fs';

const contract = JSON.parse(fs.readFileSync('ops/contracts/event-outbox.json', 'utf8'));
const failures = [];

if (contract.source_of_truth !== 'Supabase') failures.push('source_of_truth must be Supabase');

const rules = (contract.rules || []).join('\n');
for (const phrase of [
  'outbox',
  'webhook delivery is never the sole fact source',
  'idempotent',
  'replayable',
  'full-table cron sync is forbidden'
]) {
  if (!rules.includes(phrase)) failures.push(`missing rule: ${phrase}`);
}

for (const field of ['event_id', 'event_type', 'aggregate_type', 'aggregate_id', 'occurred_at', 'payload_version', 'payload']) {
  if (!(contract.required_event_fields || []).includes(field)) {
    failures.push(`missing event field ${field}`);
  }
}

if (failures.length > 0) {
  console.error('event-contract-check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('event-contract-check passed');
