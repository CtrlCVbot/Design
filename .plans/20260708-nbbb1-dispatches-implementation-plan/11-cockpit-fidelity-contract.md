# 11. 콕핏 화면 Fidelity 계약

- 작성일: 2026-07-10
- mode: `contract-only`
- primary code reference: `C:\Work\Dev\Design\.references\code\nb-main`
- supporting reference: `C:\Work\Dev\Design\.plans\20260708-nbbb1-dispatches-analysis`
- frozen capability baseline: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console`
- target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- 구현 상태: 미착수

## 1. 현재 판정

| 항목 | 판정 |
|---|---|
| 기능 상태 | Phase 3 핵심 동작은 다수 재사용 가능 |
| 화면 fidelity | 현재 list + drawer/inline workspace는 nbbb1 콕핏 구성과 다름 |
| 구현 결정 | 기능 계약을 보존하면서 container·정보 구조를 nbbb1에 맞게 재배치 |
| prototype closeout | reference/prototype screenshot 비교와 사용자 승인 전 기능 연결 금지 |
| production closeout | Phase 3 연결 후 reference/app screenshot과 업무 회귀 비교 전 완료 판정 금지 |

## 2. Reference 입력

| artifact | 역할 | 핵심 근거 |
|---|---|---|
| `nb-main/src/pages/Dispatches.tsx` | primary code-level 화면·interaction 기준 | pane mode, form, list, expanded detail, assignment, recommendation, responsive composition |
| `nb-main/src/index.css` | primary token·responsive 기준 | color, radius, spacing, typography, dark/mobile rule |
| `nb-main/src/layouts/MainLayout.tsx` | app-shell 참고 | sidebar 폭·collapsed interaction; 실제 앱 navigation으로 직접 이식하지 않음 |
| `nb-main/src/components/ui.tsx` | primitive 참고 | badge/button/input 시각 의도; 현재 앱 component로 변환 |
| `01-기능분석-이벤트정리.md` | 기능·이벤트 기준 | 좌 3모드, 우 2모드, 등록·배정·관제·소통 흐름 |
| `02-userflow.md` | 사용자 여정 기준 | 등록, 배정, 상태 관제, 금액 수정, 대화 흐름 |
| `03-wireframe.html` | 구조·상태 목업 | 화면 상태 6종과 주석 |
| `04-design-system.md` | token·component 기준 | 색, radius, shadow, typography, chip/badge/button |
| `screenshots/01-initial.png` | 기본 desktop | 좌 등록 + 우 목록 |
| `screenshots/03-baechajoong-expanded.png` | 상세 확장 | 우측 inline workspace |
| `screenshots/14-assign-filled.png` | 배정 mode | 좌 차주 목록 + 우 선택 행 |
| `screenshots/23-client-search.png` | 추천 mode | 좌 등록 + 우 주요 주소 후보 |
| `screenshots/32-mobile.png` | mobile 참고 | 목록 우선 단일 column |

## 3. 화면·상태 인벤토리

| 상태 ID | 화면 상태 | reference | Phase 3 source | 1차 요구 |
|---|---|---|---|---|
| CK-01 | 기본: 좌 등록 + 우 목록 | `01-initial.png` | inline workspace + list | 필수 |
| CK-02 | 목록 행 상세 확장 | `03-baechajoong-expanded.png` | detail hydration + workspace | 필수 |
| CK-03 | 좌 차주 배정 mode | `14-assign-filled.png` | driver lookup + draft apply | 필수, AI 영역 제외 |
| CK-04 | 우 주소 추천 mode | `23-client-search.png` | saved/recent/Kakao candidates | 필수, pair ranking 제외 |
| CK-05 | 우 목록 접힘 | analysis NB-032 | 신규 view-only state | 1차 후반 |
| CK-06 | loading | nbbb1 명시 약함 | current list/detail state | 필수, Phase 3 방식 유지 |
| CK-07 | empty | nbbb1 NB-036 | current tab별 empty | 필수 |
| CK-08 | error/retry | nbbb1 명시 약함 | current list/detail/support state | 필수, Phase 3 방식 유지 |
| CK-09 | submit blocked/pending/success/failure | nbbb1 단순 alert/success | current actionbar state | 필수, Phase 3 방식 유지 |
| CK-10 | dirty close/mode switch | nbbb1 미정 | current dirty guard | 필수 |
| CK-11 | mobile list | `32-mobile.png` | responsive/card mode | 별도 승인 후 |

## 4. 구조 계약

### 4.1 Desktop 기본 frame

```text
app navigation owner
└─ cockpit content
   ├─ left pane: 약 600px, register / assign / chat(deferred)
   └─ right pane: fluid, list / address recommendations / collapsed
