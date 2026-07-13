# 10. Phase 3 Advisor 검증·repair 루프 실행 결과

> 실행일: 2026-07-10 KST<br>
> 범위: disposable fixture의 병렬 Terra Worker 2개, Advisor 독립 검증, evidence-based repair 1회<br>
> 판정: **완료, runtime 제한 1건 기록**

## 1. 결론

- synthetic 기능 2개를 `gpt-5.6-terra/medium` Worker 2개에 병렬 위임했다.
- Worker A와 B의 쓰기 소유권은 각각 `alpha/tag_tools.py`, `beta/retry_schedule.py`로 분리했다.
- Advisor가 Worker의 `complete` 보고와 별개로 변경 파일, diff, focused test, broader check를 직접 검증했다.
- broader check에서 의도한 registry 실패 1건을 확인하고, 실제 실패 로그를 같은 beta Worker의 repair brief로 전달했다.
- repair는 병렬 구현이 끝난 뒤 `registry/features.json` 한 파일에 직렬 수행했다.
- 최종 focused test 1개와 전체 test 8개가 통과했다.
- `scope_violations = 0`, `write_conflicts = 0`, `repair_loops = 1`, `worker_count = 2`다.
- Worker commit, push, PR, deploy, global edit, child spawn은 0건이다.

## 2. Fixture와 소유권

Fixture는 운영 코드·credential·remote write와 분리된 [phase3-fixture](./phase3-fixture/)의 `baseline/workspace` 쌍이다. Git commit이나 staging 없이 baseline SHA256과 workspace SHA256을 비교해 status를 계산하고, `git diff --no-index`로 diff를 읽었다.

| Lane | Worker 쓰기 소유권 | 초기 focused test | 병렬 여부 |
|---|---|---|---|
| alpha | `workspace/alpha/tag_tools.py` | 3개 `NotImplementedError` | beta와 병렬 |
| beta | `workspace/beta/retry_schedule.py` | 4개 `NotImplementedError` | alpha와 병렬 |
| repair | `workspace/registry/features.json` | broader check 실패 1개 | 병렬 종료 후 직렬 |

Shared state 정책:

- lockfile, test DB, generated output 생성 금지
- Python bytecode cache는 `python -B`로 쓰기 금지
- 초기 RED 점검에서 Advisor가 만든 `__pycache__` 8개는 경로 검증 후 파일 단위로 제거했고 최종 잔여 디렉터리는 0개
- `registry/features.json`은 초기 병렬 단계에서 양쪽 Worker 모두 수정 금지

## 3. Worker Brief

| Brief | 역할 | 핵심 경계 | SHA256 |
|---|---|---|---|
| [WB-phase3-alpha-001](./phase3-fixture/WB-phase3-alpha-001.md) | normalize tags 구현 | alpha 소스 1개만 쓰기 | `D0C5468C0E468E77AA9CA67614B3C5BEB98B7F68581096E6CC1CBE1075564A35` |
| [WB-phase3-beta-001](./phase3-fixture/WB-phase3-beta-001.md) | retry schedule 구현 | beta 소스 1개만 쓰기 | `B90430329C7C8FBC6B95FB37F1357B32C1FB80C76BAF3D515CF9AAF5690D440C` |
| [RB-phase3-beta-001-R1](./phase3-fixture/RB-phase3-beta-001-R1.md) | registry repair | registry JSON 1개만 쓰기 | `CD89D7794AA8652A60C119FE00697BFD3AC3381406131C4E6291F2D46411B9C1` |

두 구현 brief는 objective, why, known context, allowed/forbidden path, isolation, shared state, allowed command, convention, pitfall, acceptance criteria, test, 병렬 소유권, stop condition, report 형식을 모두 유지했다.

## 4. Runtime Routing

현재 앱 세션의 multi-agent API에 새 custom role `implementation_worker`를 지정한 첫 spawn은 파일 수정 전에 다음 오류로 차단됐다.

```text
unknown agent_type 'implementation_worker'
```

Phase 2의 fresh CLI smoke에서는 standalone custom agent 로드가 이미 통과했다. Phase 3에서는 orchestration skill의 fallback에 따라 built-in `worker`를 사용하되 `model = gpt-5.6-terra`, `reasoning_effort = medium`을 명시하고 custom Worker와 같은 brief 경계를 적용했다.

이 결과는 custom agent 파일 실패가 아니라, 현재 실행 중인 Codex 앱의 multi-agent tool이 세션 시작 후 등록된 custom role 이름을 즉시 노출하지 않는 runtime 가시성 제한으로 분류한다. Phase 4에서 fresh app session 또는 API 지원 상태를 다시 확인한다.

## 5. 병렬 Worker 결과

| 항목 | Alpha | Beta |
|---|---|---|
| agent thread | `019f4999-6cde-71c2-949c-3469ed8b0ac5` | `019f4999-83cc-7b63-a4a2-b868cce3f9be` |
| model / effort | `gpt-5.6-terra / medium` | `gpt-5.6-terra / medium` |
| 변경 보고 | alpha 1파일 | beta 1파일 |
| Worker focused test | 3 PASS | 4 PASS |
| commit/push/deploy | 0 | 0 |

Advisor는 위 보고를 승인 근거로 사용하지 않고 다음 gate를 별도로 실행했다.

## 6. Advisor 독립 검증

