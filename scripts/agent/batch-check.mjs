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

function validateBatch(batch, failures, roadmapTaskIds, skeletonTaskIds) {
  const label = batch?.id || '<missing id>';
  for (const field of requiredBatchFields) {
    add(failures, Object.hasOwn(batch, field), `${label} missing ${field}`);
  }

  if (!batch || typeof batch !== 'object') return;

  for (const field of booleanFields) {
    add(failures, typeof batch[field] === 'boolean', `${label} ${field} must be boolean`);
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
    for (const taskId of batch.tasks) {
      add(failures, typeof taskId === 'string', `${label} task id must be string`);
      add(failures, !taskIds.has(taskId), `${label} duplicate task id ${taskId}`);
      taskIds.add(taskId);
      add(
        failures,
        roadmapTaskIds.has(taskId) || skeletonTaskIds.has(taskId),
        `${label} task ${taskId} missing from roadmap and skeletons`
      );
    }

    add(
      failures,
      batch.tasks.length <= batch.batch_limit,
      `${label} tasks.length ${batch.tasks.length} exceeds batch_limit ${batch.batch_limit}`
    );
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
  const skeletonTaskIds = skeletonIds(roadmap);
  const batchIds = new Set();

  for (const batch of registry.batches || []) {
    add(failures, typeof batch.id === 'string' && batch.id.length > 0, 'batch id must be non-empty string');
    if (batch.id) {
      add(failures, !batchIds.has(batch.id), `duplicate batch id ${batch.id}`);
      batchIds.add(batch.id);
    }
    validateBatch(batch, failures, roadmapTaskIds, skeletonTaskIds);

    if (Array.isArray(batch.tasks)) {
      const numbers = batch.tasks.map(taskNumber).filter((value) => value !== null);
      add(failures, numbers.length === batch.tasks.length, `${batch.id} tasks must use PR<number> ids`);
    }
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
