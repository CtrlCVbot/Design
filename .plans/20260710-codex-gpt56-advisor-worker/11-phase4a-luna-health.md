# 11. Phase 4-A Luna Worker·Health-check 실행 결과

> 실행일: 2026-07-10 KST<br>
> 범위: `routine_worker` 등록, custom-agent health-check TDD 확장, fresh runtime route smoke<br>
> 판정: **완료, Phase 4-B Eval은 미실행**

## 1. 요약

| 항목 | 결과 |
|---|---|
| Luna routine agent | `gpt-5.6-luna/medium`, PASS |
| Custom agent schema·route·override 검사 | PASS |
| `[agents]` 제한 검사 | `max_threads = 4`, `max_depth = 1`, PASS |
| Health-check unit test | 9 PASS |
| Live health-check | exit 0, custom agents 2/2 PASS |
| Fresh CLI custom role | `routine_worker` child 생성, Luna/medium PASS |
| Current app multi-agent API | custom role 이름 직접 지정 불가, built-in만 노출 |
| Worker 수 / repair loop | 2 / 2 |
| Worker scope violation | 0 |
| Commit·push·deploy | 0 |

Phase 4-A는 완료다. GT-04 `pass^3`, 전체 golden task 반복, credits calibration은 Phase 4-B 범위다.

## 2. 공식 계약

확인한 공식 문서:

- [Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)

적용한 계약:

1. personal custom agent는 `~/.codex/agents/*.toml` standalone 파일이다.
2. 일반 필수 필드는 `name`, `description`, `developer_instructions` 세 개다.
3. `model`, `model_reasoning_effort`, `nickname_candidates`는 선택 필드이며 생략한 설정은 부모에서 상속된다.
4. 현재 built-in 이름은 `default`, `worker`, `explorer`다.
5. nickname은 비어 있지 않은 고유 목록이며 ASCII letter, digit, space, hyphen, underscore를 사용할 수 있다.
6. `agents.max_threads`는 동시 open thread 상한이고, `agents.max_depth = 1`은 root의 direct child까지만 허용한다.

Codex manual helper는 응답의 `x-content-sha256` header 누락으로 실패했고 Docs MCP는 현재 세션에 없어, 위 두 공식 페이지를 fallback으로 사용했다.

## 3. Checkpoint와 동시 변경

- checkpoint: `C:\Users\beck\Documents\Codex\_backups\agentic\2026-07-10\03-agentic-change-checkpoints\advisor-worker-phase4a`
- checkpoint 파일: 8개, SHA256 재검증 PASS
- 변경 전 부재: `routine-worker.toml`, health-check unittest

Checkpoint 생성 시점의 live 기본값은 이미 다음 상태였다.

```toml
model = "gpt-5.6-sol"
model_reasoning_effort = "xhigh"
service_tier = "priority"
```

이는 Phase 4-A가 만든 변경이 아니다. 또한 checkpoint 이후 `config.toml`에 `c:\work\dev\optics\apps\mm-broker` trust 항목이 별도로 추가됐다. Phase 4-A는 `config.toml`을 수정하거나 되돌리지 않았고, manifest에 전체 config 복원 금지 주의를 추가했다.

## 4. 구현 결과

| 파일 | 변경 | SHA256 |
|---|---|---|
| `C:\Users\beck\.codex\agents\routine-worker.toml` | Luna/medium deterministic routine Worker 추가 | `0862E1228F896D4B7C8DE8F6FEAC57C272EF87C8D21C1B511D4EFBB58BA2C2E5` |
| `C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py` | custom-agent·limit 검사 추가 | `E60BCD180B527CA975CE9F4BC295972F133A97F46193A407A2B94C706950E790` |
| `C:\Users\beck\.agents\skills\agentic-health-check\tests\test_agentic_health_check.py` | stdlib unittest 9개 추가 | `3042DE0D50CFBF8B140843FCEB2D4FEB3C61FA9EBB51FDF79D934D4573608913` |
| `C:\Users\beck\.agents\skills\agentic-health-check\SKILL.md` | 자동 검사 범위 문서화 | `2B6645AAEB347D5C83684EE795A5321F30F029D83CADD678105831FCF681E4A3` |
| `C:\Users\beck\.agents\skills\agentic-health-check\references\checks.md` | 수동 검사와 동적 CLI 탐색 추가 | `38EFE1BC61DF6E78C9E7FECEAC22E8DCBEDF4ECDE340FAFA0EBDB75E873E8666` |