```

필수 anchor:

- desktop에서 등록 workspace와 목록이 같은 viewport 안에 동시에 보인다.
- 좌측은 입력 흐름, 우측은 목록·선택·추천 결과를 담당한다.
- panel mode가 바뀌어도 현재 draft와 선택 order context를 잃지 않는다.
- 목록 scroll과 좌측 입력 scroll owner를 분리한다.
- action bar는 입력 pane의 작업인지 상세 pane의 작업인지 명확해야 한다.
- 기존 `new/copy/edit`, detail loading/error, dirty guard는 container 변경 후에도 유지한다.

### 4.2 구조적으로 금지하는 재해석

- 새 화면을 기존 full-width list + modal dialog 중심 UI로 되돌리지 않는다.
- 좌측 등록과 우측 목록을 서로 다른 route로 분리하지 않는다.
- 후보 목록을 모두 작은 modal 안에 숨기지 않는다.
- AI·통계·위치 데이터가 없는데 reference와 비슷하게 보이기 위해 fixture를 표시하지 않는다.
- Phase 3의 submit/retry/guard를 reference 목업의 단순 alert 동작으로 낮추지 않는다.
- `nb-main`의 `BrowserRouter`, `localStorage`, fixture, mock AI/chat를 fidelity 구현의 일부로 복사하지 않는다.
- 기존 `broker-order-console` route를 새 layout으로 덮어쓰지 않는다.

## 5. Token 계약

| 영역 | reference | 구현 규칙 |
|---|---|---|
| page background | `#F2F4F6` | route-local design scope에서 적용 |
| surface | `#FFF` | panel/card background |
| primary | `#3182F6` | CTA, active chip, link |
| text | `#191F28 / #4E5968 / #8B95A1` | 본문/보조/placeholder hierarchy |
| semantic | 진행 주황, 완료 청록, 취소 빨강 | 기존 domain status mapping과 정렬 |
| radius | 8 / 12 / 18 / full | field/button/panel/chip 역할별 사용 |
| shadow | sm/md/lg | CTA/panel/overlay 역할별 사용 |
| font | Pretendard 계열 | 현재 앱 typography와 충돌 시 route-local 우선 |
| input | gray borderless, r12 | focus ring·error affordance는 현재 접근성 유지 |

신규 route에서 현재 `BrokerOrderDesignScope`와 공용 UI token을 우선 재사용하고, `nb-main/src/index.css`와 차이가 있는 값만 route-local contract test와 screenshot으로 조정한다. 앱 전역 token을 바꾸지 않는다.

## 6. Component·asset map

| reference pattern | Phase 3 자산 | 방식 | 위험 |
|---|---|---|---|
| 최근 거래처 chip | recent shipper candidates | 후보 source 재사용, inline chip 신규 | 낮음 |
| 주소·구간 chip | address candidates | side별 후보 먼저, pair는 후속 | 중간 |
| quick datetime | route time option | 그대로 재사용 | 낮음 |
| vehicle/cargo chip | recent cargo candidate | chip surface 조정 | 낮음 |
| settlement toggle | receipt/prepaidCollect | 2옵션 우선 유지 | 중간 |
| compact list | console table | column variant | 중간 |
| inline detail | workspace sections | compact read/edit composition | 중간 |
| driver cards | driver lookup candidates | panel composition | 중간 |
| address recommendation | address lookup candidates | right panel composition | 중간 |
| icon rail | app navigation | owner 결정 전 제외 | 높음 |
| chat panel | 없음 | 승인 전 제외 | 높음 |

`nb-main` 자체 component는 production component로 직접 import하지 않는다. 화면 구조는 신규 route component로 변환하고, 데이터 동작은 `phase3-capability-bridge`를 통한다.

아이콘은 기존 Lucide 자산을 우선 사용한다. reference와 의미가 다른 아이콘으로 임의 대체하지 않는다.

## 7. 허용되는 차이

reference는 API 없는 client mock이므로 다음은 의도적으로 production 자산을 우선한다.

| reference as-is | 구현 기준 | 이유 |
|---|---|---|
| native `alert()` validation | current inline status + field feedback + toast | 접근성·재시도·중복 submit 보호 |
| 50건 전체 렌더 | pagination 유지 | 성능·실데이터 대응 |
| 비순차 상태 전환 | 기존 server/domain guard 유지 | 데이터 무결성 |
| postcode iframe | 현재 Kakao REST candidate dialog | saved/recent/Kakao 통합과 주소록 저장 보존 |
| 모든 변화 client 즉시 반영 | query invalidation + 필요한 optimistic UI | 서버 source of truth 유지 |
| AI/거리/추천 fixture | 데이터가 없으면 미노출·empty/deferred | 가짜 업무 판단 방지 |

