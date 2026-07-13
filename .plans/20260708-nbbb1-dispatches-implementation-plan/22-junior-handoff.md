# 신규 화물 관리 — 주니어 인수인계

- 작성일: 2026-07-13
- 인수 대상: `mm-broker` 신규 화물 관리 UI와 Phase B 기능 연결 준비
- 현재 gate: `G-UI approved (R4)`
- 현재 단계: Phase B 상세 계획·승인 대기
- 작업 방식: Docs-as-Code + Review Checklist

## 1. 이 문서의 목적

이 문서는 주니어가 지금까지의 화면 구현을 다시 해석하거나 기존 route를 건드리지 않고, 승인된 UI 기준선 위에서 다음 기능 연결 작업을 안전하게 시작하도록 돕는다.

**지금 할 일은 Phase B를 바로 구현하는 것이 아니라, 첫 연결 범위를 문서로 확정하고 사용자 승인을 받는 것**이다.

## 2. 현재 완료 상태

| 영역 | 상태 | 확인 방법 |
|---|---|---|
| 신규 UI route | 완료 | `/test/broker-order-console-new` |
| UI fidelity | 완료·승인 | G-UI R4 DD-01~12 |
| 등록·목록·상세·배정·추천·collapse | route-local demo 구현 완료 | 신규 route test |
| 검색·초기화 | R3 완료 | 검색 click·Enter·6-field 검색 |
| 디자인 디테일 | R4 완료 | focus·disabled·responsive·empty·feedback |
| 실제 API·저장 | 미연결 | 의도된 보류 |
| Phase B capability bridge | 미착수 | 상세 계획 승인 필요 |

## 3. 반드시 지킬 경계

| 구분 | 규칙 |
|---|---|
| 수정 허용 route | `app/test/broker-order-console-new/**` |
| 동결 route | `app/test/broker-order-console/**` — 수정 금지 |
| backend/service | 기본적으로 수정 금지. 필요하면 별도 제안·사용자 확인 후 진행 |
| 실제 API/mutation | Phase B 계획 승인 전 연결 금지 |
| fixture | `_prototype/**` 밖으로 demo 데이터를 누출하지 않음 |
| 공용 파일 | 공용 component/hook/type/service, package/lockfile/config 변경 금지 |
| main | 직접 commit·push 금지, feature branch와 PR 사용 |
| 사용자 WIP | `.next-dev-3045.err.log`, `.next-dev-3045.log`, `broker-order-uiux-proposal.html` 수정·삭제·stage 금지 |

## 4. 저장소와 현재 작업 상태

| 저장소 | 경로 | branch | 마지막 commit | 현재 상태 |
|---|---|---|---|---|
| 코드 | `C:\Work\Dev\Optics\apps\mm-broker` | `feat/nbbb1-broker-order-console-new-ui-prototype` | `1d8b6aa5 feat: 신규 화물 관리 UI 프로토타입 추가` | 신규 route 6 tracked 파일이 미커밋 |
| 기획 | `C:\Work\Dev\Design` | `feat/nbbb1-dispatches-implementation-plan` | `2988a3e docs: 화물 관리 구현 기획 패키지 정리` | R3/R4 문서·증거가 미커밋 |

### 인수 전 주의

현재 두 저장소 모두 dirty state다. Phase B 코드를 시작하기 전에 다음 중 하나를 담당자와 합의한다.

1. 현재 R3/R4 코드와 기획 문서를 각각 논리적 commit으로 먼저 고정한다. **권장**
2. 현재 WIP를 그대로 인수하되, Phase B는 별도 branch/worktree에서 시작한다.

이 결정을 하지 않은 채 같은 worktree에서 새 기능을 시작하면 UI 변경과 기능 연결 변경이 섞여 회귀 원인과 commit 경계가 불명확해진다.

## 5. 읽는 순서

### 첫 30분

1. [README](README.md) — 패키지 전체 문서 맵
2. [G-UI 승인 Gate](15-ui-prototype-acceptance-gate.md) — 승인 범위와 제외 항목
3. [현재 Phase 3 코드 기준선](09-current-phase3-code-baseline.md) — legacy와 검증 기준
4. [화면·기능 재매핑](10-nbbb1-phase3-screen-state-mapping.md) — `REUSE/ADAPT/ADD/PROPOSE/DEFER`
5. [Phase B 시작 계획](23-junior-phase-b-start-plan.md) — 첫 작업 순서

### 구현 전 반드시 읽기

1. [구현 로드맵 v4](12-implementation-roadmap-v2.md)
2. [nb-main 코드 변환 계약](14-nb-main-code-conversion-plan.md)
3. [별도 승인 항목](13-approval-required-items.md)
4. [R4 fidelity 계약](21-g-ui-revision-4-design-detail-implementation-contract.md)
5. [실행 Context](execution/context.md), [Tasks](execution/tasks.md), [Decision Log](execution/decisions.md)

