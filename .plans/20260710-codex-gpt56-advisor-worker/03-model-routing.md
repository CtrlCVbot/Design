# 03. GPT-5.6 모델·추론 라우팅 정책

## 1. 원칙

`Advisor`와 `Worker`는 역할이며 특정 모델 이름이 아니다. 일상 작업은 Terra로 운영하고, 판단 난이도나 실패 비용이 높을 때만 Sol로 승격한다. Luna는 완료 기준이 명확하고 반복 가능한 작업에만 사용한다.

항상 가장 높은 reasoning effort를 쓰지 않는다. 필요한 품질을 내는 가장 낮은 effort에서 시작하고, 검증 실패나 불확실성이 있을 때 한 단계씩 올린다.

## 2. 역할별 기본값

| 역할/상황 | 모델 | Effort | 사용 조건 | 금지/주의 |
|---|---|---|---|---|
| 일상 Advisor | `gpt-5.6-terra` | `medium` | 명확한 기능, 일반 분석, 보통 난이도 | 습관적 `high` 승격 금지 |
| 복잡한 Advisor | `gpt-5.6-sol` | `high` | 모호한 요구, 아키텍처 trade-off, high-risk, 반복 실패 | 일상 기본값으로 고정하지 않음 |
| 일반 구현 Worker | `gpt-5.6-terra` | `medium` | 코드·테스트 작성, 다중 단계 구현 | brief 없이 시작 금지 |
| 반복 구현 Worker | `gpt-5.6-luna` | `medium` | Terra 검증 루프 안정화 후 명확한 변환, 반복 수정, 정형 테스트 추가 | 설계 판단·모호한 디버깅 금지 |
| 탐색 Worker | built-in `explorer` | 자동 또는 Terra low | 읽기 중심 탐색, 파일 맵, 로그 분석 | 쓰기 작업으로 확대 금지 |
| 고위험 2차 review | `gpt-5.6-sol` | `high` | 보안·데이터 손상·큰 migration의 선택적 second opinion | Advisor 독립 검증을 대체하지 않음 |

## 3. Effort 승격 사다리

| 단계 | 설정 | 적용 기준 | 다음 승격 조건 |
|---:|---|---|---|
| E0 | Luna `medium` | 단순·반복·정형 작업의 MVP 기본 | 완료 기준 해석 실패 또는 repair 1회 |
| E1 | Terra `medium` | 기본 Advisor/Worker | 설계 ambiguity, 테스트 실패 원인 불명, 다중 trade-off |
| E2 | Sol `high` | 복잡한 설계·고위험 판단 | 두 번의 repair 실패 또는 단일 문제의 깊은 추론 필요 |
| E3 | Sol `xhigh`/`Max` | 가장 어려운 단일 문제 | 사용자가 시간·사용량보다 깊이를 우선하거나 E2 실패 |
| E4 | Sol `Ultra` | 3개 이상 의미 있는 독립 lane | 단일 문제에는 사용하지 않음 |

`Max`는 한 agent가 더 깊게 생각하는 선택이고, `Ultra`는 subagent로 작업을 분할하는 선택이다. 깊은 단일 문제에 Ultra를 사용하거나, 병렬 가능한 큰 작업에 Max만 사용하는 식으로 목적을 뒤집지 않는다.

Luna `low`는 MVP의 동일 agent에 가변값으로 남기지 않는다. Luna/medium이 GT-04에서 `pass^3 = 100%`를 달성한 뒤 별도 `routine_worker_low` 후보로만 평가한다.

## 4. 라우팅 결정표

| 작업 특성 | 추천 조합 | 이유 |
|---|---|---|
| 오탈자, 1~2줄 수정 | Advisor 직접, Terra medium | 위임 오버헤드가 큼 |
| 명확한 단일 기능 | Terra medium Advisor + Terra medium Worker | 품질·비용 균형 |
| 반복 파일 변환 | Terra medium Advisor + Luna medium Worker | 완료 기준이 정형적 |
| 코드베이스 탐색 + 구현 | built-in explorer 병렬 + Terra Worker 직렬 | 탐색 noise 분리, 쓰기 충돌 방지 |
| 아키텍처 변경 | Sol high Advisor + Terra medium Worker | 판단은 Sol, 구현은 Terra |
| security/auth/data-loss | Sol high Advisor + Terra Worker + 선택적 Sol reviewer | 실패 비용이 높음 |
| 3개 이상 독립 모듈 구현 | Sol/Terra Advisor + 최대 3 Worker | 경로 소유권이 분리될 때만 병렬 |
| 대형 독립 분석 | Sol Ultra 후보 | 자동 subagent가 속도 이득을 줄 수 있음 |
| 한 문제에서 반복 실패 | Sol high 또는 Max | fan-out보다 깊은 추론이 필요 |

