# 01. PRD: 전역 Advisor/Worker 오케스트레이션

## 1. Overview

Codex의 메인 세션을 `Advisor`로 두고, 요구사항 분석·작업 분해·설계·검증·최종 승인에 집중하게 한다. 코드와 테스트 작성 같은 구현 노동은 `Worker` subagent가 수행한다.

GPT-5.6에서는 하나의 고성능 모델을 항상 높은 추론 강도로 쓰지 않고, 역할과 작업 난이도에 따라 `Sol/Terra/Luna`를 선택한다. 목표는 품질을 유지하면서 불필요한 `xhigh`, `Max`, `Ultra`, 병렬 fan-out을 줄이는 것이다.

## 2. Problem Statement

현재 전역 기본값은 `gpt-5.5` + `xhigh` + `priority`다. 별도 override가 없는 작업은 같은 고비용 기본값으로 실행되고, 메인 세션이 탐색·구현·테스트 로그까지 모두 떠안아 다음 문제가 생길 수 있다.

- 단순 작업에도 높은 추론 비용이 든다.
- 구현 중간 출력이 메인 컨텍스트를 채워 요구사항과 설계 판단이 흐려진다.
- subagent를 사용해도 역할·완료 보고·검증 기준이 없으면 결과를 그대로 수용할 위험이 있다.
- 병렬 쓰기는 속도를 높일 수 있지만 같은 파일을 건드리면 충돌과 재작업이 늘어난다.
- `Ultra`를 일상 기본값으로 쓰면 자동 위임이 품질보다 사용량을 먼저 키울 수 있다.

## 3. Goals & Non-Goals

### Goals

| ID | 목표 | 성공 판정 |
|---|---|---|
| GOAL-AWO-001 | Advisor와 Worker의 책임을 전역에서 일관되게 분리 | 위임 대상 구현 작업의 90% 이상이 명시적 brief를 통해 위임됨 |
| GOAL-AWO-002 | Worker 결과를 독립 검증 | 적용된 구현 작업의 100%에 Advisor diff 확인과 테스트 기록 존재 |
| GOAL-AWO-003 | GPT-5.6 모델을 난이도에 맞게 사용 | 일상 작업의 기본이 Terra/medium 이하이고 Sol/high 이상은 승격 사유가 기록됨 |
| GOAL-AWO-004 | 병렬화로 인한 충돌을 방지 | 같은 worktree에서 병렬 Worker 간 파일 소유권 충돌 0건 |
| GOAL-AWO-005 | 품질 저하 없이 사용량 절감 | 측정 출처가 검증된 pilot에서 기준선 대비 중앙 총 credits 25% 이상 감소, 핵심 품질 지표 악화 없음 |
| GOAL-AWO-006 | 전역 동작을 진단 가능하게 유지 | health-check가 custom agents와 `[agents]` 제한을 검사 |

### Non-Goals

- Anthropic 공식 Advisor Strategy를 동일하게 재현하지 않는다.
- 모든 요청에 subagent를 강제하지 않는다.
- Advisor의 최종 판단과 검증을 다른 agent에게 넘기지 않는다.
- Worker에게 commit, push, PR 생성 권한을 기본 부여하지 않는다.
- `Ultra`를 전역 기본 추론 강도로 설정하지 않는다.
- MVP에서 blocking hook이나 자동 commit hook을 추가하지 않는다.
- 프로젝트별 TDD, 아키텍처, 보안 규칙을 전역 규칙으로 복제하지 않는다.

## 4. User Stories

| ID | User Story |
|---|---|
| US-AWO-001 | As a Codex 사용자, I want 메인 세션이 요구사항과 설계 판단에 집중하기를, so that 긴 구현에서도 중요한 결정이 묻히지 않는다. |
| US-AWO-002 | As a Codex 사용자, I want 구현을 적절한 Worker 모델에 위임하기를, so that 품질을 유지하면서 사용량을 줄인다. |
| US-AWO-003 | As a Codex 사용자, I want Advisor가 Worker 결과를 직접 검증하기를, so that 잘못된 완료 보고를 그대로 승인하지 않는다. |
| US-AWO-004 | As a Codex 사용자, I want 작은 작업은 직접 처리하기를, so that 위임 오버헤드가 작업 자체보다 커지지 않는다. |
| US-AWO-005 | As a Codex 사용자, I want 모델 승격과 병렬 fan-out에 명확한 기준이 있기를, so that 사용량 급증 원인을 설명할 수 있다. |

