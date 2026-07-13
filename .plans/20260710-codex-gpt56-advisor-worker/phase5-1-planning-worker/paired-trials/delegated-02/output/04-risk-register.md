# Risk Register

| 위험 | 설명 | 완화 통제 |
| --- | --- | --- |
| RISK-01 | stale evidence가 결정 근거에 섞일 수 있다. [RISK-01] | 입력 manifest와 evidence ID coverage를 검증한다. [RISK-01] |
| RISK-02 | Worker가 planning output 밖을 수정할 수 있다. [RISK-02] | allowed path를 적용하고 pre/post hash를 비교한다. [RISK-02] |

## 통제 적용

- `manifest`: 입력 근거의 식별과 coverage 검증에 사용한다. [RISK-01]
- `pre/post hash`: 허용된 planning output 경계를 벗어난 수정 여부 확인에 사용한다. [RISK-02]

## 다음 연결

위 통제를 통과하는 순서는 [05-rollout.md](./05-rollout.md)에서 확인한다.
