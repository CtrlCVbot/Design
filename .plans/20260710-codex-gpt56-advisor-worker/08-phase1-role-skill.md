# 08. Phase 1 역할 정책과 skill 실행 결과

> 실행일: 2026-07-10 KST
> 범위: 얇은 전역 Advisor/Worker 정책, orchestration skill, trigger·brief·repair·검증 smoke
> 판정: **완료, 공식 quick validator 의존성 제한 있음**

## 1. 결론

- 전역 `AGENTS.md`에 9개 규칙으로 구성된 Advisor/Worker 라우팅 섹션을 추가했다.
- `C:\Users\beck\.agents\skills\advisor-worker-orchestration` skill을 설치했다.
- 비단순 구현은 `$advisor-worker-orchestration`을 명시적으로 읽고 완전한 pre-spawn brief를 만든 뒤 Worker에 위임한다.
- 단순 질의, 명시적 `docs-only`·`review-only`, 명확한 저위험 한두 줄 수정은 write Worker를 자동 생성하지 않는다.
- Worker 보고는 승인으로 간주하지 않으며 Advisor가 G0~G7을 직접 확인한다.
- `config.toml`, 기본 모델, reasoning effort, service tier, `[agents]`, custom agent, hook, plugin은 변경하지 않았다.

## 2. 변경 표면

| 파일 | 변경 | SHA256 |
|---|---|---|
| `C:\Users\beck\.codex\AGENTS.md` | 92줄에서 103줄, 얇은 역할·경계·검증 라우팅 추가 | `49E40BD1E4C84AC52BFE87A0E77AB0DCD55411E702F51649DA3976EC2CC4092E` |
| `C:\Users\beck\.agents\skills\advisor-worker-orchestration\SKILL.md` | brief, Agent 실행, 격리, 병렬 소유권, G0~G7, repair, fallback | `6EF444CCD43E588ACA72B60C555E21462578A8F3A3F166CE33139C91CB8548FA` |
| `C:\Users\beck\.agents\skills\advisor-worker-orchestration\agents\openai.yaml` | UI 이름, 설명, 기본 prompt | `E0783D16133518A80320DA377C895DE51CD367E47B84820497B143EBBE5D96FF` |

초기 Worker 초안과 repair 이력은 `.plans/20260710-codex-gpt56-advisor-worker/phase1-draft`에 보존했다.

## 3. 전역 정책

전역 `AGENTS.md`에는 다음 결정만 둔다.

1. 비단순 구현과 안전한 subagent 경로가 있으면 `$advisor-worker-orchestration`을 명시적으로 사용한다.
2. Advisor는 요구사항, 설계, 분해, brief, 독립 검증, 승인, 사용자 보고를 소유한다.
3. Worker는 구현과 테스트만 수행하고 commit, push, PR, deploy, publish, production write를 하지 않는다.
4. 사용자와 프로젝트 지침이 우선하며 `docs-only`·`review-only`를 write 작업으로 확대하지 않는다.
5. 한두 줄의 명확한 저위험 수정은 직접 처리한다.
6. 병렬 write는 disjoint ownership과 공유 상태 owner/직렬 규칙이 있을 때만 허용한다.
7. Worker `complete` 보고는 승인 근거가 아니다.
8. 실패는 증거 기반 repair brief로 재위임한다.
9. subagent 또는 안전한 격리가 없으면 실제 실행 방식을 숨기지 않고 순차 처리한다.

전체 절차와 템플릿은 skill로 분리해 전역 파일이 core-sized를 유지하도록 했다.

## 4. Skill 계약

### Trigger

| 요청 | 판정 |
|---|---|
| 범위·테스트·workspace를 고정할 수 있는 비단순 구현 | Worker 위임 후보 |
| 서로 독립적인 탐색·분석 | read-only 병렬 보조 후보 |
| 단순 질의 | 직접 처리 |
| 명시적 `docs-only`·`review-only` | write Worker 금지 |
| 명확한 저위험 한두 줄 수정 | 직접 처리 |
| 안전한 격리 또는 완전한 brief 불가 | 위임 중단 또는 순차 fallback |

### Worker Brief

pre-spawn brief는 다음 18개 상위 필드를 유지한다.

`brief_id`, `role`, `runtime_agent`, `objective`, `why`, `known_context`, `allowed_paths`, `forbidden_paths`, `workspace_isolation`, `shared_write_state`, `allowed_commands`, `conventions`, `known_pitfalls`, `acceptance_criteria`, `required_tests`, `parallel_ownership`, `stop_conditions`, `report_format`

필드와 하위 키를 요약, 이름 변경, 병합, 축약, 누락하지 않는다. 해당 값이 없으면 필드를 제거하지 않고 `none` 또는 `unavailable`과 이유를 남긴다.

### Advisor Verification

