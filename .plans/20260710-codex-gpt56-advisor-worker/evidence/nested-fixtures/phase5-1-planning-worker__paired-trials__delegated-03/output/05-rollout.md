# Option B Rollout

`DEC-01`에 따라 Option B의 세 단계를 다음 Gate로 운영한다. [DEC-01] [ARCH-02]

1. `GATE-01`: evidence coverage와 source hash를 검증한다. [GATE-01]
2. `GATE-02`: 정확히 다섯 문서와 내부 링크를 검증한다. [GATE-02]
3. `GATE-03`: Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03]

## 중단 및 rollback 조건

**추론(Inference)**: 어느 Gate에서든 해당 검증이 충족되지 않으면 다음 단계로 진행하지 않고 이전 확인 상태로 rollback한다. 이 조건은 Option B가 각 Gate에서 중단과 rollback을 허용한다는 사실을 실행 규칙으로 적용한 것이다. [ARCH-02]

결정 근거는 [01-decision.md](./01-decision.md)에서 다시 확인한다.