허용 차이는 “디자인을 임의로 바꾼 것”이 아니라 목업 한계를 production 계약으로 대체한 항목으로 기록한다.

## 8. Visual gap board

| Gap ID | 차이 | severity | 1차 해소 |
|---|---|---|---|
| VF-01 | 현재 workspace가 top/drawer이고 좌 고정 pane이 아님 | High | desktop grid composition |
| VF-02 | 목록 toolbar·table가 reference보다 복잡함 | Medium | 핵심 control 우선순위와 compact variant |
| VF-03 | 후보가 dialog 중심 | High | recent 후보 inline/panel surface |
| VF-04 | 상세가 section stack이며 reference compact card와 다름 | Medium | compact detail mode |
| VF-05 | driver lookup이 dialog 중심 | High | 좌 assign mode |
| VF-06 | reference token과 현재 shadcn token 차이 | Medium | route-local token map |
| VF-07 | right collapse/restore tab 없음 | Low | frontend-only view state |
| VF-08 | mobile order/column 규칙 미구현 | Medium | 별도 mobile phase |
| VF-09 | reference sidebar와 기존 app navigation 차이 | Medium | existing app navigation 유지, reference sidebar 미이식 |
| VF-10 | `Dispatches.tsx` 단일 6,118줄 구조 | High | 화면 slice·view model·bridge로 분해 |
| VF-11 | reference localStorage/fixture와 production API 차이 | High | Phase 3 capability bridge |

## 9. 구현 순서

1. `nb-main` hash와 reference runtime/screenshot baseline을 고정한다.
2. 신규 `broker-order-console-new` route와 isolation test를 만든다.
3. route-local frame/token을 정렬한다.
4. CK-01 기본 좌우 frame을 만든다.
5. 등록 section을 좌 pane에 배치한다.
6. 목록을 우 pane compact variant로 배치한다.
7. CK-04 address recommendation panel을 연결한다.
8. CK-02 inline detail을 연결한다.
9. CK-03 driver assignment panel을 연결한다.
10. 여기까지는 in-memory demo adapter만 사용해 interaction prototype으로 완성한다.
11. CK-01~05 screenshot과 실제 route를 사용자에게 제공하고 수정 요청을 반영한다.
12. 사용자가 G-UI를 승인한 뒤 Phase 3 capability bridge를 연결한다.
13. loading/empty/error/dirty/submit의 실제 상태를 검증한다.
14. optional collapse와 mobile을 별도 slice로 검증한다.

## 10. 완료 기준

### Exact-match 우선 항목

- desktop 좌/우 pane 비율과 block order
- panel surface, background, radius, primary/semantic color
- section title hierarchy
- chip/badge/button 시각 위계
- 기본·상세·배정·추천 mode의 정보 배치

### Tolerance 허용 항목

- typography의 1px 내 차이
- 실제 데이터 길이에 따른 column width
- 현재 접근성 focus ring
- pagination·retry 등 production-only control의 secondary placement

### 필수 screenshot

- desktop 1600×1000: CK-01, CK-02, CK-03, CK-04
- desktop 1440×900: CK-01, loading, empty, error
- mobile 390px: 사용자 승인 후 CK-11

### Prototype 사용자 승인 체크리스트

- 좌우 pane 비율과 화면 밀도
- 등록 section 순서와 한 화면 정보량
- 목록 column·row 높이·filter 위치
- 상세 확장 방식과 선택 강조
- 차주 배정 mode의 전환·카드 배치
- 추천 panel과 list collapse interaction
- 버튼·chip·badge 색과 위계
- 화면 용어와 운영자가 이해하기 어려운 표현
- 제외·추가·이동할 요소

사용자 승인 결과는 `approved / revise`로 기록한다. `revise`이면 UI layer만 반복하고 capability bridge 작업은 시작하지 않는다.

### 기능 검증

- 기존 focused unit tests
- TypeScript typecheck
- layout/component focused tests
- list→detail, register, assign, status, submit/retry journey
- reference/app screenshot 비교

### closeout 조건

- Critical/High visual gap 0건
- reference에만 있고 승인 전인 기능은 `deferred`로 명시
- Phase 3-only production guard 회귀 0건
- 기존 `broker-order-console` 파일 diff 0건과 focused 434 tests 회귀 0건
- screenshot evidence와 남은 허용 gap 기록

prototype closeout과 production closeout은 별개다. prototype 화면 승인만으로 API 연결이나 업무 기능 구현 완료를 선언하지 않는다.
