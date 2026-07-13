# Risk register

| Risk | Description | Mitigation | Residual handling |
| --- | --- | --- | --- |
| `RISK-01` | Stale evidence can invalidate the decision basis. | Record the input **manifest** and validate evidence-ID coverage; compare source hashes at the applicable gate. | Stop rollout when coverage or source-hash validation fails. |
| `RISK-02` | A worker could write outside planning output. | Restrict writes to allowed paths and compare the **pre/post hash** of the permitted output manifest. | Stop and investigate any unexpected path or hash difference. |

## Recommendation

Treat manifest and pre/post hash checks as boundary controls, not as proof that
the decision itself is correct. The rollout gates are in
[05-rollout.md](./05-rollout.md).
