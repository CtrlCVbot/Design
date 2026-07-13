# 대형 기획용 planning_worker Pilot

> 우선순위: **Phase 5 제한 출시 직후의 첫 기능 pilot**<br>
> 상태: **Capability·timeout·품질 PASS, 효율 Gate FAIL로 자동 라우팅 REJECT, explicit opt-in 유지**

## 최종 Pilot 판정

- Direct와 delegated 모두 `pass^3=100%`다.
- Delegated 중앙값은 direct 대비 total token `174.37%`, 시간 `152.92%`다.
- 자동 docs routing은 활성화하지 않는다.
- `planning_worker`는 사용자가 명시적으로 승인한 대형 기획에서만 opt-in으로 사용한다.

## 왜 다음 단계인가

mm-broker 문서 작업은 docs-only 정책 때문에 main 세션이 직접 수행했다. 대형 기획 문서도 무조건 위임하면 context 중복과 사용량 급증 위험이 있다. 실제 GT-04 v2.3의 Implementation + repair Worker 누적 사용량은 `3,413,501 tokens`였으므로 별도 role보다 usage guard가 먼저 필요하다.

## 대상

다음 필수 조건을 모두 만족하는 대형 기획 작업만 후보로 한다.

- 수정 대상 문서 5개 이상
- 독립 evidence stream 3개 이상
- reference code/design inventory와 문서 패키지 개편을 함께 수행
- 격리 planning directory와 Advisor 검증 명령을 brief로 고정 가능

review-only, 단일 문서 수정, 짧은 문구 정리는 계속 direct route다.

## Pilot 순서

1. `planning_worker`를 `gpt-5.6-terra/medium` custom agent로 등록하고 health-check 필수 route로 검증한다.
2. agent/config/prompt/fixture SHA-256 manifest를 고정한다.
3. read-only no-op fresh smoke에서 child rollout의 실제 `model`과 `effort`를 확인한다.
4. 대형 기획 capability fixture 1건만 격리 실행한다.
5. Worker는 초안, evidence matrix, 기계 검증만 담당하고 최종 판단과 승인에는 관여하지 않는다.
6. Advisor가 변경 범위, 근거 정확도, 문서 링크와 acceptance를 독립 검증한다.

## Usage Guard

- turn당 `planning_worker` 1개만 허용
- fresh spawn 1회, resume·follow-up·repair 자동 반복 금지
- `wait_agent(timeout_ms=600000)` 1회만 허용하고 timeout이면 `close_agent`로 종료
- 첫 pilot `worker_total_tokens = input_tokens + output_tokens` ceiling `300,000`; cached input은 input에 포함하므로 별도 가산하지 않음
- `orchestration_total_tokens = parent_total_tokens + worker_total_tokens`를 별도 기록
- 실제 child rollout에서 model/effort가 Terra/medium이 아니면 즉시 FAIL
- `credits_source=unavailable`인 동안 비용 절감 판정 금지
- output은 승인된 planning directory로 한정하며 코드·global config·commit·push·PR을 금지

runtime이 실행 중 token hard cap을 직접 제공하지 않으므로 `1회 spawn + no resume + 10분 timeout + timeout close`를 선제 guard로 사용하고 종료 후 rollout token을 ceiling과 대조한다.

## Capability 성공 조건

- 요구 문서와 evidence coverage 100%
- 사실 오류와 scope violation 0건
- Advisor 독립 검증 PASS
- Worker 사용량 300,000 tokens 이하
- first-attempt deterministic grader PASS

Capability 1회 PASS는 기능 가능성만 의미한다.

## 자동 라우팅 승격 조건

- 같은 fixture, prompt, 권한과 grader로 direct/delegated paired trial을 각각 3회 수행
- 실행 순서를 무작위화하고 실패 trial도 보존
- delegated 결과의 품질이 direct보다 낮지 않음
- 시간 또는 총 token 중 하나가 개선되고 다른 하나의 허용 범위는 비교 EVAL에서 사전 고정
- 3회 모두 scope violation, timeout, model drift 0

사용자가 명시적으로 승인한 Pilot에서만 `planning_worker`를 spawn한다. 자동 라우팅 승격 전에는 전역 `AGENTS.md`의 docs-only 제외 규칙을 변경하지 않는다.
