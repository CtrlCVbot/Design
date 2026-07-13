# DEC-01: Option B 선택

## 결정

`DEC-01`에 따라 Option B, 즉 되돌릴 수 있는 3단계 phased rollout을 선택한다. 이 선택은 복구 가능성과 범위 통제를 위한 고정 결정이다. [DEC-01]

## 근거와 trade-off

Option A는 Big-Bang rollout이므로 복구 범위가 넓다. [ARCH-01] 반대로 Option B는 각 Gate에서 중단 및 rollback이 가능하다. [ARCH-02] 따라서 **추천**은 Option B이며, 단계별 검증을 거쳐야 한다는 운영 부담을 감수하는 대신 영향 범위를 통제한다는 trade-off가 있다. 이 trade-off는 ARCH-01과 ARCH-02에서 도출한 추론이다.

## 다음 문서

범위와 요구사항은 [02-scope.md](./02-scope.md)에서 확인한다.
