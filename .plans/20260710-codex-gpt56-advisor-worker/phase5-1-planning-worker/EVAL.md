# planning_worker Capability Eval

## Capability

`planning_worker`가 고정된 대형 기획 fixture에서 3개 evidence stream을 근거로 5개 문서를 작성하고, 범위·모델·시간·사용량 계약을 지킨다.

## Pre-implementation Gates

- health-check가 `planning_worker = gpt-5.6-terra/medium` 누락 또는 drift를 FAIL 처리한다.
- fresh child rollout에서 실제 model/effort가 Terra/medium이다.
- agent/config/prompt/fixture hash가 smoke와 capability run 사이에 변하지 않는다.
- user-approved explicit Pilot에서만 spawn하며 자동 docs routing은 변경하지 않는다.

## Capability Run

- Worker 1개, fresh spawn 1회, `fork_context=false`.
- `wait_agent(timeout_ms=600000)` 1회.
- timeout이면 `close_agent`로 종료하고 capability를 FAIL 처리한다.
- resume, follow-up, repair, retry는 0회다.
- write scope는 `fixture/output/*.md` 5개로 제한한다.

## Deterministic Grader

- output 문서 정확히 5개.
- 필수 evidence ID와 내부 링크 coverage 100%.
- 선택된 전략, risk, rollout 단계가 source evidence와 일치.
- output 외 fixture와 global files drift 0.

## Usage Formula

- `worker_total_tokens = input_tokens + output_tokens`; cached input은 input에 포함되므로 별도 가산하지 않는다.
- `orchestration_total_tokens = parent_total_tokens + worker_total_tokens`.
- capability ceiling은 `worker_total_tokens <= 300000`.
- 비용 절감 판정은 하지 않으며 `credits_source=unavailable`을 유지한다.

## Capability Success

- first attempt grader PASS.
- scope violation, prohibited action, timeout, model drift가 모두 0.
- Advisor 독립 검증 PASS.

Capability 1회 PASS는 기능 가능성만 의미한다. 자동 라우팅 승격은 동일 fixture의 direct/delegated paired trial을 각 3회 수행한 뒤 별도 승인한다.
