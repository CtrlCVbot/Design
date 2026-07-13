[WORKER BRIEF]
brief_id: GT04-trial-03-01
role: routine_worker
runtime_agent: registered custom agent routine_worker
objective:
- Normalize the four JSON records in trial-03/records exactly as defined and make the deterministic grader pass.
why:
- Measure one independent first-attempt GT-04 routine transformation trial for pass^3 reliability.
known_context:
- repo root: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\fixture
- repo state: disposable fixture GT04-json-normalization-v1; trial-03 is byte-identical to immutable baseline and currently has 4 grader mismatches
- current behavior: python -B verify_gt04.py --trial trial-03 exits 1 with mismatches 4
- architecture decision: parse each JSON object; validate id/name/tags types; add whitespace-collapsed lowercase slug; normalize tags by trim/lower/drop blank/stable dedupe; preserve other values; serialize exact sorted indented ASCII JSON with one trailing newline
- relevant files: trial-03/records/*.json are the only writable inputs; expected/records and verify_gt04.py are read-only acceptance evidence
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\fixture\trial-03\records\*.json
forbidden_paths:
- baseline/**
- expected/**
- verify_gt04.py
- trial paths other than trial-03
- EVAL definition, Worker briefs, all global .codex/.agents files, user WIP, and unrelated paths
workspace_isolation:
- mode: disposable_fixture with one exclusive trial directory
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: none; the assigned JSON records are eval inputs intentionally transformed in place
- build/test cache: use python -B; no cache writes
- test database: none
allowed_commands:
- read only assigned records, expected records, and verify_gt04.py
- use a Python standard-library inline command or direct file edits to apply the exact output rule only to assigned records
- from fixture root run python -B verify_gt04.py --trial trial-03
- no commit, push, PR, deploy, package publish, production write, global edit, or command outside fixture root
conventions:
- deterministic mechanical transformation only; Python standard library; preserve exact JSON formatting contract; do not interpret or optimize the rule
known_pitfalls:
- preserve original name bytes semantically, including whitespace and case
- slug collapses every whitespace run to one hyphen after trim/lower
- tags use stable first-seen dedupe after trim/lower and drop blank values
- do not copy expected files over trial inputs; apply the stated transformation
acceptance_criteria:
- [ ] exactly four assigned JSON files remain
- [ ] each assigned file parses and follows the output rule
- [ ] verifier exits 0 with mismatches 0
- [ ] exception_count is 0
- [ ] no file outside assigned records changes
required_tests:
- python -B verify_gt04.py --trial trial-03 -> expected: PASS, mismatches 0
parallel_ownership:
- worker owns only: fixture/trial-03/records/*.json
- shared files/state: trial-02 and trial-01 are owned by other routine Workers; baseline, expected, verifier, and all global state are read-only
stop_conditions:
- any record violates required id/name/tags types
- output rule requires judgment or has an unlisted exception
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, remote write, or production operation is needed
- existing user change conflicts
output_rule:
- apply the seven mechanical rules in EVAL.md exactly to all four assigned records
acceptance_check:
- python -B verify_gt04.py --trial trial-03 returns exit 0 and JSON status PASS with mismatches 0
stop_if:
- any exception, ambiguity, missing input, conflicting instruction, judgment, or out-of-scope path is encountered
report_format:
- ROUTINE WORKER RESULT with brief_id, status, changed_files, output_rule_applied, exception_count, acceptance_check, exact check result, assumptions, unresolved or blocking exceptions, scope deviation, shared-write-state deviation, and prohibited-action confirmation
