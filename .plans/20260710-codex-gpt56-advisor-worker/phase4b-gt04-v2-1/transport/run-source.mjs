const read = await tools.exec_command({
  cmd: "Get-Content -Raw -Encoding UTF8 'C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-1/briefs/trial-01.md'"
});

const expectedHeader = "[" + "WORKER BRIEF" + "]";
if (read.exit_code !== 0) {
  throw new Error("Worker brief read failed: " + JSON.stringify(read));
}
if (!read.output.includes(expectedHeader)) {
  throw new Error("Worker brief header is missing");
}

const child = await tools.multi_agent_v1__spawn_agent({
  agent_type: "routine_worker",
  fork_context: false,
  message: read.output
});

notify(JSON.stringify(child));
const waitResult = await tools.multi_agent_v1__wait_agent({
  targets: [child.agent_id],
  timeout_ms: 300000
});
text(JSON.stringify(waitResult));
