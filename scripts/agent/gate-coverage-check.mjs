import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const gatePath = path.join(root, "scripts/agent/gate.sh");
const packagePath = path.join(root, "package.json");
const errors = [];

function fail(message) {
  errors.push(message);
}

const requiredGateCommands = [
  "npm run agent:redact:check",
  "npm run agent:tool:check",
  "npm run agent:mcp-config:check",
  "npm run agent:plugin-policy:check",
  "npm run report:founder-intent:check",
  "npm run editorial-draft:check",
  "npm run editorial-copy:check",
  "npm run brand-voice:check",
  "npm run scouted-profile:check",
  "npm run conversion-metrics:check",
  "npm run submission-channels:check",
  "npm run founder-onboarding:check",
  "npm run featured-signals:check",
  "npm run ad-payment-boundary:check",
  "npm run lifecycle-archive:check",
  "npm run changelog-engine:check",
  "npm run backers-landing:check",
  "npm run oss-maintainer:check",
  "npm run public-api-boundary:check",
  "npm run public-api:v0:check",
  "npm run mcp-threat-model:check",
  "npm run agent:gate-coverage:check",
];

const forbiddenGateCommands = [
  "npm run dev",
  "npm run dev:qa",
  "npm run start:production",
  "npm run runtime:check",
  "npm run seed-audit:run",
  "npm run agent:smoke:local",
  "npm run agent:smoke:live",
  "npm run agent:deploy:production",
];

if (!fs.existsSync(gatePath)) {
  fail("Missing scripts/agent/gate.sh");
}

if (!fs.existsSync(packagePath)) {
  fail("Missing package.json");
}

const gate = fs.existsSync(gatePath) ? fs.readFileSync(gatePath, "utf8") : "";
const pkg = fs.existsSync(packagePath)
  ? JSON.parse(fs.readFileSync(packagePath, "utf8"))
  : { scripts: {} };

for (const command of requiredGateCommands) {
  if (!gate.includes(`"${command}"`)) {
    fail(`agent gate missing command: ${command}`);
  }

  const scriptName = command.replace("npm run ", "");
  if (!pkg.scripts?.[scriptName]) {
    fail(`package.json missing script used by gate: ${scriptName}`);
  }
}

for (const command of forbiddenGateCommands) {
  if (gate.includes(`"${command}"`)) {
    fail(`agent gate must not run live/deploy/browser/server command: ${command}`);
  }
}

if (errors.length > 0) {
  console.error("agent:gate-coverage:check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("agent:gate-coverage:check passed");
console.log(
  "Verified: deterministic local static checkers are wired into agent:gate and live/deploy/server checks are excluded"
);
