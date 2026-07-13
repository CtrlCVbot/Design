# Option B Rollout

## 단계와 Gate

1. **GATE-01**: evidence coverage와 source hash를 검증한다. [GATE-01]
2. **GATE-02**: 5개 문서와 내부 링크를 검증한다. [GATE-02]
3. **GATE-03**: Advisor가 사실, 추론, scope를 독립 검증한다. [GATE-03]

## Rollback 조건

각 Gate에서 검증을 통과하지 못하면 rollout을 중단하고 rollback한다. 이는 Option B가 각 Gate에서 중단과 rollback을 지원한다는 사실에 근거한 적용 조건이다. [ARCH-02]

## 연결

선택 근거는 [01-decision.md](./01-decision.md)에서 확인한다.