## 5. 사용량 보호 장치

### Runtime 제안 설정

```toml
[agents]
max_threads = 4
max_depth = 1
job_max_runtime_seconds = 1200
interrupt_message = true
```

- `max_threads = 4`는 Codex가 동시에 열 수 있는 agent thread의 runtime 자원 상한이다.
- `max_depth = 1`로 Worker의 재위임을 막는다.
- `job_max_runtime_seconds = 1200`은 `spawn_agents_on_csv` worker의 기본 timeout이다. 일반 subagent에는 적용된다고 가정하지 않고, Advisor가 장기 무응답 agent를 stop/close한다.
- 같은 task를 여러 Worker에게 중복 배정하는 경쟁 방식은 기본 금지한다. 품질 eval의 `pass@k` 실험에서만 허용한다.

### Orchestration soft policy

- 한 turn의 Worker spawn 요청은 최대 3개로 제한한다.
- 이 값은 `max_threads = 4`가 기계적으로 보장하는 값이 아니다. orchestration skill이 적용하고 run log의 `worker_count`로 검증한다.
- smoke에서 실제 thread 계산 방식이 확인되기 전에는 `max_threads = 3`을 hard cap처럼 해석하지 않는다.
- soft policy 위반이 반복되면 후속 단계에서 hook이 아닌 더 작은 `max_threads` 또는 전용 실행 wrapper를 별도 설계한다.

### `priority`와 fast mode

현재 `service_tier = "priority"`는 사용량 체감의 잠재 변수다. 그러나 Codex credits의 정확한 영향은 계정·제품 정책과 연결되므로, 역할 분담 구현과 동시에 추정으로 변경하지 않는다.

Pilot은 다음 순서로 분리 측정한다.

1. 현재 `gpt-5.5/xhigh/priority` 기준선.
2. `gpt-5.6-terra/medium`으로 모델과 effort만 변경.
3. Advisor/Worker 라우팅 추가.
4. 필요할 때만 service tier를 별도 변수로 비교.

## 6. GPT-5.6 access preflight

GPT-5.6은 현재 제한 preview이므로 Phase 0에서 아래 access matrix를 먼저 만든다.

| 모델 | 필요한 effort | Codex app | CLI read-only smoke | 결과 |
|---|---|---|---|---|
| `gpt-5.6-sol` | `high` | 확인 | CLI 사용 가능 시 확인 | available/unavailable/error |
| `gpt-5.6-terra` | `medium` | 확인 | CLI 사용 가능 시 확인 | available/unavailable/error |
| `gpt-5.6-luna` | `medium` | 확인 | CLI 사용 가능 시 확인 | available/unavailable/error |

- smoke는 빈 fixture에서 파일을 수정하지 않는 고정 응답 task로 실행한다.
- app과 CLI 중 실제 사용할 surface의 접근이 확인되어야 해당 모델 agent를 만든다.
- 모델은 보이지만 effort가 지원되지 않으면 agent 파일을 작성하지 않고 지원값을 다시 결정한다.
- Terra 접근이 없으면 기본 모델 전환을 중단하고 `gpt-5.5`에 역할·brief·검증 계약만 적용한다.

## 7. Ultra 정책

Ultra는 다음 조건을 모두 만족할 때만 사용한다.

- 작업이 3개 이상의 의미 있는 독립 lane으로 분해된다.
- 각 lane의 완료 기준이 명확하다.
- 쓰기 작업이면 파일 경로 또는 worktree가 분리된다.
- 추가 credits보다 시간 단축이나 품질 향상이 더 중요하다.
- 사용자에게 Ultra 사용 이유를 짧게 알린다.

다음에는 Ultra를 사용하지 않는다.

- 단일 버그 원인 분석.
- 같은 파일에 집중되는 리팩토링.
- 1~2개 파일의 작은 구현.
- 단순 문서 정리.
- 이미 수동 Worker fan-out을 시작한 task.

## 8. Fallback

| 실패 상황 | Fallback |
|---|---|
| GPT-5.6 모델 미노출 | 기존 `gpt-5.5`를 유지하고 역할·brief·검증 계약만 적용 |
| custom agent schema 오류 | built-in `worker`에 동일 brief를 직접 전달 |
| Luna/medium 품질 부족 | 해당 task class를 Terra medium으로 승격 |
| Terra repair 2회 실패 | Advisor를 Sol high로 승격하고 설계를 재확인 |
| 일반 subagent 장기 무응답 | Advisor가 상태를 확인한 뒤 stop/close하고 더 작은 brief로 재위임 |
| 병렬 충돌 발생 | 즉시 직렬 실행으로 전환하고 경로 소유권 규칙 보강 |
| credits 증가 | fan-out, effort, service tier 순으로 원인을 분리 측정 |
