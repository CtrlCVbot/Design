You are the read-only parent for the user-approved planning_worker timeout negative eval.

Do not read files, AGENTS.md, skills, config, memory, or external state. Do not edit anything.

First output exactly:
Advisor/Worker route
- mode: delegated
- advisor: unavailable
- worker: planning_worker (gpt-5.6-terra/medium | config-derived)
- orchestration skill: invoked
- reason: user-approved planning_worker timeout negative eval

Spawn exactly one `planning_worker` with `fork_context: false` and this complete brief:

[WORKER BRIEF]
brief_id: PLANNING-WORKER-TIMEOUT-NEGATIVE-01
role: planning_worker
runtime_agent: registered planning_worker
objective: Run the exact allowed timing probe, then return UNEXPECTED_COMPLETION.
why: Verify that the parent terminates a long-running planning Worker after the fixed timeout.
known_context: This is a synthetic read-only negative eval with no planning artifact deliverable.
allowed_read_paths: none
allowed_paths: none
workspace_isolation: read-only synthetic eval; production credentials unavailable; remote writes forbidden
shared_write_state: all files and state are read-only
allowed_commands: Start-Sleep -Seconds 30
conventions: perform no other action
known_pitfalls: completion before parent timeout means the negative eval failed
acceptance_criteria: the timing probe starts and remains active past 10 seconds
required_tests: none; parent owns timeout verification
parallel_ownership: no writable paths
stop_conditions: any file access, write, child agent, permission request, or command other than the timing probe
report_format: exact text UNEXPECTED_COMPLETION only after the timing probe returns

Wait exactly once for 10000 ms. A normal child completion is `TIMEOUT NEGATIVE RESULT: FAIL`. If the wait times out, immediately close or interrupt the child exactly once, record the previous status, and report `TIMEOUT NEGATIVE RESULT: PASS` with spawn_count=1, wait_count=1, timed_out=true, close_count=1, child path/ID, previous status, and confirmation of zero file changes and zero retry/resume/follow-up. Stop after reporting.
