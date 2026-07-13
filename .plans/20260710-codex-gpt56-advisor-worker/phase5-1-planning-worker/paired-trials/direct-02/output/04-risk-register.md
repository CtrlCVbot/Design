# Risk Register

| Risk | 위험 설명 | 완화책 |
|---|---|---|
| RISK-01 | stale evidence가 결정 근거에 섞일 수 있다. | 입력 manifest와 evidence ID coverage를 검증한다. [RISK-01] |
| RISK-02 | Worker가 planning output 밖을 수정할 수 있다. | allowed path를 제한하고 pre/post hash 비교를 수행한다. [RISK-02] |

입력 manifest 검증과 pre/post hash 비교는 각각 근거의 신선도 및 허용 경로 밖 변경을 확인하는 완화책이다. [RISK-01] [RISK-02]

## 다음 문서

Gate 순서와 rollback 조건은 [05-rollout.md](./05-rollout.md)에서 확인한다.
