# 14. `nb-main` 코드 변환·적용 계획

- 작성일: 2026-07-10
- 상태: 구현 전 변환 계약
- 코드형 기획 원본: `C:\Work\Dev\Design\.references\code\nb-main`
- Phase 3 회귀 기준선: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console`
- 신규 구현 target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`

## 1. 결론

`nb-main`은 새 화면의 구조·시각·상호작용을 구체적으로 확인할 수 있는 **code-level reference**다. 그러나 Vite/React Router, fixture, `localStorage`, 자유로운 client 상태 변경을 전제로 한 기획용 구현이므로 현재 Next.js 앱에 그대로 복사하지 않는다.

변환 원칙은 다음 한 문장으로 고정한다.

> 1차는 `nb-main`의 화면과 interaction을 독립 UI prototype으로 최대한 보존하고 사용자가 화면을 승인한다. 2차부터 데이터·권한·상태 전이·submit·cache를 기존 Phase 3의 검증된 계약으로 교체한다.

## 2. Source 역할과 우선순위

| source | 역할 | 우선하는 판단 | 수정 여부 |
|---|---|---|---|
| `nb-main/src/pages/Dispatches.tsx` | 화면·interaction 원본 | pane, section, chip, filter, expand, assign, recommendation mode | 원본 수정 금지 |
| `nb-main/src/index.css` | 시각 token·responsive 근거 | color, radius, spacing, typography, dark/mobile rule | 원본 수정 금지 |
| nbbb1 분석 문서·screenshot | 의도·상태·시각 evidence | userflow, screen inventory, visual comparison | 원본 수정 금지 |
| 기존 `broker-order-console` | production capability 기준선 | API, auth, tenant, state guard, validation, cache, retry | route 내부 수정 금지 |
| 신규 `broker-order-console-new` | 변환 결과 | 모든 신규 component·adapter·test | 유일한 기본 변경 대상 |

충돌 우선순위:

1. 데이터 무결성·인증·tenant·server contract는 기존 Phase 3를 따른다.
2. 화면 구조·정보 위계·interaction은 `nb-main`을 따른다.
3. 둘을 연결할 수 없으면 fixture로 흉내 내지 않고 `deferred` 또는 승인 항목으로 격리한다.

## 3. Reference 코드 진단

| 항목 | 확인 결과 | 변환 영향 |
|---|---|---|
| runtime | Vite 8 + React 19 + React Router 7 | Next.js App Router route로 재작성 |
| 주 화면 | `Dispatches.tsx` 6,118줄 / 281,279 bytes | 그대로 복사 금지, 화면 slice별 분해 필수 |
| 상태·저장 | dispatch/client/chat 등을 `localStorage`에 저장 | 실제 Phase 3 query/mutation/draft contract로 교체 |
| 데이터 | 대량 fixture와 history pool 포함 | production UI에서 사용 금지, test fixture로만 별도 정의 |
| 추천 | local 배열 기반 구간·운임 통계 | server contract 전까지 실제 통계처럼 노출 금지 |
| AI 난이도 | `dispatch.id % 3` 기반 mock heuristic | 이식 금지, AP-009로 격리 |
| 채팅 | `localStorage` + timeout 가짜 응답 | 이식 금지, AP-011로 격리 |
| feedback | native `alert/prompt/confirm` 사용 | 현재 field error·toast·guard로 교체 |
| style | inline style 다수 + global CSS | route-local design scope와 component variant로 변환 |
| type safety | `any` 다수 | 기존 DTO/domain type과 명시적 view model 사용 |
| Supabase | placeholder client 존재, dispatch 흐름과 미연결 | 도입·연결 금지 |

`nb-main`에 `node_modules`가 없으므로 이번 문서 패스에서는 build를 실행하지 않았다. 원본의 기능 사실은 정적 코드 분석으로만 확정하며, 구현 착수 후 별도 reference runtime이 필요하면 lockfile 기준 재현 절차를 승인받아 추가한다.

## 4. 이식 판정

### 4.1 `PORT` — 형태와 interaction을 이식

- 좌측 등록 / 차주 배정 / 대화 mode 구조 중 승인된 mode
- 우측 목록 / 추천 / 접힘 mode 구조
- dense cockpit layout, panel scroll owner, section order
- quick chip, filter, expanded row, 금액 조정 등 frontend interaction
- color, radius, spacing, badge, button hierarchy
- desktop responsive rule과 승인된 mobile rule

### 4.2 `BRIDGE` — 화면은 보존하고 Phase 3 기능으로 교체

- 화주·주소·차량·화물 후보 조회
- 등록 draft, validation, submit, retry, duplicate-submit guard
- 목록 query, pagination, refresh, empty/error/loading
- 상세 hydration, copy/edit, 상태 변경, 취소·마감 guard
- 차주 조회·등록·선택·배정
- support memo, amount log, Excel, bulk action 등 Phase 3-only capability

### 4.3 `REJECT` — production으로 이식 금지

