[WORKER BRIEF]
brief_id: WB-phase4a-routine-agent-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium because the current in-app API does not expose newly registered custom role names
objective:
- Create the personal custom agent `routine_worker` as a narrow Luna/medium executor for deterministic transformations.
why:
- Phase 4-A needs a low-cost Worker that stops instead of improvising when a routine rule has an exception or requires judgment.
known_context:
- repo root: C:\Users\beck\.codex\agents
- repo state: personal global agent directory; pre-change checkpoint `advisor-worker-phase4a` has been validated; `routine-worker.toml` is absent
- current behavior: only `implementation-worker.toml` exists; fresh CLI loaded that Terra/medium agent in Phase 2, while the current app API exposes built-in roles only
- architecture decision: standalone TOML with `name = routine_worker`, `model = gpt-5.6-luna`, `model_reasoning_effort = medium`; omit sandbox, approval, service tier, MCP, and skill overrides so parent runtime policy is inherited
- relevant files: `implementation-worker.toml` is the read-only style and safety reference; official schema requires `name`, `description`, and `developer_instructions`
allowed_paths:
- C:\Users\beck\.codex\agents\routine-worker.toml
forbidden_paths:
- C:\Users\beck\.codex\agents\implementation-worker.toml
- C:\Users\beck\.codex\config.toml
- C:\Users\beck\.codex\AGENTS.md
- C:\Users\beck\.agents\**
- C:\Work\Dev\Design\** and unrelated existing changes
workspace_isolation:
- mode: existing_single_worker with exclusive ownership of the new routine agent file
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: none; creation forbidden
- build/test cache: none; use `python -B` for validation
- test database: none
allowed_commands:
- read `implementation-worker.toml` with `Get-Content`
- parse only `routine-worker.toml` with Python `tomllib` and inspect its ASCII bytes
- no commit, push, PR, deploy, package publish, production write, or other global file edit
conventions:
- ASCII TOML; narrow deterministic role; preserve the existing custom agent style; no built-in agent name; no permission or tool-surface override
known_pitfalls:
- the `name` field is the source of truth; use `routine_worker` while the filename remains `routine-worker.toml`
- stop on any exception, ambiguity, architecture choice, or path outside the mechanical routine brief
- do not copy Terra implementation language that permits open-ended feature work
acceptance_criteria:
- [ ] required schema fields are present and TOML parses
- [ ] exact route is `gpt-5.6-luna/medium`
- [ ] nickname candidates are unique, non-empty, and use allowed ASCII characters
- [ ] instructions require a complete routine brief, mechanical output rule, acceptance check, zero unhandled exceptions, and stop-on-judgment behavior
- [ ] instructions forbid scope expansion, child agents, commit, push, PR, deployment, publish, production, and global configuration edits
- [ ] sandbox, approval, service tier, MCP, and skill overrides are absent
required_tests:
- `python -B -c <tomllib assertions for required fields, exact route, forbidden override absence, and instruction markers>` -> expected: PASS
- ASCII decode and nickname uniqueness/character check -> expected: PASS
parallel_ownership:
- worker owns only: `C:\Users\beck\.codex\agents\routine-worker.toml`
- shared files/state: health-check Worker owns only `C:\Users\beck\.agents\skills\agentic-health-check`; do not edit or revert its files
stop_conditions:
- acceptance criteria requires an architecture decision
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, or production operation is needed
- existing user change conflicts
report_format:
1. changed files and why
2. tests run and exact result
3. assumptions made
4. unresolved risks or blocked items
5. confirm no commit, push, PR, deployment, or other global file edit