변경하지 않은 전역 파일의 checkpoint hash 일치:

- `AGENTS.md`
- `implementation-worker.toml`
- `advisor-worker-orchestration/SKILL.md`
- health-check `agents/openai.yaml`

## 5. routine_worker 계약

| 항목 | 값 |
|---|---|
| name | `routine_worker` |
| model / effort | `gpt-5.6-luna / medium` |
| 작업 유형 | deterministic routine transformation |
| 판단·모호성·예외 | 즉시 `blocked` |
| sandbox·approval·tier·MCP·skills override | 없음, 부모 상속 |
| child spawn | 금지 |
| commit·push·PR·deploy·publish·production | 금지 |
| routine result | `output_rule_applied`, `exception_count`, `acceptance_check`, exact result 필수 |

첫 Worker 결과에서 routine-specific `exception_count`가 누락돼 Advisor가 repair brief를 발행했다. 같은 Worker가 결과 계약만 수정했고 Advisor parser가 최종 PASS를 확인했다.

## 6. Health-check TDD

Health Worker는 TDD(Test-Driven Development, 실패 테스트를 먼저 만들고 최소 구현으로 통과시키는 방식)로 작업했다.

초기 RED:

```text
FAILED (failures=1, errors=6)
```

Advisor의 공식 계약 검토에서 다음 오류를 발견해 repair brief로 재위임했다.

- 모든 custom agent에 model/effort를 필수화한 오류
- 공식적으로 허용되는 nickname 대문자·공백·하이픈을 거부한 오류
- nickname 중복 미검사
- built-in 목록에 문서에 없는 `planner`를 넣은 오류
- 실제 override key `sandbox_mode`를 놓친 오류

Repair RED:

```text
Ran 9 tests
FAILED (failures=2)
```

최종 GREEN:

```text
Ran 9 tests
OK
```

최종 테스트 범위:

- 정상 required agents와 effective limits
- agent directory·required agent 누락
- malformed·incomplete TOML
- duplicate name과 built-in shadowing
- official minimum extra agent schema
- valid/invalid/duplicate nickname
- required route와 forbidden override
- omitted/invalid thread·depth limit
- custom-agent/AGENTS/config 실패 시 main exit 1

## 7. Live Health-check

```text
custom agents | pass | 2 total, routes 2/2, overrides 0,
limits threads 4, depth 1: schema and required routes valid
```

| 영역 | 결과 |
|---|---|
| AGENTS | PASS, 103줄 core-sized |
| config | 기존 hook trust stale 15건으로 WARN |
| custom agents | PASS |
| skills | PASS, 67 total, 0 long, stale 0 |
| commands·memories·plugins | PASS |
| custom-agent issues | none |

## 8. Runtime 가시성

현재 앱 multi-agent API는 새 role 이름을 직접 지정하면 spawn 전에 차단한다.

```text
unknown agent_type 'routine_worker'
```

Bundled `codex-cli 0.144.0-alpha.4` fresh process에서는 실제 child rollout을 확인했다.

| 항목 | Parent | Child |
|---|---|---|
| thread | `019f49ae-ca68-7bc1-99f4-411025c49aed` | `019f49af-19b7-7270-95c8-55331bb8b293` |
| role | Advisor | `routine_worker` |
| nickname | 없음 | `scope_stopper` |
| model / effort | `gpt-5.6-luna / low` | `gpt-5.6-luna / medium` |
| sandbox / approval | read-only / never | read-only / never |
| output | summary | `ROUTINE_WORKER_ROUTE_CHECK_OK` |

Parent와 child effort를 다르게 고정했기 때문에 custom file의 `medium` override가 실제 적용됐음을 구분할 수 있다. Child는 depth 1이고 파일·도구 동작 없이 종료했다.

첫 fresh CLI 시도는 parent와 child가 모두 Terra/medium이었고 child `agent_role`도 null이라 route 증거로 부적합해 제외했다. 두 번째 시도만 decisive smoke로 채택했다.

