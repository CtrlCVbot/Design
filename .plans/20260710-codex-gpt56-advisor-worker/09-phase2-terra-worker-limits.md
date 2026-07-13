# 09. Phase 2 Terra Worker와 사용량 제한 실행 결과

> 실행일: 2026-07-10 KST
> 범위: Terra/medium custom Worker, runtime thread/depth hard cap, turn당 Worker soft policy
> 판정: **완료**

## 1. 결론

- standalone custom agent `implementation_worker`를 `gpt-5.6-terra/medium`으로 등록했다.
- custom agent는 부모의 sandbox와 approval을 덮어쓰지 않으며 commit, push, PR, deploy, publish, production write, child spawn, self-approval을 금지한다.
- `[agents] max_threads = 4`, `max_depth = 1`을 전역 config에 추가했다.
- orchestration skill에 한 turn의 `implementation_worker`·`routine_worker` 최대 3개 soft policy를 추가했다.
- fresh CLI에서 custom agent 자동 발견, Terra/medium 적용, 부모 권한 상속, thread/depth hard cap, Worker 3개 soft policy를 모두 실측했다.
- 전역 기본값 `gpt-5.5/xhigh/priority`는 변경하지 않았다.

## 2. 공식 계약

확인한 현재 공식 문서:

- [Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)

적용한 핵심 계약:

1. 개인 custom agent는 `~/.codex/agents/*.toml` standalone 파일로 자동 발견된다.
2. `name`, `description`, `developer_instructions`는 필수다.
3. `model`, `model_reasoning_effort`, `nickname_candidates`는 agent 파일에서 지정할 수 있다.
4. 생략한 sandbox와 approval은 부모 session의 live runtime policy를 상속한다.
5. built-in `default`, `worker`, `explorer`와 같은 이름을 사용하면 custom agent가 덮어쓸 수 있으므로 피한다.
6. `agents.max_threads`는 동시에 열린 agent thread 수의 hard cap이다.
7. `agents.max_depth = 1`은 root의 direct child만 허용하고 grandchild fan-out을 막는다.

## 3. Pre-change Checkpoint

- 위치: `C:\Users\beck\Documents\Codex\_backups\agentic\2026-07-10\03-agentic-change-checkpoints\advisor-worker-phase2`
- 파일: `AGENTS.md`, `config.toml`, orchestration `SKILL.md`, `openai.yaml`, `manifest.json`
- `implementation-worker.toml`은 변경 전 미존재 상태로 manifest에 기록했다.
- checkpoint 4개 파일의 SHA256 재검증: PASS

## 4. 변경 표면

| 파일 | 변경 | SHA256 |
|---|---|---|
| `C:\Users\beck\.codex\agents\implementation-worker.toml` | Terra/medium standalone implementation Worker 생성 | `1AFAE3220ADD10037285413C067F9B51D9C1EE78C70632EF2859E23024ED87FF` |
| `C:\Users\beck\.codex\config.toml` | `[agents] max_threads = 4`, `max_depth = 1` 추가 | `8DD18EF528305F03585C0B849C491F6619AE09CCD8D69222BAB7F6A1E6B7511F` |
| `C:\Users\beck\.agents\skills\advisor-worker-orchestration\SKILL.md` | turn당 Worker 최대 3개 soft policy와 `worker_count` 기록 추가 | `F75E6BAAAB9F4D6F847C3764AAE1ED90ECC6F8C6535DD1D4B668390C1F42BD46` |

`AGENTS.md`와 `openai.yaml`은 Phase 1 hash를 유지했다.

## 5. implementation_worker 계약

| 항목 | 값 |
|---|---|
| name | `implementation_worker` |
| model | `gpt-5.6-terra` |
| reasoning effort | `medium` |
| sandbox override | 없음, 부모 상속 |
| approval override | 없음, 부모 상속 |
| service tier override | 없음 |
| MCP override | 없음 |
| child spawn | 금지 |
| commit/push/PR/deploy | 금지 |
| scope | complete Worker Brief의 allowed paths와 commands만 |

TOML은 ASCII-only이며 `tomllib` parse와 필수·금지 key 검사를 통과했다. custom name은 built-in `default`, `worker`, `explorer`와 충돌하지 않는다.

## 6. 단계별 검증

### 6.1 Agent 파일만 적용

| 항목 | 결과 |
|---|---|
| draft/installed normalized content | PASS |
| TOML parse | PASS |
| required keys | PASS |
| exact model/effort | `gpt-5.6-terra/medium` |
| sandbox·approval·service tier·MCP override | 없음 |
| stale Claude/Gemini/Opus reference | 0건 |
| config hash | Phase 0/1 hash 그대로 유지 |

Fresh CLI load smoke:

| 항목 | 결과 |
|---|---|
| parent thread | `019f497e-1f4b-7602-a209-3fe843e3ab5d` |
| custom child | `019f497e-9a0a-71e1-9230-56d5f2dc2b35` |
| role | `implementation_worker` |
| model / effort | `gpt-5.6-terra / medium` |
| depth | `1` |
| inherited sandbox | `read-only` |
| inherited approval | `never` |
| output | `IMPLEMENTATION_WORKER_OK` |
| spawn count | 1 |

