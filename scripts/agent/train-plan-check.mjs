import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function parseArgs(argv) {
  const options = {
    batch: null,
    registry: path.join(root, 'ops/trains/batches.json'),
    current: path.join(root, 'ops/trains/current.json'),
    roadmap: path.join(root, 'ops/tasks/roadmap.json')
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--batch' || arg === '--registry' || arg === '--current' || arg === '--roadmap') {
      const value = argv[index + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      const key = arg.slice(2);
      options[key] = key === 'batch' ? value : path.resolve(root, value);
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  return options;
}

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) throw new Error(`${label} missing: ${path.relative(root, filePath) || filePath}`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} invalid JSON: ${error.message}`);
  }
}

function expandRange(range) {
  const match = /^PR(\d+)-PR(\d+)$/.exec(range || '');
  if (!match) return [];
  const start = Number(match[1]);
  const end = Number(match[2]);
  const ids = [];
  for (let value = start; value <= end; value += 1) ids.push(`PR${value}`);
  return ids;
}

function skeletonMap(roadmap) {
  const map = new Map();
  for (const skeleton of roadmap.skeletons || []) {
    const ids = Array.isArray(skeleton.ids) ? skeleton.ids : expandRange(skeleton.range);
    for (const id of ids) map.set(id, skeleton);
  }
  return map;
}

function checkpointDeclared(batch, taskId) {
  return (batch.human_checkpoints || []).some((checkpoint) => {
    if (!checkpoint || typeof checkpoint !== 'object') return false;
    return checkpoint.task === 'ANY' || checkpoint.task === taskId;
  });
}

function isTaskCheckpoint(task) {
  return task?.human_checkpoint === true;
}

function taskText(task, taskId) {
  if (!task) return taskId.toLowerCase();
  return [task.id, task.title, task.type, task.phase, task.deployment, ...(task.data_planes || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function taskNeedsLiveDeployment(task) {
  const deployment = String(task?.deployment || '').toLowerCase();
  return deployment.includes('live') && deployment !== 'live-smoke-only';
}

function taskNeedsPayment(task, taskId) {
  return /\b(payment|stripe|checkout|paid placement|paid-placement)\b/.test(taskText(task, taskId));
}

function taskNeedsMcp(task, taskId) {
  return /\bmcp\b/.test(taskText(task, taskId));
}

function taskNeedsServerConfig(task) {
  const deployment = String(task?.deployment || '').toLowerCase();
  return deployment === 'live-config-change' || deployment === 'server-config-change';
}

function printPlan(batch, rows) {
  console.log(`train-plan dry run: ${batch.id} - ${batch.title}`);
  console.log('index | task | title | role | deployment | human_checkpoint | can_auto_merge | notes');
  for (const row of rows) {
    console.log([
      row.index,
      row.id,
      row.title,
      row.role,
      row.deployment,
      row.humanCheckpoint ? 'yes' : 'no',
      row.canAutoMerge ? 'yes' : 'no',
      row.notes
    ].join(' | '));
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const registry = readJson(options.registry, 'batch registry');
  const current = readJson(options.current, 'current train');
  const roadmap = readJson(options.roadmap, 'roadmap');
  const batchId = options.batch || current.next_recommended_train;

  if (!batchId) throw new Error('no --batch provided and current.next_recommended_train is empty');

  const batch = (registry.batches || []).find((entry) => entry.id === batchId);
  if (!batch) throw new Error(`unknown BATCH_ID ${batchId}`);

  const tasksById = new Map((roadmap.tasks || []).map((task) => [task.id, task]));
  const skeletonsById = skeletonMap(roadmap);
  const failures = [];
  const warnings = [];
  const rows = [];

  (batch.tasks || []).forEach((taskId, index) => {
    const task = tasksById.get(taskId);
    const skeleton = skeletonsById.get(taskId);

    if (!task && !skeleton) {
      failures.push(`${taskId} missing from roadmap and skeletons`);
      return;
    }

    const humanCheckpoint = task ? isTaskCheckpoint(task) || checkpointDeclared(batch, taskId) : checkpointDeclared(batch, taskId);
    if (humanCheckpoint && batch.auto_merge_allowed === true && checkpointDeclared(batch, taskId)) {
      warnings.push(`${taskId} has human checkpoint while batch auto_merge_allowed=true`);
    }

    if (task && batch.live_deploy_allowed === false && taskNeedsLiveDeployment(task)) {
      failures.push(`${taskId} requires live deployment but ${batch.id} live_deploy_allowed=false`);
    }

    if (batch.payment_change_allowed === false && taskNeedsPayment(task, taskId)) {
      const allowedByCheckpoint = task && isTaskCheckpoint(task) && checkpointDeclared(batch, taskId);
      if (!allowedByCheckpoint) failures.push(`${taskId} indicates payment/Stripe/checkout/paid placement but payment_change_allowed=false`);
    }

    if (batch.mcp_change_allowed === false && taskNeedsMcp(task, taskId)) {
      const allowedByCheckpoint = task && isTaskCheckpoint(task) && checkpointDeclared(batch, taskId);
      if (!allowedByCheckpoint) failures.push(`${taskId} indicates MCP but mcp_change_allowed=false`);
    }

    if (batch.server_change_allowed === false && taskNeedsServerConfig(task)) {
      failures.push(`${taskId} is ${task.deployment} but server_change_allowed=false`);
    }

    rows.push({
      index: index + 1,
      id: taskId,
      title: task?.title || skeleton?.purpose || 'RESERVED_FUTURE_TASK',
      role: task?.role || 'RESERVED_FUTURE_TASK',
      deployment: task?.deployment || 'RESERVED_FUTURE_TASK',
      humanCheckpoint,
      canAutoMerge: batch.auto_merge_allowed === true && !humanCheckpoint,
      notes: task ? 'roadmap_task' : `RESERVED_FUTURE_TASK ${skeleton.range || 'ids'}`
    });
  });

  printPlan(batch, rows);
  for (const warning of warnings) console.warn(`warning: ${warning}`);

  if (failures.length > 0) {
    console.error(`train-plan-check failed with ${failures.length} issue(s)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`train-plan-check passed for ${batch.id}: ${rows.length} planned task(s)`);
}

try {
  main();
} catch (error) {
  console.error(`train-plan-check failed: ${error.message}`);
  process.exit(1);
}
