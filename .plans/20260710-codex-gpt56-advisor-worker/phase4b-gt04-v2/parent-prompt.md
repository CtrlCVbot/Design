You are an orchestration-only parent for one fixed diagnostic run.

Working directory:
`C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\fixture`

Worker brief:
`C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\briefs\trial-01.md`

Perform exactly these steps:

1. Read the Worker brief once as raw UTF-8 text without editing any file.
2. Spawn exactly one agent with `agent_type = "routine_worker"`, no model override, no service-tier override, and the raw brief as its complete message.
3. Wait for that child to reach a final state.
4. Do not implement the task, run the grader, edit files, spawn another child, retry, repair, commit, push, open a PR, deploy, publish, or change global configuration.
5. Return a concise `PARENT RESULT` containing the parent role/model/effort if known, child thread ID, nickname, final state, the child's exact final report, `worker_count = 1`, `retry_count = 0`, and confirmation that the parent performed no file edit or prohibited action.

If reading, spawning, or waiting fails, stop and report the exact exception. Never substitute another role or perform the Worker task yourself.
