# Phase 5.1 planning_worker Capability Pilot

> 실행일: 2026-07-10 KST<br>
> 판정: **Capability PASS, 자동 라우팅 승격 PENDING**

## 구현

- `planning_worker = gpt-5.6-terra/medium` custom agent 등록
- health-check 필수 route를 3개로 확장하고 TDD Red/Green 검증
- 1 spawn, no resume, 10분 timeout, timeout close와 300k Worker ceiling 계약
- 3개 evidence stream과 5개 output 문서로 구성된 격리 fixture와 deterministic grader
- smoke와 capability 사이 agent/config/prompt/fixture 16개 hash 고정

## 결과

| Gate | 결과 |
|---|---|
| Health-check route | PASS, 3/3 |
| Grader tests | PASS, 2/2 |
| Manifest tests | PASS, 2/2 |
| Fresh child model/effort | PASS, Terra/medium |
| Preflight manifest | PASS, 16 checked, drift 0 |
| Capability grader | PASS, 5 files, errors 0 |
| Scope | allowed 5, outside 0 |
| Guard | spawn 1, wait 1, timeout 0, close 1, resume/retry/repair 0 |

## 사용량

| 구분 | Input | Cached input | Output | Total | 시간 |
|---|---:|---:|---:|---:|---:|
| Parent | 191,604 | 165,888 | 1,708 | 193,312 | 163.8초 |
| planning_worker | 165,637 | 151,808 | 2,917 | 168,554 | 119.6초 |
| 합계 | - | - | - | 361,866 | - |

Worker ceiling은 300,000 tokens이며 56.18%를 사용했다. `credits_source=unavailable`이므로 비용 절감 판정은 하지 않는다.

## Advisor 검증

- Worker 보고와 별개로 grader를 다시 실행해 PASS를 확인했다.
- 모든 frozen input의 post-run drift가 0임을 확인했다.
- child rollout `turn_context`에서 실제 Terra/medium을 확인했다.
- Worker tool trace는 허용 evidence 읽기, 5개 output `apply_patch`, 지정 grader 1회뿐이었다.
- 13개 evidence ID가 모두 matrix와 대상 문서에 존재하고 recommendation/inference가 구분됐다.

## 잔여 Gate

이 결과는 “planning_worker가 제한된 대형 기획 패키지를 만들 수 있다”는 capability만 증명한다. direct 대비 효율과 안정성은 아직 증명하지 않았다.

자동 라우팅 승격 전에는 동일 fixture로 direct/delegated paired trial을 각각 3회 실행하고, 품질 비열위·scope violation 0·model drift 0·사전 정의한 시간/총 token 범위를 모두 충족해야 한다.

## Risk-based Self-review

| 항목 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| runtime token hard cap 부재 | 3 | 2 | 1 | 6 | high | 1 spawn, no resume, timeout close, 종료 후 ceiling Gate |
| parent 포함 총량 361,866 | 2 | 2 | 1 | 5 | high | direct baseline 전 효율 주장 금지, paired trial로 이연 |
| timeout 종료 경로 미실행 | 2 | 1 | 1 | 4 | medium | 계약과 close tool 존재 확인, 별도 negative eval 필요 |
| 기존 stale hook hash 15건 | 1 | 2 | 1 | 4 | medium | 변경 전후 동일, 별도 maintenance 유지 |

확인된 critical 리스크와 신규 health regression은 없다.
