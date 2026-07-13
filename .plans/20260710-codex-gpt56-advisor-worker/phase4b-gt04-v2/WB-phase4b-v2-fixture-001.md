[WORKER BRIEF]
brief_id: WB-phase4b-v2-fixture-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium override
objective:
- Build the isolated GT-04 v2 fixture and a deterministic PowerShell-native byte grader with executable self-tests exactly as defined in EVAL.md.
why:
- Remove the Python child-process dependency that blocked v1 while preserving the same transformation task and expected bytes.
known_context:
- repo root: C:\Work\Dev\Design
- repo state: main is dirty with unrelated user WIP; the entire advisor-worker plan directory is untracked; do not touch or stage unrelated files
- collaboration state: you are not alone in the codebase; preserve all edits outside your ownership and do not revert or overwrite another actor's work
- current behavior: v1 custom Luna children loaded correctly but all reported a python.exe logon-session launch exception; v1 strict result is 0/3
- architecture decision: v2 changes only the grader runtime to in-process Windows PowerShell 5.1; the grader compares exact file sets and bytes and does not implement normalization
- relevant files: phase4b-gt04-v2/EVAL.md is the immutable contract; phase4b-gt04/fixture/baseline and expected are read-only byte sources; v1 EVAL and run-result hashes are fixed evidence
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\fixture\**
forbidden_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\EVAL.md
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\WB-phase4b-v2-fixture-001.md
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\**
- all files outside phase4b-gt04-v2/fixture, including global .codex/.agents files and unrelated user WIP
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: creation forbidden
- generated outputs: only the declared fixture files; temporary test output must be outside the fixture and removed
- build/test cache: none; cache creation forbidden
- test database: none
allowed_commands:
- read EVAL.md and the v1 baseline/expected records
- create only the declared v2 fixture layout with apply_patch or byte-preserving copy commands
- run Get-FileHash, Get-ChildItem, the PowerShell grader, and its self-test from the v2 fixture root
- no commit, push, PR, deploy, package publish, or production write
conventions:
- follow EVAL.md exactly; TDD order is self-test RED before grader implementation, then GREEN; ASCII source text unless JSON evidence already contains Unicode; concise comments only for non-obvious byte comparison
known_pitfalls:
- preserve v1 JSON bytes when copying; do not regenerate baseline or expected through JSON serialization
- Windows PowerShell 5.1 compatibility is required; do not use PowerShell 7-only syntax
- the grader must not launch python.exe, powershell.exe, pwsh.exe, or another child process
- do not let the grader normalize data or copy expected output into a trial
- subagent runtime may expose empty .git/.agents marker directories; do not create or populate them
acceptance_criteria:
- [ ] fixture layout exactly matches EVAL.md with 28 JSON files and 2 PowerShell scripts
- [ ] baseline, expected, three trials, verifier-pass, and verifier-fail have the required byte relationships to v1
- [ ] verify_gt04.ps1 emits the required deterministic compressed JSON schema without writing files
- [ ] test_verify_gt04.ps1 covers pass, fail, initial trial fail, rejected traversal/unknown trial, and no-mutation checks
- [ ] initial trial-01 remains baseline-identical and grades FAIL with mismatches 4
- [ ] no cache, lockfile, populated .git/.agents directory, or file outside the fixture root is created
required_tests:
- & .\test_verify_gt04.ps1 -> expected: PASS, tests 5
- $r = & .\verify_gt04.ps1 -Trial verifier-pass | ConvertFrom-Json; assert status PASS and mismatches 0 -> expected: PASS
- $r = & .\verify_gt04.ps1 -Trial verifier-fail | ConvertFrom-Json; assert status FAIL and mismatches 4 -> expected: PASS
- $r = & .\verify_gt04.ps1 -Trial trial-01 | ConvertFrom-Json; assert status FAIL and mismatches 4 -> expected: PASS
parallel_ownership:
- worker owns only: phase4b-gt04-v2/fixture/**
- shared files/state: EVAL, Worker brief, v1 evidence, global configuration, and user WIP are read-only; do not edit and report any needed change to Advisor
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
