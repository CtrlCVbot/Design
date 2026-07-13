# G-UI R3 목록 검색 검증

- 검증일: 2026-07-13
- target: `/test/broker-order-console-new`
- 판정: PASS

## 자동 검증

| 항목 | 결과 |
|---|---|
| 검색·CSS focused test | 2 files / 16 tests PASS |
| 신규 route 전체 test | 11 files / 43 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS, static route 14.5 kB / first load 200 kB |
| forbidden dependency scan | backend/service/API/localStorage 신규 참조 0건 |
| legacy route | tracked 변경 0건 |

## 브라우저 검증

| 시나리오 | 관찰 결과 | 판정 |
|---|---|---|
| 입력만 `나래` | 가온·나래 행 모두 유지 | PASS |
| 검색 click | 나래물산 1행, 전체 (1), 배차완료 (1) | PASS |
| 초기화 | 입력 공백, 전체 상태, 4행 복원 | PASS |
| `경기 안산` + Enter | 다솜유통 1행 | PASS |
| control count | region/input/search/reset 각 1개 | PASS |

computed style은 input `130px`, radius `12px`, font `13.12px`; 검색 버튼 background `rgb(229, 232, 235)`; 초기화 버튼 border `1.5px rgb(49, 130, 246)`로 reference 계약과 일치했다.

브라우저 console의 `/api/auth/refresh` 401 한 건은 앱 전역 인증 refresh에서 발생하며 prototype 검색 동작에는 영향을 주지 않았다. R3는 API를 호출하거나 인증 코드를 변경하지 않았다.

## 범위 확인

- 변경: `app/test/broker-order-console-new/**` 4개 파일
- 미변경: `app/test/broker-order-console/**`
- 미변경: backend, service, API, package, config
- 사용자 WIP 3개 파일 보존

## 증거

- `../screenshots/g-ui-r3-dispatch-search.png`
- `../../20-g-ui-revision-3-search-fidelity-contract.md`
