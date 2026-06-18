import fs from 'node:fs';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const approved = readJson('ops/plugins/approved-plugins.json');
const denied = readJson('ops/plugins/denied-plugins.json');
const failures = [];

function add(condition, message) {
  if (!condition) failures.push(message);
}

const approvedIds = new Set();
for (const plugin of approved.plugins || []) {
  add(plugin.id, 'approved plugin missing id');
  if (plugin.id) {
    add(!approvedIds.has(plugin.id), `duplicate approved plugin id ${plugin.id}`);
    approvedIds.add(plugin.id);
  }
  for (const field of ['reason', 'scope', 'allowed_phase', 'permissions']) {
    add(Object.hasOwn(plugin, field), `approved plugin ${plugin.id || '<missing>'} missing ${field}`);
  }
}

const deniedIds = new Set();
for (const plugin of denied.plugins || []) {
  add(plugin.id, 'denied plugin missing id');
  if (plugin.id) {
    add(!deniedIds.has(plugin.id), `duplicate denied plugin id ${plugin.id}`);
    deniedIds.add(plugin.id);
  }
  for (const field of ['reason', 'risk', 'denied_by_default']) {
    add(Object.hasOwn(plugin, field), `denied plugin ${plugin.id || '<missing>'} missing ${field}`);
  }
  add(plugin.denied_by_default === true, `denied plugin ${plugin.id || '<missing>'} must set denied_by_default true`);
}

for (const id of approvedIds) {
  add(!deniedIds.has(id), `plugin appears in both approved and denied registries: ${id}`);
}

if (failures.length > 0) {
  console.error(`plugin-policy-check failed with ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`plugin-policy-check passed: ${approvedIds.size} approved, ${deniedIds.size} denied`);
