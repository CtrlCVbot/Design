# 14. Phase 4-B GT-04 v2.1 Transport Diagnostic 결과

> 실행일: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v2-1-transport`<br>
> Combination: `GT04-V2-1-LUNA-CUSTOM-DIAGNOSTIC`<br>
> 판정: **FAIL, child spawn 이전 live capability mismatch**

## 1. 결론

v2의 raw Windows path escape 문제는 제거했고 parse-only 및 mocked lifecycle preflight도 PASS했다. 그러나 fresh CLI의 `functions.exec`에는 main session과 달리 `tools.exec_command`가 노출되지 않았다. Structured source가 brief를 읽기 전에 `TypeError`로 종료돼 custom `routine_worker`는 생성되지 않았다.

| 구분 | 결과 | 판정 |
|---|---:|---|
| transport preflight | 6/6 | PASS |
| mocked lifecycle | 5 calls | PASS |
| fixture grader tests | 5/5 | PASS |
| live source execution | `tools.exec_command` unavailable | FAIL |
| actual `spawn_agent` call | 0 | FAIL |
| actual child | 0 | FAIL |
| trial-01 output | 4 mismatch 유지 | 미실행 |
| v2.1/global hash drift | 0/0 | PASS |
| retry / diagnostic repair | 0 / 0 | first-attempt 보존 |

CLI exit code 0은 parent turn 종료만 뜻한다. Child가 없으므로 strict diagnostic은 FAIL이다.

## 2. v2.1 준비와 Repair

- Eval: [EVAL.md](./phase4b-gt04-v2-1/EVAL.md)
- Routine brief: [trial-01.md](./phase4b-gt04-v2-1/briefs/trial-01.md)
- Transport source: [run-source.mjs](./phase4b-gt04-v2-1/transport/run-source.mjs)
- Preflight: [test_transport.ps1](./phase4b-gt04-v2-1/transport/test_transport.ps1)
- Repair brief: [RB-phase4b-v2-1-transport-001-R1.md](./phase4b-gt04-v2-1/RB-phase4b-v2-1-transport-001-R1.md)
- Structured result: [run-result.json](./phase4b-gt04-v2-1/run-result.json)

Terra/medium implementation Worker `019f49de-dbc9-7ee2-976f-b667505483b6`가 fixture와 transport를 구현했다. 첫 결과는 `tools.spawn_agent`, `tools.wait_agent`, `child.id`, `{ id }`처럼 실제 schema와 다른 shorthand를 사용했다.

Advisor가 source를 직접 읽어 이 false positive를 확인하고 repair brief로 다음을 수정했다.

- `tools.multi_agent_v1__spawn_agent`
- `tools.multi_agent_v1__wait_agent`
- `child.agent_id`
- `targets: [child.agent_id]`
- global `notify`, `text`

수리 후 Advisor 검증:

| 검증 | 결과 |
|---|---|
| `node --check` | PASS |
| transport static tests | PASS, 6/6 |
| mocked call order | `read -> spawn -> notify -> wait -> text` |
| forbidden raw brief/backslash/backtick/interpolation | 0 |
| v2 fixture 30-file path·size·SHA256 parity | PASS |
| PowerShell harness tests | PASS, 5/5 |
| initial trial-01 | FAIL, mismatches 4 |

이 preflight는 source의 문법과 호출 payload는 검증했지만 live nested tool 목록까지 증명하지 못했다. Mock이 `tools.exec_command`를 직접 제공했기 때문에 실제 runtime 차이를 가렸다.

## 3. Live Diagnostic

| 항목 | 값 |
|---|---|
| Parent thread | `019f49e5-72a3-79b2-a57c-3daab58578be` |
| Parent model / effort | `gpt-5.6-luna` / `low` |
| sandbox / approval | `workspace-write` / `never` |
| source execution | 1회 |
| actual spawn call / child | 0 / 0 |
| retry | 0 |

Parent는 `run-source.mjs`를 읽을 때 다음 live tool을 성공적으로 사용했다.

```text
tools.shell_command
```

그 뒤 parse-checked source를 실행했지만 첫 줄에서 실패했다.

```text
TypeError: tools.exec_command is not a function
```

즉 fresh CLI의 model-facing `functions.exec` nested tool surface는 현재 main session의 surface와 같다고 가정할 수 없다. v2.2는 관측된 `tools.shell_command` 계약을 기준으로 설계해야 한다.

## 4. Scope와 Usage

Pre-run manifest SHA256: `DE027BB22EF88FB8B485E0FD1AD87E5CF2BB6814B7E61997C936A14C5C7054A3`

| 검사 | 결과 |
|---|---:|
| v2.1 changed / added / deleted | 0 / 0 / 0 |
| trial-01 post-run mismatch | 4 |
| child rollout | 0 |
| global hash drift | 0 |
| sandbox marker | 0 |

| Thread | Input | Cached input | Output | Reasoning | Total |
|---|---:|---:|---:|---:|---:|
| Parent only | 87,964 | 65,792 | 764 | 250 | 88,728 |

- Cached input ratio: 74.79%
- Wall time: 19.014 seconds
- Child usage: 없음
- `credits_source = unavailable`
- `total_credits = null`

## 5. Risk-based Self-review

| 리스크 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| Mock이 live에 없는 `tools.exec_command`를 제공 | 3 | 2 | 1 | 6 | high | v2.1 FAIL 보존, live capability probe를 다음 gate에 추가 |
| Main/fresh CLI nested tool surface 차이 | 3 | 2 | 1 | 6 | high | runtime별 실제 tool name을 evidence로 고정 |
| Child 0 상태에서 88,728 tokens 사용 | 2 | 2 | 1 | 5 | high | spawn 전 no-agent live probe 분리 |
| Worker의 최초 shorthand schema 오류 | 2 | 1 | 1 | 4 | medium | Advisor repair 완료, preflight 강화 |

확인된 critical 리스크는 없다. Remaining trials와 Phase 5는 승인하지 않는다.

## 6. 다음 Gate

다음 실험은 기존 v2.1을 수정하지 않는 `GT-04 v2.2 live-shell transport diagnostic`으로 분리한다.

1. Fresh CLI에서 agent를 만들지 않는 `functions.exec` capability probe로 `tools.shell_command`, custom spawn, wait의 실제 노출을 먼저 기록한다.
2. `tools.shell_command`가 PowerShell에서 brief를 JSON string으로 출력하게 한다.
3. Source가 shell wrapper의 `Output:` 이후 JSON을 파싱해 원래 brief string을 복원한다.
4. 복원된 brief hash와 원본 semantic content를 mock 및 live no-spawn probe에서 확인한다.
5. 위 gate 통과 뒤 custom `routine_worker` 한 개만 diagnostic으로 실행한다.

Phase 4-B는 **진행 중·live-shell transport remediation 필요** 상태다.
