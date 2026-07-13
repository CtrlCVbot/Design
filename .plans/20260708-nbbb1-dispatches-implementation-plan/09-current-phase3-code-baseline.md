# 09. 현재 Phase 3 코드 기준선

- 작성일: 2026-07-10
- 상태: 구현 전 기준선
- 작업 모드: `docs-only + design-fidelity`
- 실제 코드 기준(읽기 전용): `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console`
- 신규 구현 target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- 확인한 HEAD: `744327f5` (`sync/main-pre-20260709`)
- 기존 패키지 기준 HEAD: `1a5e43cd`

## 1. 이 문서의 역할

이 문서는 기존 route를 수정하기 위한 목록이 아니라, 신규 route가 재사용해야 할 **production capability 기준선**이다. `app/test/broker-order-console/**`는 회귀 기준으로 동결하고, 화면 변환·adapter·view state·신규 test는 `app/test/broker-order-console-new/**`에만 추가한다.

`C:\Work\Dev\Design\.references\code\nb-main`은 화면·상호작용 원본이며, 이 문서의 인증·tenant·API·validation·상태 guard보다 우선하지 않는다. 구체적인 변환 규칙은 `14-nb-main-code-conversion-plan.md`를 따른다.

기존 `01-implemented-feature-inventory.md`와 `03-coverage-mapping.md`는 Phase 3의 광범위한 기획·구현 이력을 잘 정리했지만, 패키지 작성 이후 실제 코드가 계속 바뀌었다. 이 문서는 **현재 코드와 현재 테스트로 다시 확인한 구현 사실**만 요약한다.

충돌 시 우선순위는 다음과 같다.

1. 이 문서가 인용하는 현재 코드와 테스트
2. `10-nbbb1-phase3-screen-state-mapping.md`
3. 기존 `01`·`03`의 역사적 인벤토리와 매핑

기존 문서는 삭제하거나 재작성하지 않는다. 과거 결정과 근거를 추적하는 자료로 유지한다.

## 2. 기준점 변화

`1a5e43cd..744327f5` 사이에 `broker-order-console` 아래 38개 파일이 변경됐고, diff 통계는 약 `+2,879/-427`이다. 구현 계획에 직접 영향을 주는 변화는 다음과 같다.

| 현재 추가·강화된 자산 | 현재 근거 | 기존 계획에 미치는 영향 |
|---|---|---|
| `drawer / inline(상단)` workspace 열림 방식 선택 | `broker-order-list-main.tsx:61`, `:259`, `:302` | 콕핏 전환을 위해 top drawer를 처음부터 폐기할 필요가 없다. `inline` 조합을 기반으로 좌우 배치를 재구성할 수 있다. |
| `new / copy / edit` 패널 상태와 detail loading/error | `test-order-console-store.ts:3-4`, `:26-34` | 새 화면에서도 신규 등록뿐 아니라 복사·수정·오류 복구 자산을 유지할 수 있다. |
| 배차 상태 변경 실제 연결 | `broker-order-workspace-shell.tsx:1099`, `broker-order-workspace-header.tsx:224` | 기존 문서의 “Phase 3 상태 mutation 미연결” 판정은 현재 코드 전체에는 더 이상 그대로 적용할 수 없다. 상태 전이 의미 결정은 남지만 연결 자산은 재사용 가능하다. |
| 운행 마감과 정산 생성 | `broker-order-workspace-shell.tsx:818`, `:830-831` | Phase 3에만 있는 운영 기능으로 보존 대상이다. nbbb1 화면의 임의 상태 버튼으로 대체하면 안 된다. |
| submit 실패·부분 후처리 재시도 | `broker-order-workspace-shell.tsx:926`, `:1004`, `:1030-1032` | 등록 성공만 가정한 목업보다 강한 production 자산이다. 새 화면에서도 그대로 유지해야 한다. |
| applied 상태와 필수·선택 표현 | `applied-field-presentation.tsx`, 각 section 테스트 | 콕핏 화면으로 옮길 때도 확정값·미입력·오류의 의미를 잃지 않도록 재사용한다. |
| 보조 패널 단순화 | `broker-order-support-panel-shell.tsx:22`, `:211-248` | 현재는 `메모`, `금액 로그` 2탭이다. 지도는 헤더 거리 칩과 read model로 유지하되 보조 탭에는 노출하지 않는다. |