| Gate | Advisor 확인 | 결과 |
|---|---|---|
| G0 상태 | baseline/workspace 격리, production·remote·credential 없음 | PASS |
| G1 범위 | hash 비교 변경 파일 집합 | alpha, beta 2개만 변경, PASS |
| G2 diff | 두 구현의 `git diff --no-index` 직접 확인 | 요구사항과 일치, PASS |
| G3 focused | alpha 3개, beta 4개 재실행 | 7 PASS |
| G4 broader | `python -B -m unittest discover -s tests -v` | 7 PASS, registry 1 FAIL |
| G5 설계 | typed deterministic function, 최소 구현, 입력 불변성 | PASS |
| G6 최종 범위 | repair 후 baseline 대비 변경 집합 | alpha, beta, registry 3개, PASS |
| G7 승인 | commit/push는 사용자 요청 없음 | 미수행 |

구현 결과 SHA256:

| 파일 | SHA256 |
|---|---|
| `workspace/alpha/tag_tools.py` | `01FF70F43FA193812481F29436718E35A3730E16C29362187883FDEBD32C33CE` |
| `workspace/beta/retry_schedule.py` | `F629A6CDBA51D78B9AEA9C2DA3A830397F729EDF15E28D60987F9AC0AF8A9AB7` |
| `workspace/registry/features.json` | `E1CFDE476A52CDA4FE945B9BBE661A164BFF66893DDDA5F50EC7C3C12B0293A7` |

## 7. Evidence-based Repair

Advisor broader check의 실제 실패는 다음과 같았다.

```text
AssertionError: {'features': ['alpha']} != {'features': ['alpha', 'beta']}
Ran 8 tests
FAILED (failures=1)
```

Repair brief는 정상인 alpha/beta 구현을 금지 경로로 고정하고 `registry/features.json`만 열었다. 같은 beta Worker에 serial repair로 재위임했으며, Worker 보고 후 Advisor가 다시 검증했다.

| 재검증 | 결과 |
|---|---|
| `python -B -m unittest tests.test_feature_registry -v` | 1 PASS |
| registry JSON parse와 `alpha,beta` 순서 | PASS |
| `python -B -m unittest discover -s tests -v` | 8 PASS |
| 최종 변경 파일 수 | 3 |
| 범위 밖 변경 | 0 |

## 8. 직접 처리와 위임 경계

Advisor가 직접 수행한 일:

- fixture와 acceptance test 설계
- Worker brief와 repair brief 작성
- baseline/workspace status 계산
- diff 직접 확인
- focused/broader test 직접 실행
- 최종 gate 판정과 보고

Worker에 위임한 일:

- alpha와 beta의 의미 있는 구현 로직
- 검증 실패 뒤 registry repair

Advisor가 Worker 대신 구현 로직을 직접 수정한 사례는 없다.

## 9. 관측 결과

```text
ADVISOR/WORKER RUN
- task_id: PHASE3-C1-SYNTHETIC-01
- workers: built-in worker with explicit gpt-5.6-terra/medium x2
- worker_count: 2
- repair_loops: 1
- scope_violations: 0
- write_conflicts: 0
- advisor_verification_complete: true
- tokens: unavailable from in-app multi-agent result
- credits_source: unavailable
- wall_time_seconds: unavailable
- result: PASS_WITH_RUNTIME_LIMIT
```

Phase 3은 routing 품질과 검증 루프를 확인하는 단계이므로 credits 절감 판정은 하지 않는다. usage 비교는 Phase 4의 고정 fixture 반복 실험에서 수행한다.

## 10. Health-check와 Gate

| 영역 | 결과 |
|---|---|
| AGENTS | PASS, 103줄 core-sized |
| skills | PASS, 67 total, 0 long, stale 0 |
| commands/memories/plugins | PASS |
| config | 기존 hook trust stale 15건으로 WARN |
| global config/agent/skill hash | Phase 2와 동일 |

| Phase 3 gate | 판정 |
|---|---|
| Worker 완료 보고만으로 승인하지 않음 | PASS |
| 실패 로그를 repair brief에 정확히 전달 | PASS |
| 같은 파일 병렬 수정 없음 | PASS |
| shared write state 충돌 없음 | PASS |
| 직접 처리와 위임 trigger 구분 | PASS |
| final focused/broader test | PASS |
| in-app custom role 직접 spawn | LIMIT, built-in Terra fallback 사용 |

Phase 3 gate는 완료다. Phase 4 진입 전 첫 확인 항목은 fresh app session에서 `implementation_worker` role 가시성을 재검증하는 것이다.

## 11. Risk-based Self-review

| 피드백 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| 현재 앱 multi-agent API가 새 custom role 이름을 직접 받지 않음 | 2 | 1 | 1 | 4 | medium | Phase 4 첫 gate에서 fresh app session 재검증; 그전에는 built-in Terra fallback 유지 |
| synthetic fixture가 실제 프로젝트의 다중 모듈 복잡도를 대표하지 않음 | 1 | 1 | 0 | 2 | low | Phase 4 GT-02, GT-03 반복 eval에서 보완 |

확인된 high 또는 critical 피드백은 없다. runtime 제한을 숨기지 않고 `PASS_WITH_RUNTIME_LIMIT`로 판정했으며, 전역 기본값 전환 근거로 Phase 3 단일 run을 사용하지 않는다.
