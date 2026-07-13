# Option B Rollout

Option B는 각 Gate에서 중단과 rollback이 가능한 3단계 phased rollout이다. [ARCH-02] 결정 근거는 [01-decision.md](./01-decision.md)에서 확인한다.

## Gate

1. `GATE-01`: evidence coverage와 source hash를 검증한다. [GATE-01]
2. `GATE-02`: 정확히 5개 문서와 내부 링크를 검증한다. [GATE-02]
3. `GATE-03`: Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03]

## Rollback 조건

각 Gate에서 요구한 검증을 통과하지 못하면 다음 단계로 진행하지 않고 중단 및 rollback한다. Gate별 중단과 rollback 가능성은 Option B의 특성이다. [ARCH-02] 이 조건은 제공된 Gate 검증 항목을 rollout 통제에 적용한 추론이다. [GATE-01] [GATE-02] [GATE-03]
