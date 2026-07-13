# DEC-01: reversible phased rollout decision

## Decision

Choose **Option B**, a reversible three-stage phased rollout. This is the fixed
architecture decision in `DEC-01` and is consistent with `ARCH-02`.

## Evidence-backed trade-off

Option A is a big-bang rollout with a wider recovery scope (`ARCH-01`). Option
B permits a stop and rollback at each gate (`ARCH-02`), so it provides the
reversibility and scope control required by `DEC-01`.

## Recommendation

Proceed with Option B only through the defined gates; do not treat this
planning package as authorization for implementation or production activity.

## Linked scope

The product scope and constraints are defined in [02-scope.md](./02-scope.md).
