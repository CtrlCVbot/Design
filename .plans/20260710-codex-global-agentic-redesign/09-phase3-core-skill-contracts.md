# 09. Phase 3 Core Skill 계약

> 작성일: 2026-07-13 KST<br>
> 상태: **G3-1 `security-review` 구현·검증·quarantine 완료; G3-2~G3-4 REVIEW_READY**<br>
> 범위: 전역 core skill 4개 계약과 G3-1 구현 증거

## 결론

Phase 3는 기존 workflow를 복제하지 않는다. 10개 source skill의 유효한 의도만 추려 전역 target 4개로 재작성한다.

현재 source 기준선은 10개 디렉터리, 33개 파일, 173,510 bytes다. global 6개 디렉터리·22개 파일만 Phase 3 migration 대상이며, claude-kit 4개 디렉터리·11개 파일은 Phase 4까지 보호한다. 상세 hash는 [source-baseline.json](./phase3-core-contracts/source-baseline.json)에 있다.

| 구현 순서 | Target | 한 가지 책임 | 자동 실행 | Source 처리 |
|---:|---|---|---|---|
| 1 | `security-review` | 명시적 risk-high 보안 리뷰 | 없음 | global source는 대체 검증 후 quarantine, claude-kit은 Phase 4 보류 |
| 2 | `verification-router` | 현재 repo에 맞는 검증 선택·실행·증거 보고 | 없음 | global verification 2개를 대체 검증 후 quarantine |
| 3 | `skill-lifecycle` | skill의 조사·생성/수정·검증·격리 lifecycle | 없음 | `manage-skills`, `skill-factory`를 대체 검증 후 quarantine |
| 4 | `session-closeout` | 현재 세션의 상태·검증·후속 작업 요약 | 없음 | global `session-wrap`을 대체 검증 후 quarantine |

`capability-registry`는 Phase 3 선행조건에서 제외한다. 현재 `inventory.json`, `file-inventory.json`, `agentic-health-check`로 필요한 owner·상태·검증 정보를 제공할 수 있어, 별도 runtime registry를 지금 추가하면 source of truth만 늘어난다.

## 공통 계약

| 항목 | 계약 |
|---|---|
| Trigger | 사용자 명시 요청 또는 현재 전역 정책의 명확한 route만 허용 |
| 기본 동작 | read/inspect 우선, 쓰기는 사용자 요청과 허용 경로가 있을 때만 |
| 자동 fan-out | 금지. fresh-context 검증이 필요한 경우 최대 1개 read-only agent를 선택적으로 사용 |
| 자동 수정 | 금지. 실패는 증거와 repair 제안으로 반환 |
| 자동 차단 | 금지. 전역 skill은 advisory이며 hard gate는 project git/CI에 둠 |
| 파일 수 | target당 최대 3개, 전체 최대 12개 |
| `SKILL.md` | routing과 최소 workflow만 포함, 200줄 이하 권장 |
| Runtime | 현재 Codex tool/API만 사용; 존재하지 않는 slash command·model·Unix 전용 경로 금지 |
| 출력 | 한국어 설명 + 원문 명령·경로·상태, 실행 명령과 exit code 보존 |
| Side effect | commit, push, PR, deploy, publish, memory write는 별도 명시 요청 없이는 금지 |
| Migration | 새 target PASS 전 기존 source 유지; PASS 후에도 삭제하지 않고 timestamped quarantine |

## 1. `security-review`

### 책임과 Trigger

인증·권한·secret·개인정보·결제·파일 업로드·명령 실행처럼 피해가 큰 변경을 증거 중심으로 리뷰한다. 다음 두 경우만 실행한다.

1. 사용자가 보안 리뷰를 명시적으로 요청한다.
2. `methodology-router`가 실제 변경 범위를 확인한 뒤 `risk-high`로 판정한다.

경로 이름만 보고 자동 실행하거나 commit을 차단하지 않는다.

### 입력과 출력

| 입력 | 출력 |
|---|---|
| 절대 repo root, 변경 파일/diff, 데이터·신뢰 경계, 인증 역할, 실행 가능한 test | severity, confidence, evidence 위치, attack path, 영향, 수정안, 회귀 test, 남은 리스크 |

Findings가 먼저 나오며 `critical/high/medium/low`를 사용한다. 정규식 탐지는 조사 단서일 뿐 취약점 확정 근거가 아니다. `.env` 값이나 secret 원문은 읽거나 출력하지 않는다. 현재 CVE, dependency advisory, 표준 버전처럼 변할 수 있는 주장을 사용할 때는 vendor advisory, 공식 registry, 표준 문서 같은 primary source를 확인하고 출처를 결과 가까이에 남긴다.

### Non-goal

- `effort:max` 같은 실행 불가능한 self-enforcement
- staged file 자동 감시, commit 차단, global hook
- 승인 없는 자동 수정
- 도구를 실행하지 않고 CWE/STRIDE 전체 검사를 완료했다고 주장
- 프로젝트별 보안 정책을 전역에서 추정

