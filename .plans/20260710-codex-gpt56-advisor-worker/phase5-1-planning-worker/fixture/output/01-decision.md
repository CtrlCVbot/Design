# Decision: reversible phased rollout

## DEC-01

**Decision:** Select **Option B**, the three-stage phased rollout. This is the fixed decision in `DEC-01`.

## Evidence-backed trade-off

Option A is a Big-Bang rollout and has a broad recovery scope. `[ARCH-01]` Option B is a three-stage phased rollout that permits stopping and rollback at each gate. `[ARCH-02]` The decision selects Option B to preserve recoverability and control scope. `[DEC-01]`

**Recommendation:** Use the gated Option B path as the rollout plan because it implements the fixed decision while retaining the stated stop and rollback capability. `[ARCH-02] [DEC-01]`

The decision boundaries are defined in [02-scope.md](./02-scope.md).
