# Evidence Matrix

| Evidence ID | 사실 | 적용 문서 |
| --- | --- | --- |
| PROD-01 | 하나의 기획 패키지에서 결정과 범위를 확인한다. | 02-scope.md |
| PROD-02 | Pilot 산출물은 정확히 5개 문서이고 코드 구현은 Non-Goal이다. | 02-scope.md |
| REQ-01 | material claim은 evidence ID로 추적한다. | 02-scope.md |
| REQ-02 | 문서 간 상대 링크는 유효해야 한다. | 02-scope.md |
| ARCH-01 | Option A는 Big-Bang rollout이고 복구 범위가 넓다. | 01-decision.md |
| ARCH-02 | Option B는 3단계 rollout이며 Gate별 중단과 rollback이 가능하다. | 01-decision.md, 05-rollout.md |
| DEC-01 | 복구 가능성과 범위 통제를 위해 Option B를 선택한다. | 01-decision.md |
| CON-01 | production write, global configuration 변경, source code 수정은 금지한다. | 02-scope.md |
| RISK-01 | stale evidence 혼입은 manifest와 coverage 검증으로 대응한다. | 04-risk-register.md |
| RISK-02 | output 밖 수정은 allowed path와 pre/post hash 비교로 대응한다. | 04-risk-register.md |
| GATE-01 | evidence coverage와 source hash를 검증한다. | 05-rollout.md |
| GATE-02 | 다섯 문서와 내부 링크를 검증한다. | 05-rollout.md |
| GATE-03 | Advisor가 사실, 추론, scope를 독립 검증한다. | 05-rollout.md |

위 표는 13개 evidence ID를 각각 한 번 이상 연결한다. 위험 통제는 [04-risk-register.md](./04-risk-register.md)에서 확인한다.
