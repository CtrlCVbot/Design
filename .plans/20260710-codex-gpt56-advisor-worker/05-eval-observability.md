# 05. Eval과 관측 설계

## 1. 평가 목적

이 기능은 prompt와 agent routing을 바꾸므로 일반 코드 테스트만으로 품질을 판정할 수 없다. Eval-Driven Development(평가를 먼저 정의하고 agent 동작을 비교하는 방식)를 사용한다.

평가 질문은 네 가지다.

1. Advisor가 구현보다 판단과 검증에 집중하는가?
2. Worker brief가 재탐색과 범위 이탈을 줄이는가?
3. Terra/Luna Worker가 기준선 품질을 유지하는가?
4. 총 credits와 완료 시간이 실제로 줄어드는가?

## 2. 비교 조합

| ID | Main | Worker | Service tier | 비교 목적 |
|---|---|---|---|---|
| B0 | `gpt-5.5/xhigh` single-agent | 없음 | `priority` | 현재 운영 묶음 기준선 |
| B1 | `gpt-5.6-terra/medium` single-agent | 없음 | `priority` | 모델+effort 전환 묶음의 실용 비교 |
| C1 | `gpt-5.6-terra/medium` Advisor | Terra/medium | `priority` | B1 대비 Advisor/Worker orchestration 효과 분리 |
| C2 | `gpt-5.6-sol/high` Advisor | Terra/medium | `priority` | 복잡한 작업용 역할 조합 |
| C3 | Terra/medium Advisor | Luna/medium | `priority` | 반복 작업용 역할 조합 |
| C4 | Sol/Ultra | 자동 subagents | `priority` | 대형 병렬 작업의 선택적 비교 |

- B0과 B1은 모델과 effort가 동시에 바뀌므로 개별 변수의 인과 효과를 주장하지 않는다. 둘은 “현재 묶음 대 후보 묶음” 비교다.
- B1과 C1은 main model, effort, service tier를 같게 유지해 orchestration 추가 효과를 비교한다.
- 모델 단독 또는 effort 단독 효과가 필요하면 두 조합에서 공통 지원되는 effort를 확인한 뒤 별도 실험을 추가한다.
- 기본 pilot 동안 service tier는 `priority`로 고정한다. service tier 비교는 routing이 확정된 뒤 별도 실험으로 분리한다.

## 3. 실험 통제 프로토콜

각 task-combination 쌍은 다음 조건으로 최소 3회 실행한다.

1. disposable fixture 또는 전용 clean worktree를 같은 commit/fixture ID로 복원한다.
2. 사용자 prompt, brief, tool permission, sandbox, service tier를 고정한다.
3. 실행 순서를 무작위화해 시간대·rate-limit·학습 순서 편향을 줄인다.
4. `input_tokens`, `cached_input_tokens`, `output_tokens`와 cached ratio를 기록한다. cache를 강제로 초기화할 수 없으면 cold/warm을 주장하지 않고 관측값으로 층화한다.
5. 같은 deterministic grader와 고정된 model-grader rubric을 사용한다.
6. task 또는 조합이 실패해도 trial을 삭제하지 않고 `FAIL`로 보존한다.
7. 둘 이상의 변수가 달라진 비교는 인과 효과가 아니라 bundle outcome으로만 해석한다.

## 4. Golden Task 세트

최소 10개 task를 같은 disposable fixture snapshot에서 반복한다. 실제 remote, production credential, 사용자 dirty worktree를 사용하지 않는다.

| ID | 유형 | 예시 | 기대 라우팅 | 핵심 grader |
|---|---|---|---|---|
| GT-01 | 사소한 수정 | 1줄 오탈자·상수 수정 | Advisor 직접 | 정확한 최소 diff |
| GT-02 | 단일 기능 | 코드+unit test 2~3파일 | Terra Advisor/Worker | test PASS, 범위 준수 |
| GT-03 | 다중 파일 기능 | 5~8파일 기능 | Terra Advisor + Terra Worker | acceptance criteria |
| GT-04 | 반복 변환 | 여러 파일 동일 패턴 수정 | Luna/medium Worker | 예외 0, deterministic check |
| GT-05 | 버그 수정 | 재현 테스트+수정 | Terra Worker | regression test |
| GT-06 | 모호한 설계 | 2개 이상 trade-off | Sol Advisor + Terra Worker | 결정 근거·회귀 없음 |
| GT-07 | 읽기 중심 탐색 | 큰 코드베이스 흐름 분석 | explorer 병렬 | 파일 근거 정확도 |
| GT-08 | 병렬 독립 구현 | 모듈 3개, 경로 분리 | 최대 3 Worker | conflict 0 |
| GT-09 | 고위험 변경 | auth/secret/data-loss 인접 수정 | Sol Advisor | human review, negative test |
| GT-10 | 대형 분석 | 독립 분석 lane 3개 이상 | Sol Ultra 후보 | 시간 대비 credits |

