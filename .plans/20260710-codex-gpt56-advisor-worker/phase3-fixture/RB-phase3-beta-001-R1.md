[REPAIR BRIEF]
parent_brief_id: WB-phase3-beta-001
repair_id: WB-phase3-beta-001-R1

verified_failure:
- command/check: Advisor ran `python -B -m unittest discover -s tests -v` from `C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace`
- observed: 8 tests ran; 7 passed and `test_registers_all_implemented_features` failed because actual `{'features': ['alpha']}` did not equal expected `{'features': ['alpha', 'beta']}`
- expected: all 8 tests pass and the registry contains alpha followed by beta

diff_findings:
- `registry/features.json`: the serial-only integration registry still contains only `alpha`; initial parallel briefs correctly forbade both Workers from editing it
- `alpha/tag_tools.py` and `beta/retry_schedule.py`: Advisor-reviewed implementation diffs are correct and their 3 + 4 focused tests pass; do not modify them

repair_scope:
- allowed: `C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace\registry\features.json`
- forbidden: baseline fixture, `workspace/alpha/**`, `workspace/beta/**`, `workspace/tests/**`, `AGENTS.md`, plan documents, generated output, cache, lockfile, and unrelated WIP

required_action:
- Add `beta` after `alpha` in the existing JSON `features` array without changing the schema or any other file

required_tests:
- from the workspace root run `python -B -m unittest tests.test_feature_registry -v`
- then run `python -B -m unittest discover -s tests -v`

stop_conditions:
- stop for an architecture decision or an out-of-scope path
- stop for destructive commands, permission escalation, secret access, remote write, or production operations

report:
- changed files, exact test results, and remaining risk
- confirm no scope deviation, shared-state deviation, commit, push, PR, deployment, global edit, or child agent spawn
