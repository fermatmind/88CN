import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const nonPrTaskIdPatterns = [
  /^AGENT\d+[A-Z]?$/,
  /^AGENTQ$/,
  /^AGENT-INTEGRATION\d+$/,
  /^BULK\d+_AGENT_DRY_RUN$/,
  /^TRAFFIC\d+[A-Z]?$/,
  /^GROWTH\d+[A-Z]?$/,
  /^OPS\d+[A-Z]?\d?$/,
  /^I18N\d+[A-Z]?$/,
  /^BETA\d+[A-Z]?$/
];

const nonPrTaskRequiredFields = [
  'id',
  'title',
  'role',
  'type',
  'repo',
  'allowed_paths',
  'forbidden_paths',
  'validations',
  'definition_of_done',
  'deployment',
  'human_checkpoint'
];

const optionalRiskBooleanFields = [
  'external_service_allowed',
  'data_repo_mutation_allowed',
  'public_api_release_allowed',
  'customer_access_allowed',
  'pii_collection_allowed',
  'social_posting_allowed',
  'outreach_automation_allowed'
];

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

function taskNumber(taskId) {
  const match = /^PR(\d+)$/.exec(taskId);
  return match ? Number(match[1]) : null;
}

function taskKind(taskId) {
  if (typeof taskId !== 'string') return 'invalid';
  if (taskNumber(taskId) !== null) return 'pr';
  if (nonPrTaskIdPatterns.some((pattern) => pattern.test(taskId))) return 'non_pr';
  return 'invalid';
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

function taskNeedsExternalWrite(task, taskId) {
  return /\b(external write|external-write|email send|dm send|crm write|social posting|outreach automation)\b/.test(taskText(task, taskId));
}

function taskNeedsDataRepoMutation(task, taskId) {
  return String(task?.data_repo || '').toLowerCase() !== 'none' || /\bdata repo mutation|data_repo mutation\b/.test(taskText(task, taskId));
}

function taskRequiresCheckpoint(task, taskId) {
  if (!task) return false;
  return (
    isTaskCheckpoint(task) ||
    /checkpointed|human-manual/.test(taskText(task, taskId)) ||
    taskNeedsLiveDeployment(task) ||
    taskNeedsPayment(task, taskId) ||
    taskNeedsMcp(task, taskId) ||
    taskNeedsServerConfig(task) ||
    taskNeedsExternalWrite(task, taskId) ||
    taskNeedsDataRepoMutation(task, taskId)
  );
}

function nonPrTaskMissingFields(task) {
  if (!task) return nonPrTaskRequiredFields;
  return nonPrTaskRequiredFields.filter((field) => !Object.hasOwn(task, field));
}

function batchRiskFlags(batch) {
  return [
    'live_deploy_allowed',
    'server_change_allowed',
    'payment_change_allowed',
    'mcp_change_allowed',
    'plugin_install_allowed',
    'new_dependency_allowed',
    ...optionalRiskBooleanFields
  ].filter((field) => batch[field] === true);
}

function taskRiskFlags(task, taskId) {
  if (!task) return [];
  const flags = [];
  if (taskNeedsLiveDeployment(task)) flags.push('live_deploy');
  if (taskNeedsServerConfig(task)) flags.push('server_config');
  if (taskNeedsPayment(task, taskId)) flags.push('payment');
  if (taskNeedsMcp(task, taskId)) flags.push('mcp');
  if (taskNeedsExternalWrite(task, taskId)) flags.push('external_write');
  if (taskNeedsDataRepoMutation(task, taskId)) flags.push('data_repo_mutation');
  return flags;
}

function printPlan(batch, rows) {
  console.log(`train-plan dry run: ${batch.id} - ${batch.title}`);
  console.log('index | task | title | role | type | deployment | human_checkpoint | can_auto_merge | risk_flags | stop_reason | notes');
  for (const row of rows) {
    console.log([
      row.index,
      row.id,
      row.title,
      row.role,
      row.type,
      row.deployment,
      row.humanCheckpoint ? 'yes' : 'no',
      row.canAutoMerge ? 'yes' : 'no',
      row.riskFlags,
      row.stopReason,
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
    const kind = taskKind(taskId);

    if (kind === 'invalid') {
      failures.push(`${taskId} must use PR<number> or allowlisted non-PR id family`);
      return;
    }

    if (kind === 'non_pr' && !task) {
      failures.push(`${taskId} non-PR task must be fully registered in roadmap`);
      return;
    }

    if (kind === 'non_pr' && skeleton) {
      failures.push(`${taskId} non-PR task must not be skeleton-only`);
      return;
    }

    if (kind === 'pr' && !task && !skeleton) {
      failures.push(`${taskId} missing from roadmap and skeletons`);
      return;
    }

    const humanCheckpoint = task ? isTaskCheckpoint(task) || checkpointDeclared(batch, taskId) : checkpointDeclared(batch, taskId);
    const requiresCheckpoint = taskRequiresCheckpoint(task, taskId);
    if ((humanCheckpoint || requiresCheckpoint) && batch.auto_merge_allowed === true) {
      failures.push(`${taskId} requires checkpoint but ${batch.id} auto_merge_allowed=true`);
    }

    if (kind === 'non_pr' && task) {
      const missingFields = nonPrTaskMissingFields(task);
      if (missingFields.length > 0) {
        failures.push(`${taskId} non-PR roadmap task missing required fields: ${missingFields.join(',')}`);
      }
      if (Array.isArray(batch.allowed_roles) && !batch.allowed_roles.includes(task.role)) {
        failures.push(`${taskId} role ${task.role} missing from ${batch.id} allowed_roles`);
      }
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

    if (batch.external_service_allowed === false && task && taskNeedsExternalWrite(task, taskId)) {
      const allowedByCheckpoint = isTaskCheckpoint(task) && checkpointDeclared(batch, taskId);
      if (!allowedByCheckpoint) failures.push(`${taskId} indicates external write but external_service_allowed=false`);
    }

    if (batch.data_repo_mutation_allowed === false && task && taskNeedsDataRepoMutation(task, taskId)) {
      const allowedByCheckpoint = isTaskCheckpoint(task) && checkpointDeclared(batch, taskId);
      if (!allowedByCheckpoint) failures.push(`${taskId} indicates data repo mutation but data_repo_mutation_allowed=false`);
    }

    if (kind === 'non_pr') {
      for (const field of optionalRiskBooleanFields) {
        if (!Object.hasOwn(batch, field)) failures.push(`${batch.id} non-PR batch missing ${field}`);
      }
      for (const field of batchRiskFlags(batch)) {
        if (batch.auto_merge_allowed === true || !checkpointDeclared(batch, taskId)) {
          failures.push(`${batch.id} ${field}=true requires non-auto batch and explicit human checkpoint for ${taskId}`);
        }
      }
    }

    const rowRiskFlags = [...new Set([...taskRiskFlags(task, taskId), ...batchRiskFlags(batch)])];
    const stopReason = humanCheckpoint
      ? 'human_checkpoint'
      : requiresCheckpoint
        ? 'checkpoint_required'
        : rowRiskFlags.length > 0
          ? 'risk_flag'
          : 'none';

    rows.push({
      index: index + 1,
      id: taskId,
      title: task?.title || skeleton?.purpose || 'RESERVED_FUTURE_TASK',
      role: task?.role || 'RESERVED_FUTURE_TASK',
      type: task?.type || 'RESERVED_FUTURE_TASK',
      deployment: task?.deployment || 'RESERVED_FUTURE_TASK',
      humanCheckpoint,
      canAutoMerge: batch.auto_merge_allowed === true && !humanCheckpoint,
      riskFlags: rowRiskFlags.length > 0 ? rowRiskFlags.join(',') : 'none',
      stopReason,
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
