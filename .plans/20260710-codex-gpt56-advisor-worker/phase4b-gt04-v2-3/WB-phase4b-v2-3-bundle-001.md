[WORKER BRIEF]
brief_id: WB-phase4b-v2-3-bundle-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium override because the current multi-agent surface does not expose the registered custom type
objective:
- Build the isolated GT-04 v2.3 fixture, app-local bundle preflight, transport sources/tests, parent prompts, and route-observability candidate/test so Advisor can run one strict fresh-CLI probe and conditional diagnostic.
why:
- Remove the v2.2 incomplete-runtime ambiguity and make direct/delegated model routing visible before future work without broadening docs-only delegation.
known_context:
- repo root: C:/Work/Dev/Design
- repo state: main branch with unrelated user WIP; the entire .plans/20260710-codex-gpt56-advisor-worker package is untracked and must remain isolated
- current behavior: v2.2 local transport passes but fresh CLI probe fails because .sandbox-bin lacks codex-code-mode-host.exe; app-local bundle version 0.144.0-alpha.4 contains all four sibling executables; a pre-implementation custom implementation_worker spawn was rejected before child creation because that agent_type is not exposed
- architecture decision: copy v2.2 fixture bytes exactly, adapt only v2.3 paths/hashes, preflight the fixed app-local bundle, and produce policy candidate fragments instead of editing global files
- relevant files: phase4b-gt04-v2-2 is immutable source evidence; v2.3 EVAL.md, POLICY-CONTRACT.md, routine brief, this brief, and pre-implementation manifest are Advisor-owned
allowed_paths:
- C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-3/fixture/**
- C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-3/transport/**
- C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-3/policy-candidate/**
- C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-3/probe-parent-prompt.md
- C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase4b-gt04-v2-3/diagnostic-parent-prompt.md
forbidden_paths:
- C:/Users/beck/.codex/** and C:/Users/beck/.agents/**
- phase4b-gt04-v2-2/** and all previous evidence
- phase4b-gt04-v2-3/EVAL.md
- phase4b-gt04-v2-3/POLICY-CONTRACT.md
- phase4b-gt04-v2-3/briefs/**
- phase4b-gt04-v2-3/WB-phase4b-v2-3-bundle-001.md
- phase4b-gt04-v2-3/pre-implementation-manifest.json
- unrelated Design repo files and user WIP
workspace_isolation:
- mode: existing_single_worker
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: Worker owns only allowed v2.3 paths
- build/test cache: none; serial-only if a tool creates temporary output
- test database: none
allowed_commands:
- read v2.2 evidence, global policy files, app-local bundle metadata, and this v2.3 contract
- use apply_patch for all file creation and edits under allowed_paths
- run node --check and PowerShell tests under v2.3
- no fresh CLI probe, child spawn, commit, push, PR, deploy, publish, production write, global edit, package install, or network call
conventions:
- preserve v2.2 fixture bytes and PowerShell grader behavior exactly
- source code must contain no raw Worker brief, backslash, JavaScript backtick, or interpolation sequence
- use tools.shell_command plus the actual multi_agent_v1 custom spawn/wait names fixed in EVAL
- policy candidates are minimal fragments, not full global-file rewrites
known_pitfalls:
- WindowsApps executables are access denied; .sandbox-bin lacks the code-mode host; use only the fixed app-local path in preflight and prompts
- PowerShell single-quoted paths do not need doubled backslashes
- local mocks must not invent tools absent from the observed live surface
- parent prompt must not ask the model to reconstruct or optimize parse-checked source
acceptance_criteria:
- [ ] v2.3 fixture has 30 files byte-identical to v2.2 fixture
- [ ] runtime preflight verifies all four app-local sibling files, hashes, sizes, and codex version
- [ ] probe and diagnostic source parse with node --check
- [ ] transport tests cover wrapper decode, required live tool names, no-agent prohibition, and exact brief hash
- [ ] route observability static test passes against candidate fragments
- [ ] grader self-test passes and initial trial-01 remains FAIL with mismatches 4
- [ ] no forbidden path changes and no global file edit occurs
required_tests:
- powershell -NoProfile -ExecutionPolicy Bypass -File transport/test_bundle.ps1 -> expected: PASS
- powershell -NoProfile -ExecutionPolicy Bypass -File transport/test_transport.ps1 -> expected: PASS
- powershell -NoProfile -ExecutionPolicy Bypass -File policy-candidate/test_route_observability.ps1 -AgentsPath policy-candidate/AGENTS-section.md -SkillPath policy-candidate/SKILL-routing.md -> expected: PASS
- powershell -NoProfile -ExecutionPolicy Bypass -File fixture/test_verify_gt04.ps1 -> expected: PASS, tests 5
- powershell -NoProfile -ExecutionPolicy Bypass -File fixture/verify_gt04.ps1 -Trial trial-01 -> expected: status FAIL, mismatches 4
parallel_ownership:
- worker owns only: allowed v2.3 fixture, transport, policy-candidate, and parent prompt paths
- shared files/state: Advisor-owned contracts and every global/previous path are read-only; report needed changes instead of editing
stop_conditions:
- fixed bundle path or any required hash differs
- acceptance requires changing EVAL, brief, global files, v2.2, or an architecture decision
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, remote write, or production operation is needed
- existing user change conflicts
report_format:
1. WORKER RESULT with brief_id, agent_thread_id, model, model_reasoning_effort, and status
2. changed files and why
3. acceptance criteria pass/fail
4. tests run and exact result
5. assumptions and unresolved risks
6. scope/shared-state deviations
7. confirm no commit, push, PR, deployment, fresh CLI run, child spawn, or global file edit