- `BrowserRouter`, reference `MainLayout`, 7개 가짜 route를 앱 shell로 복사
- dispatch/client/driver/chat `localStorage` 저장과 migration
- fixture를 API 결과처럼 노출
- `id % 3` AI 난이도와 근거 없는 추천·위치·통계
- timeout 기반 가짜 chat reply
- native `alert/prompt/confirm`
- placeholder Supabase 연결
- 6,118줄 component와 inline style의 직접 복사
- 기존 route service/API 규칙을 우회하는 새 fetch·mutation 구현

### 4.3.1 `PROTOTYPE-ONLY` — 화면 확인 단계에서만 허용

- route-local in-memory fixture
- 입력·필터·pane 전환·행 확장·선택·collapse 같은 view interaction
- 등록·배정·상태 변경의 성공 모습을 보여주는 demo transition
- 실제 data contract가 없는 영역의 명확한 `prototype` 표시

허용 조건:

1. `_prototype/**` 아래에서만 정의한다.
2. `localStorage`, network request, 실제 mutation을 사용하지 않는다.
3. 새로고침하면 초기 상태로 돌아간다.
4. 사용자 승인용이라는 표시를 화면과 문서에 남긴다.
5. G-UI 승인 후 capability bridge 연결 과정에서 삭제하거나 test/story fixture로 이동한다.
6. prototype에서 보인 기능이 실제 구현 확정을 의미하지 않는다.

### 4.4 `DEFER` — 별도 승인 후

- pair 통계, 최근/최빈 운임, 전체 교차 count
- 경유지, 실중량 저장, 정산 예정일
- AI advisor, 실시간 차주 위치·가용 상태
- 실제 대화방과 `/chats`
- 전역 navigation 교체와 7개 운영 메뉴 확장

## 5. 신규 route 권장 구조

```text
app/test/broker-order-console-new/
├─ page.tsx
├─ _components/
│  ├─ cockpit-shell.tsx
│  ├─ registration-pane.tsx
│  ├─ dispatch-list-pane.tsx
│  ├─ inline-detail-pane.tsx
│  ├─ driver-assignment-pane.tsx
│  └─ recommendation-pane.tsx
├─ _adapters/
│  ├─ dispatch-view-model.ts
│  ├─ registration-view-model.ts
│  └─ phase3-capability-bridge.ts
├─ _prototype/
│  ├─ prototype-screen-adapter.ts
│  └─ reference-fixtures.ts
├─ _contracts/
│  └─ nb-main-screen-contract.ts
├─ _store/
│  └─ cockpit-ui-store.ts
└─ __tests__/
   ├─ route-isolation.test.tsx
   ├─ cockpit-screen-contract.test.tsx
   └─ phase3-capability-bridge.test.ts
```

세부 규칙:

- `_store`는 pane mode, expand, selection, collapse 같은 **view-only state**만 소유한다.
- 서버 데이터와 mutation 결과를 `_store`에 복제하지 않는다.
- `_adapters`가 Phase 3 DTO/domain을 화면 view model로 번역한다.
- 기존 route-local 자산이 꼭 필요하면 `phase3-capability-bridge.ts` 한 곳에서만 import한다.
- service 로직은 복사하지 않고 기존 공용 service/hook을 우선 사용한다.
- 기존 route와 신규 route 사이의 deep import를 여러 component에 흩뿌리지 않는다.
- G-UI 승인 전에는 `phase3-capability-bridge.ts`를 구현하지 않고 `_prototype` adapter만 연결한다.
- G-UI 승인 후 component/view model은 유지하고 data adapter만 prototype → Phase 3 bridge로 교체한다.

## 6. 기존 route 동결 계약

다음은 구현 전부터 closeout까지 유지해야 하는 invariant다.

1. `app/test/broker-order-console/**` 파일을 수정·이동·삭제하지 않는다.
2. 기존 route의 현재 focused suite `46 files / 434 tests`를 회귀 기준으로 유지한다.
3. 신규 코드와 신규 focused test는 `broker-order-console-new/**`에 둔다.
4. 신규 route의 view state가 기존 route의 draft/panel state와 섞이지 않아야 한다.
5. query cache를 공유하더라도 invalidation key와 tenant scope는 기존 계약을 따른다.
6. 기존 route-local import가 불가피하면 단일 bridge whitelist와 characterization test로 고정한다.

## 7. Capability bridge 계약

| 화면 요구 | bridge 입력 | Phase 3 owner | fallback |
|---|---|---|---|
| 등록 폼 | view model event | current draft/actionbar | current validation 오류 표시 |
| 화주·주소 추천 | query text/context | saved/recent/Kakao candidate | empty + retry |
| 목록 | filter/page | current list query | loading/empty/error |
| 상세 | selected order ID | current detail hydration | 선택 유지 + retry |
| 상태 변경 | order/version/action | current status mutation/guard | blocked reason 표시 |
| 차주 배정 | persisted driver ID | current lookup/assign | 자유 텍스트 즉시 배정 금지 |
| 등록 성공 | create result | current invalidate/selection | 중복 submit 방지 |

