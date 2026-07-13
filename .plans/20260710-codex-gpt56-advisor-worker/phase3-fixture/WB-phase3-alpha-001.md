[WORKER BRIEF]
brief_id: WB-phase3-alpha-001
role: implementation_worker
runtime_agent: worker with explicit gpt-5.6-terra/medium; current in-app multi-agent API rejected the newly registered custom role name before spawn
objective:
- Implement `normalize_tags` so all existing alpha focused tests pass.
why:
- Validate a bounded Terra implementation Worker on one side of a disjoint parallel write fixture.
known_context:
- repo root: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace
- repo state: disposable fixture `phase3-v1`; baseline copy is immutable; no Git repository or production data
- current behavior: `python -B -m unittest tests.test_tag_tools -v` fails 3 tests with `NotImplementedError`
- architecture decision: use one deterministic typed function; trim and lowercase tags, discard blanks, deduplicate in first-seen order, and do not mutate input
- relevant files: `alpha/tag_tools.py` is the only writable source; `tests/test_tag_tools.py` is the read-only specification; `AGENTS.md` contains fixture rules
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace\alpha\tag_tools.py
forbidden_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\baseline\**
- workspace `beta/**`, `registry/**`, `tests/**`, `AGENTS.md`, all plan documents, and unrelated existing changes
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: none; creation forbidden
- build/test cache: existing Advisor-owned `__pycache__` is forbidden; use `python -B` so this Worker writes no cache
- test database: none
allowed_commands:
- read `AGENTS.md`, `alpha/tag_tools.py`, and `tests/test_tag_tools.py` with `Get-Content` or `rg`
- from repo root run `python -B -m unittest tests.test_tag_tools -v`
- no commit, push, PR, deploy, package publish, production write, or global file edit
conventions:
- follow fixture `AGENTS.md`; use existing failing tests as the TDD RED state; make the smallest typed implementation; ASCII only
known_pitfalls:
- preserve first-seen order instead of sorting; blank means empty after `strip`; do not modify the input list; do not edit tests
acceptance_criteria:
- [ ] trims and lowercases each retained tag
- [ ] removes blank and duplicate normalized tags while preserving first-seen order
- [ ] leaves the input list unchanged
- [ ] all 3 alpha focused tests pass
required_tests:
- `python -B -m unittest tests.test_tag_tools -v` -> expected before implementation: FAIL with 3 `NotImplementedError`; expected after implementation: PASS, 3 tests
parallel_ownership:
- worker owns only: `workspace/alpha/tag_tools.py`
- shared files/state: do not edit; beta Worker owns `workspace/beta/retry_schedule.py`; report any needed shared change to Advisor
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
5. confirm no commit, push, PR, deployment, or global file edit
