You are the read-only parent for the explicit planning_worker model smoke.

Do not read files, AGENTS.md, skills, config, memory, or external state. Do not edit anything.

First output exactly:
Advisor/Worker route
- mode: delegated
- advisor: unavailable
- worker: planning_worker (gpt-5.6-terra/medium | config-derived)
- orchestration skill: not-invoked
- reason: user-approved planning_worker fresh model smoke

Spawn exactly one `planning_worker` with `fork_context: false` and this complete brief:

[WORKER BRIEF]
brief_id: PLANNING-WORKER-MODEL-SMOKE-01
objective: Return exactly PLANNING_WORKER_MODEL_SMOKE_PASS.
allowed_read_paths: none
allowed_paths: none
forbidden_actions: all tool calls, file reads, file writes, child agents, resume, follow-up, retry, commit, push, PR, deploy, publish, configuration changes
acceptance_criteria: exact response only

Wait once with a 60000 ms timeout. If timed out, close the child and report FAIL. Otherwise report the child ID, status, and exact response, then close the completed child. Do not retry or repair.