## 3. 현재 컴포지션

```text
BrokerOrderConsolePage
└─ BrokerOrderListMain
   ├─ inline workspace 또는 drawer workspace
   │  └─ BrokerOrderWorkspaceShell
   │     ├─ BrokerOrderWorkspaceHeader
   │     ├─ BrokerOrderWorkspaceBody
   │     │  ├─ BrokerOrderShipperSection
   │     │  ├─ BrokerOrderRouteSection
   │     │  ├─ BrokerOrderCargoTransportSection
   │     │  ├─ BrokerOrderSettlementSection
   │     │  ├─ BrokerOrderDriverSection
   │     │  └─ BrokerOrderSupportPanelShell(edit + selected order)
   │     └─ BrokerOrderActionBar
   ├─ BrokerOrderTabs / Search / QuickFilterCard
   ├─ BrokerOrderConsoleTable 또는 BrokerOrderConsoleCards
   ├─ pagination / auto refresh / Excel / bulk accept
   └─ legacy detail sheet + dialogs + floating summary
```

## 4. 현재 재사용 가능한 기능 자산

### 4.1 화면 셸·목록

| 기능 | 현재 상태 | 코드 근거 | 테스트 근거 | nbbb1 적용 |
|---|---|---|---|---|
| drawer/inline workspace | 완료 | `broker-order-list-main.tsx` | `broker-order-list-main-actions.test.tsx` | `ADAPT`: inline을 좌측 고정 column으로 조합 |
| list loading/error/empty | 완료 | `broker-order-list-main.tsx:371-381`, `EmptyOrderList` | list component tests | `REUSE` |
| table/card 전환 | 완료 | `broker-order-list-main.tsx:244-246` | list tests | `REUSE`, 주 화면은 table 권장 |
| pagination | 완료 | `broker-order-console-local-list.tsx` | component coverage | `REUSE`; 목업의 50건 전체 렌더는 복제하지 않음 |
| 검색·필터·탭 | 완료 | 기존 `BrokerOrderTabs`, `BrokerOrderSearch`, `QuickFilterCard` | list actions tests | `ADAPT`; nbbb1 칩 IA로 재배치 |
| auto refresh/manual refresh | 완료 | `broker-order-list-main.tsx` | 간접 component coverage | `REUSE` |
| row copy/edit/detail actions | 완료 | `list-action-adapter.ts` | `list-action-adapter.test.ts` 8건 | `REUSE` |
| dirty 전환 guard | 완료 | list main + store | adapter/shell tests | `REUSE` |
| 비동기 detail stale-response guard | 완료 | `list-action-adapter.ts` | 동일 테스트 | `REUSE` |

### 4.2 등록·수정 workspace

| 영역 | 현재 구현 | 핵심 근거 | nbbb1 적용 |
|---|---|---|---|
| 화주 | 최근 화주, 검색, 담당자 후보, 담당자 빠른 등록, 연락처·이메일 inline edit | `shipper-candidates-adapter.ts`, `broker-order-shipper-*` | `ADAPT`: dialog 후보 일부를 inline chip으로 표면화 |
| 운송 구간 | 상·하차 독립 draft, saved/recent/Kakao REST 후보, 주소록 저장, 상세주소·담당자·일시·방법, 거리 계산 | `route-address-candidates-adapter.ts`, `broker-order-address-lookup-dialog.tsx`, `broker-order-route-section.tsx` | `REUSE/ADAPT`; iframe 대신 현재 REST dialog 유지 권장 |
| 화물 | 톤수·차종·품목·비고, 최근 조합, inline edit | `broker-order-cargo-transport-section.tsx` | `REUSE/ADAPT` |
| 정산 | `인수증 / 선착불` 2옵션, 선불·착불 내부 금액, reset confirm, deferred side effect | `broker-order-settlement-section.tsx`, `settlement-draft-boundary.ts` | `REUSE`; 4옵션 확장은 승인 전 금지 |
| 차주 | 내부 DB·화물맨 후보, 차주 등록, master 수정 선택, 현재 draft 적용, assign 후처리 | `broker-order-driver-*`, driver adapters | `REUSE/ADAPT`; 추천 알고리즘과 위치 정보는 별도 |
| 보조 정보 | 운영자 메모 CRUD, 금액 요약·로그, loading/error/retry | support components/adapters | `REUSE`; nbbb1의 대화방과 동일 기능으로 오해하지 않음 |

