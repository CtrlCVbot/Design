# GT-04 v2.1 Brief Transport Eval Definition

> Defined before implementation: 2026-07-10 KST<br>
> Fixture ID: `GT04-json-normalization-v2-1-transport`<br>
> Combination: `GT04-V2-1-LUNA-CUSTOM-DIAGNOSTIC`<br>
> Parent: fresh CLI `gpt-5.6-luna/low`<br>
> Worker: custom `routine_worker`, `gpt-5.6-luna/medium`

## 1. 목적과 변경 경계

GT-04 v2 diagnostic은 PowerShell harness 실행 전에 parent가 raw Windows path를 JavaScript template literal에 넣어 child spawn이 실패했다. v2.1은 task, fixture bytes, grader, model, 권한, Worker 역할과 output rule을 바꾸지 않고 brief transport만 교체한다.

- v2 evidence와 result는 수정하지 않는다.
- v2.1은 별도 `phase4b-gt04-v2-1` snapshot에서 실행한다.
- 먼저 `trial-01` custom Worker 한 개만 실행한다.
- retry와 repair는 0회다.
- strict diagnostic이 PASS하기 전에는 `trial-02`, `trial-03`을 실행하지 않는다.

## 2. Source Evidence와 Global Baseline

| Evidence | SHA256 |
|---|---|
| v2 `EVAL.md` | `78C8D30AFB0BF0A6E282DFEE7D15746F99015520C0F5356D57B4D3004616E490` |
| v2 `run-result.json` | `7CE113F4978BBFC260D53C84CCE9752BB457828FB99D7CE095D288D70C9242EF` |
| v2 `verify_gt04.ps1` | `B17DA517AE644B4E43A2C41CB51CE9B0852F2F84409C1103FF89601656EA394B` |
| current `C:/Users/beck/.codex/config.toml` | `1A4C9A247B145AF5F354BF5B9046EEEF3DACAB70745316551A286772BD02535A` |

v2.1 fixture의 30 files는 실행 전 v2 fixture와 path, size, SHA256이 모두 같아야 한다.

## 3. Structured Transport Contract

`transport/run-source.mjs`가 fresh CLI parent의 `functions.exec` source of truth다.

1. source는 `tools.exec_command`로 `briefs/trial-01.md`를 raw UTF-8 text로 읽는다.
2. source code에는 Worker brief 본문이나 `[WORKER BRIEF]`가 포함되지 않는다.
3. `spawn_agent`는 `agent_type: "routine_worker"`, `fork_context: false`, `message: read.output`을 사용한다.
4. model, reasoning effort, service tier override를 전달하지 않는다.
5. spawn 결과를 즉시 `notify`한 뒤 같은 child를 `wait_agent`로 한 번 기다린다.
6. spawn, wait, read 실패 시 예외를 그대로 반환하며 다른 role이나 직접 구현으로 대체하지 않는다.

Routine brief transport safety:

- absolute path는 forward slash만 사용한다.
- backslash, JavaScript backtick, `${` sequence가 0개여야 한다.
- `run-source.mjs`도 backslash와 JavaScript template literal을 사용하지 않는다.
- raw multiline brief를 JavaScript string literal에 보간하지 않는다.

## 4. Parse-only Preflight

`transport/test_transport.ps1`은 실제 agent를 spawn하지 않고 다음을 검증한다.

1. `node --check transport/run-source.mjs`가 exit 0이다.
2. routine brief forbidden character count가 0이다.
3. source에 `message: read.output`과 custom role이 정확히 1개 있다.
4. source에 raw Worker brief, template literal, model/effort/service override가 없다.
5. source가 spawn 1회와 wait 1회만 정의한다.
6. preflight 전후 v2.1 file count와 SHA256이 같다.

Preflight가 하나라도 실패하면 fresh CLI를 실행하지 않는다.

## 5. Mechanical Output Rule

v2와 동일하다.

1. input은 `id`, `name`, `tags`를 가진 JSON object다.
2. `id`, `name`은 string이고 `tags`는 string array여야 한다.
3. `slug`는 name trim, whitespace-run collapse to hyphen, lowercase 결과다.
4. tag는 trim/lowercase하고 blank를 제거한다.
5. normalized tag는 first-seen order로 stable dedupe한다.
6. 다른 semantic value는 보존한다.
7. key-sorted, indent 2, ASCII JSON과 trailing LF 1개로 serialize한다.

Expected 또는 baseline file을 trial에 복사하는 것은 금지한다.

## 6. Diagnostic Acceptance

Worker는 fixture root의 현재 PowerShell process에서 process-scoped execution policy만 허용하고 다음 grader를 실행한다.

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
$result = & ./verify_gt04.ps1 -Trial trial-01 | ConvertFrom-Json
$result | ConvertTo-Json -Compress -Depth 4
if ($result.status -ne 'PASS' -or [int]$result.mismatches -ne 0) { exit 1 }
```

Strict PASS 조건:

- actual child 1개, role `routine_worker`.
- model/effort `gpt-5.6-luna/medium`.
- first attempt acceptance exit 0, mismatches 0.
- `exception_count = 0`.
- 변경은 `fixture/trial-01/records/*.json` 4개뿐이다.
- global hash drift, scope violation, write conflict, retry, repair가 모두 0이다.
- commit, push, PR, deploy, publish, global edit가 없다.

## 7. Evidence와 중단 조건

실행 전에 eval, briefs, fixture, transport source, tests와 global files를 manifest에 고정한다. Advisor는 parent/child rollout metadata, grader, changed-file set, global hash와 usage를 독립 검증한다.

Transport preflight 또는 strict diagnostic이 실패하면 결과를 보존하고 remaining trials와 Phase 5를 중단한다. credits가 관측되지 않으면 `null`이며 0으로 환산하지 않는다.
