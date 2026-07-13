[WORKER BRIEF]
brief_id: WB-phase4b-fixture-001
role: implementation_worker
runtime_agent: built-in worker with explicit gpt-5.6-terra/medium
objective:
- Implement the immutable baseline, exact expected outputs, three isolated trial copies, and deterministic code grader defined by `EVAL.md`.
why:
- GT-04 must be graded from a fixed fixture defined before custom Luna Workers run.
known_context:
- repo root: C:\Work\Dev\Design
- repo state: dirty user worktree; all implementation ownership is restricted to the new untracked Phase 4-B fixture directory
- current behavior: `EVAL.md` exists; `fixture` directory is absent
- architecture decision: Python standard library only; four exact JSON input files; expected bytes are prebuilt; verifier compares file names and bytes rather than recomputing the Worker rule
- relevant files: `phase4b-gt04/EVAL.md` is the read-only source of truth; `phase4b-gt04/fixture` is the only writable root
allowed_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\fixture\**
forbidden_paths:
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\EVAL.md
- C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04\WB-phase4b-fixture-001.md
- all other `.plans`, source, config, global `.codex`, global `.agents`, user WIP, and unrelated paths
workspace_isolation:
- mode: disposable_fixture inside the Phase 4-B planning artifact
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: fixture files are owned by this Worker until handoff; no other generated output
- build/test cache: use `python -B`; no `__pycache__`
- test database: none
allowed_commands:
- read `EVAL.md`
- create and read files only under the allowed fixture root
- run `python -B fixture/verify_gt04.py --trial <trial-id>` and `python -B fixture/verify_gt04.py --all` from `phase4b-gt04`
- no commit, push, PR, deploy, package publish, production write, or global edit
conventions:
- Eval-Driven Development: preserve the pre-defined task and grader contract; Python standard library only; ASCII code and JSON
- verifier CLI uses `argparse`, returns 0 only on PASS, returns 1 on mismatch, and prints one compact JSON object
known_pitfalls:
- baseline and all three trial input directories must be byte-identical
- expected output must preserve original `name` exactly while adding slug and normalizing tags
- verifier must compare exact bytes and exact file set, not call a shared normalization helper
- do not pre-transform trial records
acceptance_criteria:
- [ ] baseline contains exactly four input JSON files matching `EVAL.md`
- [ ] expected contains exactly four independently materialized normalized JSON files
- [ ] trial-01, trial-02, trial-03 records are byte-identical copies of baseline
- [ ] verifier supports each trial and `--all`, prints deterministic JSON, and detects missing, extra, or byte-mismatched files
- [ ] before Luna execution, each trial fails with 4 mismatches and `--all` exits 1
- [ ] no cache, lockfile, nested Git, or file outside the fixture root is created
required_tests:
- compare SHA256 sets for baseline and each trial -> expected: identical
- `python -B fixture/verify_gt04.py --trial trial-01` -> expected: exit 1, 4 mismatches
- `python -B fixture/verify_gt04.py --all` -> expected: exit 1, all 3 trials fail with 12 total mismatches
- AST parse `fixture/verify_gt04.py` -> expected: PASS
parallel_ownership:
- worker owns only: `phase4b-gt04/fixture/**`
- shared files/state: none; custom routine Workers are not started until Advisor approves this fixture
stop_conditions:
- EVAL definition is ambiguous or inconsistent
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, remote write, or production operation is needed
- existing user change conflicts
report_format:
1. changed files and why
2. exact RED grader and SHA256 results
3. assumptions made
4. unresolved risks or blocked items
5. confirm no commit, push, PR, deployment, global edit, or outside-scope edit
