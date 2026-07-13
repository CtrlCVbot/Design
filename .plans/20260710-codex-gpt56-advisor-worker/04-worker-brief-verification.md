# 04. Worker brief와 Advisor 검증 계약

## 1. Worker brief 최소 계약

Worker는 메인 세션이 이미 파악한 내용을 다시 처음부터 탐색하지 않아야 한다. 모든 구현 위임에는 다음 필드가 필요하다.

| 필드 | 필수 | 내용 |
|---|---|---|
| `brief_id` | Yes | 추적 가능한 ID, 예: `WB-auth-refresh-001` |
| `role` | Yes | `implementation_worker` 또는 `routine_worker` |
| `objective` | Yes | 구현할 결과를 한 문장으로 설명 |
| `why` | Yes | 이 변경이 필요한 이유 |
| `known_context` | Yes | Advisor가 확인한 구조, 현재 동작, 관련 결정 |
| `allowed_paths` | Yes | 수정 가능한 파일 또는 디렉터리 |
| `forbidden_paths` | Yes | 건드리면 안 되는 파일, unrelated WIP |
| `workspace_isolation` | Yes | disposable fixture, 전용 clean worktree, 또는 단일 Worker 기존 worktree |
| `shared_write_state` | Yes | lockfile, generated output, build cache, test DB 등 명시 경로 밖 쓰기 상태 |
| `allowed_commands` | Yes | 실행 가능한 test/build와 외부 상태를 바꾸지 않는 명령 |
| `conventions` | Yes | 프로젝트 `AGENTS.md`, TDD, 네이밍, 아키텍처 규칙 |
| `known_pitfalls` | Yes | 인코딩, nested repo, shared file, migration 등 |
| `acceptance_criteria` | Yes | 테스트 가능한 완료 조건 |
| `required_tests` | Yes | Worker가 먼저 실행할 명령과 기대 결과 |
| `parallel_ownership` | Conditional | 병렬 Worker가 있을 때 독점 파일 범위 |
| `stop_conditions` | Yes | 설계 변경, 범위 밖 수정, 위험 명령 등 즉시 중단 조건 |
| `report_format` | Yes | 변경 파일, 테스트, 미해결 리스크, 질문 |

## 2. 구현 Worker brief 템플릿

```text
[WORKER BRIEF]
brief_id: WB-<slug>-<seq>
role: implementation_worker

objective:
- <완료해야 할 결과>

why:
- <사용자 가치 또는 현재 문제>

known_context:
- repo root: <absolute path>
- repo state: <fixture id 또는 clean worktree ref>
- current behavior: <확인한 현재 동작>
- architecture decision: <Advisor가 확정한 설계>
- relevant files: <경로와 역할>

allowed_paths:
- <수정 허용 경로>

forbidden_paths:
- <수정 금지 경로>
- unrelated existing changes

workspace_isolation:
- mode: disposable_fixture | dedicated_clean_worktree | existing_single_worker
- production credentials: unavailable
- real remote writes: forbidden

shared_write_state:
- lockfiles: <owner 또는 forbidden>
- generated outputs: <owner 또는 forbidden>
- build/test cache: <isolated path 또는 serial-only>
- test database: <isolated instance 또는 serial-only>

allowed_commands:
- <read/test/build command>
- no commit, push, PR, deploy, package publish, or production write

conventions:
- <적용할 AGENTS.md/skill/테스트/네이밍 규칙>

known_pitfalls:
- <재탐색을 줄이기 위한 알려진 함정>

acceptance_criteria:
- [ ] <관찰 가능한 결과 1>
- [ ] <관찰 가능한 결과 2>

required_tests:
- <command 1> -> expected: PASS
- <command 2> -> expected: PASS

parallel_ownership:
- worker owns only: <paths>
- shared files/state: do not edit; report needed changes to Advisor

stop_conditions:
- acceptance criteria requires architecture change
- allowed_paths 밖 수정이 필요함
- destructive command, production deployment, secret access가 필요함
- existing user change와 충돌함

report_format:
1. changed files and why
2. tests run and exact result
3. assumptions made
4. unresolved risks or blocked items
5. no commit, push, PR, or deployment
```

## 3. Routine Worker 축약 템플릿

Luna Worker에는 해석 여지를 줄인 축약 brief를 사용한다.

```text
[ROUTINE WORKER BRIEF]
brief_id: WB-<slug>-<seq>
objective: <정형 변환 한 문장>
input_paths: <대상>
output_rule: <기계적으로 적용할 규칙>
do_not_change: <금지 경로/동작>
acceptance_check: <명령 또는 패턴 검사>
stop_if: 규칙으로 판단할 수 없는 예외가 1건이라도 발생
report: changed files, exception count, check result
```

Routine Worker가 설계 판단을 요청하면 작업을 중단하고 Terra Worker 또는 Advisor로 승격한다.

