# 17. Route Observability 적용과 GT-04 v2.3 결과

> 실행일: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v2-3-app-local-bundle`<br>
> 판정: **route observability PASS, v2.3 probe FAIL, diagnostic 미실행**

## 1. 결론

두 제안을 분리 적용했다.

| 제안 | 결과 | 판정 |
|---|---|---|
| 작업 시작 시 route/model 공개 | global 적용 및 fresh parent 실증 | PASS |
| app-local CLI bundle 기반 v2.3 | CLI와 code-mode host 시작 성공 | PASS |
| bundle preflight | ExecutionPolicy 차단 | FAIL |
| no-agent probe source | 미실행 | stop rule 준수 |
| Luna diagnostic | 미실행 | stop rule 준수 |

v2.2의 missing code-mode host 문제는 해소됐다. v2.3은 app-local CLI에서 fresh parent를 정상 시작했지만 parent prompt가 PowerShell preflight에 process-scoped `ExecutionPolicy Bypass`를 지정하지 않아 source 실행 전 중단됐다.

## 2. 전역 Route 공개 적용

적용 파일:

- global AGENTS.md: `C:/Users/beck/.codex/AGENTS.md`
- advisor-worker-orchestration SKILL.md: `C:/Users/beck/.agents/skills/advisor-worker-orchestration/SKILL.md`
- [정적 계약 테스트](./phase4b-gt04-v2-3/policy-candidate/test_route_observability.ps1)

모든 비단순 산출물 시작 시 다음 값을 공개한다.

```text
Advisor/Worker route
- mode: direct | delegated
- advisor: <model>/<effort> | unavailable
- worker: none | <role> (<model>/<effort> | config-derived)
- orchestration skill: invoked | not-invoked
- reason: <matched trigger or exclusion>
```

Direct docs-only와 review-only는 `direct / none / not-invoked`를 표시한다. 알 수 없는 model/effort는 추측하지 않고 `unavailable`을 사용한다. Delegated route는 시작 시 설정값을 공개하고 closeout에서 실제 rollout evidence로 정정한다.

Fresh v2.3 parent의 첫 메시지에서 실제 block이 출력됐다.

| 필드 | 출력 |
|---|---|
| mode | `direct` |
| advisor | `unavailable` |
| worker | `none` |
| orchestration skill | `invoked` |
| reason | orchestration-only probe와 preflight gate |

Parent self-report의 advisor 값은 unavailable이었지만 rollout `turn_context`는 `gpt-5.6-luna/low`를 확인했다. 공개 규칙이 추측을 피하고 closeout evidence가 실제 값을 보정하는 계약대로 동작했다.

## 3. Worker 구현과 검증

구현 brief: [WB-phase4b-v2-3-bundle-001.md](./phase4b-gt04-v2-3/WB-phase4b-v2-3-bundle-001.md)

등록 custom `implementation_worker` type은 현재 main multi-agent surface에 노출되지 않아 child 생성 전에 거부됐다. Skill fallback에 따라 built-in `worker`를 `gpt-5.6-terra/medium`으로 명시해 한 개만 실행했다.

| 구분 | 실제 model/effort |
|---|---|
| 최초 구현 turn | `gpt-5.6-terra/medium` |
| 같은 thread의 repair resume | `gpt-5.6-sol/xhigh` |

같은 thread를 resume해도 model/effort가 유지되지 않았다. 이를 발견한 뒤 orchestration skill에 “모든 spawn과 resume 후 실제 model/effort를 다시 기록하고 보존을 가정하지 말 것”을 추가했다.

Advisor 독립 검증:

| 검증 | 결과 |
|---|---|
| app-local bundle 4 files/hash/version | PASS |
| transport tests | PASS, 6/6 |
| policy candidate test | PASS, 2/2 |
| global policy contract test | PASS, 2/2 |
| `node --check` | PASS, source 2개 |
| fixture grader self-test | PASS, 5/5 |
| v2.2 fixture parity | PASS, 30 files |
| initial trial-01 | expected FAIL, mismatches 4 |
| forbidden/global edit by Worker | 0 |

Worker의 영어 candidate와 영어 문장에 과결합된 test는 Advisor가 승인하지 않고 R1 repair로 한국어 정책과 UTF-8 marker test로 수정했다.

## 4. Global Health

| 항목 | Before | Final |
|---|---|---|
| AGENTS.md | pass, 103 lines | pass, 116 lines |
| custom agents | pass | pass |
| skills | pass, 0 long | pass, 0 long |
| stale references | 0 | 0 |
| config hook trust | stale 15 warn | stale 15 warn |

신규 Routing Disclosure가 skill long threshold를 넘긴 중간 상태는 문구 중복을 압축해 복구했다. 기존 hook trusted hash 15건 warning은 이번 작업 전부터 있던 상태다.

`config.toml`, `implementation-worker.toml`, `routine-worker.toml` 해시는 변경되지 않았다.

## 5. v2.3 Fresh Probe

| 항목 | 값 |
|---|---|
| Parent thread | `019f4a20-e416-7cb1-a0ae-bed46fad7ee8` |
| Parent model / effort | `gpt-5.6-luna/low` |
| CLI | app-local `codex-cli 0.144.0-alpha.4` |
| code-mode host | sibling 존재, parent 정상 시작 |
| sandbox / approval | `workspace-write / never` |
| source execution | 0 |
| spawn call / child | 0 / 0 |
| diagnostic | 미실행 |

실패 로그:

```text
PSSecurityException
이 시스템에서 스크립트를 실행할 수 없으므로
transport/test_bundle.ps1 파일을 로드할 수 없습니다.
```

직접 원인은 parent prompt가 다음처럼 script를 직접 실행한 것이다.

```powershell
& '.\transport\test_bundle.ps1'
```

v2.4에서는 다음과 같이 process 범위에서만 bypass해야 한다.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-4\transport\test_bundle.ps1
```

