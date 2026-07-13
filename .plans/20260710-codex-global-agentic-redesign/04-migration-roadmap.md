# 04. Migration Roadmap

## 운영 원칙

- 한 Phase에는 하나의 논리적 변경만 포함한다.
- 전역 파일을 수정하기 전에 대상 파일과 SHA-256 manifest를 보존한다.
- 삭제보다 `disable -> fresh session smoke -> quarantine -> delete` 순서를 사용한다.
- global과 project source를 같은 변경 묶음에서 수정하지 않는다.
- plugin source와 cache를 독립 source처럼 편집하지 않는다. source를 변경하고 install/cache 갱신 절차로 반영한다.
- 각 Phase 종료 시 사용자가 다음 Phase 진행 여부를 승인한다.

## Phase 0. Baseline과 설계 고정

> 상태: **완료**

| 항목 | 내용 |
|---|---|
| 범위 | live config, AGENTS, skill, agent, claude-kit, hook, project harness 감사 |
| 산출물 | 본 패키지 7개 문서 + capability/file-level JSON 2개 |
| 검증 | health-check, mock hook probe, JSON parse, source/cache 목록 비교 |
| 변경 | 전역 파일 변경 없음 |
| Gate | 사용자에게 현재 43/100, 목표 구조, 처분안 승인 요청 |

## Phase 1. 진단 기준 복구

> 상태: **완료**

### 목적

구조 변경 전에 health-check가 global plugin hook과 project hook을 구분하고 nested stale runtime을 탐지하도록 한다.

| 항목 | 내용 |
|---|---|
| 변경 | `agentic-health-check` test와 scanner 확장 |
| 필수 test | project hook trust 분류, references/agents/hooks scan, allowlist, active/inactive 구분 |
| acceptance | Design project trust 15개가 stale로 오분류되지 않음; 현재 stale nested refs는 실제 수치로 보고 |
| rollback | skill directory snapshot 복원 |
| 승인 Gate | 새 health report와 false-positive/false-negative 목록 검토 |

이 Phase에서는 skill, plugin, hook을 제거하지 않는다.

### 완료 결과

- hook trust를 `global 7 / project 15 / unknown 0`으로 분리해 기존 project hook `stale 15` 오분류를 제거했다.
- nested active asset, custom agent, registered hook command를 탐지하고 unregistered hook은 inactive로 분리했다.
- live runtime reference는 `active 14 / inactive 7`이며 Phase 2의 legacy 격리 입력으로 고정했다.
- unit test `19/19`, skill validator, protected hash 4종, 허용 파일 4개 diff를 Advisor가 독립 검증했다.
- 상세 증거는 [07-phase1-health-check.md](./07-phase1-health-check.md)와 [phase1-health-check/result.json](./phase1-health-check/result.json)에 있다.

## Phase 2. Legacy routing 격리

> 상태: **완료 — 2026-07-13 KST**

### 대상

- `cc-dev-agent`
- `team-orchestrator`
- `strategic-compact`
- `using-superpowers`

### 제외·보류

- `continuous-learning-v2`: claude-kit compatibility skill과 session-wrap references consumer가 확인되어 consumer-bound legacy로 보류한다. 원 경로와 11개 파일 tree digest를 유지한다.
- claude-kit legacy agent와 inactive hook: command/skill/documentation consumer가 남아 있으므로 Phase 4까지 물리 이동을 보류한다.

### 절차

1. consumer와 dependency를 다시 검색한다.
2. active skill root 밖의 timestamped quarantine으로 이동할 manifest를 만든다.
3. consumer-free 네 skill만 `Move-Item`으로 격리한다.
4. health-check와 manifest hash mapping을 검증한다.
5. 실제 삭제는 Phase 7까지 보류한다.

| Acceptance | 검증 결과 |
|---|---|
| physical quarantine | 정확히 4개 source directory가 active skill root 밖 quarantine root로 이동, 12개 file mapping 일치 |
| active skills | health-check 63 (baseline 67 대비 정확히 4 감소) |
| hook trust | global/project/unknown = 7/15/0 유지 |
| consumer-bound legacy | `continuous-learning-v2` 원 경로 유지, 11-file tree digest 일치 |
| rollback | quarantine manifest의 exact original/quarantine path와 SHA-256/size로 원위치 복원 가능 |

### 완료 결과

- `cc-dev-agent`, `team-orchestrator`, `strategic-compact`, `using-superpowers` 4개 skill과 12개 파일을 `C:\Users\beck\.agents\quarantine\20260713-phase2-legacy-routing`으로 가역 이동했다.
- active skill은 67에서 63으로 감소했고, hook trust는 `global/project/unknown = 7/15/0`으로 유지됐다.
- health-check unit test 19/19 PASS, live health-check exit 0을 확인했다.
- 이동 전·후 SHA-256/size mapping, rollback 경로, `continuous-learning-v2` deferred digest는 [08-phase2-legacy-routing.md](./08-phase2-legacy-routing.md)와 `phase2-legacy-routing/` manifests에 기록했다.

## Phase 3. Core skill 재작성과 통합

> 상태: **G3-1 `security-review` 구현·검증 완료; G3-2~G3-4 계약 REVIEW_READY**

| 대상 | 목표 |
|---|---|
| verification-engine + verify-implementation | 현재 tool과 custom agent를 사용하는 하나의 경량 verification router |
| security-pipeline | `security-review`로 대체 검증 후 timestamped quarantine; 강제는 project gate에 위임 |
| manage-skills + skill-factory | 명시 호출형 `skill-lifecycle` 하나로 통합 |
| session-wrap | Windows 경로, 현재 subagent API, 최대 1개 선택적 reviewer를 사용하는 경량 closeout |

