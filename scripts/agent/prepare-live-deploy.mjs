#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  npm run agent:deploy:prepare -- [--prs <sha> ...] [--base-url <url>]

Examples:
  npm run agent:deploy:prepare
  npm run agent:deploy:prepare -- --prs b0550a3 c42eecd 03db788

This command is local-only. It fetches origin, resolves origin/main, verifies
optional PR merge SHAs are ancestors of origin/main, and prints the exact
Workbench/SSH deployment command. It does not connect to production or deploy.`);
}

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const command = `git ${args.join(" ")}`;
    const stderr = result.stderr?.trim();
    throw new Error(stderr ? `${command}\n${stderr}` : command);
  }

  return result.stdout?.trim() ?? "";
}

const prShas = [];
let baseUrl = "https://88cn.com";

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--help" || arg === "-h") {
    usage();
    process.exit(0);
  }

  if (arg === "--prs") {
    index += 1;
    while (index < args.length && !args[index].startsWith("--")) {
      prShas.push(args[index]);
      index += 1;
    }
    index -= 1;
    continue;
  }

  if (arg === "--base-url") {
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error("--base-url requires a value");
    }
    baseUrl = value.replace(/\/+$/, "");
    index += 1;
    continue;
  }

  throw new Error(`Unknown argument: ${arg}`);
}

console.log("Fetching origin...");
runGit(["fetch", "origin", "--prune"], { stdio: "inherit" });

const targetSha = runGit(["rev-parse", "--verify", "origin/main^{commit}"]);

const verifiedShas = prShas.map((input) => {
  const resolved = runGit(["rev-parse", "--verify", `${input}^{commit}`]);
  try {
    runGit(["merge-base", "--is-ancestor", resolved, "origin/main"]);
  } catch {
    throw new Error(`${input} (${resolved}) is not contained in origin/main`);
  }
  return { input, resolved };
});

console.log("");
console.log("Target origin/main SHA:");
console.log(targetSha);

if (verifiedShas.length > 0) {
  console.log("");
  console.log("Verified PR merge SHAs contained in origin/main:");
  for (const { input, resolved } of verifiedShas) {
    console.log(`- ${input} -> ${resolved}`);
  }
}

console.log("");
console.log("Preparation phrase:");
console.log("准备，不部署：请确认 origin/main SHA 和需要包含的 PR merge SHA。");

console.log("");
console.log("Confirmation phrase:");
console.log(
  `我确认部署 88CN origin/main SHA ${targetSha} 到生产服务器，不启用任何新 env/payment/secret flag。`,
);

console.log("");
console.log("Workbench/SSH command:");
console.log("cd /var/www/88cn");
console.log(
  `BASE_URL=${baseUrl} scripts/agent/deploy-production.sh --confirm --commit ${targetSha}`,
);

console.log("");
console.log("For current-PR-specific smoke, prepend:");
console.log(
  `EXTRA_PATHS="/new-public-page" REQUIRED_SITEMAP_PATHS="/new-public-page" BASE_URL=${baseUrl} \\`,
);
console.log(
  `scripts/agent/deploy-production.sh --confirm --commit ${targetSha}`,
);
