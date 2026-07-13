# DEC-01 결정

## 결정

`DEC-01`: Option B를 선택한다. Option B는 각 Gate에서 중단과 rollback이 가능한 3단계 phased rollout이다. [ARCH-02] 이 선택은 복구 가능성과 범위 통제를 위한 것이다. [DEC-01]

## 근거와 trade-off

- Option A는 Big-Bang rollout이며 복구 범위가 넓다. [ARCH-01]
- Option B는 단계별 Gate에서 중단과 rollback을 할 수 있어, 위 복구 범위 위험을 줄이는 방향이다. [ARCH-02]
- **추론:** 따라서 Option B는 Option A보다 단계적 확인과 되돌림을 우선하는 선택이다. 이는 `DEC-01`의 복구 가능성 및 범위 통제 목표에 부합한다. [ARCH-01] [ARCH-02] [DEC-01]

## 다음 연결

결정이 허용하는 범위와 산출물 계약은 [02-scope.md](./02-scope.md)에서 확인한다.