| Gate | 검증 |
|---|---|
| G0 | repo, branch, dirty state, nested repo, 격리 |
| G1 | 변경 파일과 `allowed_paths` 비교 |
| G2 | scoped diff 직접 확인 |
| G3 | focused test 재실행 |
| G4 | blast radius 기반 회귀 test/build |
| G5 | 프로젝트 지침과 acceptance criteria 대조 |
| G6 | staged/commit 후보에서 unrelated 변경 제외 |
| G7 | 명시적 사용자 요청이 있을 때만 commit/push |

## 5. Worker 초안과 Repair Loop

| 단계 | 결과 |
|---|---|
| 최초 draft | Terra/medium Worker가 AGENTS 섹션, SKILL.md, openai.yaml 초안 생성 |
| Advisor review | 실제 Agent 실행 단계, 직접 수정 제한, UTF-8 UI metadata를 보강 |
| discovery smoke 1 | skill 이름과 worker 판정은 맞았지만 도구 금지 harness에서 brief가 축약됨 |
| R1 | `$advisor-worker-orchestration` 명시 호출과 no-summary/no-omit 계약 추가 |
| harness correction | skill 상세 파일을 읽어야 하므로 read-only tool은 허용해야 함을 확인 |
| encoding finding | Windows 기본 `Get-Content`에서 한국어 skill 본문이 mojibake로 표시됨 |
| R2 | 내부 SKILL.md를 ASCII로 전환하고 Agent 실행, 직접 수정 제한, fallback을 보존 |
| final smoke | 기본 PowerShell 읽기와 complete brief 모두 PASS |
| R3 | 중복 설명을 압축해 6,254자, health-check `0 long`으로 조정 |

Worker thread: `019f4961-a44d-7950-8f79-1eae71924205`

## 6. 검증 결과

| 검증 | 결과 | 증거 |
|---|---|---|
| `agentic-health-check` | PASS | AGENTS 103줄 core-sized, skills 67, duplicate 0, stale reference 0 |
| config 불변 | PASS | SHA256 `5B16E56FF4279422E9FF4E92B641C0C26D41B3378A51363AA5BC124A0865557E` |
| skill frontmatter | PASS | `name`, `description`만 존재 |
| Worker brief static contract | PASS | 18/18 상위 필드, 하위 안전 필드 보존 |
| Advisor gates | PASS | G0~G7 존재 |
| stale runtime reference | PASS | Claude/Gemini/Opus 0건 |
| openai.yaml static | PASS | 문자열 인용, short description 26자, `$advisor-worker-orchestration` 포함 |
| Windows default read | PASS | SKILL.md ASCII, 기본 읽기와 UTF-8 읽기 일치 |
| positive forward test | PASS | Terra/medium, 완전한 구현 brief 생성 |
| boundary·repair test | PASS | Luna/medium, 한 줄·review-only write 위임 없음, repair brief 생성 |
| fresh CLI discovery | PASS | `019f496f-2a1d-7c63-9478-3b8da3bb08b4`, skill 자동 선택, 18개 필드 brief |
| 공식 `quick_validate.py` | BLOCKED | 현재 번들 Python에 `PyYAML`이 없어 `ModuleNotFoundError: yaml` |

공식 quick validator 실패는 skill 구조 오류가 아니라 validator의 미설치 의존성이다. 설치나 system skill 수정으로 범위를 넓히지 않고, health-check와 표준 라이브러리 기반 동등 검사를 사용했다.

## 7. Phase 1 Gate 판정

| Gate | 판정 |
|---|---|
| 전역 `AGENTS.md` core-sized | PASS, 103줄 |
| 단순 질의 오발동 방지 | PASS |
| `docs-only`·`review-only` write 경계 | PASS |
| 실제 구현 task의 완전한 brief | PASS |
| repair evidence와 G0~G7 | PASS |
| Phase 2 설정 미선행 | PASS |

Phase 1은 완료 상태다. `quick_validate.py` 의존성 문제는 별도 tooling 개선 후보이며 Phase 2를 차단하지 않는다.

## 8. 롤백

1. 전역 `AGENTS.md`는 Phase 0 checkpoint의 `AGENTS.md` 한 파일만 복원한다.
2. `C:\Users\beck\.agents\skills\advisor-worker-orchestration` 디렉터리만 제거한다.
3. `config.toml`, 기존 skills, plugins, memories, sessions, hook trust는 건드리지 않는다.
4. 롤백 후 `agentic-health-check`에서 AGENTS 92줄, skills 66개 기준선으로 돌아오는지 확인한다.

## 9. Runtime 반영

- health-check와 fresh CLI는 설치된 skill을 이미 발견한다.
- 현재 실행 중인 긴 task는 시작 시점의 skill inventory가 남을 수 있다.
- implicit trigger를 가장 확실히 확인하려면 새 Codex task에서 비단순 구현 요청을 실행한다. 앱 전체 재설치는 필요하지 않다.

## 10. 다음 Gate

Phase 2에서만 Terra/medium `implementation_worker`와 `[agents]` 제한을 추가한다. agent 파일 생성과 `config.toml` 변경은 한 번에 묶지 않고 각각 적용·검증하며, 현재 기본 모델과 `service_tier`는 계속 유지한다.