구현 순서는 `security-review -> verification-router -> skill-lifecycle -> session-closeout`이다. 각 target은 별도 Gate를 통과한 뒤 다음 target을 시작한다. `capability-registry`는 현 inventory와 health-check로 대체 가능하므로 Phase 3 선행조건에서 제외한다.

G3-1 증거와 rollback mapping은 [phase3-security-review/](./phase3-security-review/)에 있다. 다음 target G3-2~G3-4는 review-ready 상태로 유지한다. 상세 계약은 [09-phase3-core-skill-contracts.md](./09-phase3-core-skill-contracts.md), 기계 판독 원본은 [phase3-core-contracts/contracts.json](./phase3-core-contracts/contracts.json)에 있다.

각 재작성은 기존 동작을 그대로 복제하지 않는다. 먼저 대표 use case와 non-goal을 고정하고, 불필요한 자동 fan-out과 파일 생성을 제거한다.

### Acceptance

- 각 skill의 `SKILL.md`는 routing과 최소 workflow만 포함한다.
- 고유 trigger, consumer, dependency, validation, rollback이 존재한다.
- 존재하지 않는 slash command, model name, tool name이 없다.
- 같은 기능을 제공하는 global skill이 하나뿐이다.

## Phase 4. claude-kit 분해

### 4A. Project adapter 추출

| 영역 | 목표 위치 |
|---|---|
| dev | 회사/프로젝트 하네스 playbook과 repo-local skill |
| plan | `C:\Work\Dev\Design` project adapter |
| copy | fidelity가 필요한 project adapter |

project adapter는 marker가 있는 repo에서만 활성화하고, marker가 없는 repo에서는 파일 생성·경고·차단을 하지 않는다.

### 4B. General capability 추출

global 가치가 확인된 내용만 독립 `.agents` skill로 옮긴다. 기존 global skill과 겹치면 새 skill을 만들지 않고 기존 skill을 보강한다.

### 4C. Plugin disable trial

1. claude-kit source/cache snapshot과 hash manifest를 저장한다.
2. config에서 plugin을 disable한다.
3. fresh session으로 core, implementation, planning, fidelity, project adapter task를 실행한다.
4. 회귀가 있으면 즉시 enable rollback한다.

### Acceptance

- global custom command 38개가 기본 routing surface에서 사라진다.
- project plan/copy/dev workflow는 해당 repo에서만 발견된다.
- `AGENTS.md`, custom agents, core skills, official plugins는 영향받지 않는다.
- source와 cache를 같은 version 아래 수동으로 덮어쓰는 운영을 중단한다.

## Phase 5. Guardrail 재배치

### 기본 결정

Phase 5 시작 시 global custom hook은 0개를 기본값으로 한다. 프로젝트 hook과 git/CI gate는 유지한다.

### 선택적 global safety hook Pilot

다음 조건을 모두 만족할 때만 destructive-command 또는 credential hook을 제안할 수 있다.

- 현재 Codex tool name과 payload schema를 사용
- PowerShell, cmd, git, DB mock fixture 포함
- 실제 파괴 명령을 실행하지 않는 negative test
- parse failure와 timeout 동작 명시
- unmarked repo에서 project 파일 생성 0
- false-positive trial과 즉시 disable rollback

TDD, architecture, plan schema, quality reminder는 global hard block 후보가 아니다.

## Phase 6. 대표 작업 Evaluation과 제한 출시

[05-evaluation-and-rollback.md](./05-evaluation-and-rollback.md)의 golden tasks를 direct mode로 실행한다. quality, routing, file pollution, warning 수, token/time을 baseline과 비교한다.

| Gate | 승격 기준 |
|---|---|
| core health | FAIL 0, unexplained WARN 0 |
| stale active refs | 0 |
| unmarked repo | block·warning·생성 파일 0 |
| project enforcement | 대표 위반 fixture 100% 탐지 |
| Advisor/Worker | 기존 release smoke와 동일 또는 향상 |
| planning worker | explicit opt-in 유지, 자동 route 0 |
| rollback rehearsal | 15분 이내 복원 |

## Phase 7. Legacy cleanup

최소 1주 제한 출시 동안 quarantine consumer 0, rollback 0, high regression 0을 확인한 뒤 삭제 후보를 최종 삭제한다.

삭제 후에도 manifest에는 제거 시점, 이전 hash, 대체 capability, 복구 archive 경로를 남긴다. claude-kit historical artifact는 문서 참조를 위해 read-only archive로 보존할 수 있지만 runtime routing에서는 제거한다.

## 승인 지점

| Gate | 사용자 확인 내용 |
|---|---|
| G1 | Phase 1 health-check 수정 범위 |
| G2 | legacy disable/quarantine 목록 |
| G3 | 통합·재작성 skill 계약 |
| G4 | claude-kit project adapter 배치와 plugin disable |
| G5 | global safety hook Pilot 실행 여부 |
| G6 | 제한 출시 결과와 1주 관찰 시작 |
| G7 | 최종 삭제 승인 |

## 추천 실행 순서

가장 먼저 Phase 1만 수행한다. 현재 health-check가 project trust와 nested stale references를 정확히 구분하지 못하므로, 이 기준을 고치지 않고 cleanup을 시작하면 개선 전후를 신뢰할 수 없다.
