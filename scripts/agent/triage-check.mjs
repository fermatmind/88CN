import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = ['failure_type', 'owner', 'next_action'];
const allowedTypes = new Set([
  'code_defect',
  'env_config_mismatch',
  'server_runtime_issue',
  'flaky_network',
  'stale_test_expectation',
  'unknown'
]);

const candidates = [
  'docs/TRIAGE_REPORT.md',
  'docs/ENVIRONMENT_FIX.md'
];

const patchesDir = path.join(root, 'ops/patches');
if (fs.existsSync(patchesDir)) {
  for (const file of fs.readdirSync(patchesDir)) {
    if (file.endsWith('.suggested.diff.md')) candidates.push(`ops/patches/${file}`);
  }
}

const existing = candidates.filter((file) => fs.existsSync(path.join(root, file)));

if (existing.length === 0) {
  console.log('no triage files found');
  console.log('triage-check passed');
  process.exit(0);
}

const failures = [];
for (const file of existing) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const field of required) {
    if (!new RegExp(`${field}\\s*:`).test(text)) {
      failures.push(`${file} missing ${field}`);
    }
  }
  const typeMatch = text.match(/failure_type\s*:\s*([a-z_]+)/);
  if (typeMatch && !allowedTypes.has(typeMatch[1])) {
    failures.push(`${file} has invalid failure_type`);
  }
}

if (failures.length > 0) {
  console.error('triage-check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('triage-check passed');
