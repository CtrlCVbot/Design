[WORKER BRIEF]
brief_id: WB-phase4b-v2-1-transport-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium override
objective:
- Build the isolated v2.1 fixture clone plus structured spawn transport source and parse-only preflight exactly as defined in EVAL.md.
why:
- Prevent the v2 raw Windows path interpolation failure before spending another fresh CLI diagnostic run.
known_context:
- repo root: C:\Work\Dev\Design
- repo state: main is dirty with unrelated user WIP and the advisor-worker plan directory is untracked; do not stage, revert, or touch unrelated files
- current behavior: v2 PowerShell harness passes, but v2 parent spawn failed before child creation with an octal escape SyntaxError
- architecture decision: v2.1 fixture is a byte-identical clone of v2; run-source.mjs reads the forward-slash brief through exec_command and passes message read.output without embedding the brief
- relevant files: phase4b-gt04-v2-1/EVAL.md and briefs/trial-01.md are immutable contracts; phase4b-gt04-v2/fixture is the read-only byte source
- collaboration state: you are not alone in the codebase; preserve every edit outside your ownership and do not overwrite another actor's work
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-1\fixture\**
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-1\transport\**
forbidden_paths:
- phase4b-gt04-v2-1/EVAL.md
- phase4b-gt04-v2-1/briefs/**
- phase4b-gt04-v2-1/WB-phase4b-v2-1-transport-001.md
- phase4b-gt04-v2/** and all earlier evidence
- all global .codex/.agents files and unrelated user WIP
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: creation forbidden
- generated outputs: only declared fixture and transport files; temporary parser outputs are forbidden
- build/test cache: none; Node parse-only check must not install packages or write cache
- test database: none
allowed_commands:
- read EVAL.md, v2.1 routine brief, and v2 fixture
- create only fixture/** and transport/** with apply_patch or byte-preserving copy commands
- run Get-FileHash, Get-ChildItem, current PowerShell scripts, and node --check
- no actual agent spawn, commit, push, PR, deploy, package publish, production write, or global edit
conventions:
- TDD order: transport preflight RED before run-source.mjs, then GREEN; Windows PowerShell 5.1 compatible test script; ASCII source; concise comments only where needed
known_pitfalls:
- v2.1 routine brief and run-source.mjs must contain zero backslash, backtick, and interpolation sequence characters required by EVAL
- do not embed or duplicate the Worker brief in run-source.mjs
- do not add model, reasoning effort, or service tier overrides to spawn_agent
- run-source.mjs is parse-checked only during implementation and must never spawn an agent in tests
- copy v2 fixture bytes without JSON reserialization
acceptance_criteria:
- [ ] v2.1 fixture has the same 30 file paths, sizes, and SHA256 values as v2 fixture
- [ ] transport/run-source.mjs implements one structured read, one custom spawn, one notify, and one wait
- [ ] transport/test_transport.ps1 performs all six parse-only checks without spawning an agent or mutating files
- [ ] node --check transport/run-source.mjs exits 0
- [ ] transport preflight reports PASS with tests 6
- [ ] v2.1 PowerShell grader self-test passes and trial-01 remains FAIL with mismatches 4
- [ ] no file outside allowed paths changes
required_tests:
- node --check .\transport\run-source.mjs -> expected: exit 0
- & .\transport\test_transport.ps1 -> expected: status PASS, tests 6
- & .\fixture\test_verify_gt04.ps1 -> expected: status PASS, tests 5
- & .\fixture\verify_gt04.ps1 -Trial trial-01 -> expected: status FAIL, mismatches 4
parallel_ownership:
- worker owns only: phase4b-gt04-v2-1/fixture/** and phase4b-gt04-v2-1/transport/**
- shared files/state: contracts, briefs, previous evidence, global configuration, and user WIP are read-only; report needed changes to Advisor
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
5. confirm no agent spawn, commit, push, PR, deployment, or global file edit
