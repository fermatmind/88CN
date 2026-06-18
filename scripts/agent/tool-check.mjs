import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'ops/tools/tool-registry.json');
const approvedPath = path.join(root, 'ops/plugins/approved-plugins.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function add(failures, condition, message) {
  if (!condition) failures.push(message);
}

function hasServerAddress(value) {
  return /\b(?!(?:127|10|172\.(?:1[6-9]|2[0-9]|3[0-1])|192\.168|0)\.)\d{1,3}(?:\.\d{1,3}){3}\b/.test(value);
}

const failures = [];
const registry = readJson(registryPath);
const approved = readJson(approvedPath);

for (const key of ['version', 'policy', 'tools', 'denied']) {
  add(failures, Object.hasOwn(registry, key), `missing top-level ${key}`);
}

const policy = registry.policy || {};
for (const key of [
  'default_allow_install',
  'default_allow_network',
  'default_allow_write',
  'default_allow_secrets',
  'global_install_requires_human',
  'browser_extensions_denied_by_default',
  'mcp_servers_denied_by_default',
  'production_credentials_denied'
]) {
  add(failures, Object.hasOwn(policy, key), `missing policy ${key}`);
}

const validStatuses = new Set(['approved', 'conditional', 'denied']);
const requiredToolFields = [
  'id',
  'name',
  'type',
  'status',
  'phases',
  'required',
  'install',
  'permissions',
  'allowed_commands',
  'forbidden_commands',
  'notes'
];

const toolIds = new Set();
for (const tool of registry.tools || []) {
  for (const field of requiredToolFields) {
    add(failures, Object.hasOwn(tool, field), `tool ${tool.id || '<missing>'} missing ${field}`);
  }
  add(failures, validStatuses.has(tool.status), `tool ${tool.id || '<missing>'} invalid status`);
  add(failures, Array.isArray(tool.phases), `tool ${tool.id || '<missing>'} phases must be array`);
  add(failures, tool.install && Object.hasOwn(tool.install, 'mode'), `tool ${tool.id || '<missing>'} install.mode missing`);
  add(failures, tool.install && Object.hasOwn(tool.install, 'command'), `tool ${tool.id || '<missing>'} install.command missing`);
  add(failures, Array.isArray(tool.allowed_commands), `tool ${tool.id || '<missing>'} allowed_commands must be array`);
  add(failures, Array.isArray(tool.forbidden_commands), `tool ${tool.id || '<missing>'} forbidden_commands must be array`);
  if (tool.id) {
    add(failures, !toolIds.has(tool.id), `duplicate tool id ${tool.id}`);
    toolIds.add(tool.id);
  }

  const installCommand = String(tool.install?.command || '');
  const dangerousPatterns = [
    /curl\s+.*\|\s*bash/i,
    /curl\s+.*\|\s*sh/i,
    /bash\s+<\(curl/i,
    /sh\s+<\(curl/i,
    /npm\s+install\s+-g/i,
    /\bsudo\b/i,
    /rm\s+-rf\s+\//i
  ];
  for (const pattern of dangerousPatterns) {
    add(failures, !pattern.test(installCommand), `tool ${tool.id || '<missing>'} install.command uses dangerous pattern`);
  }

  for (const word of ['tok' + 'en', 'secret', 'password', 'OPENAI_API_KEY', 'SUPABASE', 'STRIPE']) {
    add(failures, !installCommand.toLowerCase().includes(word.toLowerCase()), `tool ${tool.id || '<missing>'} install.command contains sensitive marker`);
  }
  add(failures, !hasServerAddress(installCommand), `tool ${tool.id || '<missing>'} install.command contains server address candidate`);
}

const denied = new Set(registry.denied || []);
const approvedPlugins = approved.plugins || [];
for (const plugin of approvedPlugins) {
  add(failures, !denied.has(plugin.id), `denied tool appears in approved plugins: ${plugin.id}`);
}

if (failures.length > 0) {
  console.error(`tool-check failed with ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`tool-check passed: ${toolIds.size} tools, ${denied.size} denied entries`);
