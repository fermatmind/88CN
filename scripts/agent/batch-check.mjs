import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredStopReasons = [
  'secret_exposure',
  'scope_validation_failure',
  'policy_scan_failure',
  'required_github_check_failure',
  'credential_prompt'
];

const requiredBatchFields = [
  'id',
  'title',
  'phase',
  'tasks',
  'batch_limit',
  'auto_merge_allowed',
  'live_deploy_allowed',
  'payment_change_allowed',
  'mcp_change_allowed',
  'server_change_allowed',
  'plugin_install_allowed',
  'new_dependency_allowed',
  'continue_on_sidecar',
  'stop_on',
  'human_checkpoints',
  'required_preconditions',
  'allowed_roles',
  'notes'
];

const requiredCurrentFields = [
  'active_train',
  'status',
  'last_completed_train',
  'next_recommended_train',
  'notes'
];

const booleanFields = [
  'auto_merge_allowed',
  'live_deploy_allowed',
  'payment_change_allowed',
  'mcp_change_allowed',
  'server_change_allowed',
  'plugin_install_allowed',
  'new_dependency_allowed',
  'continue_on_sidecar'
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

const nonPrTaskIdPatterns = [
  /^TRAFFIC\d+[A-Z]?$/,
  /^GROWTH\d+[A-Z]?$/,
  /^OPS\d+[A-Z]?\d?$/,
  /^I18N\d+[A-Z]?$/,
  /^BETA\d+[A-Z]?$/
];

function parseArgs(argv) {
  const options = {
    registry: path.join(root, 'ops/trains/batches.json'),
    current: path.join(root, 'ops/trains/current.json'),
    roadmap: path.join(root, 'ops/tasks/roadmap.json')
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--registry' || arg === '--current' || arg === '--roadmap') {
      const value = argv[index + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      options[arg.slice(2)] = path.resolve(root, value);
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  return options;
}

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} missing: ${path.relative(root, filePath) || filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} invalid JSON: ${error.message}`);
  }
}

function add(failures, condition, message) {
  if (!condition) failures.push(message);
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

function expandRange(range) {
  const match = /^PR(\d+)-PR(\d+)$/.exec(range || '');
  if (!match) return [];
  const start = Number(match[1]);
  const end = Number(match[2]);
  const ids = [];
  for (let value = start; value <= end; value += 1) ids.push(`PR${value}`);
  return ids;
}

function skeletonIds(roadmap) {
  const ids = new Set();
  for (const skeleton of roadmap.skeletons || []) {
    if (Array.isArray(skeleton.ids)) {
      for (const id of skeleton.ids) ids.add(id);
    }
    for (const id of expandRange(skeleton.range)) ids.add(id);
  }
  return ids;
}

function hasCheckpoint(batch, task = 'ANY') {
  return (batch.human_checkpoints || []).some((checkpoint) => {
    if (!checkpoint || typeof checkpoint !== 'object') return false;
    if (task === null) return typeof checkpoint.task === 'string' && checkpoint.task.length > 0;
    return checkpoint.task === 'ANY' || checkpoint.task === task;
  });
}

function textIncludes(values, pattern) {
  return values.some((value) => pattern.test(String(value).toLowerCase()));
}

function taskNeedsCheckpoint(task) {
  const values = [
    task.id,
    task.title,
    task.type,
    task.phase,
    task.deployment,
    task.payments,
    task.mcp,
    task.public_pages,
    task.data_repo,
    ...(task.data_planes || []),
    ...(task.notes || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    task.human_checkpoint === true ||
    /checkpointed|human-manual|live-deploy|live deploy|server-config|server config|payment|stripe|mcp|external write|external-write|data repo mutation|data_repo mutation|customer access|pii|outreach|social posting|email send|dm send|crm write/.test(values)
  );
}

function validateNonPrTask(task, batch, failures, roadmapTaskIds, skeletonTaskIds) {
  const label = `${batch.id} task ${task?.id || '<missing id>'}`;
  for (const field of nonPrTaskRequiredFields) {
    add(failures, Object.hasOwn(task, field), `${label} missing required roadmap field ${field}`);
  }

  add(failures, Array.isArray(task.allowed_paths), `${label} allowed_paths must be array`);
  add(failures, Array.isArray(task.forbidden_paths), `${label} forbidden_paths must be array`);
  add(failures, Array.isArray(task.validations), `${label} validations must be array`);
  add(failures, Array.isArray(task.definition_of_done), `${label} definition_of_done must be array`);

  if (Array.isArray(task.depends_on)) {
    for (const dependency of task.depends_on) {
      add(
        failures,
        roadmapTaskIds.has(dependency) || skeletonTaskIds.has(dependency),
        `${label} dependency ${dependency} missing from roadmap and skeletons`
      );
    }
  }

  if (Array.isArray(batch.allowed_roles) && task.role) {
    add(failures, batch.allowed_roles.includes(task.role), `${label} role ${task.role} missing from batch allowed_roles`);
  }

  if (taskNeedsCheckpoint(task) && batch.auto_merge_allowed === true) {
    add(failures, false, `${label} requires checkpoint but ${batch.id} auto_merge_allowed=true`);
  }
}

function validateNonPrBatchRisk(batch, failures) {
  const label = batch?.id || '<missing id>';
  const riskFields = [
    'live_deploy_allowed',
    'server_change_allowed',
    'payment_change_allowed',
    'mcp_change_allowed',
    'plugin_install_allowed',
    'new_dependency_allowed',
    ...optionalRiskBooleanFields
  ];

  for (const field of optionalRiskBooleanFields) {
    add(failures, Object.hasOwn(batch, field), `${label} non-PR batch missing ${field}`);
    if (Object.hasOwn(batch, field)) {
      add(failures, typeof batch[field] === 'boolean', `${label} ${field} must be boolean`);
    }
  }

  for (const field of riskFields) {
    if (batch[field] === true) {
      add(failures, batch.auto_merge_allowed === false, `${label} ${field}=true requires auto_merge_allowed=false`);
      add(failures, hasCheckpoint(batch, null), `${label} ${field}=true requires explicit human checkpoint`);
    }
  }
}

function validateBatch(batch, failures, roadmapTasksById, roadmapTaskIds, skeletonTaskIds) {
  const label = batch?.id || '<missing id>';
  for (const field of requiredBatchFields) {
    add(failures, Object.hasOwn(batch, field), `${label} missing ${field}`);
  }

  if (!batch || typeof batch !== 'object') return;

  for (const field of booleanFields) {
    add(failures, typeof batch[field] === 'boolean', `${label} ${field} must be boolean`);
  }
  for (const field of optionalRiskBooleanFields) {
    if (Object.hasOwn(batch, field)) {
      add(failures, typeof batch[field] === 'boolean', `${label} ${field} must be boolean`);
    }
  }

  add(failures, Array.isArray(batch.tasks), `${label} tasks must be array`);
  add(failures, Number.isInteger(batch.batch_limit) && batch.batch_limit > 0, `${label} batch_limit must be positive integer`);
  add(failures, Array.isArray(batch.stop_on), `${label} stop_on must be array`);
  add(failures, Array.isArray(batch.human_checkpoints), `${label} human_checkpoints must be array`);
  add(failures, Array.isArray(batch.required_preconditions), `${label} required_preconditions must be array`);
  add(failures, Array.isArray(batch.allowed_roles), `${label} allowed_roles must be array`);
  add(failures, Array.isArray(batch.notes), `${label} notes must be array`);

  if (Array.isArray(batch.tasks)) {
    const taskIds = new Set();
    let nonPrTaskCount = 0;
    for (const taskId of batch.tasks) {
      add(failures, typeof taskId === 'string', `${label} task id must be string`);
      add(failures, !taskIds.has(taskId), `${label} duplicate task id ${taskId}`);
      taskIds.add(taskId);

      const kind = taskKind(taskId);
      add(failures, kind !== 'invalid', `${label} task ${taskId} must use PR<number> or allowlisted non-PR id family`);

      if (kind === 'pr') {
        add(
          failures,
          roadmapTaskIds.has(taskId) || skeletonTaskIds.has(taskId),
          `${label} task ${taskId} missing from roadmap and skeletons`
        );
      }

      if (kind === 'non_pr') {
        nonPrTaskCount += 1;
        add(failures, roadmapTaskIds.has(taskId), `${label} non-PR task ${taskId} must be fully registered in roadmap`);
        add(failures, !skeletonTaskIds.has(taskId), `${label} non-PR task ${taskId} must not be skeleton-only`);
        if (roadmapTasksById.has(taskId)) {
          validateNonPrTask(roadmapTasksById.get(taskId), batch, failures, roadmapTaskIds, skeletonTaskIds);
        }
      }
    }

    add(
      failures,
      batch.tasks.length <= batch.batch_limit,
      `${label} tasks.length ${batch.tasks.length} exceeds batch_limit ${batch.batch_limit}`
    );

    if (nonPrTaskCount > 0) {
      validateNonPrBatchRisk(batch, failures);
    }
  }

  if (Array.isArray(batch.stop_on)) {
    for (const reason of requiredStopReasons) {
      add(failures, batch.stop_on.includes(reason), `${label} stop_on missing ${reason}`);
    }
    if (batch.auto_merge_allowed === true) {
      add(failures, batch.stop_on.includes('required_github_check_failure'), `${label} auto merge missing required_github_check_failure stop`);
      add(failures, batch.stop_on.includes('scope_validation_failure'), `${label} auto merge missing scope_validation_failure stop`);
    }
  }

  for (const field of [
    'payment_change_allowed',
    'mcp_change_allowed',
    'server_change_allowed',
    'plugin_install_allowed',
    'new_dependency_allowed'
  ]) {
    if (batch[field] === true) {
      add(failures, hasCheckpoint(batch, null), `${label} ${field}=true requires human checkpoint`);
    }
  }

  if (batch.live_deploy_allowed === true) {
    add(failures, batch.server_change_allowed === false, `${label} live_deploy_allowed requires server_change_allowed=false`);
    const evidence = [...(batch.stop_on || []), ...(batch.notes || []), ...(batch.required_preconditions || [])];
    const mentionsLiveSmoke = textIncludes(evidence, /live-smoke-only/);
    const mentionsLiveConfig = textIncludes(evidence, /live-config-change|server-config-change|server configuration|server config/);
    add(failures, mentionsLiveSmoke, `${label} live deploy batch must distinguish live-smoke-only`);
    add(failures, mentionsLiveConfig, `${label} live deploy batch must distinguish live-config-change`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const registry = readJson(options.registry, 'batch registry');
  const current = readJson(options.current, 'current train');
  const roadmap = readJson(options.roadmap, 'roadmap');

  const failures = [];
  add(failures, Array.isArray(registry.batches), 'registry.batches must be array');

  for (const field of requiredCurrentFields) {
    add(failures, Object.hasOwn(current, field), `current.json missing ${field}`);
  }

  const roadmapTaskIds = new Set((roadmap.tasks || []).map((task) => task.id));
  const roadmapTasksById = new Map((roadmap.tasks || []).map((task) => [task.id, task]));
  const skeletonTaskIds = skeletonIds(roadmap);
  const batchIds = new Set();

  for (const batch of registry.batches || []) {
    add(failures, typeof batch.id === 'string' && batch.id.length > 0, 'batch id must be non-empty string');
    if (batch.id) {
      add(failures, !batchIds.has(batch.id), `duplicate batch id ${batch.id}`);
      batchIds.add(batch.id);
    }
    validateBatch(batch, failures, roadmapTasksById, roadmapTaskIds, skeletonTaskIds);
  }

  if (current.next_recommended_train !== null) {
    add(failures, batchIds.has(current.next_recommended_train), `next_recommended_train ${current.next_recommended_train} missing from registry`);
  }
  if (current.active_train !== null) {
    add(failures, batchIds.has(current.active_train), `active_train ${current.active_train} missing from registry`);
  }

  if (failures.length > 0) {
    console.error(`batch-check failed with ${failures.length} issue(s)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`batch-check passed: ${batchIds.size} batches, ${roadmapTaskIds.size} roadmap tasks, ${skeletonTaskIds.size} skeleton tasks`);
}

try {
  main();
} catch (error) {
  console.error(`batch-check failed: ${error.message}`);
  process.exit(1);
}
