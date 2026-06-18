import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'ops/mcp/config.example.toml',
  '.codex/config.example.toml'
];

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const failures = [];

for (const repoPath of files) {
  const fullPath = path.join(root, repoPath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${repoPath}: missing`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');
  const checks = [
    ['tok' + 'en', new RegExp('tok' + 'en', 'i')],
    ['secret', /secret/i],
    ['password', /password/i],
    ['api_key', /api_key/i],
    ['OPENAI_API_KEY', /OPENAI_API_KEY/i],
    ['ANTHROPIC_API_KEY', /ANTHROPIC_API_KEY/i],
    ['SUPABASE', /SUPABASE/i],
    ['STRIPE', /STRIPE/i],
    ['private key', /private key/i],
    ['real IPv4 address', /\b(?!(?:127|10|172\.(?:1[6-9]|2[0-9]|3[0-1])|192\.168|0)\.)\d{1,3}(?:\.\d{1,3}){3}\b/],
    ['credential URL', /\bhttps?:\/\/[^/\s:@]+:[^@\s/]+@[^\s"'`<>),]+/i]
  ];

  for (const [name, regex] of checks) {
    const match = regex.exec(text);
    if (match) failures.push(`${repoPath}:${lineNumber(text, match.index)} contains ${name}`);
  }

  const rootPatterns = [
    ['filesystem root', /^\s*(?:cwd|root|path)\s*=\s*"\/"\s*$/m],
    ['home root', /"\~\//],
    ['Users root', /"\/Users(?:\/|")/],
    ['etc root', /"\/etc(?:\/|")/],
    ['var root', /"\/var(?:\/|")/]
  ];

  for (const [name, regex] of rootPatterns) {
    const match = regex.exec(text);
    if (match) failures.push(`${repoPath}:${lineNumber(text, match.index)} contains ${name}`);
  }

  if (!text.includes('example.invalid')) failures.push(`${repoPath}: missing example.invalid placeholder`);
  if (!text.includes('disabled = true')) failures.push(`${repoPath}: missing disabled = true`);
}

if (failures.length > 0) {
  console.error(`mcp-config-check failed with ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`mcp-config-check passed: ${files.length} example configs`);
