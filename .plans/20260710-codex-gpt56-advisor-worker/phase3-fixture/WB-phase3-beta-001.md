[WORKER BRIEF]
brief_id: WB-phase3-beta-001
role: implementation_worker
runtime_agent: worker with explicit gpt-5.6-terra/medium; current in-app multi-agent API rejected the newly registered custom role name before spawn
objective:
- Implement `build_retry_schedule` so all existing beta focused tests pass.
why:
- Validate a bounded Terra implementation Worker on the other side of a disjoint parallel write fixture.
known_context:
- repo root: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace
- repo state: disposable fixture `phase3-v1`; baseline copy is immutable; no Git repository or production data
- current behavior: `python -B -m unittest tests.test_retry_schedule -v` fails 4 tests with `NotImplementedError`
- architecture decision: return exponential delays `base_seconds * 2**index`; zero attempts returns an empty list; negative attempts and nonpositive base raise `ValueError`
- relevant files: `beta/retry_schedule.py` is the only writable source; `tests/test_retry_schedule.py` is the read-only specification; `AGENTS.md` contains fixture rules
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\workspace\beta\retry_schedule.py
forbidden_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase3-fixture\baseline\**
- workspace `alpha/**`, `registry/**`, `tests/**`, `AGENTS.md`, all plan documents, and unrelated existing changes
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
- read `AGENTS.md`, `beta/retry_schedule.py`, and `tests/test_retry_schedule.py` with `Get-Content` or `rg`
- from repo root run `python -B -m unittest tests.test_retry_schedule -v`
- no commit, push, PR, deploy, package publish, production write, or global file edit
conventions:
- follow fixture `AGENTS.md`; use existing failing tests as the TDD RED state; make the smallest typed implementation; ASCII only
known_pitfalls:
- validate both arguments; use integer delays; do not edit tests or the intentionally serial-only registry
acceptance_criteria:
- [ ] builds the expected exponential delay list
- [ ] supports a positive custom base
- [ ] returns an empty list for zero attempts
- [ ] raises `ValueError` for negative attempts or a nonpositive base
- [ ] all 4 beta focused tests pass
required_tests:
- `python -B -m unittest tests.test_retry_schedule -v` -> expected before implementation: FAIL with 4 `NotImplementedError`; expected after implementation: PASS, 4 tests
parallel_ownership:
- worker owns only: `workspace/beta/retry_schedule.py`
- shared files/state: do not edit; alpha Worker owns `workspace/alpha/tag_tools.py`; report any needed shared change to Advisor
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
