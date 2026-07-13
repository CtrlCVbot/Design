# Risk Register

| 위험 | 영향 | 완화책 |
|---|---|---|
| RISK-01: stale evidence가 결정 근거에 섞일 수 있음 | 결정 근거의 신뢰성 저하 | 입력 manifest와 evidence ID coverage를 검증한다. [RISK-01] |
| RISK-02: Worker가 planning output 밖을 수정할 수 있음 | 허용 범위 이탈 | allowed path를 적용하고 pre/post hash 비교로 변경 범위를 확인한다. [RISK-02] |

## 검증 통제

manifest는 입력 기준을 고정하는 완화 수단이며, pre/post hash 비교는 허용된 output 외 변경 여부를 확인하는 완화 수단이다. 이는 RISK-01 및 RISK-02의 대응을 계획 문서에 적용한 것이다. [RISK-01] [RISK-02]

## 다음 문서

단계별 Gate와 rollback 조건은 [05-rollout.md](./05-rollout.md)에서 확인한다.
