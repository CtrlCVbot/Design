[WORKER BRIEF]
brief_id: PLANNING-WORKER-CAPABILITY-01
role: planning_worker
objective:
- Use the three fixed evidence streams to create exactly five linked planning documents for a phased rollout decision.
known_context:
- working root: C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/fixture
- evidence is complete and authoritative for this synthetic capability fixture
- DEC-01 requires Option B, the reversible three-stage phased rollout
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
required_deliverables:
- 01-decision.md: state DEC-01 and Option B, explain the evidence-backed trade-off, and link to 02-scope.md
- 02-scope.md: define in-scope and non-goal boundaries using PROD-01, PROD-02, REQ-01, REQ-02, CON-01, and link to 03-evidence-matrix.md
- 03-evidence-matrix.md: map every evidence ID from all three sources to a document or decision and link to 04-risk-register.md
- 04-risk-register.md: cover RISK-01 and RISK-02 with the manifest and pre/post hash mitigations and link to 05-rollout.md
- 05-rollout.md: define GATE-01, GATE-02, GATE-03, rollback conditions, and link to 01-decision.md
evidence_rules:
- cite evidence IDs for every material factual claim
- label recommendations or inferences explicitly
- do not invent requirements, metrics, dates, approvals, implementation status, or external facts
allowed_commands:
- read the allowed evidence and verifier only
- use apply_patch to create the five allowed output files
- run the exact acceptance command
acceptance_command:
- powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/fixture/verify_planning.ps1" -OutputRoot "C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/fixture/output"
acceptance_criteria:
- exactly five output Markdown files
- deterministic grader status PASS with zero errors
- all material claims trace to supplied evidence IDs
- no file outside allowed_paths changes
forbidden_actions:
- source code, evidence, verifier, global config, agent config, data, lockfile, cache, generated output, or unrelated file edits
- child agent, resume, follow-up, retry, repair, commit, stage, push, PR, deploy, publish, production operation, secret access, permission escalation, external research
stop_conditions:
- missing or conflicting evidence
- required decision not fixed by DEC-01
- any write outside allowed_paths
- acceptance failure or command outside allowed_commands
report_format:
- PLANNING WORKER RESULT with brief_id, status, changed_files, evidence_ids_used, deliverables, exact acceptance result, assumptions and inferences, unresolved conflicts, scope deviation, timeout or usage-guard deviation, and prohibited-action confirmation