### 6.2 `[agents]` 제한 적용

```toml
[agents]
max_threads = 4
max_depth = 1
```

- `notify`가 top-level에 남아 있음을 포함해 전체 TOML parse: PASS
- config diff: 위 `[agents]` 블록만 추가
- model, effort, service tier 불변: PASS

### 6.3 max_depth runtime smoke

| 항목 | 결과 |
|---|---|
| parent | `019f4982-c5e4-7741-a22b-76d4f8864319` |
| depth-1 child | `019f4983-293b-79d2-8559-a590da698cc1` |
| grandchild spawn | BLOCKED |
| runtime surface | depth-1 child에 built-in agent-spawn tool 미노출 |

관찰상 `max_depth = 1`은 root가 direct child를 만들 수 있게 하되 child가 다시 agent를 만드는 경로를 차단한다.

### 6.4 max_threads runtime smoke

| 항목 | 결과 |
|---|---|
| parent | `019f4983-d05d-7b52-bc0e-189520e1f071` |
| A~D spawn | 4개 성공 |
| E spawn | BLOCKED |
| exact error | `collab spawn failed: agent thread limit reached` |
| child cleanup | A~D 모두 완료 후 close |

관찰상 `max_threads = 4`는 root thread와 별도로 동시에 열린 child agent thread 4개를 허용하고 다섯 번째를 차단한다.

### 6.5 Worker soft policy smoke

네 개의 독립 synthetic lane을 제시하고 implementation Worker soft policy를 적용했다.

| 항목 | 결과 |
|---|---|
| parent | `019f4981-5729-70f2-951d-b5917b3f37d8` |
| `worker_count` | 3 |
| spawned lanes | A, B, C |
| deferred lane | D |
| child output | `LANE_A_OK`, `LANE_B_OK`, `LANE_C_OK` |
| soft policy violation | 0 |

runtime hard cap 4와 달리 soft policy 3은 구현 비용과 fan-out을 제한하는 orchestration 규칙이다.

## 7. Health-check

| 영역 | 결과 |
|---|---|
| AGENTS | PASS, 103줄 core-sized |
| skills | PASS, 67 total, 0 long, stale 0 |
| commands | PASS |
| memories | PASS |
| plugins | PASS |
| config | 기존 hook trust stale 15건으로 WARN |

stale 15건은 Phase 0 이전부터 존재한 기준선이며 Phase 2로 증가하지 않았다.

## 8. 비차단 Runtime 경고

- Codex manual helper가 `x-content-sha256` 응답 header 누락으로 실패해 공식 Subagents·Configuration Reference 페이지로 fallback했다.
- remote recommended plugin catalog 조회가 여러 차례 실패했다.
- Apps MCP handshake가 일부 smoke 종료 시 timeout됐지만 cached tools로 계속 진행됐다.
- `template-creator`의 네 번째 default prompt는 최대 3개 제한으로 무시된다.
- PowerShell shell snapshot은 현재 runtime에서 지원되지 않는다.

custom agent 로드, child 실행, thread/depth 제한 결과에는 영향이 없었다.

## 9. Gate 판정

| Phase 2 gate | 판정 |
|---|---|
| `implementation_worker` 로드·식별 | PASS |
| Terra/medium 적용 | PASS |
| 부모 sandbox/approval보다 넓은 권한 없음 | PASS |
| built-in agent 이름 미덮어쓰기 | PASS |
| `max_depth = 1` 적용 | PASS |
| `max_threads = 4` 적용 | PASS |
| turn당 Worker 3개 soft policy | PASS |
| soft policy violation | 0 |
| Worker commit/push/deploy | 0 |
| 기본 모델·service tier 불변 | PASS |

Phase 2는 완료 상태다.

## 10. 롤백

1. Phase 2 checkpoint의 `config.toml`을 현재 전역 `config.toml` 한 파일에 복원한다.
2. `C:\Users\beck\.codex\agents\implementation-worker.toml`만 제거한다.
3. Phase 2 checkpoint의 orchestration `SKILL.md`를 복원해 Worker 3개 soft policy를 제거한다.
4. 기존 AGENTS, plugins, sessions, memories, auth, hook trust는 건드리지 않는다.
5. health-check와 fresh CLI에서 skills 67, custom agent 미발견, `[agents]` 미설정 기준으로 복귀했는지 확인한다.

## 11. 다음 Gate

Phase 3에서는 disposable fixture의 실제 작은 구현 2개에 `implementation_worker`를 적용하고, Advisor가 `status -> diff -> focused test -> broader check`를 독립 수행한다. 의도적으로 실패하는 사례에는 실제 repair brief를 사용하며, disjoint path 한 사례 외에는 병렬 write를 허용하지 않는다.
