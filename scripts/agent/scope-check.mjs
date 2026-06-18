import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const roadmapPath = path.join(root, 'ops/tasks/roadmap.json');
const currentPath = path.join(root, 'ops/tasks/current.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function globToRegExp(glob) {
  let source = '^';
  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i];
    const next = glob[i + 1];
    if (char === '*' && next === '*') {
      source += '.*';
      i += 1;
      continue;
    }
    if (char === '*') {
      source += '[^/]*';
      continue;
    }
    source += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  source += '$';
  return new RegExp(source);
}

function matches(patterns, file) {
  return patterns.some((pattern) => globToRegExp(pattern).test(file));
}

function gitLines(args) {
  try {
    const output = execFileSync('git', args, { cwd: root, encoding: 'utf8' });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

const taskId = process.argv[2] || readJson(currentPath).current_task;
const roadmap = readJson(roadmapPath);
const task = roadmap.tasks.find((entry) => entry.id === taskId);

if (!task) {
  console.error(`scope-check failed: task ${taskId} not found`);
  process.exit(1);
}

const changed = new Set([
  ...gitLines(['diff', '--name-only', 'HEAD']),
  ...gitLines(['diff', '--name-only', '--cached']),
  ...gitLines(['ls-files', '--others', '--exclude-standard'])
]);

const files = [...changed].sort();
const violations = [];

for (const file of files) {
  const allowed = matches(task.allowed_paths || [], file);
  const forbidden = matches(task.forbidden_paths || [], file);
  if (!allowed || forbidden) {
    violations.push({ file, allowed, forbidden });
  }
}

if (violations.length > 0) {
  console.error(`scope-check failed for ${taskId}`);
  for (const item of violations) {
    console.error(`- ${item.file} allowed=${item.allowed} forbidden=${item.forbidden}`);
  }
  process.exit(1);
}

console.log(`scope-check passed for ${taskId}`);
