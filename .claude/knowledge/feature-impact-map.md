# 기능 영향 관계 맵

> 마지막 업데이트: 2026-05-27 (차주 상호명==차량번호 제한 **의도적 제거** + 용어 업체명→상호명 — Driver 섹션 참조). 이전: 2026-05-15 대사·완료 통화 셀 표기 정책 (`500,000원` 표기 + tabular-nums + 정산추가금 0/양/음 부호·색 3상태).
>
> **목적**: 기능/파일 변경 시 어떤 페이지를 회귀 테스트해야 하는지 매핑

## 사용 방법

1. QA 시작 시 변경된 파일 확인
2. 해당 파일이 속한 기능 영역 찾기
3. "회귀 테스트 필요 페이지" 확인 후 QA 수행

---

## 화물등록/수정 (Order Registration)

### 관련 파일 패턴

```
app/broker/order/register/**
app/broker/order/edit/**
app/api/orders/**
server/order/**
components/broker/order/register/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 | /broker/order/list | 새 화물 목록 노출, 상태 표시 |
| 1차정산 | /broker/income/first-settlement | 정산 대상 목록 반영 |
| 매출대기 | /broker/sale (대기 탭) | 매출 대기 목록 반영 |

### 등록 흐름 정합성 체크포인트 (2026-05-15 추가)

1. **상하차 picker type 분기**: `/api/addresses?type=load` 와 `type=drop` 응답이 분리되어야 함. 같은 주소록 row 가 `상차전용` / `하차전용` / `상하차 통합` 메타로 구분돼 picker 슬롯과 매칭 (700dbfe2). → 회귀 가드: `EDGE-2026-05-15-REGISTER-PASS-01`.
2. **등록 → 운임 생성 순서**: `register-summary-ver03.tsx:handleConfirm` 에서 `registerOrder()` 직후 `resetForm/resetSettlementDraft` 호출. 운임 생성 실패 시 settlementDraft 가 이미 휘발 — 부분 실패 복구 경로 부재. → `EDGE-2026-05-15-REGISTER-01` 참조.
3. **좌표 fallback 정책**: `services/orders/registration.ts:134-135` 의 `lat: ... || 0` fallback 이 (0,0) 좌표 저장 + 다음 등록 picker 재사용 시 거리 계산 silent skip. → `EDGE-2026-05-15-REGISTER-03`.
4. **일시 boundary**: react-day-picker 가 `disabled` 미적용 → 하차일이 상차일보다 이른 일자 선택 가능. BE zod refine 도 미존재 추정. → `EDGE-2026-05-15-REGISTER-02`.

### 과거 회귀 이슈

- 2026-05-15 sweep 결과: `EDGE-2026-05-15-REGISTER-01~12` (qa-edge-cases.md 참조). Critical 1건 (운임 inconsistency), High 3건 (일시 boundary / 좌표 fallback / 주소록 silent empty).

---

## 화물현황 (Order List)

### 관련 파일 패턴

```
app/broker/order/list/**
components/broker/order/broker-order-table*.tsx
components/broker/order/broker-order-detail-sheet*.tsx
components/broker/order/quick-filter-card.tsx
hooks/useBrokerOrders.ts
hooks/broker-order/useBrokerExcelExport.ts
server/order/infrastructure/mappers/broker-order-filter.mapper.ts
server/order/infrastructure/mappers/broker-tab-filter-defaults.ts
server/order/infrastructure/order-with-dispatch.query-builder.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 자체 | /broker/order/list | 목록, 필터, 탭, 상세 시트, **진행중/완료 탭 default 기간이 이번주 월~일** |
| 화물등록 | /broker/order/register | 목록에서 등록 버튼 연결 |
| 오더 상세 메시지 발송 | /broker/order/list (행 클릭 → 상세 시트 → 메시지 보내기) | LMS Compose 의 contacts 4 role(driver/shipper/loading/unloading) 표시 |

### Quick filter 'thisWeek' 정의 변경 시 (EDGE-020 관련)

`components/broker/order/quick-filter-card.tsx` 의 `handleQuickPeriod('thisWeek')` 와
`server/order/infrastructure/mappers/broker-tab-filter-defaults.ts` 의 `getThisWeekRange()` 는 **반드시 같은 정의(월~일)** 를 유지. 한쪽만 sliding 7일이나 다른 캘린더 기준으로 바뀌면 화면 표시와 백엔드 default 동작이 어긋나는 회귀.

### 새 broker-only API 라우트 추가 시 (EDGE-021 관련)

신규 `/api/orders/[orderId]/...` 또는 `server/...` 격리 자원 접근 라우트는:
1. `withTenant` 로 감싸기 (`withErrorHandler(withTenant(handler, { allowedTypes: ['broker'] }))`).
2. handler 내부에서 `TenantContext.requireBrokerCompanyId()` 사용.
3. 클라이언트 호출처가 silent catch 로 빈 fallback 하는지 점검 — 500 응답 시 사용자에게 "수신자 0명" 같은 가짜 정상 상태로 보이지 않게 명시적 에러 처리.

### 화물현황 엑셀 다운로드 컬럼 추가 시 (#4 관련)

`hooks/broker-order/useBrokerExcelExport.ts` 의 row 변환에서 새 금액 필드를 0 하드코딩 placeholder 로 두지 말고, 실제 데이터 소스(`order.charge.groups` 의 reason/side 합산 등)에서 계산. 공통 합산 패턴은 `utils/charge/payment-amounts.ts` 에 추출.

### 과거 회귀 이슈

- 2026-05-06 진행중/완료 탭 default 기간 (`cb18fbe1`): tabFilters fallback 이 sliding 7일이라 quick filter "thisWeek" (월~일) 와 정의 어긋남. `getThisWeekRange()` 로 통일.
- 2026-05-06 화물현황 엑셀 prepaidFreight/codFreight (`e7dec994`): `useBrokerExcelExport` 에서 0 하드코딩. `extractPaymentAmounts(order.charge)` 헬퍼 추출.
- 2026-05-06 오더 상세 메시지 발송 contacts 빈 목록 (`bc445b3e`): `/api/orders/[orderId]/contacts` 에 `withTenant` 누락 → 500 → 클라이언트 silent catch.

---

## 정산 (Settlement)

### 관련 파일 패턴

```
server/order-settlement/**
server/settlement/**
server/charge/**
app/api/charge/**
app/api/orders/[orderId]/settlement/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 상세 | /broker/order/list | 정산 상태 반영, 버튼 상태 |
| 1차정산 | /broker/income/first-settlement | 정산 금액 계산, 상태 변경 |
| 매출현황 | /broker/sale | 매출 금액 반영 |
| 매입현황 | /broker/purchase | 매입 금액 반영 |
| 지출현황 | /broker/expenditure | 지출 내역 반영 |

### 정산 번들 목록 컬럼 변경 시 추가 점검 (EDGE-018 관련)

매출/매입 정산 대사·완료 탭의 테이블 컬럼을 추가/변경할 때는 다음 4개 레이어를 함께 수정해야 함:

1. **UI 컬럼 정의**: `components/broker/sale/settlement-bundle-matching-list.tsx`, `components/broker/purchase/settlement-bundle-matching-list.tsx` (헤더 + 본문 셀 + empty colSpan)
2. **백엔드 매퍼**: `server/charge/infrastructure/mappers/bundle-common.mapper.ts` (placeholder 값 금지 — 실제 데이터 매핑)
3. **리포지토리 SELECT**: `server/charge/sales-bundle/infrastructure/sales-bundle-list.repository.ts`, `server/charge/purchase-bundle/infrastructure/purchase-bundle-list.repository.ts` (필요 시 서브쿼리/JOIN 추가)
4. **타입**: `types/settlement/broker-charge.ts` (`ISalesBundleListItem`), `types/settlement/broker-charge-purchase.ts` (`IPurchaseBundleListItem`), 매퍼 내 Pick 타입

#### 대사·완료 통화 셀 표기 정책 (2026-05-15 회귀 가드)

매출/매입 정산 대사·완료 탭의 통화 셀은 다음 3개 정책을 묶음으로 적용:

1. **표기 단위**: `500,000원` (콤마 + `원`). `₩` 접두사 금지. `Intl.NumberFormat('ko-KR', { style: 'currency' })` 의 출력 (`₩500,000`) 과 셀 코드의 `+ '원'` 합성이 만든 `₩500,000원` 중복 패턴이 회귀 원인. 두 파일 안에 inline 헬퍼 정의:

   ```ts
   const formatKRW = (amount: number) => `${Math.round(amount).toLocaleString("ko-KR")}원`;
   ```

2. **숫자 정렬**: 우측 정렬 통화 셀에 `tabular-nums` 클래스 필수 (Inter 비례폭 → 자릿수 깨짐 방지). 적용 위치: `text-right` 와 동일 className 계열에 추가.

3. **정산 추가금 부호/색 3상태**: `value === 0 ? muted` / `value > 0 ? "+" + blue` / `value < 0 ? "-" + red`. 0 에 `+` 부호 금지 (양수 부호 의미 어긋남). 0 에 파랑 금지 (양의 변동 의미). 동일 ternary 안에서 분기.

신규 통화 셀 추가 시 위 3개 정책 묶음 적용. 다른 19개 파일 (대기 탭, single-settlement-dialog, settlement-additional-cost 등) 은 아직 `formatCurrency() + "원"` 중복 패턴 잔존 — 디자인 일관성을 위해 향후 라운드에서 동일 정책으로 마이그레이션 또는 `formatCurrency` 자체를 `Intl.NumberFormat` style 옵션 제거로 변경하는 게 정공법. 신규 작성 시 두 파일 패턴 따라가는 게 안전.

#### 컬럼 width 는 `table-fixed w-full` 환경에서 비율 anchor (2026-05-15 회귀 가드)

`settlement-bundle-matching-list.tsx` 두 파일은 `<Table className="table-fixed w-full">` 컨텍스트라 `TableHead` 의 `w-[Npx]` 값이 **절대 px 가 아닌 컬럼 간 비율**로 작동한다 (총합 < 컨테이너 일 때 비율로 확장). 따라서 의미 없는 작은 값 분포 (예: 체크박스 40px 이 최대값이고 나머지 10-30px) 는 체크박스가 ~14% 폭을 차지하는 비정상 비율을 만든다.

신규 컬럼 추가 또는 width 조정 시:

- 모든 헤더가 의미 있는 px 값 (≥ 70px) 을 갖도록 분포. 체크박스 같은 단일 토큰 컬럼만 44px 수준의 좁은 값 허용.
- 컨텐츠 우선순위에 맞춰 분포 — 회사명/연락처/총 금액 등 긴 텍스트 컬럼이 가장 넓고, 배지/상태 컬럼이 가장 좁게.
- 1920×1080 viewport 기준 합계가 ~1500px 안에 수렴하는지 확인 (그 외에는 `Table` 의 wrapper `overflow-x-auto` 가 보호).

회귀 가드 단위 테스트는 불필요 — width 클래스 자체는 시각 검증으로만 의미. `/qa` 진행 시 헤더 폭 측정 (Playwright `getBoundingClientRect`) 으로 비율 정상성 확인 가능.

### 정산 시트에서 액션 후 대사 리스트 갱신 (EDGE-019 관련)

정산 편집 시트(`settlement-edit-form-sheet.tsx`) 에서 번들 상태를 변경하는 액션을 추가할 때는 모달/시트 내부 갱신과 **번들 리스트 자체의 재조회**를 둘 다 트리거해야 함.

- **매출**: `useBrokerChargeStore().fetchSalesBundles()` 호출
- **매입**: `useQueryClient().invalidateQueries({ queryKey: settlementKeys.purchaseBundles() })` 호출 (React Query 기반)
- 적용 대상: 외부/수기 등록(`registerExternalOrManual`), 전자발행/수정발행(`TaxInvoiceIssueModal` onSuccess), 그 외 번들 status·invoice 상태를 바꾸는 모든 액션
- 폼 자체 수정(`updateSalesBundleData` 등)은 store action 내부에서 이미 재조회 → 별도 호출 불필요

### 정산 요약 패널 (EDGE-5022~5026 관련 / PRD prd-2026-03-27-settlement-summary-panel)

매출·매입 정산 화면 대기/대사/완료 6 탭 하단에 `<SettlementSummaryPanel type tab filter />` 가 노출된다. `settlementKeys.summaries()` 하위 4 useQuery 캐시 — list 와 무효화 분리.

신규 mutation (정산 상태 변경, 정산 삭제, 그룹 편집, 세금계산서 발행/취소) 추가 시:

- **매입**: mutation hook (`use-purchase-bundles-queries.ts`) onSuccess 에 `queryClient.invalidateQueries({ queryKey: settlementKeys.summaries() })` 한 줄 추가 — 4개 summary 가 prefix 매칭으로 모두 stale.
- **매출**: 매출 store 는 직접 fetcher 호출 패턴이라 mutation hook 미사용. **page 콜백 또는 `settlement-edit-form-sheet.tsx` 의 mutation 직후** `useQueryClient` 로 명시적 invalidate. store action 안에서 queryClient 접근은 layer 정책 위반 (Store API 호출 금지).
- **세금계산서 발행/취소**: `TaxInvoiceIssueModal` onSuccess 4 경로 (전자발행/외부발행/수정발행/취소) 에서도 동일하게 `invalidateQueries({queryKey: settlementKeys.summaries()})` 호출 필수. 현재 누락 — EDGE-5024.

#### 표시 단 + API 단 라운드 정책 (EDGE-5022 + EDGE-5025)

패널 금액 표기 시 `numeric(14,2)` 컬럼이 소수점 노출하지 않도록 가드 2단계:

1. **표시 단** (EDGE-5022 fixed): `Amount` 컴포넌트에서 `Math.round`.
2. **API 단** (EDGE-5025 open): repository `summarize()` SQL 에 `ROUND(SUM(...))::bigint` 적용 또는 service 응답 변환 헬퍼 통일. 엑셀/메일/외부 ERP 연동 등 API 응답을 직접 사용하는 흐름까지 보호.

`formatCurrency` 자체는 소수점을 통과시키므로 패널/엑셀/메일 등 사용처에서 별도 round 또는 헬퍼 통일 필요.

#### Summary SQL ↔ List `withLiveAdjustmentTotals` 비대칭 (EDGE-5023 핵심 결함)

매출·매입 번들 list 의 `findMany()` 는 `withLiveAdjustmentTotals()` 로 4 컬럼 (`itemExtraAmount`, `itemExtraAmountTax`, `bundleExtraAmount`, `bundleExtraAmountTax`) 을 추가 SELECT/병합한다. 그러나 동일 repository 의 `summarize()` 는 `bundle.totalAmount + totalTaxAmount` 만 SUM — adjustment 4 컬럼 완전 누락.

→ bundle 에 adjustment 가 한 건이라도 있으면 패널 합계 ≠ list 행 합. 매출 대사 100건 기준 약 3억원 차이 확증.

**신규 summary 또는 list 변경 시 반드시 함께 점검**:

- summary SQL SUM 식 = list mapper 의 amount 계산식
- adjustment 컬럼 추가/변경 시 양쪽 동시 수정
- integration test: bundle 에 adjustment 추가 후 `summary.totalAmount === Σ(list[i].totalAmount + adjustments)` 검증

#### 대기 ↔ 번들 prepaid 판정 기준 차이 (EDGE-5026)

| 탭 | 판정 컬럼 |
|---|---|
| 매출 대기 | `orders.settlementType = 'PREPAID'` |
| 매출 번들 | `salesBundles.billingBase='carrier' AND billingEntityType='driver'` |

정산 생성 mapper (`mapSettlementFormToSalesBundleInput`) 가 PREPAID → carrier/driver 자동 매핑하지 않으면 동일 화물이 대기/대사 패널에서 다른 카운트로 표시. POL-01 통합 정의 위반.

→ 정산 생성 mapper 변경 시 prepaid 흐름 보존 필수. integration test: PREPAID waiting item → 정산 생성 → 생성된 bundle 의 `billingBase='carrier' && billingEntityType='driver'`.

#### Panel 의 status 강제 매핑 (EDGE-5027 핵심 가드)

매출 store 는 `salesBundlesFilter.status` 를 URL tab sync 가 아닌 **`handleTabChange` (click 이벤트)** 에서만 셋팅. 따라서 `/broker/sale?tab=COMPLETED` 같은 URL 직접 진입 / 북마크 / 외부 링크 경로에서는 store filter 의 status 가 `undefined` 인 채로 진입한다. summary API 는 status 없으면 전 status 집계 → 완료 탭에 draft + issued + paid 합계 노출 (실 데이터로 약 12배 차이 확증).

**가드 정책**: `SettlementSummaryPanel` 의 sub-panel 이 외부 `filter.status` 보다 `BUNDLE_STATUS_BY_TAB[tab]` 매핑을 **우선 적용**한다 (`...filter, status: BUNDLE_STATUS_BY_TAB[tab]`). 매입은 store 가 이미 `setTabMode` 에서 자동 셋팅하지만, 동일 안전망 적용 (코드 응집 + store 정책 변경 대비).

매핑 정의는 매출/매입 store 의 `getBundleStatusForTab` 와 동일 의미 (MATCHING → 'draft', COMPLETED → 'paid'). 신규 status enum 추가 시 panel 매핑도 같이 업데이트.

#### Radix TabsContent mount 유지 + sub-panel useState 초기화 (EDGE-5028)

Radix Tabs 의 `<TabsContent>` 는 비활성 상태에서 unmount 되지 않고 `hidden=""` 으로 DOM 보존된다. 따라서 sub-panel 의 `useState(false)` 도 살아있어 PRD DesignSpec 2.2 "탭 재진입 시 접힌 상태 초기화" 정책이 자연스럽게 깨진다.

**가드 패턴**: `useExpandedWithTabReset` hook — 컴포넌트 outer div ref 의 `closest('[role="tabpanel"]')` 에 `MutationObserver` 부착, `data-state='inactive'` 가 되는 순간 `setExpanded(false)`. tabpanel ancestor 없으면 no-op 이라 sticky portal / standalone 위치에서도 안전.

신규 sub-panel 추가 시 같은 hook 사용 — `useState` 직접 사용 금지 (탭 재진입 시 상태 보존 회귀 위험).

#### MutationCache global onSuccess + meta.invalidates 추상화 (EDGE-5030/5031 핵심 정책)

EDGE-5023~5031 까지 같은 종류 결함 (mutation onSuccess 안 invalidate 누락) 이 7+ 곳에 분산 → 횡단관심사 추상화 도입 (commit `e830b5ee`).

**규약**:
- 정산 도메인 mutation 은 **반드시 `meta: { invalidates: [...] }`** 로 무효화 셋 선언. `useMutation` 의 `onSuccess` 안에 `invalidateQueries` 수동 호출 금지.
- 글로벌 핸들러: `app/providers.tsx` 의 `MutationCache.onSuccess` 가 `mutation.options.meta?.invalidates` 를 prefix 매칭으로 일괄 무효화.
- 타입 좁힘: `types/react-query.d.ts` 의 `declare module '@tanstack/react-query' { interface Register { mutationMeta: { invalidates?: readonly QueryKey[] } } }` augmentation.

**적용 제약**:
- `useMutation` 라이프사이클에만 닿음. `useCallback` 안 비동기 함수 (예: Popbill `syncStatus`, EDGE-5033) 는 meta 패턴 미적용 → `useQueryClient()` 직접 호출 + 명시적 invalidate. Spring AOP 의 같은 클래스 내부 호출 한계와 동일.
- store action 흐름 (매출 측 `createSalesBundleFromWaitingItems` 등) 도 mutation 이 아니라 raw service 호출 → 호출처 (page.tsx / sheet.tsx) 콜백에서 `invalidateSummaries()` 수동 호출.

신규 mutation hook 추가 시:
1. 정산 도메인이면 `meta.invalidates` 한 줄 선언
2. mutation 외 흐름이면 호출처에서 명시적 invalidate (mutation hook 이 아니라는 점을 commit 메시지에 명시)

#### useQuery 의 retry / placeholderData 정책 (EDGE-5034/5035)

정산 summary 4 useQuery 의 공통 option:
- `retry: 1` — client default 3 회 + exponential backoff 가 빠른 필터 변경 시 죽은 query 폴링 비용. PRD EX-02 "자동 재시도 후 실패" 충족하면서 최소화.
- `placeholderData: keepPreviousData` — 필터 변경 시 이전 합계 잠깐 유지. PRD EX-03 "Loading→완료 자연 전환" 정신.

신규 summary 성격 useQuery 추가 시 같은 option 두 줄 적용.

**주의**: hook 의 retry 옵션이 client default 보다 우선. 단위 테스트에서 `wrapWithClient({retry: false})` 는 무시됨 → `waitFor` timeout 5초 보강 필요 (`settlement-summary-panel.test.tsx` 패턴).

#### summary SQL N+1 → derived table + LEFT JOIN (EDGE-5036)

bundle row 마다 scalar subquery 6회 평가 (item/bundle adjustment amount/tax + itemCount) → 매입 1842 bundle 에서 EXPLAIN 853ms. JPA N+1 과 동종 — PostgreSQL optimizer 가 `CASE WHEN + COALESCE + GROUP BY 외부` 조합을 semi-join 변환 못함.

**가드 패턴**: adjustment 4 컬럼 + itemCount 를 3개 derived table 로 사전 GROUP BY → LEFT JOIN 으로 결합. bundle row 수 무관 일정 비용.

신규 summary 지표 추가 시:
- bundle row 별 scalar subquery 패턴 금지 (`SELECT ... FROM ... WHERE bundle_id = b.id` 를 SELECT 절에 두지 말 것)
- derived table 추가 후 LEFT JOIN, alias 컬럼명에 **prefix 필수** (충돌 회피 — `item_amount`, `bundle_amount` 등; 단순 `amount` 는 `column reference "amount" is ambiguous` 발생)

EXPLAIN 측정: `scripts/qa-fb-*.mjs` 패턴으로 EXPLAIN ANALYZE 실행 + `loops=N` 으로 N+1 진단.

### Broadcast 화물 write 가드 (EDGE-5060 핵심 정책)

화주가 broker 미지정 등록 → 주선사 dispatch accept 한 broadcast 화물은 `orders.broker_company_id = NULL` 로 잔존하고 `order_dispatches.broker_company_id` 에만 self 가 stamp 된다. `ordersTenantWhere()` (= self stamp ∪ broadcast + active profile) 가 read path 의 표준 가드.

신규 `server/charge/**` 또는 charge 도메인 write 흐름 추가 시 ownership 가드 패턴 통일:

- **금지**: `eq(orders.brokerCompanyId, this.brokerId)` strict eq (broadcast 화물 매칭 실패 → 일반 Error → 500)
- **권장**: `and(eq(orders.id, targetId), this.ordersTenantWhere())` (broadcast 통과 + cross-broker 차단)
- **에러 매핑**: 검증 실패 시 `throw new Error(...)` 금지 — 도메인 에러 (`OrderNotFoundError(httpStatus=404)` 등) 사용해야 `withErrorHandler` 가 4xx 매핑. 일반 Error 는 500 으로 떨어져 사용자에게 "서버 내부 오류" 토스트.

#### read path 의 strict eq 25곳 follow-up 점검 필요

`charge-line/order-sales/order-purchases/purchase-bundle/sales-bundle-order-list` 등 read 쪽에 strict `eq(orders.brokerCompanyId, this.brokerId)` 잔존. 일부는 broadcast 화물 list 응답을 silent 누락시킬 가능성. EDGE-5013 fix 가 `charge-query.repository.ts:87` 주석에 broadcast 정책 명시했으나 다른 query 에는 미적용. 신규 list/detail 쿼리 추가 시 broadcast 노출 의도 확정 후 정책 통일.

### 과거 회귀 이슈

- 2026-04-28 화물 건수 컬럼 미연동 (`6d34e47a`): 헤더만 추가하고 매퍼·리포지토리 누락 → 모든 row가 "0건"
- 2026-04-30 외부/수기 발행 후 대사 리스트 비갱신: `taxInvoiceData.refreshHistories()` 만 호출하고 번들 재조회 누락 → 시트 닫아도 "미발행"으로 stale 표시. 매출/매입 동시 수정.
- 2026-05-11 정산 도메인 EDGE 번호 사용 시 주의 — 같은 일자 멀티주선사 격리 sweep 가 EDGE-5037/5038/5040/5041 사용. 정산 도메인 EDGE-5036 (N+1) 까지는 충돌 없지만, 정산 "오버 invalidate" 항목은 충돌 회피 위해 EDGE-5050 으로 재번호 (knowledge 메모).
- 2026-05-12 broadcast 화물 운임 그룹 생성 500 (`4922de6a`, EDGE-5060): EDGE-5013 (read path broadcast 허용) 적용 시 `ChargeGroupRepository.save` 의 strict eq ownership 가드 잔존 + 일반 Error throw → detail ⊂ write 불변식 위반. `ordersTenantWhere()` 통일 + `OrderNotFoundError` 도메인 매핑으로 fix.

---

## 1차정산 (First Settlement)

### 관련 파일 패턴

```
app/broker/income/first-settlement/**
components/broker/income/first-settlement/**
server/order-settlement/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 | /broker/order/list | 정산 상태 동기화 |
| 매출현황 | /broker/sale | 정산 완료 건 반영 |
| 매입현황 | /broker/purchase | 매입 정산 반영 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## 매출/매입 (Sales/Purchase)

### 관련 파일 패턴

```
app/broker/sale/**
app/broker/purchase/**
server/sales-waiting/**
server/charge/**
server/settlement/export/**
app/api/charge/sales/**
app/api/charge/purchase/**
app/api/charge/settlement-export/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 매출현황 | /broker/sale | 매출 목록, 금액, **엑셀 다운로드 시 차주 정보 4 컬럼 라이브 fallback** |
| 매입현황 | /broker/purchase | 매입 목록, 금액, **그룹정산 생성 (차주 단위)** |
| 매출대기 | /broker/sale/waiting | 대기 목록 |
| 화물현황 | /broker/order/list | 매출/매입 상태 표시 |

### Settlement export mapper 의 driver fallback (EDGE-024 관련)

매출 번들은 화주 단위 정산이라 한 번들에 여러 차주가 묶일 수 있어 `salesBundles.driverSnapshot` 이 보통 비어 있다. 매출 export mapper(`toSalesExportRowFrom`) 의 driver 4필드(driverName/BusinessNumber/BusinessName/vehicleNumber) 는 항상 `safeString(snapshot.field || live.field)` 패턴 — paid 케이스의 snapshot 우선 + 빈 필드는 repository 가 join 으로 채워둔 라이브 컬럼으로 fallback. 매입 export mapper(`toPurchaseExportRowFrom`) 와는 비대칭하므로 매출/매입 양쪽 변경 시 fallback 패턴이 깨지지 않았는지 별도 확인.

### 매입정산 detail GET 격리 — alias + 단수형 양쪽 일관 적용 (EDGE-1044 / EDGE-036 관련)

매입정산 번들 detail 은 두 path 가 같은 service 를 호출한다:
- 복수형 alias: `/api/charge/purchase-bundles/{id}` (EDGE-036 fix `dc8ad...` 로 추가)
- 단수형: `/api/charge/purchase/bundle/{id}` (frontend 가 실제 호출)

**둘 다 ownership 검증을 거쳐야 한다** — 한쪽만 검증하면 cross-broker GET 시 다른 path 로 leak. 매출 sales-bundle 의 옵션 B+ii (`bundleOwnedByBroker` 헬퍼) 패턴을 매입에도 동일 적용. 회귀 가드: integration test 양 path × cross-broker ID 시나리오.

### 정산 입력 mapper 의 빈 문자열 정규화 (EDGE-025 관련)

`mapSettlementFormToPurchaseBundleInput` / `mapSettlementFormToSalesBundleInput` 같은 frontend mapper 가 `formData.X || ''` 패턴으로 빈 문자열 fallback 을 만들면 zod schema 의 `z.string().uuid().optional()` 가 빈 문자열에 대해 uuid 검증을 발동시켜 422 → 정산 생성 실패. **빈 문자열은 `|| undefined` 로 정규화** — 매입 정산은 차주 단위라 companyId 미입력이 정상 흐름이고, schema 의 `.refine(companyId || driverId)` 가 정책을 강제한다.

### 정산 번들 목록 컬럼 변경 시 추가 점검 (EDGE-018 관련)

매출/매입 정산 대사·완료 탭의 테이블 컬럼을 추가/변경할 때는 다음 4개 레이어를 함께 수정해야 함:

1. **UI 컬럼 정의**: `components/broker/sale/settlement-bundle-matching-list.tsx`, `components/broker/purchase/settlement-bundle-matching-list.tsx` (헤더 + 본문 셀 + empty colSpan)
2. **백엔드 매퍼**: `server/charge/infrastructure/mappers/bundle-common.mapper.ts` (placeholder 값 금지 — 실제 데이터 매핑)
3. **리포지토리 SELECT**: `server/charge/sales-bundle/infrastructure/sales-bundle-list.repository.ts`, `server/charge/purchase-bundle/infrastructure/purchase-bundle-list.repository.ts` (필요 시 서브쿼리/JOIN 추가)
4. **타입**: `types/settlement/broker-charge.ts` (`ISalesBundleListItem`), `types/settlement/broker-charge-purchase.ts` (`IPurchaseBundleListItem`), 매퍼 내 Pick 타입

### 매출/매입 정산 대기 리스트 행 표시 단위 (EDGE-5106 관련)

매출 정산 대기 탭(`/broker/sale`) 리스트의 청구비용 컬럼은 **세금 포함 단일 source** 정책을 따른다.

- 메인 라인(큰 글씨): `formatCurrency(order.amountWithTax)` — `orderSales.totalAmount`(공급가+VAT) 와 동일 단위
- 보조 라인(작은 글씨): `세금: N원` — `amountWithTax - amount` 분리 표시 (세금 0 케이스는 미노출)
- 패널 "총 청구 금액"(`SettlementSummaryPanel`): `SUM(orderSales.totalAmount)` 세금 포함

리스트 큰 금액 합과 패널 totalAmount 가 단위 일치해야 사용자 머릿속 합산과 어긋나지 않는다. 컬럼 추가/변경 시 단위 통일 유지 (`amount` = 공급가만 인 필드는 보조 라인 위치에만 사용).

매입 측(`/broker/purchase`) 도 동일 정책 — 신규 변경 시 양쪽 동기화 점검.

### 매출 정산 그룹화 보기 (Phase 1, 2026-06-10 추가)

관련 파일 패턴:

```
components/broker/sale/grouping/**
store/broker-charge/settlement-grouping-store.ts
hooks/settlement/use-settlement-grouping-queries.ts
utils/charges/settlement-grouping.ts
server/settlement/sales-waiting/domain/sales-settlement-grouping.ts
server/settlement/sales-waiting/application/queries/sales-grouping-query.service.ts
app/api/charge/sales/waiting/grouping/**
app/api/charge/sales-bundles/grouping/**
server/charge/sales-bundle/domain/sales-bundle-grouping.guard.ts
```

회귀 테스트 필요 페이지:

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 매출 대기 그룹화 보기 | /broker/sale (대기 탭 → 그룹화 보기) | 정산대상월=실행일 전월(KST), 대상월 기본 선택/직전월 미선택+`대기 잔류`, 선착불 제외 영역(체크박스 없음), 카드→드로어(회사 읽기 전용), CTA 전체 성공/전체 실패 |
| 매출 대기 기본 보기 | /broker/sale | 보기 전환, 필터/검색어 초기화 확인 다이얼로그, 검색 input ↔ store 동기화 |
| 대사 탭 | /broker/sale?tab=MATCHING | 일괄 생성 묶음 draft 반영 (mutation meta invalidates: salesBundles/summaries/waitingItems) |

핵심 가드:

1. **withErrorHandler 응답 계약**: 페이지네이션 shape이 아닌 단순 객체 반환 GET 은 `{ data, success }` 로 래핑된다. FE 서비스 unwrap 누락 시 화면 크래시 (EDGE-2026-06-10-GROUPING-01). 신규 GET 라우트 추가 시 `tests/unit/services/sales-settlement.test.ts` 패턴의 응답 계약 테스트 작성.
2. **드로어 공용화**: `settlement-edit-form-sheet.tsx` 는 settlementForm(기본 흐름)과 grouping store 의 drawer(그룹화) 를 병합해 isOpen/orders/formData 를 결정한다. 시트 수정 시 `isGroupingMode` 분기(회사 정보 읽기 전용 / 저장=draft 갱신 / 기간 자동설정 skip) 보존.
3. **선택 상태는 조회 결과로 초기화**: grouping useQuery 는 `refetchOnMount: 'always'` + `refetchOnWindowFocus: false`. background refetch 를 켜면 사용자 선택이 임의 시점에 리셋되는 회귀.
4. **금액 단일 소스**: 공급가액=`amount` 합, 부가세=`amountWithTax - amount` 합 (대기 목록 DTO 와 동일 단위, EDGE-5106 정책 연장). 화면 row/카드/생성 payload 모두 `sumGroupingAmounts` 한 곳에서 계산.
5. `requestedVehicleWeight` 는 '5톤' 같은 enum 문자열 — 표시 시 '톤' suffix 덧붙이기 금지 (EDGE-2026-06-10-GROUPING-03).
6. **시트 오픈은 조회 성공 후**: `openSettlementFormForEdit` 는 `getSalesBundleById` 성공 후에만 selectedSalesBundleId/isOpen 을 set (stale row 404 반복 차단, EDGE-2026-06-10-GROUPING-04). 시트에 bundleId 기반 쿼리 추가 시 이 순서 보존.
7. **처리된 실패에 console.error 금지**: 토스트/Error UI 가 처리하는 실패 흐름의 서비스/store 는 콘솔 에러를 남기지 않는다. 관측은 Sentry breadcrumb 채널 (EDGE-2026-06-10-GROUPING-05). providers 의 background refetch 실패 로그는 warn 레벨.

### 과거 회귀 이슈

- 2026-06-10 그룹화 보기 라운드 (`EDGE-2026-06-10-GROUPING-01~05`, 전부 fixed): withErrorHandler data 래핑 unwrap 누락 크래시, 검색 input ↔ store 비동기화, '톤' suffix 중복, 삭제된 번들 stale row 클릭(시트 미오픈+무피드백+404 반복 — 조회 성공 후 시트 오픈으로 수정), 처리된 예외 console.error 노이즈(providers 주석·코드 모순 포함). qa-edge-cases.md 그룹화 보기 섹션 참조.
- 2026-05-06 매출정산 엑셀 차주 정보 빈 값 (`45b2e4fd`): `toSalesExportRowFrom` 가 bundleDriverSnapshot 만 사용. 매출 번들 driverSnapshot 누락 특성에 라이브 fallback 미적용.
- 2026-05-06 매입정산 그룹정산 생성 422 (`1003329e`): mapper 가 빈 companyId/driverId 를 빈 문자열로 fallback → zod uuid 검증 실패. `|| undefined` 로 정규화.
- 2026-05-14 매출 정산 대기 리스트 큰 금액 ≠ 패널 총액 (EDGE-5106): 리스트는 공급가(`subtotalAmount`) 메인 표시, 패널은 세금 포함(`totalAmount`) 합산 → 사용자가 "선착불 세금 미반영" 으로 오해. `settlement-waiting-table.tsx` 메인 라인 `amount` → `amountWithTax` 로 통일.
- 2026-05-15 매출정산 FB-QA 회귀 (`EDGE-2026-05-15-SALE-01~10`): summary API 가 INVALID/빈 status 시 silent fallback 으로 전체 합계 노출 (EDGE-5027 family API 단 잔존), list endpoint 의 amount 컬럼이 ROUND 미적용 (EDGE-5025 list 단), summary/waiting-summary schema 에 `.strict()` 미적용 (EDGE-2047 family), 새로고침 버튼 debounce 없음, PREPAID 필터 0건 (16건 존재), 매출 대기 summary 응답에 prepaidAmount 부재 (04273ce0 비대칭), not-found 500, 통화 표기 `₩+원` 중복 (대기만), 0원 정산 번들 정책 미정. 회귀 가드는 `.claude/knowledge/qa-edge-cases.md` 매출정산 섹션 참조.

### Summary API 회귀 가드 정책 (EDGE-2026-05-15-SALE-01/03 관련)

매출/매입 정산 summary endpoint 수정 시 다음 4개 회귀 가드 강제:

1. **status 입력 검증**: validation schema 에 `z.enum([...]).optional()` 적용. INVALID 입력 → 400. silent fallback 차단.
2. **unknown query strict**: schema 에 `.strict()` 명시. EDGE-2047 family (`sales-bundles/ids`) 패턴 복제. 신규 필드 오타 silent strip 차단.
3. **응답 amount 정수**: SQL `ROUND(SUM(...))::bigint` 또는 application 단 BigInt 변환. 응답 JSON 에 소수점 0건. summary + list 양쪽 일관 적용.
4. **응답 스키마 대칭**: 매출 **대기** ↔ 매출 **번들** summary 응답 필드 셋 일치 (`prepaidAmount, shipperAmount` 양쪽 모두). 04273ce0 같은 hotfix 시점에 비대칭 발생 — 응답 DTO 스키마 단언 unit test 권장.

### 새로고침 버튼 debounce 정책 (EDGE-2026-05-15-SALE-04 관련)

`/broker/sale` `/broker/purchase` 새로고침 버튼 (`aria-label="새로고침"`) 은 다음 중 하나 강제:

- `useMutation` 의 `isPending` 가드 → onClick 호출 차단
- lodash `_.debounce(handler, 500)` 또는 React 18 `useTransition.isPending`
- 회귀 가드 E2E: 빠른 5회 클릭 후 network 요청 수 ≤ 1

---

## 운임 추가금 (Charge Item Adjustments) — EDGE-4001 영역

### 관련 파일 패턴

```
app/api/charge/sales-bundles/items/[id]/adjustments/**
app/api/charge/purchase/bundle/items/[id]/adjustments/**
app/api/charge/sales-bundles/items/route.ts
app/api/charge/purchase/bundle/items/route.ts
db/schema/salesBundles.ts (salesItemAdjustments)
db/schema/purchaseBundles.ts (purchaseItemAdjustments)
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 매출 정산 시트 | /broker/sale (settlement-edit-form-sheet) | 화물 추가금 추가/수정/삭제 |
| 매입 정산 시트 | /broker/purchase (settlement-edit-form-sheet) | 차주 추가금 추가/수정/삭제 |

### 매출/매입 비대칭 가드 (EDGE-4001 관련)

매출 `app/api/charge/sales-bundles/items/[id]/adjustments/route.ts` 와 매입 `app/api/charge/purchase/bundle/items/[id]/adjustments/route.ts` 는 동일 자원 패턴이지만 격리 정책이 비대칭:

- **매입 (정합)**: `withErrorHandler(withTenant(handler, {allowedTypes:['broker']}))` + layered service + ownership 검증.
- **매출 (격리 0)**: raw `db` + `getServerSession + authOptions` import 만 (실제 호출 안 함) + `x-user-id` 헤더만. `findBundleItem(itemId)` 가 broker 격리 0 → cross-broker INSERT/UPDATE/DELETE 가능 (EDGE-4001 catastrophic).

신규 추가금 endpoint 또는 매출 쪽 리팩토링 시 매입 패턴으로 통일 — `bundleItemOwnedByBroker(itemId)` 헬퍼 추출 + service 단 ownership 검증.

### 과거 회귀 이슈

- 2026-05-08 (EDGE-4001) 매출 item adjustments cross-broker write — broker A 가 broker B item 에 surcharge INSERT/UPDATE/DELETE 모두 200. 양방향 시연 성공.

---

## 회사 주의사항 (Company Warnings) — EDGE-4002 영역

### 관련 파일 패턴

```
app/api/companies/[companyId]/warnings/**
server/company-warning/**
db/schema/companyWarnings.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물 상세 시트 (주의사항 위젯) | /broker/order/list → 행 클릭 | 자기 broker 의 warning 만 노출 |
| 거래처 상세 (주의사항 탭) | /broker/company/list → 거래처 클릭 | cross-broker warning 미노출 + PATCH/DELETE 차단 |

### `[warningId]` route 격리 (EDGE-4002 관련)

`app/api/companies/[companyId]/warnings/[warningId]/route.ts` GET/PATCH/DELETE 3 method 가 collection route 와 비대칭:

- **collection (`/warnings`)**: `withTenant({allowedTypes:['broker']})` 적용 + 주석에 "service 가 내부에서 TenantContext 사용".
- **`[warningId]` 3 method**: `withTenant` 누락 + service `findByIdAndCompanyId(warningId, companyId)` 만 — broker_company_profiles 격리 0.
- repository `update(id)` / `delete(id)` 가 raw SQL — companyId 도 무시되므로 warning ID 만 알면 cross-broker write.

신규 warning endpoint 추가 또는 service 변경 시:
1. `withTenant` 적용 일관성 확인.
2. `CompanyWarningRepository` 의 broker 격리 (broker_company_id 컬럼 추가 또는 broker_company_profiles JOIN) 적용.
3. collection list 응답이 broker 격리 적용인지 — EDGE-1043 화주 자산 모델 정책 결정 필요.

### 과거 회귀 이슈

- 2026-05-08 (EDGE-4002) `[warningId]` cross-broker GET/PATCH/DELETE 양방향 시연 — 영업비밀 변조 가능. 코드 주석↔구현 불일치 (collection route 주석에 "service 가 broker 격리" 라 명시했으나 실제는 0).

---

## 인증 우회 family (EDGE-4003~4006 영역, EDGE-054 family)

### 관련 파일 패턴

```
app/api/test/**            ← /api/test/taxinvoice 익명 popbill (EDGE-4003)
app/api/invoice/issues/**  ← /api/invoice/issues 익명 사칭 발행 (EDGE-4004)
app/api/ai/**              ← /api/ai/extract-order 익명 + userSeq=1 (EDGE-4005)
app/api/companies/validate/** ← 사업자번호 oracle (EDGE-4006)
middleware.ts              ← BASELINE_AUTH_REQUIRED_API
```

### baseline 인증 강제 누락 영역 (EDGE-4003~4005 관련)

`middleware.ts` 의 `BASELINE_AUTH_REQUIRED_API` 는 `/api/charge`, `/api/dashboard`, `/api/seed`, `/api/drivers` 만 익명 접근 차단. 다음 영역은 endpoint 내부 `requireAuth` 유무에 의존:

| Path | requireAuth 유무 | 익명 호출 가능 | 임팩트 |
|------|-----------------|--------------|-------|
| `/api/test/taxinvoice` | ❌ 없음 | ✅ 가능 | popbill 직접 호출 (CATASTROPHIC, EDGE-4003) |
| `/api/invoice/issues` | ❌ x-user-id 헤더만 | ✅ 가능 | 사칭 발행 (HIGH, EDGE-4004) |
| `/api/ai/extract-order` | ❌ 없음 | ✅ 가능 | AI 비용 abuse + userSeq=1 (HIGH, EDGE-4005) |
| `/api/companies/validate` | ❌ 없음 | ✅ 가능 | 사업자번호 oracle (MEDIUM, EDGE-4006) |
| `/api/audit-logs` | ✅ 있음 | ❌ (401) | OK |

신규 endpoint 추가 시:
1. `requireAuth` + `withTenant` 둘 다 적용 — 누락 패턴은 EDGE-054 family 회귀.
2. middleware `BASELINE_AUTH_REQUIRED_API` 에 신규 prefix 추가 (이중 안전망).
3. `/api/test/*` 는 production 빌드에서 차단 (`process.env.NODE_ENV === 'production'` 분기).

### 과거 회귀 이슈

- 2026-05-08 (EDGE-4003) `/api/test/taxinvoice` 익명 popbill `get-info` 호출 200 — mgtKey enumeration + direct-issue 트리거 표면.
- 2026-05-08 (EDGE-4004~4006) anonymous service 진입 가능.

---

## SMS family (raw db 격리 0) — EDGE-5001/5007/5009 영역

### 관련 파일 패턴

```
app/api/sms/dispatch/route.ts          ← POST raw db, withTenant 누락 (EDGE-5001)
app/api/sms/history/[orderId]/route.ts ← GET raw db, withTenant 누락 (EDGE-5007)
app/api/sms/recommend/[orderId]/route.ts ← GET raw db, withTenant 누락 (EDGE-5007)
app/api/sms/templates/route.ts         ← hardcoded mock, DB 0건 (EDGE-5009)
db/schema/smsMessages.ts
middleware.ts (BASELINE_AUTH_REQUIRED_API)
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 상세 | /broker/order/list (행 클릭 → 상세) | SMS 발송 버튼 + 이력 + 추천 수신자, 자기 broker order 만 |

### SMS 라우트 격리 정책 (EDGE-5001/5007 관련)

`/api/sms/*` 4개 라우트가 raw `db.<op>` 직접 호출 + `withTenant` 누락. 매출/매입 정산 도메인의 EDGE-4001 family (raw db 격리 0) 와 동일 패턴.

신규 SMS endpoint 추가 또는 기존 라우트 수정 시:
1. 모든 SMS 라우트 `withErrorHandler(withTenant({allowedTypes:['broker']})(handler))` 패턴 통일.
2. `OrderQueryRepository.findById(orderId)` 사전 검증 — orderId 가 자기 broker 화물인지 service 단 가드.
3. senderId 는 JWT 에서 추출 (`requireAuth(request).id`) — body 입력 신뢰 금지 (EDGE-4005 userSeq 패턴).
4. `middleware.ts` `BASELINE_AUTH_REQUIRED_API` 에 `/api/sms` 추가 (이중 안전망 — 미인증 401 차단).
5. SMS templates 는 hardcoded mock — DB 기반 전환 + broker 별 격리 정책 결정 (또는 system templates 명시).

### 과거 회귀 이슈

- 2026-05-08 (EDGE-5001) `/api/sms/dispatch` POST raw db — orderId/senderId 자유 입력. 사칭 발송 + 송금사기 표면. EDGE-042 LMS POST sweep 시 SMS 미커버.
- 2026-05-08 (EDGE-5007) `/api/sms/history/[orderId]` + `/api/sms/recommend/[orderId]` — cross-broker order 의 SMS 본문 + 수신자 전화번호 + order_participants leak.
- 2026-05-08 (EDGE-5009) sms_templates 응답이 hardcoded mock — DB 0건. 운영진 변경 불가.

---

## Users family — broker 격리 service 0 (EDGE-5002~5005 영역)

### 관련 파일 패턴

```
app/api/users/[userId]/route.ts             ← PUT/DELETE (EDGE-5002)
app/api/users/[userId]/status/route.ts      ← PATCH (EDGE-5003)
app/api/users/[userId]/fields/route.ts      ← PATCH (EDGE-5004)
app/api/users/[userId]/change-logs/route.ts ← GET (EDGE-5005)
server/user/application/commands/user-command.service.ts
server/user/application/queries/user-query.service.ts
server/user/infrastructure/user.repository.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 직원 관리 | /broker/users | 자기 broker 직원만 노출, PUT/DELETE/status/fields 자기 직원만 |

### users 라우트 격리 정책 (EDGE-5002 관련)

`UserCommandService.updateUser/changeStatus/updateFields/deleteUser` 4 메서드가 `userRepository.findById(id)` 만 호출 — `target.companyId === requestUser.companyId` 비교 0. 라우트도 `withTenant` 누락 (`requireAuth` 만).

`UserQueryService.getChangeLogs` 도 동일 — change-logs cross-broker GET 가능.

신규 users sub-route 추가 시:
1. route 에 `withErrorHandler(withTenant({allowedTypes:['broker']})(handler))` 적용.
2. `UserRepository.findOwnedById(userId)` 헬퍼 추가 — 자기 broker companyId 와 user.companyId 일치한 row 만 반환 (Drizzle `where eq(users.companyId, this.brokerId)` 합성).
3. service 의 `findById(id)` 호출을 `findOwnedById(id)` 로 전환 (4 command + 1 query 메서드).
4. integration test: '[broker A] PUT/DELETE/PATCH /api/users/<broker B userId> → 403/404'.

### 과거 회귀 이슈

- 2026-05-08 (EDGE-5002~5005) UserCommandService/QueryService 가 broker 격리 0 — broker A 가 broker B 직원 비밀번호 변경 (계정 인계 catastrophic), 비활성화 (영업 방해), 변경 이력 leak.

---

## drivers/notes/[noteId] family — raw db 격리 0 (EDGE-5006 영역)

### 관련 파일 패턴

```
app/api/drivers/notes/[noteId]/route.ts  ← GET/PUT/DELETE raw db (EDGE-5006)
app/api/drivers/notes/route.ts           ← POST (이미 layered)
server/driver/application/commands/driver-note-command.service.ts (이미 isOwnedDriver 가드)
server/driver/infrastructure/driver-note.repository.ts (이미 broker_driver_profiles JOIN)
db/schema/drivers.ts (driver_notes)
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 차주 상세 (특이사항 탭) | /broker/driver/list → 차주 클릭 | 자기 broker 등재 차주의 note 만, GET/PUT/DELETE 자기 broker 만 |

### drivers/notes/[noteId] 격리 정책 (EDGE-5006 관련)

drivers 가 M:N (`broker_driver_profiles`) — 같은 차주를 다수 broker 가 active 등재 가능. note 는 broker-scoped 정책인데 `[noteId]` 라우트가 raw `db.update/delete` 직접 호출 + `x-user-id` 헤더만 검증. `DriverNoteRepository.isOwnedDriver` 헬퍼는 이미 존재하지만 [noteId] 라우트가 layered 미적용.

신규 driver note endpoint 추가 시:
1. 3 method 모두 layered 패턴 (`withErrorHandler(withTenant({allowedTypes:['broker']})(handler))`).
2. `DriverNoteRepository.findOwnedById(noteId)` 헬퍼 추가 — note → driver → `broker_driver_profiles(active)` JOIN.
3. service 단 ownership 검증 (자기 broker 등재 차주의 note 만).
4. integration test: '[broker A] PUT/DELETE /api/drivers/notes/<other broker note ID> → 404'.

### 과거 회귀 이슈

- 2026-05-08 (EDGE-5006) `/api/drivers/notes/[noteId]` GET/PUT/DELETE raw db. 차주 영업비밀 (사고 이력, 안전 주의사항) cross-broker 변조/삭제 표면.

---

## 공유화주 주소록 라벨 (EDGE-5008 영역, EDGE-1043 family 충돌)

### 관련 파일 패턴

```
app/api/addresses/route.ts (GET)
server/address/infrastructure/address.repository.ts
db/schema/addresses.ts
components/broker/address/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 상하차 관리 | /broker/address | 공유화주 row name 필드에 broker 식별자 prefix 노출 정책 |
| 화물등록 | /broker/order/register | 주소 picker 응답에 broker 작업 흔적 노출 정책 |

### 공유화주 라벨 정책 결정 필요 (EDGE-5008 관련)

EDGE-1043 사양: 공유화주 주소록은 화주 자산 모델 (broker 간 read 공유). 그러나 `addresses.name` 필드에 broker 식별자 prefix (`주선사B-...`) 가 들어가 cross-broker 작업 경로 정찰 가능.

신규 주소 등록 흐름 또는 라벨 표시 변경 시:
1. 옵션 A) UI 표시 시 broker prefix 제거 (간단, schema 변경 없음).
2. 옵션 B) `addresses.broker_aliases jsonb` 컬럼 — broker 별 별칭 분리 (화주 자산 + broker 격리 동시 만족).
3. 옵션 C) 라벨도 화주 자산으로 명시 (`docs/CONTEXT.md` 정책 정의) — 영업 정보 leak 을 'feature' 인정.
4. 권장: A or B. C 는 영업 정보 leak 위험.

### 과거 회귀 이슈

- 2026-05-08 (EDGE-5008) 공유화주 C社 주소 응답에 `name='주선사B-화주C하차지등록'` 등 broker 작업 흔적 노출. broker A 가 broker B 의 거래 경로 정찰 가능.

---

## dispatch 전이 흐름 (EDGE-5011 영역)

### 관련 파일 패턴

```
db/schema/orderDispatches.ts (created_by, created_by_snapshot, updated_by, updated_by_snapshot)
server/dispatch/**
server/order/application/commands/accept-dispatch-command.service.ts
server/order/infrastructure/order-with-dispatch.repository.ts (응답 mapper)
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 list/detail | /broker/order/list | dispatch.createdBy / createdBySnapshot 가 self broker user 인지 |

### dispatch transfer 시 createdBy 갱신 정책 (EDGE-5011 관련)

broadcast 화물의 dispatch 가 broker B → broker A 로 transfer 될 때, 현재는 `broker_company_id` 와 `updated_by` 만 갱신되고 `created_by` / `created_by_snapshot` 은 historical broker 의 user 그대로 잔존. broker A 시점 응답에 broker B 직원의 이름/이메일이 그대로 노출 (EDGE-5011 critical).

신규 dispatch transfer/accept 흐름 또는 응답 mapper 변경 시:
1. **권장**: transfer 시 created_by/snapshot 도 새 broker user 로 갱신 (updated_by 와 통일)
2. 또는 응답 mapper 에서 self broker 가 아닌 createdBy 마스킹
3. 운영 historical row 정리 마이그레이션 — `UPDATE order_dispatches SET created_by_snapshot = updated_by_snapshot WHERE created_by ∉ broker_users[broker_company_id]`

회귀 가드:
- integration test: dispatch transfer 후 createdBy ∈ broker_users[new_broker]
- 정적 검사: 응답 mapper 의 `created_by` / `created_by_snapshot` 이 격리 분기 통과

### 과거 회귀 이슈

- 2026-05-08 (EDGE-5011) dispatch.createdBy_snapshot historical leak — broker A 시점 GET /api/orders/with-dispatch 응답에 broker B 직원 이메일 (qa-broker-b@example.com) 노출. broker_company_id 격리는 정상이나 snapshot 컬럼 미갱신.

---

## 거래처 (Company)

### 관련 파일 패턴

```
app/broker/company/**
server/company/**
server/company-warning/**
app/api/companies/**
components/broker/company/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 거래처 목록 | /broker/company/list | 목록, 검색, 상세 |
| 화물등록 | /broker/order/register | 거래처 선택, **picker 모달 type 필터 (broker/carrier 노출 금지)** |
| 화물현황 | /broker/order/list | 거래처명 표시 |

### 거래처 list type 필터 (EDGE-1042 / EDGE-045 관련)

`GET /api/companies` 응답은 거래처 list — **type='broker' 행이 응답에 절대 포함되어선 안 된다**. broker 마스터는 silent reuse 가드(EDGE-039)로 신규 진입은 차단되지만, fix 이전 historical row 가 `broker_company_profiles` 의 active 관계로 잔존하면 list 에 그대로 노출된다.

- companies repository 의 broker context list query 에 `companies.type IN ('shipper', 'carrier')` WHERE 강제.
- 운영 DB 정리 마이그레이션: `broker_company_profiles WHERE companies.type = 'broker' 인 active row 비활성화`.
- 회귀 가드: `[broker A 시점] GET /api/companies → type='broker' row 0건` integration test.

### 토스트 소유권 — 등록 성공 시 토스트 "정확히 1개" (2026-05-27 QA)

`/broker/company/list` 에는 등록 시트가 **2개** 마운트된다.
- `BrokerCompanyActionButtons` (툴바 "신규 등록", 일반 경로) → `onRegisterSuccess` 콜백.
- `app/broker/company/list/page.tsx:295` (빈 상태 "업체 등록하기" 경로) → `handleRegisterSuccess`.

**정책: 등록 성공 토스트는 `broker-company-register-sheet` 가 단일 소유한다.** 부모 콜백(`onRegisterSuccess`)은 목록을 **조용히** 갱신만 한다(`fetchCompanies()`). 부모 콜백에서 토스트를 또 띄우면 문구가 달라도(예: "...등록되었습니다." + "...새로고침되었습니다.") 화면에 2개가 겹친다. `toast`/`ToastUtils` 호출에 id 가 없으면 Sonner dedup 도 안 걸린다(공통 함정).

- 회귀 가드: `broker-company-action-buttons.test.tsx` — 등록 성공 시 `fetchCompanies` 호출 + "새로고침" 토스트 미호출.
- 같은 함정의 다른 경로: 한 핸들러가 "사용자가 누른 새로고침 버튼"과 "프로그램적 갱신"에 같은 `handleRefresh`(토스트 포함)를 재사용하면 후자에서 노이즈 토스트 발생.

### 과거 회귀 이슈

- 2026-05-07 (QA 세션 2) EDGE-1042: broker A 시점 거래처 list 에 type=broker 마스터 ('QA 주선사 B (신규)') 노출 + detail 200 leak (사업자번호 + 은행계좌 + 예금주). EDGE-045 와 동일 family — historical 잔존 데이터 + list query type 필터 누락.
- 2026-05-27 (QA) 등록 성공 시 "등록" + "목록 새로고침" 토스트 2개 겹침 (`b17c6bb4`): action-buttons `onRegisterSuccess` 가 새로고침 버튼 전용 `handleRefresh()` 재사용. 조용한 `fetchCompanies()` 로 교체.

---

## 기사 (Driver)

### 관련 파일 패턴

```
app/broker/driver/**
server/driver/**
app/api/drivers/**
components/broker/driver/**
db/schema/drivers.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 기사 목록 | /broker/driver/list | 목록, 검색, 등록 폼 입력 → 저장 → 재오픈 시 모든 필드 보존 |
| 화물현황 | /broker/order/list | 배차 기사 표시 |
| 화물등록 | /broker/order/register | 기사 선택 |

### 차주 등록/수정 폼에 입력 필드 추가 시 5계층 점검 (EDGE-023 관련)

차주 폼이 입력으로 받는 모든 필드는 다음 5계층 모두 정합 — 한 군데라도 빠지면 폼은 입력을 받지만 저장이 안 되는 silent drop 회귀가 발생한다 (cargoBox/notes/companyName 회귀 사례).

1. **DB schema**: `db/schema/drivers.ts` — drivers 테이블 컬럼 추가 (또는 별도 aggregate 테이블 사용 시 그 테이블 schema)
2. **Validation schema**: `app/api/drivers/validation.ts` — `CreateDriverSchema` + `UpdateDriverSchema` 둘 다 (zod default mode 가 unknown key 를 strip 하므로 한쪽만 추가하면 등록↔수정 비대칭)
3. **Repository 입력 타입**: `server/driver/infrastructure/driver.repository.ts` — `CreateDriverInput` / `UpdateDriverInput` / `UpdateDriverFieldsInput` + `driverColumns` SELECT
4. **Service 요청 DTO**: `server/driver/application/commands/driver-command.service.ts` — `CreateDriverRequest` / `UpdateDriverRequest` 인터페이스
5. **Response DTO + Frontend mapper**:
   - `server/driver/application/queries/dto/response/driver.response.ts` — `DriverResponse` + `toDriverResponse`
   - `server/driver/infrastructure/mappers/driver-form.mapper.ts` — `mapDriverFormToApiRequest` (요청), `mapApiResponseToDriver` / `mapCargoBox` (응답)

별도 aggregate(notes 등)는 폼 onSubmit 에서 driver 생성 후 `Promise.allSettled` 로 별도 API 호출 — 부분 실패 toast.warning, driver 자체는 저장 완료라 폼 close 진행.

### 상호명(companyName) == 차량번호 제한 **의도적 제거** (2026-05-27)

과거 EDGE-BUG-3 가드(상호명이 차량번호와 동일하면 거부 + 응답에서 숨김)가 **사용자 요청으로 완전히 제거됨**. 따라서 아래 두 지점은 더 이상 존재하지 않으며, 재도입 금지:

1. **입력 차단 제거**: `driver-command.service.ts` 의 `assertCompanyNameNotEqualsVehicle` + `InvalidDriverCompanyNameError` 삭제. create/update/updateFields 모두 상호명==차량번호 허용.
2. **표시 정규화 제거**: `driver.response.ts` 의 `normalizeCompanyName` 삭제. `toDriverResponse` 가 `row.companyName` 을 그대로 반환.

**부수 영향**:
- `vehicleNumber` 중복 차단(`DuplicateVehicleNumberError`)은 **유지** — 차량번호 유일성과 무관하므로 혼동 금지.
- 응답 정규화 제거로 historical 데이터(상호명에 차량번호가 잘못 저장된 row)가 **동명이인 disambiguation 드롭다운 / 매입 정산 차주 정보(`purchase/driver-info-section.tsx`) / 차주 목록** 에 그대로 노출될 수 있음. 이는 의도된 정책.
- **용어 변경**: 차주관리 UI 라벨 `업체명` → `상호명` (테이블 헤더 / 검색 placeholder / 등록·수정 폼). 데이터 필드명은 `companyName` 유지. QA 시 "상호명" 으로 검증.

회귀 가드: `driver.response.test.ts` (companyName 원본 보존), `e2e/driver-management.spec.ts` (상호명 라벨). QA 확인 완료 — 상호명==차량번호 등록·수정·표시 정상 (2026-05-27).

### 페이지 통계 카드는 페이지 N 기반 추정 — 정확하지 않다 (EDGE-6001 관련)

`/broker/driver/list` 의 "톤수별 차주 분포" + "활성/비활성 비율" 카드는 `data.data` (현재 페이지 N=10) 로 카운트하고 `totalItems` (1972) 로 percentage 추정 → 가장 많은 톤수가 0% 로 표시되거나 chart 자체 누락. 통계 카드 수정 시 옵션 A(별도 stats API) 권장. integration test: tonnage percentages 합 ≈ 100% (EDGE-6001 회귀 가드).

### 차주 등록 시 유일성 가드 (EDGE-6002 관련)

drivers 테이블에 `(broker_id, vehicle_number) WHERE is_active=true` unique index 없음 + service 단 사전 가드 없음 → 동일 차량번호로 동시 등록 시 둘 다 200. 차주 폼이나 API 신규 진입 추가 시:
1. DB 마이그레이션으로 partial unique index 강제 (또는 service 단 `findByVehicleNumber` 사전 가드 + `DriverAlreadyExistsError`)
2. integration test: 병렬 `POST /api/drivers` 두 건 → 한쪽 4xx (EDGE-6002 회귀 가드)
3. 화물맨 inbound dispatch-request 같이 vehicle_number 로 차주 매칭하는 흐름의 disambiguation 정책도 같이 점검.

### UI ↔ zod enum 정합 (EDGE-6003 관련)

차주 폼의 vehicleType / vehicleWeight (톤수) select 옵션 추가 시:
- `types/driver/broker-driver.ts` 의 `TONNAGE_TYPES` / `VEHICLE_TYPES` 와 `CreateDriverSchema` / `UpdateDriverSchema` 의 `z.enum(...)` 가 동일 단일 진실원천이어야 한다.
- 회귀 가드: `app/api/drivers/__tests__/validation.test.ts` 에 `TONNAGE_TYPES === schema.shape.vehicleWeight._def.values` 단언 (EDGE-023 패턴 재사용).
- "기타" 옵션은 zod enum에 없는 상태로 UI 노출 중 — fix 시 정책 결정 후 5계층 정합.

### Frontend mapper 빈 문자열 정규화 (EDGE-6004 / EDGE-025 family)

`broker-driver-register-form.tsx:onSubmit` 의 optional 필드 매핑은 `data.field || ""` 패턴으로 빈 문자열 전송 → zod `min(N).optional()` 발동 실패 → 400. EDGE-025 (`mapSettlementFormToPurchaseBundleInput`) 가 `|| undefined` 정규화로 fix 한 패턴이 driver-form 에 미적용. 신규 optional 필드 추가 시:
- `data.field || undefined` (zod optional 분기 진입 보장)
- 또는 server zod 가 빈 문자열을 undefined 로 transform
- integration test: optional 필드 `''` 로 POST → 200 (EDGE-6004 회귀 가드)

### 계좌번호 표시 정책 일관성 (EDGE-6005 관련)

`bankAccountNumber` 정규화: 입력 dash 위치를 유지하지 않고 임의 mask 패턴으로 변경 (`"123-4567-8901"` → `"123456-7890-1"`). 통장 사본과 표시 불일치 의심 표면. 정책 결정 필요:
- A: raw 텍스트 보존 (사용자 책임)
- B: dash 모두 제거 후 표시 시 별도 mask 적용

### 과거 회귀 이슈

- 2026-05-06 차주 등록 폼 화물함/적재함/특이사항 미저장 (`841f3373`): drivers 테이블 컬럼 부재 + 5계층 모두 누락. notes 는 별도 API 호출 흐름 미연결. Option C 정식 구현 (DB 마이그레이션 0056 + 5계층 보강).
- 2026-05-06 차주 최초 등록 시 업체명 미저장 (`106157f5`): `CreateDriverSchema` 에 `companyName` 누락 → zod strip. UpdateDriverSchema 에는 있어 재수정만 동작했던 비대칭. validation 단위 테스트로 두 schema 키 정합 베이스라인 확보.
- 2026-05-15 (EDGE-6001) 톤수별/활성 통계 카드 페이지 N=10 기반 — 실제 25톤 623명이 화면 6명(0%)으로 표시. 별도 stats API 또는 더 큰 pageSize fetch 필요.
- 2026-05-15 (EDGE-6002) 동일 vehicleNumber/phoneNumber 차주 동시 등록 race — unique constraint 없음. 마스터데이터 무결성 깨짐.
- 2026-05-15 (EDGE-6003) 톤수 "기타" UI 옵션 zod enum 누락 — 등록 silent 400.
- 2026-05-15 (EDGE-6004) 계좌번호 빈 문자열 `|| ""` 매핑 — zod min(10) 실패. EDGE-025 패턴 미적용 잔존.
- 2026-05-15 (EDGE-6005) 계좌번호 dash 자동 정규화 — 입력 형식 임의 변경.
- 2026-05-15 (EDGE-6006) 톤수 chip toggle 미동작 — 같은 chip 재클릭 시 reset 안 됨 (UX).
- 2026-05-15 (EDGE-6007) 차주 액션 4종(삭제/비활성화/배차이력/정산내역) `alert()` placeholder — 실제 mutation 호출 없음. **비즈니스 핵심 액션 무동작**.
- 2026-05-15 (EDGE-6008) 테이블 뷰에 ContextMenu wrap 없음 — 카드 뷰에서만 액션 진입 가능 (UX 비대칭).
- 2026-05-15 (EDGE-6009) ILIKE wildcard `%`/`_` 미escape — 의도치 않은 전체 1972명 노출. driver query repository 단 `escapeIlike` 헬퍼 필요.
- 2026-05-15 (EDGE-6010) 검색어 trim 미적용 — "  김  " → 0건. searchTerm `value.trim()` 누락.

### 차주 검색 입력 처리 (EDGE-6009 / 6010 family)

차주 검색 input (`BrokerDriverSearch`) 의 `searchTerm` 처리 시 두 가지 정규화 누락:
1. **wildcard escape** (EDGE-6009): `%`/`_` 가 PostgreSQL ILIKE wildcard 로 직접 해석 → 의도치 않은 전체 매칭. driver query repository 의 ILIKE 비교에서 입력을 `escapeIlike(input)` 후 사용 필요.
2. **trim** (EDGE-6010): 사용자 복붙 시 leading/trailing 공백 그대로 송신 → 0건 결과. UI 단 `value.trim()` 또는 backend Zod transform.

신규 free-text 검색 input 추가 시 이 두 가드 함께 적용.

### 차주 액션 메뉴 (EDGE-6007 / 6008 family)

`/broker/driver/list` 의 ContextMenu 액션 (삭제/비활성화/배차이력/정산내역) 은 `components/broker/driver/broker-driver-card.tsx:67-70` 에서 alert() placeholder 로만 연결되어 있음 — 실제 mutation 호출 없음. 그리고 `broker-driver-table.tsx` 에는 ContextMenu wrap 자체가 없어 기본 테이블 뷰에서는 액션 진입 불가.

신규 차주 액션 추가 시:
1. card.tsx 의 callback 을 실제 mutation/router 호출로 연결 (alert 제거)
2. table.tsx 의 row 에도 동일 ContextMenu wrap 추가
3. 삭제는 AlertDialog (confirm) + EDGE-5060 가드 (배차 참조 시 차단 토스트)
4. E2E: 차주 삭제 → list 에서 제거 단언

---

## 주소 (Address)

### 관련 파일 패턴

```
app/broker/address/**
server/address/**
app/api/addresses/**
components/broker/address/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 주소 관리 | /broker/address | 목록, 등록, 수정 |
| 화물등록 | /broker/order/register | 주소 검색/선택 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## 화물맨 연동 (Logishm Integration)

### 관련 파일 패턴

```
server/logishm-integration/**
app/api/integrations/logishm/**
hooks/useLogishmShare.ts
components/broker/order/logishm-share-card.tsx
db/schema/logishmShareStatus.ts
db/schema/logishmOutboundLogs.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 상세 | /broker/order/list | 공유 상태 표시, 공유 버튼 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## SMS 발송 (SMS)

### 관련 파일 패턴

```
app/api/sms/**
components/broker/sms/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 상세 | /broker/order/list | SMS 발송 버튼, 이력 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## 공통 컴포넌트 (Common Components)

### 관련 파일 패턴

```
components/ui/**
components/common/**
lib/**
hooks/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 전체 페이지 | 모든 페이지 | UI 일관성, 동작 확인 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## 인증 (Auth)

### 관련 파일 패턴

```
app/api/auth/**
middleware.ts
lib/auth/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 로그인 | /login | 로그인/로그아웃 |
| 모든 페이지 | 모든 페이지 | 인증 상태 유지, 권한 |

### 과거 회귀 이슈

- (발견 시 추가)

---

## 클라이언트 영속 store (zustand persist) 격리 정책 — EDGE-5041/5040

### 관련 파일 패턴

```
store/**/*.ts                       # zustand persist 영속 store
hooks/auth/use-broker-cache-guard.ts # broker 전환 시 캐시 + storage 정리 책임
hooks/auth/__tests__/use-broker-cache-guard.test.ts
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 화물현황 | /broker/order/list | broker 전환 후 검색창/탭/필터가 초기화 |
| 화물 등록 | /broker/order/register | broker 전환 후 recentLocations 초기화 |
| 1차정산 대기 | /broker/income/first-settlement | broker 전환 후 정산 대기 필터 초기화 |