## 4. Brief 완전성 게이트

Advisor는 Worker를 spawn하기 전에 아래를 확인한다.

- [ ] objective가 구현 방법이 아니라 결과를 설명한다.
- [ ] allowed와 forbidden path가 겹치지 않는다.
- [ ] 병렬 Worker 간 allowed path가 겹치지 않는다.
- [ ] workspace가 fixture 또는 clean worktree이며, dirty user worktree의 병렬 쓰기가 아니다.
- [ ] lockfile, generated output, cache, test DB의 owner 또는 직렬 실행 규칙이 있다.
- [ ] allowed command가 외부 remote·production 상태를 바꾸지 않는다.
- [ ] 관련 source of truth와 이미 확인한 컨텍스트가 포함된다.
- [ ] acceptance criteria가 테스트 또는 관찰 가능하다.
- [ ] required test가 실제 repo에서 실행 가능한 명령이다.
- [ ] Worker가 commit/push/deploy하지 않는다고 명시된다.
- [ ] 범위를 바꿀 상황의 stop condition이 있다.

누락이 있으면 위임하지 않고 brief를 먼저 보완한다.

## 5. Advisor 검증 게이트

Worker 완료 보고는 증거 후보일 뿐 승인 근거가 아니다. Advisor는 다음 순서로 직접 확인한다.

| Gate | 검증 | 통과 조건 | 실패 처리 |
|---|---|---|---|
| G0 | 작업 상태 | repo root, branch, dirty state, nested repo, fixture/worktree 격리를 확인 | 잘못된 경계면 중단 |
| G1 | 범위 | `git status --short`, 변경 파일 목록을 allowed path와 비교 | 범위 밖 변경을 분리하고 repair brief |
| G2 | diff | `git diff -- <scoped paths>`를 직접 읽음 | 요구사항 누락, 위험 변경, unrelated edit를 기록 |
| G3 | 테스트 | focused test를 Advisor가 재실행 | 실패 로그를 repair brief에 포함 |
| G4 | 회귀 | blast radius에 맞는 상위 test/build 실행 | 실패 원인 분리 후 재위임 |
| G5 | 설계 | 프로젝트 규칙과 acceptance criteria 대조 | 설계 문제면 Advisor가 결정부터 다시 함 |
| G6 | 최종 범위 | staged/commit 대상이 요청 범위와 일치 | 사용자 변경이 섞이면 제외 |
| G7 | 승인 | 사용자 요청이 있을 때만 commit/push 진행 | 요청 없으면 보고만 하고 종료 |

## 6. Repair brief 템플릿

```text
[REPAIR BRIEF]
parent_brief_id: <WB-id>
repair_id: <WB-id>-R<seq>

verified_failure:
- command/check: <Advisor가 직접 실행한 검증>
- observed: <실제 결과 또는 에러>
- expected: <기대 결과>

diff_findings:
- <파일:라인 또는 변경 블록의 문제>

repair_scope:
- allowed: <수정 허용 경로>
- forbidden: <정상 변경과 unrelated WIP>

required_action:
- <수정해야 할 행동>

required_tests:
- <다시 실행할 명령>

stop_conditions:
- 설계 변경이 필요하면 구현하지 말고 이유만 보고
- 범위 밖 파일이 필요하면 중단

report:
- changed files, test result, remaining risk
- no commit/push
```

## 7. 반복 실패 처리

| 상황 | 처리 |
|---|---|
| 첫 검증 실패 | 같은 Worker에 증거 기반 repair brief 재위임 |
| 같은 원인으로 두 번째 실패 | Worker model을 한 단계 승격하거나 Advisor가 설계를 재검토 |
| 설계 자체가 틀림 | 구현을 멈추고 acceptance criteria와 architecture decision 수정 |
| user WIP와 충돌 | 사용자에게 영향을 설명하고 범위 결정을 요청 |
| 위험 명령·권한 상승 필요 | Worker 중단, Advisor가 안전한 대안을 찾거나 사용자 승인 요청 |

Advisor가 직접 수정하는 것은 검증 후 발견한 사소한 마무리만 허용한다. 의미 있는 로직 변경은 새 repair brief로 돌아간다.

## 8. Worker 완료 보고 형식

```text
WORKER RESULT
- brief_id: <id>
- agent_thread_id: <id or unavailable>
- model: <model id>
- model_reasoning_effort: <effort>
- status: complete | partial | blocked
- changed_files: <list>
- acceptance_criteria: <pass/fail per item>
- tests: <command and result>
- assumptions: <list>
- unresolved_risks: <list>
- scope_deviation: none | <details>
- shared_write_state_deviation: none | <details>
- commit_or_push: not performed
```

이 형식은 Advisor가 무엇을 재검증할지 빠르게 찾기 위한 색인이다. 테스트 통과 주장이나 `complete` 상태 자체는 승인으로 간주하지 않는다.
