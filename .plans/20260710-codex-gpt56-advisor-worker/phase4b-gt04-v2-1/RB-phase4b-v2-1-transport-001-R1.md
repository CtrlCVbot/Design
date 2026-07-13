[REPAIR BRIEF]
parent_brief_id: WB-phase4b-v2-1-transport-001
repair_id: WB-phase4b-v2-1-transport-001-R1
verified_failure:
- command/check: Advisor read of transport/run-source.mjs against the current functions.exec tool schema
- observed: source calls tools.spawn_agent, tools.wait_agent, tools.notify, child.id, and wait_agent({ id: child.id })
- expected: tools.multi_agent_v1__spawn_agent, tools.multi_agent_v1__wait_agent, global notify, child.agent_id, and wait_agent({ targets: [child.agent_id], timeout_ms: 300000 })
- observed: test_transport.ps1 asserts only the same incorrect shorthand names, so its PASS is a false positive for runtime compatibility
diff_findings:
- transport/run-source.mjs: spawn, wait, notify names and response/request fields do not match the exposed functions.exec contract
- transport/test_transport.ps1: lifecycle assertions do not validate the full tool names, agent_id response field, targets array, timeout, or global helper use
repair_scope:
- allowed: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-1\transport\run-source.mjs
- allowed: C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase4b-gt04-v2-1\transport\test_transport.ps1
- forbidden: fixture, EVAL, briefs, manifests, parent prompt, previous evidence, global files, and unrelated user WIP
required_action:
- replace shorthand spawn/wait names with tools.multi_agent_v1__spawn_agent and tools.multi_agent_v1__wait_agent
- pass agent_type routine_worker, fork_context false, and message read.output without model, effort, or service override
- use child.agent_id and targets: [child.agent_id] with timeout_ms: 300000
- use global notify immediately after spawn and global text for the final wait result
- fail before spawn if brief read exits nonzero or does not contain the expected brief header
- update preflight assertions so the corrected full names and exact request/response fields are required and the old shorthand patterns fail
- preserve zero backslash, backtick, interpolation sequence, and raw Worker brief content in run-source.mjs
required_tests:
- node --check transport/run-source.mjs -> expected: exit 0
- & .\transport\test_transport.ps1 -> expected: status PASS, tests 6
- Advisor negative text check for tools.spawn_agent, tools.wait_agent, tools.notify, child.id, and wait_agent({ id -> expected: zero hits
stop_conditions:
- stop for an architecture decision or an out-of-scope path
- do not spawn an actual agent during repair or tests
report:
- changed files, exact test result, remaining risk
- no agent spawn, commit, push, PR, deploy, or global edit
