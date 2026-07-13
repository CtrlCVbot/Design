# Risk Register

| Risk | 설명 | 완화 조치 |
| --- | --- | --- |
| RISK-01 | stale evidence가 결정 근거에 섞일 수 있다. [RISK-01] | 입력 **manifest**를 유지하고 evidence ID coverage를 검증한다. [RISK-01] |
| RISK-02 | Worker가 planning output 밖을 수정할 수 있다. [RISK-02] | allowed path를 제한하고 작업 전후의 **pre/post hash**를 비교한다. [RISK-02] |

**권고(Recommendation)**: manifest, evidence ID coverage, pre/post hash 비교를 Gate의 확인 자료로 사용한다. 이는 각 위험에 명시된 대응을 rollout 검증으로 연결하는 **추론(Inference)** 이다. [RISK-01] [RISK-02]

Gate별 실행 순서는 [05-rollout.md](./05-rollout.md)에서 확인한다.