### broker-scoped persist 키 정책 (EDGE-5041 핵심 가드)

같은 PC 에서 broker 전환 (로그아웃 → 다른 broker 로그인 / 계정 전환) 시 직전 broker 의 검색어·필터·탭·최근주소 등 영업정보가 다음 사용자 화면에 자동 적용되는 leak 을 막기 위한 정책.

`hooks/auth/use-broker-cache-guard.ts` 의 `BROKER_SCOPED_PERSIST_KEYS` 배열에 broker 격리 자원을 영속하는 store 키를 등록하면, broker companyId 변화 감지 시점에 (a) React Query 메모리 캐시 + (b) 해당 localStorage 키 둘 다 정리된다.

**현재 등록된 키**:

- `broker-order-storage` — `/broker/order/list` 의 filter (검색어/화주명/도시/차량/기간) + activeTab
- `broker-order-register-storage` — `/broker/order/register` 의 recentLocations (최근 상하차 주소)
- `income-waiting-store` — `/broker/income/first-settlement` 의 filter (검색어/거래처)

### 신규 zustand persist store 추가 시 점검 (필수)

다음 4 단계로 broker 격리 정책 결정:

1. **partialize 필드 식별**: store 가 영속하는 필드 중 broker 격리 자원 포함 여부 확인.
2. **broker 격리 자원의 정의**:
   - 영업/거래 정보 (`filter.companyId`/`companyName`/`searchTerm`, `recentLocations`, 검색 패턴, 최근 사용 거래처/주소).
   - 화면 컨텍스트 (`activeTab`, broker 별 페이지 상태) — UX 혼선이라도 영속하면 EDGE-5040 family.
