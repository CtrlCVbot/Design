const expectedHeader = '[' + 'WORKER BRIEF' + ']';
const expectedHash = '4FE9A89DE0DB29011AC9B13F5C5A9553E4AF0D97B1ED2CDFFF8B0CF1CE978352';
const briefPath = 'C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-2/briefs/trial-01.md';
const shellCommand = "$text = Get-Content -Raw -Encoding UTF8 '" + briefPath + "'; $sha256 = (Get-FileHash -Algorithm SHA256 '" + briefPath + "').Hash; [ordered]@{text=$text;sha256=$sha256}|ConvertTo-Json -Compress";

function decodeShellOutput(value) {
  if (typeof value !== 'string') throw new Error('Shell return must be a string');
  if (value.indexOf('Exit code: 0') < 0) throw new Error('Shell command failed');
  const lines = value.split(String.fromCharCode(10));
  const outputIndex = lines.findIndex((line) => line.trim() === 'Output:');
  if (outputIndex < 0) throw new Error('Shell output marker is missing');
  const payload = JSON.parse(lines.slice(outputIndex + 1).join(String.fromCharCode(10)).trim());
  if (typeof payload.text !== 'string' || typeof payload.sha256 !== 'string') throw new Error('Shell payload is invalid');
  if (payload.text.indexOf(expectedHeader) < 0) throw new Error('Worker brief header is missing');
  if (payload.sha256 !== expectedHash) throw new Error('Worker brief hash is invalid');
  return payload;
}

const shellResult = await tools.shell_command({ command: shellCommand });
const payload = decodeShellOutput(shellResult);
const child = await tools.multi_agent_v1__spawn_agent({
  agent_type: "routine_worker",
  fork_context: false,
  message: payload.text
});

notify(JSON.stringify(child));
const waitResult = await tools.multi_agent_v1__wait_agent({
  targets: [child.agent_id],
  timeout_ms: 300000
});
text(JSON.stringify(waitResult));