bridge 구현 전 먼저 characterization test를 작성해 기존 contract를 고정한다. create의 `selectedManagerId`, recent candidate cache freshness 등 확인된 불일치는 기존 route를 수정하지 않고 신규 bridge의 preflight로 처리하되, 공용 service 변경이 필요해지면 작업을 중단하고 별도 제안한다.

## 8. 변환 작업 단위

| 단계 | 입력 | 산출물 | 통과 조건 |
|---|---|---|---|
| R0 | reference source | source manifest, screen contract, reject list | hash·상태 inventory 고정 |
| R1 | `Dispatches.tsx` | component boundary와 view model | fixture/API 의존 없는 contract |
| R2 | CSS·layout | route-local token·cockpit shell | CK-01 static fidelity |
| R3 | in-memory demo adapter | CK-01~05 interaction prototype | 실제 API/mutation 0건 |
| G-UI | prototype + evidence | 사용자 화면 승인 또는 수정 요청 | 명시적 승인 전 기능 연결 금지 |
| R4 | Phase 3 baseline | capability bridge | auth/tenant/guard 보존 test |
| R5 | register/list/detail | 실제 data 연결 | main journeys + error state |
| R6 | assign/recommend | 승인 기능 연결 | AP gate 준수 |
| R7 | secondary 기능 | Phase 3-only hierarchy | 기능 삭제 없이 밀도 조정 |
| R8 | screenshot evidence | production fidelity closeout | Critical/High gap 0 |

## 9. Reference drift manifest

2026-07-10 분석 기준 SHA-256이다. 구현 시작 전에 값이 달라졌으면 먼저 이 문서와 screen contract를 재검토한다.

| 파일 | bytes | SHA-256 |
|---|---:|---|
| `package.json` | 703 | `9ba569b81e5f68a2d058aed8d63a6b2b6784f4629f6c2912d23500a5d3d508c0` |
| `src/pages/Dispatches.tsx` | 281279 | `7610ccf3a2c951900deebb7227b6bab0c78dbb8b39f2fbc2b59ed76048b72987` |
| `src/index.css` | 19519 | `9559fa9e3f819d47a56e620a225ed2c4ca371d6480be5e3304f0cbdf49ee6cf3` |
| `src/layouts/MainLayout.tsx` | 13130 | `7da2dababad59508cb9a309369f00a629f6140c94151a4d10b7044f8d37a569a` |
| `src/components/ui.tsx` | 4340 | `97a39311f0e3230b96ea21663a9071f4c9c905e6cfdc60b62d05218ba354d311` |

## 10. 검증 전략

### Static boundary

- 신규 route에서 `localStorage`, `@supabase/supabase-js`, fixture history, `window.alert/prompt/confirm` import·호출 0건
- 기존 route 파일 diff 0건
- bridge 외 기존 route-local deep import 0건
- G-UI 전 network/API/mutation 호출 0건
- prototype fixture는 `_prototype/**` 밖에서 import 0건

### Functional regression

- 기존 route: 현재 434 focused tests 유지
- 신규 route: registration, list, detail, status, assignment, submit/retry journey
- 두 route 왕복 시 draft, selected order, pane mode leak 없음

### Fidelity

- `nb-main`과 신규 route의 CK-01~04 동일 viewport screenshot 비교
- asset/token/computed style 비교
- production-only control 차이는 허용 gap으로 근거 기록

## 11. 추가 제안

1. **Reference manifest 자동 검사**: R0에서 hash 확인 script를 두어 기획 코드 변경을 조용히 놓치지 않는다.
2. **Import-boundary test**: 신규 route가 reference source, Supabase, 기존 route 내부 파일을 무분별하게 참조하지 못하게 한다.
3. **Golden journey matrix**: 기존/신규 route에서 등록·상세·상태·배정 결과가 같은지 입력과 결과만 비교한다.
4. **Reference mode 분리**: G-UI 전에는 `_prototype` fixture만 허용하고, 승인 후에는 Story/test로 이동해 production data path와 분리한다.
5. **UI/domain 이중 계약**: 화면 fidelity test와 Phase 3 capability test를 분리해 시각 수정이 업무 규칙을 약화시키지 않게 한다.
6. **기능 교체 로그**: `PORT/BRIDGE/REJECT/DEFER` 판정을 component PR마다 기록해 원본에서 빠진 기능과 의도적 차이를 추적한다.

## 12. UI prototype 시작 조건

- Gate G0에서 신규 route 격리와 `UI PORT → 사용자 승인 → BRIDGE` 순서 승인
- reference hash 재확인
- 기존 434 tests 재통과
- 기존 route 파일 diff 0건 확인
- CK-01~05 prototype screen contract 확정

조건을 만족하기 전에는 UI prototype 구현을 시작하지 않는다.

기능 연결의 별도 시작 조건:

- CK-01~05 prototype을 사용자가 직접 확인
- 화면 구성·정보 밀도·용어·interaction에 대한 수정 요청 반영
- 사용자가 G-UI를 명시적으로 승인
- 승인 시점의 screenshot과 prototype commit/hash 기록
- 인증된 runtime에서 기존/new route 진입 가능 확인
- `selectedManagerId`와 recent cache preflight 결과 기록
