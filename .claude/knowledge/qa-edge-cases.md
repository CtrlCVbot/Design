# QA 엣지케이스

> 마지막 업데이트: 2026-05-19 (FB-QA 매출정산 회귀 — EDGE-SALE-01~10 7건 fix + 3건 skip/보류. 이전: 2026-05-15 SALE 항목 등록.)
>
> **목적**: QA 세션에서 발견된 엣지케이스 축적

## 사용 방법

1. QA 시작 시 해당 페이지의 알려진 엣지케이스 확인
2. `open` 상태는 재현 테스트 수행
3. `fixed` 상태는 회귀 테스트 수행
4. 새로 발견한 엣지케이스는 세션 종료 시 추가

## 상태 정의

- `open`: 아직 수정되지 않음, 재현 테스트 필요
- `fixed`: 수정됨, 회귀 테스트 필요
- `wontfix`: 수정하지 않기로 결정됨

---

## /broker/order/list (화물현황)

### 동시성

#### [EDGE-001] 운송 수락 빠른 더블클릭

- **발견일**: 2026-01-21
- **심각도**: high
- **상태**: open
- **재현**:
  1. 요청 탭에서 화물 선택
  2. "운송 수락" 버튼 빠르게 2번 클릭
- **현상**: API 2번 호출, 중복 처리 가능성
- **확인점**: debounce 또는 버튼 비활성화 동작

#### [EDGE-002] 새로고침 버튼 연속 클릭

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**: 새로고침 버튼 빠르게 여러 번 클릭
- **현상**: 다수 API 호출, 서버 부하
- **확인점**: debounce 동작

#### [EDGE-003] 필터 빠른 변경

- **발견일**: 2026-01-21
- **심각도**: low
- **상태**: open
- **재현**: 필터 옵션 빠르게 여러 번 변경 후 적용
- **현상**: 불필요한 API 호출
- **확인점**: debounce 또는 최종 값만 적용

### 상태 전이

#### [EDGE-004] 마감된 화물 수정 시도

- **발견일**: 2026-01-21
- **심각도**: high
- **상태**: open
- **재현**:
  1. 마감된 화물 상세 시트 열기
  2. 배차 정보 수정 시도
- **현상**: 수정 버튼이 숨겨져야 함
- **확인점**: 적절한 UI 비활성화

#### [EDGE-005] 취소된 화물 상태 변경 시도

- **발견일**: 2026-01-21
- **심각도**: high
- **상태**: open
- **재현**:
  1. 취소된 화물 상세 시트 열기
  2. 상태 변경 드롭다운 클릭
- **현상**: 드롭다운 비활성화 또는 변경 불가 표시
- **확인점**: 적절한 에러 처리

#### [EDGE-006] 이미 수락된 화물 다시 수락

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**:
  1. 탭 2개 열기
  2. 같은 화물 양쪽에서 수락 시도
- **현상**: 두 번째 요청 실패 처리
- **확인점**: 적절한 에러 메시지

### 경계값

#### [EDGE-007] 검색어 특수문자 입력

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**: 검색창에 `'; DROP TABLE; --` 입력 후 검색
- **현상**: SQL Injection 방지 확인
- **확인점**: 정상적인 검색 결과 또는 빈 결과

#### [EDGE-008] 빈 필터 적용

- **발견일**: 2026-01-21
- **심각도**: low
- **상태**: open
- **재현**: 모든 필터 비우고 적용
- **현상**: 전체 조회 또는 적절한 기본값
- **확인점**: 에러 없이 동작

#### [EDGE-009] 0건 조회 결과

- **발견일**: 2026-01-21
- **심각도**: low
- **상태**: open
- **재현**: 결과 없는 필터 조건 적용
- **현상**: "데이터가 없습니다" 메시지 표시
- **확인점**: 빈 상태 UI 적절성

### 실패 복구

#### [EDGE-010] API 에러 후 재시도

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**:
  1. 네트워크 끊김 상태에서 API 호출
  2. 에러 토스트 확인
  3. 네트워크 복구 후 재시도
- **현상**: 정상 동작 회복
- **확인점**: 에러 상태에서 UI 복구

### 페이지네이션

#### [EDGE-016] currentPage가 totalPages를 초과한 상태로 진입

- **발견일**: 2026-04-28
- **심각도**: medium
- **상태**: fixed (`fac43db9`)
- **재현**:
  1. 마지막 페이지(totalPages=N)에서 1건만 남은 항목 삭제/상태변경
  2. OR localStorage `broker-order-storage`의 `currentPage`를 totalPages 초과 값으로 설정 후 새로고침
- **현상**: 빈 페이지 잔류 (수정 전) → 마지막 유효 페이지로 자동 이동 (수정 후)
- **확인점**: `useBrokerOrderData`의 effect가 `data.length===0 && currentPage>1`일 때 `setCurrentPage(Math.max(1, totalPages))` 호출. 4개 탭(요청/진행중/완료/전체) 공통 동작.

### 기간 필터

#### [EDGE-020] 진행중/완료 탭 default 기간 — quick filter `이번주` 와 정의 어긋남

- **발견일**: 2026-05-06
- **심각도**: high (사용자 멀티테넌트 QA #8 보고)
- **상태**: fixed (`cb18fbe1`)
- **재현**:
  1. /broker/order/list 진행중 또는 완료 탭 진입 (아직 quick filter 클릭 전)
  2. 또는 quick filter "이번주" 클릭 후 적용
- **현상 (수정 전)**:
  - 화면 표시는 "이번주(월~일)" 인데 백엔드 GET /api/orders/with-dispatch 호출은 `startDate=oneWeekAgo(today-7) & endDate=today` 로 sliding 1주 → 화면 인지(예: 5/4~5/10) 와 실제 결과(4/29~5/6) 어긋나 4월 말 화물이 화면에 섞여 보임.
- **확인점**:
  - `mapBrokerFilterToApiParams` 가 `tabFilters.startDate/endDate` 를 fallback 으로 쓸 때 그 값이 quick filter "thisWeek" 와 동일한 월~일이어야 한다.
  - 검증 포인트: 진행중/완료 탭 진입 시 network 요청의 startDate/endDate 가 이번주 월요일 / 일요일 인지.

### 메시지 발송

#### [EDGE-021] 오더 상세 LMS Compose 의 contacts API 가 silent fallback 으로 빈 목록

- **발견일**: 2026-05-06
- **심각도**: high (사용자 멀티테넌트 QA #1 보고)
- **상태**: fixed (`bc445b3e`)
- **재현**:
  1. /broker/order/list 에서 화물 행 클릭 → 상세 시트
  2. "메시지 보내기" 버튼 → LmsComposeDialog
- **현상 (수정 전)**:
  - 화주/차주/상하차 담당자가 한 명도 표시되지 않음.
  - 원인: `/api/orders/[orderId]/contacts` GET 라우트가 `withTenant` 미적용 → reader 의 `TenantContext.requireBrokerCompanyId()` throw → 500. 클라이언트 `LmsComposeDialog.loadContacts` 의 silent catch 로 빈 배열 fallback.
- **확인점**:
  - 멀티테넌트 격리 sweep 후 다른 broker-only 라우트도 같은 패턴(`withTenant` 누락 + 클라이언트 silent catch) 잠재. 신규 broker-only 라우트 추가 시 `withTenant + allowedTypes:['broker']` 표준 적용.
  - 검증 포인트: 응답 상태 200 + data 배열에 4 role(driver/shipper/loading/unloading) 중 데이터 존재하는 항목 표시.

#### [EDGE-022] contactUserSnapshot.mobile = "0" 인 데이터 결함

- **발견일**: 2026-05-06
- **심각도**: low (개별 데이터 결함, 코드 버그 아님)
- **상태**: open (데이터 정제 별도 작업 또는 phone 형식 검증 강화)
- **재현**:
  1. 일부 오더에서 `orders.contactUserSnapshot.mobile = "0"` 으로 저장된 행이 존재 (오더 등록 시 mobile 미입력 또는 잘못된 값)
  2. 메시지 발송 다이얼로그에서 화주 contact 의 phone 이 "0" 으로 표시
- **현상**:
  - `OrderContactsReader.hasPhone()` 이 `phone != null && phone.trim().length > 0` 으로만 검사 → "0" 도 통과해 contact 목록에 노출.
- **확인점**:
  - phone 정규식 검증 강화 (예: `/^(01[016789]\d{7,8}|0[2-6]\d{7,8})$/`) 또는 데이터 정제.
  - 신규 발견 시 영향 범위: contacts API 응답을 사용하는 모든 곳 (LMS Compose 외 향후 추가될 SMS 발송 흐름).

### 차주 등록

#### [EDGE-023] 차주 등록 폼 입력 필드와 저장 흐름 5계층 동기화

- **발견일**: 2026-05-06
- **심각도**: high (사용자 멀티테넌트 QA #2/#3 보고)
- **상태**: fixed (#2 `841f3373`, #3 `106157f5`)
- **재현**:
  1. /broker/driver/list 에서 차주 등록 폼 진입
  2. 화물함 종류/적재함 길이/특이사항/업체명 모두 입력 후 등록
  3. 같은 차주 다시 열어 값 유지 확인
- **현상 (수정 전)**:
  - 화물함 종류/적재함 길이/특이사항/업체명 모두 빈 값으로 다시 열림.
  - 원인 1 (#2): drivers 테이블 컬럼 부재 + validation/repository/mapper/응답 5계층 모두 누락 → 폼 UI 만 존재하는 미구현 영역.
  - 원인 2 (#3): `CreateDriverSchema` 에 `companyName` 필드 미정의 → zod strip → 백엔드 INSERT 누락 (UpdateDriverSchema 에는 있어 재수정만 동작).
  - 원인 3 (#2-G): 폼 onSubmit 이 driver 등록 mutation 만 호출하고 `data.notes` 를 어떤 API 로도 보내지 않음.
- **확인점 (회귀 방지 베이스라인)**:
  - 차주 폼에 신규 입력 필드 추가 시 5계층(DB schema → validation → repository → service request DTO → response DTO + frontend mapper) 모두 점검.
  - `CreateDriverSchema` 와 `UpdateDriverSchema` 의 필드 집합이 일치하는지 (Object.keys 비교 회귀 테스트 — `app/api/drivers/__tests__/validation.test.ts`).
  - notes 같은 별도 aggregate 는 폼 onSubmit 에서 `Promise.allSettled` 로 별도 API 호출.

### 변경이력

#### [EDGE-017] logOrderChange 호출 시 changedByRole 누락 회귀

- **발견일**: 2026-04-28
- **심각도**: high
- **상태**: fixed (`39718ba3`)
- **재현**: 다음 경로에서 화주가 작업 → 변경이력에서 (주선사)로 잘못 표기
  - `app/api/orders/batch/route.ts` (일괄 cancel/delete/updateStatus)
  - `app/api/orders/[orderId]/settlement/route.ts` (운송마감 취소)
  - `app/api/broker/dispatches/[id]/close/route.ts` (운송마감)
  - `server/order/application/commands/cancel-dispatch.service.ts` (배차 취소)
- **현상**: changedByRole 미전달 시 change-logger·getUserRole·DB schema 모두 default `'broker'`로 폴스루
- **확인점**: 새 `logOrderChange` 호출 추가 시 `changedByRole: getUserRole(systemAccessLevel)` 명시 전달 필수. shipper_member→shipper / broker_member→broker / *_admin→admin 매핑.

---

## /broker/income/first-settlement (1차정산)

### 상태 전이

#### [EDGE-011] 마감된 화물 재정산 시도

- **발견일**: 2026-01-21
- **심각도**: high
- **상태**: open
- **재현**:
  1. 마감 완료된 화물 선택
  2. 정산 버튼 클릭
- **현상**: 적절한 에러 메시지 또는 버튼 비활성화
- **확인점**: 중복 정산 방지

### 경계값

#### [EDGE-012] 금액 0원 정산

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**: 청구/배차 금액 모두 0원으로 정산 시도
- **현상**: 유효성 검증 에러 또는 경고
- **확인점**: 적절한 처리

---

## /broker/sale (매출현황) / /broker/purchase (매입현황)

### 동시성

#### [EDGE-013] 일괄 처리 중 개별 수정

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**:
  1. 여러 건 선택 후 일괄 처리 시작
  2. 처리 중 다른 건 개별 수정 시도
- **현상**: 충돌 방지 또는 적절한 락킹
- **확인점**: 데이터 정합성 유지

### 데이터 매핑

#### [EDGE-019] 외부/수기 발행 후 대사(진행중) 리스트 비갱신

- **발견일**: 2026-04-30
- **심각도**: high
- **상태**: fixed (이번 커밋)
- **재현**:
  1. `/broker/sale?tab=MATCHING` 또는 `/broker/purchase?tab=MATCHING` 진입
  2. 미발행 로우 클릭 → 정산 시트 열림
  3. "외부/수기 등록" → "외부 발행" 또는 "수기 발행" 선택 → 등록 클릭
  4. 토스트 "외부 발행 등록 완료" 확인 후 ESC로 시트 닫음
- **현상**: 리스트의 "세금계산서" 컬럼이 여전히 "미발행"으로 stale 표시 (수정 전). 새로고침해야만 반영됨.
- **확인점**: 등록 직후 리스트 셀이 "외부발행"/"수기발행"으로 즉시 변경. 매출은 `fetchSalesBundles()`, 매입은 `queryClient.invalidateQueries(settlementKeys.purchaseBundles())` 호출. 전자발행/수정발행(TaxInvoiceIssueModal `onSuccess`)도 동일 처리 필요.

#### [EDGE-024] 매출 정산 엑셀 — bundleDriverSnapshot 누락 시 라이브 fallback 필요

- **발견일**: 2026-05-06
- **심각도**: high (사용자 멀티테넌트 QA #5 보고)
- **상태**: fixed (`45b2e4fd`)
- **재현**:
  1. /broker/sale 진행중/완료 탭에서 정산 번들 선택
  2. 엑셀 다운로드
- **현상 (수정 전)**:
  - 차량번호/차주명/차주사업자번호/차주상호 4개 컬럼이 모두 빈 값.
  - 원인: 매출 번들은 화주 단위 정산이라 한 번들에 여러 차주가 묶일 수 있어 `salesBundles.driverSnapshot` 이 보통 비어 있음. mapper 가 snapshot 만 사용하고 라이브 fallback 미적용.
  - 매입(purchase) mapper 는 `(isCompleted ? snapshot : live)` 분기 적용해 정상 → 비대칭.
- **확인점**:
  - `toSalesExportRowFrom` 의 driver 4필드는 `safeString(snapshot.field || live.field)` 패턴.
  - 단위 테스트: paid + snapshot 채워짐 → snapshot 우선 / paid + snapshot 빈필드 → 라이브 보강 / 진행중 → 라이브.

#### [EDGE-025] 매입정산 그룹정산 생성 — 빈 문자열 companyId/driverId 가 zod uuid 검증에 실패

- **발견일**: 2026-05-06
- **심각도**: high (사용자 멀티테넌트 QA #6 보고)
- **상태**: fixed (`1003329e`)
- **재현**:
  1. /broker/purchase 대기 탭에서 차주 단위 화물 2건 체크
  2. "그룹 정산" 버튼 → 정산 생성
- **현상 (수정 전)**:
  - 422 응답으로 그룹정산 생성 매번 실패. 매입은 차주 단위 정산이라 화주(`companyId`) 미입력 케이스가 정상 흐름인데 그 때 항상 실패.
  - 원인: `mapSettlementFormToPurchaseBundleInput` 가 `formData.shipperId/driverId` 미설정 시 빈 문자열 `''` 로 fallback. zod schema 의 `z.string().uuid().optional()` 은 빈 문자열을 string 으로 인식해 uuid 검증 발동 → 실패.
- **확인점**:
  - frontend mapper 가 빈 문자열을 `undefined` 로 정규화하는지 (zod optional 분기 진입 보장).
  - schema `.refine(companyId || driverId)` 정책은 유지 — 둘 다 비면 거부.

### 그룹화 보기 (2026-06-10 라운드)

#### [EDGE-2026-06-10-GROUPING-01] withErrorHandler data 래핑 unwrap 누락 → 그룹화 보기 크래시

- **발견일**: 2026-06-10
- **심각도**: critical
- **상태**: fixed (같은 라운드)
- **재현 (수정 전)**:
  1. /broker/sale 대기 탭 → `그룹화 보기` 클릭
  2. 페이지 전체가 에러 바운더리로 교체: `Cannot read properties of undefined (reading 'flatMap')`
- **원인**: `withErrorHandler` 는 페이지네이션 shape이 아닌 단순 객체 응답을 `{ data, success }` 로 래핑. 기존 waiting GET 은 paginated shape 이라 예외적으로 안 감싸져, 신규 GET 추가 시 unwrap 누락을 눈치채기 어려움.
- **확인점**: FE 서비스가 `result.data` 로 unwrap. 회귀 가드: `tests/unit/services/sales-settlement.test.ts` (응답 계약 테스트). 신규 단순 객체 GET 라우트마다 동일 계약 테스트 작성.

#### [EDGE-2026-06-10-GROUPING-02] 검색 input 로컬 상태 ↔ store 필터 비동기화

- **발견일**: 2026-06-10
- **심각도**: medium
- **상태**: fixed (같은 라운드)
- **재현 (수정 전)**:
  1. 대기 탭 검색창에 '코덱트' 입력 → `그룹화 보기` → `초기화하고 전환`
  2. 필터 state 는 초기화됐지만 검색 input 에 '코덱트' 잔존
  3. input 을 건드리면 디바운스 후 setFilter 발동 → 그룹화 보기가 예고 없이 기본 보기로 복귀
- **확인점**: `WaitingSearch` 가 store 검색어의 "변경 시점"에 로컬 input 동기화 (디바운스 중 타이핑은 되돌리지 않음). 회귀 가드: `tests/unit/components/broker/sale/settlement-waiting-search.test.tsx`.

#### [EDGE-2026-06-10-GROUPING-03] requestedVehicleWeight '톤' suffix 중복 ("1톤톤")

- **발견일**: 2026-06-10
- **심각도**: low
- **상태**: fixed (같은 라운드)
- **현상**: 중량 값이 '1톤' 같은 enum 문자열인데 표시 코드가 `${weight}톤` 으로 suffix 를 덧붙여 "1톤톤 카고" 노출.
- **확인점**: `ISettlementWaitingItem.requestedVehicleWeight` 는 타입 선언(number)과 달리 실데이터가 문자열. 표시 시 원본 그대로 (`차종 중량` 순). 신규 화면에서 중량 표시 시 suffix 금지.

#### [EDGE-2026-06-10-GROUPING-04] 삭제된 번들의 stale row 클릭 → 시트 미오픈 + 무피드백 + 404 반복

- **발견일**: 2026-06-10 (2라운드에서 결정적 재현으로 원인 확정)
- **심각도**: medium (UX 무피드백 + 404 콘솔 4회 반복)
- **상태**: fixed (2026-06-10 2라운드)
- **재현 (수정 전)**:
  1. 대사 탭 번들이 다른 경로(API/타 사용자)로 삭제되어 리스트에 stale row 잔존
  2. stale row 클릭 → `openSettlementFormForEdit` 가 **조회 전에** `selectedSalesBundleId` set
  3. 죽은 id 로 `useSalesBundleFreightList` 발동 → `/order-list` 404 + RQ retry 3회 = 콘솔 404×4
  4. `getSalesBundleById` 404 → 시트 안 열림, 사용자 피드백 없음, stale id 잔존
- **수정**: `openSettlementFormForEdit` 가 번들 조회 **성공 후에만** 시트 상태(selectedSalesBundleId/editing/isOpen) set + `Promise<boolean>` 반환. 실패 시 `fetchSalesBundles()` 재조회로 stale row 자동 정리, 호출처(매출 BundleMatchingList)가 토스트 안내.
- **회귀 가드**: `tests/unit/store/broker-charge-store.test.ts`, `components/broker/sale/__tests__/settlement-bundle-matching-list.test.tsx` (행 클릭 동작 describe). 시트 데이터 쿼리는 "선택 id 가 유효 번들로 확인된 후" 발동해야 한다.
- **참고**: 매입 측은 detail 을 `usePurchaseBundleDetailQuery` 가 담당 — stale id set 시 detail 쿼리 404 동작은 별도 미점검 (open 관찰).

#### [EDGE-2026-06-10-GROUPING-05] 처리된 예외의 console.error 노이즈 (services/store/providers)

- **발견일**: 2026-06-10 (2라운드)
- **심각도**: low (콘솔 노이즈 — 운영 디버깅 신호 희석)
- **상태**: fixed
- **현상 (수정 전)**:
  - 서비스 함수가 `catch { console.error; throw }` 패턴 → 호출처가 토스트/Error UI 로 처리하는 흐름에서도 콘솔 에러 중복.
  - `app/providers.tsx` QueryCache onError 가 "백그라운드 리페치 실패는 **조용히** 처리" 주석 아래에서 `console.error` 호출 — 주석·코드 모순.
- **수정**: 처리된 흐름의 서비스/store console.error 제거 (`getSalesBundleById`, `getSettlementGroupingCandidates`, `createGroupedSalesBundles`, `openSettlementFormForEdit`). providers 는 Sentry breadcrumb 유지 + `console.warn` 강등.
- **회귀 가드**: `tests/unit/providers.test.ts`, services/store 테스트의 `console.error 미발생` 단언. 신규 서비스 함수 작성 시 "UI 가 처리하는 실패에는 console.error 금지" — 관측은 Sentry breadcrumb/captureException 채널 사용.
- **잔여 한계**: 의도된 4xx/네트워크 차단 시 브라우저 DevTools 의 `Failed to load resource` 네트워크 기록은 코드로 억제 불가(앱 오류 아님).

#### [관찰] 후보 체크박스 재선택 시 대상월 외 건까지 전체 선택

- **발견일**: 2026-06-10
- **상태**: 기획 확인 필요 (PRD-FR-12 명세 그대로 구현됨)
- **현상**: 후보 row 체크박스는 "하위 선택 가능 오더 일괄 변경" — 전체 해제 후 재선택하면 기본 미선택이던 직전 운송월 건(예: 134건)까지 포함된다. 카드에 `대상월 외 포함` badge 로 피드백은 제공.
- **확인점**: Phase 2 그룹화 설정 시 "후보 체크박스 = 정산대상월만" 정책 변경 여부 기획 결정.
  - 같은 패턴(`|| ''`) 의 다른 입력 mapper 도 zod 검증 실패 잠재. 새 mapper 작성 시 nullable optional 필드는 `|| undefined` 로 정규화.

#### [EDGE-018] 번들 목록 매퍼 placeholder 함정

- **발견일**: 2026-04-28
- **심각도**: high
- **상태**: fixed (`6d34e47a`)
- **재현**:
  1. 번들 매퍼(`server/charge/infrastructure/mappers/bundle-common.mapper.ts`)에 새 필드를 `[] as string[]` / `0` 같은 placeholder로 두고 UI 컬럼 추가
  2. 매출/매입 정산의 대사·완료 탭 진입
- **현상**: UI 컬럼 정렬은 맞지만 모든 row에서 0/공백/빈 값 표시 (예: 화물 건수가 모두 "0건")
- **확인점**: 컬럼 추가 시 매퍼 + 리포지토리 SELECT(서브쿼리/JOIN) + `ISalesBundleListItem` / `IPurchaseBundleListItem` 타입 + Pick 타입 4곳 모두 전파 필요. UI 정렬만 보지 말고 실제 값 sample 검증.

---

## 공통 (모든 페이지)

### 인증

#### [EDGE-014] 세션 만료 중 작업

- **발견일**: 2026-01-21
- **심각도**: high
- **상태**: open
- **재현**:
  1. 로그인 후 일정 시간 경과
  2. 세션 만료 직전 API 호출
- **현상**: 적절한 세션 만료 처리
- **확인점**: 로그인 페이지 리다이렉트 또는 자동 갱신

### UI

#### [EDGE-026] Next/Image fill 부모 position 누락 — 콘솔 워닝

- **발견일**: 2026-05-06
- **심각도**: low (UX 무영향, 콘솔 워닝)
- **상태**: fixed (dashboard-overview.tsx)
- **재현**: dashboard 진입 시 콘솔
- **현상 (수정 전)**:
  - `Image with src "/globe.svg" has "fill" and parent element with invalid "position". Provided "static" should be one of absolute,fixed,relative.`
  - `Image with src "/globe.svg" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property...`
- **확인점**:
  - `<Image fill />` 사용 시 부모에 `relative` 클래스 + `sizes` 명시.
  - 첫 화면 LCP 후보면 `priority` 추가.
  - 신규 이미지 추가 시 같은 패턴 점검 (정적 검사 — `components/dashboard/__tests__/dashboard-overview.test.tsx`).

#### [EDGE-015] 모바일 반응형 레이아웃

- **발견일**: 2026-01-21
- **심각도**: medium
- **상태**: open
- **재현**: 브라우저 창 크기 줄이기 (모바일 뷰포트)
- **현상**: 레이아웃 깨짐 없이 동작
- **확인점**: 반응형 UI 정상 동작

---

## 멀티주선사 격리 (Multi-Tenant Isolation)

### 데이터 격리

#### [EDGE-027] dispatch LEFT JOIN 격리 누락 — 화면 list 에 다른 broker 의 회사명/담당자/이메일 직접 노출

- **발견일**: 2026-05-07
- **심각도**: critical (M:N 화주 시나리오에서 경쟁 broker 정보 leak)
- **상태**: fixed (`2fda5a9a`) — 2026-05-07 회귀 검증: broker A 시점 list 38건 전부 dispatch broker leak 신호 없음
- **재현**:
  1. 한 화주가 broker A·B 양쪽과 active 관계
  2. 화주가 broadcast 화물 등록 (orders.broker_company_id=NULL)
  3. broker B 가 dispatch 생성 (orderDispatches.broker_company_id=B). orders 의 broker_company_id 는 stamp 안 됨 (lock 미실행 상태).
  4. broker A 로 로그인 → /broker/order/list → 그 broadcast 화물이 list 에 보임 (`ordersTenantWhere()` NULL+EXISTS 분기로 정상 노출)
  5. **담당자 컬럼**에 "QA 주선사 B 담당" 노출
- **현상 (수정 전)**:
  - API 응답에 `dispatch.brokerCompanySnapshot.name`, `brokerManagerSnapshot.name/email`, `businessNumber`, `ceoName` 등 다른 broker 정보 leak.
  - 원인: `server/order/infrastructure/order-with-dispatch.repository.ts:36` 의 `.leftJoin(orderDispatches, eq(orders.id, orderDispatches.orderId))` — orders 격리(`ordersTenantWhere()`)는 적용되나 dispatch 측 broker 격리 조건 없음.
- **확인점**:
  - JOIN 조건에 broker 분기 추가:
    ```ts
    .leftJoin(orderDispatches, and(
      eq(orders.id, orderDispatches.orderId),
      ctx.userType === 'broker' ? eq(orderDispatches.brokerCompanyId, this.brokerId) : undefined,
    ))
    ```
  - shipper 시점은 dispatch broker 정보가 보여야 정상 (자기 화물의 운송자 식별).
  - 회귀 테스트: broker A 시점에서 list 응답의 모든 row 에 대해 `dispatch.brokerCompanyId === self || null` 검증.

#### [EDGE-028] silent reuse 사업자번호 정규화 비대칭 — 같은 사업자번호 두 마스터 공존 (DB 무결성 위반)

- **발견일**: 2026-05-07
- **심각도**: critical (정산/세금계산서 grouping 결과 깨짐)
- **상태**: fixed (`fa4a5ba5`) — 회귀 검증: businessNumberMatches() 가 양 형식 OR 비교
- **재현**:
  1. broker B 가 거래처 등록 → companies 마스터 `business_number = '704-81-44444'` (하이픈 형식) 저장
  2. broker A 로 로그인 → POST `/api/companies` `{ businessNumber: '704-81-44444', ... }`
  3. 응답 201 Created + 새 id 반환 (silent reuse 미작동)
  4. DB 검증 시 같은 사업자번호 두 행 공존:
     - `cccc0002-...` `name='QA 화주 B社'` `business_number='704-81-44444'` (하이픈)
     - `b8de3586-...` `name='복제 시도'` `business_number='7048144444'` (정규화)
- **현상 (수정 전)**:
  - `BusinessNumber.create('704-81-44444').value` → `'7048144444'` 로 정규화.
  - `findMasterByBusinessNumber` 가 `WHERE business_number = '7048144444'` 로 조회 → 시드 마스터(`704-81-44444`) 못 찾음 → null.
  - silent reuse 분기(connectBroker) 미진입 → 새 마스터 생성 분기로 폴스루.
  - DB UNIQUE 제약은 형식이 달라 안 걸림.
- **확인점**:
  - 운영 DB historical business_number 마이그레이션 (정규화 통일).
  - `findMasterByBusinessNumber` 가 정규화된 형식과 historical 형식 모두 조회 (또는 양쪽 정규화하여 비교).
  - 회사 INSERT 시 트리거로 정규화 강제.
  - 회귀 테스트: 같은 사업자번호 다양한 입력 형식(`704-81-44444`, `7048144444`, `704 81 44444`)으로 silent reuse 분기 진입 검증.

### 라우트 격리

#### [EDGE-029] list/detail 격리 비대칭 — broadcast 화물 클릭 시 stuck

- **발견일**: 2026-05-07
- **심각도**: high (운영 차단)
- **상태**: fixed (`5a35ea63`) — 회귀 검증 (2026-05-07): broker A 시점 list 38건 전부 detail 200 PASS (list ⊂ detail 정합성 완결)
- **재현**:
  1. broker A 시점 /broker/order/list → broadcast 화물 보임 (orders.broker_company_id=NULL + broker_company_profiles active 관계 화주)
  2. 그 행 클릭 → 상세 시트 열림
  3. **"주선 화물 정보를 불러오는 중..."** 에서 영원히 멈춤
- **현상 (수정 전)**:
  - list API: `OrderWithDispatchRepository.findOrdersWithDispatches` → `ordersTenantWhere()` 사용 → broadcast 화물 보임.
  - detail API: `OrderQueryRepository.findDetailWithDispatch` → `eq(orders.brokerCompanyId, this.brokerId)` 만 → broadcast 화물 못 봄 → 404.
  - 시트 컴포넌트에 404 fallback 처리 없음 → 로딩 스피너 stuck.
  - 같은 패턴: `findById`, `findFullById`, `findSettlementTypeById`, `findCancelStatusById`, `findRecentCargoByCompany` 모두 broadcast 못 봄 (broker A 시점).
- **확인점**:
  - `OrderQueryRepository` 의 broker 격리 메서드를 `this.ordersTenantWhere()` 로 통일 (또는 그에 상응하는 broker 분기).
  - 시트 컴포넌트는 404 응답 시 명시적 에러 메시지 fallback ("이 화물은 더 이상 조회 가능 상태가 아닙니다").
  - 회귀 테스트: broker A 시점에서 list 에 노출된 모든 화물 ID 가 detail 에서도 200 응답 검증 (list ⊂ detail).
  - 877e1466 fix 가 list 만 적용했고 detail (`OrderQueryRepository`) 미적용 — 후속 적용 필요.

#### [EDGE-030] /api/orders/{id}/* sub-route 격리 정책 불일치

- **발견일**: 2026-05-07
- **심각도**: medium
- **상태**: fixed (`5a35ea63`, `bf12aaaf`) — 회귀 검증 (2026-05-07): broker A 자기 화물 38건 sub-route 일관성 PASS. 단 with-dispatch URL 패턴은 `/api/orders/with-dispatch/{id}` (역구조), 직관적인 `/api/orders/{id}/with-dispatch` 는 Next 404 응답이 떨어진다 — 구조 자체가 main `/orders/{id}` 응답에 dispatch 필드 통합으로 전환됨.
- **재현**:
  - broker A 시점에서 broadcast 화물 ID `5e80c62e-...` 호출 시:
    - `/api/orders/{id}` → 200
    - `/api/orders/{id}/with-dispatch` → 404
    - `/api/orders/{id}/contacts` → 200
    - `/api/orders/{id}/change-logs` → 200
- **현상**:
  - 같은 화물 ID 에 대해 sub-route 별로 격리 정책이 다름 (일부는 `ordersTenantWhere()`, 일부는 `brokerScoped()`).
  - shipper 시점에서도 자기 발주 화물 detail 이 404 → 자기 화물 상세 못 봄.
- **확인점**:
  - 모든 `/api/orders/{id}/*` sub-route 가 동일한 격리 정책 (`ordersTenantWhere()`) 사용.
  - 회귀 테스트: 한 화물 ID 에 대해 모든 sub-route 가 같은 격리 결과 (모두 200 OR 모두 404).

#### [EDGE-032] /api/companies/{companyId}/users — 다른 broker 직원 정보 전체 leak

- **발견일**: 2026-05-07
- **심각도**: critical (개인정보 보호법 위반 + 사회공학 표면)
- **상태**: fixed (`9430711e`) — dead route 자체 삭제로 차단
- **재현**:
  1. broker A 로 로그인 (qa-broker-a@example.com / qa1234)
  2. `GET /api/companies/0f668a27-8792-417e-a7bf-94b6b0d234df/users?page=1&pageSize=10`
     ((주)더유 broker — broker A 와 무관 broker 회사, v4 형식 ID)
  3. 응답: 200, 직원 15명 list (이름/이메일/전화번호/권한 등급/사용자 ID)
- **현상 (수정 전)**:
  - `app/api/companies/[companyId]/users/route.ts` 가 `withTenant` 미적용. raw `db` + UUID v4 형식 검증만.
  - 미들웨어 인증 통과 시 누구든 다른 회사 사용자 list 응답 받음.
  - 시드된 cccc 시리즈 회사는 v4 미형식이라 우연히 검증 fail. v4 형식 회사(운영 환경 default)는 leak 가능.
- **확인점 (회귀 가드)**:
  - `withTenant({ allowedTypes: ['broker'] })` 적용 + `companyId` 가 자기 broker_company_profiles active 인지 검증.
  - `existsBrokerConnection(companyId)` 같은 가드로 다른 broker 회사 조회 시 403/404.
  - integration test: 'broker A 가 broker B 회사 ID 로 users list 호출 시 403/404'.

#### [EDGE-033] dispatch update-status / close / fields / assign-driver — 양방향 cross-tenant write

- **발견일**: 2026-05-07
- **심각도**: critical (운영 차단 + 데이터 정합성 + 양방향 시연)
- **상태**: fixed (`25b2d6bc`) — DispatchRepository TenantAware 상속 + 4 endpoint ownership 사전 가드 (옵션 4 hybrid). write leak (운영 차단) 차단 완료. read leak 의 raw db 잔여는 EDGE-041 로 분리 (호출처별 점진 격리).
- **재현**:
  1. broker A 로 로그인 후 broker B 의 dispatch ID (`4ac59399-cc04-420b-ac06-2b43522b9ced`) 추출
  2. `PATCH /api/broker/dispatches/4ac59399.../update-status` body `{ "brokerFlowStatus": "운송완료", "reason": "..." }` 호출
  3. 응답: 200, `brokerFlowStatus: "운송완료"` 강제 변경 + `brokerCompanyId: 22222222-bbbb-...` (broker B) 그대로
  4. 역방향: broker B 로그인 후 broker A 의 dispatch (`12384652-...`) 동일 호출 → 200 (양방향 leak)
  5. broker B 시점 list 호출 시 자기 dispatch 가 임의로 "운송완료" 로 보임
- **현상 (수정 전)**:
  - `app/api/broker/dispatches/[id]/close/route.ts`: `dispatchRepository.findFullById(dispatchId)` 호출 — `DispatchRepository` 가 `TenantAwareRepository` 미상속, raw `db` + 격리 없음.
  - `server/dispatch/infrastructure/dispatch.repository.ts`: `findById`, `findByOrderId`, `close`, `exists` 모두 broker 격리 누락 (baseline 명시: `dispatch.repository.ts::orderDispatches`).
  - update-status command service 도 ownership 검증 누락 → cross-tenant write 200.
  - close: 차주 미배정 도메인 검증으로 우연히 400 (차주 배정된 dispatch 면 close 가능 + 정산 강제 생성).
  - fields/assign-driver: schema 검증으로 우연히 400 (적절한 body 우회 시 격리 없음).
- **확인점 (회귀 가드)**:
  - `DispatchRepository` 를 `TenantAwareRepository` 상속 + `eq(orderDispatches.brokerCompanyId, this.brokerId)` WHERE 강제.
  - 4개 endpoint (update-status / close / fields / assign-driver) 모두 dispatch ownership 사전 가드.
  - integration test 4건: 'broker A 가 broker B 의 dispatch ID 로 PATCH 시 404'.
  - 1차 EDGE-027 의 read 격리 패턴(`dispatchesTenantJoinCondition`)을 write 경로에도 동일 정책 적용.

#### [EDGE-034] sales-bundle detail / adjustments / order-list — M:N 화주 cross-broker leak

- **발견일**: 2026-05-07
- **심각도**: critical (정산/계좌/담당자 정보 cross-broker 노출, 회계 분쟁 표면)
- **상태**: fixed (`19a55f7c`) — 옵션 B+ii (items 경유 ownership) 헬퍼 모듈 추출 후 4 repository (detail/order-list/adjustment/list) 일관 적용. integration test 9건 회귀 가드. baseline 의 sales-bundle 3 항목은 정적 분석 helper follow-through 다단계 인식 한계로 그대로 유지 (실제 leak 차단은 코드 + integration test 가 보장).
- **재현**:
  1. 시뮬 시드: 화주 C(broker A·B 양쪽 active 관계) 명의 sales_bundle 1건 직접 INSERT
     - `id: cccc2201-...`, `companyId: 화주 C`, `totalAmount: 777,000`, `managerSnapshot: {name:'QA 주선사 A 담당', email:'qa-broker-a@example.com'}`
  2. broker A 시점: `GET /api/charge/sales-bundles/cccc2201-...` → 200 (정상)
  3. broker B 시점 (qa-broker-b@example.com): 같은 bundle ID 조회 → **200 + 모든 정보 leak**
  4. `/adjustments` → 200, `/order-list` → 200
- **현상 (수정 전)**:
  - `server/charge/sales-bundle/infrastructure/sales-bundle-detail.repository.ts:findByIdForBroker` 격리:
    ```ts
    inArray(salesBundles.companyId, allowedCompanyIds)  // broker A active profile 화주들
    ```
  - 화주 C 가 broker A·B 양쪽 active → 양쪽 모두 inArray 매칭 → 둘 다 동일 bundle 응답.
  - 노출: bundle.companyId / totalAmount / settlementMemo / managerSnapshot.email / bankCode·bankAccount(운영) / adjustments 전체.
  - 같은 패턴: `sales-bundle-adjustment.repository.ts`, `sales-bundle-order-list.repository.ts` (baseline 셋 다 명시).
- **확인점 (회귀 가드)**:
  - `sales_bundles` 테이블에 `broker_company_id` 컬럼 추가 + 모든 INSERT 시 stamp + WHERE 격리.
  - 또는 bundle items 경유 ownership 검증 (`SalesBundleOrderListRepository.findOwnedBundle` 처럼 — items 의 `orders.brokerCompanyId` 모두 self 인지).
  - detail / adjustments / order-list 셋 다 동일 ownership 검증 통일 (헬퍼 추출 권장 — `bundleOwnedByBroker(bundleId)`).
  - integration test: M:N 화주 시드 + 다른 broker 시점 detail 호출 시 404. baseline 에서 3개 sales-bundle 항목 제거 가능.

#### [EDGE-031] contacts API 화물 owner 격리 우회 (silent fallback)

- **발견일**: 2026-05-07
- **심각도**: medium
- **상태**: fixed (`bf12aaaf`) — 회귀 검증 (2026-05-07): broker B 직접 stamp 화물 ID (bbbb0001~3) 로 broker A 가 contacts 호출 시 모두 404 PASS. 단 EDGE-035 (broker B 가 broker A 의 공유화주 화물 contacts 200) follow-up 별도 등록.
- **재현**:
  - broker A 로 로그인
  - broker B 의 직접 stamp 화물 ID (`bbbb0001-0000-0000-0000-000000000001`) 로 `/api/orders/{id}/contacts` 호출
  - 응답: 200, `data: []`
- **현상**:
  - contacts API 가 화물 owner 검증 없이 reader 호출 → owner 매칭 안 되면 빈 배열로 silent fallback.
  - 비록 빈 배열이라 정보 leak 은 없으나, 격리 정책 자체는 우회됨.
  - EDGE-021 회귀 위험 — withTenant 적용은 됐지만 owner ID 검증 누락.
- **확인점**:
  - contacts API 에 화물 owner 검증 추가 → 다른 broker ID 입력 시 404 (현재 200).
  - 회귀 테스트: 'broker A 가 broker B 화물 ID 로 contacts 호출 시 404' 명시.

#### [EDGE-039] 거래처 silent reuse 분기 type 가드 누락 — broker 가 다른 broker 사업자번호 등록 시 모든 정보 leak

- **발견일**: 2026-05-07
- **심각도**: critical (경쟁 broker 의 사업자번호/은행계좌/대표명 leak — 송금사기 위험)
- **상태**: fixed (`25b2d6bc` 의 silent reuse 가드 부분) — `BrokerMasterReuseForbiddenError` 도메인 에러 + service 가드. 운영 환경 broker_company_profiles 미배포라 historical 정리 마이그레이션 불필요. 별도 layer 방어(`ne(type, 'broker')`)는 명분 약해 제외.
- **재현**:
  1. broker A 로그인 → POST `/api/companies` `{ businessNumber: '<broker B 사업자번호>', name: '...', type: 'shipper' (or 임의) }`
  2. `findMasterByBusinessNumber` 가 type=broker 인 마스터 (예: `QA 주선사 B`) 발견
  3. silent reuse 분기 → `connectBroker` 가 broker A 의 `broker_company_profiles` 에 broker B 마스터를 active 로 등록
  4. 이후 broker A 시점 `GET /api/companies` list 에 broker B 회사 7개 거래처 중 하나로 노출
  5. `GET /api/companies/{brokerB_id}` → 200 + 모든 필드 응답: 사업자번호, 대표명, 연락처, **bankCode/bankAccountNumber/bankAccountHolder**
- **현상**:
  - broker A 시점 거래처 list 에서 다른 broker 회사 정보 직접 노출.
  - 응답 type 별 분포: `{ shipper: 5, broker: 1, carrier: 1 }` — broker/carrier 마스터도 거래처로 취급.
  - 비대칭: broker B 시점에서 broker A 회사 detail 호출은 404 (격리 동작).
- **원인**:
  - `server/company/application/commands/company-command.service.ts:117-135` createCompany silent reuse 분기:
    ```ts
    if (existingMaster) {
      const alreadyConnected = await this.companyRepository.existsBrokerConnection(existingMaster.id);
      if (alreadyConnected) throw new DuplicateBusinessNumberError(...);
      await this.companyRepository.connectBroker(existingMaster.id);  // ← 여기서 type 가드 없음
      ...
      return toCompanyResponse(existingMaster);  // ← 마스터 모든 필드 응답
    }
    ```
  - silent reuse 가 type=broker / type=carrier 마스터에도 무차별 connectBroker 적용.
- **확인점 (Fix 방향)**:
  - silent reuse 분기에서 `existingMaster.type` 이 `'broker'` 또는 `'carrier'` 인 경우 거부 (별도 도메인 에러: `BrokerMasterReuseForbiddenError` 등).
  - 거래처 list (`findMany`) 에 type 필터 강제 — 거래처는 `type IN ('shipper', 'carrier')` 만, broker 회사는 절대 거래처로 노출 금지.
  - 회귀 테스트:
    - `[broker A 시점] GET /api/companies → 응답에 type='broker' row 0건 보장`
    - `silent reuse 시도 with broker 사업자번호 → 명시적 에러 (현재는 200 + leak)`
  - 운영 DB 정리 마이그레이션: `broker_company_profiles WHERE companies.type IN ('broker') 인 active 관계 deactivate`.

#### [EDGE-040] broker B 시점 /api/companies + /api/addresses GET 500 — 거래처/주소록 페이지 사용 불가

- **발견일**: 2026-05-07
- **심각도**: critical (broker 사용 시작 차단)
- **상태**: fixed — 2026-05-07 재현 검증 시 두 API 모두 200 (broker B 로그인 + /api/companies + /api/addresses 페이지=1&pageSize=50). 다른 세션의 EDGE-034/039 fix 흐름 또는 데이터 변경으로 자동 해소. 회귀 가드 통합 테스트 4건 추가 (`tenant-isolation.integration.test.ts:Repository list — broker 컨텍스트 안전 응답 (EDGE-040)`): broker B 시점 + 빈 profile broker 시점 모두 throw 없이 200/빈 응답 보장.
- **재현**:
  1. broker B (qa-broker-b@example.com) 로 로그인
  2. `GET /api/companies?page=1&limit=100` → **500**
  3. `GET /api/addresses?page=1&limit=100` → **500**
- **현상**:
  - broker A 시점에서는 200, broker B 시점에서만 500. 비대칭 격리 회귀.
  - broker B 의 `/broker/company/list`, `/broker/address` 페이지 진입 자체가 깨짐.
- **원인 추정**:
  - broker B 의 broker_company_profiles 가 비어있거나 일부 NULL 컬럼 → repository 의 INNER JOIN 또는 응답 mapper 에서 unhandled exception throw 가설.
  - 실제 원인은 stack trace + Sentry 확인 필요.
- **확인점 (Fix 방향)**:
  - dev 서버 재기동 후 stack trace 또는 Sentry trace ID 확인하여 정확한 throw 지점 찾기.
  - companies/addresses repository 의 격리 분기에서 NULL guard / 빈 result 처리 보강.
  - 회귀 테스트: 데이터 0 건 broker (신규 가입 직후) 도 200 빈 페이지 응답 보장.

#### [EDGE-041] cross-tenant 화물 detail GET 시 500 (404 가 정상)

- **발견일**: 2026-05-07
- **심각도**: high (시스템 신뢰성 / Sentry 노이즈)
- **상태**: fixed — 재현 검증 시 정상 흐름 동작. `OrderDetailQueryService.getOrderDetail` 가 `findDetailWithDispatch` 결과 null 시 `orElseThrow` 로 `OrderNotFoundError` throw → withErrorHandler 가 404 매핑. EDGE-029/035 의 ordersTenantWhere() broker_company_id mismatch 분기로 cross-tenant 차단 자동 처리. 보고된 500 은 fix 적용 전 또는 mapping 단계 다른 throw 추정. 회귀 가드 integration test 2건 (`tenant-isolation.integration.test.ts:Sub-route cross-broker — M:N 화주 시점 (EDGE-035)` 안 EDGE-041 케이스): broker B 가 broker A 직접 stamp 화물 ID + 임의 UUID 로 detail 호출 시 OrderNotFoundError.
- **재현**:
  1. broker B 로그인
  2. broker A 의 화물 ID 로 `GET /api/orders/{aaaa0002-...}` → **500** (404 expected)
  3. 같은 ID 의 contacts/change-logs 는 404 정상.
- **현상**:
  - 다른 broker 화물 ID (또는 임의 UUID) 로 detail 호출 시 unhandled exception → 500.
  - URL 공유 / 추측 / 수동 입력 시나리오에서 자주 발생할 패턴.
- **원인 추정**:
  - `OrderQueryRepository.findFullById` 또는 그 이후 mapping 단계에서 격리 분기 row 0 결과를 NotFoundError throw 로 처리 안 하고 다음 mapping 에서 NULL 참조 throw.
- **확인점 (Fix 방향)**:
  - `findFullById` 가 row 0 일 때 `OrderNotFoundError` 명시적 throw → withErrorHandler 가 404 매핑.
  - 회귀 테스트: 다른 broker 화물 ID 또는 존재하지 않는 UUID 로 detail 호출 시 404 응답.

#### [EDGE-035] broker B 가 broker A 의 공유화주 화물 contacts/change-logs 200 (EDGE-031 follow-up)

- **발견일**: 2026-05-07
- **심각도**: high (M:N 시나리오에서 운임/메모 변경 이력 + 상하차 담당자 연락처 leak)
- **상태**: fixed (이미 EDGE-029 `5a35ea63` + EDGE-031 `bf12aaaf` 의 부수 효과로 차단됨) — 회귀 가드 추가. `ordersTenantWhere()` 의 `isNull(brokerCompanyId)` 분기가 직접 stamp 화물에 대한 cross-broker 매칭을 자동 차단. QA 시점의 200 응답 관찰은 fix 적용 전 또는 broadcast 화물 케이스로 추정. integration test 3건 회귀 가드 (`tenant-isolation.integration.test.ts:Sub-route cross-broker — M:N 화주 시점 (EDGE-035)`).
- **재현**:
  1. 시나리오: 공유화주 C 가 broker A 에게 발주한 화물 (orders.brokerCompanyId = broker A, orders.companyId = 공유화주 C). broker B 도 공유화주 C 와 active 관계.
  2. broker B 로그인 → `GET /api/orders/{화물ID}/contacts` → **200**
  3. `GET /api/orders/{화물ID}/change-logs?page=1&limit=20` → **200**
- **현상**:
  - broker B 시점 list (`/api/orders/with-dispatch`) 에서는 이 화물 안 보임 (brokerCompanyId mismatch + broadcast 아님).
  - 그러나 sub-route 직접 호출 시 owner 검증이 EXISTS 분기 (`ordersTenantWhere()`) 통과 → 200.
- **원인 추정**:
  - contacts / change-logs API 가 화물 owner 검증을 list 격리 (`brokerCompanyId match OR active profile EXISTS`) 와 동일 사용.
  - 직접 stamp 화물에 대해서는 brokerCompanyId 정확 매칭만 사용해야 함 — broadcast (brokerCompanyId IS NULL) 만 EXISTS 분기 허용.
- **확인점 (Fix 방향)**:
  - sub-route 들의 owner 검증을:
    ```
    if (orders.brokerCompanyId IS NULL) → EXISTS 분기 (broadcast 가시성)
    else → orders.brokerCompanyId === self 만 (직접 stamp 격리)
    ```
  - 회귀 테스트: 공유 화주가 broker A 에게 stamp 한 화물 ID 로 broker B 가 contacts/change-logs 호출 → 404.

#### [EDGE-036] /api/charge/purchase-bundles/{id} endpoint 부재 (Next.js 404 HTML)

- **발견일**: 2026-05-07
- **심각도**: medium (운영 흐름 깨짐 가능성)
- **상태**: fixed (alias 추가) — 분석 결과 endpoint 부재 X, **명명 비대칭** 이 본질. 매입 detail 은 단수형 path `/api/charge/purchase/bundle/{id}` 에 존재 (frontend 가 그쪽 호출). 매출은 복수형 `/api/charge/sales-bundles/{id}` 사용. 매출 패턴으로 직접 호출하는 코드/검증 흐름은 Next 404 로 떨어지던 차이를 alias `/api/charge/purchase-bundles/[id]/route.ts` 로 해소 (단수형 service 재사용, frontend 변경 0). 추후 단수형 path deprecation 결정 시 단계적 이전 가능.
- **재현 (수정 전)**:
  - `GET /api/charge/purchase-bundles/{any-id}` → Next.js HTML 404
  - `GET /api/charge/sales-bundles/{id}` 는 정상 JSON 404 응답 (`매출 통합 정산을 찾을 수 없습니다.`)
- **확인점 (회귀 가드)**:
  - 매출/매입 detail endpoint path 통일 정책 결정 필요 시 단수형 (`purchase/bundle`) → 복수형 (`purchase-bundles`) 일괄 이전 + frontend 호출처 6+ 변경.
  - 두 path 모두 같은 service 호출 — 추후 한쪽이 deprecate 되어도 동작 동일.

#### [EDGE-037] /api/orders/recent broker 진입 시 companyId 강제 → 거래처 미선택 시 400

- **발견일**: 2026-05-07
- **심각도**: medium
- **상태**: fixed — 정책: broker 시점은 거래처 선택값 필수 (옵션 B), shipper 시점은 자기 회사 자동 사용. validation 단에서 모든 user-type 에 강제하던 패턴 → optional 로 풀고 service 단에서 user-type 별 분기 강제 (broker missing 시 `BrokerCompanyIdRequiredError` 명시 throw, shipper 인자 무시). frontend `useRecentCargos` 가 이미 valid companyId 일 때만 fetch — 사용자 직접 영향 0. unit test 4건 회귀 가드.

#### [EDGE-038] companies list 응답에 사업자번호 비표준 형식 (데이터 결함)

- **발견일**: 2026-05-07
- **심각도**: low (UI 표시 깨짐 / 데이터 정제)
- **상태**: fixed (`284b4796`) — `BusinessNumber.formatted()` 입력 형식별 분기 추가 (표준 hyphen / 정규화 / invalid). reconstitute(value) 의 DB raw 신뢰 invariant 보존. unit test 4건 + broker A `/api/companies` 응답 7건 정상 형식 검증. 운영 DB business_number 정규화 마이그레이션은 별도 ticket.
- **재현**:
  - broker A 시점 `GET /api/companies` 응답:
    - `703--8-1-33333` (시드 정상값 `703-81-33333`)
    - `705--8-1-55555` (시드 정상값 `705-81-55555`)
- **현상**:
  - 정상은 `703-81-33333` (3-2-5 형식) 또는 `7038133333` (정규화). 응답에 `703--8-1-33333` (2 hyphen + 1-1-5) 비표준 형식 노출.
  - EDGE-028 의 `businessNumberMatches()` 가 정규화 + formatted 양쪽 OR 비교 적용 후에도 historical row 들의 raw 값이 비표준일 수 있음.
- **확인점**:
  - 거래처 등록/수정 시 `BusinessNumber.create().value` (정규화) 강제 저장 검증.
  - 운영 DB 마이그레이션: `companies.business_number` 모두 정규화 또는 `formatted()` 표준화.
  - 회귀 테스트: list response 의 모든 businessNumber 값이 정규식 `/^\d{10}$|^\d{3}-\d{2}-\d{5}$/` 매칭.

#### [EDGE-041] DispatchRepository read leak — raw db 잔여 (EDGE-033 옵션 4 hybrid 의 분리 영역)

- **발견일**: 2026-05-07
- **심각도**: medium (read leak — 정보 노출. 운영 차단은 EDGE-033 의 write 격리로 차단됨)
- **상태**: open
- **배경**:
  - EDGE-033 fix 진행 시 read+write 모두 격리(옵션 1) 적용했더니 통합 테스트 152건 회귀 (settlement/order/admin 등 다양한 호출처에서 broker context 보장 안 됨). DispatchRepository 가 19개 파일에서 사용 중이라 일괄 격리 시 영향 광범위.
  - 옵션 4 hybrid 채택 — write 메서드만 broker 격리 강제 + 4 broker write endpoint 의 service 가 `findOwnFullById` (ownership 강제 read) 사용. 그 외 read raw 메서드 (`exists`, `findById`, `findByOrderId`, `findFullById`) 는 `// tenant-isolation:safe (EDGE-035)` 주석으로 의도된 우회 표시.
- **재현**:
  - broker A 로 로그인 후 broker B 의 dispatch ID 로 `DispatchRepository.findById/findByOrderId/findFullById/exists` 호출 (직접 service 또는 admin 흐름) → broker B 의 dispatch 정보(brokerCompanyId, snapshot, 운임, 차주 정보) read 가능.
  - 단 4 broker write endpoint (close/update-status/fields/assign-driver) 는 EDGE-033 fix 로 차단됨.
- **현상**:
  - read 메서드가 raw `db` + dispatchId 단일 매칭만 → 다른 broker dispatch row 그대로 read.
  - 서비스 flow 가 그 read 결과를 응답에 담으면 cross-tenant 정보 leak.
  - 4 broker write endpoint 외의 흐름 (settlement service, 정산 export, admin) 에서 동일 leak 잠재.
- **확인점 (Fix 방향 — 점진 격리)**:
  1. 호출처별 broker context 보장 검증 (DispatchRepository 사용처 19개 분석)
  2. broker context 보장된 호출처 → `findOwnFullById` 같은 ownership 강제 메서드로 전환
  3. shipper context 또는 system 트랜잭션 흐름 → 별도 메서드 (`findByIdForSystem` 등) 또는 service 단계 검증
  4. 단계별로 baseline 13 → 더 줄여 read leak 잔여 0 달성
  5. 점진 fix 시 통합 테스트 회귀 검증 필수 (옵션 1 회귀 패턴 재발 방지)
- **참고**: EDGE-033 commit (`25b2d6bc`) 의 `[남은 작업 — EDGE-035 로 분리]` 섹션이 본 항목을 가리킴 (EDGE-035 가 다른 follow-up 으로 선점되어 EDGE-041 로 재할당).

#### [EDGE-042] LMS POST cross-tenant 시드 + 발송 (CRITICAL)

- **발견일**: 2026-05-07 (멀티주선사 격리 sweep 2)
- **심각도**: critical (사칭 발송 + 송금사기 표면 + cross-broker 회계 분쟁)
- **상태**: fixed (`d636541a`) — `SendLmsCommandService.send()` 진입 시 `OrderQueryRepository.findById(orderId)` 사전 검증, 미보유 시 `OrderNotFoundError` throw → 404. 단위 테스트 `send-lms-command.service.test.ts:ownership 사전 검증 (EDGE-042)` 회귀 가드.
- **재현**:
  1. broker A (qa-broker-a@example.com) 로 로그인
  2. `POST /api/orders/6182e97d-6967-41b5-baf7-0a6caf38dcec/lms` (broker B stamp 화물 ID)
     body=`{ channel:'LMS', body:'cross-tenant 메시지', recipients:[{name:'테스트', phone:'01000000000', role:'driver'}] }`
  3. 응답: 200 + `{ messageId:'d3cc0fd9-...', status:'accepted' }`. DB의 `lms_messages` 테이블에 row INSERT 확인
  4. `POST /api/orders/aaaa0002-.../lms` ((주)더유 stamp 화물) 도 200 + INSERT 성공
- **현상 (수정 전)**:
  - `app/api/orders/[orderId]/lms/route.ts:43` POST handler 가 `withTenant + allowedTypes:['broker']` 만 적용. orderId ownership 검증 없음.
  - `SendLmsCommandService.send()` (`server/lms/application/commands/send-lms-command.service.ts:32`) 가 `lmsMessageRepository.create({ orderId, ... })` 그대로 INSERT + `smsGateway.send(...)` 발송.
  - subjectPrefix 가 broker A 회사명("QA 주선사 A") 으로 발송 → 다른 broker 화물의 차주/화주 phone 으로 사칭 SMS.
  - `lms_messages.order_id` 가 broker B 화물 ID 이므로 broker B 시점 LMS history 에 broker A 가 시드한 메시지 누적 → 책임 분쟁.
- **확인점 (Fix 방향)**:
  - `SendLmsCommandService.send()` 진입 시 `orderQueryRepository.findById(orderId)` (격리 분기) 로 ownership 사전 검증 → null 시 `OrderNotFoundError` throw.
  - `LmsHistoryQueryService.getByOrderId()` 도 동일 ownership 검증 (EDGE-046 와 함께 fix).
  - 회귀 테스트:
    - integration test: 'broker A 가 broker B 화물 ID 로 POST /api/orders/{id}/lms 시 404'
    - integration test: 'cross-tenant LMS POST 시 lms_messages INSERT 0'

#### [EDGE-043] accept-dispatches false success — 다른 broker 화물 ID 응답 200 (CRITICAL)

- **발견일**: 2026-05-07
- **심각도**: critical (운영 흐름 왜곡 + 일괄 처리 거짓 통계)
- **상태**: fixed (`d636541a`) — `AcceptDispatchCommandService.execute()` 진입 후 orderIds 모두 `OrderQueryRepository.findById` 사전 검증 (fail-fast). cross-tenant ID 1개라도 발견 시 즉시 `OrderNotFoundError` throw. mixed array 회귀 가드 + 통합 검증 통과.
- **재현**:
  1. broker A 로그인 후 `POST /api/orders/accept-dispatches`
     body=`{ orderIds:['6182e97d-...(broker B stamp)'], currentUser:{ id: userA } }`
  2. 응답: 200 + `{ updatedOrders:1, insertedDispatches:0 }`
  3. DB 검증: `orders.flow_status` 변동 없음, `orders.updated_by` 변동 없음, 신규 dispatch row 없음 — **실제 update 0**
  4. mixed array (broker B + 자기 broadcast) 시도 시 `{ updatedOrders:2, insertedDispatches:1 }` — 자기 broadcast 만 stamp 됐는데 카운트는 2.
- **현상 (수정 전)**:
  - `AcceptDispatchCommandService.execute()` (`server/dispatch/application/commands/accept-dispatch-command.service.ts:35`) 가 `for (orderId of orderIds) updateFlowStatus(orderId, ...)` 호출. `OrderRepository.updateFlowStatus` 가 broker scoped라 affected rows 0 (silent skip).
  - 그 다음 `dispatchRepository.acceptOrders({ orderIds, ... })` — broker scoped insert 이므로 cross-tenant order ID 에는 dispatch INSERT 안 됨.
  - 응답 카운트는 입력 orderIds.length 또는 별도 집계로 계산되어 실제 affected rows 와 무관.
  - 클라이언트 (브라우저, 외부 시스템, /qa 자동화) 가 success 로 판단 → "수락 완료" 토스트 + 후속 흐름 진행.
- **확인점 (Fix 방향)**:
  - `AcceptDispatchCommandService.execute()` 진입 시 ownership 사전 가드: `for (orderId of orderIds) await orderQueryRepository.findById(orderId).orElseThrow(OrderNotFoundError)`. 미보유 ID 1개라도 발견 시 즉시 throw.
  - 또는 mixed array 정책 결정: 부분 실패 응답 (성공 N, 실패 M, 실패 사유 each) — 단 single-failure-fast 권장.
  - 응답 카운트는 실제 affected rows 만 (입력 orderIds.length 사용 금지).
  - 회귀 테스트:
    - 'broker A 가 broker B 화물 ID 만 포함한 array 시 404'
    - 'mixed array 시 첫 cross-tenant ID 에서 즉시 OrderNotFoundError'
    - '응답 updatedOrders/insertedDispatches 가 실제 DB 변경량과 일치'

#### [EDGE-044] dispatch broker-mismatch row 강탈 — order.brokerCompanyId 이중 가드 누락 (CRITICAL)

- **발견일**: 2026-05-07
- **심각도**: critical (운영 차단 + 데이터 정합성 + 운영 DB race 가능)
- **상태**: fixed (`a3da19a5`) — close/update-status/fields/assign-driver 4 흐름 모두 dispatch ownership 검증 후 `OrderQueryRepository.findById(dispatchRow.orderId)` 정합성 이중 가드 추가. 단위 테스트 3건 회귀 가드. 운영 DB historical mismatch 정리는 `scripts/qa-tenant-dispatch-mismatch.mjs` 참조 (broker 협의 후 단계별 적용 권장).
- **데이터 결함**: `order_dispatches` 에 `dispatch.brokerCompanyId ≠ orders.brokerCompanyId` 인 mismatch row 존재 (시드 결함 + 운영 발생 가능 — 마이그레이션 실수, race condition, 과거 cross-tenant write 흔적). 시드 시점 검증 결과: `dispatch_id=e4cefe56, dispatch_broker=A, order_id=6182e97d, order_broker=B` 1건.
- **재현**:
  1. broker A 로그인 후 `PATCH /api/broker/dispatches/e4cefe56-764d-4d0c-b7a5-f0c3c8f21ea2/update-status` body=`{ brokerFlowStatus:'운송완료', reason:'강제 변경' }`
  2. 응답: 200 + `{ id:'e4cefe56', brokerFlowStatus:'운송완료', brokerCompanyId:'(brokerA)' }`
  3. DB 검증: `order_dispatches.broker_flow_status='운송완료'` 변경 성공. `orders.flow_status='배차대기'` 그대로 (broker mismatch 화물) — order vs dispatch 정합성 파괴
- **현상**:
  - EDGE-033 fix 가 `dispatch.broker_company_id == self` 만 체크 → mismatch row 에서 dispatch 가 broker A 의 것이라 통과. 화물은 broker B 의 것인데 dispatch update 진행.
  - close/update-status/fields/assign-driver 4 endpoint 모두 동일 패턴 잠재.
- **확인점 (Fix 방향)**:
  1. service 단계에서 dispatch ownership 외에 `order.brokerCompanyId === self` 도 검증 (이중 가드 — defense in depth):
     ```ts
     const dispatch = await dispatchRepository.findOwnFullById(dispatchId);
     const order = await orderQueryRepository.findById(dispatch.orderId); // ordersTenantWhere() 분기
     if (!order) throw new OrderNotFoundError(dispatch.orderId);
     ```
  2. 운영 DB 정리 마이그레이션:
     ```sql
     SELECT od.id, od.broker_company_id AS d_broker, od.order_id, o.broker_company_id AS o_broker
     FROM order_dispatches od JOIN orders o ON o.id = od.order_id
     WHERE od.broker_company_id != o.broker_company_id;
     ```
     mismatch row 별 정합성 복원 결정 (어느 broker 가 정답인지).
  3. DB 트리거 또는 unique 제약: `(orders.broker_company_id NOT NULL) → (dispatch.broker_company_id == orders.broker_company_id)` 강제.
  4. 회귀 테스트: mismatch row 시드 + 한쪽 broker 가 dispatch update-status 시 OrderNotFoundError.

#### [EDGE-045] EDGE-039 시드 회귀 — 거래처 list 에 type=broker 마스터 노출 + bank/사업자번호 detail leak (CRITICAL)

- **발견일**: 2026-05-07
- **심각도**: critical (다른 broker 사업자번호 + 은행 계좌 + 대표명 leak — 송금사기 표면)
- **상태**: fixed (`1415e965`) — `DrizzleCompanyRepository.findById/findMany/findByBusinessNumber` 에 `ne(companies.type, 'broker')` defensive layer 추가. 시드 환경 cleanup 적용 (`scripts/qa-tenant-broker-master-cleanup.mjs --apply` — type=broker 1건 deactivate). 통합 검증: list 응답 `{shipper:5, carrier:1}` type=broker 0건. detail/change-logs 모두 404. ⚠ type=carrier 는 정상 거래처 — strict 차단 금지.
- **재현**:
  1. broker A (qa-broker-a@example.com) 로 로그인
  2. `GET /api/companies?page=1&pageSize=50` → 응답에 `{id:'9f66663f-...', name:'QA 주선사 B (신규)', type:'broker'}` row 노출
  3. `GET /api/companies/9f66663f-9a87-4399-b277-5a02b4760ebd` → 200 + `{ businessNumber:'111-22-33333', ceoName:'QA B 대표', bankCode:'004', bankAccountNumber:'123-4567-89012', bankAccountHolder:'QA 주선사 B' }`
  4. `GET /api/companies/9f66663f-.../change-logs` → 200 + 변경이력 row leak (EDGE-050 동시 발견)
- **데이터 결함**: `broker_company_profiles` 에 `type=broker/carrier` 마스터 active row 존재 (EDGE-039 fix 이전 silent reuse 로 등록된 시드 잔여):
  ```
  broker A profile:
    - 581bd3b4 (A-2화주, type='carrier') active
    - 9f66663f (QA 주선사 B 신규, type='broker') active
  ```
- **현상**:
  - EDGE-039 fix 의 회귀 가드는 'broker A 시점 list 응답에 type=broker row 0건' 인데 시드 환경에서 검증 안 됨.
  - 운영 DB 에서도 fix 이전 silent reuse 흐름으로 등록된 historical row 가 active 로 살아있을 가능성.
  - 거래처 detail GET 가 type 필터 없이 마스터 정보 전체 응답 → bankAccount/businessNumber/ceoName leak.
- **확인점 (Fix 방향)**:
  1. 시드 정리: `qa-seed.ts` 에서 `broker_company_profiles` insert 시 type=broker/carrier 거부 + 기존 시드 row 삭제.
  2. 운영 DB 마이그레이션:
     ```sql
     UPDATE broker_company_profiles bcp
     SET status = 'inactive'
     FROM companies c
     WHERE bcp.company_id = c.id AND c.type = 'broker';
     ```
  3. Repository defensive layer: `findMany` / `findById` 에 `WHERE companies.type IN ('shipper','carrier')` 명시. carrier 도 거래처라 type=broker 만 strict 차단.
  4. EDGE-039 회귀 가드 integration test 를 시드 환경에서 즉시 실행하도록 CI 강제 (시드된 leak row 발견 시 fail).

#### [EDGE-046] LMS GET silent fallback — cross-tenant 200 + 빈 배열 (HIGH)

- **발견일**: 2026-05-07
- **심각도**: high (격리 정책 우회, EDGE-031 follow-up)
- **상태**: fixed (`d636541a`) — `LmsHistoryQueryService.getByOrderId()` 진입 시 `OrderQueryRepository.findById` 사전 검증. silent fallback 차단. 단위 테스트 회귀 가드.
- **재현**:
  1. broker A 로그인 후 `GET /api/orders/6182e97d-.../lms` (broker B stamp 화물) → 200 + `{ data:[] }`
  2. `GET /api/orders/00000000-1111-2222-3333-deadbeefdead/lms` (비존재 화물) → 200 + 빈 배열 동일
- **현상**:
  - `LmsHistoryQueryService.getByOrderId(orderId)` 가 화물 ownership 검증 없이 `lms_messages WHERE order_id = X` 만 조회 → 응답 빈 배열 silent fallback.
  - 정보 leak 은 없으나 격리 정책 자체 우회. EDGE-021 / EDGE-031 와 동일 패턴.
- **확인점**: LmsHistoryQueryService 에 `OrderQueryRepository.findById(orderId).orElseThrow(OrderNotFoundError)` 사전 검증.

#### [EDGE-047] logishm proposals GET silent fallback (HIGH)

- **발견일**: 2026-05-07
- **심각도**: high (격리 정책 우회)
- **상태**: fixed (`d636541a`) — `ProposalQueryService.getByOrderId()` 에 ownership 사전 검증. EDGE-046 와 동일 패턴. 단위 테스트 회귀 가드.
- **재현**: `GET /api/orders/{any-or-cross-tenant-id}/logishm/proposals` → 200 + `{ data:[] }`
- **현상**: `ProposalQueryService.getByOrderId(orderId)` 가 ownership 검증 없이 silent fallback. EDGE-046 와 동일 패턴.
- **확인점**: ProposalQueryService 에 화물 ownership 사전 검증 추가.

#### [EDGE-048] /api/orders/batch updateStatus 500 — cross-tenant 화물 ID 시 unhandled exception (HIGH)

- **발견일**: 2026-05-07
- **심각도**: high (Sentry 노이즈 + 운영 신뢰성 + EDGE-041 패턴)
- **상태**: fixed (`d636541a`) — 재분석 결과 cross-tenant 격리는 `OrderBatchCommandService.execute()` 의 `findOwnedByIds` 로 이미 차단 (404 정상). 500 응답은 `action='updateStatus' + flowStatus undefined` 케이스에서 generic Error throw 가 원인. `batchActionSchema` 에 `.refine` 추가 — `action='updateStatus'` 시 `flowStatus` required 강제 → 400 schema validation. 통합 검증 OK.
- **재현**:
  1. broker A 로그인 후 `POST /api/orders/batch` body=`{ action:'updateStatus', orderIds:['6182e97d-...(broker B)'], status:'운송완료' }`
  2. 응답: 500 + `{ error:'서버 내부 오류가 발생했습니다.' }` (404 가 정상)
- **현상**:
  - batch service 가 cross-tenant orderId 발견 시 `findById` row 0 → 후속 mapping 단계에서 NULL 참조 throw.
  - EDGE-041 (DispatchRepository read leak) 패턴과 유사 — null guard 누락.
- **확인점**: batch service 가 input orderIds 중 미보유 ID 발견 시 `OrderNotFoundError` 명시 throw → withErrorHandler 가 404 매핑. 모든 action(cancel/delete/updateStatus) 에 동일 가드.

#### [EDGE-049] 화물맨 inbound webhook 인증 누락 (HIGH)

- **발견일**: 2026-05-07
- **심각도**: high (외부 인증 우회 — multi-broker 격리 외 보안 이슈)
- **상태**: fixed (재분석 결과 운영 환경은 이미 IP whitelist 작동) — `common/http/inbound-handler.ts:39-69`
- **재현**:
  1. 인증 cookies 없이 `POST /api/integrations/logishm/inbound/dispatch-request` body=`{ ordernum:'fake-test-1', driverPhone:'01099999999' }`
  2. 응답: 200 + `{ code:400, msg:'필수 필드 누락: ORDERCODE, CWNAME, ...' }`
  3. dispatch-cancel 도 동일 — 인증 없이 200 응답. 필수 필드 검증만.
- **분석 결과**:
  - `withInboundHandler` 가 production 환경에서 IP whitelist 검증 + 미허용 IP 시 `{ code:403, msg:'허용되지 않은 IP입니다.' }` 응답 (line 56-69, 105-120).
  - QA 시점은 `NODE_ENV === 'development'` 분기로 IP 검증 스킵 → 우회 관찰. 의도된 dev 편의 — production 영향 없음.
  - `LOGISHM_ALLOWED_IPS` env + 하드코딩된 화물맨 IP (`59.13.193.200`, `222.231.9.247-248`, `59.13.192.199` 테스트, `222.231.9.212` 라이브) 운영 적용.
- **추가 보강 옵션 (별도 ticket — 보안 영역, 화물맨 협의 필요)**:
  - HMAC signature 검증 (`X-Signature` 헤더 + body HMAC) — IP 도용 시나리오 방어 layer.
  - dev 환경 우회를 `LOGISHM_INBOUND_IP_CHECK_DISABLE=true` env 강제로 명시화 — preview/staging 환경 누수 방지.
  - 화물맨과 secret 협의 필요 — 즉시 적용 가능한 단순 fix 아님.

#### [EDGE-050] 다른 broker 마스터 변경이력 cross-broker GET (HIGH)

- **발견일**: 2026-05-07
- **심각도**: high (cross-broker 정보 leak)
- **상태**: fixed (`1415e965`) — `app/api/companies/[companyId]/change-logs/route.ts` 를 layered architecture 로 리팩토링: `withTenant({ allowedTypes: ['broker'] })` + `CompanyChangeLogRepository.isAccessibleByBroker(companyId)` (active broker_company_profiles + type ≠ broker 검증). 미보유 / type=broker 마스터 시 404. validation.ts 분리.
- **재현**: broker A 시점 `GET /api/companies/9f66663f-.../change-logs` → 200 + 변경이력 row leak (`{ changeType:'create', changedByName:'QA 주선사 A 담당' }`)
- **현상**: change-logs reader 가 broker_company_profiles active 검증만 사용 — EDGE-045 의 시드 회귀로 active 인 broker 마스터의 change-log 도 leak.
- **확인점**: EDGE-045 fix 와 함께 — type=broker 마스터는 broker_company_profiles 에서 strict exclude. change-logs reader 도 동일 정책 통일.

#### [EDGE-051] logishm cancel-ack error message oracle (MEDIUM)

- **발견일**: 2026-05-07
- **심각도**: medium (oracle attack — 화물 존재 여부 leak)
- **상태**: fixed (`d636541a`) — `CancelAckService.execute()` 가 share record 검증보다 먼저 화물 ownership 검증 (`OrderQueryRepository.findById`). 미보유 시 "주문을 찾을 수 없습니다" 통일 메시지 → 격리 메시지 일관. 단위 테스트 회귀 가드.
- **재현**:
  - `POST /api/orders/{비존재 ID}/logishm/cancel-ack` → 400 "공유 상태를 찾을 수 없습니다"
  - `POST /api/orders/{cross-tenant ID}/logishm/cancel-ack` → 400 동일 메시지
  - share record 가 있는 화물만 다른 응답 → oracle attack 표면
- **현상**: `CancelAckService.execute()` 가 `LogishmShareStatusRepository.findByOrderId(orderId)` 결과 null 시 throw — 화물 ownership 검증 없이 share record lookup.
- **확인점**: 화물 ownership 우선 검증 → 미보유 시 "주문을 찾을 수 없습니다" (격리 메시지 통일). share record 검증은 그 다음 단계.

#### [EDGE-052] dispatch sales-summary cross-tenant 운임/세금 leak (CRITICAL)

- **발견일**: 2026-05-07 (sweep 3)
- **심각도**: critical (다른 broker 화물의 운임/세금/financial snapshot leak)
- **상태**: fixed — `ChargeSummaryRepository` 가 `TenantAwareRepository` 상속 + `findDispatchWithOrder` 가 `eq(orderDispatches.brokerCompanyId, this.brokerId)` WHERE 강제. `ChargeSummaryQueryService.execute()` 에 dispatch.orderId 의 `OrderQueryRepository.findById` 정합성 이중 가드 (EDGE-044 패턴) — mismatch row 차단.
- **재현 (이전)**:
  1. broker A 로그인 후 mismatch dispatch (`e4cefe56`, broker A stamp + broker B order) 의 sales-summary 호출
  2. 응답: 200 + `{ orderId:'<broker B 화물>', subtotalAmount:370000, taxAmount:37000, financialSnapshot: [...] }` — broker B 화물의 운임/세금 leak
  3. pure cross-tenant (broker C dispatch `8218268a`) 도 dispatch 격리 통과 → 운임 그룹 있으면 leak (운임 그룹 없는 경우 우연히 400)
- **확인점 (회귀 가드)**:
  - integration test: `[broker A] dispatch (broker C stamp) sales-summary → 404`
  - integration test: `[broker A] mismatch dispatch sales-summary → 404` (order ownership 차단)

#### [EDGE-053] dispatch purchase-summary cross-tenant 동일 패턴 (CRITICAL)

- **발견일**: 2026-05-07 (sweep 3)
- **심각도**: critical (EDGE-052 와 동일 — 매입 운임 leak)
- **상태**: fixed — EDGE-052 와 같은 fix (ChargeSummaryRepository broker 격리 + ChargeSummaryQueryService order 이중 가드).

#### [EDGE-054] dispatch sales-status route 인증 자체 우회 (CATASTROPHIC)

- **발견일**: 2026-05-07 (sweep 3)
- **심각도**: catastrophic (인증 검증 0 — 외부 인터넷 노출 시 dispatch ID brute-force 로 정산 진행 상태 leak)
- **상태**: fixed — route.ts 전체 재작성. `withTenant({ allowedTypes:['broker'] })` 적용 + `ChargeSummaryQueryService.getDispatchSalesStatus(dispatchId)` 신규 메서드 사용 (dispatch broker 격리 + order 이중 가드 + orderSales lookup).
- **재현 (이전)**:
  - `app/api/broker/dispatches/[id]/sales-status/route.ts` 가:
    - `withTenant` 미적용
    - raw `db.query.orderDispatches.findFirst(eq(id, dispatchId))` — broker_company_id 검증 0
    - `getServerSession + authOptions` (NextAuth) import — 본 프로젝트는 JWT cookie 사용. **getServerSession 호출도 안 함** → 인증 검증이 코드에 아예 없음
  - cookie 제거 (`credentials:'omit'`) → **200 + `{ hasSales, isClosed, salesId, salesStatus }` 응답**
  - 다른 broker dispatch ID 도 200 응답
- **임팩트**:
  - 외부 누구든 dispatch ID 알면 정산 진행 상태 (hasSales/salesId/status/isClosed) 조회 가능.
  - 운영 배포 시 인증 무관 leak — 보안 사고 + 운영 차단.
- **확인점 (회귀 가드)**:
  - integration test: `[no-auth] sales-status → 401 UNAUTHORIZED`
  - integration test: `[broker A] cross-tenant dispatch sales-status → 404`
  - integration test: `[broker A] mismatch row sales-status → 404`
  - 회귀 검증: `자기 dispatch sales-status → 200 + { hasSales, salesId, salesStatus, isClosed }` 정상 응답

#### [EDGE-055] companies batch DELETE processedCount false success (MEDIUM)

- **발견일**: 2026-05-07 (sweep 3)
- **심각도**: medium (UX false count — 클라이언트가 success 갯수로 오인 가능, EDGE-043 패턴 재현)
- **상태**: fixed — 응답에 `successCount`/`failCount` 분리 추가. `processedCount` 는 입력 갯수(시도 횟수) 의미로 유지 (frontend 호환). validation.ts 분리.
- **재현 (이전)**:
  - `POST /api/companies/batch` body=`{action:'delete', companyIds:[브로커C-master, 자기-A1화주]}`
  - 응답 207 + `{ processedCount: 2, results:[{success:false}, {success:true}] }` — `processedCount: 2` 가 입력 갯수 그대로. 실제 success 는 1 만.
- **현상**:
  - route.ts 의 `processedCount: companyIds.length` 가 입력 갯수 하드코딩.
  - results 배열 안에 success=false 가 있어도 카운트 영향 없음 → 클라이언트가 "2개 처리됨" 으로 오인 가능.
- **확인점 (회귀 가드)**:
  - 응답 shape: `{ data: { attempted, successCount, failCount, processedCount, action, results } }`
  - `successCount + failCount === attempted` 불변식.

---

### QA 세션 2026-05-07 (M:N 화주 cross-broker sweep — `1xxx` prefix = 본 세션 발견)

> 본 세션은 broker A (qa-broker-a) ↔ broker B (qa-broker-b) 양 시점 비교 검증. EDGE-027~051 의 회귀 가드 PASS 확인 후, 다음 4건 신규 발견.
> ID 표기 규약: `EDGE-1xxx` = 본 세션 신규 등록 (기존 EDGE-XXX 와 충돌 없이 명시적 구분).

#### [EDGE-1042] 거래처 list type=broker 마스터 노출 (EDGE-045 회귀 재확인)

- **발견일**: 2026-05-07 (QA 세션 2)
- **심각도**: critical (송금사기/위장계좌 + cross-tenant write 표면)
- **상태**: open — 기존 EDGE-045 와 동일 이슈로 추정. 본 세션 broker A 시점에서 잔존 historical row 재현 확인.
- **재현**:
  1. broker A (qa-broker-a@example.com / qa1234) 로그인
  2. `GET /api/companies?page=1&limit=100` → 200, total 7건
  3. 응답에 `type='broker'` 1건 (`9f66663f-9a87-4399-b277-5a02b4760ebd` "QA 주선사 B (신규)") + `type='carrier'` 1건 노출
  4. `GET /api/companies/9f66663f-...` → 200 + 사업자번호 (111-22-33333) + bankCode (004) + bankAccountNumber (123-4567-89012) + bankAccountHolder (QA 주선사 B) + ceoName (QA B 대표) + contact 정보 leak
  5. 비대칭: broker B 시점 동일 호출 → 응답 3건 모두 `type='shipper'` (정상). 즉 broker A 의 active profile 에만 잔존된 silent reuse historical row.
- **현상**:
  - 화주 picker UI 모달에도 broker 회사가 표시되어 잘못 선택 시 cross-tenant write 표면.
  - 기존 EDGE-045 가 "open" 상태 — silent reuse 가드(EDGE-039)는 신규 진입 시 차단되지만 **historical row + list query 의 type 필터 누락** 이 핵심 잔존 leak.
  - EDGE-039 fix (`25b2d6bc`) 의 운영 마이그레이션 미실행 가설.
- **확인점 (Fix 방향)**:
  - companies list query 의 broker_company_profiles JOIN 결과에 `companies.type IN ('shipper', 'carrier')` WHERE 강제 (broker 마스터 차단).
  - 운영 DB 정리 마이그레이션: `UPDATE broker_company_profiles SET status='archived' WHERE company_id IN (SELECT id FROM companies WHERE type='broker') AND status='active'`.
  - 회귀 테스트:
    - `[broker A 시점] GET /api/companies → 응답 type='broker' row 0건`
    - `[broker A 시점] GET /api/companies/{type=broker ID} → 404`

#### [EDGE-1043] 공유화주 주소록 broker간 미격리 — "화주 자산 모델" 의도된 사양

- **발견일**: 2026-05-07 (QA 세션 2)
- **심각도**: medium → **wontfix-by-design** (2026-05-08 정책 결정)
- **상태**: **wontfix-by-design** (의도된 사양)
- **결정 (2026-05-08)**: "화주 자산 모델" 채택 — 같은 화주가 broker A·B 양쪽 active 면 그 화주의 주소록은 양쪽 broker 모두 가시. broker A 가 등록한 주소도 broker B 시점에서 read 가능.
  - **장점**: 운영 효율 (같은 화주 화물 등록 시 picker 즉시 활용), 데이터 정합성 (한 화주 = 한 주소 마스터, broker별 row 분기 X), 신규 broker cold-start 완화, EDGE-027/029 "화물 broadcast" 사양과 일관성.
  - **인정한 trade-off**: 영업비밀(특수 상하차지 메모, 담당자 컨택) leak 가능성. broker A 가 발견한 진입 동선/시간대 정보, contact phone 이 broker B 에게도 노출.
  - **TMS 도메인 관행**: 화물맨/일반 TMS 시스템은 대부분 화주 자산 모델 — 운영 효율 > 영업비밀 가치 판단.
- **재현 (사양 확인)**:
  1. broker A 가 공유화주 C(`cccc0003-0000-0000-0000-000000000003`)에 주소 등록
  2. broker B 로 로그인 → `GET /api/addresses?page=1&limit=100`
  3. 응답에 broker A가 등록한 동일 주소 행 포함 — **의도된 동작**
- **회귀 가드** (사양 못 박기):
  - 코드 주석: `server/address/infrastructure/address.repository.ts:profileJoinCondition` 위에 EDGE-1043 사양 명시
  - integration test: `tests/integration/tenant-isolation.integration.test.ts:AddressRepository — 공유화주 주소록 화주 자산 모델 (EDGE-1043, 의도된 사양)` 3건
    - broker A 시점 자기 등록 주소 read
    - broker B 시점 같은 공유화주 주소 read (cross-broker read 가능 — 사양)
    - broker B 시점에서 broker A 주소 update — 화주 자산 모델 유지 (write 도 broker_company_profiles 통과 시 가능)
  - 다른 사람이 broker별 격리(createdByBroker 추가) 도입 시 본 테스트의 의도부터 뒤집어야 함.
- **격리 전환 시 변경 진입점** (정책 재논의 필요 시):
  - `addresses` 테이블에 `created_by_broker_company_id` 컬럼 추가 + INSERT stamp + 마이그레이션 (기존 row → createdBy.user.company_id 추적)
  - `AddressRepository.profileJoinCondition` 에 `eq(addresses.createdByBrokerCompanyId, this.brokerId)` 조건 추가
  - 회귀 가드 테스트 의도 뒤집기 + frontend picker UI 영향 평가
- **메모**: EDGE-027/EDGE-029 의 "M:N 화주 broadcast 시나리오"는 화물에 대해서는 명확히 노출 의도가 있고, 주소록도 동일 모델로 정합성 통일 (2026-05-08).

#### [EDGE-1044] purchase-bundle detail GET cross-tenant leak (EDGE-036 alias 회귀)

- **발견일**: 2026-05-07 (QA 세션 2)
- **심각도**: critical (차주 은행계좌 + broker 회사 ID + 차주 사업자번호 + 운임 노출)
- **상태**: open
- **재현**:
  1. broker B (qa-broker-b@example.com) 로 로그인
  2. `GET /api/charge/purchase-bundles/a250ebc9-2727-4595-a6db-506e256e7fd2` (broker A bundle ID) → **200 leak**
  3. `GET /api/charge/purchase/bundle/a250ebc9-...` (frontend 가 실제 호출하는 단수형 path) → **200 leak** (양쪽 path 동일)
  4. 다른 bundle ID `4d7e0486-...`, `fb119e68-...` 도 모두 200 leak (단발 케이스 아님)
- **현상**:
  - 응답에 `driverSnapshot.bank.bankCode/bankAccount/bankAccountHolder` (차주0504, 004 / 123412-3412-34) 그대로 노출
  - `items[].orderPurchase.companyId = 11111111-aaaa-aaaa-aaaa-111111111111` (broker A 회사 ID 노출)
  - `createdBy = aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa` (broker A 사용자 ID 노출)
  - `totalAmount`, `orderId`, `bundleExtraAmount` 등 매입 운임/조정 그대로
  - **비대칭**: sales-bundle detail/order-list/adjustments 는 정상 404 (EDGE-034 fix `19a55f7c` 적용됨). PATCH/DELETE 도 정상 404 (write 격리 OK). **GET detail 만 leak**.
  - alias 의 `/order-list`, `/adjustments`, `/actions`, `/status` sub-route 는 미정의 (Next 404) — alias path 의 GET detail 만 leak 표면.
- **원인 추정**:
  - EDGE-036 fix 가 "alias path 추가 (단수형 service 재사용)" 자체에 집중 → alias 와 단수형이 같은 service 호출 → 단수형 service 가 ownership 검증 없이 raw db read 수행.
  - sales-bundle 옵션 B+ii (`bundleOwnedByBroker` 헬퍼) 가 매입에는 미적용.
- **확인점 (Fix 방향)**:
  - `server/charge/purchase-bundle/infrastructure/purchase-bundle-detail.repository.ts:findByIdForBroker` 에 ownership 검증 추가:
    - 옵션 A: `purchase_bundles.broker_company_id` 컬럼 추가 + INSERT stamp + WHERE 격리.
    - 옵션 B+ii: items 의 `order_purchases.companyId` 가 self 인지 검증 (sales-bundle 패턴 동일 적용).
  - 헬퍼 추출 추천: `purchaseBundleOwnedByBroker(bundleId)` — alias + 단수형 path 양쪽에서 호출.
  - 회귀 테스트:
    - `broker B 가 broker A 의 purchase bundle ID 로 GET /api/charge/purchase-bundles/{id} → 404`
    - `broker B 가 broker A 의 purchase bundle ID 로 GET /api/charge/purchase/bundle/{id} → 404`
    - sales-bundle 회귀 테스트와 동일 시나리오를 매입 양쪽 path 에 적용.

#### [EDGE-1045] /api/orders/recent silent fallback — companyId active 미검증

- **발견일**: 2026-05-07 (QA 세션 2)
- **심각도**: medium (oracle attack — active 화주 ID 정찰)
- **상태**: open
- **재현**:
  1. broker B 로 로그인
  2. `GET /api/orders/recent?companyId=cccc0001-0000-0000-0000-000000000001&limit=10` (broker A 의 화주 ID, broker B 와 active 아님)
  3. 응답: 200, `data: []` (403/404 가 아님)
  4. 비교: `companyId=cccc0003-...` (active) → 200 + 1건 (정상)
- **현상**:
  - `RecentCargoQueryService.execute` 가 broker 시점에서 `input.companyId` 의 active profile 등재 검증 없이 그대로 repository 호출 → 격리 분기로 0건 → silent 200 + 빈 배열.
  - EDGE-031 (contacts silent fallback) 와 동일 패턴, EDGE-046 (LMS GET silent fallback) 와도 같은 family.
- **확인점 (Fix 방향)**:
  - `RecentCargoQueryService.execute` 에 broker 시점 가드:
    ```ts
    if (!isShipper) {
      if (!input.companyId) throw new BrokerCompanyIdRequiredError();
      // 추가: companyId 가 self broker 의 active profile 등재인지 검증
      const ok = await brokerProfileRepository.isActive(brokerId, input.companyId);
      if (!ok) throw new BrokerCompanyProfileNotActiveError(input.companyId);
    }
    ```
  - 회귀 테스트:
    - `broker B 가 비-active 화주 ID 로 /api/orders/recent 호출 시 403/404`
    - `broker B 가 own active 화주 ID 로 호출 시 200 + 정상 list`
- **메모**: silent fallback family (EDGE-021/031/035/046/1045) — 모든 owner 검증 누락 endpoint 를 한 번에 sweep 하는 통합 가드 (e.g. middleware 레벨 ownership pre-check) 도입 검토 가치 있음.

---

### QA 세션 2026-05-07 (FB-QA — 변경이력/세금계산서/검색/세션 영역, `2xxx` prefix = 본 세션 발견)

> 본 세션은 페이스북 QA 시각으로 이전 세션이 다루지 않은 영역(변경이력/세금계산서/검색autocomplete/세션전환/profile 상태전이/excel export) 집중 검증.
> 회귀 PASS: EDGE-1042 (1415e965 fix 후 broker A 시점 거래처 list 7→6 type=broker 제외), EDGE-029/030/031/032/033/034/035/039/040/041/042/043/044/045/050/1044 모두 cross-broker 차단 정상.
> ID 표기 규약: `EDGE-2xxx` = 본 세션 신규 등록.

#### [EDGE-2046] 세금계산서 histories cross-broker GET leak — bundle ownership 검증 누락 (CRITICAL)

- **발견일**: 2026-05-07 (FB-QA 세션)
- **심각도**: critical (popbill mgtKey + 발행 메타 leak — 외부 popbill API 추가 정찰 표면)
- **상태**: open
- **재현**:
  1. broker B (qa-broker-b@example.com) 로 로그인
  2. `GET /api/charge/sales-bundles/1addce22-0ec5-4115-a386-8337349151db/taxinvoice/histories` (broker A bundle ID) → **200 leak**
  3. 다른 broker A bundle ID (`10469794-...`, `b2fb0e2d-...`) 로도 모두 200 leak — 일관 패턴
  4. 응답에 `mgtKey: "TI-mol1c68r-xW4kfm"`, `createdBy: aaaaaaaa-...` (broker A user), `bundleType: 'sales'`, `invoiceType: 'sales_issue'`, `status: 'confirmed'`, 발행 시각 노출
  5. `purchase-bundles/{id}/taxinvoice/histories` 도 동일 패턴 (broker A 매입 bundle 은 history 0건이라 노출 데이터 없으나 endpoint 코드 같음 — fix 시 같이 처리)
- **현상 비대칭**:
  - sales/purchase bundle detail GET → 404 정상 차단 (EDGE-034/EDGE-1044 fix 적용됨)
  - sales/purchase bundle status GET → 400 차단 (`salesBundleTaxinvoiceService.getStatus` 가 service 단에서 ownership 검증)
  - sales/purchase bundle direct-issue/trustee-issue/issue-modified POST → 400 차단 (service 경유)
  - **histories GET 만** ownership 검증 누락 — `invoiceHistoryRepository.findByBundleId(id)` 가 raw 호출
- **원인**:
  - `app/api/charge/sales-bundles/[id]/taxinvoice/histories/route.ts` 와
    `app/api/charge/purchase-bundles/[id]/taxinvoice/histories/route.ts` 의 GET handler 가
    `invoiceHistoryRepository.findByBundleId(id)` 를 직접 호출. bundle ownership 검증 0.
  - `InvoiceHistoryRepository` (서버 popbill-taxinvoice) 가 broker 격리 미적용.
- **확인점 (Fix 방향)**:
  - 옵션 A: route handler 가 호출 전에 `SalesBundleDetailRepository.findByIdForBroker(id)` (또는 매입은 `PurchaseBundleDetailRepository.findDetailById(id)`) 으로 ownership 사전 검증 → null 시 404 (`매출 통합 정산을 찾을 수 없습니다.` / `매입 통합 정산을 찾을 수 없습니다.`).
  - 옵션 B: `InvoiceHistoryRepository.findByBundleId` 자체에 broker 격리 추가 — bundle ownership 검증 헬퍼 (`isBundleOwnedByBroker` / `isPurchaseBundleOwnedByBroker`) 호출 후 ownership 검증.
  - 회귀 가드: integration test —
    - `broker B 가 broker A 매출 bundle ID 로 GET /api/charge/sales-bundles/{id}/taxinvoice/histories → 404`
    - `broker B 가 broker A 매입 bundle ID 로 GET /api/charge/purchase-bundles/{id}/taxinvoice/histories → 404`
- **참고**: EDGE-034 sales / EDGE-1044 purchase bundle detail fix 완료 후에도 이 sub-route 만 별도로 leak 잔존. 같은 bundle 자원 group 안에 sub-route 별 격리 정책 일관성 회귀 가드 필요.

#### [EDGE-2047] sales/purchase bundles `/ids` endpoint — query parameter 무시 (LOW, 설계 오해 소지)

- **발견일**: 2026-05-07 (FB-QA 세션)
- **심각도**: low (격리 자체는 동작, endpoint 설계만 misleading)
- **상태**: **fixed** (2026-05-08) — schema `.strict()` 적용으로 unknown key 명시적 거부
- **재현 (이전)**:
  1. broker B 로그인 후 `GET /api/charge/sales-bundles/ids?ids=1addce22-...(broker A bundle ID)` → 200
  2. 응답: `{"ids":["da698b02-...","7654dd27-..."], "total":2}` — broker B 자기 sales bundle ID 들. broker A ID 무시.
  3. 매입 alias 도 동일 — `purchase-bundles/ids?ids=<broker A>` 가 broker B 자기 매입 bundle IDs 응답
- **현상**:
  - 격리는 정상 (cross-broker leak 없음).
  - 다만 `?ids=` query parameter 가 응답에 영향 없이 broker context 의 모든 bundle ID 를 반환. UI 또는 외부 사용자가 endpoint 의 의미를 잘못 이해할 수 있음.
- **결정 (2026-05-08)**: endpoint 의도 = "필터 조건에 맞는 모든 broker context bundle ID 반환 (엑셀 전체선택용)". path 명은 frontend 호출처 다수라 유지하고, schema `.strict()` 적용으로 misleading 차단.
- **Fix 적용**:
  - `app/api/charge/sales-bundles/validation.ts:salesBundleIdsQuerySchema` + `app/api/charge/purchase-bundles/validation.ts:purchaseBundleIdsQuerySchema` 에 `.strict()` 추가
  - unknown key (`?ids`, `?page`, etc.) → 400 "Unrecognized key(s) in object: ..."
  - 기존 frontend 호출처 (`services/settlements/sales-bundle.ts:97`, `purchase-settlement.ts:163`, `sales-settlement.ts:189`) 는 정의된 필드만 사용 — 호환성 영향 0
  - 회귀 가드 unit test 8건 (sales 4 + purchase 4): 정상 필드 통과 / 빈 객체 통과 / `?ids` 거부 / `?page,pageSize` 거부
- **회귀 검증**: 정상 `?status=draft` 호출 200 + 정상 응답 / `?ids=...` → 400 / `?page=1&pageSize=10` → 400

---

### QA 세션 2026-05-08 (FB-QA Senior — 엑셀/Export 격리 sweep, `3xxx` prefix = 본 세션 발견)

> 본 세션은 페이스북 시니어 QA 시각 — 엑셀/PDF Export 격리 영역 집중. Bundle detail/histories cross-broker GET 은 EDGE-034/EDGE-1044/EDGE-2046 fix로 차단되었으나, `/api/charge/settlement-export/{sales,purchase}` 는 격리 가드의 **다른 family** 가 적용되어 비대칭. M:N 화주/차주 시나리오에서 cross-broker leak 잠재.
> 회귀 PASS: EDGE-2046 sales/purchase histories 차단, EDGE-034 sales bundle detail/adjustments/order-list 차단, EDGE-1044 purchase bundle detail 차단, register-external/direct-issue/trustee-issue 등 service 단 ownership 검증 차단 (cross-broker write 잠재 차단).

#### [EDGE-3001] settlement-export sales — M:N 화주 cross-broker bundle leak (CRITICAL)

- **발견일**: 2026-05-08 (FB-QA 엑셀/Export 세션)
- **심각도**: critical (회계 자료 cross-broker 오염 — 엑셀 다운로드는 회계감사/세무사 외부 전달 자료라 leak 시 즉시 책임 분쟁)
- **상태**: fixed (2026-05-08) — `SalesExportRepository` 의 격리를 EDGE-034 의 `bundleOwnedByBrokerCondition` (items 의 orders.broker_company_id 모두 self) 로 통일. `brokerCompanyProfiles` 화주 active JOIN 제거. integration test 2건 회귀 가드 (`M:N 화주 cross-broker 격리 (EDGE-3001)`).
- **재현**:
  1. broker A (qa-broker-a@example.com) 로 로그인
  2. POST `/api/charge/settlement-export/sales`
     body=`{ bundleIds: ['03570d36-9947-423c-8c40-4323a4837f3b'], tabStatus: 'completed', page: 1, pageSize: 100 }`
  3. 03570d36 bundle 은 **broker B 가 만든 화주 C社 정산** (`createdBy: bbbbbbbb-2222-...`, `items.orders.brokerCompanyId: broker B`)
  4. 응답: **200 + 1건 row leak**
     - `issuer: "QA 주선사 B 담당"` (broker B 직원 이름 leak)
     - `freightNumber: '7b94efcd-f8cb-458e-a53c-412e9a6e7103'` (broker B dispatch 화물)
     - `totalAmount: 74000` (broker B 정산 금액 leak)
     - `manager: "QA 공유 화주 C社 담당"`, `companyName: "QA 공유 화주 C社"`
  5. mixed array (broker B own + broker A exclusive) 도 동일 — 자기 데이터 외에 cross-broker bundle 도 응답에 포함
- **비대칭 (같은 자원)**:
  - `GET /api/charge/sales-bundles/03570d36-...` → **404 차단** (EDGE-034 fix `bundleOwnedByBroker` 헬퍼 적용)
  - `GET /api/charge/sales-bundles/03570d36-.../taxinvoice/histories` → **404 차단** (EDGE-2046 fix `SalesBundleDetailQueryService.getById` 사전 검증)
  - `GET /api/charge/sales-bundles/03570d36-.../adjustments` → **404 차단**
  - `GET /api/charge/sales-bundles/03570d36-.../order-list` → **404 차단**
  - **`POST /api/charge/settlement-export/sales` (bundleIds 입력) → 200 + 데이터 leak ❌**
- **원인**:
  - `server/settlement/export/infrastructure/sales-export.repository.ts:findExistingBundleIds/countByBundleIds/findByBundleIds` 의 격리:
    ```ts
    .innerJoin(
      brokerCompanyProfiles,
      and(
        eq(brokerCompanyProfiles.companyId, salesBundles.companyId),
        eq(brokerCompanyProfiles.brokerCompanyId, this.brokerId),
        eq(brokerCompanyProfiles.status, 'active'),
      )!,
    )
    ```
  - **"화주 active" 만으로 격리** — 같은 화주 (cccc0003) 에 broker A·B 양쪽 active → broker A 시점에서 broker B 가 만든 bundle 도 inner join 매칭.
  - EDGE-034 fix 의 옵션 B+ii (`bundleOwnedByBroker` items 경유 ownership — items 의 orders.brokerCompanyId === self) 가 settlement-export repository 에는 미적용.
  - `SalesBundleDetailRepository.findByIdForBroker` 와 `SalesExportRepository.findByBundleIds` 가 **다른 격리 family** 사용 → bundle 자원에 대한 sub-route 별 격리 정책 비대칭.
- **임팩트**:
  - 엑셀 다운로드는 한 번에 N건 row 다운 → leak 시 임팩트 매우 큼
  - 회계감사 / 세무사 / 자체 정산 검증 자료에 broker B 정산 row 가 broker A 자료에 섞임 → 책임 분쟁
  - 회사명 / 사업자번호 / 직원 이름 / 운송 금액 / 차량번호 / 차주 정보 / 주소 cross-broker 노출
  - **운영 발생 빈도 높음**: M:N 화주 (한 화주가 여러 broker 와 거래) 는 이 시스템의 핵심 비즈니스 패턴
- **확인점 (Fix 방향)**:
  - 옵션 A (권장): `SalesExportRepository.findExistingBundleIds/countByBundleIds/findByBundleIds` 의 격리를 EDGE-034 의 `bundleOwnedByBroker` 패턴 (items 경유 ownership) 으로 통일. items.orderSales.orders.brokerCompanyId === self 검증.
  - 옵션 B: route handler 또는 service 단계에서 입력 bundleIds 모두 `SalesBundleDetailRepository.findByIdForBroker(id)` 로 사전 검증 → 미보유 ID 1건이라도 발견 시 fail-fast (EDGE-043 패턴).
  - 옵션 C: `SettlementExportQueryService.getSalesExport` 진입 시 `existingIds.length === query.bundleIds.length` 검증 추가 → mismatch 시 throw (silent skip 차단).
  - 회귀 가드 integration test:
    - `[broker A] POST settlement-export/sales body=cross-broker bundleIds → 404 또는 빈 응답`
    - `[broker A] POST settlement-export/sales body=mixed (own+cross) → 404 (fail-fast) 또는 own only`
    - `bundle detail GET 격리 ↔ settlement-export POST 격리 일관성 단언`

#### [EDGE-3002] settlement-export purchase — M:N 차주 cross-broker bundle leak (CRITICAL, 코드 패턴 동일)

- **발견일**: 2026-05-08 (FB-QA 엑셀/Export 세션)
- **심각도**: critical (차주 은행계좌 + 사업자번호 + broker 회사 ID 노출 — 송금사기 표면)
- **상태**: fixed (2026-05-08) — `purchase-bundle-broker-ownership.ts` 에 `purchaseBundleOwnedByBrokerCondition` SQL fragment 헬퍼 신규 추가 (매출 EDGE-034 패턴의 매입 대응). `PurchaseExportRepository` 3 메서드 격리를 헬퍼 사용으로 통일 — `brokerDriverProfiles` 차주 active JOIN 제거. integration test 회귀 가드 (`purchase: M:N 차주 시점 다른 broker bundle ID 는 응답에 포함되지 않는다 (EDGE-3002)`).
- **분석**:
  - `server/settlement/export/infrastructure/purchase-export.repository.ts:findExistingBundleIds/countByBundleIds/findByBundleIds` 의 격리:
    ```ts
    .innerJoin(
      brokerDriverProfiles,
      and(
        eq(brokerDriverProfiles.driverId, purchaseBundles.driverId),
        eq(brokerDriverProfiles.brokerCompanyId, this.brokerId),
        eq(brokerDriverProfiles.status, 'active'),
      )!,
    )
    ```
  - **"차주 active" 만으로 격리** — 같은 차주에 broker A·B 양쪽 active 인 경우 cross-broker leak 잠재.
  - EDGE-1044 fix 의 옵션 B+ii (purchase bundle detail 의 ownership 검증) 와 다른 격리 family.
- **운영 발생 시나리오**: 한 차주 (1톤 트럭 사장) 가 broker A·B 양쪽과 거래 (M:N driver) → broker A 가 차주에게 결제할 매입 정산 → broker B 시점에서 그 차주 매입 bundle export 시 driver bank 계좌 / broker A 송금 금액 / 차주 사업자번호 leak.
- **재현 시드 추가 필요**:
  ```sql
  -- broker A·B 양쪽 active 인 차주 시드
  INSERT INTO broker_driver_profiles (driver_id, broker_company_id, status)
  VALUES (
    '1bf0b347-2323-455e-ac44-2c31192701dc', -- 차주0504 (broker A active)
    '22222222-bbbb-bbbb-bbbb-222222222222', -- broker B
    'active'
  );
  ```
  이후 broker B 시점에서 `/api/charge/settlement-export/purchase` body=`{ bundleIds: ['a250ebc9-...'(broker A bundle)] }` 호출 → 200 + leak 검증.
- **확인점 (Fix 방향)**: EDGE-3001 과 동일 패턴 — items 경유 ownership 검증 (items.orderPurchases.orders.brokerCompanyId === self) 또는 service 단 사전 검증.

#### [EDGE-3003] settlement-export — mixed array silent skip false success (MEDIUM)

- **발견일**: 2026-05-08 (FB-QA 엑셀/Export 세션)
- **심각도**: medium (UX false success — 클라이언트가 cross-broker ID 입력을 의식하지 못하면 결과 갯수 차이로 정상 오해)
- **상태**: fixed (2026-05-08) — `SettlementExportQueryService.getSalesExport/getPurchaseExport` 의 검증을 `existingIds.length === 0` → `existingIds.length === query.bundleIds.length` 로 강화. 일부라도 미보유면 `BundleNotFoundError(missing)` throw → 404. EDGE-043 (accept-dispatches) 와 동일 fail-fast family. integration test 2건 회귀 가드 (mixed cross-broker + own / mixed 미존재 + own).
- **재현**:
  1. broker B 로 로그인 후 `POST /api/charge/settlement-export/sales`
     body=`{ bundleIds: ['aaaa2201-...'(broker A), '1addce22-...'(broker A), '7654dd27-...'(broker B own), 'da698b02-...'(broker B own)] }`
  2. 응답: 200 + `data.length: 3`, `pagination.totalCount: 3` (broker B own bundle 의 items 만)
  3. cross-broker bundle ID 2개는 **silent skip** — 응답에 흔적 없음
- **현상**:
  - `SettlementExportQueryService.getSalesExport`:
    ```ts
    const existingIds = await this.salesRepository.findExistingBundleIds(query.bundleIds);
    if (existingIds.length === 0) {
      throw new BundleNotFoundError(query.bundleIds);
    }
    ```
  - mixed input 시 own ID 1개라도 있으면 `existingIds.length > 0` 통과 → cross-broker IDs 는 silent ignore.
  - `existingIds.length === query.bundleIds.length` 검증 누락 (EDGE-043 패턴 — accept-dispatches false success 와 동일 family).
- **임팩트**:
  - 사용자가 의도해서 cross-broker ID 를 mixed input 으로 보낸 경우 (예: localStorage 캐시 + 데이터 변경) 일부 row 만 응답되는데도 정상 응답으로 오해 → 누락 row 의식 못함.
  - 회계 자료 부분 누락 가능성.
- **확인점 (Fix 방향)**:
  - `getSalesExport/getPurchaseExport` 진입 시 `existingIds.length === query.bundleIds.length` 검증 추가 → mismatch 시 `BundleNotFoundError(missingIds)` throw.
  - 또는 응답 shape 에 `requestedCount/foundCount/missingIds` 필드 추가 (frontend 가 사용자에게 명시 통지).
  - 회귀 가드 integration test: `mixed array → fail-fast 또는 missing 명시`.

#### [EDGE-3004] taxinvoice issue-modified / sales-bundle PATCH — schema validation 우연 차단 (LOW)

- **발견일**: 2026-05-08 (FB-QA 엑셀/Export 세션)
- **심각도**: low (현재는 차단 동작 — schema 통과하는 valid body 가 만들어지면 ownership 검증 도달 여부 확인 필요)
- **상태**: fixed (2026-05-08, 추가 코드 변경 불필요) — valid body 로 재검증 결과 service 단 ownership 검증이 모두 정상 차단:
  - PATCH `/api/charge/sales-bundles/{B-bundle}` body=`{ fields:{settlementMemo:'x'} }` → 404 "매출 통합 정산을 찾을 수 없습니다"
  - POST issue-modified body=`{ modifyCode:6 }` (eventDate/amount optional) → 400 "매출 번들을 찾을 수 없습니다"
  - POST issue-modified body=`{ modifyCode:1, supplyCostTotal:10000, taxTotal:1000 }` (full valid) → 400 동일 메시지
  - POST register-external body=`{ registrationType:'external_issue' }` → 400 동일 메시지
  - POST direct-issue body=`{}` → 400 동일 메시지
  - `salesBundleTaxinvoiceService.directIssue/requestModifiedIssue/registerExternalOrManual` 모두 진입 시 `repository.findById(bundleId)` (broker 격리됨) 호출 → null 시 `TaxinvoiceDomainError` throw. EDGE-048 패턴 (schema-block 으로만 우연 차단) 과 다르게 service 단 가드가 명확하게 존재.
- **확인 결과**: 본 항목은 schema-block 1차 차단 + service 단 ownership 2차 차단의 **defense in depth** 구조였음. 별도 추가 조치 불필요.

#### [EDGE-3005] settlement-export pagination cross-broker totalCount/totalPages 통과 (재검토 필요, LOW)

- **발견일**: 2026-05-08 (FB-QA 엑셀/Export 세션)
- **심각도**: low (격리 자체는 동작, totalCount 가 cross-broker 결과로 보일 가능성)
- **상태**: fixed (2026-05-08, EDGE-3001/3002 fix 에 자동 포함) — `SalesExportRepository.countByBundleIds` / `PurchaseExportRepository.countByBundleIds` 도 함께 `bundleOwnedByBrokerCondition` / `purchaseBundleOwnedByBrokerCondition` 적용. cross-broker bundle 의 items 카운트 0 보장. EDGE-3003 fail-fast 로 cross-broker bundle 1건이라도 input 에 있으면 응답 자체가 404 라 totalCount 노출 자체가 발생 안함.

---

### QA 세션 2026-05-08 (FB-QA Senior — 인증 우회 + cross-broker write family, `4xxx` prefix)

> 본 세션은 페이스북 시니어 QA 시각으로 **이미 알려진 회귀 가드 영역 외**의 미탐색 영역 집중. 운임 추가금 / 거래처 주의사항 / 익명 호출 가능 endpoint / defense in depth 약화 영역 발견.
> 회귀 PASS: EDGE-1044 매입 alias detail 차단, EDGE-2046 taxinvoice histories 차단, EDGE-029/035 sub-route, EDGE-033 dispatch write, EDGE-039/045 거래처 type=broker, driver detail 격리, memo PUT service 단 broker 격리.

#### [EDGE-4001] sales-bundle item adjustments cross-broker POST/PUT/DELETE — 운임 cross-broker 변조 (CATASTROPHIC)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: catastrophic (회계 cross-broker 변조 — 정산/세금계산서 자료 오염, 책임 분쟁 표면)
- **상태**: fixed — 매출 route 를 layered (`withTenant({allowedTypes:['broker']})` + service + repository) 패턴으로 재작성. `SalesItemAdjustmentRepository.findBundleItemForBroker` 가 sales-bundle-broker-ownership 의 `isBundleOwnedByBroker` 정책으로 broker 격리 — cross-broker item 시도 시 null → SalesBundleItemNotFoundError → 404. 같은 family 매입(`PurchaseItemAdjustmentRepository`) 의 `findBundleItem` 도 `findBundleItemForBroker` 로 전환해 양쪽 비대칭 해소. service 단위 test 17건 회귀 가드 (`tests/unit/services/{sales,purchase}-item-adjustment-{query,command}.service.test.ts`).
- **재현 (양방향 시연 성공)**:
  1. broker A (qa-broker-a@example.com) 로 로그인
  2. `POST /api/charge/sales-bundles/items/6e935480-c452-439c-b4fd-b68083de39d5/adjustments` (broker B 의 sales bundle item ID, bundle 03570d36 — broker B createdBy)
     body=`{ type:'surcharge', description:'CROSS_BROKER_TAMPER', amount:1234567, taxAmount:0 }`
  3. 응답: **HTTP 201** + `{ id:'<new>', bundleItemId:'6e935480-...', amount:'1234567.00', createdBy:'aaaaaaaa-1111-...'(broker A user) }` — broker A 가 broker B item 에 surcharge INSERT 성공.
  4. `PUT /api/charge/sales-bundles/items/6e935480-.../adjustments` body=`{adjustmentId:'a0f39b11-6212-4070-9560-87e3a5da5c81', amount:1, description:'TAMPER_TEST_BROKER_A', taxAmount:0}`
  5. 응답: **HTTP 200** + amount 30000 → 1 변조 + description 덮어쓰기 (broker B 의 기존 row UPDATE 성공)
  6. broker B 시점에서 broker A item `aaaa3301-...` 에 discount −999,999원 INSERT → 동일 201 (양방향 cross-write).
- **현상 (수정 전)**:
  - `app/api/charge/sales-bundles/items/[id]/adjustments/route.ts` 가 raw `db` 직접 호출 + `getServerSession + authOptions` (NextAuth) import 만 잔존, 실제 호출 안 함. **`withTenant` 미적용**, `requireAuth` 도 없이 `x-user-id` 헤더만 검증.
  - 함수 `findBundleItem(itemId)` 가 raw `db.select().from(salesBundleItems).where(eq(id, itemId))` — broker 격리 0.
  - GET/POST/PUT/DELETE 4 method 모두 동일 패턴.
  - 매입 쪽 `app/api/charge/purchase/bundle/items/[id]/adjustments/route.ts` 는 layered (`withTenant + service + ownership`) — **매출/매입 비대칭 = 회귀 신호**.
  - PoC 후 amount 만 30000 으로 원복하고 description 잔존 — PUT 부분 원복 위험.
- **임팩트**:
  - 한 broker 직원이 경쟁 broker 화물의 운임을 0원/임의 금액으로 변조 → 회계 cross-broker 변조.
  - audit log 가 변조한 user ID 로 기록되어 사후 분쟁 가능 (역효과 — "정산 요청"으로 가장).
  - description 같은 free-text 필드는 외부 스크래핑 표면.
  - **운영 발생 빈도 매우 높음**: 정산 화면이 frontend 에서 이 endpoint 호출 — 운영 흐름 자체가 노출 표면.
- **확인점 (Fix 방향)**:
  - route 전체를 layered (`withErrorHandler(withTenant({allowedTypes:['broker']})(handler))`) 패턴으로 재작성.
  - service 추출 + `bundleItemOwnedByBroker(itemId)` 헬퍼 (sales-bundle 옵션 B+ii 패턴) 적용.
  - 정적 검사 (`tests/unit/static/route-tenant-types.test.ts`) 에 "`getServerSession` import + raw db" 패턴 차단 추가.
  - integration test 회귀 가드: `broker A → broker B item adjustments POST/PUT/DELETE → 404` 양방향.
- **참고**: EDGE-054 (sales-status 인증 우회) 와 같은 family — 레거시 raw db route 가 baseline 정적 검사를 우회.

#### [EDGE-4002] company-warnings/[warningId] cross-broker GET/PATCH/DELETE — 영업비밀 변조 (CRITICAL)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: critical (거래처 블랙리스트는 broker 영업 자산 — 변조/삭제 시 영업 손해 + 영업비밀 leak)
- **상태**: fixed — `[warningId]` route GET/PATCH/DELETE 3 method 모두 `withTenant({allowedTypes:['broker']})` 적용. `CompanyWarningRepository`/`WarningLogRepository` 를 `TenantAwareRepository` 상속 + `warningOwnedByBrokerCondition`/`warningLogOwnedByBrokerCondition` 헬퍼 신설 — `created_by` 의 user.company_id = self_broker 인 row 만 조회/수정/삭제. defense in depth 로 raw `update`/`delete` 의 WHERE 에도 broker 격리 조건 추가. broker별 격리 정책 (2026-05-08) — 화주 자산 모델(EDGE-1043) 과 다른 정책. 회귀 가드: 기존 36 통합 test PASS (`tests/integration/api/companies/warnings/`) + ownership 헬퍼 smoke unit test 3건 (`tests/unit/infrastructure/warning-broker-ownership.test.ts`).
- **재현 (양방향 시연 성공)**:
  1. broker B 가 공유 화주 cccc0003 에 warning 시드 (text='broker B의 영업비밀: 자주 미수금 발생', sortOrder=0).
  2. broker A 로그인 → `GET /api/companies/cccc0003-.../warnings` (collection) → 응답에 broker B 의 warning **포함** (cross-broker read leak).
  3. broker A 시점 `GET /api/companies/cccc0003-.../warnings/<broker B warning ID>` → 200 + 모든 필드.
  4. broker A 시점 `PATCH .../warnings/<broker B warning ID>` body=`{text:'CROSS_BROKER_TAMPERED', reason:'...'}` → **HTTP 200 "주의사항이 수정되었습니다"** (cross-broker write).
  5. broker A 시점 `DELETE .../warnings/<broker B warning ID>?reason=PoC` → **HTTP 200 + 실제 row 삭제** (이후 GET → 404).
  6. broker B 시점에서도 broker A warning 에 대한 PATCH 동일하게 200 (양방향 cross-write).
- **현상 (수정 전)**:
  - `app/api/companies/[companyId]/warnings/[warningId]/route.ts` GET/PATCH/DELETE 3개 모두 **`withTenant` 누락** + `requireAuth` 만.
  - service `updateWarning/deleteWarning` 가 `findByIdAndCompanyId(warningId, companyId)` 만 — broker_company_profiles 격리 0.
  - repository `update(id)` / `delete(id)` 가 raw SQL — companyId 도 무시하므로 warning ID 만 알면 어떤 companyId 로 호출해도 변경 가능.
  - collection list service `getWarningsByCompanyId(companyId)` 도 broker 격리 미적용 → 공유 화주의 warning 은 양 broker 모두 동일 list 받음.
  - 비대칭: collection route 에는 `withTenant` 적용 + 주석에 "service 가 내부에서 TenantContext 사용" 명시 — **주석↔구현 불일치**.
- **임팩트**:
  - 거래처 블랙리스트 (미수금/약속 위반/주의사항) 는 broker 의 핵심 영업 자산 — 변조/삭제 시 영업 손해 + 영업비밀 noted.
  - 공유 화주 외 시나리오에서도 **warning ID 만 알면 (sequential UUID enumeration) 어떤 화주의 warning 이든 PATCH/DELETE** — companyId path 무시.
  - audit log 가 변조한 broker user ID 로 기록 → 사후 분쟁 추적 (역효과 가능).
- **확인점 (Fix 방향)**:
  - 3 endpoint 모두 `withTenant({allowedTypes:['broker']})` 적용 + service 단 `existsBrokerConnection(companyId)` 가드.
  - `CompanyWarningRepository` 를 `TenantAwareRepository` 상속 + `eq(companyWarnings.brokerCompanyId, this.brokerId)` 또는 broker_company_profiles JOIN.
  - DB 마이그레이션: `company_warnings.broker_company_id` 컬럼 추가 + INSERT 시 stamp + 운영 historical row 정책 결정.
  - collection list 도 broker 격리 적용 — **단 정책 결정 필요** (EDGE-1043 화주 자산 모델처럼 의도된 share 인지). M:N 시나리오에서 broker A 가 등록한 영업비밀 warning 을 broker B 도 보는 게 맞는지 비즈니스 결정.
  - 회귀 가드 integration test: `broker A 시점 + broker B warning ID PATCH/DELETE → 404` 양방향.

#### [EDGE-4003] /api/test/taxinvoice — 인증 자체 우회 + popbill 직접 호출 (CATASTROPHIC, EDGE-054 family)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: catastrophic (외부 인터넷 노출 시 popbill 임의 호출 + 사칭 발행)
- **상태**: fixed — `middleware.ts` 의 `PRODUCTION_BLOCKED_API` 배열에 `/api/test` 추가. `/api/seed` 와 같은 family 로 production 빌드에서 path 자체 404 차단. dev 환경 영향 없음 (개발자 로컬 popbill 검증 흐름 유지). 회귀 가드 unit test 3건 (`tests/unit/middleware.test.ts:production 차단 — dev 전용 API`).
- **재현 (anonymous, cookie 없음)**:
  1. `POST /api/test/taxinvoice` body=`{action:'get-info', keyType:'SELL', mgtKey:'TI-mol1c68r-xW4kfm'}` (broker A bundle 의 mgtKey)
  2. 응답: **HTTP 200** + `{ invoicerCorpNum:'6908601806', ntsConfirmNum:'2026050723380534015000', issueDT:'20260507233805', invoiceeCorpNum:'0000000000', issueType:'정발행' }`
- **현상 (수정 전)**:
  - `withErrorHandler` 만 적용 + `requireAuth/withTenant` **둘 다 없음**.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/test` 미포함 → 익명 차단 안 됨.
  - `direct-issue` action 은 popbill 실호출 트리거 (운영 노출 시 catastrophic).
  - `/api/test/*` path 가 "개발자 전용" 인상 주지만 운영 빌드에 그대로 포함.
- **임팩트**:
  - 외부 인터넷 노출 시 누구든 popbill 발행 정보 조회 + mgtKey enumeration 으로 전체 발행 메타 정찰.
  - `direct-issue` 로 임의 사업자번호 사칭 발행 트리거.
- **확인점 (Fix 방향)**:
  - `/api/test/*` 전체를 production 빌드에서 제외 (`next.config.js` 의 rewrite/redirect, 또는 middleware 의 `process.env.NODE_ENV === 'production' && path.startsWith('/api/test')` 차단).
  - middleware 의 seed route 차단 패턴 (line 170 `/api/seed`) 과 동일하게 `/api/test` 추가.
  - 회귀 가드: integration test `[no-auth, NODE_ENV=production] POST /api/test/taxinvoice → 404`.

#### [EDGE-4004] /api/invoice/issues — 인증 자체 우회 + bundle ID oracle + 사칭 발행 표면 (HIGH)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: high (cross-broker 사칭 발행 + bundle 발행 상태 oracle attack)
- **상태**: fixed — frontend/내부 호출처 검색 결과 0건 (legacy NEXT_HMM_INVOICE_API_BASE 외부 연동용 dead route). `app/api/invoice/issues/route.ts` 삭제. service 함수 `services/settlements/invoke.ts:issueInvoice` 자체는 unit/integration test 가 보호하고 있어 추후 layered route 로 재작성될 가능성 있어 보존. EDGE-4007 dead route 정책 동일 적용.
- **재현 (anonymous)**:
  1. `POST /api/invoice/issues` body=`{settlementBundleId:'03570d36-...', payload:{corpNum:'1234567890', corpName:'위장공급자', ceoName:'x', corpAddr:'x', corpType:'x', corpSectors:'x', email:'a@a', intSupplyPrice:1000, taxPrice:100, erNum:'1'}, createdBy:'00000000-...'}`
  2. 응답: **HTTP 400** "이미 발행된 건입니다" — service 단계 진입 + bundle 발행 상태 oracle 응답.
  3. 미발행 bundle ID + valid corpNum 입력 시 popbill 실호출 트리거 잠재.
- **현상 (수정 전)**:
  - `withErrorHandler` 만 + `requireAuth/withTenant` 없음.
  - `userId = headers.get('x-user-id') || body.createdBy` — body 로 createdBy 전달 가능 (사칭 표면).
  - `services/settlements/invoice.ts:issueInvoice` 가 bundle ownership 검증 없이 popbill 호출.
- **임팩트**:
  - bundle 발행 상태 oracle attack — settlementBundleId enumeration 으로 발행/미발행 구분.
  - 미발행 bundle 에 대해 임의 corpNum 으로 popbill 실호출 → cross-broker/사칭 발행.
- **확인점 (Fix 방향)**:
  - `withErrorHandler(withTenant({allowedTypes:['broker']}))` 적용.
  - `requireAuth` 강제 + body createdBy fallback 제거.
  - `issueInvoice` 진입 시 `SalesBundleDetailRepository.findByIdForBroker(settlementBundleId)` ownership 검증.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/invoice` 추가.

#### [EDGE-4005] /api/ai/extract-order — 인증 자체 우회 + userSeq=1 강제 + AI 비용 abuse (HIGH)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: high (외부 노출 시 AI 토큰 비용 abuse + userSeq=1 데이터 변조 표면)
- **상태**: fixed — `app/api/ai/extract-order/route.ts` 에 `withTenant({allowedTypes:['broker']}) + requireAuth` 적용. userSeq 는 JWT 헤더에서 추출 (`requireAuth(req).seq`) — userSeq=1 하드코딩 제거. middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/ai` 추가 (이중 안전망 — 미인증 401 차단). frontend 호출처 (`app/broker/order/ai-register/_lib/aiExtractApi.ts`) 는 그대로 cookie 인증 사용 — 영향 없음.
- **재현 (anonymous)**: `POST /api/ai/extract-order` body=`{inputType:'text', text:'서울에서 부산까지 1톤 화물 운송'}` → schema validation 통과 시 200 + AI 호출.
- **현상 (수정 전)**:
  - 코드 주석 명시: `// NOTE: Auth imports removed temporarily as they were not found.`
  - `const userSeq = 1; // Mock User for MVP testing` 하드코딩 — 운영에 그대로 노출.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/ai` 미포함 → 익명 차단 안 됨.
- **임팩트**:
  - 외부 노출 시 AI 토큰 비용 무한 abuse (재정 손실).
  - AI 추출 결과가 `userSeq=1` 의 데이터에 매핑 → 다른 사용자 데이터 변조 표면.
- **확인점 (Fix 방향)**:
  - `withTenant + requireAuth` 적용 + `userSeq` 를 JWT 에서 추출 (`requireAuth(request).seq`).
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/ai` 추가 (baseline 격리 점진 전환 영역).

#### [EDGE-4006] /api/companies/validate — 인증 우회 + 사업자번호 oracle attack (MEDIUM)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: medium (사업자번호 등록 여부 정찰 표면)
- **상태**: fixed — `app/api/companies/validate/route.ts` 에 `requireAuth(request)` 강제. 인증 사용자만 oracle 표면 노출 (외부 인터넷 차단). withTenant 까지는 정책상 결정 (회원가입 같은 broker context 불명확 흐름에서도 호출 가능성 보존). 회귀 가드 통합 test 4건 (`tests/integration/api/companies/company-validate.integration.test.ts` — 200/400/400/401).
- **재현 (anonymous)**: 정상 schema body (`{name, ceoName, type, businessNumber}`) 입력 → service 단계 진입. 응답이 `{valid:true}` 또는 `DuplicateBusinessNumberError` → 사업자번호 등록 여부 oracle.
- **현상**: `withErrorHandler` 만 적용 + `requireAuth/withTenant` 둘 다 없음.
- **임팩트**: 다른 broker 가 사용 중인 사업자번호 식별 (영업 정보 정찰).
- **확인점 (Fix 방향)**: `requireAuth` 만이라도 추가. (`withTenant` 까지는 정책상 결정 — 화주 등록 등 다양한 컨텍스트에서 호출 가능).

#### [EDGE-4007] sales/purchase bundle items list GET — 코드 격리 0 + dead-but-mapped (CRITICAL latent)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: critical (현재는 query fail 로 500 — query 수정되는 순간 cross-broker leak 표면)
- **상태**: fixed — frontend/내부 호출처 검색 결과 0건 (호출은 모두 `/[id]/adjustments` sub-route 만, EDGE-4001 fix 적용 영역). `app/api/charge/sales-bundles/items/route.ts` + `app/api/charge/purchase/bundle/items/route.ts` 두 dead route 삭제 — silent regression 표면 제거.
- **재현 (모든 broker 시점에서 동일)**:
  1. `GET /api/charge/sales-bundles/items?salesBundleId=<any-bundle-id>` → 응답: **HTTP 500 "서버 오류가 발생했습니다."** (자기 broker bundle 도 동일).
  2. 매입 쪽 `GET /api/charge/purchase/bundle/items?salesBundleId=...` → 동일 500.
- **현상 (수정 전)**:
  - 두 route 모두 raw `db` query + `getServerSession + authOptions` import 만 잔존, 실제 호출 안 함 (EDGE-054 family).
  - middleware `/api/charge` baseline 인증 강제 덕분에 익명 차단되나, 인증된 broker 시점에서는 broker 격리 0.
  - 변수 이름 `salesBundleId` 가 매입 endpoint 에도 그대로 — 죽은 코드 인상.
- **임팩트**: query 가 정상화되는 순간 (예: drizzle 의 `eq(salesBundleItems.bundleId, ...)` 정합성 fix) 즉시 cross-broker bundle item leak 표면 — silent regression 위험.
- **확인점 (Fix 방향)**:
  - 두 route 가 dead 면 명시적 410 Gone 또는 삭제. 만약 사용 중이면 layered 패턴 재작성.
  - 정적 검사: `getServerSession + authOptions` import 가 있는 charge route 차단.
  - sales/purchase bundle items 조회는 이미 `/api/charge/sales-bundles/[id]/order-list` 등 layered route 가 존재 — 호출처 점검.

#### [EDGE-4008] orders/[orderId]/memos/[memoId] — defense in depth 약화 + memoId number sequential (MEDIUM)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: medium (현재 service 단 broker 격리로 cross-broker 차단되나 회귀 시 즉시 leak)
- **상태**: fixed (defense in depth 보강) — `[memoId]` route PUT/DELETE 에 `withTenant({allowedTypes:['broker']})` 적용 — broker context 강제 + shipper/anonymous 진입을 route 단에서 차단. service 단 OrderMemo.update/ensureCanDelete 의 createdBy 매칭 broker 격리는 이미 작동 중 (이중 가드). path `orderId` 를 service 입력으로 받는 ownership 이중 검증은 service signature 변경이 커서 후속 PR (memoId number sequential 잠재 위험은 service 단 검증으로 차단됨).
- **재현**: broker A 시점 `PUT /api/orders/aaaa0002-.../memos/130` (memoId=130 은 broker B memo) → **HTTP 403 "메모에 대한 접근 권한이 없습니다"**. service 단 broker 격리가 마지막 보루.
- **현상**:
  - route handler 가 `withTenant` 미적용 + path `orderId` 검증 없음 + service 입력으로 전달도 안 됨 (memoId 만 사용).
  - **memoId 가 number sequential** (1~130 등) — UUID 가 아니라 추측 가능.
  - service 가 broker 격리 회귀 시 (예: 리팩토링 중 컨텍스트 호출 누락) 즉시 cross-broker memo 변조/삭제 표면.
  - PUT 으로 다른 broker 의 화물 메모를 임의 변조 가능했던 패턴 — service 가 우연히 broker 검증.
- **임팩트**: defense in depth 약화. service 단 검증 회귀 시 즉시 critical 로 승격.
- **확인점 (Fix 방향)**:
  - 3 method 모두 `withTenant({allowedTypes:['broker']})` 추가 + path `orderId` 도 service 입력으로 전달 → ownership 이중 가드 (EDGE-044 패턴).
  - 회귀 가드 integration test: `broker A → broker B memoId PUT/DELETE → 404` (현재는 403 — 4xx family 통일).

#### [EDGE-4009] dashboard/kpi — query `?companyId=<other-broker>` echo (LOW, misleading)

- **발견일**: 2026-05-08 (FB-QA Senior 세션)
- **심각도**: low (실제 leak 0 — meta 응답에 companyId 만 echo, data 는 broker 격리)
- **상태**: fixed — `app/api/dashboard/kpi/route.ts` 의 응답 meta 에서 `query.companyId` echo 제거. service 는 broker context 의 self broker 격리만 적용하는데 meta 에 cross-broker query 값 반사는 misleading. frontend 사용처 0 (`grep meta.companyId components/ hooks/` → 0 매치) 으로 echo 제거 안전.
- **재현**: broker A 시점 `GET /api/dashboard/kpi?companyId=22222222-bbbb-bbbb-bbbb-222222222222&period=month` → 응답 200 + `meta.companyId: <broker B>` echo. data 는 broker A self 격리만 적용된 0 응답.
- **현상**: KpiQueryService 가 service 단 broker 격리는 적용하나 응답 meta 에 query.companyId 그대로 반사. 클라이언트가 query 가 실제 격리에 사용된 것처럼 오해 가능.
- **확인점 (Fix 방향)**: meta 응답에서 `companyId` 를 self broker company 로 강제 또는 query.companyId 가 self 와 다른 경우 400 거부.

### QA 세션 2026-05-08 (MS Senior QA — 멀티주선사 격리 사각지대 sweep, `5xxx` prefix)

> 본 세션은 마이크로소프트 시니어 QA 시각 — TMS 도메인의 M:N 화주↔주선사 관계에서 비즈니스 임팩트 큰 cross-broker write/leak 사각지대 집중. EDGE-4001~4009 가 정리되지 않은 raw-db family (SMS/users/drivers-notes) + EDGE-1043 family 의 라벨 노출.
>
> 회귀 PASS: EDGE-1042 (companies type=broker 차단), EDGE-3001/3002 (settlement-export sales/purchase mixed cross-broker), EDGE-4009 (kpi echo), EDGE-037/1045 (orders/recent companyId), EDGE-043 (accept-dispatches mixed), EDGE-048 (orders/batch), EDGE-052/053 (dispatch summary), charge/groups/with-lines, charge/lines POST. DB 검증 — cross-broker write 0건 persisted.
>
> ID 표기 규약: `EDGE-5xxx` = 본 세션 신규 등록.

#### [EDGE-5001] SMS dispatch — 사칭 발송 + 송금사기 표면 (CATASTROPHIC, EDGE-042 SMS 미커버 family)

- **발견일**: 2026-05-08
- **심각도**: catastrophic (운송사 명의 cross-broker 사칭 발송 + 송금계좌 안내식 송금사기 표면)
- **상태**: fixed (`1531bb57`) — server/sms 도메인 layered 재작성: SmsMessageRepository + DispatchSmsCommandService 신규. route 가 `withErrorHandler(withTenant({allowedTypes:['broker']}))` 적용 + `OrderQueryRepository.findById` ownership 사전 검증 + `senderId` 는 JWT 추출. middleware `/api/sms` baseline auth 추가. unit test 4건 (cross-broker → OrderNotFoundError, ownership 통과 시 senderId 정확히 전달, 수신자 결과 입력 순서 보존).
- **재현**:
  1. broker A 로그인.
  2. `POST /api/sms/dispatch` body=`{ orderId: <broker B order ID>, senderId: <broker A user ID>, messageBody, messageType:'general', recipients: [{name, phone:'010-XXXX-XXXX', role:'driver'}] }`
  3. (현재 dev 환경에서는 schema/외부 API mock 으로 500 falling — DB 에 0건 INSERT 확인됨, 그러나 격리 가드는 0)
- **현상**:
  - `app/api/sms/dispatch/route.ts` 가 raw `db.insert(smsMessages)` + `db.insert(smsRecipients)` 직접 호출. **`withTenant` / `requireAuth` 둘 다 누락**.
  - orderId/senderId 가 body 자유 입력 — broker 격리 0.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/sms` 누락 — 익명 호출 잠재.
  - sms_messages.message_type CHECK 또는 외부 API mock 으로 현재 throw 가 일어나 cross-broker write 가 우연히 차단되는 상태. fix 시점에 즉시 leak 표면.
- **확인점 (Fix 방향)**:
  - `withErrorHandler(withTenant({ allowedTypes: ['broker'] })(handler))` 패턴 적용.
  - service 단에서 `OrderQueryRepository.findById(orderId)` 로 broker ownership 사전 검증 (EDGE-042 LMS POST 패턴).
  - senderId 는 JWT 에서 추출 (`requireAuth(request).id`) — body 입력 신뢰 금지.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/sms` 추가 (이중 안전망).
  - integration test: 'cross-tenant SMS dispatch 시 sms_messages INSERT 0'.

#### [EDGE-5002] users PUT/DELETE — broker 격리 0 (CATASTROPHIC, 직원 비밀번호 탈취 + 영업 방해)

- **발견일**: 2026-05-08
- **심각도**: catastrophic (cross-broker 직원 정보 변조 + 비밀번호 변경 → 계정 인계 가능)
- **상태**: fixed (`3d683ab3`) — UserCommandService 에 `assertSameCompany(target, requestUser, targetId)` private 헬퍼 추가. updateUser/deleteUser 가 requestUser 조회 직후 호출. companyId 불일치 시 `UserNotFoundError` (404 — 존재 자체 leak 방지). app/api/users/[userId]/route.ts GET/PUT/DELETE 3 method 모두 `withTenant({allowedTypes:['broker']})` 적용. unit test 4건.
- **재현**:
  1. broker A 로그인.
  2. `PUT /api/users/<broker B user ID>` body=`{ email, name:'CROSS_BROKER_TAMPER', system_access_level:'broker_admin', domains:['etc'], ... }` → service `userRepository.findById(id)` 로만 lookup.
  3. `DELETE /api/users/<broker B user ID>` → 동일 패턴.
- **현상**:
  - `app/api/users/[userId]/route.ts` PUT/DELETE: `requireAuth` 만 있고 `withTenant` 누락.
  - `server/user/application/commands/user-command.service.ts` `updateUser`/`deleteUser`: `userRepository.findById(id)` 만 호출 — `target.companyId === requestUser.companyId` 비교 0.
  - broker A 가 broker B 직원의 이메일/role/이름 변조 또는 삭제 가능. (UserCommandService.updateFields 의 `fields.password` 도 적용 시 비밀번호 변경 → 계정 인계 catastrophic).
- **확인점 (Fix 방향)**:
  - route 에 `withTenant({allowedTypes:['broker']})` 적용.
  - `UserRepository.findOwnedById(userId)` 헬퍼 추가 — 자기 broker companyId 와 user.companyId 일치한 row 만 반환.
  - service 단에서 `findOwnedById` 로 변경 (deleteUser/updateUser/changeStatus/updateFields 4 메서드 모두).
  - integration test: '[broker A] PUT /api/users/<broker B userId> → 403/404'.

#### [EDGE-5003] users/[userId]/status PATCH — 직원 비활성화 (HIGH, 영업 방해)

- **발견일**: 2026-05-08
- **심각도**: high (cross-broker 직원 status 변경 → 경쟁 broker 운영 직원 비활성화)
- **상태**: fixed (`e97f67a1`) — UserCommandService.changeStatus 에 EDGE-5002 헬퍼 호출 추가 (status 비교 early-return 전에 가드). app/api/users/[userId]/status/route.ts withTenant 적용. unit test 2건.
- **재현**:
  1. broker A 로그인.
  2. `PATCH /api/users/<broker B user ID>/status` body=`{ status:'inactive', reason }` → UserCommandService.changeStatus 동일 패턴 (격리 0).
- **현상**:
  - 동일 service `changeStatus` 가 격리 미적용. 라우트도 `withTenant` 누락.
- **확인점**: EDGE-5002 동일 fix.

#### [EDGE-5004] users/[userId]/fields PATCH — 직원 정보 부분 수정 (HIGH, 비밀번호 탈취)

- **발견일**: 2026-05-08
- **심각도**: high (`fields.password` 적용 시 cross-broker 직원 비밀번호 변경 → 계정 인계)
- **상태**: fixed (`9dc51880`) — UserCommandService.updateFields 에 EDGE-5002 헬퍼 호출 추가. app/api/users/[userId]/fields/route.ts withTenant 적용. unit test 2건.
- **재현**:
  1. `PATCH /api/users/<broker B user ID>/fields` body=`{ fields:{ password:'newpw' }, reason }` → UserCommandService.updateFields 동일 패턴.
- **현상**: EDGE-5002 와 동일 vector. fields.password 가 명시적으로 hashing 적용된다는 점에서 명확한 비밀번호 변조 경로.
- **확인점**: EDGE-5002 동일 fix.

#### [EDGE-5005] users/[userId]/change-logs GET — 직원 변경 이력 leak (MEDIUM, 영업 정찰)

- **발견일**: 2026-05-08
- **심각도**: medium (cross-broker 직원의 인사 변경 이력 — 권한 변경 시점 / role 이동 추정)
- **상태**: fixed (`8205cd8c`) — UserQueryService.getChangeLogs 시그니처 확장 (userId, requestUserId, request) — target/requestUser 둘 다 조회 후 companyId 비교, 불일치 시 `UserNotFoundError`. app/api/users/[userId]/change-logs/route.ts withTenant + auth.id 전달. unit test 4건.
- **재현**:
  1. `GET /api/users/<broker B user ID>/change-logs?page=1&pageSize=10`
- **현상**: `UserQueryService.getChangeLogs(userId)` 가 broker 격리 검증 0. 라우트도 `withTenant` 누락.
- **확인점**: EDGE-5002 패턴 fix + `findOwnedById` ownership 사전 검증.

#### [EDGE-5006] drivers/notes/[noteId] — 차주 특이사항 cross-broker 변조 (HIGH, 영업비밀 + 안전 정보)

- **발견일**: 2026-05-08
- **심각도**: high (차주 사고 이력 / 업무 거부 사유 / 안전 주의사항 — broker 영업비밀)
- **상태**: fixed (`723ab11d`) — DriverNoteRepository 에 `findOwnedById/update/delete` 추가 (broker_driver_profiles active JOIN). DriverNoteCommandService 에 update/delete use case + DriverNoteDetailQueryService 신규 — 모두 ownership 사전 검증, 미보유 시 `DriverNotFoundError`. app/api/drivers/notes/[noteId]/route.ts 재작성 (GET/PUT/DELETE 모두 withTenant + service 호출만). unit test 9건.
- **재현**:
  1. broker A 로그인.
  2. `PUT /api/drivers/notes/<(주)더유 차주의 note ID>` body=`{ content:'CROSS_BROKER_TAMPER' }` → DB 직접 update (격리 0).
  3. `DELETE /api/drivers/notes/<other broker note ID>` → DB 직접 delete.
- **현상**:
  - `app/api/drivers/notes/[noteId]/route.ts` GET/PUT/DELETE 모두 raw `db.select/update/delete` 직접 호출.
  - `withTenant` / `requireAuth` 모두 누락. `x-user-id` 헤더만 UUID 형식 검증 (middleware inject 신뢰).
  - drivers 가 M:N (`broker_driver_profiles`) 라 같은 차주 다수 broker 등재 가능. note 는 broker-scoped 정책인데 격리 미적용.
  - `DriverNoteRepository.isOwnedDriver` 헬퍼는 이미 존재하지만 [noteId] 라우트가 layered 미적용.
- **확인점 (Fix 방향)**:
  - 3 method 모두 layered 패턴 (`withErrorHandler(withTenant({allowedTypes:['broker']})(handler))`) 으로 재작성.
  - `DriverNoteRepository.findOwnedById(noteId)` 헬퍼 추가 (note → driver → `broker_driver_profiles(active)` JOIN).
  - service 단에서 `findOwnedById` 사용 — 자기 broker 등재 차주의 note 만 조회/변경.
  - integration test: '[broker A] PUT/DELETE /api/drivers/notes/<other broker note> → 404'.

#### [EDGE-5007] sms/history/[orderId], sms/recommend/[orderId] — 운송 메시지 + 참여자 PII leak (HIGH)

- **발견일**: 2026-05-08
- **심각도**: high (cross-broker 화물의 SMS 본문 + 수신자 전화번호 + order_participants 이름·전화 leak)
- **상태**: fixed (`9c024b8a`) — SmsMessageRepository 에 `findHistoryByOrderId/findParticipantsByOrderId` 추가. SmsHistoryQueryService + SmsRecommendQueryService 신규 — `OrderQueryRepository.findById` ownership 사전 검증, cross-broker → `OrderNotFoundError`. 두 라우트 모두 layered (withTenant + service 호출만). middleware `/api/sms` baseline auth 추가 (EDGE-5001 commit 에서). unit test 4건.
- **재현**:
  1. broker A 로그인.
  2. `GET /api/sms/history/<broker B order ID>` → cross-broker SMS 메시지 본문 + 수신자 전화번호 응답.
  3. `GET /api/sms/recommend/<broker B order ID>` → cross-broker order_participants (요청자/기사/상하차 담당자) 이름·전화 응답.
- **현상**: 두 라우트 모두 raw `db.select` + `withTenant`/`requireAuth` 누락. orderId 검증만 (UUID 형식).
- **확인점 (Fix 방향)**:
  - `withTenant + service 단 order ownership 검증` (EDGE-029 reader 패턴).
  - `OrderQueryRepository.findById(orderId)` 사전 검증 후 query 실행.
  - middleware `BASELINE_AUTH_REQUIRED_API` 에 `/api/sms` 추가.

#### [EDGE-5008] 공유화주 주소록 — broker 식별자 라벨 leak (HIGH, EDGE-1043 family 충돌)

- **발견일**: 2026-05-08
- **심각도**: high (공유화주 풀에서 경쟁 broker 의 거래 경로 정찰 — 영업 정보 누설)
- **상태**: fixed (`1b929d4f`) — 옵션 A 적용. `lib/format/strip-broker-prefix.ts` utility 신규 (정규식 `/^\s*주선사\s*[A-Za-z가-힣0-9]+\s*-\s*/`). UI 표시 시점만 적용 — schema 변경 없이 EDGE-1043 화주 자산 모델 사양 유지. address-table / search-address-dialog / address-delete-modal 4 곳 적용. unit test 7건 (헬퍼 6 + 모달 1).
- **재현**:
  1. broker A 로그인.
  2. `GET /api/addresses?page=1&pageSize=50&search=주선사B` → 200 + `companyId='cccc0003-...'` (공유화주 C社) 의 주소 row 에 `name='주선사B-화주C하차지등록'` / `name='주선사B-화주C상차지등록'` 노출.
- **현상**:
  - EDGE-1043 사양: 공유화주 주소록은 화주 자산 모델 (broker 간 read 공유). 주소 데이터 자체 공유는 의도된 동작.
  - 그러나 `name` 필드에 broker 식별자 prefix (`주선사B-...`) 가 들어가 broker A 가 broker B 의 작업 경로 (어디서 출발해 어디로 보내는지) 정찰 가능.
  - 의도된 'data 공유' 와 의도 안 된 'broker 작업 흔적 노출' 의 충돌.
- **확인점 (Fix 방향)**:
  - 옵션 A) UI 에서 `name` 표시 시 broker prefix 제거 (간단, schema 변경 없음).
  - 옵션 B) 라벨 자체도 broker 격리 — 화주 자산은 공유하되 `addresses` 에 `broker_aliases jsonb` 컬럼 추가하여 broker 별 별칭 분리.
  - 옵션 C) 정책 결정 — 라벨이 화주 자산이라면 의도된 노출로 명시 (`docs/CONTEXT.md` 추가).
  - 권장: A or B. C 는 영업 정보 leak 을 'feature' 로 인정하는 위험.

#### [EDGE-5009] sms/templates — DB count=0 + hardcoded mock (LOW, 운영 결함)

- **발견일**: 2026-05-08
- **심각도**: low (멀티주선사 격리와는 무관 — 운영진 SMS 템플릿 변경 불가)
- **상태**: fixed (`e88ee965`) — supabase/migrations/0057 추가 (`sms_templates` 에 `broker_company_id uuid` REFERENCES companies(id) ON DELETE SET NULL). NULL=system template (모든 broker 공유), NOT NULL=broker 전용. SmsTemplateRepository extends TenantAwareRepository — `broker_company_id IS NULL OR = self` 자동 합성. SmsTemplatesQueryService 신규. app/api/sms/templates/route.ts 재작성 (withTenant + service). unit test 2건.
- **재현**:
  1. `GET /api/sms/templates` → 200 + 5 row hardcoded.
  2. DB `SELECT COUNT(*) FROM sms_templates` → 0.
- **현상**: route 가 `defaultTemplates` 배열을 hardcoded 응답. `db.select(smsTemplates)` 미사용. 운영진이 템플릿 수정 시 코드 배포 필요.
- **확인점**: DB 기반 조회로 전환 + broker 별 template 격리 정책 결정 (또는 system templates 로 명시).

#### [EDGE-5010] broadcast 화물 cross-broker dispatch 정찰 leak (HIGH, M:N 영업비밀)

- **발견일**: 2026-05-08
- **심각도**: high (M:N 화주↔주선사 모델의 핵심 영업비밀 — 다른 broker 의 호가표 정찰로 underbid + 차주 인터셉트)
- **상태**: fixed (`603e19f0`) — `lib/tenant/tenant-aware-repository.ts` `ordersTenantWhere()` broadcast 가지에 NOT EXISTS 추가:
  ```sql
  AND NOT EXISTS (
    SELECT 1 FROM order_dispatches
    WHERE order_id = orders.id AND broker_company_id <> self
  )
  ```
  → 자기 dispatch 또는 dispatch 없는 broadcast 만 노출. 다른 broker 가 잡은 broadcast 는 list/detail 에서 404. 모든 ordersTenantWhere() 호출처 (list/detail/recent/dashboard) 일관 적용. tests/unit/lib/tenant-aware-repository.test.ts 갱신 — brokerId param 횟수 2 → 3.
- **재현 (fix 전)**:
  1. 공유화주 C社 가 broadcast 화물 등록 (broker_company_id IS NULL).
  2. broker B 가 dispatch 시도 → order_dispatches.broker_company_id = B.
  3. broker A 시점 `/api/orders/with-dispatch` list → 화물이 응답에 포함 (자기 dispatch 없음에도).
- **현상 (비즈니스)**:
  - 화주 broadcast 화물은 경매 매물, 주선사 dispatch 는 호가표.
  - broker A 가 broker B 의 호가표 (어느 차주, 얼마짜리 배차) 를 정찰 → 다음 입찰 시 underbid → broker B 매출 출혈.
  - 차주 정보 (이름/전화/차량번호) leak → broker A 가 차주 직접 컨택/인계 시도.
- **별개 발견**: 시드 데이터에 동일 cargoName "공유화주화물테스트0507-2" 가 별개 UUID 3 row — 시드 정리는 별개 task (운영 영향 없음).

#### [EDGE-5011] dispatch.created_by_snapshot historical leak — broker 전이 시 createdBy 미갱신 (CRITICAL)

- **발견일**: 2026-05-08 (FB-QA Senior 세션 #2)
- **심각도**: critical (다른 broker 직원의 이름/이메일 직접 노출 — 영업비밀 + 사회공학 표면)
- **상태**: fixed (옵션 B — `DispatchRepository.acceptOrders` UPDATE 분기에 `createdBy/createdBySnapshot` 갱신 추가, `createdAt` 보존). 신규 leak 차단 — historical row 정리 마이그레이션은 별도 commit. integration test 회귀 가드 1건 (`tests/integration/api/dispatches/accept-dispatch.integration.test.ts:EDGE-5011 — dispatch transfer createdBy 갱신`).
- **재현**:
  1. broker A (qa-broker-a@example.com) 로 로그인
  2. `GET /api/orders/with-dispatch?companyId=cccc0003-0000-0000-0000-000000000003&page=1&tab=request&limit=50`
  3. 응답 row 중 `dispatch.brokerCompanyId === self` (broker A) 인데 `dispatch.createdBy` 가 다른 broker user, `dispatch.createdBySnapshot.email` 에 다른 broker 직원 이메일이 그대로 노출.
  4. 시연 row:
     ```
     order_id              : 5e80c62e-9a9f-4fd0-94ae-7e469a492e7b ([A→C] 공유화주 가전 5톤)
     dispatch_id           : 4ac59399-cc04-420b-ac06-2b43522b9ced
     dispatch.brokerCompanyId : 11111111-aaaa (broker A) — 화물 transfer 후 stamp
     dispatch.createdBy        : bbbbbbbb-2222 (broker B user) — historical 그대로
     dispatch.createdBySnapshot: { name:"QA 주선사 B 담당", email:"qa-broker-b@example.com" }
     dispatch.updatedBy        : aaaaaaaa-1111 (broker A) — 정상 갱신됨 (비대칭)
     ```
  5. detail GET (`/api/orders/{id}`) 도 동일 leak — list/detail 양쪽 노출.
  6. 비대칭: `updatedBy/updatedBySnapshot` 은 broker A 로 정상 갱신. `createdBy/createdBySnapshot` 만 historical 잔존.
- **원인**:
  - broker B 가 broadcast 화물에 dispatch 만들면서 created_by stamp.
  - broker A 가 그 화물을 가져갈 때 (orderDispatches 가 transfer/insert 흐름 어떤지에 따라) `broker_company_id` 만 update 되고 `created_by` / `created_by_snapshot` 미갱신.
  - EDGE-5010 fix 가 broadcast 가시성 차단했으나 transfer 후 historical row 의 createdBy 잔여는 별개 leak vector.
- **운영 발생 시나리오**:
  - broker A·B 가 같은 화주 (M:N) 와 거래 → broker B 가 broadcast 화물 dispatch → 어떤 사유로 broker A 에게 화물 transfer (배차 변경, race fix, 데이터 마이그레이션) → broker A 시점 list/detail 에 broker B 직원 정보 영구 노출.
  - 또는 historical 운영 환경에 이미 잔여 row 다수 존재 가능.
- **임팩트**:
  - 영업비밀: 다른 broker 직원의 이름/이메일 직접 노출
  - 사회공학 표면: phishing target identification (이메일 confirmed)
  - 영업 전략 정찰: 어느 broker 가 어느 화물에 손댔는가 history 추적
  - dispatch transfer 자체 로그가 broker A 시점에 노출 (createdBy=B → updatedBy=A 패턴이 그대로 보임)
- **확인점 (Fix 방향)**:
  - **옵션 A (권장)**: dispatch transfer 시 `created_by` / `created_by_snapshot` 도 새 broker user 로 갱신 — `updated_by` 와 동일 정책 통일 (현재 비대칭).
  - **옵션 B**: 응답 mapper 에서 `created_by_snapshot` 을 self broker 의 user 가 아니면 마스킹 (`{ name: "(이전 주선사)", email: null }`).
  - **옵션 C**: 운영 DB 정리 마이그레이션:
    ```sql
    UPDATE order_dispatches od
    SET created_by_snapshot = updated_by_snapshot,
        created_by = updated_by
    WHERE created_by IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = od.created_by
          AND u.company_id = od.broker_company_id
      );
    ```
  - 회귀 가드 integration test:
    - dispatch transfer 후 created_by 가 새 broker user 와 일치
    - response 에 broker A 시점 dispatch 응답의 모든 createdBy ∈ broker_users[A] (정적 분석 + integration test)
- **참고**: EDGE-027 (dispatch broker leak — broker_company_id 격리) 와 EDGE-5010 (broadcast 가시성) 이 차단된 후 노출된 잔여 leak vector. broker_company_id 만 격리하는 패턴의 한계 — snapshot 컬럼도 broker 격리 정책 통일 필요.

#### [EDGE-5012] 의심 신호 — false positive 확인 (memos = EDGE-5010 의도된 차단 / audit-logs = POST-only 사양)

- **발견일**: 2026-05-08 (FB-QA Senior 세션 #2)
- **심각도**: 영향 없음 (false positive 둘 다)
- **상태**: **wontfix-by-design**
- **재검증 결과**:
  1. **memos 404 — EDGE-5010 의도된 차단**:
     - 화물 ID `4f8e625d-1254-46ea-9a01-c61fdd151a33` 의 DB 검증 결과: `broker_company_id IS NULL` (broadcast) + `order_dispatches.broker_company_id = broker B` (broker B 가 dispatch 잡음).
     - EDGE-5010 fix 의 `ordersTenantWhere()` 의 broadcast 가지 NOT EXISTS 가 broker A 시점에서 이 화물을 차단 → memos GET 도 404 정상.
     - QA 실수: 이 화물을 broker A 자기 화물로 가정하고 호출. 실제로는 broker B 가 dispatch 잡은 broadcast 라 broker A 가 못 봄.
  2. **audit-logs 405 — POST-only 사양**:
     - `app/api/audit-logs/route.ts` 는 POST 만 export (감사로그 write 전용). 엑셀 다운로드 완료/실패/취소 시 기록.
     - GET 미구현은 의도 — 감사로그 read 는 admin BI 도구 또는 별도 흐름.
- **결론**: 본 항목은 추가 코드 변경 불필요. EDGE-5010 fix + audit-logs POST-only 사양이 모두 의도대로 동작.

#### [EDGE-5014] dashboard/entry-compliance/users — 더유 직원 PII cross-broker leak (CRITICAL)

- **발견일**: 2026-05-10 (MS Senior QA — 멀티주선사 sweep #2)
- **심각도**: critical (영업비밀 + 피싱)
- **상태**: fixed (`7739b87f`) — repository.findUsersByCompany 제거 + findActiveUsersInCurrentBroker (TenantContext.requireBrokerCompanyId 사용). 라우트 3개 (users/summary/list) 에 withTenant({ allowedTypes: ['broker'] }) + withErrorHandler 적용. service/repository test 6건 추가.
- **재현**:
  1. 임의의 broker 인증 (예: qa-broker-a@example.com / qa1234)
  2. `GET /api/dashboard/entry-compliance/users` 호출 또는 `/test/dashboard/entry-compliance` 페이지 접근
  3. 응답에 더유 (THE_U_BROKER_ID = `0f668a27-8792-417e-a7bf-94b6b0d234df`) 활성 직원 15명의 id/name/email 포함
- **현상**:
  - `server/dashboard/entry-compliance/repository.ts:97` 의 `findUsersByCompany(companyId = THE_U_BROKER_ID)` hardcoded default 가 broker 격리 우회.
  - 같은 repo 의 `findOrdersByDateRange/countExcludedOrders` 는 TenantContext.requireBrokerCompanyId() 정상 사용 — `findUsersByCompany` 만 sweep 누락.
  - 라우트 3개 모두 withTenant 미적용 → summary/list 는 broker 호출 시 TenantContextMissingError 로 500 회귀까지 동반.
- **임팩트**:
  - 영업비밀: 더유의 활성 직원 명단 (15명 실명) leak → 핵심 인력 영입 시도, 조직 정찰
  - PII 유출: 이메일 leak → 피싱/스피어피싱 (CEO Fraud / BEC) 표면
- **확인점**:
  - broker A 인증 → 자기 broker 직원만 (격리)
  - broker B 인증 → 자기 broker 직원만 (격리)
  - anon 인증 → 401
  - shipper / TenantContext 미설정 호출 → throw (silent fall-through 차단)

#### [EDGE-5015] kakao/usage-stats — 인증 미적용 + broker 비격리 (HIGH)

- **발견일**: 2026-05-10
- **심각도**: high (영업비밀 + DDoS scouting)
- **상태**: fixed (`0b393969`) — middleware BASELINE_AUTH_REQUIRED_API 에 /api/kakao 추가 + 라우트 4 method (GET/POST/PUT/DELETE) 모두 withErrorHandler + withPlatformAdmin wrap. middleware test 2건 + 라우트 test 9건 추가.
- **재현**:
  1. anon (쿠키 없이) `GET /api/kakao/usage-stats`
  2. `{ totalCalls, totalCost, ... }` 글로벌 통합 통계 응답
- **현상**:
  - 라우트가 withErrorHandler/requireAuth/withTenant 어느 것도 미적용 raw export.
  - middleware 의 `BASELINE_AUTH_REQUIRED_API` 에 `/api/kakao` 누락.
  - `db/schema/kakaoApiUsage.ts` 에 broker_company_id 컬럼이 없어 broker 별 격리 자체가 schema 수준 불가 → platform_admin 전용으로 강제.
- **임팩트**:
  - 영업비밀: 카카오 API 호출량/비용 외부 노출 → 사업 규모 추정
  - DDoS scouting: avgResponseTime 으로 인프라 부하 측정
- **확인점**:
  - anon → 401 (middleware), broker_admin → 403 (withPlatformAdmin), platform_admin → 200
- **참고**: broker 별 격리가 필요해지면 schema migration (broker_company_id 컬럼 추가) + ApiUsageService 분리.

#### [EDGE-5016] /api/external/kakao/* — anon 카카오 quota abuse (MEDIUM)

- **발견일**: 2026-05-10
- **심각도**: medium (외부 API quota / 비용 abuse)
- **상태**: fixed (`eab6f2ef`) — middleware BASELINE_AUTH_REQUIRED_API 에 /api/external 추가. 라우트 자체 변경 없음. middleware test 3건 (search-address / directions × anon 401 + 인증 통과) 추가.
- **재현**:
  1. anon `GET /api/external/kakao/local/search-address?query=test` 또는 `/directions?origin=&destination=`
  2. 우리 카카오 REST API 키로 외부 호출 — 200 응답
- **현상**: middleware 의 `BASELINE_AUTH_REQUIRED_API` 에 `/api/external` 누락. 라우트 자체에도 인증 가드 없음.
- **임팩트**: 카카오 API quota 무제한 소진 + 우리 회사 비용 abuse vector. EDGE-5015 통계 endpoint 와 closed-loop (abuse 효과를 통계가 그대로 노출).
- **확인점**: anon → 401, 인증 broker/shipper → 200 (정상 카카오 응답).

#### [EDGE-5017] /api/sentry-test — production 노출 (LOW)

- **발견일**: 2026-05-10
- **심각도**: low (운영 monitoring 오염)
- **상태**: fixed (`29e36b09`) — middleware PRODUCTION_BLOCKED_API 에 /api/sentry-test 추가. middleware test 2건 (production 404 + development 200) 추가.
- **재현**:
  1. production 빌드에서 `GET /api/sentry-test?type=server-error` → 의도된 500 + Sentry.captureException 발생
  2. `?type=unhandled-rejection` → process-level unhandled promise rejection
- **현상**: middleware 의 `PRODUCTION_BLOCKED_API` 가 `/api/seed`, `/api/test` 만 차단. EDGE-4003 sweep 당시 sentry-test 누락.
- **임팩트**: 외부 누구나 운영 Sentry 에 임의 alert 트리거 → 실 incident 와 혼동. 의도된 unhandled rejection 으로 process 안정성 저하 가능.
- **확인점**: production → 404, development/staging → 200 (Sentry 통합 검증 흐름 유지).

### QA 세션 2026-05-11 (FB Senior QA #3 — 멀티주선사 격리 + M:N broadcast 화물 sweep, `5018~5021`)

> 본 세션은 페이스북 시니어 QA 시각 — EDGE-5001~5017 fix 후 잔여 사각지대 집중 sweep. 핵심 가설: **`orders.broker_company_id` 가 broker 격리의 source of truth 로 사용되는 곳 (charge / settlement assertion) 과 사용되지 않는 곳 (ordersTenantWhere broadcast / acceptOrders) 가 공존** — M:N + broadcast 모델에서 정책 통일 필요. EDGE-5013 fix 가 charge group create 만 통일했고, charge totals / settlement create / shipper context dispatch shape / acceptOrders race 는 미해결 잔존.
>
> 검증 도구: `scripts/qa-fb-multi-broker-sweep.mjs` (EDGE-5021 잔여 카운트), `scripts/qa-fb-settlement-broadcast-probe.mjs` (EDGE-5019 데드락 재현), `scripts/qa-fb-dispatch-race-probe.mjs` (EDGE-5020 race), `scripts/qa-fb-shipper-leak-confirm.mjs` (EDGE-5018 populated leak).
>
> 회귀 PASS: EDGE-5010 sequential steal (broker B 가 broker A dispatched 화물 후속 acceptOrders → 404), EDGE-5011 신규 row (acceptOrders UPDATE 분기 createdBy 갱신 정상 동작), EDGE-5013 charge group create (broadcast 화물 charge POST 정상). audit-logs POST-only + actorId JWT 추출 (forge 불가, EDGE-5012 재확인).

#### [EDGE-5018] shipper 시점 `/api/orders/with-dispatch` dispatch 응답 internal 필드 leak — 매입가/내부메모/직원이메일 (CATASTROPHIC)

- **발견일**: 2026-05-11
- **심각도**: catastrophic (broker 의 매입가 = 마진 정보 + 내부 운영 메모 + 직원 PII 가 모든 화주에게 자동 노출. 한 줄 mapper 가 분기 없이 통과시키는 점에서 모든 화주 모든 화물에 영구 노출)
- **상태**: fixed — `IShipperOrderWithDispatchDispatchDetail = Pick<IOrderWithDispatchDispatchDetail, 'id'|'brokerCompanyId'|...14필드>` (allowlist = default-deny). `mapBrokerDispatchInfo` + `mapShipperDispatchInfo` 분리, `toOrderWithDispatchListResponse` 에 `isShipper` 인자 추가, service 에서 분기 호출. single detail endpoint (`/api/orders/with-dispatch/[orderId]`) 는 frontend 호출처가 broker UI 전용이라 `withTenant({allowedTypes:['broker']})` 명시로 endpoint-level 차단 (옵션 B 양면 적용). frontend mapper input 은 `BrokerOrderWithDispatchItem` (narrow type) 으로 의도 표명. unit test 3건 (shipper internal 필드 미포함 / shipper public 필드 보존 / broker 회귀 가드). production probe (`scripts/qa-fb-shipper-leak-confirm.mjs`) 재실행 결과 `brokerMemo`/`agreedFreightCost`/`createdByEmail`/`updatedByEmail` 모두 응답에서 사라짐.
- **재현 (populated dispatch 로 확정)**:
  1. broker 화면에서 dispatch 에 `agreed_freight_cost`, `broker_memo` 가 채워진 화물 1건 준비.
  2. `qa-shipper-shared@example.com` (공유 화주 C社) 로그인.
  3. `GET /api/orders/with-dispatch?page=1&pageSize=20` 호출.
  4. 응답의 `data[].dispatch` 에 다음 필드 모두 노출 (검증 결과):
     ```json
     {
       "brokerMemo": "INTERNAL: 차주 전화 통화 — 출발 1시간 늦춰달라고 요청",
       "agreedFreightCost": 350000,
       "createdBySnapshot": { "email": "qa-broker-b@example.com" },
       "updatedBySnapshot": { "email": "qa-broker-a@example.com" },
       "brokerManagerSnapshot": { "email": "qa-broker-a@example.com" }
     }
     ```
- **현상**:
  - `OrderDetailQueryService` (`server/order/application/queries/order-detail-query.service.ts:24`) 는 `userType === 'shipper'` 분기로 charge 를 empty 처리 + 응답에 `agreedFreightCost` / `brokerMemo` / `createdBy*` 미포함 (✅ 정상).
  - `OrderWithDispatchService` (`server/order/application/queries/order-with-dispatch.service.ts:45`) 는 `isShipper` 를 charge 분기에만 사용, dispatch shape 분기 미적용.
  - `toOrderWithDispatchResponse` + `mapDispatchInfo` (`server/order/application/queries/dto/response/order-with-dispatch.response.ts:57-79, 91-98`) 가 userType 파라미터 없음 — dispatch row 의 모든 컬럼 (agreedFreightCost / brokerMemo / createdBy / updatedBy snapshot) 그대로 통과.
  - 라우트 `app/api/orders/with-dispatch/route.ts` allowedTypes: `['broker', 'shipper']`.
- **임팩트 (TMS 도메인)**:
  - **마진 leak (catastrophic)**: 화주가 broker 에 지불한 매출 X 와 응답의 `agreedFreightCost` Y 차이 = broker 마진. 모든 화물에 대해 화주가 직접 마진 계산 가능 → 가격 협상 우위 영구 상실. 주선사 비즈니스 모델 핵심 정보 노출.
  - **운영 정찰**: brokerMemo 의 "차주 통화 → 1시간 늦춰달라" 같은 운영 process 내부가 화주에게 노출 → broker 약점/사고 이력 추정 가능.
  - **사회공학 표면**: M:N 화주(공유 화주 C社) 는 거래하는 모든 broker 의 직원 이메일 한 번에 enumeration → underbid 유도 / phishing target.
- **확인점 (Fix 방향)**:
  - **옵션 A (권장)**: `mapDispatchInfo` 에 `userType: 'broker' | 'shipper'` 파라미터 추가. shipper context 면 internal 필드 7개 (`agreedFreightCost`, `brokerMemo`, `createdBy`, `createdBySnapshot`, `updatedBy`, `updatedBySnapshot`, `assignedDriverPhone` 일부 정책에 따라) 제거 또는 마스킹.
  - **옵션 B**: shipper-only response DTO (`ShipperOrderWithDispatchResponse`) 별도 정의 + service 에서 분기 매핑.
  - **옵션 C**: 응답 mapper 가 사용하는 필드 자체를 select 단계에서 broker context 만 fetch (DB 응답 shape 자체를 분리).
  - 회귀 가드 integration test: shipper 컨텍스트 + populated dispatch (`agreed_freight_cost`, `broker_memo` 채움) → 응답 shape 에 internal 필드 미포함 assertion.

#### [EDGE-5019] broadcast 화물 운송마감 데드락 — `getChargeTotals` + `assertOrderOwnedByCurrentBroker` strict eq 잔존 (CRITICAL, EDGE-5013 follow-up)

- **발견일**: 2026-05-11
- **심각도**: critical (broker 가 dispatch 가능한 broadcast 화물의 settlement create 가 영구 차단 — 매출 누락 + misleading 에러)
- **상태**: fixed — 옵션 B (격리 함수 통일) 적용. `ChargeRepository.getChargeTotals` (charge-query.repository.ts:95) + `SettlementRepository.assertOrderOwnedByCurrentBroker` (settlement.repository.ts:267) 두 곳을 `eq(orders.brokerCompanyId, this.brokerId)` strict eq → `this.ordersTenantWhere()` 로 통일. EDGE-5013 의 `EntityLookupReader` fix 와 동일 패턴 — broadcast 화물 + active broker_company_profiles 가시. EDGE-5010 NOT EXISTS 가지가 다른 broker dispatch 잡은 broadcast 차단 정책도 자동 승계. detailAccessors 회귀 가드에 `ChargeRepository.getChargeTotals` 추가 (`tests/integration/tenant-isolation/tenant-isolation.integration.test.ts`). production probe (`scripts/qa-fb-settlement-broadcast-probe.mjs`) 재실행 결과 `POST /api/orders/{id}/settlement` 응답 200 + `order_sales` 1건 INSERT (total_amount: 220000) 확인. 옵션 A (orders.broker_company_id retroactive stamp + migration) 는 EDGE-5013 commit 메시지에서 보류한 alternative — 데이터 변경 부담 + acceptOrders 흐름 변경. 옵션 B 가 EDGE-5013 와 일관성 + 변경 범위 최소.
- **재현 (DB 직접 조작 + HTTP 호출)**:
  1. shipper C 가 broadcast 화물 X 등록 (`orders.broker_company_id IS NULL`).
  2. broker A 가 `POST /api/orders/accept-dispatches` 로 X dispatch (`order_dispatches.broker_company_id = A`).
  3. broker A 가 X 에 차주 배정 + `charge_lines` (sales/purchase) 입력.
  4. broker A 가 `POST /api/orders/{X}/settlement` 호출.
  5. **응답: 400 `{"success":false,"error":"청구금이 입력되지 않았습니다. 0원이라도 입력해 주세요."}`** — 청구금 입력했음에도 동일.
  6. DB 검증: `order_sales` 0건, broadcast 화물 6건이 production 에 같은 데드락 후보로 잠재.
- **현상 (코드 분석)**:
  - `acceptOrders` (`server/dispatch/infrastructure/dispatch.repository.ts:217-262`) 는 `order_dispatches.broker_company_id` 만 stamp, **`orders.broker_company_id` 영구 NULL 유지**.
  - `getChargeTotals` (`server/charge/infrastructure/charge-query.repository.ts:95`) 가 `INNER JOIN orders ON broker_company_id = self` 사용 → broadcast 화물의 charge_lines 가 0 카운트 → "청구금이 입력되지 않았습니다" misleading 에러.
  - `assertOrderOwnedByCurrentBroker` (`server/settlement/order-creation/infrastructure/settlement.repository.ts:267`) 도 `eq(orders.brokerCompanyId, this.brokerId)` strict eq → 우회해도 다음 단계에서 throw.
  - EDGE-5013 fix (`EntityLookupReader.findOrderById` 만 `ordersTenantWhere()` 로 통일) 가 charge group create POST 는 fix 했지만 **같은 root cause 의 charge totals / settlement assertion 미해결**.
- **임팩트**:
  - 운영자: 운송 완료 직전 단계까지 정상 진행 후 운송마감 클릭 시 잘못된 에러 → 시간 낭비 + 결국 수기 우회.
  - 매출: broadcast 화물 dispatch 한 broker 의 매출/매입 정산 영구 불가 → 매출 누락 (회계 손익 왜곡).
  - 현재 production: 6건 broadcast + dispatched 잠재 데드락 후보. 운영 흐름 진행 시 에러 폭발.
- **확인점 (Fix 방향)**:
  - **옵션 A (권장)**: `acceptOrders` 가 `orders.broker_company_id` 도 함께 stamp (broadcast → assigned broker). EDGE-5011 의 createdBySnapshot 갱신 패턴 확장. 단점: 운영 DB retroactive migration (broadcast + dispatched 6건 stamp) 필요. 장점: 모든 strict eq 호출처 자동 수렴.
  - **옵션 B**: `getChargeTotals` / `assertOrderOwnedByCurrentBroker` 가 `ordersTenantWhere()` 또는 dispatch.broker_company_id 기반 ownership 으로 격리 통일 — 정책 일관성. EDGE-5013 패턴 동일 적용.
  - **옵션 C**: 정책 결정 — broadcast 화물은 운송마감 흐름 봉쇄 명시 (사용자 가이드 + 명시적 에러 메시지 "broadcast 화물은 직접 등록한 화물로 마이그레이션 후 정산").
  - 회귀 가드 integration test: broadcast 화물 + broker dispatch + 차주 배정 + charge 입력 → settlement create 200 + order_sales 1건 INSERT.
- **참고**: EDGE-5013 commit 메시지에 옵션 A 가 alternative 로 거론됐지만 채택 안 됨. 같은 family 의 잔여 호출처 발견.

#### [EDGE-5020] `acceptOrders` 동시 race → 같은 order_id 에 중복 dispatch row 2건 (CRITICAL)

- **발견일**: 2026-05-11
- **심각도**: critical (M:N broadcast 화물 마켓의 first-come-first-served 계약 깨짐. 중복 차주 배정 / 정산 카오스 / 화물 분실 환영 가능)
- **상태**: fixed — 옵션 A (UNIQUE 제약 + ON CONFLICT) 적용. (1) audit (`scripts/qa-fb-dispatch-duplicate-audit.mjs`) 로 production 잔여 1 row 식별 (charge FK 영향 0), (2) cleanup migration (`scripts/qa-fb-dispatch-duplicate-cleanup.mjs`) 로 가장 최근 row 만 보존, (3) drizzle schema 에 `uniqueIndex('order_dispatches_order_id_unique').on(table.orderId)` 추가 + 마이그레이션 `0058_redundant_scrambler.sql` push, (4) `acceptOrders` (`server/dispatch/infrastructure/dispatch.repository.ts:246-275`) INSERT 분기를 `.onConflictDoNothing({ target: orderDispatches.orderId }).returning({ id })` 패턴 + `inserted.length === 0` 시 `DispatchAlreadyAcceptedError(orderId)` (httpStatus 409) throw. 도메인 에러 신규 등록 (`server/dispatch/domain/errors/dispatch.errors.ts`). probe (`scripts/qa-fb-dispatch-race-probe.mjs`) 재실행 결과 broker A 200 (first-come winner) + broker B 409 "이미 다른 주선사가 운송을 수락한 화물입니다." + DB 1 dispatch row 확인. **UPDATE 분기 race (transfer 시 두 broker 동시 가로채기) 는 별도 후속** — sequential 가로채기는 EDGE-5010 NOT EXISTS 가 이미 차단, 동시 transfer race 는 다른 시나리오.
- **재현 (검증 스크립트 결과)**:
  1. shipper C 가 broadcast 화물 X 등록.
  2. broker A 와 B 의 `POST /api/orders/accept-dispatches` 를 `Promise.all` 로 동시 호출.
  3. 두 응답 모두 200 + `{updatedOrders:1, insertedDispatches:1}`.
  4. DB 검증: `SELECT * FROM order_dispatches WHERE order_id = X` → **2 row** (broker A 1건, broker B 1건, `created_at` 차이 1ms).
- **현상 (코드 분석)**:
  - `order_dispatches` 테이블에 `order_id` UNIQUE 제약 없음 (`pg_indexes` 검증: `order_dispatches_pkey` (id) + `idx_order_dispatches_order_id` (non-unique) 만 존재).
  - `acceptOrders` (`server/dispatch/infrastructure/dispatch.repository.ts:206-261`) 패턴: `SELECT existing` → if rows then UPDATE else INSERT — row-level lock 없음.
  - `accept-dispatch-command.service.ts:57-62` 의 `findById` ownership 사전 검증 (EDGE-043) 도 SELECT 시점 race window 내 → 두 broker 모두 통과.
- **임팩트**:
  - 두 broker 모두 자기 dispatch 가 있다고 인식 → 각자 다른 차주 배정 → **한 화물에 차주 2명 출동** (운송 충돌, 차주 헛걸음 → 신뢰 손상).
  - 양쪽 broker 가 settlement 시도 → orderSales unique (order_id) 로 한 명 fail (운영 카오스).
  - List 표시: EDGE-5010 NOT EXISTS 가지로 "다른 broker dispatch 가 있으면 자기 list 에서 제거" → **양쪽 모두 list 에서 화물 사라짐 (유령 화물)**.
  - 화주: 누가 운송 중인지 추적 불가능.
- **확인점 (Fix 방향)**:
  - **옵션 A (권장)**: `order_dispatches` 에 `UNIQUE (order_id)` 제약 추가 (마이그레이션). 동시 INSERT 중 1건만 살아남고 나머지는 PostgreSQL 23505 에러 → race 패배자 명확. 신규 dispatch 의 1:1 모델 강제.
  - **옵션 B**: `acceptOrders` 흐름에 `SELECT ... FOR UPDATE` (orders row 잠금) 또는 advisory lock 추가 — TX 직렬화. PostgreSQL pooler 환경에서 lock 획득 검증 필요.
  - **옵션 C**: `INSERT ... ON CONFLICT (order_id) DO NOTHING` 패턴 (atomic upsert) — 두 번째 broker 는 silent skip + 응답에 명확한 패배 메시지.
  - application: race 패배자에 명확한 에러 ("이미 다른 주선사가 수락했습니다") 응답.
  - 회귀 가드 integration test: Promise.all 로 두 broker acceptOrders fixture → 결과적으로 1 dispatch row + 한쪽 broker 명확히 패배 (409 또는 명확한 메시지).
- **참고**: 이 문제는 단일 broker 시절(legacy)엔 없었음. M:N broadcast 모델 도입 후 노출된 race window. EDGE-5010 (sequential steal 차단) 와 EDGE-5011 (snapshot 갱신) fix 가 신규 시나리오 안전성을 일부 강화했지만 동시 acceptOrders race 는 별개 vector.

#### [EDGE-5021] EDGE-5011 historical 잔여 production 2건 — cleanup migration 미실행 (MEDIUM, EDGE-5011 follow-up)

- **발견일**: 2026-05-11
- **심각도**: medium (다른 broker 직원 이메일 historical 노출 — 영업 정찰 + compliance 표면, 영향 row 수 한정)
- **상태**: fixed — DML cleanup migration script `scripts/qa-fb-edge5021-historical-cleanup.mjs` 작성 (DRY_RUN 검증 후 실제 UPDATE). 정책: dispatch.created_by user 의 company_id 가 dispatch.broker_company_id 와 다르면 created_by/created_by_snapshot 을 updated_by/updated_by_snapshot 으로 동기화 (transfer 후 stamp 일관). 실행 결과 2 row UPDATE (dispatch 4ac59399, e4cefe56 — 둘 다 broker A 의 화물에 historical broker B 직원 이메일 잔존), 사후 검증 historical 잔여 0건 확인. EDGE-5011 fix 가 신규 transfer 차단했고 EDGE-5021 가 historical 잔여 정리 — family 완결.
- **재현 (DB 직접 쿼리)**:
  ```sql
  SELECT od.id AS dispatch_id, od.broker_company_id, od.created_by_snapshot->>'email' AS created_email,
         u.company_id AS user_company
  FROM order_dispatches od
  LEFT JOIN users u ON u.id = od.created_by
  WHERE od.created_by IS NOT NULL
    AND od.broker_company_id IS NOT NULL
    AND u.company_id IS NOT NULL
    AND u.company_id <> od.broker_company_id;
  ```
  결과 (2026-05-11 기준):
  | dispatch_id | dispatch.broker_company_id | created_by email | user.company_id |
  |---|---|---|---|
  | `4ac59399-cc04-420b-ac06-2b43522b9ced` | `11111111-aaaa` (broker A) | `qa-broker-b@example.com` | `22222222-bbbb` (broker B) |
  | `e4cefe56-764d-4d0c-b7a5-f0c3c8f21ea2` | `11111111-aaaa` (broker A) | `qa-broker-b@example.com` | `22222222-bbbb` (broker B) |

- **현상**: EDGE-5011 fix (`acceptOrders` UPDATE 분기 createdBy/Snapshot 갱신) 가 신규 dispatch transfer 는 차단했지만, **이전 race/transfer 로 생성된 historical row 의 createdBySnapshot 은 그대로** — broker B 직원 이메일이 broker A 시점 list / detail 에 영구 노출.
- **임팩트**:
  - 영업 정보 leak: 다른 broker 직원 이메일 (PII)
  - 사회공학 표면: phishing target (확인된 이메일)
  - 보안 감사 시점 발견 가능 (legal/compliance flag)
  - 영향 row 한정 (현재 2건). 신규 발생은 EDGE-5011 fix 로 차단됨.
- **확인점 (Fix — cleanup migration SQL)**:
  ```sql
  -- EDGE-5021: dispatch.created_by 가 다른 broker user 인 historical row 정리
  -- (acceptOrders UPDATE 분기에서 갱신 누락된 row 들)
  UPDATE order_dispatches od
  SET created_by = od.updated_by,
      created_by_snapshot = od.updated_by_snapshot
  WHERE od.created_by IS NOT NULL
    AND od.updated_by IS NOT NULL
    AND od.broker_company_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = od.created_by
        AND u.company_id IS NOT NULL
        AND u.company_id <> od.broker_company_id
    )
    AND EXISTS (
      SELECT 1 FROM users u2
      WHERE u2.id = od.updated_by
        AND u2.company_id = od.broker_company_id
    );
  -- 검증: 위 SELECT 쿼리 재실행 → 0 rows.
  ```
  - 적용 전 백업 권장 (`pg_dump` audit). DML 마이그레이션이므로 수동 실행 (CLAUDE.md `Drizzle 마이그레이션 워크플로우` 참조).
- **참고**: EDGE-5011 doc 의 "옵션 C" 마이그레이션과 동일 의도. fix-deploy 후 운영팀이 cleanup 실행 안 한 것으로 추정.

---

### 격리 수정 시 회귀 가드 (베이스라인)

#### 신규 broker-only repository 추가 시 (EDGE-027 + EDGE-029 관련)

orders 격리 분기 패턴은 두 가지가 공존하면 안 된다:

1. **`ordersTenantWhere()` 사용** — broker A 시점에서 직접 stamp + broadcast 둘 다 노출 (M:N 화주 시나리오)
2. **`eq(orders.brokerCompanyId, brokerId)` 또는 `brokerScoped()` 사용** — broadcast 화물 못 봄

같은 화면을 만드는 list ↔ detail ↔ change-log ↔ contacts 가 1번/2번 섞이면 EDGE-029 / EDGE-030 회귀.

신규 메서드 추가 시:
- broker / shipper 분기 `ordersTenantWhere()` 로 통일
- `OrderQueryRepository` 처럼 `eq(brokerCompanyId, self)` 만 쓰는 메서드 추가 금지 (또는 명시적으로 'broadcast 못 봄' 의도 주석 + 호출처 검증).

#### 신규 LEFT JOIN 추가 시 (EDGE-027 관련)

orders 외에 broker_company_id 컬럼을 가진 다른 테이블 (orderDispatches, orderSales, orderPurchases, salesBundles, purchaseBundles 등) 을 LEFT JOIN 할 때, 그 테이블의 broker_company_id 격리 조건도 JOIN 절에 포함:

```ts
.leftJoin(orderDispatches, and(
  eq(orders.id, orderDispatches.orderId),
  ctx.userType === 'broker' ? eq(orderDispatches.brokerCompanyId, this.brokerId) : undefined,
))
```

shipper 시점은 dispatch broker 정보가 정상 노출 — 자기 화물의 운송자 식별용.

---

## 엣지케이스 추가 가이드

---

## /broker/sale, /broker/purchase (정산 요약 패널)

### 표기

#### [EDGE-5022] 정산 요약 패널 금액 소수점 노출 (PRD EX-04 위반)

- **발견일**: 2026-05-11
- **심각도**: medium
- **상태**: fixed (`components/broker/settlement/settlement-summary-panel.tsx` `Amount` 컴포넌트에 `Math.round` 추가)
- **재현**:
  1. `/broker/sale` 진입 → 대기·대사·완료 어느 탭이든
  2. 패널 금액 표기 확인
- **현상**: `497,638,079.8원`, `1,582,910,663.3원` 처럼 소수점 한 자리 노출
- **원인**: `sales_bundles.totalAmount` / `orderSales.totalAmount` 가 `numeric(14,2)` 라 소수점 가능. `lib/format.ts` 의 `formatCurrency` 가 `Number.toString()` 만 콤마 처리 → 소수점 그대로 통과.
- **확인점**: PRD EX-04 "1원 단위까지 표시" → 정수만 노출되어야 함. `Math.round(value)` 처리 필수.
- **회귀 가드**: `tests/unit/components/broker/settlement/settlement-summary-panel.test.tsx` 에 "금액에 소수점이 있어도 1원 단위로 라운드되어 표시된다" 테스트 추가.

#### [EDGE-5023] 매출/매입 번들 summary 가 live adjustment 미합산 — 패널 vs list 표시 약 3억원 차이 (P0)

- **발견일**: 2026-05-11
- **심각도**: critical (회계/정산 정확성 직격, 운영 데이터 누적 시 책임 분쟁)
- **상태**: open
- **재현**:
  1. `/broker/sale?tab=MATCHING` 진입 후 `GET /api/charge/sales-bundles/summary?status=draft` 로 패널 합계 추출
  2. 같은 필터로 `GET /api/charge/sales-bundles?status=draft&page=1&pageSize=100&sortBy=updatedAt&sortOrder=desc` 페이징 전수 수집
  3. row 별 `totalAmount + totalTaxAmount + itemExtraAmount + itemExtraAmountTax + bundleExtraAmount + bundleExtraAmountTax` 합산 → 패널 합계와 비교
- **현상**: 매출 대사 100건 기준 패널 `1,582,910,663원` vs list 행 합 `1,879,849,943원` — 차이 `296,939,280원`. 단일 bundle `c6e9f634-6546-...` 의 `itemExtraAmount=166,704,890원` 이 summary 합산서 누락.
- **원인**: `server/charge/sales-bundle/infrastructure/sales-bundle-list.repository.ts:270~313` `summarize()` SQL 이 `bundle.totalAmount + totalTaxAmount` 만 SUM. `findMany()` 는 `withLiveAdjustmentTotals()` 로 4 컬럼 추가 SELECT/병합 → 비대칭. 매입 `purchase-bundle-list.repository.ts:136~169` 동일 패턴 (현재 adjustment 데이터 0건이라 차이 미발생, 코드 결함은 동일).
- **확인점**: summary `totalAmount` = list row 합 (`totalAmount + totalTaxAmount + itemExtraAmount + itemExtraAmountTax + bundleExtraAmount + bundleExtraAmountTax`).
- **수정 방향**: summary SQL 의 SUM 식에 4개 extra 컬럼 추가. 회귀 가드 — bundle 에 adjustment 추가 후 summary 와 row 합 일치 integration test (매출/매입 양쪽).

#### [EDGE-5024] 세금계산서 발행/취소 후 summary invalidate 누락 (PRD EX-05 위반)

- **발견일**: 2026-05-11
- **심각도**: high (운영 흐름 stale 표시 → 중복 발행 시도)
- **상태**: open
- **재현**:
  1. 매출 대사 탭 진입 → `unissuedTaxinvoiceCount = N` 확인
  2. 임의 bundle 한 건 세금계산서 발행 (전자/외부/수정 어느 경로든) 또는 취소
  3. 발행 응답 200 후 매출 대사 탭 패널 재확인 → `unissuedTaxinvoiceCount` 가 즉시 N-1 로 감소하는지 검증
- **현상**: 발행 직후에도 N 표시 (stale). 페이지 새로고침 또는 다른 mutation 발생까지 갱신 안 됨.
- **원인**: `components/common/tax-invoice/tax-invoice-issue-modal.tsx`, `hooks/use-tax-invoice-data.ts`, `store/tax/tax-invoice-store.ts` 어디에도 `queryClient.invalidateQueries({ queryKey: settlementKeys.summaries() })` 호출 없음 (grep 0 hit). bundle 생성/수정/삭제 mutation 들은 `use-sales-bundles-queries.ts:50,67,82` / `use-purchase-bundles-queries.ts:70,87,102,134` 에 invalidate 호출 — 발행/취소만 누락.
- **확인점**: PRD EX-05 "건 처리 완료 시 패널 자동 갱신. 건 처리 범위: 정산 상태 변경, 정산 삭제, 그룹 편집, 세금계산서 발행/취소".
- **수정 방향**: `TaxInvoiceIssueModal` onSuccess 4 경로 (전자발행/외부발행/수정발행/취소) 에 `invalidateQueries({ queryKey: settlementKeys.summaries() })` 추가. `.claude/knowledge/feature-impact-map.md:129-138` 가이드 따름.

#### [EDGE-5025] Summary API 응답에 소수점 노출 (EDGE-5022 표시 단 가드의 한계)

- **발견일**: 2026-05-11
- **심각도**: high (회계 시스템 호환성)
- **상태**: open
- **재현**:
  1. `GET /api/charge/sales-bundles/summary?status=draft` → response body 의 `totalAmount` 확인
  2. `GET /api/charge/purchase/waiting/summary` → response body 의 `totalAmount` 확인
- **현상**: `totalAmount: 1582910663.3` (매출 대사), `totalAmount: 663743036.3` (매입 대기) — 소수점 한 자리 노출.
- **원인**: summary SQL `COALESCE(SUM(...), 0)` 가 numeric(14,2) 누적 결과를 그대로 직렬화. 패널 `Amount` 컴포넌트의 `Math.round` (EDGE-5022 fix) 는 표시 단에서만 가드 — API 응답을 직접 사용하는 외부 (엑셀 다운로드, 매출 보고 메일, 외부 ERP 연동) 는 소수점 그대로 전파.
- **확인점**: PRD EX-04 "1원 단위까지 표시". API 응답도 정수여야 안전.
- **수정 방향**: repository `summarize()` SQL 에 `ROUND(SUM(...))::bigint` 적용 또는 service 레이어 응답 변환 시 일관 라운드 헬퍼 도입 (`Amount` 컴포넌트의 처리와 한 곳으로 통일).

#### [EDGE-5026] 매출 대기 ↔ 대사 선착불 판정 기준 불일치 위험 (P1)

- **발견일**: 2026-05-11
- **심각도**: medium (POL-01 통합 정의 위반 가능, mapper 동작에 따라 카운트 분기)
- **상태**: open (mapper 검증 필요)
- **재현**:
  1. 매출 대기 탭에서 `orders.settlementType='PREPAID'` 화물 1건 선택 → 단건 정산 생성
  2. 매출 대사 탭에서 해당 bundle 의 `billingBase`, `billingEntityType` 확인
- **현상**: 대기 패널은 `orders.settlementType = 'PREPAID'` 로 prepaid 카운트, 대사 패널은 `salesBundles.billingBase='carrier' AND billingEntityType='driver'` 로 판정. 정산 생성 mapper 가 자동 매핑 안 하면 동일 화물이 다르게 카운트.
- **확인점**: PREPAID 화물 정산 시 mapper 가 `billingBase='carrier' + billingEntityType='driver'` 강제.
- **수정 방향**: `mapSettlementFormToSalesBundleInput` 검토. mapper 보정 + integration test (PREPAID → carrier/driver 매핑 보장).

#### [EDGE-5027] 매출 페이지 URL 직접 진입 시 summary status 누락 — 전탭 집계 노출 (CRITICAL, 12배 차이)

- **발견일**: 2026-05-11
- **심각도**: critical (회계 의사결정 직접 왜곡 — 완료 탭에서 매출 12배 부풀려 노출)
- **상태**: fixed (`components/broker/settlement/settlement-summary-panel.tsx` 의 `BUNDLE_STATUS_BY_TAB` 강제 매핑)
- **재현**:
  1. `/broker/sale?tab=COMPLETED` URL 로 직접 진입 (북마크/링크 클릭 — 일상 시나리오)
  2. 패널 수치 vs 목록 total 비교
- **현상**: 패널 `총 109건 / 1,777,888,963원` 노출, 실제 완료 = 9건 / 1억9천5백 → 12배 차이. 매출 대사 탭도 동일 패턴.
- **원인**: 매출 store `salesBundlesFilter.status` default `undefined`. store `setTabMode` 가 (매입과 달리) status 자동 셋팅 없음 — `handleTabChange` (click 이벤트) 만 셋팅 → URL 직접 진입 시 status 미설정 → summary API 가 status 필터 없이 전탭 집계 (draft + issued + paid + canceled).
- **수정**: panel sub-component (`SalesBundleSummaryPanel`, `PurchaseBundleSummaryPanel`) 가 tab prop 기준으로 `BUNDLE_STATUS_BY_TAB[tab]` 을 강제 주입 (외부 filter 의 status 보다 우선). 외부 filter 가 비어있어도 안전. 매입도 동일 적용으로 일관성.
- **회귀 가드**: `tests/unit/components/broker/settlement/settlement-summary-panel.test.tsx` 의 "filter.status 비어있어도 status='draft'로 fetcher 호출" 등 4 케이스.

#### [EDGE-5028] 펼침 상태 탭 이동 후 유지 (PRD DesignSpec 2.2 위반)

- **발견일**: 2026-05-11
- **심각도**: medium (UX — 데이터 손실 아님, PRD 명시 위반)
- **상태**: fixed (`useExpandedWithTabReset` 훅 + closest tabpanel data-state observer)
- **재현**:
  1. 매입/매출 대사 탭 → 패널 펼치기 (▲ 클릭)
  2. 완료 탭 클릭 → 다시 대사 탭으로 돌아옴
- **현상**: 패널이 펼침 상태 그대로 노출. PRD 2.2: "다른 탭 → 현재 탭 재진입 → 접힌 상태로 초기화" 명시 위반.
- **원인**: Radix Tabs 가 비활성 TabsContent 를 unmount 하지 않고 `hidden=""` 속성으로 mount 유지. sub-panel 의 `useState(false)` 가 살아있어 펼침 상태 보존.
- **수정**: sub-panel 외부 div 에 `ref` 부여 후 `closest('[role="tabpanel"]')` 로 부모 TabsContent 찾기. `MutationObserver` 가 `data-state` 변경 감지 → `inactive` 가 되는 순간 `setExpanded(false)`. tabpanel ancestor 없으면 no-op (안전망).
- **회귀 가드**: `tests/unit/components/broker/settlement/settlement-summary-panel.test.tsx` 의 "부모 TabsContent 의 data-state 가 inactive 가 되면 펼침 상태가 자동 접힌다" 테스트.

#### [EDGE-5029] 매출 대기 탭에서 기존 `WaitingSummary` + 신규 `SettlementSummaryPanel` 동시 sticky 노출 (디자인 결정 대기)

- **발견일**: 2026-05-11
- **심각도**: low (UX — 화면 영역 잠식, 비즈니스 데이터 영향 없음)
- **상태**: open (디자인 의사결정 대기)
- **재현**: 매출 대기 탭 → 화물 1건 이상 선택 → 두 sticky 카드 동시 노출 (`선택 정산 요약` + `요약 현황`)
- **현상**: 화면 하단에 두 카드 겹쳐 노출. PRD 의도: 신규 패널은 "탭 전체 처리 보드", 기존 WaitingSummary 는 "선택 화물 그룹/단건 정산 액션 트리거" — 서로 다른 정보지만 sticky 충돌.
- **수정 방향**: (1) 기존 WaitingSummary 를 신규 패널 안으로 통합, (2) 두 카드를 가로 split, (3) 선택 시 신규 패널 숨김. 디자인 결정 필요.

#### [EDGE-5030] 매출/매입 adjustment 12 mutation 모두 `summaries()` invalidate 누락 (P0, EDGE-5023 후속 결함)

- **발견일**: 2026-05-11
- **심각도**: critical (회계 데이터 stale — 사용자가 adjustment 추가 후 패널 미갱신)
- **상태**: fixed (commit `e830b5ee` — MutationCache global onSuccess + meta.invalidates 추상화)
- **재현**:
  1. 매출/매입 정산 sheet 진입 → bundle adjustment 추가
  2. 패널 (총 청구 금액 / 단건 / 그룹) 즉시 갱신 여부 확인
- **현상 (수정 전)**: adjustment 추가/수정/삭제 직후 패널 stale. 다른 mutation 또는 페이지 새로고침까지 잘못된 합계.
- **원인**: 매출/매입 adjustment hook 12개 (bundle/item × add/edit/remove × 매출/매입) 의 onSuccess 가 `adjustmentKeys.bundleAdjustment(id) + freightList(id)` 만 invalidate. `settlementKeys.summaries()` + `settlementKeys.salesBundles()/purchaseBundles()` 누락. EDGE-5023 fix (summary 가 adjustment 합산) 후 발생한 후속 결함.
- **수정 방향**: 한 줄씩 invalidate 추가 가능했으나, 같은 종류 결함이 7+ 곳에 분산 → 횡단관심사 추상화 도입. `MutationCache.onSuccess` 의 global handler 가 `mutation.options.meta?.invalidates` 를 prefix 매칭으로 일괄 무효화. 21 mutation 의 onSuccess 보일러플레이트 제거 → `meta: { invalidates: [...] }` 선언적 한 블록으로 대체.
- **회귀 가드**: TanStack Query `Register` interface augmentation 으로 `meta.invalidates` 타입 좁힘 (`types/react-query.d.ts`). 새 mutation 추가 시 `meta` 슬롯에 정확한 QueryKey 배열 만 들어가도록 컴파일 타임 강제.

#### [EDGE-5031] 매입 단건/멀티단건 mutation `summaries()` invalidate 누락 (P0)

- **발견일**: 2026-05-11
- **심각도**: critical (매입 대기 → 대사 전환 시 패널 stale)
- **상태**: fixed (commit `e830b5ee` — EDGE-5030 추상화에 함께 흡수)
- **재현**: 매입 대기 탭 → 단건 정산 또는 멀티 단건 정산 발사 → 대기 건수/금액 즉시 감소 + 대사 건수/금액 즉시 증가 여부 확인
- **현상 (수정 전)**: 패널 stale. mutation hook 의 onSuccess 가 `purchaseBundles + waitingItems` 만 invalidate.
- **원인**: `useCreateSinglePurchaseBundle` / `useCreateMultiSinglePurchaseSettlement` 의 onSuccess 에서 `settlementKeys.summaries()` 누락. 매출 측은 store action 패턴이라 page.tsx 콜백에서 명시적 invalidate — 매입은 hook 패턴인데 hook 자체에서 누락.
- **수정**: EDGE-5030 추상화의 `meta.invalidates` 패턴 적용. 매입 단건/멀티단건 hook 도 동일 `PURCHASE_BUNDLE_MUTATION_INVALIDATES` 셋 사용.
- **검증**: 브라우저로 833→832건, 663,743,036→663,677,036원 (-66,000원). 매입 대사 1841→1842건, 단건 1839→1840 즉시 갱신 확증.

#### [EDGE-5033] 세금계산서 Popbill 백그라운드 동기화 후 패널 stale (PRD EX-05)

- **발견일**: 2026-05-11
- **심각도**: high (운영 흐름 — 사용자가 sheet 열어둔 채 stale 표시)
- **상태**: fixed (commit `583005af` — `useTaxInvoiceData.syncStatus()` 안 `useQueryClient` 직접 호출)
- **재현**: 매출/매입 sheet 에서 세금계산서 발행 → Popbill 가 'processing' → 'confirmed' 비동기 전환 → sheet 열어둔 채 syncStatus 폴링 → 같은 페이지 정산 요약 패널의 `unissuedTaxinvoiceCount` 갱신 확인
- **현상 (수정 전)**: sheet 안 invoiceConfirmStatus 는 갱신되지만 패널의 미발행 건수 stale.
- **원인**: `syncStatus` 는 `useCallback` 안 비동기 함수 — mutation 라이프사이클 (EDGE-5030 의 meta 추상화) 안 닿음. Spring AOP 의 같은 클래스 내부 호출과 동일 한계.
- **수정**: hook 안에서 `useQueryClient()` 직접 사용. `invoiceConfirmStatus` 변경 감지 시 `settlementKeys.summaries()` + bundleType 분기 (`salesBundles()` or `purchaseBundles()`) invalidate.

#### [EDGE-5034] summary useQuery 의 retry 정책 과함 — 빠른 필터 변경 시 죽은 query 폴링 비용

- **발견일**: 2026-05-11
- **심각도**: medium (네트워크/메모리 낭비, UX 미미)
- **상태**: fixed (commit `5ac814e9` — useQuery 에 `retry: 1` 명시)
- **원인**: client default 의 5xx retry 3회 + exponential backoff (1s, 2s, 4s) — summary 같은 단순 GET 에는 과함. 빠른 필터 변경 시 죽은 query 가 최대 7초간 폴링.
- **수정**: 4 summary useQuery 에 `retry: 1` 명시. 초기 시도 + 1 회 재시도 = 총 2 회 요청. PRD EX-02 "자동 재시도 후 실패" 정신 충족.
- **회귀 가드**: hook 의 retry 옵션이 client default 보다 우선이라 단위 테스트의 `wrapWithClient` 의 `retry: false` override 무시 → 테스트 timeout 5초로 보강 (`settlement-summary-panel.test.tsx`).

#### [EDGE-5035] 필터 변경 시 패널 깜빡임 — placeholderData 미사용 (PRD EX-03 정신 위반)

- **발견일**: 2026-05-11
- **심각도**: medium (UX 깜빡임, 비즈니스 데이터 영향 없음)
- **상태**: fixed (commit `5ac814e9` — `placeholderData: keepPreviousData` 적용)
- **원인**: useQuery 기본 동작은 queryKey 변경 시 새 query 의 loading 상태로 전환 — 이전 data placeholder 로 유지 안 함. PRD EX-03 "Loading→완료 자연 전환 / 레이아웃 시프트 없음" 정신과 어긋남.
- **수정**: 4 summary useQuery 에 `placeholderData: keepPreviousData`. 필터 변경 시 이전 합계 잠깐 표시 → 응답 도착하면 swap. HTTP Cache-Control 의 `stale-while-revalidate` 와 동일 정신.

#### [EDGE-5036] 매출/매입 번들 summary 의 N+1 scalar subquery — bundle 1842건에서 EXPLAIN 853ms (P2, 운영 부담)

- **발견일**: 2026-05-11
- **심각도**: medium (운영 데이터 늘면 선형 증가)
- **상태**: fixed (commit `4be9a25b` — derived table + LEFT JOIN 단일 query 화)
- **재현**: EXPLAIN ANALYZE 의 `loops=1842 × SubPlan 1-6` (모든 row 마다 6 subquery). `purchase_bundle_items` Seq Scan + Memoize Misses 500/Hits 0.
- **원인**: PostgreSQL optimizer 가 `CASE WHEN + COALESCE + GROUP BY 외부 SELECT` 조합의 correlated scalar subquery 를 semi-join 으로 변환 못함. JPA N+1 과 동종.
- **수정**: adjustment 4 컬럼 + itemCount 를 derived table 3개로 사전 GROUP BY 한 번 실행 + LEFT JOIN 으로 결합. bundle row 수 무관 일정 비용.
- **검증**: EXPLAIN 매출 27ms → 1ms (22x), 매입 853ms → 220ms (4x).
- **함정**: derived table alias 컬럼명 충돌 (`column reference "amount" is ambiguous`) — prefix 적용 (`item_amount`, `bundle_amount`) 필수.

#### [EDGE-5050] mutation invalidate 시 4 summary 동시 refetch (오버 invalidate, 실제 영향 미미)

- **발견일**: 2026-05-11
- **심각도**: low (실제 영향 없음 — 잠재 부담)
- **상태**: open (의도된 동작으로 결론, knowledge 메모만)
- **현상**: 어떤 mutation 이든 `settlementKeys.summaries()` prefix 무효화 → 4개 summary endpoint (sales/purchase × waiting/bundle) 모두 stale 표시. mount 된 useQuery 만 refetch 발사.
- **현재 동작**: 한 페이지에서 1 패널만 mount 됨 → React Query 가 inactive query 는 refetch 안 함 → 실제로는 1 endpoint 만 호출. 비용 0.
- **결론**: 오버 invalidate 라기보다 prefix 무효화의 자연스러운 동작. **EDGE-5030 추상화 의도** (mutation 마다 정확한 셋 명시는 휴먼에러 표면) 와 부합.
- **재검토 트리거**: 같은 페이지에서 4 summary 패널 동시 노출되는 시점에 다시 평가. 그때 `meta.invalidates` 를 더 세밀하게 (예: `salesWaitingSummary()` 만) 변경 검토.
- **메모 — EDGE 번호 충돌**: 본 항목의 원 라벨은 EDGE-5037 이었으나 멀티주선사 격리 sweep #3 (EDGE-5037 = `/api/orders/validate` dead route) 와 번호 충돌 → 정산 도메인은 EDGE-5050 으로 재번호.

---

## 클라이언트 영속 store / 공통 인프라 격리 sweep (EDGE-5037/5038/5040/5041)

> 2026-05-12 MS Senior QA 멀티주선사 격리 sweep #3 — EDGE-5001~5035 fix 후 클라이언트 영속 store + 누락 라우트 가드 추가 점검.

### [EDGE-5041] localStorage zustand persist cross-broker 영업정보 leak — 검색어/필터/탭이 broker 전환 후 화면에 자동 적용 (CRITICAL)

- **발견일**: 2026-05-12
- **심각도**: critical (영업비밀 cross-broker leak — PC 공유/인계 환경에서 직접 노출)
- **상태**: fixed (`hooks/auth/use-broker-cache-guard.ts` — `BROKER_SCOPED_PERSIST_KEYS` 정의 + broker 전환 시 `localStorage.removeItem` 추가)
- **재현 (broker A ↔ broker B 양 시점)**:
  1. `qa-broker-a@example.com` 로그인 → `/broker/order/list` → 검색창에 `대기업화주ABC-기밀거래선` 입력 + Enter
  2. `localStorage.broker-order-storage` 에 `filter.searchTerm` 저장 확인
  3. 로그아웃 → localStorage 확인: `auth-storage` 만 사라지고 `broker-order-storage` 잔존
  4. `qa-broker-b@example.com` 로그인 → `/broker/order/list` 진입
- **현상 (수정 전)**:
  - broker B 검색창에 broker A 의 검색어 "대기업화주ABC-기밀거래선" 자동 표시.
  - `activeTab`, `viewMode`, `filter.companyId/companyName/departureCity/...` 등 broker A 의 영업 패턴이 broker B 화면에 그대로 노출.
  - 추가 영향 store: `broker-order-register-storage.recentLocations` (broker A 의 최근 상하차 거점), `income-waiting-store.filter` (정산 대기 검색).
- **원인**: `useBrokerCacheGuard` 가 `queryClient.clear()` 로 React Query 메모리만 클리어. zustand persist 의 localStorage 키는 별도 lifecycle 이라 broker 전환 시 그대로 잔존. `use-broker-cache-guard.ts:18-20` 주석 ("향후 defense-in-depth 로 queryKey 프리픽스") 에 명시된 한계가 그대로 운영 leak 표면이 됨.
- **수정**: `BROKER_SCOPED_PERSIST_KEYS = ['broker-order-storage', 'broker-order-register-storage', 'income-waiting-store']` 상수 정의 + `clearBrokerScopedStorage()` 헬퍼 + broker 전환 감지 분기에서 호출. `auth-storage` 는 customStorage 가 별도 책임이라 건드리지 않음.
- **회귀 가드**: `hooks/auth/__tests__/use-broker-cache-guard.test.ts` 의 3개 신규 케이스 (broker 전환 시 키 제거 / logout 시 키 제거 / 같은 broker 내 변경에는 보존). 신규 broker-scoped persist store 추가 시 `BROKER_SCOPED_PERSIST_KEYS` 에 등록 필수 — store 정의와 별도 등록이라 누락 위험. 단순 UI preference (`viewMode`/`pageSize`) 만 영속하는 store 는 추가 불필요 (`company-storage` 패턴).

### [EDGE-5037] `/api/orders/validate` dead route — raw db import + 인증 0 + 사용처 0

- **발견일**: 2026-05-12
- **심각도**: low (실제 db 호출 없음 — 표면 정리)
- **상태**: fixed (route 파일 + 디렉토리 삭제)
- **현상**:
  - `app/api/orders/validate/route.ts` POST 가 `db` import + `requireAuth`/`withTenant` 미적용 + zod 검증만 수행 후 echo.
  - 운영 호출처 0건 (`hooks/`, `components/`, `app/` 전체 grep — QA cross-probe script 한 곳만).
- **수정**: 라우트 파일/디렉토리 삭제 + `scripts/qa-tenant-cross-probe.mjs` 의 dead probe 라인 정리.
- **회귀 가드**: EDGE-4003~4005 family — 신규 endpoint 추가 시 `requireAuth + withTenant` 필수. 죽은 `db` import 가 남아있는 endpoint 는 향후 격리 0 회귀 시그널.

### [EDGE-5038] `/api/charge/broker-info` GET 이 `withTenant` 누락 — defense-in-depth 보강

- **발견일**: 2026-05-12
- **심각도**: info (현재는 leak 없음, 회귀 위험 차단)
- **상태**: fixed (`withTenant(..., {allowedTypes: ['broker']})` 적용)
- **현상**:
  - `requireAuth(request)` 통과 후 `getUserCompanyId(actorId)` 로 user.companyId 추출 → `broker_env_variables` 조회.
  - shipper 가 호출해도 자기 companyId 로 조회 → broker 등록 없으면 null 반환 → 현재 leak 0.
- **잠재 위험**: 향후 `getUserCompanyId` 가 헤더 의존 (`x-broker-company-id`) 으로 바뀌거나, 응답에 보조 정보가 추가되면 cross-type 호출이 service body 진입 후 분기 차단되어야 함. 라우트 정의에 의도 명시가 더 안전.
- **수정**: `withTenant(handler, {allowedTypes: ['broker']})` 적용 — shipper 호출은 service body 진입 전 403.
- **회귀 가드**: 신규 broker-only 라우트 추가 시 `withTenant + allowedTypes:['broker']` 표준 (`.claude/knowledge/feature-impact-map.md:72-76` 가이드 따름).

### [EDGE-5040] `broker-order-storage.activeTab` cross-broker 영속 — broker 전환 후 의도치 않은 탭으로 진입 (EDGE-5041 family)

- **발견일**: 2026-05-12
- **심각도**: low (UX 혼선, 데이터 leak 은 EDGE-5041 와 동일 root cause)
- **상태**: fixed (EDGE-5041 와 동일 수정 — `broker-order-storage` 키 자체가 broker 전환 시 제거되므로 `activeTab` 도 함께 초기화)
- **재현**:
  1. broker A 가 `/broker/order/list` 에서 "완료" 탭 클릭 → `activeTab: 'completed'` 영속
  2. 로그아웃 → broker B 로그인 → `/broker/order/list` 진입
  3. broker B 화면이 "완료" 탭으로 자동 진입
- **수정**: EDGE-5041 fix 와 통합 처리.

---

## EDGE-5013 follow-up — broadcast 화물 write 가드 비대칭 (EDGE-5060)

> 2026-05-12 QA 세션 — 화주 등록 broadcast 화물 + 주선사 운임 정산 다이얼로그 500 토스트 추적.

### [EDGE-5060] broadcast 화물(broker_company_id IS NULL) 운임 그룹 생성 500 — ChargeGroupRepository.save 의 strict eq 잔존

- **발견일**: 2026-05-12
- **심각도**: critical (화주가 broker 미지정 등록한 모든 화물에서 운임 정산 진입 자체 차단)
- **상태**: fixed (`server/charge/infrastructure/charge-group.repository.ts:save` — ownership 가드를 `this.ordersTenantWhere()` 로 통일 + 일반 Error → `OrderNotFoundError(httpStatus=404)`)
- **재현**:
  1. 화주 A (`qa-shipper-a@example.com`) `/order/register` → broker 미지정으로 화물 등록 → `orders.broker_company_id = NULL`, `companyId = 화주A`
  2. 주선사 A (`qa-broker-a@example.com`) 가 dispatch accept → `order_dispatches.broker_company_id = 주선사A`, `orders.broker_company_id` 는 NULL 유지
  3. `/broker/order/list` → 화물 상세 → 운임 정산 다이얼로그 → 금액 입력 후 저장
  4. `POST /api/charge` body `{orderId, dispatchId, stage:'estimate', reason:'fee'}`
- **현상 (수정 전)**:
  - HTTP 500 + `{"success":false,"error":"서버 내부 오류가 발생했습니다.","correlationId":"..."}`
  - 토스트: "서버 내부 오류가 발생했습니다"
  - 실제 재현 데이터: `orderId=8a6a85b9-a84c-45ba-8d76-7532d4a7b32a`, `correlationId=b64c7381-faf5-4577-b363-efb8666d4981`
- **원인**:
  - EDGE-5013 fix 적용 시 `EntityLookupReader.findOrderById` 는 `ordersTenantWhere()` (= self stamp ∪ broadcast + active profile) 로 전환되어 broadcast 화물도 통과.
  - 그러나 같은 도메인의 `ChargeGroupRepository.save` 는 strict `eq(orders.broker_company_id, this.brokerId)` 잔존 → broadcast (`NULL`) 매칭 실패 → `throw new Error('order ... 는 현재 broker 소유가 아닙니다.')`.
  - 일반 `Error` 라 `withErrorHandler` 의 도메인 매핑 (4xx) 미적용 → 500. 도메인 에러였다면 404 매핑됐을 것.
  - **불변식 위반 패턴**: list ⊂ detail 은 EDGE-5013 으로 통과시켰지만 detail ⊂ write 가 깨짐. 같은 종류 결함이 read path 25곳에 분산 — 일부는 broadcast 화물의 list 응답을 silent 누락시킬 가능성 (별도 점검 필요).
- **수정**:
  - `charge-group.repository.ts:save` 의 ownership 가드를 `this.ordersTenantWhere()` 로 교체 — 같은 file 의 `charge-query.repository.ts:87` 주석에 이미 broadcast 정책이 명시된 흐름과 정합.
  - `throw new Error(...)` → `throw new OrderNotFoundError(chargeGroup.orderId)` (httpStatus=404). withErrorHandler 가 "주문을 찾을 수 없습니다." 로 매핑.
  - 회귀 가드 integration test: `tests/integration/api/charge/charge.integration.test.ts:POST /api/charge - broadcast 화물(...) + active 관계 화주면 운임 그룹 생성 200`. `OrderTestBuilder.withBrokerCompany` 시그니처를 `string | null` 로 확장 (broadcast 표현 가능하게).
- **검증**: dev 환경 동일 시나리오 재호출 → 200 + chargeGroup row 정상 생성. cross-broker 화물 ID (`bbbb0001-...`) 로는 404 + `{"error":"주문을 찾을 수 없습니다."}`.
- **follow-up 점검 필요**:
  - read path 의 strict `eq(orders.brokerCompanyId, self)` 25곳 (`charge-line/order-sales/order-purchases/purchase-bundle/sales-bundle-order-list` 등) — broadcast 화물 list 노출 정책 (의도적 노출인지 silent 누락인지) 재검토.
  - 신규 charge/order 관련 write 가드 추가 시 `ordersTenantWhere()` 사용 (strict eq 패턴 금지).

---

## /dashboard

### 데이터 조회

#### [EDGE-5061] Dashboard init 의 변경 이력 fetch "Failed to fetch"

- **발견일**: 2026-05-14 (QA 세션 중 관찰, /broker/order/list QA 진행 중 누적 콘솔 에러 점검에서 포착)
- **심각도**: medium (변경 이력 영역만 빈 상태로 빠짐. 메인 흐름 차단 없음)
- **상태**: open
- **재현 (관찰된 시나리오)**:
  1. /login → 로그인 성공 → /dashboard 자동 redirect
  2. dashboard 가 mount 되며 `initDashboard()` → `fetchRealChangeLogData()` → `fetchOrderChangeLogsByCompanyId(currentUser.companyId)` 호출 (`store/dashboard/dashboard-store.ts:101, 307, 345`)
  3. 거의 즉시 다른 페이지(예: /broker/order/list) 로 navigate
  4. 콘솔에 `변경 이력 데이터 조회 중 오류 발생: TypeError: Failed to fetch` 출력
- **현상**:
  - 토스트 없이 콘솔 에러만 출력
  - dashboard 의 "변경 이력" 위젯은 빈 상태로 남음
  - 같은 세션에서 다시 /dashboard 진입 시 재현/비재현 혼재 (timing 의존)
- **원인 후보**:
  - dashboard unmount 시점에 fetch 가 abort 되며 `TypeError: Failed to fetch` 로 reject — endpoint `/api/orders/change-logs/[companyId]` 는 정상 존재 (서버 응답 200 가능)
  - `fetchOrderChangeLogsByCompanyId` 가 AbortController 미사용 → 호출자(컴포넌트)가 unmount 돼도 promise 가 살아남아 에러로 떨어짐
  - dev server 의 첫 chunk 로딩 race condition 가능성
- **확인점**:
  - `fetchOrderChangeLogsByCompanyId` 호출부에 AbortController 또는 React Query 등 cancelable 패턴 도입
  - 또는 catch 에서 `TypeError: Failed to fetch` / `AbortError` 를 무해 케이스로 분기
  - 단순 navigation race 가 아닌 endpoint 자체 장애인지 확인 (네트워크 탭 status code)
- **관련 파일**:
  - `services/orders/queries.ts:75` (fetchOrderChangeLogsByCompanyId)
  - `store/dashboard/dashboard-store.ts:93` (fetchRealChangeLogData)
  - `app/api/orders/change-logs/[companyId]/route.ts` (endpoint)

---

---

## /statistics/integrated (통합 통계 보드 Phase 1)

#### [EDGE-5070] Phase 2 미구현 destination 활성 CTA 가 404 유발

- **발견일**: 2026-05-14
- **심각도**: high (사용자가 클릭하면 즉시 404 페이지)
- **상태**: fixed
- **재현 (fix 전)**:
  1. /statistics/integrated 진입
  2. 거래처 그룹 헤더의 `전체 업체 보기` CTA 클릭 (또는 Top 10 표 행 클릭)
- **현상**: `/statistics/companies?month=Y-M` 으로 이동 → Next.js 404 페이지 노출, 콘솔에 RSC 404 에러 동반.
- **원인**: PRD §6.1 PRD-FR-ACT03 / AC-04 가 Phase 1 단계에서도 CTA/행 클릭 이동을 활성 의무로 요구하나, Phase 2 (`/statistics/companies` 라우트) 가 미구현. CTA 만 살아있고 destination 페이지 부재.
- **fix**: stub 페이지 추가 (`app/statistics/companies/page.tsx`, `app/statistics/companies/[companyId]/page.tsx`) — 안내 문구 + month 유지 백 링크. Phase 2 본 구현 시 그대로 덮어쓰기.
- **회귀 가드**: 신규 다단계 Phase PRD 작업 시 — 활성 CTA 의 destination route 가 stub 이라도 존재하는지 확인.

#### [EDGE-5071] recharts Tooltip default separator 가 명세와 불일치

- **발견일**: 2026-05-14
- **심각도**: low (시각 차이만, 기능 영향 없음)
- **상태**: fixed
- **재현 (fix 전)**: 통계 차트 5종 어느 위치든 hover → tooltip 텍스트가 `매출 : 1,025,110,301원` 처럼 콜론 앞 공백 1칸 추가.
- **현상**: DesignSpec §14.2 `{매출}: {금액}원` 포맷과 미세 불일치. recharts `<Tooltip>` 의 default `separator` 가 ` : ` (공백 포함).
- **fix**: `monthly-revenue / monthly-margin / daily-orders / cancel-rate / dispatch-channel` 5종 모두 `<Tooltip separator=": " ...>` 명시.
- **회귀 가드**: 신규 recharts 차트 추가 시 `separator=": "` prop 빼먹지 말 것.

#### [EDGE-5072] formatDeltaPp 가 화살표 없이 표기되어 다른 KPI 와 시각 톤 불일치

- **발견일**: 2026-05-14
- **심각도**: low (디자인 일관성)
- **상태**: fixed
- **재현 (fix 전)**: `매출매입 차익률` 카드는 `+2.0%p` 처럼 화살표 없이 표시되는데 옆 카드들은 `▲ +605.7%` 식으로 화살표 prefix. 의존도 카드도 동일.
- **현상**: DesignSpec §10.1 표가 `▲/▼` 의무를 명시하나 `%p` 케이스만 별도 정의 누락 → 구현이 화살표 생략. 디자인 시각 일관성 손상.
- **fix**: `formatDeltaPp` 가 `▲ +N.N%p` / `▼ -N.N%p` 반환. format.test.ts 동시 update.
- **회귀 가드**: 동일 카드 그룹 안에서 hint format 이 어떤 카드는 화살표 있고 어떤 카드는 없으면 일관성 점검.

#### [EDGE-5073] 도넛 차트 범례 위치가 명세 §15.1 위반 (하단 horizontal → 우측 vertical)

- **발견일**: 2026-05-14
- **심각도**: medium (명세 직접 위반)
- **상태**: fixed
- **재현 (fix 전)**: 통계 대시보드 운영 현황의 배차 채널 도넛에서 범례가 도넛 **하단**에 horizontal flex 로 배치.
- **현상**: DesignSpec §15.1 "도넛 차트 ... 중앙 총 건수 + 세그먼트 hover 강조 + **우측 범례**" 명시. Mock(`uiux/phase1/A-integrated-dashboard.png`) 도 우측 범례.
- **fix**: `dispatch-channel-chart.tsx` 를 `grid grid-cols-[1fr_120px]` 로 변경 — 좌측 도넛 + 우측 vertical list 형 범례. 범례 항목은 색 점 + 라벨 + 비율(`flex items-center gap-1.5`).
- **회귀 가드**: 도넛 신규 추가 시 범례 위치를 우측으로 (명세 §15.1).

#### [EDGE-5074] warningText 토큰이 Warning Badge text(#C2410C)로 잘못 매핑

- **발견일**: 2026-05-14
- **심각도**: medium (디자인 토큰 의미 혼선)
- **상태**: fixed
- **재현 (fix 전)**: "즉시 처리 필요" 보조 문구 색이 `#C2410C` (Warning Badge text) — 명세 §6 의 `Warning Text #D97706 / 즉시 처리 필요 문구` 와 hex 한 단계 차이.
- **현상**: `design-tokens.ts` 의 `warningText: '#C2410C'` 는 §6 의 `Warning Badge text` 토큰이고, "Warning Text" (#D97706)는 별도 token. 두 의미를 같은 변수명에 합쳐서 매핑 사고. 결과적으로 KpiCard UrgentCard 의 "즉시 처리 필요" 가 의도된 #D97706 보다 한 단계 진한 #C2410C 로 렌더링.
- **fix**: `warningText: '#D97706'` (Warning Text, 보조 문구용) + 새 토큰 `warningBadgeText: '#C2410C'` (Badge text 용, 향후 배지에서 사용) 로 분리.
- **회귀 가드**: §6 Color/Background Palette 표의 "Warning Text" vs "Warning Badge" 행 구분 — token 이름과 의미 1:1 매핑 유지.

#### [EDGE-5075] 차트 grid stroke 색상이 차트마다 달라 시각 일관성 깨짐

- **발견일**: 2026-05-14
- **심각도**: low (시각 미세 차이)
- **상태**: fixed
- **재현 (fix 전)**: 사업 성과 차트 / 운영 현황 차트 5종 중 4종은 `stroke="#F3F4F6"`, 1종(`monthly-margin`) 만 `#EAECEF`. 명세 §7 `차트 Grid #EAECEF` 통일.
- **fix**: 5종 차트 모두 `CHART_COLOR.grid` (`#EAECEF`) 사용. axis primary/secondary, channel, sales, purchase, margin, dailyOrders, cancelRate, tooltipBorder 모두 토큰 import 로 통일.
- **회귀 가드**: `design-tokens.ts` 상단 주석 "hex 직접 분산 금지" — 차트 컴포넌트 hex 입력 발견 시 토큰화.

#### [EDGE-5076] formatDeltaAbsolute 가 화살표 없이 표기 (formatDeltaRatio/Pp 와 일관성 부족)

- **발견일**: 2026-05-14
- **심각도**: low (디자인 일관성)
- **상태**: fixed
- **재현 (fix 전)**: `이번 달 오더 건수` 카드의 hint 가 `전월 대비 -598건` (화살표 없음). 옆의 `▼ -100.0%` 와 시각 톤 mismatch.
- **fix**: `formatDeltaAbsolute` 가 `▲ +N건` / `▼ -N건` 반환. operation-section / partner-section 의 활성 거래처 / 이번 달 오더 / 오늘 오더 카드 hint 일관 적용. format.test.ts 동시 update.
- **회귀 가드**: 모든 KPI hint 의 delta 표기에 ▲/▼ prefix 의무 (PRD §10.1 의 정신).

#### [EDGE-5077] 거래처 우측 컬럼이 좌측 Top 10 표 높이 따라 stretch

- **발견일**: 2026-05-14
- **심각도**: low (시각 어색)
- **상태**: fixed
- **재현 (fix 전)**: 거래처 그룹의 우측 (상위 5개 의존도 + 활성 거래처) 카드 두 개가 좌측 Top 10 표 높이(데이터 10개 ≈ 415px) 만큼 stretch 되어 의존도 카드가 약 207px 로 늘어남 (본래 min-h 104px).
- **fix**: outer grid 에 `items-start`, 우측 inner grid 에 `auto-rows-min` 추가 — 카드는 본연 높이 유지.
- **회귀 가드**: 좌/우 컬럼 폭/높이 다른 layout 에서 카드/표 mismatch 시 `items-start`+`auto-rows-min` 패턴.

#### [EDGE-5078] 도넛 segment hover 효과 부재 (§14.3 직접 위반)

- **발견일**: 2026-05-14
- **심각도**: medium (명세 직접 위반)
- **상태**: fixed
- **재현 (fix 전)**: 배차 채널 도넛 segment 위 hover — segment 의 d/opacity 변화 없음. recharts default `<Pie>` 는 hover 시 효과 없음.
- **현상**: DesignSpec §14.3 "hover 시 해당 채널 세그먼트가 약간 확대(offset)되고 나머지는 투명도를 낮춘다" 명시. 구현 누락.
- **fix**: `activeIndex` state + `activeShape` prop 으로 hover 시 outerRadius +6 확대, 나머지 Cell 의 `fillOpacity` 0.35 로 dim. `onMouseEnter/Leave` 로 상태 관리.
- **회귀 가드**: 도넛/파이 차트 신규 추가 시 §14.3 hover 효과 명시 확인.

#### [EDGE-5079] 차트 tooltip cursor 색상이 recharts default `#ccc` (토큰 미적용)

- **발견일**: 2026-05-14
- **심각도**: low (시각 일관성)
- **상태**: fixed
- **재현 (fix 전)**: 차트 hover 시 표시되는 column highlight(BarChart) / vertical crosshair(AreaChart) 색이 `#ccc` (recharts default). grid 토큰 `#EAECEF` 와 시각 톤 mismatch.
- **fix**: `CHART_COLOR.tooltipCursor` 토큰 추가(`#EAECEF`) + 4개 차트(C1 Bar / C2 Area / C3 Bar / C4 Area)에 `cursor={{fill | stroke: CHART_COLOR.tooltipCursor}}` 적용.
- **회귀 가드**: 신규 차트 추가 시 `<Tooltip cursor>` prop 으로 토큰 명시.

#### [EDGE-5080] Loading state ↔ 실제 콘텐츠 layout/gap mismatch (jitter + 좌우 layout 반전)

- **발견일**: 2026-05-14
- **심각도**: medium (사용자 체감 jitter)
- **상태**: fixed
- **재현 (fix 전)**: 페이지 진입 시 LoadingState(skeleton)와 실제 데이터 콘텐츠의 grid 값 차이로 hydration 시 layout 흔들림.
  - 카드 gap: skeleton `gap-3`(12px) vs 실제 `gap-2.5`(10px)
  - 차트 row 상단 margin: skeleton `mt-4`(16px) vs 실제 `mt-3`(12px)
  - section bottom margin: skeleton `mb-8`(32px) vs 실제 `mb-6`(24px)
  - **거래처 영역 좌우 layout 반전**: skeleton `lg:grid-cols-[300px_1fr]` (좌카드/우표) vs 실제 `lg:grid-cols-[1fr_280px]` (좌표/우카드) → loading→실제 전환 시 좌우 flip
- **fix**: `state-views.tsx` 의 LoadingState 를 실제 section grid 와 동일한 값으로 통일.
- **회귀 가드**: skeleton 컴포넌트는 실제 section 의 grid 토큰/Tailwind class 와 1:1 매칭 유지. section 의 grid 가 변경되면 skeleton 도 함께 update.

#### [EDGE-5081] LoadingState 차트 제목에 옛 용어 "월별 영업이익 추이" 잔존

- **발견일**: 2026-05-14
- **심각도**: low (PRD §2.5 용어 표준 위반)
- **상태**: fixed
- **재현 (fix 전)**: 페이지 진입 직후 loading skeleton 의 차트 제목 placeholder 가 `월별 영업이익 추이` 노출. 실제 콘텐츠는 `월별 매출매입 차익 추이` 로 노출.
- **현상**: 통합 PRD §2.5 용어 정의 "매출매입 차익 — `매출 - 매입 + 선불수수료(reason='fee')`. 판관비/운영비를 포함하는 회계상 영업이익과 구분한다" 에 따라 "영업이익" 용어는 금지.
- **fix**: LoadingState 차트 제목을 `월별 매출매입 차익 추이` 로 통일.
- **회귀 가드**: skeleton/placeholder/copy deck 에 "영업이익" 용어 잔존 grep 검증.

#### [EDGE-5082] 1024px viewport 에서 KPI 메인 수치가 두 줄로 줄바꿈 (layout 깨짐)

- **발견일**: 2026-05-14
- **심각도**: medium (좁은 desktop viewport 에서 디자인 깨짐)
- **상태**: fixed
- **재현 (fix 전)**: 1024px 폭 viewport 에서 사이드바 + 본문 패딩 빼면 본문 약 880px, 5카드 = 134px/card. `550,000원` 등 7+ 자리 통화 값이 `font-bold 22px` 로 들어가면 두 줄로 줄바꿈 (`550,000\n원`) — 카드 height 가 100→128px 로 늘어나며 grid alignment 깨짐.
- **현상**: PRD §1.1 "데스크톱 우선" 이라지만 1024px 도 desktop 범위. mock(`uiux/phase1/A-integrated-dashboard.png`) 은 1440px 기준이라 줄바꿈 안 나타남.
- **fix**: `KpiCard` / `UrgentCard` value div 에 `truncate` class + `title` attr 추가. 좁은 폭에서는 `550,00···` ellipsis 로 1줄 유지, hover 시 전체 값 노출. 1280px+ 환경에선 truncate 없이 그대로 표시.
- **회귀 가드**: 신규 KPI 카드 추가 시 long-value 케이스 (`9,999,999,999원`) 와 좁은 viewport (`1024×768`) 모두 점검. 줄바꿈 안 나는지 확인.

#### [EDGE-5083] 새로고침 버튼 `type="button"` 명시 누락

- **발견일**: 2026-05-14
- **심각도**: low (form 외부라 무해, 명시적 안전망)
- **상태**: fixed
- **재현**: `<Button onClick={...} aria-label="새로고침">` 에 `type` attr 없음 — `<button>` default type 은 `submit`. 현재는 form 내부가 아니라 submit 동작 안 일어나지만, 향후 form 안에 들어가면 의도치 않은 submit.
- **fix**: `type="button"` 명시.
- **회귀 가드**: 모든 action 용 `<button>`/`<Button>` 에 `type="button"` 명시 (refactor 시 form 안으로 이동해도 안전).

#### [EDGE-5084] PRD §4.5 부분 실패 처리 — 영역별 SectionResult discriminated union 으로 fix 완료

- **발견일**: 2026-05-14 (라운드 4 초기 발견 시 wontfix → 라운드 4-2 에서 정식 fix)
- **심각도**: medium (PRD 명세 직접 위반)
- **상태**: fixed
- **재현 (fix 전)**: `app/api/statistics/integrated` 응답 service 가 `Promise.all` 로 영역 4개를 묶어 1개라도 throw 하면 endpoint 자체 500 → FE 는 화면 전체 ErrorState 로 fallback. PRD §4.5 / AC-14 "전체는 영역별 부분 실패를 허용한다" 미충족.
- **현상**: 한 영역의 repository 호출 실패 (예: `listCompanySalesRanking` DB error) → 정상 응답 가능한 다른 영역 (사업 성과/운영 현황/차트) 까지 같이 500 반환.
- **fix (구조)**:
  1. `IntegratedStatsQueryService.execute()` 가 `Promise.allSettled` 로 4영역 격리.
  2. 응답 타입 `IntegratedStatsResponse` 의 region 필드를 `SectionResult<T> = { ok: true; data: T } | { ok: false; error: string }` discriminated union 으로 변경.
  3. 헬퍼 `toSection(settled)` 가 PromiseSettledResult 를 SectionResult 로 변환.
  4. FE `page.tsx` 가 `data.business.ok ? <BusinessSection business={data.business.data} ...> : <SectionErrorState sectionLabel="사업 성과" onRetry={handleRefresh} />` 패턴.
  5. `BusinessSection` / `OperationSection` 은 `charts` prop 을 `ChartsData | null` 로 받음 — charts 영역 실패 시 카드는 유지, 차트 자리만 `SectionErrorState`.
  6. `PartnerSection` 의 `totalSales` prop = business 성공 시 `data.business.data.sales.value`, business 실패 시 `0` (PRD §4.6 단일 source 보존).
- **테스트**: `IntegratedStatsQueryService` 영역별 부분 실패 시나리오 3개 추가 (`partner 영역 실패 → 다른 정상`, `charts 영역 실패 → 다른 정상`, `business+operation 동시 실패 → partner 만 정상`).
- **회귀 가드**:
  - 신규 영역 추가 시 `Promise.allSettled` 패턴 유지 + `toSection` 사용.
  - section 컴포넌트의 props 가 영역별로 narrow 한 data type 만 받도록 — 전체 `IntegratedStatsResponse` 통째로 받지 말 것.
  - `charts` 영역의 데이터는 사업 성과 / 운영 현황 두 그룹에 분산 — 두 section 모두 `charts: ChartsData | null` prop 받아 null 시 차트 자리만 ErrorState 처리.

#### [EDGE-5085] PRD §5.3 로그 이벤트 3종 미발사

- **발견일**: 2026-05-14
- **심각도**: medium (PRD 명세 직접 위반)
- **상태**: fixed
- **재현 (fix 전)**: 통계 페이지 진입/월 변경/새로고침 시 PRD §5.3 가 명시한 `view_integrated_company_stats`, `change_integrated_company_stats_month`, `refresh_integrated_company_stats` 3종 이벤트가 코드에 발사 없음. 프로젝트 전체에 analytics infra 부재 (`grep -r 'trackEvent|logEvent|analytics'` → 매치 없음).
- **fix**: `lib/analytics.ts` 신설 — `trackEvent(name, payload?)` 함수가 `console.debug('[analytics] {name}', payload)` 로 발사하는 stub. 향후 amplitude/mixpanel/posthog 등 도입 시 함수 body 만 교체. page.tsx 의 mount useEffect (view), updateMonth (change), handleRefresh (refresh) 3곳에 호출.
- **회귀 가드**: PRD §5.3 (또는 각 기능 PRD 의 로그 절) 에 이벤트가 정의되면 즉시 `trackEvent` 호출 추가. analytics SDK 도입 시 `lib/analytics.ts` 한 곳만 교체.

#### [EDGE-5086] DesignSpec §11 Loading 시 컨트롤 비활성 누락

- **발견일**: 2026-05-14
- **심각도**: medium (명세 위반 + 중복 요청 가능성)
- **상태**: fixed
- **재현 (fix 전)**: DesignSpec §11 의 노출 규칙표는 `month 선택`/`새로고침`/`전체 업체 보기`/`Top 10 표 행` 모두 비활성 조건이 Loading. 새로고침 버튼만 `disabled={isRefreshing}` 적용됨. 나머지 3개는 isFetching 중에도 클릭 가능 → 중복 fetch / 의도치 않은 navigation 가능성.
- **fix**:
  - `statistics-header.tsx`: `<Select disabled={isRefreshing}>` 추가.
  - `partner-section.tsx`: `isRefreshing` prop 받음. true 시 `<Link>` 를 `<span aria-disabled>` 로 swap (cursor-not-allowed + tertiary color).
  - `top-ten-table.tsx`: `disabled` prop 받음. `<button disabled={...} className="disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent">`.
  - page.tsx 에서 `isFetching` 를 PartnerSection 의 `isRefreshing` 으로 forward.
- **회귀 가드**: 신규 CTA / 클릭 가능 영역 추가 시 isFetching/isLoading 상태 분기 누락 시 추가.

#### [EDGE-5087] P2-8 invalid `?month=` query 가 URL 에 그대로 잔존

- **발견일**: 2026-05-14 (라운드 4 P3 발견, 라운드 5 정식 fix)
- **심각도**: low (사용자 혼동)
- **상태**: fixed
- **재현 (fix 전)**: `/statistics/integrated?month=2099-13` (포맷 불일치 또는 미래 월) 진입 시 화면은 당월로 fallback 하지만 URL 은 `2099-13` 유지. 사용자가 새로고침/공유하면 동일 invalid URL.
- **fix**: page.tsx 에 useEffect 추가 — `monthFromUrl !== null && !isMonthUrlValid` 면 `updateMonth(fallbackMonth)` 로 router.replace 호출. 정상 URL 로 정규화. 라운드 6 에 추가 강화 — 형식 검증(`/^\d{4}-(0[1-9]|1[0-2])$/`)뿐 아니라 `availableMonthValues` (24개월 범위) 에 포함되는지도 검사. `?month=2099-12` 같은 형식은 맞지만 범위 밖인 케이스도 fallback.
- **회귀 가드**: URL query 검증/정규화 패턴 — invalid 값을 화면에서만 무시하지 말고 URL 도 동기화. 도메인 제약(24개월) 이 있는 query 는 형식만이 아니라 도메인 검증도.

#### [EDGE-5088] PRD §4.4 부분 실패 — 위젯 단위 (그룹 헤더 유지 + 카드/차트 독립 ErrorState)

- **발견일**: 2026-05-14 (라운드 6)
- **심각도**: medium (PRD §4.4 표 명시 위반)
- **상태**: fixed
- **재현 (fix 전)**: 라운드 4-2 의 EDGE-5084 fix 가 영역(business/operation/partner/charts) 4개를 SectionResult 로 격리했으나, FE 의 분기가 그룹(사업 성과/운영 현황) 단위였다 — `business.ok ? <BusinessSection ...> : <SectionErrorState sectionLabel="사업 성과">` 패턴. business 카드만 실패 + charts ok 인 케이스에서 그룹 전체가 ErrorState 로 사라지며 차트 2개도 함께 가려짐.
- **현상**: PRD §4.4 영역별 부분 실패 처리 요약 표 — `사업 성과 | 성공한 카드/차트 | 실패한 카드 또는 차트만 | 위젯 내부 에러 상태 + 재시도`. "성공한 카드/차트" 유지가 의무.
- **fix**:
  - `BusinessSection` props 를 `business: BusinessData | null` + `charts: ChartsData | null` + `onRetryBusiness` + `onRetryCharts` 로 확장 — 컴포넌트 내부에서 카드 영역과 차트 영역을 독립 분기.
  - 동일 패턴으로 `OperationSection`.
  - `PartnerSection` 은 단일 영역이라 그대로 (page.tsx 에서 ok ? Section : SectionError).
  - page.tsx 는 Business/Operation Section 을 unconditional 호출 + nullable 전달.
- **검증**: fetch 인터셉트로 `business={ok:false}` mock + 새로고침 → 그룹 헤더 "사업 성과 (전월대비)" 유지 + 카드 자리만 ErrorState + 차트 2개 정상 노출 확인.
- **회귀 가드**: 다중 위젯을 묶은 그룹에서는 컴포넌트 내부에서 widget 단위 분기. page 가 그룹 단위로 분기하면 부분 실패 명세 위반 회귀.

#### [EDGE-5089] 사이드바 통계 메뉴 active highlight 미동작

- **발견일**: 2026-05-14 (라운드 6)
- **심각도**: medium (UX — 현재 페이지가 어느 메뉴인지 시각 표시 부재)
- **상태**: fixed
- **재현 (fix 전)**: `/statistics/integrated` 페이지에 있는데 사이드바의 "통계" 메뉴가 `data-active="false"`. shadcn `SidebarMenuButton` 의 `isActive` prop 이 전달되지 않음. broker nav 전체 메뉴가 동일 — 현재 페이지와 무관하게 항상 비활성.
- **fix**: `components/app-sidebar/nav-broker.tsx` 에 `usePathname()` import + `isPathActive(pathname, url)` 헬퍼 (정확 일치 + 서브경로 매칭) + `<SidebarMenuButton isActive={...}>` / `<SidebarMenuSubButton isActive={...}>` 전달. 서브 메뉴 url 이 매칭되면 부모 메뉴도 active.
- **테스트**: `components/app-sidebar/__tests__/nav-broker.test.tsx` 3개 케이스 (정확 일치 / 서브 경로 / 비활성).
- **회귀 가드**: 신규 broker 메뉴 추가 시 `SidebarMenuButton` 의 `isActive` prop 자동 적용 (NavBroker 가 처리).

#### [EDGE-5090] 새로고침 다중 클릭 race condition

- **발견일**: 2026-05-14 (라운드 6)
- **심각도**: low (동시성 — 중복 fetch)
- **상태**: fixed
- **재현 (fix 전)**: 새로고침 버튼이 `disabled={isFetching}` 으로 보호되지만 `isFetching` state 가 다음 render 전까지 false 유지 → 5번 빠른 연속 클릭이 5번 refetch 발사. useRef 기반 동기 lock 부재.
- **fix**: page.tsx 에 `refreshLockRef = useRef(false)` 추가. `handleRefresh` 에서 lock 잡고 `refetch().finally(() => lock=false)`. 동기 다중 클릭이 차단됨 — isFetching state 의 비동기성과 무관.
- **회귀 가드**: 동기 다중 클릭 가드가 필요한 action (refetch / submit / navigate) 에 동일 패턴 활용.

#### [EDGE-5091] SectionErrorState 가 정상 영역과 height 불일치 → layout shift

- **발견일**: 2026-05-14 (라운드 7)
- **심각도**: low (시각 일관성 + layout shift)
- **상태**: fixed
- **재현 (fix 전)**: SectionErrorState 가 `min-h-[160px]` 고정. 정상 영역과 비교 시:
  - business/operation 카드 grid 정상 height ≈ 107.6px → ErrorState 160px → **52px 큼** (살짝 늘어남)
  - business/operation 차트 grid 정상 height ≈ 326px → ErrorState 160px → **166px 작음** (눈에 띄게 줄어듦)
  - partner 영역 정상 height ≈ 425px → ErrorState 160px → **265px 작음**
  - 사용자가 새로고침 / 부분 실패 ↔ 정상 전환할 때 page height 가 출렁임 = layout shift.
- **현상**: DesignSpec §10.2 Loading 의 "그룹별 실제 위젯 높이를 유지하는 스켈레톤 사용" 원칙은 ErrorState 에는 명시 없으나, 같은 원리로 적용해야 일관성. mock 으로 4영역 동시 실패 시뮬 시 height 가 정상 응답일 때와 다름.
- **fix**:
  - `SectionErrorState` 에 `minHeight?: number` prop 추가 (default 160).
  - `withGroupHeader?: boolean` prop 추가 (default true). BusinessSection/OperationSection 내부 호출처에서는 그룹 헤더가 이미 외부에 있으므로 false 로 두고 중복 헤더 회피.
  - 호출처별 적정 height 전달:
    - business 카드 / operation 카드: `minHeight=104, withGroupHeader=false`
    - business 차트 / operation 차트: `minHeight=326, withGroupHeader=false`
    - partner (단독): `minHeight=425` (그룹 헤더 유지)
- **회귀 가드**: 신규 영역의 SectionErrorState 사용 시 호출처의 정상 영역 height 측정 후 동일 값 전달.

#### [EDGE-5092] 사이드바 통계 메뉴 active 가 단일 url 정확 일치만 → 형제 라우트 비활성

- **발견일**: 2026-05-14 (라운드 8)
- **심각도**: low (UX 일관성)
- **상태**: fixed
- **재현 (fix 전)**: `/statistics/integrated` (Phase 1) 진입 시 사이드바 통계 메뉴 active. 그러나 `/statistics/companies` 또는 `/statistics/companies/[companyId]` (Phase 2 stub) 진입 시 active 안 됨 — `data-active="false"`. 사용자가 "현재 어느 메뉴 영역인지" 혼동.
- **현상**: 라운드 6 EDGE-5089 fix 가 isPathActive 를 `pathname === url || pathname.startsWith(\`${url}/\`)` 로 구현. `/statistics/companies` 는 `/statistics/integrated` 의 서브가 아니라 형제 — 매칭 안 됨.
- **fix**:
  - `NavBroker` items 타입에 `activePathPrefix?: string` 추가.
  - `isPathActive(pathname, url, prefix)` 가 prefix 가 있으면 `pathname === prefix || pathname.startsWith(\`${prefix}/\`)` 매칭 우선.
  - `ClientAppSidebar` 의 통계 메뉴에 `activePathPrefix: "/statistics"` 추가 — `/statistics/*` 모든 경로에서 active.
- **회귀 가드**: 단일 메뉴 url 로 묶이는 형제 라우트 그룹은 `activePathPrefix` 사용. Phase 2/3 본 구현이 같은 prefix 라면 fix 불필요.

#### [EDGE-5093] SectionErrorState "다시 시도" 버튼이 isFetching 중에도 활성

- **발견일**: 2026-05-14 (라운드 8)
- **심각도**: low (시각 피드백 부재)
- **상태**: fixed
- **재현 (fix 전)**: 부분 실패 시 SectionErrorState 의 "다시 시도" 버튼 클릭 → handleRefresh → isFetching=true → refresh lock 으로 다음 refetch 차단. 그러나 버튼 자체는 disabled 처리 안 됨. 사용자가 클릭 후 즉시 같은 버튼을 다시 눌러도 lock 으로 막히지만 시각 피드백 없어 혼동 가능.
- **fix**: `SectionErrorState` 에 `isRetrying?: boolean` prop 추가. `<Button disabled={isRetrying}>`. BusinessSection / OperationSection / page.tsx 의 partner ErrorState 모두 `isRetrying={isFetching}` forward.
- **회귀 가드**: refresh/retry action 이 있는 모든 컴포넌트에 isFetching/disabled 패턴 적용 — 비동기 state 의 시각 피드백 누락 회귀 방지.

#### [EDGE-5094] design-tokens.ts 정의 없는 hex 가 컴포넌트에 분산

- **발견일**: 2026-05-14 (라운드 9)
- **심각도**: low (디자인 토큰 분산)
- **상태**: fixed
- **재현 (fix 전)**: `design-tokens.ts` 가 토큰 단일 source 를 표방하지만 다음 hex 들이 토큰 정의 없이 컴포넌트에서만 사용:
  - `#3730A3` — partner-section CTA hover variant
  - `#4B5563` — state-views Empty/Error 메시지 (DesignSpec §5 "상태 카피")
  - `#9CA3AF` — state-views Empty 보조 카피 (DesignSpec §5 "상태 보조 카피")
- **현상**: 디자인 명세에 명시된 색인데 토큰 부재. 다른 컴포넌트가 같은 시맨틱 색을 추가 사용할 때 hex 분산 더 확산 위험.
- **fix**: `design-tokens.ts` 의 `COLOR` 에 `accentPrimaryHover`, `statusText`, `statusSubtext` 추가. (Tailwind className 직접 사용은 그대로 — `style={{color: COLOR.xxx}}` 패턴은 KpiCard 이외 점진 적용.)
- **회귀 가드**: 컴포넌트에 신규 hex 도입 시 design-tokens 정의 우선 추가, hex 가 이미 토큰화된 색이면 토큰 사용.

#### [EDGE-5095] state-views skeleton bg 와 kpi-card skeleton bg 색 불일치

- **발견일**: 2026-05-14 (라운드 9)
- **심각도**: low (시각 미세 차이)
- **상태**: fixed
- **재현 (fix 전)**: LoadingState 의 그룹 헤더 skeleton 이 `bg-[#F3F4F6]`, KpiCardSkeleton / ChartContainerSkeleton 내부 placeholder 는 `bg-[#F2F4F7]` (surfaceMuted). 두 hex 가 한 단계 차이로 같은 페이지에서 미세하게 어긋남.
- **fix**: state-views.tsx 의 모든 `bg-[#F3F4F6]` → `bg-[#F2F4F7]` 통일.
- **회귀 가드**: skeleton 계열 컴포넌트는 모두 `COLOR.surfaceMuted` (#F2F4F7) 단일 사용.

#### [EDGE-5096] chart-container Empty 메시지가 라운드 9 추가 토큰과 매핑 불명

- **발견일**: 2026-05-14 (라운드 10)
- **심각도**: low (토큰 매핑 명시 누락)
- **상태**: fixed
- **재현 (fix 전)**: 라운드 9 에서 `COLOR.statusText (#4B5563)` / `statusSubtext (#9CA3AF)` 토큰을 추가했지만 chart-container.tsx 의 Empty 메시지는 여전히 inline hex 사용. 시각 hex 는 같으나 토큰 매핑 의도 불명 — 후속 수정자가 토큰 변경 시 일관성 깨질 위험.
- **fix**: Empty 메시지 위치에 "DesignSpec §5 상태 카피 — design-tokens.COLOR.statusText / statusSubtext 와 동일 hex" 주석 추가. 시각 hex 는 그대로 (Tailwind className arbitrary value 한계). 토큰 변경 시 두 곳 동시 update 필요한 점 명시.
- **회귀 가드**: design-tokens 의 색을 변경하면 grep 으로 동일 hex 사용 컴포넌트 찾아 동시 update.

#### [EDGE-5097] 도넛 segment hover fillOpacity 변화 시 transition 부재 → 깜빡거림

- **발견일**: 2026-05-14 (라운드 10)
- **심각도**: low (UX 부드러움)
- **상태**: fixed
- **재현 (fix 전)**: 배차 채널 도넛에서 segment 간 hover 이동 시 `fillOpacity` 가 즉시 1 ↔ 0.35 로 swap → 깜빡거림. recharts default Cell 은 transition 없음.
- **fix**: `<Cell style={{ transition: 'fill-opacity 150ms ease-out' }}>` 추가. hover 이동 시 opacity 가 부드럽게 페이드.
- **회귀 가드**: recharts Cell 의 fill-opacity 토글 패턴 사용 시 transition 함께 명시.

#### [EDGE-5098] 도넛 차트의 명세 §5 위반 색 — 토큰과 미세 hex 차이

- **발견일**: 2026-05-14 (라운드 11)
- **심각도**: low (디자인 토큰 일관성)
- **상태**: fixed
- **재현 (fix 전)**: `dispatch-channel-chart.tsx` 에서 사용된 4개 hex 가 design-tokens 또는 DesignSpec §5 와 한 단계씩 차이:
  - 도넛 중앙 메인 `#111827` (gray-900) — design-tokens 의 `textPrimary #0F172A` 와 다름
  - 도넛 중앙 보조 `#9CA3AF` — statusSubtext (라운드 9 추가) 동일이지만 §5 보조 문구는 `textTertiary #94A3B8` 명시
  - 범례 컨테이너 `#6B7280` (gray-500) — design-tokens 의 `CHART_COLOR.axisPrimary` 와 동일 hex 인데 axis 색을 범례에 사용 = 의미 혼란
  - 범례 라벨 `#374151` (gray-700) — design-tokens 없음. textSecondary `#475569` 또는 textStrong `#1E293B` 와 한 단계 차이
- **현상**: 다른 컴포넌트는 design-tokens 의 색을 사용하는데 도넛만 별도 hex 사용 = 시각 톤 분산. 명세 §5 Typography Scale 의 "범례 / 보조 문구 textMuted #64748B 또는 textTertiary #94A3B8" 위반.
- **fix**:
  - 중앙 메인 `#111827` → `#0F172A` (textPrimary)
  - 중앙 보조 `#9CA3AF` → `#94A3B8` (textTertiary)
  - 범례 컨테이너 `#6B7280` → `#64748B` (textMuted, §5 범례 명시 색)
  - 범례 라벨 `#374151` → `#1E293B` (textStrong, 차트 강조 본문)
  - 4곳 모두 토큰 매핑 주석 추가.
- **회귀 가드**: 신규 차트 컴포넌트 hex 도입 시 design-tokens 의 동일 시맨틱 토큰 사용 (textPrimary/textMuted/textTertiary/textStrong + CHART_COLOR).

#### [EDGE-5099] 키보드 접근성 — Top 10 행 button + CTA Link focus-visible ring 부재

- **발견일**: 2026-05-14 (라운드 12)
- **심각도**: low (a11y — 키보드 사용자 focus 표시 부재)
- **상태**: fixed
- **재현 (fix 전)**:
  - 거래처 그룹의 "전체 업체 보기" CTA `<Link>` 에 focus-visible ring 없음 — Tailwind default 만 적용. 키보드 Tab 으로 이동했을 때 focus 위치 시각 표시 약함.
  - Top 10 표 행 raw `<button>` 도 동일 — focus ring 없음.
  - isRefreshing 중 swap 되는 `<span aria-disabled>` 가 여전히 tab 순서 포함 — tab focus 받지만 클릭 안 됨 = 사용자 혼동.
- **fix**:
  - CTA Link: `focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2` + `rounded` (ring 둥글기).
  - Top 10 button: `focus-visible:ring-inset` (행 내부 ring) + `ring-2 ring-[#4F46E5]`.
  - disabled span: `tabIndex={-1}` — tab 순서 제외.
- **회귀 가드**: 신규 인터랙티브 요소 (button/Link/a) 추가 시 `focus-visible:ring-*` 토큰 적용. disabled state 의 placeholder 요소는 tabIndex={-1}.

#### [EDGE-5100] design-tokens 미사용 토큰 + top-ten-table 매핑 누락

- **발견일**: 2026-05-14 (라운드 13)
- **심각도**: low (디자인 토큰 활용)
- **상태**: fixed
- **재현 (fix 전)**:
  - `CHART_COLOR.tooltipSurface (#FFFFFF)` 토큰이 정의되었으나 사용처 없음 — 5개 차트의 Tooltip contentStyle 에 backgroundColor 미명시 (recharts default white 가 우연히 일치).
  - `top-ten-table.tsx` 의 8개 hex (`#EAECEF / #F2F4F7 / #F8FAFC / #4F46E5 / #3730A3 / #0F172A / #475569 / #64748B`) 가 design-tokens 와 같은 hex 인데 매핑 주석 없음 — 후속 수정자가 토큰 변경 시 동시 update 누락 위험.
- **fix**:
  - 5개 차트 컴포넌트 Tooltip `contentStyle` 에 `backgroundColor: CHART_COLOR.tooltipSurface` 추가.
  - `top-ten-table.tsx` 파일 상단에 hex ↔ 토큰 매핑 8개 종합 주석.
- **회귀 가드**: design-tokens 의 미사용 토큰은 사용처 명시 또는 제거. Tailwind className arbitrary value 의 hex 는 토큰 매핑 주석 (라운드 10/13 chart-container/top-ten-table 패턴).

#### [EDGE-5101] 두 BarChart 의 bar border-radius 미세 불일치

- **발견일**: 2026-05-14 (라운드 14)
- **심각도**: low (시각 일관성)
- **상태**: fixed
- **재현 (fix 전)**: `monthly-revenue-chart` Bar `radius={[4, 4, 0, 0]}` (4px) vs `daily-orders-chart` Bar `radius={[3, 3, 0, 0]}` (3px). 두 차트 모두 막대 차트인데 곡률 1px 차이.
- **현상**: DesignSpec 미명시 영역이라 명세 위반은 아니나, 같은 차트 family (BarChart) 가 다른 곡률을 가지면 시각 일관성 손상.
- **fix**: `daily-orders-chart` radius 도 4 로 통일.
- **회귀 가드**: 신규 BarChart 추가 시 radius 4 통일.

#### [EDGE-5102] operation-section 의 IIFE destructure vs business-section inline 패턴 불일치

- **발견일**: 2026-05-14 (라운드 15)
- **심각도**: low (코드 스타일 일관성)
- **상태**: fixed
- **재현 (fix 전)**:
  - `business-section`: `business ? <div>{KpiCard value={formatCurrency(business.salesPurchaseMargin.value)} ...}</div> : ...` — 객체 inline 접근.
  - `operation-section`: `operation ? (() => { const {...} = operation; const todayCard = ...; return <div>...</div>; })() : ...` — IIFE 안에서 destructure + todayCard 계산.
  - 같은 분기 패턴인데 한쪽은 IIFE, 한쪽은 inline.
- **fix**:
  - operation-section 의 `todayCard` 계산을 컴포넌트 함수 본문 최상단에서 `const todayCard = operation ? buildTodayOrAverageCard(operation.todayOrAverage) : null;` 로 사전 계산.
  - JSX 안 destructure 제거, `operation.monthlyOrderCount.value` 처럼 inline 접근으로 통일.
  - 분기 조건도 `operation && todayCard` 로 narrow.
- **회귀 가드**: section 컴포넌트는 inline 접근 패턴 사용 (IIFE 회피 — readability + JSX scope 일관성).

#### [EDGE-5103] 차트 컴포넌트들의 KRW formatter + tickAmount 함수 중복

- **발견일**: 2026-05-14 (라운드 16)
- **심각도**: low (코드 중복)
- **상태**: fixed
- **재현 (fix 전)**:
  - `new Intl.NumberFormat('ko-KR')` 인스턴스가 4곳에서 별도 생성: `format.ts:10` (file-private) + monthly-revenue-chart + monthly-margin-chart + top-ten-table.
  - `tickAmount` 함수가 monthly-revenue / monthly-margin 두 차트에서 동일하게 정의 (4줄 함수, 1.0억/4500만/1,234 약식).
- **fix**:
  - `format.ts` 의 `KRW_FORMATTER` 를 `const` → `export const` 로 변경.
  - 동일 `format.ts` 에 `formatTickAmount(value: number)` 함수 추가 + export.
  - 3개 차트 컴포넌트가 `import { KRW_FORMATTER, formatTickAmount } from '../format'` 로 재사용.
- **회귀 가드**: 신규 차트 컴포넌트는 format.ts 의 KRW_FORMATTER/formatTickAmount 재사용 — `new Intl.NumberFormat` 중복 생성 금지.

#### [EDGE-5104] KpiCard.hidden dead prop — 실제 호출처 0

- **발견일**: 2026-05-14 (라운드 17)
- **심각도**: low (Simple Design 4규칙 — "Fewest elements")
- **상태**: fixed
- **재현 (fix 전)**: `KpiCard` 컴포넌트가 `hidden?: boolean` prop + `if (hidden) return null` 로직 보유. 그러나 실제 호출처 (business/operation/partner section) 어디에서도 `hidden=true` 전달 없음. A-08/A-09 0건 케이스는 부모에서 `{!waitingDispatch.hidden && <UrgentCard />}` 패턴으로 분기.
- **현상**: dead prop + dead logic. 테스트 1개도 dead code 검증 중이었음.
- **fix**: `hidden` prop + early return + 테스트 케이스 모두 제거. 부모 분기 패턴 (`{!hidden && <Card />}`) 만 유지.
- **회귀 가드**: 신규 prop 추가 시 실제 호출처 있는지 검토. 호출처 0 인 prop 은 제거.

#### [EDGE-5105] SectionErrorState 가 BusinessSection/OperationSection 안에서 nested section 생성

- **발견일**: 2026-05-14 (라운드 17)
- **심각도**: low (HTML outline / a11y)
- **상태**: fixed
- **재현 (fix 전)**: BusinessSection (`<section aria-labelledby>`) 내부에서 부분 실패 시 SectionErrorState 도 `<section aria-label>` 로 노출. `<section><section>` nested — HTML5 spec 허용이지만 document outline 영향 (heading hierarchy 가 늘어남).
- **fix**: SectionErrorState 의 outer `<section>` → `<div role="alert">` 로 변경. role=alert 는 screen reader 가 즉시 알림. aria-label 유지.
- **회귀 가드**: section 안에 ErrorState/Empty 같은 메시지 영역은 `<div role="...">` 로 — section 중첩 회피.

---

## 거래처(Company) /broker/company/list — 2026-05-15 QA 라운드

> 식별자 형식: `EDGE-2026-05-15-COMPANY-NN` (세션-고유, 다른 세션의 EDGE-NNN 과 충돌 회피)
> 환경 메모: dev 서버 Turbopack PostCSS subprocess 가 Windows 0xc0000142 로 2회 크래시. `.next-qa` 격리 디렉토리 + 별도 dev 서버 (포트 3002, NEXT_DIST_DIR=.next-qa) 로 우회 진행. 회귀 검증 시 동일 환경 권장.

### 🔴 Critical

#### [EDGE-2026-05-15-COMPANY-01] EDGE-039 follow-up 회귀 — 신규 type='broker' 거래처 등록 통과 + dead row 영구화

- **발견일**: 2026-05-15
- **심각도**: critical (DB 오염 영구화 + 후속 deactivate 불가)
- **상태**: fixed (Service 가드만 — UI 옵션은 유지) — `CompanyCommandService.createCompany` 신규 INSERT 분기에 `request.type === 'broker'` 가드 + 새 도메인 에러 `CompanyTypeBrokerForbiddenError` (httpStatus 400). 단위 테스트 18건 회귀 가드 (company-command.service + company-application.service). UI 폼 옵션 정리 + 운영 DB 의 type='broker' dead row 정리는 별도 follow-up.
- **재현**:
  1. broker 로그인 (`<QA_ACCOUNT>`)
  2. `POST /api/companies` body=`{ name:'X', businessNumber:'999-99-99999', ceoName:'X', type:'broker', contact:{tel:'02-1234-5678', mobile:'01000000000'} }`
  3. 응답: 201 Created + 신규 id 반환 (예: `3d3b2c2d-...`)
  4. `GET /api/companies?page=1&pageSize=100` → 응답에 미노출 (EDGE-045 defensive layer 작동)
  5. `GET /api/companies/{newId}` → 404 (defensive layer 작동)
  6. `PATCH /api/companies/{newId}/status` body=`{status:'inactive'}` → **404 — deactivate 도 차단**
- **현상**:
  - EDGE-039 fix (`25b2d6bc`) 가 silent reuse 분기의 type=broker 가드만 추가. `createCompany` 의 신규 INSERT 분기는 type 가드 없이 그대로 INSERT.
  - read path (findById/findMany) 는 EDGE-045 의 `ne(companies.type, 'broker')` defensive layer 로 차단되지만, write path (INSERT) 와 status PATCH 는 type 검증 부재.
  - 사용자 입장: "등록 완료" 토스트 → list 비노출 → 재시도 → dead row 누적.
  - DBA 입장: row 가 DB 에 잔존하지만 service layer 에서 더 이상 read/update 불가 (orphaned).
- **원인 추정**:
  - `server/company/application/commands/company-command.service.ts` createCompany 의 신규 INSERT 분기 (silent reuse 분기 제외) 가 type 검증 안 함.
  - `CompanyStatusCommandService` (`status/route.ts`) 가 동일 defensive layer 의 findById 를 통해 row 못 찾음 → 404 throw.
  - UI 폼 (`broker-company-form.tsx:48`): `COMPANY_TYPE_OPTIONS = ['화주', '운송사', '주선사']` — 사용자에게 broker 옵션 노출.
- **확인점 (Fix 방향)**:
  1. `createCompany` 신규 INSERT 분기에 `if (input.type === 'broker') throw new BrokerTypeForbiddenError()`.
  2. UI 폼의 `COMPANY_TYPE_OPTIONS` 에서 '주선사' 제거 (broker 화면의 거래처 등록은 화주/운송사만).
  3. 운영 DB 정리 마이그레이션: `companies WHERE type='broker' AND created_at >= '<EDGE-039 fix 이후>'` 검출 → DBA 수동 정리.
  4. 회귀 테스트:
     - `[broker A 시점] POST /api/companies { type:'broker' } → 명시적 4xx + DB INSERT 0건`
     - `UI 등록 폼 type 드롭다운 옵션에 broker 미존재`
- **참고**: EDGE-045 의 defensive layer 가 read 경로만 막고 write 경로는 미적용. 이 구조 자체가 "depth in defense" 의 비대칭.

#### [EDGE-2026-05-15-COMPANY-02] 사업자번호 체크섬 검증 부재 — '0000000000' 등록 통과

- **발견일**: 2026-05-15
- **심각도**: critical (정산/세금계산서 grouping 깨짐 + 운영 데이터 오염)
- **상태**: fixed (신규 입력만 강제, reconstitute 우회 — 운영 historical row 보호) — `BusinessNumber.isValid` 에 한국 국세청 표준 체크섬 알고리즘 + 모든 자리 동일 가드 추가. create() 경로만 강제 (createCompany / updateCompany BN 변경 / validate route), reconstitute() 는 DB raw 신뢰 invariant 유지로 historical 가짜 row 도 조회 가능 — 운영 break risk 0. 회귀 가드 단위 테스트 9건 (0000000000 / 1111111111 / 1234567890 / 1068150726 거부 + 1208147521 네이버 / 1248100998 카카오 / 120-81-47521 통과 + reconstitute 우회 검증). 기존 모든 회귀 테스트의 가짜 BN 5건 (1068150726 / 106-81-50726 / 2078150726 / 3088150726 / 5555555555 / 1208155930 / 1234567890 / 1112233333 / 9999999999) 를 valid BN 3종 (1208147521 / 1248100998 / 1208150929) 으로 일괄 교체. 116/116 company unit test pass. 운영 DB historical row 정리는 별도 행정 트랙.
- **현상**:
  - 한국 사업자등록번호 체크섬 알고리즘 (마지막 자리 = 가중치 합 검증) 미구현.
  - `BusinessNumber.create()` 가 길이/형식만 검증, 실제 유효성 미검증.
  - 동일 패턴: `'1111111111'`, `'1234567890'` 등 명백한 가짜 BN 모두 통과 가능.
- **확인점**:
  - `BusinessNumber.create()` 에 한국 BN 체크섬 알고리즘 추가:
    ```
    weight = [1,3,7,1,3,7,1,3,5]
    sum = Σ(digit[i] * weight[i]) + ⌊digit[8] * 5 / 10⌋
    valid: (10 - sum % 10) % 10 === digit[9]
    ```
  - 운영 DB 정리: `SELECT * FROM companies WHERE business_number !~ '<체크섬 정규식>'` 후 검토.
  - 회귀 테스트: `'0000000000'`, `'1111111111'`, `'9999999999'` 모두 400 거부.

#### [EDGE-2026-05-15-COMPANY-03] commit b735e1c38 회귀 재발 — 사업자번호 미변경 PATCH 시 중복 에러

- **발견일**: 2026-05-15
- **심각도**: high (사용자 일상 흐름 차단)
- **상태**: fixed (depth-in-defense 3단) — (1) `BusinessNumber.equals` 양쪽 정규화 후 비교 (EDGE-038 의 formatted 정상화와 동일 정책 — 진짜 root cause). (2) `CompanyDomain.ensureBusinessNumberIsUnique(bn, excludeId?)` overload + `existsByBusinessNumber(bn, excludeId?)` Port/Repository 시그니처 확장으로 SQL `ne(companies.id, excludeId)` self 제외. (3) `CompanyCommandService.updateCompany` 가 BN 변경 분기에서 `company.id` 를 excludeId 로 전달. 단위 테스트 6건 신규 + 기존 호환 1건 포함 총 회귀 가드. equals 비대칭은 historical hyphen 형식 row (DB raw '106-81-50726') reconstitute 시 단순 string 비교 실패가 진짜 원인이었음.
- **재현**:
  1. broker 로그인
  2. cccc0001 (BN '703-81-33333') 거래처 대상
  3. `PATCH /api/companies/cccc0001-.../fields` body=`{ fields: { businessNumber: '703-81-33333' } }`
  4. 응답: **400 "이미 등록된 사업자번호입니다"**
- **비교**:
  - BN 필드 안 보내고 다른 필드 (name) 만 변경 → 200 ✓
  - BN 새 값 ('703-81-99999') 변경 → 200 + 반영 ✓
  - 다른 회사의 BN ('704-81-44444') 으로 변경 → 400 (정상)
- **현상**:
  - `b735e1c38 fix: 업체 수정 시 사업자번호 미변경인데 중복 에러 발생하는 버그 수정` commit 가 동일 시나리오 fix 했으나 회귀.
  - update 단의 BN 중복 검사가 self ID 제외 없이 단순 lookup → "BN 존재" 발견 시 무조건 throw.
  - 사용자 입장: 폼에서 BN 칸 안 건드리고 다른 필드만 수정하려 해도 form 이 모든 field 를 PATCH body 에 포함 → 400.
- **원인 추정**:
  - `CompanyCommandService.updateCompany` 의 BN 중복 검사가 `findByBusinessNumber(bn)` 후 self.id 와 비교 없이 throw.
  - b735e1c38 fix 가 unit test 로 회귀 가드 안 되었거나, SOLID 리팩토링 (b5c9c0041 SRP-1 / 6895faeb8 ISP / 68d121db5 DIP) 흐름에서 코드 이전 중 가드 누락.
- **확인점 (Fix 방향)**:
  - `updateCompany` BN 중복 검사를 `findByBusinessNumberExceptId(bn, excludeId)` 또는 `if (existing && existing.id !== updateId) throw` 로 변경.
  - 회귀 테스트 (unit + integration):
    - `PATCH cccc0001 { businessNumber: '703-81-33333' (현재 값) } → 200`
    - `PATCH cccc0001 { businessNumber: '704-81-44444' (다른 회사 BN) } → 400`
    - `PATCH cccc0001 { businessNumber: '703-81-99999' (신규 BN) } → 200 + GET 반영 검증`

#### [EDGE-2026-05-15-COMPANY-04] 전화번호 input 자동 reformat 손상 — 02-XXXX-XXXX → 021-XXX-XXX

- **발견일**: 2026-05-15
- **심각도**: high (서울/세종/제주 등 2자리 지역번호 시스템적 손상)
- **상태**: fixed (option B — form-utils.progressive + manual-add-overlay 중복 함수 동기화) — `formatPhoneNumberProgressive` 와 LMS manual-add-overlay 의 동일 형 reformat 함수에 02 (2-4-4) + 지방 10자 (3-3-4) 분기 추가. 휴대폰 11자 (3-4-4) 흐름 보존. 회귀 가드 unit 18건 (form-utils 12 기존 + 6 신규: 02 서울 4 + 지방 3 + 휴대폰 회귀 2). 인접 호출처 (broker_driver / broker_address / broker_register_location / broker_company / broker_dispatch_info_vehicle) 자동 수혜. cross-module 결합 회피 위해 manual-add-overlay 는 local 함수 유지 — 중복은 추후 별도 PR 로 공통 utility 추출 검토.
- **재현**:
  1. broker 등록 시트 → 전화번호 칸에 `02-1234-5678` 입력
  2. 다른 필드 클릭 (또는 등록 버튼 클릭 직전)
  3. `document.querySelector('input[name=phone...]').value` → **`021-2345-678`** (입력값 손상)
- **현상**:
  - input level reformat 로직이 모든 전화번호를 `3-4-3` 형식으로 강제 → 02 (서울) 가 021 로 잘못 잘림.
  - 서울 (02), 세종 (044), 제주 (064), 인천 (032) 등 2자리/3자리 지역번호 모두 손상.
  - commit `8d86a5724 fix: 전체 폼 input 레벨 입력 제한 일괄 적용` 회귀 의심.
- **확인점**:
  - 전화번호 reformat 로직을 지역번호별 분기:
    - 02 (서울): `02-XXXX-XXXX` (2-4-4)
    - 010/011 (휴대폰): `010-XXXX-XXXX` (3-4-4)
    - 0NN (기타): `0NN-XXX-XXXX` 또는 `0NN-XXXX-XXXX`
  - 회귀 테스트: 입력 `'02-1234-5678'` → 저장값 `'02-1234-5678'` 보장.

#### [EDGE-2026-05-15-COMPANY-05] 등록 버튼 단일 클릭 → POST 2번 발사 (debounce/idempotency 부재)

- **발견일**: 2026-05-15
- **심각도**: high (race condition 표면 + 중복 에러 → 사용자 혼란)
- **상태**: fixed (option B — handleSubmit 진입 mutation.isPending 가드) — Sheet handleSubmit 의 첫 줄에 `if (createCompanyMutation.isPending || updateCompanyMutation.isPending) return` 가드 추가. 90% 일반 더블 클릭 (수십~수백 ms 차) 차단. 진짜 미세 race window (수 ms) 는 백엔드 idempotency (EDGE-2026-05-15-COMPANY-06) 로 보완 예정. 회귀 가드 2건 unit (register/edit 모드 각각 mock button click 시 mutateAsync/updateCompany service 호출 0). mock 의 disabled 가드를 무시하고 sheet 내부 isPending 가드 자체를 검증하도록 mock 수정.
- **재현**:
  1. broker 등록 시트 → 모든 필수 필드 채움
  2. "업체 등록" 버튼 1회 클릭
  3. DevTools Network 탭 → `POST /api/companies` 가 **2회** 발사 (인덱스 47, 48)
- **현상**:
  - submit handler 의 React state guard 부재 또는 useMutation 의 isPending 미체크.
  - 첫 번째 응답 도착 전 두 번째 호출 발사 → race condition.
  - 운영에서 빠른 응답 시: 첫 호출 201 + 두 번째 호출 400 "이미 등록된 사업자번호" → 사용자 혼란 토스트 2개.
  - 운영에서 느린 응답 시: 두 번째 호출이 같은 BN 으로 중복 시도 → DB UNIQUE violation race ([EDGE-2026-05-15-COMPANY-06] 와 결합).
- **확인점**:
  - 등록 버튼 disabled while isPending.
  - useMutation 호출처에서 `mutateAsync` 한 번만 발사 (이중 트리거 방지).
  - 회귀 테스트: E2E 에서 빠른 더블 클릭 → POST 1회만 fire.

#### [EDGE-2026-05-15-COMPANY-06] 동시 POST race → 500 (정상은 400)

- **발견일**: 2026-05-15
- **심각도**: high (Sentry 노이즈 + UX)
- **상태**: fixed (Repository.save try/catch + UNIQUE violation 매핑) — `server/company/infrastructure/postgres-errors.ts` 신규 `isUniqueViolation(error, constraintName?)` helper + `COMPANY_BUSINESS_NUMBER_CONSTRAINT` 상수. driver 별 (pg / postgres-js / drizzle wrap) 에러 형식 차이를 흡수 (`code`, `constraint`, `constraint_name`, `cause` 체인). `DrizzleCompanyRepository.save` 의 transaction wrapper 에 try/catch 추가 — sqlstate 23505 + `companies_business_number_unique` 매치 시 `DuplicateBusinessNumberError` 로 변환 → withErrorHandler 가 자동 400 + "이미 등록된 사업자번호" 응답. 그 외 raw 에러는 그대로 re-throw (진짜 500 시그널 보존). 단위 테스트 8건 (postgres-errors.test.ts) + 전체 company suite 700/700 회귀 가드. COMPANY-05 의 FE 가드와 짝 — FE 가 일반 더블 클릭, BE 가 진짜 미세 race window 차단 depth-in-defense 완성. layer 정리: PostgreSQL 세부는 Infra 에만, Service 는 도메인 에러만 처리 (DIP 정합).
- **재현**:
  1. broker 로그인
  2. 같은 BN 으로 3개 동시 POST (`Promise.all([fetch, fetch, fetch])`)
  3. 응답: 1개 201 + 2개 **500 "서버 내부 오류가 발생했습니다."**
- **현상**:
  - DB UNIQUE 제약 violation 이 도메인 에러 (`DuplicateBusinessNumberError`) 로 매핑되지 않고 raw error 가 throw → withErrorHandler 가 500 으로 매핑.
  - 정상 응답은 400 + "이미 등록된 사업자번호입니다" 여야 함.
  - DB 정합성: ✅ UNIQUE 제약 작동 (1건만 INSERT).
- **확인점**:
  - `CompanyCommandService.createCompany` 의 INSERT try/catch 에서 PostgreSQL `unique_violation` (sqlstate 23505) 잡아 `DuplicateBusinessNumberError` 로 변환.
  - 또는 INSERT before findByBusinessNumber 의 race window 를 SERIALIZABLE transaction 또는 retry-with-backoff 로 닫기.
  - 회귀 테스트: `Promise.all([POST, POST, POST])` 같은 BN → 1개 201 + N-1개 400.

### 🟡 Medium

#### [EDGE-2026-05-15-COMPANY-07] 공백/점 분리 BN reuse 분기 우회 — silent reuse 비대칭

- **발견일**: 2026-05-15
- **심각도**: medium
- **상태**: open
- **재현**:
  1. POST `{ businessNumber: '703 81 33333' }` (이미 등록된 BN, 공백 분리)
  2. 응답: 400 "유효하지 않은 사업자번호입니다."
  3. 같은 케이스 `{ businessNumber: '703.81.33333' }` (점 분리) → 400 같은 메시지
- **비교**:
  - `703-81-33333` (하이픈 표준) → 400 "이미 등록된 사업자번호" (reuse 차단 정상)
  - `7038133333` (정규화) → 400 "이미 등록된 사업자번호" (reuse 차단 정상)
  - `703--8-1-33333` (다중 하이픈) → 400 "이미 등록된 사업자번호" (EDGE-028 fix 정상)
- **현상**:
  - EDGE-028 의 `businessNumberMatches()` 양 형식 OR 비교가 reuse 단계 진입 후엔 작동하나, syntax 검증 (BusinessNumber.create) 단계가 공백/점 거부 → reuse 분기 진입 못 함.
- **확인점**:
  - `BusinessNumber.create()` 의 정규식을 `/^\d{3}[-.\s]?\d{2}[-.\s]?\d{5}$|^\d{10}$/` 로 확장 (정규화 시 `[-.\s]` 모두 제거).
  - 회귀 테스트: '703 81 33333', '703.81.33333' → reuse 분기 진입 → 400 "이미 등록된" 메시지.

#### [EDGE-2026-05-15-COMPANY-08] UI required(*) 표시와 schema optional 비대칭

- **발견일**: 2026-05-15
- **심각도**: medium (silent 데이터 결함)
- **상태**: open
- **재현**:
  1. broker 등록 시트 → "업체명 / 사업자번호 / 대표자 / 전화번호" 4개 필드 채우고 나머지는 빈값
  2. 등록 버튼 클릭
  3. **"담당자 전화번호 *", "은행 *", "예금주 *", "계좌번호 *"** 필드는 빨간 별표(*)가 있으나 빈값 검증 에러 없음
  4. 등록 진행 (또는 진행 차단 비대칭)
- **현상**:
  - UI label `*` 와 schema (`CreateCompanySchema`) 의 `bankAccount: { ... }.optional()` 비대칭.
  - 사용자에게 "필수" 라고 약속하지만 schema 는 optional → 빈값 거래처 등록 가능.
- **확인점**:
  - 정책 결정: 은행/예금주/계좌가 정말 필수인가? 일부 type (carrier 차주) 만 필수인가?
  - schema 와 UI 라벨 정합성:
    - 정말 필수면 schema 에 `.min(1)` 추가 + form validation 에 에러 메시지
    - optional 이면 UI label `*` 제거
  - 회귀 테스트: form validation 단계에서 빈 필수 필드 → 명시적 에러 표시.

#### [EDGE-2026-05-15-COMPANY-09] 비정상 page number(99999) 무제한 200 응답

- **발견일**: 2026-05-15
- **심각도**: medium (DoS 표면 + UX)
- **상태**: open
- **재현**:
  - `GET /api/companies?page=99999&pageSize=10` → 200 + 빈 데이터
  - totalPages=6 인데 99999 도 200
- **현상**: page max 검증 없음. 봇 무한 페이지 호출 + UI 실수 입력 시 빈 화면.
- **확인점**:
  - `CompanySearchSchema` 에 `page` 의 max 검증 추가 또는 `if (page > totalPages) return { data: [], page, total }` 일관 응답.
  - 회귀 테스트: page=999999 → 400 또는 명시적 빈 응답 (현재 200 + 빈 data).

#### [EDGE-2026-05-15-COMPANY-10] /api/companies/ trailing slash → 308 redirect

- **발견일**: 2026-05-15
- **심각도**: medium (latency)
- **상태**: open
- **재현**:
  - 페이지 진입 시 Network 탭: `GET /api/companies/` → 308 → `Location: /api/companies` → 재호출
- **현상**: 클라이언트 호출처 어딘가에 trailing slash 잔존. 매 페이지 진입 redirect 1회 추가.
- **확인점**:
  - `Grep -r "/api/companies/'"` 또는 URL 빌더 점검.
  - 회귀 테스트: list 진입 시 GET `/api/companies` 1회만 (redirect 없이).

#### [EDGE-2026-05-15-COMPANY-11] /api/companies 동일 호출 2번 (parameterized + no-param)

- **발견일**: 2026-05-15
- **심각도**: medium (백엔드 부하 2배)
- **상태**: open
- **재현**:
  - 페이지 진입 시: `GET /api/companies?page=1&pageSize=10` (200) + `GET /api/companies` (200)
  - 둘 다 동일 53건 응답.
- **현상**: 두 hook (또는 한 hook 의 두 번 mount) 이 동일 데이터 요청. SWR/React Query dedupe 미작동 (URL 다름 → cache key 다름).
- **확인점**:
  - hook 호출처 점검 (`useCompanyList` / `useCompanies` / 등 중복 fetcher).
  - cache key 통일 (querystring normalize) 또는 한 곳으로 통합.
  - 회귀 테스트: list 진입 시 GET `/api/companies` 1회만.

### 🟢 Low

#### [EDGE-2026-05-15-COMPANY-12] console.log 잔존 — 운영 콘솔 노이즈 + 민감 데이터 노출

- **발견일**: 2026-05-15
- **심각도**: low (운영 콘솔 hygiene)
- **상태**: open
- **위치**:
  - `components/broker/company/broker-company-form.tsx:150` → `console.log('data:', data);`
  - `components/broker/company/broker-company-form.tsx:217` → `console.log('정규화된 회사 데이터:', normalized);`
- **현상**: 등록/수정 시트 열 때마다 사업자번호/계좌 등 민감 데이터가 브라우저 콘솔에 출력.
- **확인점**:
  - `next.config.ts` 의 `compiler.removeConsole` 가 production 에선 제거하지만 develop/staging 에선 그대로.
  - 개발 hygiene: 명시적 디버그 console.log 는 PR 머지 전 제거. ESLint `no-console` 규칙 적용 검토.

#### [EDGE-2026-05-15-COMPANY-13] 페이지 초기 진입 "총 업체 수 0개" 깜빡임 (skeleton 부재)

- **발견일**: 2026-05-15
- **심각도**: low (UX/메트릭)
- **상태**: open
- **재현**: /broker/company/list 진입 → 데이터 로드 전 (~1-2초) 0/0/0 표시 → 데이터 로드 후 53/53/0
- **현상**: skeleton/loading state 부재. 초기 0 이 실제 데이터처럼 보임.
- **확인점**:
  - 요약 카드 (`총 업체 수 / 활성 / 비활성`) 에 `{isLoading ? <Skeleton /> : count}` 분기.
  - 회귀 테스트: 초기 mount 후 첫 paint 에 "—" 또는 skeleton 표시.

#### [EDGE-2026-05-15-COMPANY-14] keyword 검색 공백 trim 부재

- **발견일**: 2026-05-15
- **심각도**: low (UX)
- **상태**: open
- **재현**: `GET /api/companies?keyword=%20%20%20` → total=0 (의도상 전체 조회여야)
- **확인점**: `CompanySearchSchema` 의 `keyword: z.string().optional().transform(s => s?.trim() || undefined)` 적용.

#### [EDGE-2026-05-15-COMPANY-15] keyword max length 부재

- **발견일**: 2026-05-15
- **심각도**: low (잠재 DoS)
- **상태**: open
- **재현**: 1000자 keyword → 200 OK + DB ILIKE 부담.
- **확인점**: `CompanySearchSchema` 의 `keyword.max(100)` 또는 적절한 길이 제한.

#### [EDGE-2026-05-15-COMPANY-16] zod vs 도메인 에러 메시지 비대칭

- **발견일**: 2026-05-15
- **심각도**: low (UX 일관성)
- **상태**: open
- **재현**:
  - `'999999999'` (9자 숫자) → "올바른 사업자번호 형식이 아닙니다." (zod min(10))
  - `'!@#$%^&*()'` (10자 특수문자) → "유효하지 않은 사업자번호입니다." (도메인)
- **현상**: 같은 invalid 인데 두 다른 메시지. 사용자 입장에서 혼란.
- **확인점**: 메시지 통일 (e.g. "사업자번호는 10자리 숫자여야 합니다 (예: 000-00-00000).").

---

## /broker/order/register (오더 등록) — 2026-05-15 QA sweep

> 식별자 형식: `EDGE-2026-05-15-REGISTER-NN` (세션-고유, COMPANY 세션과 EDGE-NNN 충돌 회피)
> 환경: dev 서버 포트 3000/3001/3002/3003 사이 충돌 다수 발생, 3003 으로 정상 진행. Turbopack cold compile 60s+ 대기 후 진입.
> 검증 범위: 화물 등록 폼 전체 흐름 (화주 선택 → 상하차 picker → 일시 → 운임 → 등록). 400 커밋 기준 회귀 + 신규 엣지케이스.

### ✅ 회귀 PASS

#### [EDGE-2026-05-15-REGISTER-PASS-01] 상하차 picker 슬롯 필터링 (700dbfe2 회귀 가드)

- **검증일**: 2026-05-15
- **재현**:
  1. broker (`<QA_ACCOUNT>`) 로그인 → QA 화주 A社 선택
  2. 상차 주소록 모달 → 7건 노출 (QA 상차전용 A, QA 상하차 통합 ✓, QA 하차전용 ✗)
  3. 하차 주소록 모달 → 5건 노출 (QA 하차전용 ✓, QA 상하차 통합 ✓, QA 상차전용 A ✗)
- **결과**: `/api/addresses?type=load|drop` 분기로 슬롯-적합 주소만 노출. 회귀 PASS.

#### [EDGE-2026-05-15-REGISTER-PASS-02] 화주 검색 SQL injection 가드

- **검증일**: 2026-05-15
- **재현**: 화주 조회 모달 → `'; DROP TABLE companies; --` 입력 후 검색
- **결과**: "검색 결과가 없습니다" 안전 응답, drizzle prepared statement 정상.

### 🔴 Critical

#### [EDGE-2026-05-15-REGISTER-01] 등록 성공 → 운임 생성 실패 시 settlementDraft 휘발

- **발견일**: 2026-05-15 (정적 분석)
- **심각도**: critical (정산 결손 직결)
- **상태**: open
- **위치**: `components/broker/order/register-summary-ver03.tsx:145-225` `handleConfirm`
- **재현 (정적)**: 흐름 순서
  1. `await registerMutation.mutateAsync()` 성공 (response.id 확보)
  2. `resetForm()` + `resetSettlementDraft()` 호출 — store 비워짐
  3. `getOrderWithDispatchDetail()` → `createChargeFromAdditionalFee()` 시도
  4. 3-4 단계 어디서든 throw → `toast({ title: '운임 생성 실패' })` 만 띄우고 끝
- **현상**: 화물은 등록됐지만 운임 0원 으로 시작. settlementDraft 이미 reset → 사용자가 운임 보정하려면 화물 상세 진입 후 재입력.
- **확인점**: 운임 생성 실패 시 (a) settlementDraft 복원 + 재시도 UI, 또는 (b) 등록+운임을 BE 단일 트랜잭션. 메모리 P0-1 정산 부동소수점 이슈와 같은 카테고리.

### 🟠 High

#### [EDGE-2026-05-15-REGISTER-02] 하차 일시 캘린더 — 과거/상차일 이전 무제한 선택 가능

- **발견일**: 2026-05-15 (브라우저 검증)
- **심각도**: high (잘못된 일정 화물이 정산/배차 단계로 흘러감)
- **상태**: open
- **재현**:
  1. /broker/order/register 화주 선택 → 상차 시 콤보 23:00 (자동 effect 로 하차 = 2026-05-16 01:00 세팅)
  2. 하차 일시 캘린더 → "14" (어제, 2026-05-14) 셀 클릭
  3. 하차 일시 표시: `2026-05-14 22:00` (상차보다 **25시간 이른**)
- **현상**: 캘린더 day 셀 4/26~6/6 전부 `disabled=false`. FE 차단 없음. 화물 정보까지 입력하면 "화물 등록" 모달까지 진행 가능. `services/orders/registration.ts:ICreateOrderRequest` 또는 zod 스키마에 `pickupDate ≤ deliveryDate` refine 없음으로 추정.
- **부수 결함 (a11y)**: 캘린더 day 셀 모두 `aria-label=null` → 스크린리더로 날짜 판독 불가.
- **확인점**: react-day-picker 의 `disabled={{ before: pickupDate }}` prop + zod refine. day 셀에 `aria-label="2026년 5월 14일"` 형식 부여.

#### [EDGE-2026-05-15-REGISTER-03] 좌표 0,0 fallback → 위경도(0,0) 저장 + 거리 계산 silent skip

- **발견일**: 2026-05-15 (정적 분석)
- **심각도**: high (data quality 누적)
- **상태**: open
- **위치**: `services/orders/registration.ts:134-135, 153-154`
- **코드**:
  ```ts
  metadata: { lat: formData.departure.latitude || 0, lng: formData.departure.longitude || 0 }
  ```
- **재현 (정적)**: 사용자가 picker 없이 주소 수기 입력 → lat/lng 누락 → `|| 0` 로 (0,0) (서아프리카 기니만 앞 바다 좌표) 저장.
- **현상**: addresses 테이블에 lat=0,lng=0 row 생성. 다음 등록의 picker 재사용 시 `register-form-ver03.tsx:452` 의 거리 계산 effect 가드 `if (departure.latitude && departure.longitude && ...)` 가 0=falsy 로 차단 → 거리 계산 silent skip.
- **확인점**: 좌표 누락 시 `null` (DB 컬럼 nullable) + zod refine 으로 한국 영역 (33≤lat≤39, 124≤lng≤132) 검증.

#### [EDGE-2026-05-15-REGISTER-04] 주소록 모달 첫 진입 시 silent empty fallback

- **발견일**: 2026-05-15 (브라우저 검증)
- **심각도**: high (UX → 중복 row 누적 트리거)
- **상태**: open
- **재현**:
  1. /broker/order/register 화주 선택
  2. 하차 주소록 모달 처음 열기 (또는 상차 모달 닫고 즉시 하차 모달)
  3. 모달 첫 프레임 ~1초간
- **현상**: 모달 상단 "전체 주소 0 / 자주 사용 0" 표시, 본문 빈 영역. 1초 뒤 200 OK 도착하며 5건 채워짐. Network 로그: `/api/addresses?type=drop` 첫 호출 `net::ERR_ABORTED` 후 재시도 200 OK (request idx 43-46 abort, 53-54 OK).
- **UX 영향**: 사용자가 "주소 없네" 오인 → "주소 추가" 클릭 → 신규 row 생성 (orphan/중복 누적, [EDGE-2026-05-15-REGISTER-05] 와 연결).
- **확인점**: 모달 mount 시 `<Skeleton>` 노출. 빈 상태 UI 는 `data.length===0 && !isLoading` 조건일 때만 표시.

### 🟡 Medium

#### [EDGE-2026-05-15-REGISTER-05] 주소록 모달 mount 1회 → API 4건 중복 발사

- **발견일**: 2026-05-15 (브라우저 검증)
- **심각도**: medium (performance + race condition)
- **상태**: open
- **재현**: 하차 주소록 모달 열기 1회 → DevTools Network → `/api/addresses?type=drop` 2건 + `/api/addresses/frequent?type=drop` 2건 = 4 requests
- **원인 추정**: AddressService 호출이 useEffect 안에서 cleanup 미흡, React StrictMode 이중 마운트.
- **확인점**: useEffect cleanup 에서 `AbortController.abort()` + 의존성 배열 점검. 운영 빌드(StrictMode 비활성)에서도 발생하는지 회귀 확인.

#### [EDGE-2026-05-15-REGISTER-06] 자동 1시간 추가 effect — 사용자가 하차일시 지우는 즉시 발동

- **발견일**: 2026-05-15 (정적 분석)
- **심각도**: medium (UX 의외 동작)
- **상태**: open
- **위치**: `components/broker/order/register-form-ver03.tsx:559-605`
- **재현 (정적)**: 조건 `if (departure.date && departure.time && (!destination.date || !destination.time))` — 사용자가 하차 일시를 의도적으로 비웠을 때도 자동 effect 발동.
- **현상**: 사용자 의도와 다른 자동 시간 세팅. 추가로 동일 브라우저 세션에서 상차 09:00 → 23:00 변경 시 하차가 +1시간이 아닌 **+2시간** (2026-05-16 01:00) 으로 변경됨 확인 (`adjustMinutesToHalfHour` 와 상호작용 의심).
- **확인점**: effect 의 트리거 조건을 "사용자가 명시적으로 비운 적 없을 때" 로 제한. `+1h` 계산이 `+2h` 가 되는 이유 별도 조사.

#### [EDGE-2026-05-15-REGISTER-07] 빠른 더블클릭 가드 미흡 — mutateAsync 2회 호출 가능

- **발견일**: 2026-05-15 (정적 분석)
- **심각도**: medium (이중 등록 위험)
- **상태**: open
- **위치**: `components/broker/order/register-summary-ver03.tsx:415` `<Button disabled={registerMutation.isPending}>`
- **재현 (정적)**: React state update 와 click handler 사이 짧은 윈도우 (~16ms) 에 더블클릭 → `handleConfirm` 2회 호출 → `mutateAsync` 2회 → 백엔드에서 중복 화물 2건 INSERT.
- **확인점**: `useRef` 기반 즉시 lock 또는 `useMutation` 의 `onMutate` 에서 ref 체크. order-list 의 EDGE-001 (운송 수락 더블클릭) 와 같은 카테고리.

#### [EDGE-2026-05-15-REGISTER-08] toNum 부동소수점/음수/NaN 미처리

- **발견일**: 2026-05-15 (정적 분석)
- **심각도**: medium (메모리 P0-1 정산 이슈와 직결)
- **상태**: open
- **위치**: `components/broker/order/register-summary-ver03.tsx:192`
- **코드**: `const toNum = (s?: string) => (s ? Number(String(s).replace(/,/g, '')) : 0)`
- **현상**: (a) 사용자가 "abc" 입력 시 `NaN` → BE 전송, (b) 음수 입력 미차단, (c) 0.1+0.2 = 0.30000000000000004 누적 오차 그대로 BE.
- **확인점**: zod 검증 (Number.isFinite + non-negative) + BigDecimal 또는 Intl.NumberFormat 기반 처리.

### 🟢 Low

#### [EDGE-2026-05-15-REGISTER-09] dispatchId silent catch — 운임 misroute 가능

- **위치**: `register-summary-ver03.tsx:186-190` `try { ... } catch {}` — dispatch 조회 실패 시 `dispatchId=undefined` 로 `createChargeFromAdditionalFee` 호출 → 청구는 생성되지만 배차 운임 누락 가능.

#### [EDGE-2026-05-15-REGISTER-10] JSON.parse(JSON.stringify) deep clone

- **위치**: `register-summary-ver03.tsx:76` — 성능 영향 작지만 Date 객체/Symbol 손실 위험. `structuredClone()` 권장.

#### [EDGE-2026-05-15-REGISTER-11] 도로명 없는 주소 row 잔존 (data quality)

- 주소록 모달에 "444" 명만 있고 도로명 없는 row 3건 노출. 과거 `30058617` fix 이전 등록분으로 추정. 마이그레이션 정리 + 등록 시점 도로명 필수 검증 필요.

#### [EDGE-2026-05-15-REGISTER-12] console.log 30+건 production 빌드 출력

- `register-form-ver03.tsx` 전반에 디버그 console.log 잔존. 운영에서 사용자 콘솔에 노출.

---

## 매출정산 /broker/sale — 2026-05-15 FB-QA 라운드 (최근 400 커밋 회귀 탐색)

> 식별자 형식: `EDGE-2026-05-15-SALE-NN` (세션-고유, 다른 세션의 EDGE-NNN 과 충돌 회피)
> 환경: 포트 3000 (`npm run dev`, Next.js 15.3.6 + Turbopack), 계정 `<QA_ACCOUNT>` / `12341234`, broker A `0f668a27-...`
> 회귀 PASS: EDGE-5022/5025 (요약 패널 ROUND 정수 1,879,849,943), EDGE-5023 (패널↔list 정합성), EDGE-5027 (URL 직접 진입 클라이언트 가드, 완료 49건/195,478,300원 정상), 1ebaced9 (캘린더 defaultMonth = 5월 2026), JWT 헤더 위조 차단, 사이드바 단일 진입점.

### 🔴 Critical

#### [EDGE-2026-05-15-SALE-01] INVALID/빈 status → silent fallback 으로 전체 합계 노출 (EDGE-5027 family API 단 잔존)

- **발견일**: 2026-05-15
- **심각도**: critical (외부 ERP/엑셀 API 직접 호출 시 misleading 합계 — 회계 의사결정 왜곡 잠재)
- **상태**: fixed (`01676778`) — sales-bundles/purchase-bundles 의 list/ids/summary 4 endpoint 에 z.enum(STATUSES).optional() 적용. 공통 SALES_BUNDLE_STATUSES / PURCHASE_BUNDLE_STATUSES 상수 추출 (DB pgEnum 동기화). 회귀 가드 unit test 13건.
- **재현**:
  1. `GET /api/charge/sales-bundles/summary?status=INVALID_STATUS_VALUE` → 200 + totalCount=2006, totalAmount=2,075,328,243 (전체 탭 합계)
  2. `GET /api/charge/sales-bundles/summary?status=` (빈 값) → 200 동일 응답 (전체 합계)
  3. 정상 `status=draft` 응답: totalCount=1957, totalAmount=1,879,849,943 (대사만)
  4. 정상 `status=paid` 응답: totalCount=49, totalAmount=195,478,300 (완료만)
- **현상 비대칭**:
  - 클라이언트 `BUNDLE_STATUS_BY_TAB[tab]` 가드는 EDGE-5027 fix 로 정상 동작 (UI QA 통과)
  - 하지만 API 자체는 INVALID 입력에 status 무시 → 전체 합계 silent fallback
  - 외부 ERP, 엑셀 다운로드, 외부 보고 메일 등 직접 호출자에 안전망 없음
- **원인**:
  - `app/api/charge/sales-bundles/summary/validation.ts:salesBundleSummaryQuerySchema` 가 `status: z.string().optional()` 으로 enum 제약 없음
  - service 가 invalid status 시 자동 fallback (전체 합계 응답)
- **확인점 (Fix 방향)**:
  - validation schema 에 `status: z.enum(['draft','paid','closed', ...]).optional()` 적용
  - INVALID 입력 시 400 응답 (silent fallback 차단)
  - 회귀 가드 unit test: invalid status → 400, valid status → 200

#### [EDGE-2026-05-15-SALE-02] 매출 번들 list endpoint 소수점 노출 (EDGE-5025 list 단 회귀 가드 빈 곳)

- **발견일**: 2026-05-15
- **심각도**: critical (외부 ERP 가 list 응답 직접 사용 시 소수점 단위 오차 누적, 회계 정합성 직격)
- **상태**: fixed (`b5e335ff`) — bundle-adjustment-totals.ts 의 buildSumSql 에 ROUND 추가 (매출+매입 공유 헬퍼 1곳에서 4 컬럼 동시 정수화). sales-bundle-list.repository 의 broker+shipper 2 variant 와 purchase-bundle-list.repository 의 raw totalAmount/totalTaxAmount/itemBaseAmountSum 모두 sql\`ROUND(...)\` 적용.
- **재현**:
  1. `GET /api/charge/sales-bundles?page=1&pageSize=100&status=draft`
  2. 첫 페이지 100건의 `totalAmount + totalTaxAmount + itemExtraAmount + itemExtraAmountTax + bundleExtraAmount + bundleExtraAmountTax` 합 = **1,879,849,943.3** (.3 잔존)
  3. summary endpoint 합 = 1,879,849,943 (ROUND 적용된 정수)
- **현상 비대칭**:
  - EDGE-5025 fix (`d29eb22b`) 가 summary endpoint 의 SQL `ROUND(SUM(...))::bigint` 만 처리
  - **list endpoint 의 amount 컬럼은 string "500000.00" 형식으로 소수점 잔존**
  - 응답 JSON 예: `"totalAmount":"500000.00", "itemExtraAmount":"0", "totalTaxAmount":"50000.00"`
- **원인**:
  - `server/charge/sales-bundle/infrastructure/sales-bundle-list.repository.ts` 의 SELECT 가 numeric(14,2) 컬럼을 string 으로 직렬화
  - EDGE-5025 fix 범위가 summary 만, list 미적용 — 정합성 가드 빈 곳
- **확인점 (Fix 방향)**:
  - list repository SELECT 의 6개 amount 컬럼 (`totalAmount, totalTaxAmount, itemExtraAmount, itemExtraAmountTax, bundleExtraAmount, bundleExtraAmountTax`) 모두 `ROUND(...)::bigint` 적용
  - 또는 application 단 mapper 에서 BigInt/Math.round 변환 통일
  - 회귀 가드: integration test — list response 의 모든 amount 컬럼이 정수 string (소수점 0건)

### 🟠 High

#### [EDGE-2026-05-15-SALE-03] summary/waiting summary schema 에 .strict() 미적용 (EDGE-2047 family 회귀 가드 빈 곳)

- **발견일**: 2026-05-15
- **심각도**: high (deprecated 필드 오타 silent skip — 신규 필드 추가 시 누락 검출 안 됨)
- **상태**: fixed (`b29a06da`) — 3 summary schema 에 .strict() 추가. settlement-summary.ts 의 getSalesBundleSummary/getPurchaseBundleSummary 가 list 공유 헬퍼(appendBundleFilter) 에서 부착하는 sortBy/sortOrder/dateType 를 송신 단에서 stripBundleListOnlyParams() 로 제거. 회귀 가드 unit test 4건.
- **재현**:
  1. `GET /api/charge/sales-bundles/summary?status=draft&unknownParam=test` → 200 정상 (unknown silent strip)
  2. `GET /api/charge/sales/waiting/summary?bogusField=x` → 200 동일
  3. EDGE-2047 fix 후 `sales-bundles/ids` 는 `.strict()` 적용되어 unknown → 400 거부 (비대칭)
- **원인**:
  - `app/api/charge/sales-bundles/summary/validation.ts:salesBundleSummaryQuerySchema` 에 `.strict()` 누락
  - `app/api/charge/sales/waiting/summary/validation.ts:getSalesWaitingSummaryQuerySchema` 도 동일 누락
- **확인점 (Fix 방향)**:
  - 두 schema 에 `.strict()` 추가 (EDGE-2047 패턴 복제)
  - 회귀 가드 unit test 4건 (sales-bundles summary + sales-waiting summary × 정상/unknown)

#### [EDGE-2026-05-15-SALE-04] 새로고침 버튼 debounce 없음 — 빠른 5회 클릭 → 5건 API 요청

- **발견일**: 2026-05-15
- **심각도**: high (운영 중 사용자 빠른 클릭 시 서버 부하 5배, 동시 DB 조회)
- **상태**: fixed (`380623b8`) — SettlementRefreshButton 에 useRef in-flight 가드 추가. disabled prop 의 React render 비동기 한계를 동기적 ref 검사로 우회. 회귀 가드 unit test: pending 상태에서 빠른 5회 클릭 → onRefresh 1회만 호출.
- **재현**:
  1. /broker/sale 진입
  2. 새로고침 버튼 (aria-label="새로고침") 빠르게 5번 클릭 (1-3ms 간격)
  3. Network 탭: `/api/charge/sales-bundles` 5건 요청 발사
  4. 두 번째 클릭부터 버튼 disabled 되지만 초기 5회 발사는 모두 통과 (event handler 큐 처리 전 disabled)
- **현상**:
  - throttle/debounce/isPending 가드 미적용
  - 28799005 (검색바에 새로고침 버튼 통합) 커밋 이후 회귀 가드 빈 곳
- **확인점 (Fix 방향)**:
  - useMutation isPending 으로 onClick disabled OR lodash `_.debounce(handler, 500)` 적용 OR React 18 `useTransition` + `isPending` 가드
  - 회귀 가드 E2E: 빠른 5회 클릭 후 network 요청 수 ≤ 1

#### [EDGE-2026-05-15-SALE-05] 매출 대기 PREPAID 필터 동작 불일치 — 16건이 0건으로 표시

- **발견일**: 2026-05-15
- **심각도**: high (사용자 "선착불만 보기" 필터 시 결과 0건 — 빈 화면)
- **상태**: fixed — 코드 변경 (`03066227`, BUG-A waiting 탭 default 기간 commit 에 SALE-05 파일이 우연 묶음): waiting-status-filter 도메인에 SETTLEMENT_TYPE_VALUES + isSettlementTypeValue 헬퍼 추가. sales-waiting.repository 의 status 필터 분기 — PREPAID/RECEIPT → orders.settlementType, 그 외 → orderDispatches.brokerFlowStatus. statusList 도 동일 분기 (혼합 시 OR 결합). 회귀 가드 unit test 5건.
- **재현**:
  1. `GET /api/charge/sales/waiting/summary` → `{totalCount: 1421, prepaidCount: 16}` (선착불 16건 존재)
  2. `GET /api/charge/sales/waiting/summary?status=PREPAID` → `{totalCount: 0, prepaidCount: 0}`
  3. `GET /api/charge/sales/waiting?status=PREPAID&page=1&pageSize=5` → `{data: [], total: 0}`
  4. 16건의 선착불 화물이 존재하는데 명시 status 필터로 0건
- **원인 (추정)**:
  - UI 의 "선착불" 필터 라벨과 API status 파라미터 enum 매칭 불일치
  - service 가 `status='PREPAID'` 입력을 `orders.settlementType='PREPAID'` 와 매칭 안 함
  - feature-impact-map.md 의 POL-01 정의 (`orders.settlementType = 'PREPAID'`) 가 service 단 일관 적용 안 됨
- **확인점 (Fix 방향)**:
  - POL-01 매핑을 `server/settlement/sales-waiting` service 에 일관 적용
  - 회귀 가드 unit test: `status=PREPAID` → 선착불 16건 응답
  - 매출 번들 `status` enum (draft/paid) 과 매출 대기 `status` enum (PREPAID/SHIPPER) 의 의미 차이 명문화

#### [EDGE-2026-05-15-SALE-06] 매출 대기 summary 응답에 prepaidAmount 부재 — 04273ce0 hotfix 비대칭

- **발견일**: 2026-05-15
- **심각도**: high (UI 패널이 "선착불 16건" 표기, 금액 미표시 — 사용자가 선착불 금액 합계 알 수 없음)
- **상태**: fixed (`d08f0b34`) — sales-waiting.repository.summarize() 에 prepaidAmount/shipperAmount SUM FILTER 추가 (effectiveAmountExpr 표현식 추출 + ROUND + COALESCE). SalesWaitingSummaryResponse DTO + services/settlement-summary.ts 의 SalesWaitingSummary client type 대칭 확장. UI 라벨 표시는 별도 라운드.
- **재현**:
  1. `GET /api/charge/sales/waiting/summary` 응답: `{totalCount, totalAmount, prepaidCount, shipperCount}` — **prepaidAmount 부재**
  2. `GET /api/charge/sales-bundles/summary?status=draft` 응답: `{prepaidAmount: 0, shipperAmount: 1879849943, ...}` — 모두 있음
- **현상**:
  - 04273ce0 hotfix (선착불 화물 부가세 누락 — 매출 대기 패널 합계 정합 회복) 가 `totalAmount` 만 회복, `prepaidAmount` API 필드 누락 잔존
  - UI 가 "선착불 16건" 만 표시, 금액 빈 칸
  - 매출 **대기** ↔ 매출 **번들** summary 응답 스키마 비대칭
- **확인점 (Fix 방향)**:
  - `server/settlement/sales-waiting` summary repository 에 `SUM(prepaidAmount)` 추가
  - response DTO 에 `prepaidAmount`, `shipperAmount` 추가 (sales-bundles summary 와 일관성)
  - UI 의 "선착불 16건" 옆에 금액 표시 (`16건 / 123,456,789원`)

### 🟡 Medium

#### [EDGE-2026-05-15-SALE-07] 존재하지 않는 bundle ID GET 시 500 응답 — graceful 404 미적용

- **발견일**: 2026-05-15
- **심각도**: medium (클라이언트 toast "서버 에러" 표시 + Sentry 5xx 알람 오발)
- **상태**: skip-already-fixed — 코드 분석 결과 이미 적용됨. SalesBundleDetailQueryService.getById 가 orElseThrow(found, new SalesBundleNotFoundError(id)) 호출. SalesBundleNotFoundError 는 httpStatus=404 명시. withErrorHandler 의 self-classifying 매핑이 자동 404 변환. QA 라운드의 500 응답은 SALE-10 (Turbopack 일시 이슈) 부산물로 추정.
- **재현**:
  1. 자기 broker scope UUID 형식이지만 존재하지 않는 ID: `GET /api/charge/sales-bundles/99999999-9999-9999-9999-999999999999`
  2. 응답: **500 (HTML 페이지)** — 기대: 404 (graceful not found)
  3. cross-broker bundle ID 시도도 동일 500 (격리는 정상이지만 응답 코드만 잘못)
- **현상**:
  - `SalesBundleDetailQueryService.getById` 가 not-found 시 도메인 NotFoundError throw 안 함
  - `withErrorHandler` 가 generic Error 를 500 으로 처리
- **확인점 (Fix 방향)**:
  - `getById` 가 결과 null/empty 시 `SalesBundleNotFoundError` throw
  - `withErrorHandler` 에서 도메인 NotFoundError → 404 매핑
  - 회귀 가드 integration test: 존재하지 않는 own-scope UUID → 404

#### [EDGE-2026-05-15-SALE-08] 매출 대기 리스트 통화 표기 정책 위반 — `₩` 접두사 + `원` 접미사 중복

- **발견일**: 2026-05-15
- **심각도**: medium (UI 표기 일관성 + knowledge `feature-impact-map.md` 정책 위반)
- **상태**: fixed (`0b9a5293`) — settlement-waiting-table.tsx 에 inline formatKRW 헬퍼 추가 (대사 테이블과 동일 패턴: `${Math.round(amount).toLocaleString("ko-KR")}원`). 청구비용 셀 2곳의 formatCurrency(...) + '원' → formatKRW(...) 치환. lib/utils.ts:formatCurrency import 제거. 회귀 가드 test: ₩ 부재 + '770,000원' 단언.
- **재현**:
  1. /broker/sale 대기 탭 화물 row 의 통화 셀: `₩770,000원 세금: ₩70,000원`
  2. knowledge 메모: "표기 단위: `500,000원` (콤마 + `원`). `₩` 접두사 금지. Intl.NumberFormat ko-KR currency 출력 (`₩500,000`) 과 `+ '원'` 합성이 만든 중복 패턴이 회귀 원인"
  3. 매출 **대사/완료** 리스트는 정책 적용 (예: `500,000원`)
- **현상**:
  - 매출 **대기** 리스트만 옛 표기 잔존 — 비대칭 회귀
  - `components/broker/sale/settlement-waiting-table.tsx` 의 통화 셀 inline 헬퍼가 `Intl.NumberFormat` style currency 와 `+ '원'` 동시 적용
- **확인점 (Fix 방향)**:
  - 대기 리스트 통화 셀 헬퍼를 매칭 리스트 (대사/완료) 와 통일
  - `Intl.NumberFormat('ko-KR').format(value) + '원'` (currency style 제거)
  - 회귀 가드 unit test: 대기 row 통화 텍스트가 `/^[0-9,]+원( 세금: [0-9,]+원)?$/` 패턴 (₩ 접두사 0건)

#### [EDGE-2026-05-15-SALE-09] 0원 정산 번들 정상 노출 — 정책 결정 필요

- **발견일**: 2026-05-15
- **심각도**: medium (운영 흐름 의도성 불명, 0원 번들 무한 잔류 가능)
- **상태**: partial-fixed-deferred — 진입 차단은 사용자 별도 commit `94d4a655` (fix(settlement): 0원/선착불 화물 정산 진입 가드 + 안내 토스트) 에 적용됨. filterZeroAmountItems 헬퍼 + validateMultiSettlementItems.zeroAmountExcluded + 안내 토스트. 향후 0원 번들 생성 차단. **잔존 데이터** (이미 생성된 0원 번들, 예: (주)대운로직스 4건/3건) 의 정리는 별도 backfill 라운드 — UI badge / 자동 closed 처리 / 운영 보고 분리 중 하나 결정 필요.
- **재현**:
  1. /broker/sale 대사(진행중) 탭에 운임 0원 + 면세 + 총 청구금액 0원 번들 존재
  2. 예: (주)대운로직스 — 4건/3건의 화물 모두 0원 = 정산 0원, 미발행 상태
  3. 페이지 1/10 에 여러 0원 번들 노출
- **현상**:
  - 영원 정산이 의도된 케이스인지 (사은품/보너스/협업), 데이터 결함인지 불분명
  - 미발행 상태로 무한 잔류 — 운영 보고에서 노이즈
- **확인점 (Fix 방향 — 정책 결정 필요)**:
  - 옵션 A: 0원 번들 생성 차단 (validation 추가)
  - 옵션 B: 0원 번들 별도 표시 (운영 보고에서 분리, "0원 정산" 별도 집계)
  - 옵션 C: 0원 번들 자동 closed 처리
  - 결정 후 회귀 가드 추가

### 🟢 Low

#### [EDGE-2026-05-15-SALE-10] list endpoint 간헐적 404 — Turbopack 일시 이슈 가능성

- **발견일**: 2026-05-15
- **심각도**: low (dev 환경 한정 가능성, 운영 환경 재현 미확인)
- **상태**: wontfix-dev-only — dev 서버 Turbopack 자식 프로세스 크래시 (`Failed to write app endpoint`) 로 추정. 운영 build 재현 미확인. Next.js 15.3.6 → 15.4.1+ 업그레이드는 dependency 광범위 영향이라 별도 PR. dev 발생 시 npm run dev 재기동으로 회복.
- **재현 (간헐적)**:
  1. `GET /api/charge/sales-bundles?page=1&pageSize=10&status=draft` → 404 (HTML)
  2. 같은 session 에서 페이지 데이터는 정상 표시, fetch 만 404
  3. 실제 route.ts 파일 정상 존재 (`app/api/charge/sales-bundles/route.ts` GET handler)
  4. 클라이언트 콘솔: "매출 번들 목록 조회 중 오류 발생: Error: 매출 번들 목록 조회에 실패했습니다"
- **현상**:
  - Next.js 15.3.6 + Turbopack 컴파일 일시 이슈로 추정
  - `[@sentry/nextjs] WARNING: ... Next.js version 15.4.1 or later` 메시지 동반
  - 운영 (build) 환경 재현 미확인
- **확인점**:
  - Turbopack 15.3.6 → 15.4.1+ 업그레이드 검토 (Sentry warning 해소 + 안정성 향상)
  - 운영 환경 5xx/4xx 모니터링에 매출 번들 list 알람 추가
  - 발생 시 dev 서버 재시작으로 회복

---

### QA 세션 2026-05-15 (FB-QA Staff — 차주관리 sweep, `6xxx` prefix, R1+R2)

> R1: 등록·편집·통계·동시성. R2: 검색·필터·뷰·페이지네이션·차주 액션·인근 페이지(매입정산/order-list).
> EDGE-023 / 359547e5 / c8448e1d / 4a508366 / e0877d29 / 611c2a2a 회귀 모두 PASS. 신규 10건 발견 (EDGE-6001~6010).
> 회귀 PASS: EDGE-023 (companyName/cargoBox/notes 5계층 저장), 359547e5 (시트 닫고 재오픈 후 notes 보존, hasEmptyState=false), c8448e1d (notes seed 별도 fetch), 4a508366 (note edit 즉시 저장 + 서버 updatedAt 갱신), e0877d29 (등록 후 list 자동 반영, queryKey prefix 통일), 611c2a2a (assign-driver withTenant 적용, dispatch 응답 200).
> R2 PASS 추가: 페이지네이션 다음 버튼 이동, 카드↔테이블 뷰 토글, 톤수 chip 필터 적용 시 통계 카드 갱신, SQL injection escape (drizzle).

#### [EDGE-6001] 톤수별 차주 분포 / 활성·비활성 통계가 현재 페이지 N=10 기반 — 운영 의사결정 오도 (CRITICAL)

- **발견일**: 2026-05-15
- **심각도**: critical (사용자 의사결정 오도, 차종 구성 분석 왜곡)
- **상태**: open
- **재현**:
  1. /broker/driver/list 진입 (총 1972명, pageSize=10)
  2. "톤수별 차주 분포" 카드 관찰
  3. API 직접 조회 `GET /api/drivers?vehicleWeight=25톤&page=1&pageSize=1` 으로 실제 카운트 확인
- **현상**:
  - 화면: 0.3톤 1명 (0%), 0.5톤 1명 (0%), 1.4톤 1명 (0%), 5톤 1명 (0%), 25톤 6명 (0%) — 합 10명 = 현재 페이지 데이터
  - 실제: 25톤 623명(31.6%), 1톤 270명(13.7%), 5톤 110명(5.6%), 0.5톤 25명 등
  - 1톤 270명은 현재 페이지에 없어서 chart 자체에서 누락 (`count > 0` filter)
  - 활성/비활성도 동일 패턴 — 현재 페이지 active 비율 × totalItems 추정 (이번엔 우연히 inactive=0 일치)
- **원인**: `app/broker/driver/list/page.tsx:181-220`
  - `calculateTonnageStats()` 가 `allDrivers = data.data` (현재 페이지 N=10) 로 카운트하고 `total = totalItems` (1972) 로 percentage 계산
  - `calculateStatusStats()` 도 동일 — `pageActive / pageTotal × total` 추정
- **확인점 (Fix 방향)**:
  - 옵션 A (권장): 통계 별도 API `/api/drivers/stats` 신설 — DB 단에서 GROUP BY vehicle_weight + is_active 집계
  - 옵션 B: 페이지 N 기반 통계 카드 제거 (오해 소지 차단)
  - 옵션 C: 통계 카드 데이터는 `pageSize=200` 정도로 별도 fetch (정확도 ≈ 100%)
  - 회귀 가드: E2E — `data.total > pageSize` 일 때 tonnage percentages 합이 90% 이상이거나, 가장 많은 톤수 percentage > 10%

#### [EDGE-6002] 동일 vehicleNumber/phoneNumber 차주 동시 등록 race condition — 마스터데이터 무결성 깨짐 (CRITICAL)

- **발견일**: 2026-05-15
- **심각도**: critical (운영 마스터데이터 — 차량 1대당 차주 1명 가정 위배 → 배차 ambiguous)
- **상태**: open
- **재현**:
  1. `POST /api/drivers` 두 번 병렬:
     ```json
     { "name":"A","phoneNumber":"010-9999-7777","vehicleNumber":"99공-7777",
       "vehicleType":"카고","vehicleWeight":"5톤","companyType":"개인","isActive":true }
     { "name":"B","phoneNumber":"010-9999-7777","vehicleNumber":"99공-7777", ... }
     ```
  2. 두 응답 모두 200 — 다른 driverId 로 동일 vehicleNumber 차주 row 2개 INSERT
- **현상**:
  - drivers 테이블에 unique constraint (vehicle_number, phone_number) 없음
  - service 단 사전 `findByVehicleNumber` 검증 없음
  - UI 폼에서 더블클릭/네트워크 재시도 시 같은 결과 (중복 등록)
- **임팩트**:
  - 같은 차량을 2명의 차주가 운행하는 잘못된 마스터데이터
  - 이후 배차 시 차량번호로 매칭하는 흐름(예: 화물맨 연동 inbound dispatch-request)에서 차주 disambiguation 불가 — EDGE-5060 family 와 같은 운영 카오스 표면
  - 동명이인 disambiguation (b839b971) 가 fix 됐지만, 같은 차량의 동명이인은 여전히 회귀 잠재
- **확인점 (Fix 방향)**:
  - DB: `CREATE UNIQUE INDEX drivers_broker_vehicle_active_uniq ON drivers (broker_id, vehicle_number) WHERE is_active = true`
  - service: `DriverCommandService.createDriver` 에서 사전 `DriverRepository.findByVehicleNumber(broker, vehicle_number)` 가드 + 도메인 에러 `DriverAlreadyExistsError`
  - integration test: 병렬 `Promise.all([POST, POST])` 한쪽 4xx 단언

#### [EDGE-6003] 톤수 select UI 옵션 "기타" — zod enum 누락 → 등록 silent 400 (HIGH)

- **발견일**: 2026-05-15
- **심각도**: high (운영자 혼란, 등록 차단 + 원인 불명 토스트)
- **상태**: open
- **재현**:
  1. /broker/driver/list → "차주 등록" → 톤수 select 열기 → "기타" 선택
  2. 다른 필수 필드 채우고 등록
  3. 응답: 400 `"Invalid enum value. Expected '0.3톤'|...|'25톤', received '기타'"`
  4. 사용자에게 표시되는 토스트: `"차주 등록에 실패했습니다."` (어느 필드 문제인지 모름)
- **mismatch**:
  - UI options: 12종 + **"기타"** (13) — `components/broker/driver/forms/broker-driver-vehicle-info-form.tsx` 추정
  - zod enum (`app/api/drivers/validation.ts:22, 58`): 12종 (0.3톤, 0.5톤, 1톤, 1.4톤, 2.5톤, 3.5톤, 5톤, 5톤축, 11톤, 14톤, 18톤, 25톤). "기타" 없음
- **확인점 (Fix 방향)**:
  - 정책 A (권장): "기타" 정식 지원 — zod enum에 추가 + DB 컬럼 enum 확장 + driverColumns/mapper 모두 5계층 정합 점검 (EDGE-023 패턴)
  - 정책 B: UI 에서 "기타" 옵션 제거 — TONNAGE_TYPES (types/driver/broker-driver.ts) 와 zod enum 의 single source of truth 정합
  - 회귀 가드: `app/api/drivers/__tests__/validation.test.ts` 에 `TONNAGE_TYPES === CreateDriverSchema.shape.vehicleWeight.options` 단언 추가 (EDGE-023 패턴 재사용)

#### [EDGE-6004] 계좌번호 빈 문자열 → 400 silent UX (frontend mapper `|| ""` 패턴, EDGE-025 미적용 잔존)

- **발견일**: 2026-05-15
- **심각도**: high (정상 흐름인 "은행 정보 미입력" 케이스에서 등록 항상 실패)
- **상태**: open
- **재현**:
  1. 차주 등록 시트 → 모든 필수만 채우고 계좌번호 비움 → 등록
  2. 응답: 400 `"올바른 계좌번호 형식이 아닙니다."` (zod `min(10)`)
- **원인**: `components/broker/driver/broker-driver-register-form.tsx:117`
  ```ts
  bankAccountNumber: data.bankAccountNumber || "",  // 빈 문자열 전송
  ```
  - zod `z.string().min(10).optional()` 은 `string('')` 일 때 min(10) 발동 → optional 분기 진입 못함
  - 동일 패턴: `bankAccountHolder`, `bankCode`, `cargoBoxType`, `cargoBoxLength`, `businessNumber`, `companyName`, `manufactureYear`
- **임팩트**:
  - 차주가 은행 정보 없는 차주 등록 시 100% 실패
  - EDGE-025 (`mapSettlementFormToPurchaseBundleInput`) 가 `|| undefined` 정규화로 해결한 패턴이 driver-form mapper 에는 미적용. **같은 family 다른 location**.
- **확인점 (Fix 방향)**:
  - `data.bankAccountNumber || undefined` (다른 optional 필드도 동일)
  - 또는 server zod 가 빈 문자열을 undefined 로 transform: `.transform(v => v === '' ? undefined : v)`
  - integration test: `POST /api/drivers` body 에 `bankAccountNumber: ''` → 200

#### [EDGE-6005] 계좌번호 dash 자동 정규화 이상 — 사용자 입력 형식 임의 변경 (MEDIUM)

- **발견일**: 2026-05-15
- **심각도**: medium (운영자 혼란, 통장 사본과 표시 불일치)
- **상태**: open
- **재현**:
  1. 차주 등록 시 계좌번호 `"123-4567-8901"` 입력 → 등록
  2. `GET /api/drivers/{id}` 응답: `"bankAccountNumber":"123456-7890-1"` (dash 위치 변경)
- **원인**: BankCodeUtils/format mapper 가 dash 제거 후 임의 mask 패턴으로 재삽입 추정 (예: `00000-0000-0` mask 강제)
- **임팩트**: 사용자가 통장 사본 그대로 입력해도 표시 형식이 변경됨 → 송금 시 통장과 불일치 의심
- **확인점 (Fix 방향)**:
  - 옵션 A: 입력 그대로 보존 (자유 텍스트) — 정합성은 사용자 책임
  - 옵션 B: 표준 정규화 — 모든 dash 제거 후 raw 숫자만 저장 + 표시 시 별도 mask
  - 둘 중 하나로 통일. 회귀 가드 unit test 추가.

#### [EDGE-6006] 톤수 chip toggle 미동작 — 같은 chip 재클릭 시 필터 해제 안 됨 (MEDIUM)

- **발견일**: 2026-05-15 (R2)
- **심각도**: medium (UX 일관성)
- **상태**: open
- **재현**:
  1. /broker/driver/list → 통계 카드의 "25톤" chip 클릭 → 623명 필터 적용
  2. 같은 "25톤" chip 재클릭
  3. 결과: 여전히 623명 (필터 해제 안 됨)
- **원인**: `app/broker/driver/list/page.tsx:245-254` `handleTonnageFilter(tonnage)` toggle 분기 없음. `null` 명시 전달 시만 reset.
- **확인점 (Fix 방향)**: `handleTonnageFilter(filter.tonnage === tonnage ? null : tonnage)` toggle 분기 추가.

#### [EDGE-6007] 차주 액션 4종(삭제/비활성화/배차이력/정산내역) `alert()` placeholder — 미구현 (CRITICAL)

- **발견일**: 2026-05-15 (R2)
- **심각도**: critical (비즈니스 핵심 액션 무동작 — 운영자가 의도한 작업이 실행되지 않음)
- **상태**: open
- **재현**:
  1. /broker/driver/list → 카드 뷰 전환 → 차주 카드 우클릭 → 메뉴 "차주 삭제" 클릭
  2. alert 대화상자 ("XX 차주를 삭제하시겠습니까?") OK
  3. 실제 차주는 그대로 — useDeleteDriver mutation 호출 없음
- **원인**: `components/broker/driver/broker-driver-card.tsx:67-70`
  ```ts
  onDelete={() => alert(`${driver.name} 차주를 삭제하시겠습니까?`)}
  onStatusChange={(d, newStatus) => alert(`${d.name} 차주 상태를 ${newStatus}로 변경하시겠습니까?`)}
  onViewDispatch={() => alert(`${driver.name} 차주의 배차 이력을 조회합니다.`)}
  onViewSettlement={() => alert(`${driver.name} 차주의 정산 내역을 조회합니다.`)}
  ```
- **임팩트**: 운영자가 차주 비활성/삭제 의도 시 "삭제됐다 생각하는데 안 됨" 운영 카오스. EDGE-5060 (broker scope isReferencedInDispatch) 가드도 실제 호출되지 않아 무용지물.
- **확인점 (Fix 방향)**:
  - onDelete → useDeleteDriver mutation 연결 + AlertDialog (confirm) + EDGE-5060 가드 토스트
  - onStatusChange → updateDriverFields mutation (`fields: { isActive }`)
  - onViewDispatch → router.push(`/broker/order/list?assignedDriverId=${id}`)
  - onViewSettlement → router.push(`/broker/purchase?driverId=${id}`)
  - E2E: 차주 삭제 → list 에서 제거 단언

#### [EDGE-6008] 테이블 뷰에 ContextMenu 미적용 — 액션 진입 비대칭 (HIGH)

- **발견일**: 2026-05-15 (R2)
- **심각도**: high (기본 테이블 뷰 사용자는 액션 진입 불가)
- **상태**: open
- **재현**:
  1. /broker/driver/list (기본 테이블 뷰) → 차주 행 우클릭
  2. 일반 브라우저 메뉴만 표시 (앱 ContextMenu 없음)
  3. 카드 뷰 토글 → 우클릭 → 액션 5종 메뉴 표시 (단, EDGE-6007 로 동작 안 함)
- **원인**: `components/broker/driver/broker-driver-table.tsx` 의 row 에 `BrokerDriverContextMenu` wrap 없음. card 뷰만 wrap.
- **확인점 (Fix 방향)**: table row 도 ContextMenu wrap 적용 (EDGE-6007 fix 이후 의미 있음).

#### [EDGE-6009] ILIKE wildcard `%`/`_` 미escape — 의도치 않은 전체 노출 (CRITICAL)

- **발견일**: 2026-05-15 (R2)
- **심각도**: critical (운영자 검색 의도 왜곡, 통계/엑셀 부풀림)
- **상태**: open
- **재현**:
  ```
  GET /api/drivers?searchTerm=%&pageSize=2  → total=1972 (전체)
  GET /api/drivers?searchTerm=_&pageSize=2  → total=1972 (전체)
  GET /api/drivers?searchTerm=' OR 1=1 --   → total=0   (SQL inj 차단 정상)
  ```
- **원인**: driver query repository ILIKE 비교 시 사용자 입력 `%`/`_` escape 누락. 직접 PG wildcard 로 해석됨.
- **임팩트**:
  - 사용자가 무의미한 패턴 입력 시 전체 차주(1972명) 노출 → 의도와 다른 검색 결과
  - 엑셀 다운로드 시 전체 노출. 통계 카드도 전체로 계산.
  - SQL injection 은 아님 (drizzle escape 정상). 단지 wildcard 처리 미흡.
- **확인점 (Fix 방향)**:
  - repository 단 `escapeIlike(input)` 헬퍼 (`replace(/[%_\\]/g, '\\$&')`) 후 ILIKE
  - 또는 `searchTerm.replaceAll(/[%_]/g, m => '\\' + m)`
  - integration test: `%` → 0건 (or 의미 있는 부분 매칭만), `_` → 0건

#### [EDGE-6010] 검색어 trim 미적용 — leading/trailing 공백 사용자 의도 보호 누락 (LOW)

- **발견일**: 2026-05-15 (R2)
- **심각도**: low (UX)
- **상태**: open
- **재현**: `GET /api/drivers?searchTerm=` + `encodeURIComponent('  김  ')` → total=0 (실제 김씨 433명)
- **원인**: BrokerDriverSearch 또는 page.tsx 의 filter.searchTerm 송신부 trim 누락
- **임팩트**: 사용자가 복사·붙여넣기로 검색 시 끝 공백 때문에 의도와 다른 빈 결과
- **확인점 (Fix 방향)**: searchTerm `value.trim()` 적용 + integration test (`"  김  "` → >0건)

#### [EDGE-COPY-CHARGE-AGGREGATION] 화물 복사/수정 시 첫 base_freight 그룹만 읽어 화면 청구금과 불일치 (HIGH, FIXED)

- **발견일**: 2026-05-21
- **심각도**: high (정산 금액 신뢰성)
- **상태**: fixed (2026-05-21, `utils/orders/copy-charge.ts` 의 `sumBaseFreightSalesAmount` 도입)
- **재현**:
  1. base_freight 그룹이 여러 개 누적된 화물 (예: 운임 수정으로 보정 라인이 별도 그룹으로 INSERT 된 경우)
  2. `/broker/order/register?copyFrom=<orderId>` 또는 `?editFrom=<orderId>` 진입
  3. 폼의 "청구 기본" 입력값과 동 화물의 화면 청구 총액 비교
- **현상**: `charge.groups.find(g.reason==='base_freight').salesAmount` 만 사용 → 첫 그룹의 보정 전 원본 금액이 채워져 화면 청구 총액과 어긋남 (실제 케이스: 첫 그룹 564,300 vs 총합 356,400)
- **원인**: 운임 수정/추가가 매번 새 `base_freight` 그룹과 (음수 가능) 라인을 INSERT 하는 구조인데, 복사 폼은 첫 그룹만 추출
- **확인점**: 모든 `base_freight` 그룹의 sales 라인 합 = 화면 청구 총액과 일치 (회귀 검증: 단일 그룹 화물도 동일 금액 유지)
- **참조**: `app/broker/order/register/page.tsx`, `app/broker/order/ai-register/page.tsx`, `utils/orders/__tests__/copy-charge.test.ts`

---

새 엣지케이스 발견 시 아래 템플릿 사용:

```markdown
#### [EDGE-XXX] 제목

- **발견일**: YYYY-MM-DD
- **심각도**: critical | high | medium | low
- **상태**: open
- **재현**:
  1. 단계 1
  2. 단계 2
- **현상**: 관찰된 동작
- **확인점**: 기대 동작
```
