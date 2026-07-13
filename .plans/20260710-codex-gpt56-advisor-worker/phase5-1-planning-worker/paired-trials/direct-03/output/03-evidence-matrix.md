# Evidence Matrix

| Evidence ID | 계획 내 적용 |
|---|---|
| PROD-01 | 단일 기획 패키지에서 결정과 범위 확인 |
| PROD-02 | 정확히 5개 문서, 코드 구현 Non-Goal |
| REQ-01 | material claim의 evidence ID 추적 |
| REQ-02 | 상대 링크 유효성 |
| ARCH-01 | Option A Big-Bang rollout과 넓은 복구 범위 |
| ARCH-02 | Option B의 3단계 phased rollout 및 Gate별 중단/rollback |
| DEC-01 | Option B 선택 |
| CON-01 | production write, global configuration, source code 수정 금지 |
| RISK-01 | stale evidence 방지: manifest 및 evidence ID coverage 검증 |
| RISK-02 | planning output 밖 수정 방지: allowed path 및 pre/post hash 비교 |
| GATE-01 | evidence coverage와 source hash 검증 |
| GATE-02 | 5개 문서와 내부 링크 검증 |
| GATE-03 | Advisor의 사실·추론·scope 독립 검증 |

위 표는 제공된 13개 evidence ID의 매핑이다. 위험과 완화책은 [04-risk-register.md](./04-risk-register.md)에서 확인한다.
