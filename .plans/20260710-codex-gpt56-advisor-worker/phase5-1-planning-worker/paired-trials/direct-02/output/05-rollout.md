# Three-Stage Rollout

## Gate 순서

1. **GATE-01**: evidence coverage와 source hash를 검증한다. [GATE-01]
2. **GATE-02**: 5개 문서와 내부 링크를 검증한다. [GATE-02]
3. **GATE-03**: Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03]

## rollback 조건

각 Gate에서 요구된 검증이 충족되지 않으면 진행을 중단하고 이전 검증 가능한 단계로 rollback한다. 이는 Gate별 중단과 rollback이 가능한 Option B의 운영 방식에 대한 추론이다. [ARCH-02]

## 결정 연결

고정 결정과 trade-off는 [01-decision.md](./01-decision.md)에서 확인한다.