실제 파괴 명령, production deploy, secret 접근은 eval에 포함하지 않는다. 위험 동작은 mock fixture 또는 read-only 분석으로 대체한다.

## 5. Grader

### Code-based grader

- 테스트·빌드 exit code.
- 허용 경로와 실제 diff 비교.
- commit/push 발생 여부.
- Worker 간 파일 경로 중복.
- acceptance criteria의 deterministic check.

### Model-based grader

- 요구사항 이해 정확도 1~5.
- 설계 근거와 trade-off 1~5.
- Worker brief 완전성 1~5.
- 최종 보고의 증거 연결성 1~5.

동일 결과를 blind review하고 가능하면 model grader와 사람 review를 함께 사용한다.

Model grader는 점수별 anchor가 있는 고정 prompt를 사용한다. grader prompt와 version/hash를 run record에 남기며, 변경된 rubric 결과를 이전 baseline과 직접 비교하지 않는다.

### Human grader

다음은 사람 검토를 필수로 한다.

- security, auth, permission, secret.
- 데이터 삭제·migration·복구 어려운 변경.
- architecture boundary 변경.
- model grader 간 2점 이상 차이.

## 6. 기록할 지표

| 분류 | 지표 | 정의 |
|---|---|---|
| 품질 | `task_pass_at_1` | 첫 시도에 acceptance criteria를 만족한 비율 |
| 품질 | `regression_pass_power_3` | 핵심 task가 3회 연속 성공한 비율 |
| 비용 | `advisor_credits` | main session credits |
| 비용 | `worker_credits` | 모든 subagent credits 합 |
| 비용 | `total_credits` | Advisor + Worker |
| 비용 | `credits_source` | `observed`, `derived`, `aggregate-only`, `unavailable` |
| 비용 | `rate_card_retrieved_at` | 적용한 Codex rate card 조회 시각 |
| 비용 | `input/cached/output_tokens` | thread별 token usage |
| 비용 | `cached_ratio` | cached input 비율 |
| 시간 | `wall_time_seconds` | task 시작부터 Advisor 승인까지 |
| 위임 | `worker_count` | spawn된 Worker 수 |
| 위임 | `parent_thread_id/agent_thread_id` | Advisor와 Worker 사용량 귀속 키 |
| 위임 | `repair_loops` | 검증 실패 후 재위임 횟수 |
| 범위 | `scope_violations` | allowed path 밖 수정 수 |
| 병렬 | `write_conflicts` | 충돌·덮어쓰기·재작업 건수 |
| 검증 | `advisor_verification_complete` | G0~G7 증거 완전성 |
| 라우팅 | `escalation_reason` | Sol/high/Max/Ultra 승격 근거 |

## 7. Credits 계측 계약

### Source 우선순위

1. 각 Advisor/Worker thread의 session usage에서 model, input, cached input, output token을 수집한다.
2. runtime의 직접 `credits` 값이 non-null이면 `observed`로 기록한다.
3. 직접 credits가 없으면 공식 Codex rate card의 모델별 token rate로 `derived` 값을 계산한다.
4. Codex Settings의 Usage panel 전후 변화는 task aggregate 교차검증에 사용한다.
5. child thread를 식별할 수 없으면 역할별 credits는 `N/A`, 격리된 pilot 동안 다른 agentic run이 없음을 확인한 전체 task delta만 `aggregate-only`로 기록한다.

### Derived credits 후보식

```text
uncached_input_tokens = input_tokens - cached_input_tokens
derived_credits =
  (uncached_input_tokens * input_credit_rate
   + cached_input_tokens * cached_input_credit_rate
   + output_tokens * output_credit_rate) / 1_000_000
```

