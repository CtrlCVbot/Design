# planning_worker Direct/Delegated Paired Eval

## 고정 조건

- seed: `20260710`
- 실행 순서: `direct-01`, `delegated-02`, `delegated-03`, `direct-03`, `direct-02`, `delegated-01`
- 모든 run은 byte-identical evidence, brief, verifier와 fresh output directory를 사용한다.
- parent 기본값은 `gpt-5.6-terra/medium`; delegated child는 `planning_worker gpt-5.6-terra/medium`이다.
- service tier, sandbox, prompt contract와 grader를 고정한다.
- 실패 run도 삭제하거나 재시도하지 않는다.

## Token과 시간

- direct total = parent input + output.
- delegated Worker total = child input + output.
- delegated orchestration total = parent total + child total.
- cached input은 input에 포함되므로 별도 가산하지 않는다.
- direct run ceiling: 300,000 tokens.
- delegated Worker ceiling: 300,000 tokens.
- delegated orchestration ceiling: 450,000 tokens.

## 품질 Gate

- direct와 delegated 모두 deterministic grader `pass^3 = 100%`.
- 모든 run에서 file count 5, errors 0, scope violation 0.
- delegated run은 model drift, timeout, resume, follow-up, retry, repair 0.

## 자동 라우팅 승격 Gate

- delegated 품질이 direct보다 낮지 않아야 한다.
- delegated median wall time이 direct보다 10% 이상 빠르거나, delegated median orchestration tokens가 direct median 이하이어야 한다.
- 개선되지 않은 다른 지표는 direct median의 150% 이하여야 한다.
- 하나라도 실패하면 planning_worker는 explicit opt-in으로 유지하고 docs-only 자동 라우팅을 활성화하지 않는다.

`credits_source=unavailable`이므로 비용 절감은 판정하지 않는다.
