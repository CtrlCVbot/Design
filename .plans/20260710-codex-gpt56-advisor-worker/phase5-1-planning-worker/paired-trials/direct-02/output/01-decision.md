# DEC-01 결정

## 고정 결정

**DEC-01: Option B를 선택한다.** Option B는 세 단계의 phased rollout이며, 각 Gate에서 중단 및 rollback이 가능하다. [ARCH-02] 이는 복구 가능성과 범위 통제를 우선하는 결정이다. [DEC-01]

## 근거와 trade-off

Option A는 Big-Bang rollout으로 복구 범위가 넓다. [ARCH-01] 반면 Option B는 단계별 Gate에서 중단과 rollback을 할 수 있다. [ARCH-02] 따라서 이 Pilot에서는 Option B의 단계적 진행을 권고한다. 이는 Option A보다 즉시 전체 전환을 택하지 않는 trade-off이지만, 근거 검증과 범위 통제를 반복할 수 있게 한다는 추론이다. [DEC-01]

## 다음 문서

범위와 요구사항은 [02-scope.md](./02-scope.md)에서 확인한다.