### 4.3 draft·submit·운영 안전장치

현재 draft는 다음 slice를 독립적으로 가진다.

- `shipperDraft`
- `routeDraft.load / routeDraft.unload`
- `cargoDraft`
- `settlementDraft`
- `driverDraft`
- `supportDraft`

근거: `phase3-order-draft-store.ts:59-65`, patch action `:76-80`.

현재 submit 검증은 다음을 차단하거나 안내한다.

| 검증 | 현재 동작 | 근거 |
|---|---|---|
| 화주 필수 | blocking | `phase3-submit-validation-adapter.ts:174` |
| 상·하차 주소·일시 | blocking | 동일 adapter의 route validation |
| 상차일시 ≤ 하차일시 | blocking | `:190` |
| 톤수·차종 | blocking | `:202` |
| 화물 품목 | blocking | `:214` |
| 정산 방식·내부 mapping | blocking | `:226` 이후 |
| 차주 미배정 | non-blocking info | `:283` |
| 운영 메모 submit 제외 | non-blocking info | `:295` |

`actualWeightTon`, `vehicleCount`, `recentSelectionId` 등은 draft에 존재하지만 submit에서 제외된다. 근거: `phase3-submit-payload-adapter.ts:44`, `:287`, `:366`. 새 화면에 필드를 보이게 하는 것과 실제 저장을 연결하는 것은 별개의 승인 항목이다.

### 4.4 client/server create validation 불일치

현재 create route는 `selectedManagerId`를 필수 UUID로 검증한다.

- server: `app/api/orders/validation.ts:51`
- client payload: `phase3-submit-payload-adapter.ts:357` — `contactUserId`가 없으면 `undefined`
- client validation: `phase3-submit-validation-adapter.ts` — 현재 `shipper.companyId`만 blocking, manager 필수 검증 없음

따라서 회사만 있고 담당자가 없는 candidate는 client validation을 통과한 뒤 create API에서 실패할 수 있다. backend를 바꾸지 않는 원칙에 따라 첫 구현 preflight에서 **client가 담당자 선택을 blocking validation으로 요구하도록 정렬**하는 안을 우선한다. 이 문제는 새 콕핏 배치와 무관한 기존 계약 불일치이므로 UI 재배치 전에 회귀 테스트로 고정해야 한다.

또한 submit 성공 시 현재 확인된 invalidate 대상은 `brokerOrders`와 order detail이다(`broker-order-workspace-shell.tsx:830-831`, `:1135-1136`). `recent-cargos`와 `recent-addresses`의 신선도는 별도 확인이 필요하다. 새 화면의 입력 추천 체인이 최근 후보를 전면에 노출하므로, 구현 preflight에서 기존 invalidate 유틸리티를 연결할지 검증한다. 신규 API는 필요하지 않다.

## 5. Phase 3에만 있는 기능

nbbb1에는 없지만 production 안전성과 운영 연속성을 위해 유지해야 하는 기능이다.