### Source mapping

| Source | 보존 | 폐기·이관 |
|---|---|---|
| `security-pipeline` | CWE/STRIDE 관점, severity 기반 결과 | 자동 trigger, 없는 command, effort 강제, 자동 gate |
| claude-kit `dev-security-pipeline` | project adapter가 참고할 위험 범주 | Phase 3에서 수정하지 않음 |
| `security-auto-trigger.js` | 민감 변경 신호 아이디어 | hook 자체는 Phase 5 pilot 전 사용 금지 |

### Acceptance

- `SEC-01`: 명시 요청과 `risk-high` route만 trigger한다.
- `SEC-02`: true-positive/false-positive fixture를 구분하고 pattern match를 확정 finding으로 승격하지 않는다.
- `SEC-03`: secret·개인정보 원문을 출력하지 않는다.
- `SEC-04`: finding마다 evidence·impact·fix·test가 있다.
- `SEC-05`: 승인 없는 write·commit block·hook 등록이 0이다.
- `SEC-06`: 시점 의존 보안 주장은 공식 primary source와 확인 날짜를 가진다.

## 2. `verification-router`

### 책임과 Trigger

프로젝트의 실제 build/test/lint/typecheck 계약을 찾아 가장 작은 검증부터 실행하고 증거를 정리한다. 기능 구현 후, PR/closeout 전, 사용자 검증 요청 시 사용한다.

### 입력과 출력

| 입력 | 출력 |
|---|---|
| 절대 repo root, 변경 범위, project instructions, 필수 test, 선택적 risk profile | 실행한 명령, exit code, focused/blast-radius 결과, scope gap, PASS/WARN/FAIL, repair evidence |

순서는 `repo boundary 확인 → project contract 탐색 → focused test → 필요 시 blast-radius → 결과 보고`다. 보안 범위가 확인되면 `security-review`를 명시적으로 연결한다. medium 이상 위험 또는 사용자 요청일 때만 read-only fresh-context reviewer 1개를 사용할 수 있다.

### Non-goal

- 모든 `verify-*` skill 자동 실행
- handoff 문서 자동 생성
- 최대 5회 자동 수정 루프
- lint `--fix`, source 수정, commit/push/PR
- 없는 `/handoff-verify`, `/orchestrate`, effort별 숨은 동작

### Source mapping

| Source | 보존 | 폐기·이관 |
|---|---|---|
| `verification-engine` | focused→broader 검증, fresh-context 독립성 | 자동 수정 loop, stale command/model, handoff 결합 |
| `verify-implementation` | project verify contract 탐색 아이디어 | verify skill fan-out, 동적 목록 자기수정 |
| claude-kit `dev-verification-engine` | project command consumer 정보 | Phase 3에서 수정하지 않음 |

### Acceptance

- `VER-01`: repo root·dirty state·project instructions를 먼저 확인한다.
- `VER-02`: 존재하는 명령만 실행하고 각 exit code를 보존한다.
- `VER-03`: focused test와 blast-radius 검증을 구분한다.
- `VER-04`: 실패 시 source를 고치지 않고 재현 증거와 repair 범위를 반환한다.
- `VER-05`: agent가 없어도 동일한 direct verification 경로가 동작한다.
- `VER-06`: `security-review` 부재 시 보안 검증을 완료했다고 주장하지 않는다.

## 3. `skill-lifecycle`

### 책임과 Trigger

사용자가 skill 생성·수정·통합·감사·격리를 요청했을 때 중복과 consumer를 확인하고 가장 작은 lifecycle 작업을 수행한다.

### 입력과 출력

| 입력 | 출력 |
|---|---|
| global/project scope, 목적, 재사용 증거, target path, 허용 변경, retirement 조건 | `NO-OP/UPDATE/CREATE/MERGE/QUARANTINE` 판정, 변경 파일, consumer, validation, rollback |

실제 scaffold와 작성 규칙은 official `skill-creator`를 재사용하고, 전역 상태 검증은 `agentic-health-check`를 사용한다. project `AGENTS.md`는 실제 routing entry가 필요하고 사용자 요청 범위에 포함될 때만 수정한다.

### Non-goal

- 세션을 자동 분석해 skill 생성
- Agent Teams, persona 3개, 자동 AGENTS 등록
- `skill-creator` 기능 복제
- 근거 없는 새 skill 생성
- consumer 확인 없는 삭제
- global Python package 설치 또는 global config 변경

### Source mapping

| Source | 보존 | 폐기·이관 |
|---|---|---|
| `manage-skills` | drift·consumer·registration 점검 | verify 목록 자기수정, project AGENTS 자동 생성 |
| `skill-factory` | duplicate search, reusable pattern evidence | TeamCreate, Unix script 강제, session auto-mining |
| official `skill-creator` | 생성·구조·validator SSOT | 복제하지 않고 dependency로 사용 |

### Acceptance

