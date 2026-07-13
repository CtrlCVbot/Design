# Three-stage rollout

This rollout uses the three-stage phased model selected by DEC-01. `[ARCH-02] [DEC-01]`

## Gates

1. **GATE-01 — evidence integrity:** verify evidence coverage and source hash. `[GATE-01]`
2. **GATE-02 — planning package completeness:** verify the five documents and their internal links. `[GATE-02]`
3. **GATE-03 — independent review:** the Advisor independently verifies facts, outputs, and scope. `[GATE-03]`

## Stop and rollback conditions

At each gate, the rollout can stop and roll back. `[ARCH-02]` **Recommendation:** Roll back when the applicable gate verification does not complete, because Option B permits stopping and rollback at every gate. `[ARCH-02]`

- For GATE-01, roll back if evidence coverage or source-hash verification does not complete. This condition is derived from GATE-01. `[GATE-01]`
- For GATE-02, roll back if five-document or internal-link verification does not complete. This condition is derived from GATE-02. `[GATE-02]`
- For GATE-03, roll back if the Advisor's independent fact, output, or scope verification does not complete. This condition is derived from GATE-03. `[GATE-03]`

The governing decision is in [01-decision.md](./01-decision.md).
