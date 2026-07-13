[WORKER BRIEF]
brief_id: PLANNING-WORKER-PAIRED-EVAL
role: planning_worker
runtime_agent: direct parent or registered planning_worker, according to the fixed run mode
objective:
- Use the three evidence streams in the current working directory to create exactly five linked planning documents for the fixed phased rollout decision.
why:
- Compare direct Terra/medium execution with planning_worker delegation under the same task contract.
known_context:
- repo root: current isolated trial directory
- repo state: fresh synthetic fixture with no output directory
- current behavior: verifier fails until all five documents exist
- architecture decision: DEC-01 fixes Option B, the reversible three-stage rollout
- relevant files: evidence/*.md and verify_planning.ps1 are read-only inputs
allowed_read_paths:
- evidence/product.md
- evidence/architecture.md
- evidence/operations.md
- verify_planning.ps1
allowed_paths:
- output/01-decision.md
- output/02-scope.md
- output/03-evidence-matrix.md
- output/04-risk-register.md
- output/05-rollout.md
workspace_isolation:
- mode: disposable_fixture
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: none; creation forbidden
- generated outputs: only output/*.md
- build/test cache: none; creation forbidden
- test database: none
required_deliverables:
- 01-decision.md: DEC-01, Option B, evidence-backed trade-off, link to 02-scope.md
- 02-scope.md: PROD-01, PROD-02, REQ-01, REQ-02, CON-01, link to 03-evidence-matrix.md
- 03-evidence-matrix.md: map all 13 evidence IDs, link to 04-risk-register.md
- 04-risk-register.md: RISK-01, RISK-02, manifest and pre/post hash mitigations, link to 05-rollout.md
- 05-rollout.md: GATE-01, GATE-02, GATE-03, rollback conditions, link to 01-decision.md
allowed_commands:
- read only the allowed evidence and verifier
- use apply_patch to create the five output files
- powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./verify_planning.ps1 -OutputRoot ./output
- no commit, push, PR, deploy, package publish, or production write
conventions:
- cite evidence IDs for material factual claims
- label recommendations and inferences
- do not invent requirements, metrics, dates, approvals, status, or external facts
known_pitfalls:
- no expected output may be copied
- output must contain exactly five files
acceptance_criteria:
- [ ] grader status PASS, files 5, errors 0
- [ ] all 13 evidence IDs covered
- [ ] no write outside output/*.md
required_tests:
- exact verifier command -> expected PASS
parallel_ownership:
- executor owns only: output/*.md
- shared files/state: every other path is read-only
stop_conditions:
- evidence conflict or missing fixed decision
- out-of-scope write or command needed
- destructive command, secret, permission escalation, or production operation needed
report_format:
1. changed files and deliverables
2. evidence IDs used
3. exact grader result
4. assumptions and inferences
5. scope and prohibited-action confirmation