- `LIFE-01`: 기존 skill 검색과 `NO-OP/UPDATE` 판단이 `CREATE`보다 먼저다.
- `LIFE-02`: 생성·수정은 official `skill-creator` 구조와 validator를 사용한다.
- `LIFE-03`: retirement는 consumer 0과 hash manifest가 없으면 중단한다.
- `LIFE-04`: global/project 경계를 섞지 않는다.
- `LIFE-05`: 자동 session mining·Team API·global package 설치가 0이다.
- `LIFE-06`: validator dependency가 없으면 전역 환경을 바꾸지 않고 임시 경로나 명시적 blocker를 사용한다.

## 4. `session-closeout`

### 책임과 Trigger

사용자가 세션 마무리, 정리, handoff를 명시했을 때 현재 작업 상태를 짧고 재개 가능한 형태로 정리한다. 단순한 작별 인사나 도구 호출 수만으로 자동 trigger하지 않는다.

### 입력과 출력

| 입력 | 출력 |
|---|---|
| repo root, 사용자 목표, git status/diff, 실행한 test, 현재 plan/handoff, 남은 blocker | 완료, 변경 파일, 검증, 미반영 feedback, 리스크, 다음 단계, 선택적 handoff 경로 |

기본은 메모리 내 보고이며 파일을 만들지 않는다. 사용자가 handoff 문서를 요청했을 때만 합의된 project-local 경로에 쓴다. 대규모 세션에서는 선택적으로 read-only reviewer 1개를 사용할 수 있다.

### Non-goal

- 4+1 subagent fan-out
- `/tmp`, `tail`, Unix shell 전제
- instinct·memory·skill candidate 자동 생성
- 문서·timestamp 자동 수정
- commit/push/PR 또는 후속 작업 자동 생성
- Stop hook과 tool-count 기반 자동 제안

### Source mapping

| Source | 보존 | 폐기·이관 |
|---|---|---|
| global `session-wrap` | 변경·검증·후속 작업 요약 의도 | 5-agent fan-out, homunculus, `/tmp`, 자동 write |
| claude-kit `session-wrap` | compatibility consumer 정보 | Phase 3에서 수정하지 않음 |
| claude-kit `session-wrap-suggest` | 없음 | 자동 제안 의도는 target에 포함하지 않음; Phase 4 격리 후보 |

### Acceptance

- `CLOSE-01`: 명시적 마무리 요청에서만 trigger한다.
- `CLOSE-02`: non-git repo와 dirty repo 모두 read-only로 요약한다.
- `CLOSE-03`: 기본 생성 파일·memory write·자동 문서 수정이 0이다.
- `CLOSE-04`: agent가 없어도 direct closeout이 동작하며, 사용해도 최대 1개 read-only다.
- `CLOSE-05`: 테스트 미실행과 실패를 숨기지 않는다.
- `CLOSE-06`: 다음 단계는 실제 남은 plan에서만 도출한다.

## 구현 순서와 Gate

각 target은 별도 변경 단위로 구현한다. 다음 target은 이전 target이 Gate를 통과한 뒤 시작한다.

| Gate | 필수 증거 |
|---|---|
| G3-1 `security-review` | skill validator, routing fixture, true/false-positive fixture, secret redaction, health-check |
| G3-2 `verification-router` | PASS/FAIL/missing-command fixture, direct fallback, 선택적 fresh-context smoke, health-check |
| G3-3 `skill-lifecycle` | duplicate/no-op/create/quarantine fixture, official validator 연동, scope boundary, health-check |
| G3-4 `session-closeout` | explicit/no-trigger/non-git/dirty-repo fixture, zero default writes, direct fallback, health-check |
| G3-5 migration | 새 target 4개 PASS, 기존 global source 6개 consumer 재검색, timestamped quarantine manifest |

기존 global source는 target별 검증 직후 하나씩 quarantine할 수 있지만 삭제는 Phase 7까지 금지한다. claude-kit source/cache는 Phase 4에서만 변경한다.

## 구현 예정 구조

```text
C:\Users\beck\.agents\skills\
  security-review\
  verification-router\
  skill-lifecycle\
  session-closeout\
```

각 디렉터리는 `SKILL.md`와 필요한 reference/test artifact만 가진다. 실행 script는 반복되는 결정적 로직이 실제로 확인될 때만 추가한다.

## G3-1 구현 결과

`security-review`는 validator, safe/unsafe fixture, secret 값 부재, health-check를 통과한 뒤 기존 global `security-pipeline`을 timestamped quarantine으로 이동했다. rollback mapping과 결과는 [phase3-security-review/](./phase3-security-review/)에 있다. claude-kit source/cache와 hook은 변경하지 않았다.

## 다음 승인 Gate

본 문서와 [contracts.json](./phase3-core-contracts/contracts.json)이 G3 계약의 source of truth다. G3-2 `verification-router`부터 G3-4 `session-closeout`까지는 계속 `REVIEW_READY`이며, 각각 별도 승인과 Gate가 필요하다.
