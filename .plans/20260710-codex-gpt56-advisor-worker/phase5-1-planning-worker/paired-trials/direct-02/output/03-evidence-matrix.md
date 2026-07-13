# Evidence Matrix

| Evidence ID | 확인된 내용 | 적용 문서 |
|---|---|---|
| PROD-01 | 하나의 기획 패키지에서 결정과 범위 확인 | 02-scope.md |
| PROD-02 | 정확히 5개 문서, 코드 구현 Non-Goal | 02-scope.md |
| REQ-01 | material claim의 evidence ID 추적 | 02-scope.md |
| REQ-02 | 문서 간 상대 링크 유효 | 02-scope.md |
| ARCH-01 | Option A는 Big-Bang이며 복구 범위가 넓음 | 01-decision.md |
| ARCH-02 | Option B는 3단계 phased rollout, Gate별 중단·rollback 가능 | 01-decision.md |
| DEC-01 | 복구 가능성과 범위 통제를 위해 Option B 선택 | 01-decision.md |
| CON-01 | production write, global configuration, source code 수정 금지 | 02-scope.md |
| RISK-01 | stale evidence 혼입 위험 | 04-risk-register.md |
| RISK-02 | output 밖 수정 위험 | 04-risk-register.md |
| GATE-01 | evidence coverage와 source hash 검증 | 05-rollout.md |
| GATE-02 | 5개 문서와 내부 링크 검증 | 05-rollout.md |
| GATE-03 | Advisor의 사실·추론·scope 독립 검증 | 05-rollout.md |

위 표는 제공된 13개 evidence ID를 모두 매핑한 것이다.

## 다음 문서

위험과 완화책은 [04-risk-register.md](./04-risk-register.md)에서 확인한다.
