import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const fix = process.argv.includes('--fix');
const allowlistValues = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  'example.com',
  'example.invalid',
  'https://user:pass@example.com',
  'sk_test_dummy'
]);

function gitLines(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['.git', 'node_modules', '.next', '.scratch'].includes(entry.name)) {
        files.push(...walk(fullPath));
      }
      continue;
    }
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

const changedFiles = new Set([
  ...gitLines(['diff', '--name-only', '--cached']),
  ...gitLines(['diff', '--name-only', 'HEAD']),
  ...gitLines(['ls-files', '--others', '--exclude-standard'])
]);

for (const file of walk(path.join(root, 'docs'))) {
  changedFiles.add(path.relative(root, file).split(path.sep).join('/'));
}

const textExtensions = new Set([
  '.md',
  '.txt',
  '.json',
  '.js',
  '.mjs',
  '.ts',
  '.tsx',
  '.css',
  '.sql',
  '.sh',
  '.yml',
  '.yaml'
]);

const rules = [
  { name: 'private_key_block', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'github_credential', regex: /gh[pousr]_[A-Za-z0-9_]{20,}/g },
  { name: 'supabase_jwt_like_value', regex: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g },
  { name: 'stripe_live_secret', regex: /\b[rs]k_live_[A-Za-z0-9]{16,}\b/g },
  { name: 'openai_secret', regex: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'anthropic_secret', regex: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
  { name: 'aws_access_identifier', regex: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g },
  { name: 'credential_url', regex: /\bhttps?:\/\/[^/\s:@]+:[^@\s/]+@[^\s"'`<>),]+/g },
  { name: 'temporary_github_archive_url', regex: /https:\/\/github\.com\/[^\s]+\/archive\/[^\s?]+(?:\?[^\s]+)?/g },
  { name: 'server_address_candidate', regex: /\b(?!(?:127|10|172\.(?:1[6-9]|2[0-9]|3[0-1])|192\.168|0)\.)\d{1,3}(?:\.\d{1,3}){3}\b/g }
];

const findings = [];

for (const repoPath of [...changedFiles].sort()) {
  const fullPath = path.join(root, repoPath);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) continue;
  if (!textExtensions.has(path.extname(repoPath))) continue;

  if (repoPath.includes('.env.production')) {
    findings.push({ file: repoPath, line: 1, rule: 'env_production_file' });
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of rules) {
      for (const match of line.matchAll(rule.regex)) {
        const value = match[0];
        if (allowlistValues.has(value)) continue;
        findings.push({ file: repoPath, line: index + 1, rule: rule.name });
      }
    }
  });
}

if (findings.length > 0) {
  console.error(`redact-check failed with ${findings.length} finding(s)`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} ${finding.rule}`);
  }
  if (fix) {
    console.error('--fix cannot rewrite high-risk findings');
  }
  process.exit(1);
}

console.log('redact-check passed');
