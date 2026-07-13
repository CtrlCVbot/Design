# Three-stage rollout

## Gates

1. `GATE-01` — verify evidence coverage and source hash before advancing.
2. `GATE-02` — verify exactly five documents and their links before advancing.
3. `GATE-03` — require independent Advisor verification of facts, outputs, and
   scope before final acceptance.

## Rollback conditions

Rollback means stop the phased rollout and return to the prior gate state. Do
so if evidence coverage or source-hash verification fails (`GATE-01`), if the
five-document or link check fails (`GATE-02`), or if independent fact, output,
or scope verification fails (`GATE-03`). This applies the per-gate stop and
rollback capability of `ARCH-02`.

## Decision link

This rollout implements the fixed choice in [01-decision.md](./01-decision.md):
`DEC-01` selects Option B for reversibility and scope control.
