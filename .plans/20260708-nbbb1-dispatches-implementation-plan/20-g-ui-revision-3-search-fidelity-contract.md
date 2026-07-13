# G-UI Revision 3 — 목록 검색 복원 계약

- 작성일: 2026-07-13
- target: `/test/broker-order-console-new`
- implementation target: `app/test/broker-order-console-new/_components/dispatch-list-pane.tsx`
- reference: `nb-main/src/pages/Dispatches.tsx:1962-1964,2022-2030,2790-2804,4961-4995`
- gate: `G-UI revise-ready (R3)`

## 사용자 요청

운행 내역에서 삭제된 검색어 입력창과 초기화 버튼을 reference code 기준으로 복원한다.

## Reference 계약

| 항목 | Reference | R3 target |
|---|---|---|
| 위치 | 배차 상태 필터 오른쪽 | 동일 |
| 입력 | `검색어...`, width 130px, 0.82rem | 동일 |
| 검색 | secondary button + Search icon | 동일 |
| 초기화 | outline button | 동일 |
| 적용 | 검색 click 또는 Enter | 동일 |
| 대상 | 거래처, 상차지, 하차지, 차량스펙, 차주명, 차량번호 | 동일 |
| 초기화 | 입력·적용 검색어·상태 필터 `전체` | 동일 |
| 결과 없음 | 조건에 맞는 목록 없음 안내 | 검색/상태 empty state 구분 |
| 저장/API | 없음 | route-local state only |

## TDD Acceptance Criteria

- [x] 검색어 입력과 `검색`, `초기화` 버튼이 상태 필터 오른쪽에 표시된다.
- [x] 검색 버튼과 Enter가 동일한 검색을 적용한다.
- [x] 거래처·상하차지·차량스펙·차주명·차량번호를 대소문자 구분 없이 검색한다.
- [x] 검색 적용 전 입력만 한 상태에서는 목록을 바꾸지 않는다.
- [x] 검색 적용 후 상태별 count가 검색 결과 기준으로 계산된다.
- [x] 초기화가 입력·검색 결과·상태 필터를 원복한다.
- [x] 검색 결과 없음과 상태 결과 없음 문구를 구분한다.
- [x] 기존 상세 확장·차주 배정·상태 변경 flow가 회귀하지 않는다.
- [x] backend/service/API/localStorage를 사용하지 않는다.

## 별도 디자인 제안

전반적인 디자인 디테일 개선안은 Markdown에 포함하지 않는다. 사용자 요청대로 아래 standalone HTML에만 작성하며 실제 앱에는 승인 전 적용하지 않는다.

- `design-proposals/g-ui-design-detail-before-after.html`

## R3 검증 결과

| 검증 | 결과 |
|---|---|
| focused test | 2 files / 16 tests PASS |
| 신규 route 전체 | 11 files / 43 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS, route 14.5 kB |
| browser 동작 | 지연 적용·검색 click·Enter·초기화·facet count PASS |
| computed style | input 130px/12px/13.12px, outline 1.5px PASS |
| scope | legacy/backend/service/API/config 변경 0건 |

- verification: `evidence/verification/04-g-ui-r3-search-verification.md`
- fidelity: `evidence/visual-gap/04-g-ui-r3-search-fidelity-report.md`
- screenshot: `evidence/screenshots/g-ui-r3-dispatch-search.png`