3. **격리 정책 선택**:
   - **권장**: filter 자체를 partialize 에서 제거 (`company-storage` 패턴 — 세션마다 깨끗한 상태).
   - **차선**: persist 유지 시 `BROKER_SCOPED_PERSIST_KEYS` 에 키 추가 (broker 전환 시 정리).
4. **단순 UI preference 만 영속하는 store** (`viewMode`/`pageSize` 만): 추가 불필요 (`broker-driver-storage` 패턴).

신규 store 가 정책 (2) 의 필드를 partialize 하는데 (3-b) 등록 누락하면 EDGE-5041 회귀 — `hooks/auth/__tests__/use-broker-cache-guard.test.ts` 의 회귀 가드는 등록된 키만 검증하므로 store 추가 시 테스트도 함께 업데이트.

### auth-storage 의 별도 lifecycle

`auth-storage` 는 `BROKER_SCOPED_PERSIST_KEYS` 에 포함하지 않는다. `store/auth/auth-store.ts` 의 `customStorage.removeItem` 이 logout 시 직접 책임 — broker cache guard 와 분리.

### 과거 회귀 이슈

- 2026-05-12 (EDGE-5041) localStorage zustand persist cross-broker 영업정보 leak: `useBrokerCacheGuard` 가 `queryClient.clear()` 만 호출하고 localStorage 정리 누락 → broker A 의 검색어 "대기업화주ABC-기밀거래선" 이 broker B 화면 검색창에 자동 적용. `BROKER_SCOPED_PERSIST_KEYS` 상수 + `clearBrokerScopedStorage()` 헬퍼 도입.
- 2026-05-12 (EDGE-5040) `broker-order-storage.activeTab` cross-broker 영속: EDGE-5041 와 동일 root cause — broker 전환 후 완료 탭으로 자동 진입. 통합 fix.

