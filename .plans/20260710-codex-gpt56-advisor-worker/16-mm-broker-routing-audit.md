# 16. mm-broker Advisor/Worker 라우팅 감사

> 감사일: 2026-07-10 KST<br>
> 대상 session: `019f49a6-76fc-76e1-bd0d-0e7abfd96cfa`<br>
> 대상 docs turn: `019f49d5-8ed5-78a0-92ef-4f7ae8fb2ff2`<br>
> 판정: **현재 정책대로 direct route가 선택됐지만, 사용자 관점의 라우팅 관측성이 부족했다.**

## 1. 한 줄 결론

Advisor/Worker가 고장 나서 적용되지 않은 것이 아니다. 현재 전역 규칙과 skill이 `비단순 구현 작업`만 위임 대상으로 두고 `docs-only`를 직접 처리 대상으로 제외했기 때문에, 기획 문서 수정은 의도적으로 main-direct 경로를 탔다.

다만 “정책을 참고해 direct로 결정했다”와 “orchestration skill을 실제 실행했다”가 사용자에게 같은 말처럼 들린 것이 문제다. 실제 기록은 다음과 같다.

| 단계 | 실제 상태 | 의미 |
|---|---|---|
| 전역 라우팅 정책 주입 | 예 | global `AGENTS.md`가 session instructions에 포함됨 |
| `advisor-worker-orchestration` skill 실행 | 아니요 | `SKILL.md` full read와 workflow activation 없음 |
| Worker spawn | 아니요 | spawn 관련 tool call 0 |
| custom Worker model 활성화 | 아니요 | Terra/Luna child 없음 |
| main model 직접 수행 | 예 | `gpt-5.6-sol/high`가 분석·문서 수정·검증 수행 |

## 2. Rollout Evidence

감사 원본:

- mm-broker rollout: `C:/Users/beck/.codex/sessions/2026/07/10/rollout-2026-07-10T10-31-19-019f49a6-76fc-76e1-bd0d-0e7abfd96cfa.jsonl`
- 전역 AGENTS.md: `C:/Users/beck/.codex/AGENTS.md`
- Advisor/Worker skill: `C:/Users/beck/.agents/skills/advisor-worker-orchestration/SKILL.md`
- implementation Worker: `C:/Users/beck/.codex/agents/implementation-worker.toml`
- routine Worker: `C:/Users/beck/.codex/agents/routine-worker.toml`

| 증거 | 관측값 |
|---|---|
| rollout line 374, 440 | docs turn model/effort `gpt-5.6-sol/high` |
| rollout line 381 | `methodology-router`, `html-fidelity-reproduction`, `review-feedback-loop`, `reporting-style` read |
| docs turn custom tool calls | `functions.exec` 35회 |
| spawn/agent tool call | 0회 |
| orchestration skill path read | 0회 |
| rollout line 460, 465 등 | main session이 기획 문서를 직접 `apply_patch` |
| rollout line 574 | session이 no-worker direct mode를 사용자에게 보고 |

따라서 인용된 답변은 대체로 정확하다. 한 가지 표현만 더 엄밀히 고치면 다음과 같다.

```text
전역 라우팅 정책과 skill catalog의 docs-only 제외 조건으로 direct route를 판단했다.
advisor-worker-orchestration skill workflow 자체는 호출하거나 실행하지 않았다.
```

## 3. 왜 Direct Route였나

현재 계약의 trigger는 문서 분량이 아니라 **작업 종류**다.

1. Global `AGENTS.md`는 `비단순 구현 작업`일 때 orchestration skill을 호출하라고 한다.
2. Skill description과 Direct Work section은 explicit `docs-only`, `review-only`를 직접 처리하라고 한다.
3. 대상 작업은 `Design/.plans/20260708-nbbb1-dispatches-implementation-plan`의 기획 문서와 로드맵 수정이었다.
4. `mm-broker/app/test/broker-order-console-new` route나 application code는 수정하지 않았다.
5. 따라서 TDD와 implementation Worker trigger도 열리지 않았다.

이 판단에서 중요한 점은 `docs-only`가 “작업이 작다”는 뜻이 아니라 “현재 Worker 계약의 구현 대상이 아니다”라는 뜻이라는 것이다. 실제로 문서 작업은 컸지만, 정책상 크기보다 유형이 먼저 적용됐다.

## 4. 어떤 모델이 실제로 사용됐나

