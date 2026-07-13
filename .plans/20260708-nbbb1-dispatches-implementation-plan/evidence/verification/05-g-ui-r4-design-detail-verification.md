# G-UI R4 디자인 디테일 전체 적용 검증

- 검증일: 2026-07-13
- target: `/test/broker-order-console-new`
- source: `design-proposals/g-ui-design-detail-before-after.html` DD-01~12 After
- 판정: PASS

## TDD·자동 검증

| 항목 | 결과 |
|---|---|
| 최초 Red | 4 files / 29 tests 중 5 FAIL |
| 보강 Red | CSS 1 FAIL / 8 PASS |
| focused Green | 5 files / 38 tests PASS |
| 신규 route 전체 | 11 files / 46 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS, route 14.9 kB / first load 201 kB |
| diff check | PASS |

## 브라우저 동작 검증

| 상태 | 관찰 결과 | 판정 |
|---|---|---|
| 날짜 직접선택 | `aria-pressed=true`, 시작일·종료일 각 1개 | PASS |
| no-result | 검색어 포함 원인·안내·필터 초기화 표시 | PASS |
| no-result 복구 | 검색 공백·날짜 전체·상태 전체·4행 복원 | PASS |
| 상세 수정 | 310,000 변경 후 `수정 완료`, disabled | PASS |
| 상세 feedback | `role=status`, `저장 안 됨` | PASS |
| focus-visible | primary border + 3px soft ring | PASS |
| disabled | opacity 0.42 + cursor not-allowed | PASS |
| selected row | primary rail + `#f6faff` + shadow | PASS |
| scroll | sticky header + 28px edge fade | PASS |

## Responsive 검증

| 유효 viewport | 결과 | document overflow |
|---|---|---|
| 1600 | full 40/60 | 0 |
| 1440 | compact spacing | 0 |
| 1280 | right pane 내부 column scroll 725/792 | 0 |
| 766 | 1-column, pane width 동일, table 내부 scroll | 0 |

## Scope

- 변경: `app/test/broker-order-console-new/**` 6개 파일
- 미변경: `app/test/broker-order-console/**`
- 미변경: backend/service/API/localStorage/package/config
- 사용자 WIP 3개 파일 보존

## 기존 경고

- Vitest `environmentMatchGlobs` deprecation은 기존 설정이다.
- production build의 Sentry/LMS warning은 기존 전역 설정이며 exit code는 0이다.
- R4 브라우저 console은 error 0 / warn 0이었다.