---

## 통합 통계 보드 (Integrated Statistics)

### 관련 파일 패턴

```
app/statistics/integrated/**
app/statistics/companies/** (Phase 2 stub)
app/api/statistics/integrated/**
hooks/statistics/**
server/statistics/integrated/**
types/statistics/**
```

### 회귀 테스트 필요 페이지

| 페이지 | URL | 확인 포인트 |
|--------|-----|------------|
| 통계 대시보드 | /statistics/integrated | KPI 11카드 + 차트 5종 + Top 10 표, month 변경, 새로고침, lastFetchedAt |
| 사이드바 통계 메뉴 | (broker only) | 매입 정산 하단, BarChart3 아이콘 |
| Phase 2 stub | /statistics/companies, /statistics/companies/[companyId] | 404 방지 안내 페이지 + month 유지 백 링크 |

### Phase 미구현 destination 가드 패턴 (필수)

PRD 가 다단계 Phase 흐름의 CTA/링크를 활성으로 요구하는 경우, **Phase N 단독 deploy 시점**에 Phase N+1 destination 이 미구현이면:

1. **CTA hide 금지** (PRD 의무 위반 가능): `<Link>` 자체를 빼지 말 것.
2. **destination route 에 stub 페이지 추가**: `app/<route>/page.tsx` 가 없으면 Next.js 가 404 반환 → 사용자 경험 손상. 간단한 "준비 중" 안내 + 이전 화면 복귀 link 가진 stub 컴포넌트 추가.
3. **다음 Phase 작업 시 그대로 덮어쓰기**: stub 의 파일 경로를 본 구현이 점유하도록 설계.

