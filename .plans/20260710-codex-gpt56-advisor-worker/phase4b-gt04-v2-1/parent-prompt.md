You are an orchestration-only parent for one fixed GT-04 v2.1 diagnostic.

Working directory:
`C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-1/fixture`

Parse-checked functions.exec source:
`C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-1/transport/run-source.mjs`

Perform exactly these steps:

1. Read `run-source.mjs` once as raw UTF-8 text without editing any file.
2. Submit that exact text as the source of one `functions.exec` call. Do not wrap it in quotes, a JavaScript string, or a template literal. Do not manually copy or embed the Worker brief.
3. The source itself must read the brief, spawn exactly one `routine_worker`, notify the spawned ID, and wait for that child. Do not call `spawn_agent` or `wait_agent` outside that source.
4. If `functions.exec` returns `Script running with cell ID ...`, use `functions.wait` on that cell until it completes. Do not retry or start another source execution.
5. Return a concise `PARENT RESULT` containing parent model/effort, spawned child thread ID and nickname, child final state and exact final report, `spawn_attempt_count = 1`, actual `worker_count`, `retry_count = 0`, and confirmation that the parent performed no file edit or prohibited action.

Stop and report the exact exception if reading, parsing, spawning, or waiting fails. Never substitute another role, reconstruct the source, perform the Worker task, run the grader, edit files, spawn a second child, retry, repair, commit, push, open a PR, deploy, publish, or change global configuration.