| 기능 | 기본 판정 | 새 화면에서의 위치 원칙 |
|---|---|---|
| 복사·수정·detail hydration | `adopt-now` | 목록 row action 또는 secondary action으로 유지 |
| loading/error/retry·stale response 차단 | `adopt-now` | 화면 상태로 반드시 유지 |
| dirty close/switch guard | `adopt-now` | 좌·우 패널 전환에도 적용 |
| pagination | `adopt-now` | 목업의 전체 렌더보다 production 기준 우선 |
| submit 중복 방지·부분 후처리 재시도 | `adopt-now` | action bar의 핵심 계약으로 유지 |
| 운행 마감·정산 생성 | `adopt-now` | 기존 domain guard를 유지하고 임의 상태 버튼과 분리 |
| 화물맨 register/reopen/cancel guard | `adopt-later` | 차주 패널의 고급/연동 영역으로 유지 |
| 운영자 메모·금액 로그 | `adopt-later` | 상세 workspace 보조 탭으로 유지 |
| table/card 전환 | `optional` | table을 기본으로 두고 보조 선택으로 유지 |
| Excel·bulk accept·floating summary | `optional` | 주 화면 fidelity를 해치지 않는 secondary toolbar |

## 6. 현재 없는 기능

다음은 현재 코드에서 같은 의미로 확인되지 않았다.

- 좌 3모드 × 우 2모드의 완성된 콕핏 state machine
- 우측 운행내역 패널의 접힘/세로 복원 탭
- 상·하차 pair 사용 빈도·최근/최빈 운임 집계
- 경유지 N점 draft·payload·거리 계산
- 정산 예정일 저장 필드
- 화물실중량 저장 연결
- 7개 상태×7개 날짜 교차 카운트
- AI 배차 난이도·어드바이저·추천 차주 알고리즘
- 차주 실시간 위치·가용 상태·연계지 거리
- 실시간 대화방과 첨부/템플릿 도메인

해당 기능은 UI 목업 데이터로 가장해 구현하지 않는다.

## 7. 검증 기록

실행일: 2026-07-10

```powershell
.\node_modules\.bin\vitest.cmd run --config vitest.config.unit.ts app/test/broker-order-console
.\node_modules\.bin\tsc.cmd --noEmit --pretty false
```

결과:

- Vitest: `46 files passed`, `434 tests passed`
- TypeScript: `PASS`
- 코드 수정: 없음
- live browser/API smoke: 미실행. 따라서 인증·tenant·DB가 연결된 목록/등록 API 정상 응답까지 증명한 결과는 아니다.

관찰된 비차단 경고:

1. `components/order/order-table-ver01.tsx`의 중복 `case "운송완료"` Vite 경고.
2. support panel 테스트에서 상대 URL memo fetch가 stderr를 남김.
3. 일부 component 테스트의 React `act(...)` 경고.
4. submit pending 테스트에서 최근 화물 조회 네트워크 실패 로그가 발생하지만 테스트는 통과.

이 경고는 이번 문서 작업에서 수정하지 않는다. 구현 시작 전 test-harness 정리 후보로만 기록한다.

## 8. 기준선 결론

첫 구현은 backend/service를 바꾸지 않고도 다음까지 가능하다.

1. 현재 inline workspace와 목록을 좌우 콕핏으로 재조합한다.
2. 현재 화주·주소·화물·정산·차주 입력 기능을 새 화면 위치에 배치한다.
3. 현재 목록 검색·필터·상태·pagination과 등록·수정·재시도를 유지한다.
4. 기존 dialog 후보를 inline chip 또는 우측 추천 패널로 점진적으로 표면화한다.

pair 집계, 경유지, AI, 위치, 대화방, 신규 DB 필드는 이 기준선에 포함되지 않는다.

기준선 동결 규칙:

- 기존 route 내부 수정 0건
- 기존 focused suite `46 files / 434 tests` 유지
- 신규 route가 기존 기능을 직접 복사하지 않고 공용 service/hook 또는 단일 capability bridge로 재사용
- 공용 backend/service 변경이 필요하면 신규 화면 작업과 분리해 제안·승인 후 진행
