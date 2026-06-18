import { execFileSync } from 'node:child_process';

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const branch = git(['branch', '--show-current']);
const changed = git(['diff', '--name-only', 'HEAD']);
const staged = git(['diff', '--name-only', '--cached']);
const untracked = git(['ls-files', '--others', '--exclude-standard']);

console.log(`# PR Summary Helper`);
console.log(``);
console.log(`Branch: ${branch || 'unknown'}`);
console.log(``);
console.log(`Changed files:`);
for (const file of [...new Set(`${changed}\n${staged}`.split(/\r?\n/).filter(Boolean))].sort()) {
  console.log(`- ${file}`);
}
for (const file of [...new Set(untracked.split(/\r?\n/).filter(Boolean))].sort()) {
  console.log(`- ${file}`);
}
console.log(``);
console.log(`Suggested validation:`);
console.log(`- npm run agent:scope:check`);
console.log(`- npm run agent:redact:check`);
console.log(`- npm run policy:scan`);
