# Option B Rollout Gates

## 단계별 Gate

1. `GATE-01`: evidence coverage와 source hash를 검증한다. [GATE-01]
2. `GATE-02`: 정확히 5개 문서와 내부 링크를 검증한다. [GATE-02]
3. `GATE-03`: Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03]

## 중단과 rollback

Option B는 각 Gate에서 중단과 rollback이 가능하다. [ARCH-02]

- **rollback 조건:** 어느 Gate라도 해당 검증을 충족하지 못하면 다음 Gate로 진행하지 않고 중단 또는 rollback한다. 이는 Gate별 중단과 rollback이 가능한 Option B 특성을 적용한 **추론**이다. [ARCH-02] [GATE-01] [GATE-02] [GATE-03]

## 다음 연결

선택 근거는 [01-decision.md](./01-decision.md)에서 다시 확인한다.
