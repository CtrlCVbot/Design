# G-UI Revision 1 — Code Fidelity Contract

- 작성일: 2026-07-10
- gate: `G-UI revise-ready (R1)`
- reference SSOT: `C:\Work\Dev\Design\.references\code\nb-main\src\pages\Dispatches.tsx`
- style SSOT: `C:\Work\Dev\Design\.references\code\nb-main\src\index.css`, `src\components\ui.tsx`
- target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- 범위: UI 구조·route-local demo interaction·motion·token 수정
- 제외: API, backend/service/repository/domain/schema, legacy route 변경

## 1. 사용자 피드백과 확인된 원인

| R1 ID | 사용자 피드백 | reference code anchor | 현재 gap | 필수 수정 |
|---|---|---|---|---|
| R1-01 | 거래처 검색 결과 화면 없음 | `Dispatches.tsx:4821-4924` | 검색 버튼이 state action 없음 | 우측 pane `clientSearch` mode, 검색·empty·선택·복귀 구현 |
| R1-02 | 전체 화면이 중앙에 갇힘 | `index.css:551-567` | `max-width:1580px`, `margin:auto` | full-width 40/60 frame, max-width 제거 |
| R1-03 | motion·interaction 부족 | `index.css:43-44,218-245,543-546,688-702`, `ui.tsx:3-53` | pane/detail 진입·press·hover motion 부족 | reference timing·easing·press·hover·reduced-motion 적용 |
| R1-04 | 상세 정보 구조·section 불일치 | `Dispatches.tsx:5129-5864` | 동일 크기 2×2 요약 카드 | advisor + 55/45 grid + 좌 상세 + 우 운임·차주/상태 구조 |
| R1-05 | 세부 디자인 불일치 | reference token·inline style 전반 | spacing·heading·badge·row state 단순화 | code token map과 component treatment 재적용 |

## 2. Reference 구조 계약

### 2.1 Desktop frame

```text
dispatch-layout-container (full available width)
├─ dispatch-left-area  40%
└─ dispatch-right-area 60%
```

- gap: `2rem`
- height: `calc(100vh - 3rem)`에 해당하는 viewport fill
- outer `max-width`와 중앙 정렬 금지
- 좌·우 pane scroll owner 분리
- 1024px 이하에서만 single column 전환

### 2.2 Right pane modes

```text
rightMode
├─ list
├─ clientSearch
├─ recommendations
└─ collapsed
```

`clientSearch` mode 필수 요소:

1. title `거래처 검색 및 선택`
2. 검색 input `거래처명, 담당자 또는 연락처로 검색...`
3. 검색 button
4. `운행내역 보기` 또는 닫기 action
5. 거래처명 / 사업자번호 / 담당자 / 연락처 / 선택 column
6. row hover와 선택 action
7. empty result
8. 선택 후 draft에 거래처명·전화번호·담당자 반영, list mode 복귀

### 2.3 Expanded detail

```text
expanded row workspace
├─ AI advisor/deferred strip
└─ detail-grid 55 / 45
   ├─ left: 상세 정보
   │  ├─ 거래처 context + secondary actions
   │  ├─ 상차지 / 하차지 route timeline
   │  ├─ 차량 / 화물 정보
   │  └─ 메모 / 경유지 deferred context
   └─ right: control stack
      ├─ 운임 및 수수료 정보 수정 모양
      └─ 차주 배정 및 상태 제어
         ├─ 차량번호 + 차량배정
         ├─ 차주명 + 연락처
         └─ 6-state segmented control
```

가짜 AI·위치·운임 판단 데이터는 계속 금지한다. 입력·status control은 route-local demo transition까지만 허용하고 `prototype-only`를 표시한다.

## 3. Motion 계약

| 용도 | reference 값 | target 적용 |
|---|---|---|
| fast interaction | `200ms cubic-bezier(0.4,0,0.2,1)` | chip·button·row·card hover/focus |
| normal transition | `350ms cubic-bezier(0.4,0,0.2,1)` | layout·pane width·color |
| detail enter | `slideDown 300ms` | inline expanded detail |
| pane enter | `fadeSlideUp 220ms cubic-bezier(0.16,1,0.3,1)` | list/search/recommendation/assignment pane |
| button press | `scale(0.97)` | 주요 interactive button `:active` |
| row hover | bg transition | client·dispatch·recommendation row |

`prefers-reduced-motion: reduce`에서는 animation과 transform transition을 제거한다.

## 4. Token·component map

| 영역 | 값/처리 |
|---|---|
| background | `#F2F4F6` |
| surface | `#FFFFFF` |
| primary | `#3182F6` |
| primary hover | `#1B64DA` |
| border | `#E5E8EB` |
| text primary | `#191F28` |
| text secondary | `#4E5968` |
| text tertiary | `#8B95A1` |
| panel heading | 4px primary rail + 0.92rem/700 |
| field | 40px 전후, transparent border, focus ring |
| detail card | white, 1px border, medium radius, subtle shadow |
| status control | 하나의 segmented bar, active status별 color |

## 5. TDD acceptance

### R1-01 거래처 검색

- 검색 button 클릭 시 `운행 내역` 대신 `거래처 검색 및 선택` region이 보인다.
- 담당자·연락처·사업자번호로 filter할 수 있다.
- 결과 선택 시 3개 draft field가 채워지고 list mode로 복귀한다.
- 결과 0건 empty state가 보인다.

### R1-02 layout

- `.workspace`는 `width:100%`, `max-width:none`, `margin:0` 계약을 갖는다.
- desktop column은 40/60이며 1024px 이하에서만 1 column이다.

### R1-03 motion

- CSS에 fast·normal token, pane/detail keyframe, active press, reduced-motion fallback이 존재한다.
- list, client search, recommendation, assignment, detail state에 motion class가 연결된다.

### R1-04 detail

- 상세에 좌 `상세 정보`, 우 `운임 및 수수료 정보 수정`, `차주 배정 및 상태 제어`가 존재한다.
- 6개 상태 segmented control이 현재 상태를 표시하고 demo 상태 변경을 수행한다.
- 차량·차주 field 모양과 차량배정 action이 같은 control card에 존재한다.

### R1-05 isolation

- network/localStorage/backend/service import 0건
- 기존 `/test/broker-order-console/**` 변경 0건
- fixture는 `_prototype/**`에만 존재
- 새 production component마다 project guard가 인식하는 basename test가 존재

## 6. 검증 순서

1. 신규 R1 test Red 확인
2. 최소 구현 Green
3. focused test
4. `tsc --noEmit`
5. rules guard dry-run
6. legacy regression
7. isolated production build
8. code-to-code fidelity review
9. browser state·motion computed style 확인
10. `verify-html-fidelity` verdict 갱신

## 7. 승인 경계

R1 검증이 끝나도 gate는 자동 승인하지 않는다. 사용자 재검수 전 상태는 `G-UI revise-ready`이며 Phase B는 계속 보류한다.

## 8. 구현·검증 결과

- R1-01~05 구현 완료
- 신규 route test: 11 files / 22 tests PASS
- legacy regression: 46 files / 434 tests PASS
- TypeScript·production build·rules guard PASS
- browser full-width·client search·55/45 detail·motion computed style PASS
- closeout verdict: `LIMITED`, 사용자 재검수 대기