### 필요할 때만 읽기

- [기능 인벤토리](01-implemented-feature-inventory.md), [NB 목표 인벤토리](02-nbbb1-feature-inventory.md), [커버리지 매핑](03-coverage-mapping.md)
- [Gap 기획](05-gap-and-new-planning.md), [Work Package](06-work-packages.md), [기존 Phase 로드맵](07-phase-roadmap.md)
- [R1~R3 계약](18-g-ui-revision-1-code-fidelity-contract.md), `19`, `20` — 과거 UI 수정 근거
- [검증·시각 증거](evidence/README.md)

## 6. 승인된 UI에서 가능한 동작

- 거래처 preset·검색 mode·선택 후 draft 반영
- 상하차 추천과 route/destination 반영
- demo 등록과 목록 반영
- 날짜 UI 선택·직접 기간 입력 (실제 날짜 데이터 filtering은 제외)
- 상태 filter, 6-field 목록 검색, no-result 복구
- inline detail, 운임·수수료 demo 수정 feedback
- 차주 후보 선택·demo 배정, 상태 demo 변경
- 추천 panel, 목록 collapse/restore

모든 동작은 현재 **route-local in-memory demo**다. 새로고침하면 초기화되며 실제 저장·배정·상태 API를 호출하지 않는다.

## 7. 로컬 실행과 검증

```powershell
cd C:\Work\Dev\Optics\apps\mm-broker
npm.cmd run dev -- -p 3045
```

- 확인 URL: `http://localhost:3045/test/broker-order-console-new`

### 최소 검증

```powershell
npm.cmd exec vitest -- run app/test/broker-order-console-new
npm.cmd exec tsc -- --noEmit
```

UI component 변경 시에는 해당 test를 먼저 실패시키고(TDD), 전체 신규 route test를 다시 실행한다. production build는 TypeScript 설정을 자동 수정할 수 있으므로 `NEXT_DIST_DIR`을 별도 경로로 사용하고, build 후 `tsconfig.json` 자동 변경이 남지 않았는지 확인한다.

현재 R4 검증 기준:

| 검증 | 결과 |
|---|---|
| focused | 5 files / 38 tests PASS |
| 신규 route 전체 | 11 files / 46 tests PASS |
| TypeScript | PASS |
| production build | PASS |
| browser | date·empty recovery·detail feedback·responsive PASS |

## 8. Phase B에서의 작업 원칙

1. `10` 문서에서 첫 기능 후보의 판정을 확인한다.
2. `REUSE` 또는 `ADAPT` 중 backend 변경이 없는 작은 후보를 1개만 고른다.
3. UI state, source API/query, 허용 파일, 테스트, rollback을 Phase B 계획에 쓴다.
4. backend/service/API 변경이 필요하면 구현하지 말고 `13` 문서에 따라 제안한다.
5. 사용자 승인 후에만 TDD 구현을 시작한다.
6. 한 capability slice마다 demo fallback과 실제 연결을 구분해 검증한다.

## 9. 주니어가 하지 말아야 할 것

- `nb-main/src/pages/Dispatches.tsx`를 통째로 복사하지 않는다.
- fixture, `localStorage`, mock AI를 실제 업무 흐름으로 이식하지 않는다.
- 승인된 화면 구조를 편의상 dialog/drawer 중심으로 바꾸지 않는다.
- legacy route를 기준 구현처럼 수정하지 않는다.
- API 오류를 숨기기 위해 demo 값을 실제 데이터처럼 표시하지 않는다.
- `--no-verify`, `git reset --hard`, force push를 사용하지 않는다.

## 10. 인수인계 완료 보고 형식

주니어는 작업 시작·종료 시 아래 항목을 짧게 보고한다.

1. 현재 branch와 dirty state
2. 선택한 capability와 근거 문서
3. 허용/금지 파일 범위
4. Red → Green 테스트 결과
5. legacy route·backend/service/API 변경 여부
6. 남은 승인·결정 사항

## 11. 바로 붙여넣는 시작 프롬프트

```text
신규 화물 관리 Phase B를 준비한다. 먼저
C:\Work\Dev\Design\.plans\20260708-nbbb1-dispatches-implementation-plan\22-junior-handoff.md와
23-junior-phase-b-start-plan.md를 읽어라.

이번 세션은 Phase B 상세 계획만 작성한다. 코드는 수정하지 않는다.
`10-nbbb1-phase3-screen-state-mapping.md`, `12-implementation-roadmap-v2.md`,
`13-approval-required-items.md`, `14-nb-main-code-conversion-plan.md`를 근거로
첫 capability slice 후보를 REUSE/ADAPT/ADD/PROPOSE/DEFER로 분류하고,
backend/service/API 변경이 없는 추천안 1개와 보류안들을 제시하라.

기존 `/test/broker-order-console`은 수정 금지다.
현재 dirty state를 보존하고 commit/push/PR은 하지 않는다.
```