### 차트 Tooltip 명세 일치

recharts `<Tooltip>` default separator 는 ` : ` (공백 포함) — DesignSpec 의 `매출: {금액}원` 처럼 콜론 직후만 공백 1개인 포맷과 미세 불일치. 신규 차트 추가 시 항상 `separator=": "` prop 명시.

### Phase 2 진입 시 점검

Phase 2 본 구현은 다음 stub 을 점유:
- `app/statistics/companies/page.tsx`
- `app/statistics/companies/[companyId]/page.tsx`

본 구현 진입 시:
1. 위 stub 파일을 덮어쓴다.
2. PRD §4.5 의 "부분 실패 허용" 을 위해 위젯별 endpoint 분리 검토 (현 Phase 1 은 단일 응답).
3. `useIntegratedStats` 패턴을 따른 hook 신설 (`hooks/statistics/use-companies-list.ts` 등).

### 디자인 토큰 일관성 (필수)

`app/statistics/integrated/_components/design-tokens.ts` 의 `COLOR` / `CHART_COLOR` 가 단일 source of truth. **hex 직접 분산 금지** — 신규 차트/카드/상태 컴포넌트는 토큰 import 로만 사용. 위반 시 §6/§7 명세와 어긋날 위험. 신규 토큰이 필요하면 `design-tokens.ts` 에 추가 후 import.

