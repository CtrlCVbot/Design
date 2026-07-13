# 13. Phase 4-B GT-04 v2 PowerShell Diagnostic 결과

> 실행일: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v2-powershell`<br>
> Combination: `GT04-V2-LUNA-CUSTOM-DIAGNOSTIC`<br>
> 판정: **FAIL, child spawn 이전 종료**

## 1. 결론

PowerShell-native grader 구현과 Advisor 검증은 PASS했다. 그러나 fresh CLI parent가 Worker brief의 Windows absolute path를 JavaScript template string에 raw text로 넣으면서 `\2026`을 octal escape로 해석했고, custom `routine_worker`를 만들기 전에 spawn이 실패했다.

| 구분 | 결과 | 판정 |
|---|---:|---|
| PowerShell grader self-test | 5/5 | PASS |
| fixture byte 관계 | 28/28 JSON | PASS |
| child spawn | 0/1 | FAIL |
| strict diagnostic | 0/1 | FAIL |
| trial-01 byte output | 4 mismatch 유지 | 미실행 |
| retry / repair | 0 / 0 | first-attempt 보존 |
| remaining trials | 0/2 | gate에 따라 미실행 |
| plan·fixture file drift | 0 | PASS |
| global hash drift | 1 | FAIL |

CLI process exit code는 0이지만 이는 parent turn이 정상 종료됐다는 의미일 뿐이다. Eval task는 child가 생성되지 않았으므로 FAIL이다.

## 2. v2 Harness

- Eval definition: [EVAL.md](./phase4b-gt04-v2/EVAL.md)
- Fixture brief: [WB-phase4b-v2-fixture-001.md](./phase4b-gt04-v2/WB-phase4b-v2-fixture-001.md)
- Diagnostic brief: [trial-01.md](./phase4b-gt04-v2/briefs/trial-01.md)
- Grader: [verify_gt04.ps1](./phase4b-gt04-v2/fixture/verify_gt04.ps1)
- Grader tests: [test_verify_gt04.ps1](./phase4b-gt04-v2/fixture/test_verify_gt04.ps1)
- Structured result: [run-result.json](./phase4b-gt04-v2/run-result.json)

Terra/medium implementation Worker `019f49cf-2568-7501-ad61-1f8a594039f6`가 별도 fixture 경로에 28 JSON과 PowerShell script 2개를 만들었다. Advisor는 Worker 보고와 별개로 다음을 다시 확인했다.

| 검증 | 결과 |
|---|---|
| `verifier-pass` | PASS, mismatches 0 |
| `verifier-fail` | FAIL, mismatches 4 |
| initial trial-01/02/03 | 각각 FAIL, mismatches 4 |
| path traversal·unknown trial | rejected |
| missing+extra branch | mismatches 5, 정확한 file list |
| test 전후 file count·SHA256 | 변화 0 |
| Python/nested PowerShell process reference | 0 |
| v1 baseline·expected byte 관계 | PASS |

따라서 v1의 Python launch failure를 제거하기 위한 PowerShell harness 자체는 준비됐다. 이번 실행은 harness를 실제 routine Worker acceptance에서 시험하는 단계까지 도달하지 못했다.

## 3. 실행 결과

Parent runtime:

| 항목 | 값 |
|---|---|
| thread | `019f49d4-748c-7680-8480-69965ed49912` |
| model / effort | `gpt-5.6-luna` / `low` |
| sandbox / approval | `workspace-write` / `never` |
| CLI | `0.144.0-alpha.4` |
| spawn attempt | 1 |
| actual child count | 0 |
| retry | 0 |

확인된 실패:

```text
SyntaxError: Octal escape sequences are not allowed in template strings.
```

Parent는 brief를 읽은 뒤 `spawn_agent` JavaScript input에 raw Windows path를 포함한 template literal을 작성했다. `C:\Work\...\20260710...`의 `\2026`이 허용되지 않는 octal escape로 파싱돼 tool call이 실행되기 전에 실패했다.

Parent 최종 보고에는 `worker_count = 1`이라고 적혔지만 child thread ID와 nickname은 없었다. Advisor가 session metadata를 재검색한 결과 parent를 `parent_thread_id`로 가진 child rollout은 0개였으므로 실제 값은 0으로 정정했다.

## 4. Scope와 전역 Drift

Pre-run manifest SHA256: `A7F6B8FCA00250DD7BA3AC61C254A2AEBAC160EF59837902FF8FA4A314098A6F`

| 검사 | 결과 |
|---|---:|
| v2 file changed / added / deleted | 0 / 0 / 0 |
| trial-01 post-run mismatch | 4 |
| sandbox marker directory | 0 |
| child rollout | 0 |
| global hash drift | 1 |

`C:\Users\beck\.codex\config.toml`은 실행 전 `7A2B...4278`, 실행 직후 `1A4C...35A`로 hash가 달라졌다. file size는 10,363 bytes로 같고 수정 시각은 parent 종료 직후인 `2026-07-10T11:22:21+09:00`이다.

이 파일을 parent나 child가 편집했다는 tool evidence는 없으며 child 자체가 생성되지 않았다. 따라서 writer를 runtime 또는 사용자로 단정하지 않고 attribution을 `unproven`으로 남겼다. 사용자/런타임 변경일 가능성이 있어 원복하지 않았다.

현재 semantic check 결과는 다음과 같다.

- `model = gpt-5.6-sol`, effort `xhigh`, service tier `priority` 유지
- `[agents] max_threads = 4`, `max_depth = 1` 유지
- `implementation_worker`, `routine_worker` route PASS
- agentic health-check PASS, 기존 hook trust stale 15 warning 유지

정확한 전역 무변경 gate는 hash drift 때문에 FAIL이다.

## 5. Usage

| Thread | Input | Cached input | Output | Reasoning | Total |
|---|---:|---:|---:|---:|---:|
| Parent only | 169,093 | 135,936 | 2,573 | 861 | 171,666 |

- Cached input ratio: 80.39%
- Wall time: 52.006 seconds
- Child usage: 없음
- `credits_source = unavailable`
- `total_credits = null`

Worker가 생성되지 않은 spawn 실패에도 171,666 tokens가 사용됐다. 같은 raw brief transport의 즉시 재시도는 하지 않았다.

## 6. Risk-based Self-review

| 리스크 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| Raw Windows path의 JavaScript template literal 전달 | 3 | 2 | 1 | 6 | high | v2 결과 보존, forward-slash/structured transport를 v2.1 preflight로 분리 |
| 실행 창에서 발생한 `config.toml` hash drift | 2 | 3 | 2 | 7 | high | 원복 금지, semantic health 기록, 다음 실행 전 source 확인 |
| Parent 보고의 `worker_count = 1`과 실제 child 0 불일치 | 2 | 1 | 1 | 4 | medium | rollout metadata 기준 0으로 정정 |
| Child 0 상태에서 171,666 tokens 사용 | 2 | 2 | 1 | 5 | high | transport-only local preflight를 다음 gate에 추가 |

확인된 critical 리스크는 없다. Phase 5와 remaining two-trial 실행은 승인하지 않는다.

## 7. 다음 Gate

다음 실험은 기존 v2 파일을 수정하지 않는 `GT-04 v2.1 brief-transport diagnostic`으로 분리한다.

1. Worker brief의 Windows path를 forward-slash absolute path로 고정한다.
2. raw multiline brief를 JavaScript template literal에 직접 보간하지 않는 structured transport를 사용한다.
3. spawn 전에 동일 brief를 대상으로 JavaScript parse-only preflight를 실행한다.
4. custom `routine_worker` 한 개만 다시 diagnostic으로 실행한다.
5. child 생성, Luna/medium route, exception 0, PowerShell acceptance PASS, scope 0, global hash drift 0을 모두 확인한 뒤에만 나머지 두 trial을 연다.

Phase 4-B는 **진행 중·transport remediation 필요** 상태다.
