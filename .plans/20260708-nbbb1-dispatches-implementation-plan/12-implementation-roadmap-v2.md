# 12. 상세 구현 로드맵 v4

- 작성일: 2026-07-10
- 변경 이유: UI prototype 우선 + 사용자 화면 승인 후 기능 연결
- primary reference: `C:\Work\Dev\Design\.references\code\nb-main`
- frozen baseline: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console`
- implementation target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- 기본 원칙: **화면을 먼저 확인받고, 승인된 화면에만 실제 기능을 연결한다.**

## 1. 핵심 전략

작업을 두 덩어리로 분리한다.

### 1차 — UI prototype

- `nb-main` 화면·interaction을 신규 route에 고충실도로 재현
- in-memory demo data만 사용
- API·submit·배정·상태 mutation·backend/service 연결 없음
- 사용자가 실제 route와 screenshot을 확인하고 수정 요청
- G-UI 명시 승인 전까지 UI layer만 반복

### 2차 — 기능 연결

- 승인된 component·view model을 유지
- demo adapter를 Phase 3 capability bridge로 교체
- 기존 auth·tenant·validation·state guard·cache 연결
- 새 화면 전용 기능과 Phase 3-only 기능을 후속 단계로 추가
- backend/service 변경은 별도 제안·승인

이 순서는 화면 불만족이 발견됐을 때 API와 업무 로직까지 다시 뜯는 비용을 줄인다.

## 2. 방법론

- UI prototype: fidelity evidence + interaction contract
- 기능 연결: Contract-First + TDD
- 구현 closeout: UI fidelity와 업무 회귀를 별도 검증
- 모든 코드 slice: 실패 test → 최소 구현 → refactor → Simple Design 자가 리뷰

UI prototype 승인과 실제 기능 완료는 서로 다른 판정이다.

G0 이후 실제 코드 구현은 `advisor-worker-orchestration`을 적용한다. 메인 세션은 Advisor로서 screen contract·slice·검증·최종 승인 책임을 갖고, Worker는 허용된 신규 route 범위에서 prototype과 focused test를 구현한다. 문서 작업만 하는 현재 단계에는 Worker를 사용하지 않는다.

## 3. 고정 경계

### 변경 허용 범위

- `app/test/broker-order-console-new/**`
- 신규 route의 focused test·screenshot evidence

### 기본 변경 금지

- `app/test/broker-order-console/**`
- backend route/service/repository/domain/schema
- 앱 전역 navigation·theme·token
- `C:\Work\Dev\Design\.references\code\nb-main` 원본

### Prototype 단계 금지

- network/API request
- 실제 submit·status·assign mutation
- `localStorage` 저장
- 기존 service/hook/legacy route 연결
- mock AI/chat을 실제 기능처럼 표시
- prototype data를 production data로 오인할 표현

### Prototype 단계 허용

- `_prototype/**` 아래 in-memory fixture
- 입력·filter·pane 전환·행 확장·선택·collapse
- 저장되지 않는 demo transition
- data 미연결 영역의 `prototype` 표시

새로고침하면 초기 상태로 돌아가야 하며, G-UI 승인 후 demo adapter를 제거하거나 test/story fixture로 이동한다.

## 4. 전체 단계와 승인 gate

| Phase | 목적 | 실제 기능 연결 | 승인 gate |
|---|---|---:|---|
| R | reference·legacy 기준선 고정 | 없음 | G0 |
| N | 신규 route 격리·component foundation | 없음 | G0 |
| P | 전체 UI interaction prototype | 없음 | G0 |
| G-UI | 사용자 화면 검토·수정·승인 | 금지 | **명시적 사용자 승인** |
| B | Phase 3 capability bridge | 시작 | G1 |
| C | 등록·목록 실제 기능 | 있음 | G1 |
| D | 상세·상태·차주 배정 | 있음 | G2 |
| E | 새 화면 frontend-only 기능 정식화 | view-only | G2 |
| F | Phase 3-only 기능 재배치 | 있음 | G2 |
| X | 신규 data/backend 기능 | 신규 계약 | G3 개별 승인 |
| Q | production 회귀·fidelity closeout | 검증 | 완료 gate |

## 5. Phase R — Reference·회귀 기준선

### R-00 reference drift preflight

- `14-nb-main-code-conversion-plan.md` SHA-256 재확인
- screen/state inventory와 `PORT/PROTOTYPE-ONLY/BRIDGE/REJECT/DEFER` manifest 고정
- reference가 달라졌으면 구현 전 문서 갱신

### R-01 legacy regression baseline

- 기존 focused suite `46 files / 434 tests` 재실행
- 기존 route 파일 diff 0건 확인
- 이 단계에서는 API runtime 조사나 service 변경을 하지 않음

### R exit gate

- reference hash 확정
- prototype screen contract 존재
- legacy 434 tests 통과
- 기존 route diff 0건

## 6. Phase N — 신규 route foundation

### N-00 route scaffold와 isolation test

- 먼저 route render·legacy import 금지에 대한 실패 test 작성
- `/test/broker-order-console-new` 독립 route 생성
- 기존/new route가 각각 렌더되는 test
- 기존 route 파일을 import·수정하지 않는 boundary test
- prototype banner 또는 식별 가능한 표시

### N-01 component boundary

```text
page
└─ cockpit-shell
   ├─ registration-pane
   ├─ dispatch-list-pane
   ├─ inline-detail-pane
   ├─ driver-assignment-pane
   └─ recommendation-pane
```

- route page는 composition만 소유
- view state와 demo data 분리
- `Dispatches.tsx` 6,118줄 직접 복사 금지

### N-02 route-local token·layout

- `nb-main/src/index.css`의 color·radius·spacing·typography 매핑
- desktop 1600×1000, 1440×900 기준
- app global token 수정 금지
- 기존 app navigation 유지, reference sidebar는 1차 제외

### N exit gate

- CK-01 static shell screenshot
- Critical 구조 gap 0건
- API/service/legacy route import 0건

## 7. Phase P — UI interaction prototype

각 P task는 interaction contract test를 먼저 작성하고, 해당 상태의 reference/prototype screenshot을 확보한 뒤 다음 task로 이동한다.

### P-01 기본 등록·목록 화면

- `nb-main` section 순서·field·quick chip·금액 UI 재현
- dense list, status chip, filter, pagination 모양 재현
- 입력과 filter는 in-memory state로 동작
- 등록 버튼은 demo row 추가 또는 성공 state만 보여주며 저장하지 않음

### P-02 상세 확장

- 행 선택·확장·축소
- 상세 정보 위계, copy/edit/memo/amount-log 위치 시각화
- 실제 detail hydration 없음

### P-03 차주 배정 mode

- 좌측 mode 전환
- driver card 선택·해제·선택 강조
- demo 배정 결과만 표시
- 실제 driver lookup/등록/assign 없음

### P-04 추천·collapse mode

- 우측 추천 panel 전환
- reference 기반 sample address/route card
- list collapse/restore와 상태 보존
- 실제 통계·Kakao lookup 없음

### P-05 기획 전체 상태 preview

화면 검토를 위해 다음은 보이게 할 수 있다.

- reference의 4개 정산 옵션
- 경유지·실중량·정산 예정일 UI
- AI·차주 위치·대화 mode의 placeholder 또는 sample state

단, 전부 `prototype-only / data not connected`로 명확히 표시하며 실제 구현 승인으로 간주하지 않는다. 사용자는 이 단계에서 삭제·이동·표현 변경을 요청할 수 있다.

### P-06 visual evidence package

- 1600×1000: 기본, 상세, 배정, 추천, collapse
- 1440×900: 기본과 밀도 확인
- reference/prototype 나란히 비교
- known gap, 의도적 차이, 사용자 결정 질문 정리
- 사용자 확인 URL과 조작 안내 제공

### P exit gate

- CK-01~05 interaction 동작
- screenshot evidence 존재
- Critical/High fidelity gap은 수정하거나 사용자 판단 대상으로 기록
- network/API/mutation 0건
- prototype fixture가 `_prototype/**`에만 존재
- 사용자 검토 가능한 상태
- focused test·TypeScript typecheck·build 통과
- Simple Design 자가 리뷰 완료

## 8. Gate G-UI — 사용자 화면 승인

여기서 반드시 멈춘다. 다음 항목을 사용자가 실제 화면으로 확인한다.

| 확인 영역 | 질문 |
|---|---|
| 전체 구성 | 좌우 pane 비율과 한 화면 정보량이 적절한가 |
| 등록 | section 순서·field 밀도·quick action이 만족스러운가 |
| 목록 | column, row 높이, filter, 상태 표시가 적절한가 |
| 상세 | inline 확장 방식과 정보 위계가 적절한가 |
| 배정 | mode 전환과 driver card 선택 흐름이 자연스러운가 |
| 추천 | 추천 panel·collapse 방식이 기대와 일치하는가 |
| 시각 | 색·간격·radius·badge·button이 reference와 충분히 일치하는가 |
| 범위 | 추가·삭제·이동할 기능과 용어가 있는가 |

판정:

- `revise`: UI layer만 수정하고 P-06 evidence를 다시 제출한다.
- `approved`: 승인 screenshot과 commit/hash를 고정하고 Phase B로 이동한다.
- 명확한 승인 응답이 없으면 Phase B를 시작하지 않는다.

## 9. Phase B — Phase 3 capability bridge

G-UI 승인 후에만 시작한다.

### B-00 prototype adapter 교체 경계

- component/view model 유지
- `_prototype` adapter를 `phase3-capability-bridge`로 교체
- bridge 외 legacy route-local deep import 금지
- 공용 `@/services`, hook, type 우선

### B-01 authenticated runtime preflight

- auth·tenant context에서 legacy/new route 진입
- list API, auth redirect, tenant scope 확인
- 오류가 backend/service 변경을 요구하면 중단·별도 제안

### B-02 create validation contract

- `selectedManagerId` client/server 불일치 고정
- submit 전 validation·blocked reason 정렬

### B-03 recent cache contract

- 저장 성공 후 recent shipper/address/cargo 후보 신선도 검증
- query key 변경 필요 시 별도 승인

### B exit gate

- auth·tenant·validation·guard test 통과
- service 로직 복사 0건
- prototype fixture production 경로 유입 0건
- legacy 회귀 0건

## 10. Phase C — 등록·목록 실제 기능

### C-01 registration binding

- 승인된 form을 Phase 3 draft/validation에 연결
- saved/recent/Kakao 후보 연결
- AP-004 결정에 따라 실제 저장 가능한 정산 옵션만 활성화
- 미지원 UI는 숨김·disabled·후속 승인 중 하나로 사용자에게 재확인

### C-02 list binding

- 실제 query·pagination·loading·empty·error 연결
- client current page를 전체 통계처럼 계산하지 않음

### C-03 submit·retry

- duplicate-submit guard
- pending/success/failure/retry
- list·recent candidate invalidation

### C exit gate

- 등록→validation→submit→성공/실패 journey
- list query·pagination·retry
- 승인된 화면 구조 drift 없음
- legacy 434 tests 유지

## 11. Phase D — 상세·상태·차주 배정

### D-01 detail binding

- 실제 detail hydration
- copy/edit, memo, amount log 연결
- selection·loading·error·retry 보존

### D-02 status binding

- 기존 enum·domain guard 유지
- 승인된 표시명·색·control 배치만 사용
- mock의 비순차 상태 전환 금지

### D-03 assignment binding

- lookup→필요 시 등록→persisted driver 선택→assign
- 자유 텍스트 즉시 배정 금지
- 위치·가용·계좌·AI는 data contract 전 미연결

### D exit gate

- detail/status/assign journey 통과
- AP-003·AP-014 반영
- 승인 화면 대비 Critical/High drift 0건

## 12. Phase E — 새 화면 frontend-only 기능 정식화

| task | 기능 | 조건 |
|---|---|---|
| E-01 | saved/recent address recommendation | 실제 후보만 표시 |
| E-02 | list collapse/restore | filter/page/selection/scroll 보존 |
| E-03 | fixed quick chips | 실제 draft event 연결 |
| E-04 | 금액 stepper | current numeric constraint 유지 |
| E-05 | desktop polish | G-UI 승인 screenshot 기준 |

pair ranking, 최근/최빈 운임, AI advisor는 포함하지 않는다.

## 13. Phase F — Phase 3-only 기능 배치

| 기능 | 배치 원칙 |
|---|---|
| copy/edit, pagination, submit retry, 운행 마감 | primary 또는 항상 접근 가능한 secondary |
| auto refresh, Excel, bulk accept, card view | compact secondary toolbar |
| memo, amount logs | inline detail secondary area |
| CargoMan | driver advanced area |
| draft recovery, dirty guard | 동작 보존 |

추가 배치가 G-UI 승인 화면을 크게 바꾸면 다시 사용자 확인을 받는다.

## 14. Phase X — 별도 승인 신규 기능

| package | 범위 | 승인 |
|---|---|---|
| X-STATISTICS | pair·최근/최빈 운임·교차 count | AP-005 |
| X-WAYPOINT | 경유지 ordered points | AP-006 |
| X-CARGO-WEIGHT | 실중량 저장 | AP-007 |
| X-SETTLEMENT-DATE | 정산 예정일 | AP-008 |
| X-AI | 난이도·advisor·추천 차주 | AP-009 |
| X-DRIVER-LIVE | 위치·가용·계좌·연계지 거리 | AP-010 |
| X-CHAT | 실제 대화방 | AP-011 |

prototype에서 보였다는 이유만으로 이 기능을 구현하지 않는다. 각 package를 별도 승인한다.

## 15. Phase Q — Production closeout

### regression

```powershell
.\node_modules\.bin\vitest.cmd run --config vitest.config.unit.ts app/test/broker-order-console
.\node_modules\.bin\vitest.cmd run --config vitest.config.unit.ts app/test/broker-order-console-new
```

- TypeScript typecheck·project build
- legacy/new route isolation
- 등록·목록·상세·상태·배정 journey
- auth·tenant·validation·cache 회귀

### fidelity

- G-UI 승인 screenshot과 production 화면 비교
- 1600×1000 CK-01~05
- 1440×900 기본/loading/empty/error
- Critical/High visual drift 0건

### closeout

- legacy 434 tests 통과
- `REJECT` production 유입 0건
- 미승인 `DEFER` 기능 연결 0건
- 남은 tolerance gap과 승인 대기 기록

## 16. 권장 첫 구현 묶음

G0 승인 후에는 다음만 진행한다.

`R-00 → R-01 → N-00 → N-01 → N-02 → P-01 → P-02 → P-03 → P-04 → P-05 → P-06`

그다음 **G-UI에서 반드시 멈추고 사용자 화면 확인을 기다린다.** B-00 이후 기능 연결 작업은 포함하지 않는다.

## 17. 중단 조건

### Prototype 중단 조건

- reference hash 변경
- 기존 route 수정 필요
- API/service 연결 없이는 화면조차 만들 수 없는 구조
- reference와 Critical/High visual gap을 해소할 수 없음

### 기능 연결 중단 조건

- backend/service/repository/domain/schema 변경 필요
- 공용 query key·DTO 변경이 다른 route에 영향
- auth/tenant/state guard 약화 필요
- existing focused suite 회귀

중단 시 현재 단계 밖으로 확장하지 않고 원인·대안·영향 범위를 별도 제안한다.
