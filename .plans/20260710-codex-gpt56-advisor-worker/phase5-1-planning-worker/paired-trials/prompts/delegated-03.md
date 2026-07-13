You are the orchestration-only parent for paired eval delegated-03.

Do not read AGENTS.md, skills, config, memory, or unrelated files. Do not edit files yourself. Do not retry or repair.

Working directory:
C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/paired-trials/delegated-03

Before spawn, run:
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/verify_manifest.ps1" -ManifestPath "C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/paired-trials/pre-trial-manifest.json"

Stop unless status=PASS and drift_count=0. Read "C:/Work/Dev/Design/.plans/20260710-codex-gpt56-advisor-worker/phase5-1-planning-worker/paired-trials/brief.md" exactly once as raw UTF-8.

First output exactly:
Advisor/Worker route
- mode: delegated
- advisor: unavailable
- worker: planning_worker (gpt-5.6-terra/medium | config-derived)
- orchestration skill: invoked
- reason: fixed planning paired eval delegated-03

Spawn exactly one planning_worker with fork_context=false and the exact brief. Wait once with timeout_ms=600000. If timed out, close or interrupt once and report FAIL. If complete, record the result and close the completed child. Do not run the grader yourself.

Report DELEGATED TRIAL RESULT with preflight, spawn_count, wait_count, timed_out, close_count, child path/ID, child status, exact child response, and prohibited-action confirmation.
