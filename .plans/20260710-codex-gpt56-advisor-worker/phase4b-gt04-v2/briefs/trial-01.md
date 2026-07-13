[WORKER BRIEF]
brief_id: GT04-v2-trial-01-diagnostic
role: routine_worker
runtime_agent: registered custom agent routine_worker
objective:
- Normalize the four JSON records in trial-01/records exactly as defined and make the PowerShell-native byte grader pass on the first attempt.
why:
- Determine whether replacing the blocked Python acceptance runtime with an in-process PowerShell grader removes the v1 operational failure without changing the task.
known_context:
- repo root: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\fixture
- repo state: disposable fixture GT04-json-normalization-v2-powershell; trial-01 is byte-identical to the immutable v1 baseline and currently grades FAIL with 4 byte mismatches
- current behavior: verify_gt04.ps1 reports trial-01 status FAIL, mismatches 4; test_verify_gt04.ps1 reports status PASS, tests 5
- architecture decision: apply the seven fixed mechanical rules to assigned JSON only; acceptance stays in the current Windows PowerShell process and compares exact expected bytes
- relevant files: trial-01/records/*.json are the only writable inputs; EVAL.md, expected/records, verify_gt04.ps1, and test_verify_gt04.ps1 are read-only evidence
- collaboration state: you are not alone; preserve trial-02, trial-03, fixture evidence, global state, and unrelated user edits
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2\fixture\trial-01\records\*.json
forbidden_paths:
- baseline/**
- expected/**
- verifier-pass/**
- verifier-fail/**
- verify_gt04.ps1
- test_verify_gt04.ps1
- trial-02/** and trial-03/**
- EVAL, briefs, manifests, v1 evidence, all global .codex/.agents files, and unrelated user WIP
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: none; assigned JSON records are transformed in place
- build/test cache: none; creation forbidden
- test database: none
allowed_commands:
- read assigned records and read-only EVAL/grader/expected evidence with current PowerShell commands
- use apply_patch to edit only the four assigned JSON records
- in the current shell run Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force and the exact acceptance check below
- no python.exe, powershell.exe, pwsh.exe, Start-Process, nested shell, commit, push, PR, deploy, publish, production write, global edit, or child agent
conventions:
- deterministic mechanical transformation only; preserve semantic name/id values; output key order is id, name, slug, tags because keys are alphabetically sorted; use indent 2, ASCII JSON, and one trailing LF
known_pitfalls:
- preserve name exactly, including whitespace and case
- slug trims name, collapses every whitespace run to one hyphen, then lowercases
- tags trim/lowercase, drop blank, and stable-dedupe after normalization
- do not copy expected or baseline files over trial input
- process-scoped ExecutionPolicy Bypass is allowed only for this acceptance command and must not alter user/global policy
acceptance_criteria:
- [ ] exactly four assigned JSON files remain
- [ ] each assigned file parses and follows all seven output rules
- [ ] exact PowerShell acceptance check reports PASS with mismatches 0 and shell exit 0
- [ ] exception_count is 0
- [ ] no file outside assigned records changes
- [ ] no forbidden external process or prohibited action is used
required_tests:
- exact acceptance_check below -> expected: exit 0, status PASS, mismatches 0
parallel_ownership:
- worker owns only: fixture/trial-01/records/*.json
- shared files/state: all other fixture paths and global/project state are read-only; report a required change instead of editing
stop_conditions:
- any record violates required id/name/tags types
- acceptance criteria requires an architecture or formatting decision not fixed here
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, remote write, or production operation is needed
- existing user change conflicts
output_rule:
- parse each assigned file as one JSON object
- require id and name strings and a tags string array; otherwise stop with one exception
- set slug to trim(name), collapse each whitespace run to one hyphen, and lowercase
- normalize each tag by trim and lowercase, drop blank tags, then stable-dedupe in first-seen order
- preserve all other semantic values
- serialize keys alphabetically with indent 2, ASCII JSON, and exactly one trailing LF
- apply the rule to all four assigned files without copying expected files
acceptance_check:
- Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; $result = & .\verify_gt04.ps1 -Trial trial-01 | ConvertFrom-Json; $result | ConvertTo-Json -Compress -Depth 4; if ($result.status -ne 'PASS' -or [int]$result.mismatches -ne 0) { exit 1 }
stop_if:
- any exception, ambiguity, missing input, conflicting instruction, judgment call, out-of-scope path, nested-process need, or acceptance failure is encountered
report_format:
- ROUTINE WORKER RESULT with brief_id, status, changed_files, output_rule_applied, exception_count, acceptance_check, exact check result, assumptions, unresolved or blocking exceptions, scope deviation, shared-write-state deviation, and prohibited-action confirmation