## 5. Functional Requirements

| ID | 우선순위 | 요구사항 | 수용 기준 |
|---|---|---|---|
| REQ-AWO-001 | Must | 메인 세션을 Advisor로 정의한다. | 전역 규칙에 분석, 분해, 설계, brief, diff/test 검증, 승인 책임이 명시됨 |
| REQ-AWO-002 | Must | 구현 Worker를 custom agent로 제공한다. | `implementation_worker`가 Terra/medium으로 로드되고 brief 범위 밖 수정을 금지함 |
| REQ-AWO-003 | Must | 반복 작업용 저비용 Worker를 제공한다. | Terra 검증 루프 안정화 후 `routine_worker`를 Luna/medium으로 추가하고 명확한 기계적 작업만 수락함 |
| REQ-AWO-004 | Must | Worker brief 최소 계약을 강제한다. | 목적, 허용/금지 경로, 컨텍스트, 함정, 완료 기준, 테스트, 보고 형식이 포함됨 |
| REQ-AWO-005 | Must | Advisor 검증 게이트를 정의한다. | `git status`, diff, focused test, 범위 확인 없이 완료 판정을 하지 않음 |
| REQ-AWO-006 | Must | 검증 실패 시 수정 brief로 재위임한다. | 실패 증거, 기대 결과, 수정 범위가 포함된 repair brief가 사용됨 |
| REQ-AWO-007 | Must | 작은 작업의 직접 처리 예외를 정의한다. | 1~2줄 수정 또는 위임 비용이 더 큰 작업만 예외이며 동일 검증을 수행함 |
| REQ-AWO-008 | Must | 병렬 쓰기 안전 규칙을 정의한다. | 병렬 Worker의 허용 경로가 겹치지 않거나 별도 worktree를 사용함 |
| REQ-AWO-009 | Must | agent fan-out을 제한한다. | `max_depth = 1`과 `max_threads = 4`는 runtime 설정으로 검증하고, turn당 Worker 최대 3개는 soft policy와 run log로 검증 |
| REQ-AWO-010 | Must | 모델·추론 승격 기준을 정의한다. | Sol/high, Max, Ultra 사용 시 난이도 또는 분해 가능성 근거가 있음 |
| REQ-AWO-011 | Must | commit 권한 경계를 유지한다. | 사용자 요청이 없는 commit/push가 없고 Advisor만 최종 범위를 승인함 |
| REQ-AWO-012 | Should | health-check를 확장한다. | agent 파일 schema, 모델 ID, `[agents]` 제한, 중복 이름을 진단함 |
| REQ-AWO-013 | Must | 통제된 비교 eval을 운영한다. | 동일 fixture·prompt·권한으로 조합별 3회 실행하고, 실행 순서·cache 상태·service tier·credits·품질·시간을 기록함 |
| REQ-AWO-014 | Must | GPT-5.6 접근을 구현 전에 검증한다. | Phase 0에서 Sol/Terra/Luna와 필요한 effort의 read-only smoke 결과가 access matrix에 기록됨 |
| REQ-AWO-015 | Must | credits 계측 계약을 정의한다. | token 원천, rate card 버전, 환산 규칙, parent/child thread attribution, `observed/derived/aggregate-only/unavailable` 상태가 기록됨 |

### Non-Functional Requirements

