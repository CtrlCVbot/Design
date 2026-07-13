[WORKER BRIEF]
brief_id: WB-phase4a-health-check-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium because the current in-app API does not expose newly registered custom role names
objective:
- Extend agentic-health-check with tested custom-agent schema, required routing, built-in shadowing, forbidden override, and `[agents]` limit checks without regressing existing checks.
why:
- Phase 4-A needs a repeatable audit that detects broken or unsafe global Advisor/Worker configuration before normal work starts.
known_context:
- repo root: C:\Users\beck\.agents\skills\agentic-health-check
- repo state: personal global skill outside Git; 8-file pre-change checkpoint `advisor-worker-phase4a` validated; no existing unit tests
- current behavior: live script exits 0 and reports AGENTS, config/hooks, skills, commands, memories, and plugins; config is WARN only because of 15 pre-existing stale hook hashes
- architecture decision: add a separate custom-agent check and output row; validate all standalone TOML files for parse/schema/name safety, validate exact required routes for `implementation_worker = gpt-5.6-terra/medium` and `routine_worker = gpt-5.6-luna/medium`, require no sandbox/approval/service-tier/MCP/skills override on those two agents, and validate effective `max_threads <= 4`, `max_depth = 1`
- relevant files: `scripts/agentic_health_check.py` owns checks/output; new `tests/test_agentic_health_check.py` provides stdlib unittest; `SKILL.md` and `references/checks.md` document the new audit
allowed_paths:
- C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py
- C:\Users\beck\.agents\skills\agentic-health-check\tests\test_agentic_health_check.py
- C:\Users\beck\.agents\skills\agentic-health-check\SKILL.md
- C:\Users\beck\.agents\skills\agentic-health-check\references\checks.md
forbidden_paths:
- C:\Users\beck\.codex\**
- C:\Users\beck\.agents\skills\advisor-worker-orchestration\**
- health-check `agents/openai.yaml` and `scripts/__pycache__/**`
- C:\Work\Dev\Design\** and unrelated existing changes
workspace_isolation:
- mode: existing_single_worker with exclusive ownership of the health-check skill paths above
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: existing `scripts/__pycache__` is forbidden; run tests with `python -B`
- build/test cache: no new cache may be written
- test database: none
allowed_commands:
- read the four allowed files and read-only global `config.toml`/agent TOMLs when needed for context
- run `python -B -m unittest discover -s tests -v` from the health-check skill root
- do not run the live global health script while the parallel routine-agent lane is unresolved; Advisor owns that serial verification after both Workers finish
- no commit, push, PR, deploy, package publish, production write, or edits outside allowed paths
conventions:
- TDD: create failing unittest cases first, observe RED, then implement the minimum change and refactor
- Python standard library only; retain UTF-8 Korean Markdown output; keep existing checks and return keys compatible
- make checks deterministic and testable by temporarily replacing the module-level `CODEX_HOME` in isolated `TemporaryDirectory` fixtures
known_pitfalls:
- extra valid custom agents may exist later; validate their parse, required fields, unique source-of-truth names, optional nickname shape, and built-in shadowing, but enforce exact model/effort only for the two required Advisor/Worker agents
- omitted `max_threads` has effective default 6 and must fail the local `<= 4` policy; omitted `max_depth` has effective default 1
- current live health status must remain WARN, not FAIL, for the separate pre-existing stale hook hashes
- `status()` uses fail only when `ok` is false; main must return nonzero when the new custom-agent row fails
acceptance_criteria:
- [ ] tests cover healthy configuration, missing agent directory/required agent, malformed or incomplete TOML, duplicate or built-in-shadowing name, invalid nickname, wrong required route or forbidden override, and invalid thread/depth limits
- [ ] a healthy fixture returns pass with agent count, required route count, override count, and effective limits
- [ ] live output adds a `custom agents` row and useful detail without changing existing row semantics
- [ ] main returns 1 when AGENTS, config, or custom agents fail
- [ ] all unit tests pass; Advisor can then run the live health-check after the parallel routine-agent lane finishes
- [ ] docs list the added automated and manual checks
required_tests:
- RED: `python -B -m unittest discover -s tests -v` after tests are written but before implementation -> expected: FAIL for missing custom-agent check behavior
- GREEN: same command after implementation -> expected: PASS
- Advisor-only after both lanes: `python -B scripts/agentic_health_check.py` -> expected: exit 0; custom agents PASS; config remains WARN only for stale hook trust
parallel_ownership:
- worker owns only: the four allowed health-check paths
- shared files/state: routine-agent Worker owns only `C:\Users\beck\.codex\agents\routine-worker.toml`; do not edit or revert it, and do not depend on its completion in unit tests
stop_conditions:
- acceptance criteria requires an architecture decision
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, or production operation is needed
- existing user change conflicts
report_format:
1. changed files and why
2. RED and GREEN tests with exact results
3. assumptions made
4. unresolved risks or blocked items
5. confirm no commit, push, PR, deployment, or outside-scope edit
