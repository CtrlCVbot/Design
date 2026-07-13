---
name: advisor-worker-orchestration
description: Guide Advisor-led delegation for non-trivial implementation work that needs a bounded Worker brief, isolated workspace, independent verification, or repair loop. Do not use for simple Q&A, explicit docs-only or review-only work, or a clear low-risk one- or two-line edit.
---

# Advisor / Worker Orchestration

The Advisor owns decisions, approval, and final reporting. User and project instructions override this skill. `implementation_worker` and `routine_worker` are logical roles; do not assume custom agents exist.

## Routing

- Work directly for simple Q&A, explicit docs-only or review-only work, and clear low-risk one- or two-line edits.
- Delegate only non-trivial implementation with fixed outcomes, paths, tests, and safe isolation.
- Never turn a no-write request into write delegation.
- Spawn at most three `implementation_worker` or `routine_worker` instances in one turn. This soft policy is separate from the `agents.max_threads` runtime cap; record `worker_count` in the run result.

## Worker Brief

Before spawn, emit the complete brief below. Preserve every field and nested key. Do not summarize, rename, merge, collapse, or omit fields. Keep inapplicable fields as `none` or `unavailable` with a reason. Verify non-overlapping paths and assign every shared state an owner or serial rule. Do not spawn an incomplete brief.

```text
[WORKER BRIEF]
brief_id: WB-<slug>-<seq>
role: implementation_worker | routine_worker
runtime_agent: <currently available worker, default, or registered custom agent>
objective:
- <observable result>
why:
- <user value or problem>
known_context:
- repo root: <absolute path>
- repo state: <branch and fixture/worktree ref>
- current behavior: <confirmed behavior>
- architecture decision: <confirmed design>
- relevant files: <paths and roles>
allowed_paths:
- <only writable paths>
forbidden_paths:
- <protected paths and unrelated WIP>
workspace_isolation:
- mode: disposable_fixture | dedicated_clean_worktree | existing_single_worker
- production credentials: unavailable
- real remote writes: forbidden
shared_write_state:
- lockfiles: <owner or forbidden>
- generated outputs: <owner or forbidden>
- build/test cache: <isolated path or serial-only>
- test database: <isolated instance or serial-only>
allowed_commands:
- <read, test, and build commands only>
- no commit, push, PR, deploy, package publish, or production write
conventions:
- <applicable user/project instructions, TDD, naming, architecture>
known_pitfalls:
- <known nested repo, encoding, migration, or shared-state risk>
acceptance_criteria:
- [ ] <observable success condition>
required_tests:
- <command> -> expected: PASS
parallel_ownership:
- worker owns only: <disjoint paths>
- shared files/state: do not edit; report needed changes to Advisor
stop_conditions:
- acceptance criteria requires an architecture decision
- allowed_paths outside modification is needed
- destructive command, secret access, permission escalation, or production operation is needed
- existing user change conflicts
report_format:
1. changed files and why
2. tests run and exact result
3. assumptions made
4. unresolved risks or blocked items
5. confirm no commit, push, PR, deployment, or global file edit
```

For routine work, keep all fields and add a mechanical `output_rule`, one `acceptance_check`, and `stop_if` for any judgment. Escalate design decisions.

## Delegate Safely

1. Select an available Agent/subagent `worker` or `default`; use custom agents or models only when registered and available.
2. Pass the brief unchanged. Tell the Worker it is not alone and must not revert or overwrite others' changes.
3. Parallelize only disjoint write ownership with isolated shared state; otherwise run serially.
4. While it runs, prepare only non-overlapping design or verification work.
5. Record actual thread ID, model, effort, changed files, and tests.

## Verify Independently

`WORKER RESULT` is an evidence index, not approval. Run in order:

| Gate | Advisor action |
|---|---|
| G0 | Confirm repo, branch, dirty/nested state, and isolation; stop on a bad boundary. |
| G1 | Compare status and changed files with `allowed_paths`; repair scope violations. |
| G2 | Read scoped diff; record missing, risky, or unrelated changes. |
| G3 | Re-run focused tests; attach exact failures to repair. |
| G4 | Run a blast-radius test/build; separate causes before re-delegation. |
| G5 | Check project rules and acceptance criteria; revisit bad design. |
| G6 | Exclude user changes from staged or proposed commit scope. |
| G7 | Commit/push only on explicit user request; otherwise report and stop. |

## Repair From Evidence

Issue a repair brief instead of asking for a vague retry. Include:

```text
[REPAIR BRIEF]
parent_brief_id: <WB-id>
repair_id: <WB-id>-R<seq>
verified_failure:
- command/check: <Advisor-run verification>
- observed: <actual output or error>
- expected: <expected outcome>
diff_findings:
- <file:line or changed-block issue>
repair_scope:
- allowed: <repair paths>
- forbidden: <correct changes and unrelated WIP>
required_action:
- <specific correction>
required_tests:
- <commands to rerun>
stop_conditions:
- stop for an architecture decision or an out-of-scope path
report:
- changed files, test result, remaining risk
- no commit/push
```

Use verified evidence for every repair. On a second failure from the same cause, revisit design or Worker capability. A Worker never approves its repair. The Advisor directly fixes only formatting, typos, or other behavior-neutral finishing work; meaningful logic or test changes require a repair brief.

## Fallback

If subagent tools or safe isolation are unavailable, the Advisor works sequentially under the same scope, test, and verification gates. Do not claim delegation, Worker execution, or Worker verification occurred. Report the actual mode and limits.

## Require a Standard Result

Require this result, then perform G0-G7:

```text
WORKER RESULT
- brief_id: <id>
- agent_thread_id: <id or unavailable>
- model: <model id or unavailable>
- model_reasoning_effort: <effort or unavailable>
- status: complete | partial | blocked
- changed_files: <list>
- acceptance_criteria: <pass/fail per item>
- tests: <command and exact result>
- assumptions: <list>
- unresolved_risks: <list>
- scope_deviation: none | <details>
- shared_write_state_deviation: none | <details>
- commit_or_push: not performed
```
