# Risk register

| Risk | Effect | Mitigation |
| --- | --- | --- |
| RISK-01 | Stale evidence can make the decision basis incorrect. `[RISK-01]` | Validate the input manifest and evidence-ID coverage. `[RISK-01]` |
| RISK-02 | A Worker can edit outside the planning-output boundary. `[RISK-02]` | Restrict work to allowed paths and compare pre/post hash values. `[RISK-02]` |

**Recommendation:** Treat a manifest or evidence-ID coverage validation failure as a reason not to proceed, because the decision basis may be incorrect. This is an inference from the stated stale-evidence risk and mitigation. `[RISK-01]`

**Recommendation:** Treat a pre/post hash difference outside allowed paths as a reason not to proceed, because it indicates the stated boundary protection did not hold. This is an inference from the stated out-of-boundary-edit risk and mitigation. `[RISK-02]`

Gate execution is defined in [05-rollout.md](./05-rollout.md).
