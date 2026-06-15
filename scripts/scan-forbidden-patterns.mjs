import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const allowlist = new Set([
  'docs/DAY0_AUDIT.md',
  'docs/06_FORBIDDEN_PATTERNS.md',
  'docs/11_SCALABILITY_GUARDS.md',
  'docs/12_CACHE_AND_SITEMAP_STRATEGY.md',
  'docs/13_COST_GUARDS.md',
  'docs/14_OPEN_SOURCE_REUSE_POLICY.md',
  'docs/RISK_ACCEPTANCE_LOG.md',
  'third_party/NOTICE.md',
  'scripts/scan-forbidden-patterns.mjs',
  'AGENTS.md',
]);

const ignoredDirs = new Set([
  '.git',
  '.scratch',
  'node_modules',
  '.next',
  '.vercel',
  'dist',
  'build',
  'coverage',
]);

const scannedExtensions = new Set([
  '.md',
  '.mdx',
  '.txt',
  '.json',
  '.js',
  '.jsx',
  '.mjs',
  '.ts',
  '.tsx',
  '.css',
  '.sql',
]);

const forbiddenPatterns = [
  'dofollow backlink',
  '301 permanent backlink',
  'SEO juice',
  'guaranteed ranking',
  'invest now',
  'guaranteed return',
  'guaranteed yield',
  'guaranteed profit',
  'principal protection',
  '保本',
  '稳赚',
  '固定收益',
  '回购保障',
  'SPV',
  'fund',
  'AI fund',
  'equity',
  'token',
  'ICO',
  'IDO',
  'securities',
  'buy equity',
  'deposit funds',
  'real-money commitment',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasAsciiLetterOrNumber(value) {
  return /[A-Za-z0-9]/.test(value);
}

function createMatcher(pattern) {
  const escaped = escapeRegExp(pattern);
  if (!hasAsciiLetterOrNumber(pattern)) {
    return new RegExp(escaped, 'i');
  }

  return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, 'i');
}

const forbiddenMatchers = forbiddenPatterns.map((pattern) => ({
  pattern,
  matcher: createMatcher(pattern),
}));

function toRepoPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...walk(fullPath));
      }
      continue;
    }

    if (entry.isFile() && scannedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function findMatches(filePath) {
  const repoPath = toRepoPath(filePath);
  if (allowlist.has(repoPath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, index) => {
    for (const { pattern, matcher } of forbiddenMatchers) {
      if (matcher.test(line)) {
        matches.push({
          file: repoPath,
          line: index + 1,
          pattern,
        });
      }
    }
  });

  return matches;
}

const matches = walk(root).flatMap(findMatches);

if (matches.length > 0) {
  console.error('Forbidden public wording found outside allowlisted policy files:');
  for (const match of matches) {
    console.error(`- ${match.file}:${match.line} contains "${match.pattern}"`);
  }
  process.exit(1);
}

console.log('policy:scan passed');
