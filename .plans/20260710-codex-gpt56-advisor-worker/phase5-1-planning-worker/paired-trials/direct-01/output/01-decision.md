# DEC-01 결정: Option B

## 결정

`DEC-01`에 따라 이번 Pilot은 **Option B**, 즉 세 단계 phased rollout을 채택한다. 이는 복구 가능성과 범위 통제를 우선하는 선택이다. [DEC-01]

## 근거와 trade-off

- Option A는 Big-Bang rollout이므로 복구 범위가 넓다. [ARCH-01]
- Option B는 각 Gate에서 중단 및 rollback이 가능한 세 단계 rollout이다. [ARCH-02]
- 따라서 권고안은 Option B이다. 이는 단계별 검증으로 중단 지점을 제공하지만, Gate별 확인이 필요한 trade-off가 있다. 이 trade-off 평가는 ARCH-01 및 ARCH-02에 근거한 추론이다.

## 연결

범위와 요구사항은 [02-scope.md](./02-scope.md)에서 확인한다.