v2.3에서는 retry하지 않았고 probe source와 Luna Worker 품질은 판정하지 않았다.

## 6. Usage

| Thread | Input | Cached input | Output | Reasoning | Total |
|---|---:|---:|---:|---:|---:|
| Implementation + repair Worker | 3,387,893 | 3,182,080 | 25,608 | 5,485 | 3,413,501 |
| v2.3 probe parent | 120,856 | 96,256 | 684 | 258 | 121,540 |
| 합계 | - | - | - | - | 3,535,041 |

Worker cached input ratio는 93.93%지만 총 사용량은 매우 높다. 특히 resume이 `Sol/xhigh`로 전환된 사실이 사용량 관점에서 중요하다.

- `credits_source = unavailable`
- `total_credits = null`
- planning Worker 신설은 계속 보류한다.
- v2.4 자동 실행도 사용량 보호를 위해 하지 않는다.

## 7. Scope와 Integrity

Pre-probe manifest SHA256: `F36C384922750F85696E1A4806E7A9ADB95847D2691D5CE5E3B08ED6967C457E`

| 검사 | 결과 |
|---|---:|
| frozen files checked / drift at probe stop | 46 / 0 |
| global files checked / drift at probe stop | 6 / 0 |
| app-local bundle checked / drift | 4 / 0 |
| trial-01 mismatch | 4 |
| probe child rollout | 0 |
| commit / push / PR / deploy | 0 |

Probe 종료 뒤 resume model drift 대응을 위해 orchestration skill 한 줄을 의도적으로 추가 수정했고 contract test와 health-check를 다시 통과했다.

## 8. Risk-based Self-review

| 리스크 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| Resume 시 Terra가 Sol/xhigh로 변경 | 3 | 3 | 1 | 7 | high | 매 spawn/resume 실제 model 재확인 규칙 추가 |
| 한 Worker thread가 3.4M tokens 사용 | 3 | 2 | 1 | 6 | high | planning Worker 보류, v2.4 자동 실행 중단 |
| Parent preflight에 ExecutionPolicy 누락 | 2 | 1 | 1 | 4 | medium | v2.3 FAIL 보존, v2.4 exact command 고정 |
| Route 공개가 skill long warning 생성 | 2 | 2 | 1 | 5 | high | 문구 압축 후 health 0 long 복구 |

확인된 critical 리스크는 없다.

## 9. 다음 Gate

기술적 다음 gate는 `GT-04 v2.4 ExecutionPolicy-safe app-local probe`다.

1. v2.3 evidence는 수정하지 않는다.
2. Parent preflight command만 process-scoped Bypass로 고정한다.
3. app-local bundle/hash, fixture, source와 model 조건은 그대로 유지한다.
4. no-agent probe PASS일 때만 Luna diagnostic을 실행한다.
5. Worker resume은 사용하지 않고 필요한 repair는 새 Terra/medium Worker로 생성한다.

Phase 4-B는 **진행 중, v2.4는 별도 승인 전 미실행** 상태다.
