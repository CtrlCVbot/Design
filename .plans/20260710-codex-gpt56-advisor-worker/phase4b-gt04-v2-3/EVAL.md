# GT-04 v2.3 App-local Bundle Eval Definition

> Defined before implementation: 2026-07-10 KST<br>
> Fixture ID: `GT04-json-normalization-v2-3-app-local-bundle`<br>
> Probe combination: `GT04-V2-3-APP-LOCAL-CAPABILITY-PROBE`<br>
> Diagnostic combination: `GT04-V2-3-LUNA-CUSTOM-DIAGNOSTIC`

## 1. 목적과 변경 경계

v2.2는 local transport가 PASS했지만 `.sandbox-bin/codex.exe` 옆에 `codex-code-mode-host.exe`가 없어 probe source 실행 전에 실패했다. v2.3은 같은 버전의 완전한 app-local CLI bundle을 사용해 runtime packaging을 먼저 검증하고, no-agent probe가 PASS할 때만 custom `routine_worker` diagnostic을 한 번 실행한다.

- v2.2와 이전 evidence는 수정하지 않는다.
- task, fixture bytes, output rule, model, effort, sandbox와 권한은 바꾸지 않는다.
- app-local bundle path와 executable 4개의 size/SHA256을 실행 전 고정한다.
- runtime preflight, probe, diagnostic은 각각 별도 gate다.
- probe FAIL이면 diagnostic을 실행하지 않는다.
- diagnostic은 `trial-01` Worker 한 개만 허용하며 retry와 repair는 0회다.
- strict diagnostic PASS 전에는 `trial-02`, `trial-03`을 실행하지 않는다.

## 2. Source Evidence와 Baseline

| Evidence | SHA256 |
|---|---|
| v2.2 `EVAL.md` | `DF643891F11FC9843AC41B4FCC667D4636B1CA75EFE71D51CAF736A377FDEB11` |
| v2.2 `probe-result.json` | `9AAA5491984F2C5BCE5C1505A18B851B476731E9AC93F6CFF06190269112DE1E` |
| v2.2 `transport/probe-source.mjs` | `265180EDA388E2F69AD5A094D6A6044B212A45C14B1673ADD7FA641472556209` |
| v2.2 `transport/run-source.mjs` | `9B64604B21BEC3A63F24E63CB0F77433432FF9E865DF9F9B449788DA35599A76` |
| current global `AGENTS.md` | `49E40BD1E4C84AC52BFE87A0E77AB0DCD55411E702F51649DA3976EC2CC4092E` |
| current orchestration `SKILL.md` | `F75E6BAAAB9F4D6F847C3764AAE1ED90ECC6F8C6535DD1D4B668390C1F42BD46` |

v2.3 fixture의 30 files는 실행 전 v2.2 fixture와 path, size, SHA256이 모두 같아야 한다.

## 3. App-local Runtime Gate

Bundle root: `C:/Users/beck/AppData/Local/OpenAI/Codex/bin/a7c12ebff69fb123`

| File | Bytes | SHA256 |
|---|---:|---|
| `codex.exe` | 341269296 | `B88F944EF63556527CAAE2AD43F80B88B8BE174DC09B09D9B037FC94240A0E91` |
| `codex-code-mode-host.exe` | 53593904 | `47D4F085833502BDA816607121FA3B9B2D3381F8511A43757F0D77F4760DDEB3` |
| `codex-command-runner.exe` | 1271600 | `01A582479BF7D31E3EF3F2CBA5BB22DBA5A1D5542CE850B44BBE0217BB4A327E` |
| `codex-windows-sandbox-setup.exe` | 8821040 | `5FBFC00734EBB13DC6E0D0323ABE130AD75A979F59A3B84299BDD48A67844FB2` |

Runtime PASS 조건:

- 4 files가 sibling으로 존재하고 size/SHA256이 일치한다.
- `codex.exe --version`이 exit 0과 `codex-cli 0.144.0-alpha.4`를 출력한다.
- PATH alias, WindowsApps executable, `.sandbox-bin` copy를 사용하지 않는다.
- runtime file을 복사, 수정, 삭제하지 않는다.

## 4. Route Observability Contract

전역 `AGENTS.md`와 orchestration skill은 비단순 산출물 시작 전에 다음 필드를 공개하도록 한다.

```text
Advisor/Worker route
- mode: direct | delegated
- advisor: <model>/<effort> | unavailable
- worker: none | <role> (<model>/<effort> | config-derived)
- orchestration skill: invoked | not-invoked
- reason: <matched trigger or exclusion>
```

Contract 조건:

- 단순 질의는 생략할 수 있다.
- docs-only direct route도 비단순 산출물이면 `direct`, `worker: none`, `not-invoked`를 공개한다.
- delegated route는 spawn 전 configured model을 표시하고 closeout에서 actual model/effort를 evidence로 정정한다.
- 알 수 없는 main model/effort를 추측하지 않고 `unavailable`로 표시한다.
- 이 변경은 docs-only를 자동 위임 대상으로 확대하지 않는다.

## 5. No-agent Live Capability Probe

Fresh CLI parent는 app-local `codex.exe`, `gpt-5.6-luna/low`, `workspace-write`, approval `never`로 `probe-source.mjs`를 정확히 한 번 실행한다.

Probe source는:

- `ALL_TOOLS`와 `typeof`로 `tools.shell_command`, `tools.multi_agent_v1__spawn_agent`, `tools.multi_agent_v1__wait_agent` 노출을 확인한다.
- 실제 `tools.shell_command`로 routine brief JSON transport와 hash 복원을 수행한다.
- `spawn_agent`, `wait_agent`, file edit를 호출하지 않는다.
- PASS JSON에 tool names, return type, brief hash, brief character count를 기록한다.

Probe PASS 조건:

- parent source read와 exact source 실행 exception 0.
- required three tools가 모두 function이다.
- brief hash와 header가 일치한다.
- child rollout 0, fixture/global hash drift 0.

## 6. Diagnostic Gate

Probe PASS 후 별도 fresh CLI parent가 `run-source.mjs`를 한 번 실행한다.

- 같은 shell decoder로 routine brief를 복원한다.
- `agent_type: "routine_worker"`, `fork_context: false`, `message: payload.text`로 spawn 한 번만 호출한다.
- model, reasoning effort, service tier override를 전달하지 않는다.
- global `notify`로 child identity를 기록하고 wait 한 번만 호출한다.
- actual child 1개, role `routine_worker`, model/effort `gpt-5.6-luna/medium`이어야 한다.
- first-attempt acceptance가 exit 0, `PASS`, mismatches 0이어야 한다.
- 변경은 `fixture/trial-01/records/*.json` 4개뿐이어야 한다.
- exception, global drift, scope violation, write conflict, retry, repair가 모두 0이어야 한다.

실행 전 Advisor는 eval, briefs, fixture, transport, global policy와 runtime bundle을 manifest에 고정한다. Credits가 관측되지 않으면 `null`이며 0으로 환산하지 않는다.
