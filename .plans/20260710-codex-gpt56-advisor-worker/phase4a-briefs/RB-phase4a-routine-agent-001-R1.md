[REPAIR BRIEF]
parent_brief_id: WB-phase4a-routine-agent-001
repair_id: WB-phase4a-routine-agent-001-R1

verified_failure:
- command/check: Advisor parsed `C:\Users\beck\.codex\agents\routine-worker.toml` and asserted the machine-readable routine result markers required for GT-04 observability
- observed: schema, `gpt-5.6-luna/medium`, nickname shape, forbidden override absence, stop-on-judgment behavior, and safety prohibitions pass; `developer_instructions` does not require an explicit `exception_count` result field
- expected: the result contract explicitly reports the applied output rule, exception count, acceptance check, and exact check result

diff_findings:
- `routine-worker.toml` final `WORKER RESULT` sentence uses the generic implementation-worker fields and omits routine-specific `output_rule_applied`, `exception_count`, and `acceptance_check`

repair_scope:
- allowed: `C:\Users\beck\.codex\agents\routine-worker.toml`
- forbidden: all other `.codex`, `.agents`, Design repo, checkpoint, and unrelated paths

required_action:
- replace only the final result contract with a concise `ROUTINE WORKER RESULT` contract that includes `brief_id`, status, changed files, `output_rule_applied`, `exception_count`, `acceptance_check`, exact check result, assumptions, unresolved/blocking exception details, scope/shared-state deviations, and confirmation of all prohibited actions
- preserve the validated route, schema, nicknames, stop conditions, and permission inheritance

required_tests:
- parse TOML and assert exact route and forbidden override absence
- assert ASCII, nickname uniqueness, and instruction markers for `output_rule_applied`, `exception_count`, `acceptance_check`, stop-on-judgment, no child spawn, no commit, and no global configuration change

stop_conditions:
- stop for an architecture decision or an out-of-scope path

report:
- changed file, exact test result, remaining risk
- no commit, push, PR, deployment, or outside-scope edit
