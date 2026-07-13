# Evidence Matrix

| Evidence ID | 적용된 기획 항목 | 근거 요약 |
| --- | --- | --- |
| PROD-01 | 단일 기획 패키지 | 운영자가 결정과 범위를 한 곳에서 확인한다. [PROD-01] |
| PROD-02 | 산출물 범위 | Pilot은 정확히 5개 문서이고 코드 구현은 Non-Goal이다. [PROD-02] |
| REQ-01 | claim 추적 | 모든 material claim을 evidence ID로 추적한다. [REQ-01] |
| REQ-02 | 문서 연결 | 문서 간 상대 링크가 유효해야 한다. [REQ-02] |
| ARCH-01 | Option A 비교 | Big-Bang rollout은 복구 범위가 넓다. [ARCH-01] |
| ARCH-02 | Option B 방식 | 3단계 phased rollout은 Gate별 중단과 rollback을 허용한다. [ARCH-02] |
| DEC-01 | 고정 결정 | 복구 가능성과 범위 통제를 위해 Option B를 선택한다. [DEC-01] |
| CON-01 | 작업 제약 | production write, global configuration 변경, source code 수정은 금지다. [CON-01] |
| RISK-01 | 증거 신선성 위험 | 입력 manifest와 evidence ID coverage 검증으로 대응한다. [RISK-01] |
| RISK-02 | 출력 경계 위험 | allowed path와 pre/post hash 비교로 대응한다. [RISK-02] |
| GATE-01 | 초기 검증 Gate | evidence coverage와 source hash를 검증한다. [GATE-01] |
| GATE-02 | 문서 검증 Gate | 5개 문서와 내부 링크를 검증한다. [GATE-02] |
| GATE-03 | 독립 검증 Gate | Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03] |

## 다음 연결

위 위험의 통제 방식은 [04-risk-register.md](./04-risk-register.md)에서 확인한다.
