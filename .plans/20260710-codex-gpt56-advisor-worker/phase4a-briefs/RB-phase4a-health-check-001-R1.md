[REPAIR BRIEF]
parent_brief_id: WB-phase4a-health-check-001
repair_id: WB-phase4a-health-check-001-R1

verified_failure:
- command/check: Advisor read the checkpoint diff, reran 8 unit tests and live health, then compared constants and tests with the current official Codex Subagents schema
- observed: tests pass and live required agents pass, but the validator rejects some officially valid extra agents and misses the real `sandbox_mode` override key
- expected: official standalone schema and nickname rules are accepted while the local required-route and no-override policy is enforced exactly

diff_findings:
- `REQUIRED_AGENT_FIELDS` incorrectly requires `model` and `model_reasoning_effort` for every custom agent; official standalone required fields are only `name`, `description`, and `developer_instructions`; exact model/effort remains required separately for `implementation_worker` and `routine_worker`
- `NICKNAME_PATTERN` incorrectly permits only lowercase identifier form; official nicknames allow ASCII letters, digits, spaces, hyphens, and underscores, and must be non-empty and unique
- nickname list uniqueness is not checked
- `BUILTIN_AGENT_NAMES` contains undocumented `planner`; current official built-ins are `default`, `worker`, and `explorer`
- `FORBIDDEN_REQUIRED_AGENT_OVERRIDES` omits the actual supported key `sandbox_mode`; aliases such as `sandbox`, `approval`, `mcp`, and `service-tier` are not the documented keys
- current nickname test treats a space as invalid even though spaces are officially allowed

repair_scope:
- allowed: `scripts/agentic_health_check.py`, `tests/test_agentic_health_check.py`, `SKILL.md`, `references/checks.md` under `C:\Users\beck\.agents\skills\agentic-health-check`
- forbidden: all `.codex` files, orchestration skill, `agents/openai.yaml`, cache, checkpoints, Design docs, and unrelated paths

required_action:
- reduce general required agent fields to the three official standalone required fields
- keep exact model/effort enforcement only in `REQUIRED_AGENT_ROUTES`
- use the exact built-in set `default`, `worker`, `explorer`
- validate optional nicknames with non-empty unique strings matching ASCII letters, digits, spaces, hyphens, and underscores
- enforce documented forbidden keys on the two required agents: `sandbox_mode`, `approval_policy`, `service_tier`, `mcp_servers`, and `skills`
- update docs only where the corrected behavior needs clarification

required_tests:
- preserve all previous healthy, malformed, missing, duplicate-name, route, limit, and main-exit tests
- add a passing extra custom agent with only the three required fields, no model/effort, and valid nicknames such as `Atlas One` and `delta-two`
- demonstrate that custom name `planner` is not treated as built-in shadowing
- fail for a built-in name such as `worker`
- fail for duplicate nicknames, punctuation outside the allowed set, and actual `sandbox_mode` on a required agent
- run `python -B -m unittest discover -s tests -v` and report exact result

stop_conditions:
- stop for an architecture decision or an out-of-scope path

report:
- changed files, exact tests, remaining risk
- no commit, push, PR, deployment, global config edit, or child agent spawn
