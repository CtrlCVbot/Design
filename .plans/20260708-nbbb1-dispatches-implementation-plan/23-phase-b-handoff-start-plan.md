# Phase B 시작 계획 — 인수인계용

- 상태: `계획 작성 전`
- 선행 gate: `G-UI approved (R4)` — 충족
- 구현 gate: Phase B 상세 계획의 사용자 승인 — 미충족
- 코드 변경: 이 문서 단계에서는 금지

## 1. 목표

승인된 신규 화물 관리 UI에 Phase 3 기존 기능을 **최소 변경으로** 연결할 첫 capability slice를 선택하고, 구현 전에 계약을 확정한다.

## 2. Phase B 범위

| 포함 | 제외 |
|---|---|
| 기존 Phase 3 기능의 `REUSE` 또는 `ADAPT` 연결 후보 분석 | 신규 backend 도메인 생성 |
| route-local demo와 실제 기능 경계 정의 | DB schema/migration |
| API/query·상태·에러·fallback 계약 작성 | legacy route 변경 |
| 첫 slice TDD/검증 계획 | package/config/공용 service 임의 변경 |

## 3. 시작 전 체크리스트

- [ ] [22-handoff.md](22-handoff.md)를 읽었다.
- [ ] 코드·기획 두 저장소의 branch, diff, 사용자 WIP를 확인했다.
- [ ] R3/R4 미커밋 변경의 고정 방식(commit 또는 별도 worktree)을 담당자와 합의했다.
- [ ] `10`, `12`, `13`, `14`, `15` 문서를 읽었다.
- [ ] 기존 route가 동결 기준선임을 확인했다.
- [ ] API/backend/service 변경이 필요한 후보는 `PROPOSE`로 분리했다.

## 4. 첫 capability 후보 선택 규칙

### 추천 우선순위

1. `REUSE`: 기존 UI/API/테스트 자산을 신규 route 표면에 연결할 수 있는 것
2. `ADAPT`: adapter 또는 presentation mapping만 추가하면 되는 것
3. `ADD`: 신규 UI state가 필요하지만 backend 변경은 없는 것
4. `PROPOSE`: backend/service/API 계약 변경이 필요한 것 — 구현 금지, 제안서만 작성
5. `DEFER`: 데이터 소스·제품 결정이 없는 것 — 보류 사유 기록

### 선택 금지 신호

- 실제 저장, 배정, 상태 mutation이 첫 slice에 함께 들어감
- DB·schema·service·공용 type 수정이 필요함
- 신규 chat, 실시간 위치, 집계 데이터처럼 source가 없음
- UI 기준선을 바꾸는 layout 재설계가 필요함

## 5. Phase B 상세 계획 템플릿

첫 slice 후보마다 아래 표를 작성한다.

| 항목 | 작성 내용 |
|---|---|
| Capability ID/이름 | `10` 또는 `01/02` 인벤토리의 ID와 이름 |
| 분류 | `REUSE / ADAPT / ADD / PROPOSE / DEFER` |
| 사용자 가치 | 승인된 UI에서 무엇이 실제로 동작하는가 |
| source of truth | 기존 component, query, API, test, 문서 anchor |
| 신규 route 표면 | 수정할 component/상태/표시 영역 |
| 허용 파일 | 절대 경로와 이유 |
| 금지 파일 | legacy/backend/service/API/config 등 |
| fallback | loading/error/empty와 demo 제거 또는 유지 방식 |
| 테스트 | Red test, focused regression, type, build, browser |
| rollback | 연결 해제 또는 feature flag 없이 안전히 되돌리는 방법 |
| 승인 필요 여부 | 필요하면 이유와 구현 금지 명시 |

## 6. 구현 승인 전 산출물

1. 첫 slice 후보 비교표 3개 이상
2. 추천 후보 1개와 선택 이유
3. `PROPOSE/DEFER` 분리표
4. API/backend/service 영향 0건 확인 또는 변경 제안서
5. 허용 파일·테스트·rollback이 포함된 구현 계획
6. 사용자 승인 요청 문구

## 7. 구현 시 필수 절차

승인 후에만 진행한다.

1. 별도 branch/worktree와 clean handoff boundary 확인
2. TDD Red test 작성 및 실패 확인
3. route-local adapter 또는 presentation mapping 최소 구현
4. focused test → 신규 route 전체 → typecheck → build
5. 기존 `/test/broker-order-console` 무변경 확인
6. browser state와 error/fallback 확인
7. diff self-review 후 commit 제안

## 8. 초기 보고 예시

```text
Phase B 계획 결과
- 추천: <Capability>
- 분류: REUSE 또는 ADAPT
- 이유: backend/service/API 변경 없이 승인 UI의 <영역>을 실제 Phase 3 자산으로 연결 가능
- 허용 파일: <목록>
- 금지 파일: legacy route, backend/service/API/config
- 검증: Red test + focused + 신규 route 전체 + type + build + browser
- 별도 승인 필요: 없음 / <내용>

아직 코드는 수정하지 않았습니다. 위 slice 구현을 승인해주세요.
```
