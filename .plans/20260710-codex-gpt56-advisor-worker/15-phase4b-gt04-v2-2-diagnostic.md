# 15. Phase 4-B GT-04 v2.2 Live Shell Probe 결과

> 실행일: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v2-2-live-shell`<br>
> Combination: `GT04-V2-2-LIVE-CAPABILITY-PROBE`<br>
> 판정: **FAIL, code-mode host 시작 실패로 diagnostic 미실행**

## 1. 결론

v2.2의 source, fixture, mock transport는 Advisor 검증을 통과했다. 그러나 fresh CLI parent를 시작한 `.sandbox-bin` bundle에는 `codex-code-mode-host.exe`가 없었다. Parent의 첫 `functions.exec` 호출이 source를 읽기도 전에 host spawn 오류로 종료됐다.

따라서 이번 결과는 `tools.shell_command` 계약의 실패가 아니다. live source가 실행되지 않아 required tool 3종의 실제 노출 여부는 **미확인**이다. Eval의 stop rule에 따라 custom `routine_worker` diagnostic은 실행하지 않았다.

| 구분 | 결과 | 판정 |
|---|---:|---|
| source parse | 2/2 | PASS |
| transport static/mock tests | 6/6 | PASS |
| fixture grader tests | 5/5 | PASS |
| initial trial-01 | mismatches 4 | PASS, 미실행 기준선 |
| no-agent live probe | code-mode host file not found | FAIL |
| actual spawn call / child | 0 / 0 | PASS, stop rule 준수 |
| diagnostic | 미실행 | PASS, probe FAIL gate 준수 |
| frozen/global hash drift | 0 / 0 | PASS |
| retry / repair | 0 / 0 | first-attempt 보존 |

CLI exit code 0은 parent turn이 정상 종료됐다는 뜻일 뿐이다. Probe source 자체는 실행되지 않았으므로 v2.2 gate는 FAIL이다.

## 2. 구현과 Advisor 검증

- Eval: [EVAL.md](./phase4b-gt04-v2-2/EVAL.md)
- Routine brief: [trial-01.md](./phase4b-gt04-v2-2/briefs/trial-01.md)
- Probe source: [probe-source.mjs](./phase4b-gt04-v2-2/transport/probe-source.mjs)
- Diagnostic source: [run-source.mjs](./phase4b-gt04-v2-2/transport/run-source.mjs)
- Transport tests: [test_transport.ps1](./phase4b-gt04-v2-2/transport/test_transport.ps1)
- Pre-probe manifest: [pre-probe-manifest.json](./phase4b-gt04-v2-2/pre-probe-manifest.json)
- Structured result: [probe-result.json](./phase4b-gt04-v2-2/probe-result.json)

Terra/medium implementation Worker `019f49ed-81db-70a0-9889-52d372b9e229`가 v2.2 fixture와 transport source를 구현했다. Advisor는 완료 보고를 그대로 승인하지 않고 다음을 다시 실행했다.

| 검증 | 결과 |
|---|---|
| `node --check` | PASS, source 2개 |
| transport tests | PASS, 6/6 |
| PowerShell grader self-test | PASS, 5/5 |
| v2.1 fixture parity | PASS, 30 files |
| probe spawn/wait static prohibition | PASS |
| source raw brief/backslash/backtick/interpolation 금지 | PASS |
| pre-probe manifest | PASS, 39 files + global 6 files |

manifest 생성 중 Windows path length를 잘못 계산해 상대 경로가 잘리는 문제를 Advisor 검증이 한 번 잡았다. Probe 시작 전에 manifest를 재생성하고 전수 해시 PASS를 확인했으므로 실행 evidence에는 오염이 없다.

## 3. Fresh CLI Probe

| 항목 | 값 |
|---|---|
| Parent thread | `019f49f5-4734-7182-8832-435f6141deff` |
| Parent model / effort | `gpt-5.6-luna` / `low` |
| CLI version | `0.144.0-alpha.4` |
| CLI path | `C:/Users/beck/.codex/.sandbox-bin/codex.exe` |
| sandbox / approval | `workspace-write` / `never` |
| `functions.exec` call | 1회 |
| actual spawn call / child | 0 / 0 |
| diagnostic run | 0 |

Parent는 `probe-source.mjs`를 raw UTF-8로 읽기 위해 `functions.exec` 안에서 `tools.shell_command`를 호출하려 했다. JavaScript source 평가 전에 runtime이 sibling host를 시작하는 단계에서 실패했다.

```text
failed to spawn code-mode host
C:\Users\beck\.codex\.sandbox-bin\codex-code-mode-host.exe
지정된 파일을 찾을 수 없습니다. (os error 2)
```

Rollout의 `turn_context`로 parent가 `gpt-5.6-luna/low`였음을 Advisor가 확인했다. Parent 최종 메시지의 `GPT-5 / 미확인` 표기는 self-report 오류이며 evidence 판정에는 사용하지 않았다.

PATH가 가리킨 WindowsApps `codex.exe`는 `Access is denied`로 thread 생성 전에 실패했다. 이 launcher preflight는 probe trial로 계산하지 않았다. 이후 실행 가능한 `.sandbox-bin/codex.exe`로 eligible probe를 한 번만 수행했고 retry하지 않았다.

## 4. Root Cause와 Remediation

직접 원인은 **불완전한 CLI bundle 선택**이다.

| 경로 | `codex.exe` | code-mode host | 결과 |
|---|---|---|---|
| WindowsApps resources | 존재 | 존재 | 실행 권한 거부 |
| `C:/Users/beck/.codex/.sandbox-bin` | 존재 | 없음 | CLI 시작 후 `functions.exec` 실패 |
| `C:/Users/beck/AppData/Local/OpenAI/Codex/bin/a7c12ebff69fb123` | 존재 | 존재 | `codex --version` PASS |

앱 로컬 bundle은 같은 `codex-cli 0.144.0-alpha.4`이며 `codex.exe`, `codex-code-mode-host.exe`, command runner, sandbox setup을 함께 가진다. v2.3은 이 완전한 bundle을 manifest에 고정하고 시작해야 한다.

이 결과로 확인된 범위:

- v2.2 JavaScript/PowerShell transport의 local 계약은 유효하다.
- fresh CLI의 code-mode host resolution은 executable sibling 배치에 의존한다.
- required nested tools의 live 노출은 아직 판정하지 못했다.
- Worker model routing과 JSON task 품질은 이번 run에서 평가되지 않았다.

## 5. Scope와 Usage

Pre-probe manifest SHA256: `D8EF1C22D0969898A9B627A942E6DBFB2C57F0AC90FE12D0674909BE03E9F65C`

| 검사 | 결과 |
|---|---:|
| frozen files checked / drift | 39 / 0 |
| global files checked / drift | 6 / 0 |
| trial-01 post-probe mismatch | 4 |
| child rollout | 0 |
| Worker file changes | 0 |

| Thread | Input | Cached input | Output | Reasoning | Total |
|---|---:|---:|---:|---:|---:|
| Parent only | 57,874 | 37,376 | 620 | 314 | 58,494 |

- Cached input ratio: 64.58%
- Wall time: 11.803 seconds
- Child usage: 없음
- `credits_source = unavailable`
- `total_credits = null`

## 6. Risk-based Self-review

| 리스크 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| CLI executable만 확인하고 companion host 존재를 preflight하지 않음 | 3 | 2 | 1 | 6 | high | v2.2 FAIL 보존, v2.3 bundle manifest gate 추가 |
| PATH의 WindowsApps 실행 권한과 실제 bundle 경로가 다름 | 2 | 2 | 1 | 5 | high | app-local executable 절대 경로 사용 |
| Parent self-report가 model/effort를 잘못 표시 | 2 | 1 | 1 | 4 | medium | rollout `turn_context`를 SSOT로 유지 |
| Tool capability 미확인을 transport 실패로 오판할 수 있음 | 2 | 2 | 1 | 5 | high | 판정을 `runtime packaging FAIL`로 한정 |

확인된 critical 리스크는 없다. Probe gate를 우회하지 않았고 Remaining trials와 Phase 5는 승인하지 않는다.

## 7. 다음 Gate

다음 실험은 기존 v2.2 evidence를 수정하지 않는 `GT-04 v2.3 app-local bundle diagnostic`으로 분리한다.

1. 앱 로컬 bundle의 CLI와 companion executable 4개 path, size, SHA256을 실행 전 manifest에 고정한다.
2. `codex --version`과 `codex-code-mode-host.exe` 존재를 no-agent runtime preflight로 확인한다.
3. 같은 v2.2 `probe-source.mjs`를 app-local CLI에서 한 번 실행한다.
4. Probe PASS일 때만 별도 fresh parent에서 `run-source.mjs` diagnostic을 한 번 실행한다.
5. Probe 또는 diagnostic FAIL 시 retry 없이 evidence를 보존한다.

Phase 4-B는 **진행 중, app-local bundle 재검증 필요** 상태다.