## 9. Usage 관측

| Run | 판정 | Parent total tokens | Child total tokens | 합계 | cached input ratio |
|---|---|---:|---:|---:|---:|
| 첫 시도 | 제외, route 구분 불가 | 89,312 | 29,411 | 118,723 | 66.2% |
| decisive smoke | PASS | 175,878 | 29,087 | 204,965 | 74.6% |

- `credits_source = unavailable`
- runtime의 직접 credits 값이 없어 token을 credits로 환산하지 않았다.
- fresh CLI parent가 전역 context와 orchestration skill을 다시 읽어 smoke 비용이 크다.
- 같은 형태의 ad-hoc smoke 반복은 사용량 절감 목적에 맞지 않으므로 Phase 4-B에서는 고정 harness와 최소 prompt를 사용한다.

## 10. Worker 실행과 검증

| Lane | Agent thread | Model / effort | Repair | Advisor 판정 |
|---|---|---|---:|---|
| routine agent | `019f49a8-0a4b-7dd2-bb4a-4c1d819f5ead` | Terra/medium | 1 | PASS |
| health-check | `019f49a8-2169-7b53-85ea-baba33ac84b9` | Terra/medium | 1 | PASS |

Brief evidence:

- [routine agent Worker brief](./phase4a-briefs/WB-phase4a-routine-agent-001.md)
- [health-check Worker brief](./phase4a-briefs/WB-phase4a-health-check-001.md)
- [routine agent repair](./phase4a-briefs/RB-phase4a-routine-agent-001-R1.md)
- [health-check repair](./phase4a-briefs/RB-phase4a-health-check-001-R1.md)

Advisor가 직접 수행한 검증:

- checkpoint와 current diff 읽기
- custom agent TOML·ASCII·nickname·route·override parser
- health-check 9 unit tests 재실행
- live health-check 재실행
- AST parse
- unchanged global file hash 확인
- config 동시 변경 분리
- fresh parent/child rollout metadata 직접 파싱

## 11. Risk-based Self-review

자동 반영한 피드백:

| 피드백 | Total | Severity | 처리 |
|---|---:|---|---|
| Health-check가 `sandbox_mode`를 놓치고 공식 schema를 오판 | 6 | high | Worker repair와 regression test 추가 |
| routine result에서 `exception_count` 누락 | 3 | medium | Worker repair로 계약 보강 |
| 수동 점검 문서의 버전 고정 CLI 경로 | 2 | low | 동적 bundled CLI 탐색으로 교체 |

남은 리스크:

| 리스크 | Total | Severity | 처리 |
|---|---:|---|---|
| 현재 앱 API가 custom role 이름을 직접 받지 않음 | 4 | medium | 앱에서는 built-in fallback, fresh CLI는 custom role PASS |
| live 기본값이 외부 변경으로 `gpt-5.6-sol/xhigh`임 | 5 | high | 보존; Phase 4-B 기준선에 명시하고 Phase 5 전에 의도·비용 재판정 |
| fresh CLI smoke의 context token 비용이 큼 | 4 | medium | 반복 금지, 고정 eval harness로 전환 |

확인된 critical 피드백은 없다.

## 12. Rollback

Rollback은 explicit confirmation 후 다음 범위만 수행한다.

1. `routine-worker.toml`을 제거한다.
2. checkpoint의 health-check `SKILL.md`, `references/checks.md`, `scripts/agentic_health_check.py`를 복원한다.
3. 새 `tests/test_agentic_health_check.py`를 제거한다.
4. live `config.toml`은 복원하지 않는다. post-checkpoint `mm-broker` trust 항목과 현재 Sol/xhigh 기본값을 보존한다.
5. `AGENTS.md`, implementation Worker, orchestration skill, sessions, memories, plugins는 건드리지 않는다.

## 13. 다음 Gate

Phase 4-B에서 먼저 GT-04 반복 변환 fixture를 Luna/medium으로 3회 실행해 `pass^3 = 100%`, `exception_count = 0`, scope violation 0을 확인한다. 그 뒤 GT-01~GT-10의 필요한 조합으로 확대하고 credits calibration 상태를 보고한다.