또한 §6 "Warning Text (#D97706 — 보조 문구)" 와 "Warning Badge text (#C2410C — 배지 내부 텍스트)" 는 **별개 토큰**. 의미 혼동 시 EDGE-5074 형 디자인 위반 발생.

### 업체 리스트 금액 표기 — 리스트(만 단위) ↔ 상세(원 단위) 비대칭 (2026-06-05 QA)

업체 리스트 화면의 금액 4개 컬럼(매출/매출매입 차익/미수금/30일+ 미수금)은 **만 단위 축약** 정책을 따른다. 원 단위(만 미만) 정밀도는 **상세 화면에서만** 노출한다.

- **리스트** (`app/statistics/companies/_components/list-table.tsx`): `formatAmountManUnit()` — 만 단위 반올림, 원 단위 잔액 제거. 예) `-94만원`, `3,630만원`. 우측정렬 컬럼의 세로 스캔이 흔들리지 않게 하는 것이 목적.
- **상세** (`app/statistics/companies/_components/detail-cards.tsx`): `formatAmountAbbrev()` — 원 단위까지 풀 정밀도. 예) `-94만 3,333원`, `3,630만 990원`.
- 두 formatter 는 `app/statistics/integrated/_components/format.ts` 에 공존. `formatAmountAbbrev` 는 통합 보드 KPI/Top10/차트 툴팁도 공유하므로 동작 변경 금지(추가만).

