[WORKER BRIEF]
brief_id: WB-phase4b-v2-2-live-shell-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium override
objective:
- Build the v2.2 fixture clone, no-agent live capability probe source, shell-based diagnostic source, and deterministic local transport tests defined by EVAL.md.
why:
- Replace the unavailable fresh CLI tools.exec_command assumption with the observed tools.shell_command surface before another custom Worker attempt.
known_context:
- repo root: C:\Work\Dev\Design
- repo state: main is dirty with unrelated WIP and the advisor-worker plan directory is untracked; do not stage, revert, or touch unrelated files
- current behavior: v2.1 local/mock preflight passed but fresh CLI source failed because tools.exec_command was not a function; parent successfully used tools.shell_command
- architecture decision: shell_command emits one-line JSON containing exact brief text and SHA256; probe decodes without spawning; diagnostic uses the same decoder then spawns one routine_worker
- relevant files: phase4b-gt04-v2-2/EVAL.md and briefs/trial-01.md are immutable; phase4b-gt04-v2-1/fixture is the read-only byte source
- collaboration state: you are not alone in the codebase; preserve every edit outside ownership and do not overwrite another actor's work
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-2\fixture\**
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-2\transport\**
forbidden_paths:
- phase4b-gt04-v2-2/EVAL.md
- phase4b-gt04-v2-2/briefs/**
- phase4b-gt04-v2-2/WB-phase4b-v2-2-live-shell-001.md
- all previous phase4b fixture/evidence paths
- all global .codex/.agents files and unrelated user WIP
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: creation forbidden
- generated outputs: only declared fixture and transport files; test temp files are forbidden
- build/test cache: none; Node checks must not install packages or write cache
- test database: none
allowed_commands:
- read EVAL.md, v2.2 routine brief, v2.1 fixture, and current tool schema evidence in the v2.1 report
- create only fixture/** and transport/** with apply_patch or byte-preserving copy commands
- run Get-FileHash, Get-ChildItem, current PowerShell scripts, node --check, and mocked Node source execution without real tools
- no fresh CLI, actual agent spawn, commit, push, PR, deploy, package publish, production write, or global edit
conventions:
- TDD order: local transport test RED before probe/run sources, then GREEN; Windows PowerShell 5.1 compatible test script; ASCII source; concise comments only where needed
known_pitfalls:
- tools.shell_command returns a wrapper string, not an exec_command result object
- decoder must locate a standalone Output line and JSON.parse only the following payload
- PowerShell must JSON-encode exact brief text and SHA256; do not pass wrapper text to the Worker
- probe source must contain zero spawn or wait calls
- diagnostic source must use full multi_agent tool names, child.agent_id, targets array, timeout, global notify and text
- copy fixture bytes without JSON reserialization
acceptance_criteria:
- [ ] v2.2 fixture has the same 30 paths, sizes, and SHA256 values as v2.1 fixture
- [ ] probe-source.mjs validates live tools and exact brief decode without spawn/wait code
- [ ] run-source.mjs decodes the same brief then defines one custom spawn, notify, wait, and text
- [ ] both sources parse with node --check and contain no raw brief, backslash, backtick, or interpolation sequence
- [ ] test_transport.ps1 covers static contracts and mocked wrapper decode for probe and run sources without actual agent calls
- [ ] local transport tests PASS, fixture tests PASS, and trial-01 remains FAIL with mismatches 4
- [ ] no file outside allowed paths changes
required_tests:
- node --check .\transport\probe-source.mjs -> expected: exit 0
- node --check .\transport\run-source.mjs -> expected: exit 0
- & .\transport\test_transport.ps1 -> expected: PASS
- & .\fixture\test_verify_gt04.ps1 -> expected: status PASS, tests 5
- & .\fixture\verify_gt04.ps1 -Trial trial-01 -> expected: status FAIL, mismatches 4
parallel_ownership:
- worker owns only: phase4b-gt04-v2-2/fixture/** and phase4b-gt04-v2-2/transport/**
- shared files/state: contracts, briefs, prior evidence, global configuration, and user WIP are read-only; report needed changes to Advisor
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
5. confirm no fresh CLI, agent spawn, commit, push, PR, deployment, or global file edit