| ID | 분류 | 요구사항 | 수용 기준 |
|---|---|---|---|
| NFR-AWO-001 | 비용 | 불필요한 고비용 모델·effort·fan-out을 제한한다. | Pilot 중앙 `total_credits`가 기준선 대비 25% 이상 감소 |
| NFR-AWO-002 | 안전 | Worker가 권한을 확대하거나 commit/push/deploy하지 않는다. | 승인 없는 외부 상태 변경 0건 |
| NFR-AWO-003 | 가역성 | 전역 변경을 개별 표면 단위로 되돌릴 수 있다. | 전체 `.codex` 삭제 없이 기준선 복원 |
| NFR-AWO-004 | 호환성 | 프로젝트 지침이 전역 역할 정책보다 우선한다. | 프로젝트별 TDD·보안·Git 규칙 회귀 0건 |
| NFR-AWO-005 | 설명 가능성 | 모델 승격, 병렬화, repair 이유를 기록한다. | 모든 Sol/high 이상 실행에 `escalation_reason` 존재 |
| NFR-AWO-006 | 운영성 | custom agent와 config drift를 진단한다. | health-check가 schema·모델·fan-out 제한을 보고 |
| NFR-AWO-007 | 격리성 | pilot은 사용자 WIP와 분리된 fixture 또는 전용 clean worktree에서 실행한다. | dirty worktree·production credential·실제 remote write 없이 재실행 가능 |

## 6. UX Requirements

화면 UI를 새로 만들지 않는다. 사용자 경험은 Codex 대화와 subagent panel에서 다음처럼 보인다.

1. Advisor가 짧은 작업 계획과 위임 이유를 알린다.
2. 필요한 경우 독립 Worker가 실행되고, 사용자는 subagent thread를 열어 상태를 확인할 수 있다.
3. Advisor가 Worker 완료 보고를 받은 뒤 diff와 테스트를 직접 확인한다.
4. 실패 시 같은 Worker 또는 새 Worker에 repair brief를 보낸다.
5. 최종 보고에는 사용한 모델 역할, 검증 결과, 남은 리스크만 요약한다.

사용자에게 내부 토큰 추론이나 장황한 agent 로그를 노출하지 않는다. 대신 위임 단위, 검증 상태, 실패 사유를 짧게 보여준다.

## 7. Technical Considerations

- 전역 `AGENTS.md`에는 책임 경계와 trigger만 둔다. 상세 brief와 게이트는 skill로 분리한다.
- GPT-5.6은 제한 preview이므로 모델 ID를 설정하기 전에 현재 Codex workspace의 접근과 effort 지원을 확인한다.
- Codex built-in `worker`를 덮어쓰지 않고 별도 custom agent 이름을 쓴다.
- custom agents는 부모의 sandbox와 approval을 상속한다. agent 파일로 권한을 넓히지 않는다.
- `max_depth = 1`을 유지해 Worker가 다시 Worker를 만드는 재귀 fan-out을 막는다. `max_threads`와 turn당 Worker 수는 서로 다른 제한으로 취급한다.
- 읽기 중심 탐색은 병렬화에 적합하지만, 쓰기 중심 구현은 파일 소유권 또는 worktree 분리가 선행되어야 한다.
- `service_tier = "priority"` 변경은 MVP 필수 범위에서 제외한다. credits 영향은 pilot에서 별도 변수로 측정한다.
- 프로젝트 `AGENTS.md`와 skill의 더 구체적인 규칙이 전역 역할 정책보다 우선한다.
- 정적 eval schema·golden task는 skill에 두고, mutable run log와 report는 skill 밖 전용 state 경로에 둔다.

## 8. Milestones

| 단계 | 전달 범위 | 예상 |
|---|---|---:|
| M0 | GPT-5.6 access matrix, credits calibration, 격리 fixture, 현재 기준선, 롤백 백업 | 0.5~1일 |
| M1 | 전역 역할 규칙과 orchestration skill | 0.5일 |
| M2 | Terra implementation Worker와 `[agents]` 제한 | 0.5일 |
| M3 | Terra Worker 검증·repair·병렬 안전 루프 | 0.5~1일 |
| M4 | Luna routine Worker, health-check, 10개 golden task pilot | 2~3일 |
| M5 | 1주 관찰 후 기본 모델 변경 승인 | 관찰 1주 |

## 9. Risks & Mitigations