**신규 금액 표기 변경 시 점검**: 리스트/상세 한쪽만 바꾸면 "원 단위는 상세에서만" 정책이 깨진다. 리스트는 `formatAmountManUnit`, 상세는 `formatAmountAbbrev` 사용 여부를 양쪽 동시 확인.

**적자 강조 정책**: 리스트의 차익/차익률은 음수일 때만 negative(`#DC2626` = `COLOR.negative`)로 강조하고 양수/0/null 은 기본 톤. (참고: Phase 2 `companies/_components/*` 는 design-tokens 미적용 + hex 하드코딩 패턴이 파일 전반에 잔존 — 토큰 마이그레이션은 파일 단위 사안.)

### 과거 회귀 이슈

- 2026-05-14 Phase 1 디자인 라운드 2 — EDGE-5073(도넛 범례 위치), 5074(warningText 토큰 잘못 매핑), 5075(차트 grid 색상 분산), 5076(formatDeltaAbsolute 화살표), 5077(거래처 우측 컬럼 stretch) fix. 6개 차트 컴포넌트가 hex 분산을 풀고 design-tokens 단일 import 로 통일.
- 2026-05-14 Phase 1 QA 라운드 1 — `전체 업체 보기` CTA 가 `/statistics/companies?month=Y-M` 으로 이동했으나 Phase 2 미구현이라 404. Stub 페이지 도입으로 해소. 같은 시점에 recharts tooltip 콜론 spacing (`매출 : ` → `매출: `) + `formatDeltaPp` 화살표 prefix 누락도 함께 fix.
