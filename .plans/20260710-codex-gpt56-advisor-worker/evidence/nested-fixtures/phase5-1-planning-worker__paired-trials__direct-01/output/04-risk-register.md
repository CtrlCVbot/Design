# Risk Register

| 위험 | 영향 | 완화 |
|---|---|---|
| RISK-01 | stale evidence가 결정 근거에 섞일 수 있다. | 입력 manifest와 evidence ID coverage를 검증한다. [RISK-01] |
| RISK-02 | Worker가 planning output 밖을 수정할 수 있다. | allowed path를 제한하고 pre/post hash 비교를 수행한다. [RISK-02] |

## 검증 기록 원칙

입력 manifest는 검증 대상의 기준점을 제공하며, pre/post hash 비교는 허용 범위 밖 변경 여부를 확인하는 완화책이다. 이 문장은 RISK-01 및 RISK-02의 대응을 요약한 것이다.

## 연결

단계별 검증과 rollback 조건은 [05-rollout.md](./05-rollout.md)에서 확인한다.