| 구분 | 설정 | 해당 turn 적용 |
|---|---|---|
| 현재 global main default | `gpt-5.6-sol/xhigh` | 활성 thread에 소급 적용된 증거 없음 |
| mm-broker thread setting | `gpt-5.6-sol/high` | 예 |
| `implementation_worker` | `gpt-5.6-terra/medium` | 아니요, spawn 0 |
| `routine_worker` | `gpt-5.6-luna/medium` | 아니요, spawn 0 |

Custom agent TOML은 자동 model router가 아니다. `implementation_worker` 또는 `routine_worker`를 실제로 spawn할 때만 그 child에 model/effort가 적용된다. `[agents].max_threads = 4`, `max_depth = 1`도 동시 실행 상한일 뿐 작업을 자동 분류하거나 Worker를 생성하지 않는다.

활성 thread에서는 rollout `turn_context`가 실제 모델의 SSOT다. 이 turn은 global config의 현재 `xhigh`가 아니라 thread setting인 `high`로 실행됐다. 기존 thread의 설정이나 사용자 선택은 global default보다 우선할 수 있으므로, config 파일만 보고 과거 turn의 effort를 단정하면 안 된다.

## 5. 적용 실패인가

두 가지 기대를 나누면 답이 달라진다.

| 기대 | 판정 | 이유 |
|---|---|---|
| 현재 규칙대로 라우팅했는가 | 예 | docs-only direct 조건과 일치 |
| 모든 큰 산출물 작업을 Worker에게 위임했는가 | 아니요 | 현재 규칙이 그렇게 정의돼 있지 않음 |
| Terra/Luna가 자동으로 선택됐는가 | 아니요 | custom agent는 spawn 기반 lazy activation |
| Main이 Advisor 책임을 수행했는가 | 부분적으로 예 | 분석·설계·검증은 했지만 문서 작성 노동도 직접 수행 |

즉 시스템 결함보다는 **정책 기대치 차이**다. 사용자가 원한 것이 “코드 구현만 위임”이라면 현재 동작이 맞다. “기획 문서처럼 큰 산출물 작성도 위임”이 목적이라면 current trigger가 너무 좁다.

## 6. 추천 개선

### 6.1 즉시 추천: 라우팅 관측성 추가

모든 비단순 산출물 작업 시작 시 main이 아래 5줄을 먼저 보고하도록 한다.

```text
Advisor/Worker route
- mode: direct | delegated
- advisor: <model>/<effort>
- worker: none | <role> <model>/<effort>
- orchestration skill: invoked | not-invoked
- reason: <matched trigger or exclusion>
```

이 변경은 delegation 빈도를 늘리지 않으면서 “왜 Worker가 없었는지”를 시작 전에 보여준다. 사용량이 빠르게 소모되는 상황에도 가장 비용 대비 효과가 좋다.

### 6.2 조건부 확장: 대형 기획 산출물 전용 Worker

기획 문서도 위임하려면 기존 `implementation_worker`를 억지로 재사용하지 않고 별도 `planning_worker` 또는 read-only research Worker를 평가하는 편이 낫다.

추천 trigger 후보:

- 수정 대상 문서 5개 이상
- 독립 evidence stream 3개 이상
- reference code/design inventory와 문서 패키지 개편을 함께 수행
- Advisor 검증 명령과 변경 경계를 brief로 고정할 수 있음

이 경우에도 review-only는 main이 소유하고, Worker는 격리된 planning directory에서 초안·evidence matrix·기계 검증만 수행한다.

### 6.3 지금 권하지 않는 변경

모든 docs-only 작업에 무조건 Worker를 붙이는 것은 권하지 않는다. 작은 문서 수정에도 parent/child context가 중복되고, 이번 GT-04 계열에서 확인했듯 spawn 전 transport 실패만으로도 수만 token이 소비될 수 있다.

우선순위는 다음과 같다.

1. 시작 시 route/model 공개
2. 실제 구현 turn에서 Terra/Luna delegation 안정화
3. 사용량 evidence 확보
4. 그 뒤 대형 기획 산출물 전용 lane을 별도 pilot

## 7. 최종 판정

mm-broker 답변의 핵심 판정은 맞다. 다만 사용자에게는 “정책은 적용됐지만 skill과 Worker는 실행되지 않았다”라고 두 층을 분리해 설명했어야 한다.

현재 최우선 보완은 자동 위임 확대가 아니라 **route decision observability**다. 이를 먼저 넣으면 direct/delegated, main/child model, skill activation이 매 작업 시작 시 확인 가능해져 같은 혼선이 반복되지 않는다.
