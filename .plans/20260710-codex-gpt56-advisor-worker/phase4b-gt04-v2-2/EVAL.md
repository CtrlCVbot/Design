# GT-04 v2.2 Live Shell Transport Eval Definition

> Defined before implementation: 2026-07-10 KST<br>
> Fixture ID: `GT04-json-normalization-v2-2-live-shell`<br>
> Probe combination: `GT04-V2-2-LIVE-CAPABILITY-PROBE`<br>
> Diagnostic combination: `GT04-V2-2-LUNA-CUSTOM-DIAGNOSTIC`

## 1. 목적과 변경 경계

v2.1은 local/mock preflight가 PASS했지만 fresh CLI `functions.exec`에서 `tools.exec_command`가 노출되지 않아 child spawn 전에 실패했다. v2.2는 live에서 관측된 `tools.shell_command`로 brief를 JSON-encode해 읽고, no-agent live probe가 실제 capability와 decode를 확인한 뒤에만 custom Worker diagnostic을 실행한다.

- v2.1과 이전 evidence는 수정하지 않는다.
- task, fixture bytes, PowerShell grader, model, 권한과 output rule은 바꾸지 않는다.
- probe와 diagnostic은 별도 fresh CLI parent run이다.
- probe가 FAIL이면 diagnostic을 실행하지 않는다.
- diagnostic은 `trial-01` Worker 한 개만 허용하며 retry와 repair는 0회다.
- strict diagnostic PASS 전에는 `trial-02`, `trial-03`을 실행하지 않는다.

## 2. Source Evidence와 Global Baseline

| Evidence | SHA256 |
|---|---|
| v2.1 `EVAL.md` | `E3E58394F3702285DCA64837DBCC867501CF188B23B7C6BA811FBCE8D4396067` |
| v2.1 `run-result.json` | `F6063323EB43CB51B90041C03E9033506F6C6A5558DEC37CE6BE7025BEE409F1` |
| v2.1 `transport/run-source.mjs` | `39BC52359752B02FDB1B7D2F3F0462534217A4CA0433FE4E6592C52E0B8E29C5` |
| current `C:/Users/beck/.codex/config.toml` | `1A4C9A247B145AF5F354BF5B9046EEEF3DACAB70745316551A286772BD02535A` |

v2.2 fixture의 30 files는 실행 전 v2.1 fixture와 path, size, SHA256이 모두 같아야 한다.

## 3. Shell Transport Contract

`probe-source.mjs`와 `run-source.mjs`는 같은 decode contract를 독립적으로 포함한다.

1. `tools.shell_command`는 PowerShell로 routine brief를 UTF-8 text로 읽는다.
2. PowerShell은 `{ text, sha256 }` object를 `ConvertTo-Json -Compress`로 한 줄 출력한다.
3. Nested tool return은 string이어야 하고 `Exit code: 0`과 단독 `Output:` line을 포함해야 한다.
4. JavaScript는 `Output:` 다음 text를 JSON.parse해 original brief와 SHA256을 복원한다.
5. SHA256은 실행 전 routine brief hash와 같고 text는 `[WORKER BRIEF]` header를 포함해야 한다.
6. Source code에는 raw Worker brief, backslash, JavaScript backtick, interpolation sequence가 없어야 한다.

## 4. No-agent Live Capability Probe

Fresh CLI parent는 `gpt-5.6-luna/low`, `workspace-write`, approval `never`로 `probe-source.mjs`를 정확히 한 번 실행한다.

Probe source는:

- `ALL_TOOLS`와 `typeof`로 `tools.shell_command`, `tools.multi_agent_v1__spawn_agent`, `tools.multi_agent_v1__wait_agent` 노출을 확인한다.
- 실제 `tools.shell_command`로 routine brief JSON transport와 hash 복원을 수행한다.
- `spawn_agent`, `wait_agent`, file edit를 호출하지 않는다.
- PASS JSON에 tool names, return type, brief hash, brief character count를 기록한다.

Probe PASS 조건:

- source parse와 실행 exception 0.
- required three tools가 모두 function이다.
- brief hash와 header가 일치한다.
- child rollout 0, fixture/global hash drift 0.

## 5. Diagnostic Source

Probe PASS 후 별도 fresh CLI parent가 `run-source.mjs`를 한 번 실행한다.

- 같은 shell decoder로 routine brief를 복원한다.
- `tools.multi_agent_v1__spawn_agent`를 `agent_type: "routine_worker"`, `fork_context: false`, `message: payload.text`로 한 번 호출한다.
- model, reasoning effort, service tier override는 전달하지 않는다.
- global `notify`로 child identity를 즉시 기록한다.
- `tools.multi_agent_v1__wait_agent`를 `targets: [child.agent_id]`, `timeout_ms: 300000`으로 한 번 호출한다.
- 다른 role, 직접 구현, retry, repair를 금지한다.

## 6. Mechanical Output Rule

1. input은 `id`, `name`, `tags`를 가진 JSON object다.
2. `id`, `name`은 string이고 `tags`는 string array여야 한다.
3. `slug`는 name trim, whitespace-run collapse to hyphen, lowercase 결과다.
4. tag는 trim/lowercase하고 blank를 제거한다.
5. normalized tag는 first-seen order로 stable dedupe한다.
6. 다른 semantic value는 보존한다.
7. key-sorted, indent 2, ASCII JSON과 trailing LF 1개로 serialize한다.

Expected 또는 baseline file을 trial에 복사하는 것은 금지한다.

## 7. Strict Diagnostic Gate

- actual child 1개, role `routine_worker`.
- model/effort `gpt-5.6-luna/medium`.
- first attempt PowerShell acceptance exit 0, mismatches 0.
- `exception_count = 0`.
- 변경은 `fixture/trial-01/records/*.json` 4개뿐이다.
- global hash drift, scope violation, write conflict, retry, repair가 모두 0이다.
- commit, push, PR, deploy, publish, global edit가 없다.

실행 전 eval, briefs, fixture, transport source/tests와 global files를 manifest에 고정한다. Advisor는 probe와 diagnostic parent/child rollout, grader, scope, global hash와 usage를 독립 검증한다. credits가 관측되지 않으면 `null`이며 0으로 환산하지 않는다.
