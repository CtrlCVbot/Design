# GT-04 v1 Luna Routine Pilot Definition

> Defined before fixture implementation and trial execution.<br>
> Fixture ID: `GT04-json-normalization-v1`<br>
> Combination ID: `GT04-LUNA-CUSTOM-PILOT`<br>
> Scope: custom `routine_worker` reliability only; not a B0/B1/C1/C3 comparative claim.

## Capability Eval

Task: apply one deterministic normalization rule to four JSON records without adding, deleting, or touching files outside the assigned trial.

Input records:

| File | id | name | tags |
|---|---|---|---|
| `north.json` | `A-01` | `  North   Hub ` | ` Priority `, `night`, `priority`, empty |
| `south.json` | `B-02` | `SOUTH Gate` | `fragile`, ` Fragile `, `oversize` |
| `east.json` | `C-03` | `East Transfer Point` | empty list |
| `west.json` | `D-04` | ` West Yard ` | ` late `, empty, `Late`, `weekend` |

Mechanical output rule:

1. Parse every assigned `records/*.json` object.
2. Require `id` and `name` strings and a `tags` string list; any invalid record is an exception and must stop the trial.
3. Add or replace `slug` with `name.strip().lower()` after collapsing every whitespace run to one hyphen.
4. Normalize tags in first-seen order: `strip`, lowercase, drop empty values, drop duplicates after normalization.
5. Preserve all other values exactly, including the original `name` whitespace and casing.
6. Serialize with `json.dumps(..., ensure_ascii=True, indent=2, sort_keys=True) + "\n"`.
7. Do not add, delete, or rename files.

## Trials

- Trial count: 3
- Trial IDs: `trial-01`, `trial-02`, `trial-03`
- Seeded execution order: `trial-02`, `trial-01`, `trial-03` from `random.Random(5604)`
- Each trial starts as an independent byte-identical copy of the baseline.
- Each trial is owned by one separate custom `routine_worker` child.
- All three children may run concurrently because their write paths and verifier commands are disjoint.
- No retry or repair is allowed before first-attempt grading. Failed trials remain `FAIL`.

Runtime controls:

- Parent: fresh CLI, `gpt-5.6-luna/low`
- Child: registered `routine_worker`, expected `gpt-5.6-luna/medium`
- Sandbox: `workspace-write`
- Approval: inherited `never`
- Service tier: inherited current global `priority`
- Worker soft cap: 3
- Production credential, remote write, commit, push, PR, deploy, publish: forbidden

## Code-based Grader

The grader compares each trial's exact file set and bytes with prebuilt expected files. It does not compute expected output using the Worker implementation.

Per-trial PASS requires all conditions:

- exact expected file set
- all four JSON files byte-equal to expected
- verifier exit code 0 and `mismatches = 0`
- child result contains `exception_count = 0`
- child model/effort is Luna/medium
- no file changes outside that trial's `records` directory
- no overlap between Worker write paths
- no repair loop

Pilot PASS requires:

- `pass^3 = 100%`
- `task_pass_at_1 = 100%`
- total `scope_violations = 0`
- total `write_conflicts = 0`
- total `exception_count = 0`
- `worker_count = 3`
- Advisor independently reruns all graders and parses parent/child rollout metadata

## Usage Metrics

Record parent and each child:

- thread ID, model, effort
- input, cached input, output, reasoning output, total tokens
- cached input ratio
- wall time when available
- `credits_source`; null or unavailable is not treated as zero

This pilot does not claim cost improvement because it has no B0/B1 comparator.
