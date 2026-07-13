# G-UI Revision 2 Inline Detail 검증 보고서

- 검증일: 2026-07-10
- branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- base HEAD: `744327f5`
- target: `/test/broker-order-console-new`
- gate: `G-UI revise-ready (R2)`
- reference: `nb-main/src/pages/Dispatches.tsx:5119-5864`, `src/index.css:218-230,564-595`

## 결론

R2 계약의 구조·필드·token·route-local interaction은 모두 구현·검증됐다. 코드·테스트·build·DOM/computed style은 PASS다. 사용자의 최종 시각 판정이 남아 있어 fidelity verdict는 `LIMITED — automated fidelity PASS, user visual gate pending`으로 유지한다.

## TDD 증거

| 단계 | 결과 |
|---|---|
| 초기 R2 Red | 2 files / 9 tests 중 8 FAIL |
| AI advisor 3단계 Red | 2 files / 12 tests 중 4 FAIL |
| CSS exact-token repair Red | 6 tests 중 3 FAIL, 추가 색상 1 FAIL |
| 최종 focused | 2 files / 15 tests PASS |
| 최종 new route | 11 files / 34 tests PASS |

## 회귀·빌드

| 검증 | 결과 |
|---|---|
| legacy + new combined | 57 files / 465 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS |
| 신규 route | static, 14.2 kB / First Load 200 kB |
| forbidden dependency | `localStorage`, network/API, cast 0건 |
| project rules guard | synthetic 4-file patch `ALLOW`, exit 0 |
| legacy route status | 변경 0건 |
| staged files | 0건 |

기존 legacy test의 API mock·React `act(...)` warning, production build의 Sentry/LMS warning은 이번 변경에서 발생한 실패가 아니다.

## 브라우저 DOM·Computed Style

- viewport: 1422×800
- detail: 722px, `scrollWidth=clientWidth`, overflow 없음
- grid: 약 364px / 298px, 55/45
- grid/detail gap: 20px (`1.25rem`)
- animation: `slideDown`, 0.3s
- route badge: 11.52px (`0.72rem`), radius 4px
- fee/commission: 13.12px (`0.82rem`)
- status: 11.84px (`0.74rem`)
- quick adjustment: increase red, decrease blue
- advisor: 상태별 rgba background + colored left rail

## 브라우저 Interaction

- `배차중` 상세에서 AI advisor와 3개 분석 지표 노출
- `+1만`: 운임 `300,000 → 310,000`, 수정 버튼 enabled
- 차량번호 local edit: `경기99바2026` 반영
- `배차대기` 활성 상태 재클릭: `배차완료`로 변경, 목록 badge 동기화, advisor 숨김
- 인수증 상세: 수수료 input·`수` toggle disabled
- console: 기존 Sentry warning 1건, 신규 component error 0건

## 범위

- 변경: `broker-order-console-new` inline detail/CSS/test
- 무변경: `broker-order-console`, backend, service, API, package/config/lockfile
- commit/push/PR: 수행하지 않음
