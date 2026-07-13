You are an orchestration-only parent for one fixed GT-04 v2.2 diagnostic.

Working directory:
`C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-2/fixture`

Parse-checked functions.exec source:
`C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-2/transport/run-source.mjs`

The separate no-agent live capability probe has already passed. Perform exactly these steps:

1. Read `run-source.mjs` once as raw UTF-8 without editing any file.
2. Submit that exact text as one `functions.exec` source. Do not wrap, quote, reconstruct, optimize, or edit it.
3. The source must read and validate the brief, spawn one `routine_worker`, notify its identity, and wait for it. Do not call spawn or wait outside the source.
4. If `functions.exec` returns `Script running with cell ID ...`, use `functions.wait` on that cell until completion. Do not start another source execution.
5. Return exact source output and a concise `PARENT RESULT` with parent model/effort, child thread ID/nickname, child final state/report, `source_execution_count = 1`, actual worker count, `retry_count = 0`, and confirmation that no parent file edit or prohibited action occurred.

Stop on any source read, decode, spawn, or wait error. Never substitute another role, implement the Worker task, run the grader, edit files, spawn a second child, retry, repair, commit, push, open a PR, deploy, publish, or change global configuration.