| 리스크 | 가능성 | 영향 | 대응 |
|---|---:|---:|---|
| 위임 자체가 사용량을 증가시킴 | 중 | 높음 | 작은 작업 직접 처리, fan-out soft policy 최대 3, Terra/Luna 우선 |
| Advisor와 Worker가 같은 내용을 재탐색 | 중 | 중 | brief에 파악한 컨텍스트·파일·함정을 포함하고 재탐색 금지 |
| 병렬 Worker가 같은 파일 수정 | 중 | 높음 | disjoint path 또는 별도 worktree 없으면 직렬 실행 |
| Worker 완료 보고 오판 | 중 | 높음 | Advisor가 diff와 테스트를 독립 실행, 보고만으로 승인 금지 |
| Sol/high를 습관적으로 사용 | 높음 | 중 | 승격 사유 기록, 기본 Terra/medium, eval에서 모델별 credits 공개 |
| Ultra와 수동 fan-out 중복 | 낮음 | 높음 | 둘 중 하나만 선택, Ultra는 명시적 큰 작업에만 사용 |
| 전역 규칙이 프로젝트 절차와 충돌 | 낮음 | 높음 | 전역 규칙을 역할 경계로 한정하고 프로젝트 지침 우선 명시 |
| custom agent schema가 변경됨 | 낮음 | 중 | health-check schema 검증, 실패 시 built-in `worker` 폴백 |
| GPT-5.6 접근이 현재 workspace에 없음 | 중 | 높음 | Phase 0 access matrix 실패 시 5.5 role-only pilot으로 전환하거나 중단 |
| credits가 per-thread로 관측되지 않음 | 중 | 높음 | token 기반 derived credits와 Usage panel 교차검증, 불가능하면 비용 판정 보류 |
| pilot이 사용자 WIP를 오염 | 낮음 | 높음 | disposable fixture 또는 전용 clean worktree만 사용 |

## 10. Success Metrics

| 지표 | Pilot 목표 | 측정 방법 |
|---|---:|---|
| GPT-5.6 접근 준비 | Terra/medium 필수, Sol/high·Luna/medium 상태 명시 | surface별 read-only smoke access matrix |
| 핵심 task pass@1 | 기준선 이상 | deterministic test + 사람 검토 |
| 회귀 task pass^3 | 100% | 같은 핵심 task 3회 연속 통과 |
| 중앙 총 credits | 기준선 대비 25% 이상 감소 | 역할별 합산 또는 격리된 task aggregate delta |
| credits 측정 신뢰도 | `observed`, 검증된 `derived`, 격리된 `aggregate-only` | token source, rate card 버전, attribution 또는 Usage panel delta 기록 |
| Advisor 독립 검증률 | 100% | run log의 diff/test evidence |
| 범위 밖 수정 | 0건 | 허용 경로와 실제 diff 비교 |
| 병렬 쓰기 충돌 | 0건 | conflict/revert/rework 기록 |
| 평균 repair loop | 1회 이하 | Worker 재위임 횟수 |
| Sol/high 이상 사용 비율 | 전체 task의 30% 이하 | model routing log |
| Ultra 사용 | pilot 중 1~2개 대형 task만 | 명시적 승인 기록 |

### Traceability

| User Story | 연결 요구사항 | 핵심 지표 |
|---|---|---|
| US-AWO-001 | REQ-AWO-001, REQ-AWO-004, REQ-AWO-005 | Advisor 독립 검증률, brief 완전성 |
| US-AWO-002 | REQ-AWO-002, REQ-AWO-003, REQ-AWO-009, REQ-AWO-010, REQ-AWO-013, REQ-AWO-014, REQ-AWO-015 | `total_credits`, task pass@1, access matrix, `credits_source` |
| US-AWO-003 | REQ-AWO-005, REQ-AWO-006, REQ-AWO-011 | 검증 증거, scope violation, repair loop |
| US-AWO-004 | REQ-AWO-007 | 직접 처리 task의 시간과 최소 diff |
| US-AWO-005 | REQ-AWO-009, REQ-AWO-010, REQ-AWO-013 | `escalation_reason`, Worker 수, Ultra 사용 수 |