- 이 식은 local `input_tokens`가 cached token을 포함한다는 calibration이 통과한 뒤에만 사용한다.
- calibration은 고정 task 1회를 session token과 Usage panel delta로 대조해 수행한다.
- rate card 원문, 조회 시각, model ID, fast/speed 상태, service tier를 baseline과 함께 보존한다.
- calibration이 실패해도 격리된 Usage panel delta가 신뢰 가능한 경우에는 `aggregate-only`로 전체 task 비교만 허용한다. 둘 다 불가능하면 25% 절감 목표를 `PASS`로 판정하지 않는다.
- 현재 local session event에서 `credits`가 null인 경우를 정상 입력으로 취급하고, null을 0으로 계산하지 않는다.

## 8. Pilot 성공 기준

다음 조건을 모두 만족해야 전역 기본값 변경을 승인한다.

- GT-01~GT-10의 핵심 acceptance criteria가 기준선보다 나빠지지 않는다.
- 회귀 task의 `pass^3 = 100%`다.
- `credits_source`가 `observed`, calibration이 통과한 `derived`, 또는 동시 run이 없는 격리된 `aggregate-only`이고, 중앙 `total_credits`가 B0 대비 25% 이상 감소한다.
- `scope_violations = 0`, `write_conflicts = 0`이다.
- Advisor 검증 증거가 모든 구현 task에 존재한다.
- 평균 repair loop가 1회 이하다.
- soft policy 기준 `worker_count <= 3` 위반이 없다.
- C1이 일상 task의 기본 후보로 충분하고, C2·C4가 필요한 task class가 분리된다.

25% 절감 목표는 초기 가설이다. 10개 task pilot 후 품질과 credits 분포를 보고 조정한다.

## 9. 평가 산출물

```text
C:\Users\beck\.agents\skills\advisor-worker-orchestration\
└── references\evals\
    ├── golden-tasks.md        # versioned static definition
    ├── run-schema.json        # versioned static schema
    ├── grader-prompt.md       # versioned rubric
    └── fixtures.md            # fixture IDs와 재구축 절차

C:\Users\beck\.codex\eval-runs\advisor-worker\
├── baselines\
├── runs\                       # mutable raw run metadata
└── reports\                    # pilot-<date>.md
```

skill에는 재사용 정의만 둔다. mutable run data는 skill 배포·캐시·manifest 대상에서 제외한다. run 데이터에는 secret, 사용자 개인정보, 운영 데이터, 대형 raw log를 저장하지 않고 repo snapshot은 commit SHA 또는 fixture ID로만 참조한다. raw run은 기본 30일 보존하고 승인된 aggregate baseline만 남긴다.

## 10. Health-check 확장

| 검사 | PASS 조건 |
|---|---|
| agent directory | `~/.codex/agents`가 존재하고 TOML 파싱 성공 |
| required agents | `implementation_worker`, `routine_worker`가 존재 |
| model routing | 모델 ID와 effort가 허용 목록에 있음 |
| agent contract | `name`, `description`, `developer_instructions` 존재 |
| agent limits | `max_depth = 1`, `max_threads <= 4` |
| no shadowing | built-in `worker`, `explorer`, `default` 이름을 custom agent가 덮어쓰지 않음 |
| skill routing | global AGENTS의 skill 이름이 실제 skill과 일치 |
| eval freshness | `~/.codex/eval-runs/advisor-worker/reports`에 최근 pilot report 또는 명시적 미실행 상태가 있음 |

현재 health-check의 stale hook hash 15건은 별도 warning으로 유지한다. Advisor/Worker 기능 검증 결과와 섞어 자동 수리하지 않는다.

## 11. 관측 보고 예시

```text
ADVISOR/WORKER RUN
- task_id: GT-03-C1-01
- parent_thread_id: <id>
- agent_thread_ids: [<id>]
- main: gpt-5.6-terra / medium
- workers: implementation_worker x1
- service_tier: priority
- tokens: { input: <n>, cached_input: <n>, output: <n> }
- cached_ratio: <value>
- credits_source: observed | derived | aggregate-only | unavailable
- rate_card_retrieved_at: <timestamp>
- total_credits: <value>
- wall_time_seconds: <value>
- repair_loops: 0
- scope_violations: 0
- advisor_verification: complete
- result: PASS
```

원시 대화 전체를 수집하지 않는다. 역할, 모델, effort, 개수, 검증 결과, credits, 시간처럼 운영 판단에 필요한 최소 메타데이터만 기록한다.
