# G-UI R3 목록 검색 Fidelity 보고서

- 기준: `nb-main/src/pages/Dispatches.tsx:1962-1964,2022-2030,2790-2804,4961-4995`
- target: `app/test/broker-order-console-new/_components/dispatch-list-pane.tsx`
- 판정: 검색 계약 일치, 사용자 시각 재검수 대기

| 계약 | Reference | Prototype | 판정 |
|---|---|---|---|
| 배치 | 상태 filter 우측 action group | 동일 위치 | 일치 |
| 입력 | `검색어...`, 130px, 0.82rem | 130px, 13.12px | 일치 |
| 적용 | 검색 click·Enter | 동일 | 일치 |
| 대상 | 화주·상하차·차량·차주·번호 | 6-field null-safe 검색 | 일치 |
| facet | 검색 결과 기준 상태 count | 동일 | 일치 |
| 초기화 | 검색·상태 전체 원복 | 동일 | 일치 |
| secondary | `#e5e8eb`, primary text | computed style 동일 | 일치 |
| outline | primary 1.5px | computed style 동일 | 일치 |

## 남은 차이와 처리

1. `/api/auth/refresh` 401은 prototype 외부의 기존 전역 인증 동작이다. R3 범위에서 수정하지 않는다.
2. 넓이가 좁으면 status rail에 가로 스크롤이 생긴다. reference의 dense desktop 방향과 일치하며, 변경 여부는 별도 디자인 HTML의 DD-01/03 승인 후 결정한다.
3. 디자인 디테일 DD-01~12는 제안일 뿐 현재 fidelity 기준선에 반영하지 않았다.

현재 R3 검색에 critical/high visual gap은 없다. 최종 closeout은 사용자 G-UI 판정 이후다.
