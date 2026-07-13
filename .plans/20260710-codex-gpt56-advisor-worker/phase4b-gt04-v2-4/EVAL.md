# GT-04 v2.4 ExecutionPolicy-safe Eval

> Defined: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v2-4-execution-policy-safe`<br>
> Source and fixture are copied from v2.3; v2.3 remains immutable.

## 목적

v2.3의 only failure was parent preflight invoking a PowerShell script without process-scoped execution-policy bypass. v2.4 changes only the parent preflight command and preserves the app-local bundle, source, Worker brief, model, effort, fixture, and no-agent/diagnostic gates.

## Fixed Baseline

- v2.3 `EVAL.md`: `CF0CA53B6330CB36BB44B79A2ECF29312AA35B3F68090EE9482B9A9E5B829E6B`
- v2.3 `probe-result.json`: `8D35053E74D50E730E6329A7EC4D3FA200FEFA4BE6B0780AD0C5EB0BC99376B5`
- app-local bundle: `C:/Users/beck/AppData/Local/OpenAI/Codex/bin/a7c12ebff69fb123`
- parent model/effort: `gpt-5.6-luna/low`
- Worker model/effort if diagnostic runs: `gpt-5.6-luna/medium`
- sandbox/approval: `workspace-write/never`

## Required Preflight

The parent must execute exactly this command through its command-execution tool:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-4\transport\test_bundle.ps1"
```

Expected: exit 0 and `{"status":"PASS","files":4,"version":"codex-cli 0.144.0-alpha.4"}`.

No user or global execution policy may be changed.

## Probe Gate

Fresh CLI parent reads `transport/probe-source.mjs` once and submits that exact text as one `functions.exec` source. It must not read skills or unrelated global files, reconstruct source, retry, spawn, wait, edit, or run diagnostic.

Probe PASS requires source execution, required tool functions, shell brief hash, child count 0, and global/fixture drift 0.

## Diagnostic Gate

Probe PASS permits one separate fresh parent to read and submit `transport/run-source.mjs`. It must spawn exactly one `routine_worker`, notify identity, and wait once. Retry, repair, second child, direct implementation, and global edits are forbidden.

Strict PASS requires child role `routine_worker`, model/effort `gpt-5.6-luna/medium`, first-attempt grader PASS with mismatches 0, exactly four trial-01 record changes, and no global or scope drift.

If probe FAILs, diagnostic is not executed and v2.4 is recorded as first-attempt FAIL.
