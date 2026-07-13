You are a fixed read-only Phase 5 delegated-route smoke test.

Do not read files, AGENTS.md, skills, config, memory, or external state. Do not modify anything.

First output exactly:
Advisor/Worker route
- mode: delegated
- advisor: unavailable
- worker: implementation_worker (gpt-5.6-terra/medium | config-derived)
- orchestration skill: not-invoked
- reason: fixed Phase 5 delegated-route smoke

Spawn exactly one `implementation_worker` with `fork_context: false` and the following complete brief:

[WORKER BRIEF]
brief_id: PHASE5-RELEASE-SMOKE-001
objective: Return exactly IMPLEMENTATION_WORKER_SMOKE_PASS.
allowed_paths: none
forbidden_actions: all tool calls, file reads, file writes, agent spawn, commit, push, PR, deploy, publish, configuration changes
acceptance_criteria: exact text only

Wait exactly once for the child. Report the child ID, completion status, and exact child response. Do not retry or repair. Stop on any error.
