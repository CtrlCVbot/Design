# Evidence matrix

| Evidence ID | Planning use |
| --- | --- |
| `PROD-01` | Package must expose decision and scope without repeated evidence search. |
| `PROD-02` | Output is exactly five documents; code is a non-goal. |
| `REQ-01` | Material claims require evidence-ID traceability. |
| `REQ-02` | Document links must be valid. |
| `ARCH-01` | Option A is big-bang with broader recovery scope. |
| `ARCH-02` | Option B is a three-stage rollout with per-gate stop and rollback. |
| `DEC-01` | Select Option B for reversibility and scope control. |
| `CON-01` | No production write, global configuration change, or source-code change. |
| `RISK-01` | Stale evidence can make the decision basis invalid. |
| `RISK-02` | A worker can write outside planning output. |
| `GATE-01` | Verify evidence coverage and source hash. |
| `GATE-02` | Verify five documents and their links. |
| `GATE-03` | Advisor independently verifies facts, outputs, and scope. |

## Inference

Because `REQ-01` requires traceability, this matrix supplies a single coverage
view for all evidence IDs. Risk treatment is in
[04-risk-register.md](./04-risk-register.md).
