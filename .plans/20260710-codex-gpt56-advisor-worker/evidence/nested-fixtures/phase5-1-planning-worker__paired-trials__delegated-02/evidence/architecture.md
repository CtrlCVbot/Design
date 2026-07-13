# Architecture Evidence

- `ARCH-01`: Option A는 Big-Bang rollout이며 복구 범위가 넓다.
- `ARCH-02`: Option B는 3단계 phased rollout이며 각 Gate에서 중단과 rollback이 가능하다.
- `DEC-01`: 복구 가능성과 범위 통제를 위해 Option B를 선택한다.
- `CON-01`: production write, global configuration 변경, source code 수정은 금지한다.
