# DEC-01 — Option B 채택 결정

## 결정

`DEC-01`: 이번 Pilot은 **Option B**, 즉 세 단계로 나누어 진행하는 phased rollout을 채택한다. 이 선택은 복구 가능성과 범위 통제를 위한 고정 결정이다. [DEC-01]

## 근거와 trade-off

- Option A는 Big-Bang rollout이며 복구 범위가 넓다. [ARCH-01]
- Option B는 세 단계 rollout으로, 각 Gate에서 중단과 rollback이 가능하다. [ARCH-02]
- 따라서 **권고(Recommendation)**: Pilot에서는 Option B를 사용한다. 이는 Option A의 한 번에 진행하는 방식보다 단계별 확인과 되돌리기를 우선하는 선택이라는 **추론(Inference)** 이다. [ARCH-01] [ARCH-02] [DEC-01]

## 범위 연결

결정의 산출물과 제한은 [02-scope.md](./02-scope.md)에서 확인한다.
